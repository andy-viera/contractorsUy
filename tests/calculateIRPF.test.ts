import { describe, it, expect, vi } from "vitest";
import { calculateIRPF } from "../src/lib/utils";
import { BPC, MINIMUM_WAGE } from "../src/lib/constants";

vi.mock("../src/lib/constants", () => ({
  BPC: 6576.0,
  IRPF_BRACKETS: [
    { from: 0, to: 7, rate: 0 },
    { from: 7, to: 10, rate: 0.1 },
    { from: 10, to: 15, rate: 0.15 },
    { from: 15, to: 30, rate: 0.24 },
    { from: 30, to: 50, rate: 0.25 },
    { from: 50, to: 75, rate: 0.27 },
    { from: 75, to: 115, rate: 0.31 },
    { from: 115, to: 0, rate: 0.36 },
  ],
  TAXABLE_INCOME_INCREASE: 0.06,
  DEDUCTIONS_RATE_UNDER_15BPC: 0.14,
  DEDUCTIONS_RATE_OVER_15BPC: 0.08,
  CHILD_DEDUCTION: (20 * 6576.0) / 12,
  DISABLED_CHILD_DEDUCTION: (40 * 6576.0) / 12,
  ADDITIONAL_SOLIDARITY_FUND: ((5 / 4) * 6576.0) / 12,
  MINIMUM_WAGE: 23604.0,
}));

