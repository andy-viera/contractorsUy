import { describe, it, expect, vi } from "vitest";

vi.mock("../src/lib/constants.ts", () => {
  return {
    BPC: 6576.0,
    BFC: 1744.4,
    ADDITIONAL_SOLIDARITY_FUND: ((5 / 4) * 6576.0) / 12,
    RETIREMENT_CONTRIBUTIONS: 0.225,
    RETIREMENT_CONTRIBUTIONS_CAP: 272564.0,
    LABOR_RETRAINING_CONTRIBUTION: 0.001,
    DEDUCTIONS_RATE_UNDER_15BPC: 0.14,
    DEDUCTIONS_RATE_OVER_15BPC: 0.08,
    TAXABLE_INCOME_INCREASE: 0.06,
    CHILD_DEDUCTION: (20 * 6576.0) / 12,
    DISABLED_CHILD_DEDUCTION: (40 * 6576.0) / 12,
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
  };
});

import {
  calculateContractorSalary,
  calculateIrpfFromNetSalaryBS,
} from "../src/lib/utils";
import { ADDITIONAL_SOLIDARITY_FUND, BFC, BPC } from "../src/lib/constants";

describe("calculateContractorSalary", () => {
  const socialSecurityValue = 11 * BFC;

  it("calculates gross salary correctly when addIrpf is false", () => {
    const realCurrentSalary = 50000;
    const retirementTax = socialSecurityValue * 0.225;
    const frlTax = socialSecurityValue * 0.001;
    const fonasaTax = 0.7 * realCurrentSalary * 0.095;
    const addIrpf = false;

    const expectedGross =
      realCurrentSalary *
      (1 + (retirementTax + fonasaTax + frlTax) / realCurrentSalary);

    const result = calculateContractorSalary({
      realCurrentSalary,
      retirementTax,
      fonasaTax,
      frlTax,
      addIrpf,
    });
    expect(result.contractorSalary).toBeCloseTo(expectedGross, 1);
  });

  it("calculates gross salary correctly with IRPF included", () => {
    const realCurrentSalary = 150000;
    const retirementTax = socialSecurityValue * 0.225;
    const frlTax = socialSecurityValue * 0.001;
    const fonasaTax = 0.7 * realCurrentSalary * 0.095;

    const totalIRPF = calculateIrpfFromNetSalaryBS({
      netSalary: realCurrentSalary,
      retirementContributions: retirementTax,
      fonasaContributions: fonasaTax,
      frlContribution: frlTax,
    });

    const expectedGross =
      realCurrentSalary *
      (1 +
        (retirementTax + fonasaTax + frlTax + totalIRPF) / realCurrentSalary);

    const result = calculateContractorSalary({
      realCurrentSalary,
      retirementTax,
      fonasaTax,
      frlTax,
      addIrpf: true,
    });

    expect(result.contractorSalary).toBeCloseTo(expectedGross, 0);
  });

  it("calculates gross salary correctly with solidarity fund contribution and additional solidarity fund", () => {
    const realCurrentSalary = 200000;
    const retirementTax = socialSecurityValue * 0.225;
    const frlTax = socialSecurityValue * 0.001;
    const fonasaTax = 0.7 * realCurrentSalary * 0.095;
    const solidarityFundContribution = BPC;
    const appliesSolidarityFundAditional = true;

    const totalIRPF = calculateIrpfFromNetSalaryBS({
      netSalary: realCurrentSalary,
      retirementContributions: retirementTax,
      fonasaContributions: fonasaTax,
      frlContribution: frlTax,
      solidarityFundContributions: solidarityFundContribution,
      additionalSolidarityFund: appliesSolidarityFundAditional,
    });

    const expectedGross =
      realCurrentSalary *
      (1 +
        (retirementTax +
          fonasaTax +
          frlTax +
          totalIRPF +
          solidarityFundContribution / 12 +
          ADDITIONAL_SOLIDARITY_FUND) /
          realCurrentSalary);

    const result = calculateContractorSalary({
      realCurrentSalary,
      retirementTax,
      fonasaTax,
      frlTax,
      addIrpf: true,
      solidarityFundContribution,
      appliesSolidarityFundAditional,
    });

    expect(result.contractorSalary).toBeCloseTo(expectedGross, 0);
  });
});