describe("calculateIRPF", () => {
  it("calculates IRPF for a high salary (80000) with no deductions", () => {
    const input = {
      nominalSalary: 80000,
      retirementContributions: 0,
      fonasaContributions: 0,
      frlContribution: 0,
      dependentsDeductionFactor: 0,
      nonDisabledChildrenCount: 0,
      disabledChildrenCount: 0,
      solidarityFundContributions: 0,
      additionalSolidarityFund: false,
      professionalFundContributions: 0,
      otherDeductions: 0,
    };

    /* Calculation walkthrough:
       - BPC = 6576 → salaryInBPC = 80000/6576 ≈ 12.16 (so >10 but <15)
       - Since salaryInBPC > 10, nominalSalary increases by 6%:
             80000 * 1.06 = 84800.
       - Deductions rate = DEDUCTIONS_RATE_UNDER_15BPC = 0.14.
       - IRPF_BRACKETS:
         • Bracket 1 (0 to 7): Upper bound = 7*6576 = 46032 → Tax = (min(46032,84800)-0)*0 = 0.
         • Bracket 2 (7 to 10): Lower bound = 46032, upper bound = 10*6576 = 65760 →
               Tax = (min(65760,84800)-46032) * 0.1 = (65760-46032)*0.1 = 19728*0.1 = 1972.8.
         • Bracket 3 (10 to 15): Lower bound = 65760, upper bound = 15*6576 = 98640 →
               Tax = (min(98640,84800)-65760) * 0.15 = (84800-65760)*0.15 = 19040*0.15 = 2856.
         • Remaining brackets: 84800 is below their lower bounds → tax = 0.
       - Total tax = 1972.8 + 2856 = 4828.8.
       - No deductions → totalIRPF = 4828.8.
    */
    const result = calculateIRPF(input);
    expect(result.totalIRPF).toBeCloseTo(4828.8, 1);
    expect(result.taxDetails.bracketTax[1]).toBeCloseTo(1972.8, 1);
    expect(result.taxDetails.bracketTax[2]).toBeCloseTo(2856, 1);
  });

  // Test 2: High salary with many deductions driving tax to zero.
  it("calculates IRPF for a high salary (80000) with deductions that exceed tax", () => {
    const input = {
      nominalSalary: 80000,
      retirementContributions: 1000,
      fonasaContributions: 500,
      frlContribution: 200,
      dependentsDeductionFactor: 1,
      nonDisabledChildrenCount: 1,
      disabledChildrenCount: 1,
      solidarityFundContributions: 1200,
      additionalSolidarityFund: false,
      professionalFundContributions: 300,
      otherDeductions: 200,
    };

    /* Calculation walkthrough (using our mocked constants):
       - Nominal salary increases: 80000*1.06 = 84800.
       - Child deductions = 1*CHILD_DEDUCTION + 1*DISABLED_CHILD_DEDUCTION
                         = 10960 + 21920 = 32880.
       - Other deductions = 1000+500+200+(1200/12=100)+300+200 = 2300.
       - Total deductions = 32880 + 2300 = 35180.
       - Tax from brackets (as in Test 1): 4828.8.
       - Deductions effect = 35180 * 0.14 = 4925.2.
       - Total IRPF = max(0, 4828.8 - 4925.2) = 0.
    */
    const result = calculateIRPF(input);
    expect(result.totalIRPF).toBeCloseTo(0, 1);
    expect(result.taxDetails.deductions).toBeCloseTo(35180, 1);
  });

  it("calculates IRPF for a salary exactly equal to 10 BPC (65760)", () => {
    const input = {
      nominalSalary: 65760,
      retirementContributions: 0,
      fonasaContributions: 0,
      frlContribution: 0,
      dependentsDeductionFactor: 0,
      nonDisabledChildrenCount: 0,
      disabledChildrenCount: 0,
      solidarityFundContributions: 0,
      additionalSolidarityFund: false,
      professionalFundContributions: 0,
      otherDeductions: 0,
    };

    /* Calculation:
       - Since salaryInBPC = 10, no increase is applied: nominalSalary remains 65760.
       - Tax:
         • Bracket 1: 0.
         • Bracket 2: (65760 - 46032) * 0.1 = 19728*0.1 = 1972.8.
         • Others: 0.
       - Total IRPF = 1972.8.
    */
    const result = calculateIRPF(input);
    expect(result.totalIRPF).toBeCloseTo(1972.8, 1);
  });

  it("calculates IRPF for a salary exactly equal to the minimum wage (23604)", () => {
    const input = {
      nominalSalary: MINIMUM_WAGE,
      retirementContributions: 0,
      fonasaContributions: 0,
      frlContribution: 0,
      dependentsDeductionFactor: 0,
      nonDisabledChildrenCount: 0,
      disabledChildrenCount: 0,
      solidarityFundContributions: 0,
      additionalSolidarityFund: false,
      professionalFundContributions: 0,
      otherDeductions: 0,
    };

    /* Calculation:
       - salaryInBPC = 23604 / 6576 ≈ 3.59; no taxable increase.
       - Only bracket 1 applies (with rate 0) → tax = 0.
       - Total IRPF = 0.
    */
    const result = calculateIRPF(input);
    expect(result.totalIRPF).toBe(0);
  });

  it("calculates IRPF for a salary exactly equal to 15 BPC (98640)", () => {
    const input = {
      nominalSalary: 15 * BPC,
      retirementContributions: 0,
      fonasaContributions: 0,
      frlContribution: 0,
      dependentsDeductionFactor: 0,
      nonDisabledChildrenCount: 0,
      disabledChildrenCount: 0,
      solidarityFundContributions: 0,
      additionalSolidarityFund: false,
      professionalFundContributions: 0,
      otherDeductions: 0,
    };

    /* Calculation breakdown:
         - salaryInBPC = 98640 / 6576 = 15, which is >10 so taxable increase applies.
         - New nominalSalary = 98640 * 1.06 = 104558.4.
         - Tax computation:
           • Bracket 1 (0 to 7): Tax = 0.
           • Bracket 2 (7 to 10): Tax = (min(65760,104558.4)-46032)*0.1
             = (65760 - 46032)*0.1 = 1972.8.
           • Bracket 3 (10 to 15): Tax = (min(98640,104558.4)-65760)*0.15
             = (98640 - 65760)*0.15 = 4932.
           • Bracket 4 (15 to 30): Tax = (104558.4 - 98640)*0.24 = 5918.4*0.24 ≈ 1420.416.
         - Total tax = 1972.8 + 4932 + 1420.416 = 8325.216.
    */
    const result = calculateIRPF(input);
    expect(result.totalIRPF).toBeCloseTo(8325.22, 1);
  });

  it("calculates IRPF with additional solidarity fund true", () => {
    const input = {
      nominalSalary: 80000,
      retirementContributions: 1000,
      fonasaContributions: 500,
      frlContribution: 200,
      dependentsDeductionFactor: 1,
      nonDisabledChildrenCount: 1,
      disabledChildrenCount: 1,
      solidarityFundContributions: 1200,
      additionalSolidarityFund: true,
      professionalFundContributions: 300,
      otherDeductions: 200,
    };

    /* Calculation:
       - As in Test 2, but now additionalSolidarityFund adds ADDITIONAL_SOLIDARITY_FUND (≈685)
         to the total deductions.
       - Total deductions become 35180 + 685 = 35865.
       - Tax before deductions remains 4828.8.
       - Deduction effect = 35865 * 0.14 = 5021.1.
       - Total IRPF = max(0, 4828.8 - 5021.1) = 0.
    */
    const result = calculateIRPF(input);
    expect(result.totalIRPF).toBeCloseTo(0, 1);
    expect(result.taxDetails.deductions).toBeCloseTo(35865, 1);
  });

  it("calculates IRPF for an extremely high salary (800000)", () => {
    const input = {
      nominalSalary: 800000,
      retirementContributions: 0,
      fonasaContributions: 0,
      frlContribution: 0,
      dependentsDeductionFactor: 0,
      nonDisabledChildrenCount: 0,
      disabledChildrenCount: 0,
      solidarityFundContributions: 0,
      additionalSolidarityFund: false,
      professionalFundContributions: 0,
      otherDeductions: 0,
    };

    /* Calculation (approximate walkthrough):
       - salaryInBPC = 800000 / 6576 ≈ 121.6, so deductionsRate = 0.08.
       - Taxable increase applies: 800000 * 1.06 = 848000.
       - Brackets:
         • Bracket 1: 0.
         • Bracket 2: (min(65760,848000)-46032)*0.1 = 1972.8.
         • Bracket 3: (min(98640,848000)-65760)*0.15 = 4932.
         • Bracket 4: (min(197280,848000)-98640)*0.24 ≈ 182.4.
         • Bracket 5: (min(328800,848000)-197280)*0.25 ≈ 32880.
         • Bracket 6: (min(493200,848000)-328800)*0.27 ≈ 44388.
         • Bracket 7: (min(756240,848000)-493200)*0.31 ≈ 81542.4.
         • Bracket 8: (848000 - 756240)*0.36 ≈ 33033.6.
       - Total tax ≈ 222422.4.
    */
    const result = calculateIRPF(input);
    expect(result.totalIRPF).toBeCloseTo(222422.4, 1);
  });

  it("calculates IRPF with dependentsDeductionFactor of 0.5", () => {
    const input = {
      nominalSalary: 80000,
      retirementContributions: 0,
      fonasaContributions: 0,
      frlContribution: 0,
      dependentsDeductionFactor: 0.5,
      nonDisabledChildrenCount: 2,
      disabledChildrenCount: 0,
      solidarityFundContributions: 0,
      additionalSolidarityFund: false,
      professionalFundContributions: 0,
      otherDeductions: 0,
    };

    /* Calculation:
       - Child deductions = 0.5 * (2 * CHILD_DEDUCTION) = 0.5 * (2*10960) = 10960.
       - Salary increases: 80000 * 1.06 = 84800.
       - Tax from brackets = 4828.8 (as in Test 1).
       - Deduction effect = 10960 * 0.14 = 1534.4.
       - Total IRPF = 4828.8 - 1534.4 = 3294.4.
    */
    const result = calculateIRPF(input);
    expect(result.totalIRPF).toBeCloseTo(3294.4, 1);
  });
});
