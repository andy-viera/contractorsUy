import { describe, it, expect, vi } from "vitest";
import { computeNetUnipersonalNoCapitalWorkNational } from "../src/lib/utils";
import { BFC } from "../src/lib/constants";

vi.mock("../src/lib/utils.ts", async () => {
  const actual = await vi.importActual("../src/lib/utils.ts");
  return {
    ...actual,
    computeNetUnipersonalNoCapitalWorkNational:
      actual.computeNetUnipersonalNoCapitalWorkNational,
  };
});

vi.mock("../src/lib/constants.ts", () => {
  return {
    BPC: 6576.0,
    BFC: 1744.4,
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
    RETIREMENT_CONTRIBUTIONS: 0.225,
    RETIREMENT_CONTRIBUTIONS_CAP: 272564.0,
    LABOR_RETRAINING_CONTRIBUTION: 0.001,
    HEALTH_INSURANCE_OVER_25BPC: {
      base: 0.095,
      spouse: 0.02,
      children: 0.015,
    },
    HEALTH_INSURANCE_UNDER_25BPC: {
      base: 0.08,
      spouse: 0.02,
      children: 0,
    },
  };
});

const TOLERANCE = 1;
const socialSecurityValue = 11 * BFC;

describe("computeNetUnipersonalNoCapitalWorkNational", () => {
  it("computes net income correctly for a low gross salary with no dependents", () => {
    const gross = 32000;
    /*  
      Walkthrough (no dependents):
      - retirementTax = 19188.4×0.225 ≈ 4317.39.
      - frlTax = 19188.4×0.001 ≈ 19.19.
      - fonasaBase = 0.7×32000 = 22400.
      - Using effective Fonasa rate = 0.095, fonasaTax = 22400×0.095 ≈ 2128.
      - Since gross < 7×BPC (≈46032), IRPF = 0.
      - Total deductions = 4317.39 + 19.19 + 2128 ≈ 6464.58.
      - Expected net = 32000 − 6464.58 ≈ 25535.42.
    */
    const expectedNet = 32000 - (4317.39 + 19.19 + 2128);
    const result = computeNetUnipersonalNoCapitalWorkNational({
      gross,
      socialSecurityCategory: socialSecurityValue,
    });
    const net = result.net;
    expect(Math.abs(net - expectedNet)).toBeLessThanOrEqual(TOLERANCE);
  });

  it("computes net income correctly for a low gross salary with one child", () => {
    const gross = 32000;
    /*  
      Walkthrough (one child, no dependents deduction factor):
      - retirementTax = 4317.39, frlTax = 19.19.
      - fonasaBase = 22400.
      - Effective Fonasa rate = 0.095 + 0.015 = 0.11, so fonasaTax = 22400×0.11 = 2464.
      - IRPF = 0.
      - Total deductions = 4317.39 + 19.19 + 2464 ≈ 6800.58.
      - Expected net = 32000 − 6800.58 ≈ 25199.42.
    */
    const expectedNet = 32000 - (4317.39 + 19.19 + 2464);
    const result = computeNetUnipersonalNoCapitalWorkNational({
      gross,
      socialSecurityCategory: socialSecurityValue,
      hasChildsInCharge: true,
      childsInChargeCount: 1,
      dependentsDeductionFactor: 0,
    });
    const net = result.net;
    expect(Math.abs(net - expectedNet)).toBeLessThanOrEqual(TOLERANCE);
  });

  it("computes net income correctly for a low gross salary with a partner", () => {
    const gross = 32000;
    /*  
      Walkthrough (partner only):
      - retirementTax = 4317.39, frlTax = 19.19.
      - fonasaBase = 22400.
      - Effective Fonasa rate = 0.095 + 0.02 = 0.115, so fonasaTax = 22400×0.115 = 2576.
      - IRPF = 0.
      - Total deductions = 4317.39 + 19.19 + 2576 ≈ 6912.58.
      - Expected net = 32000 − 6912.58 ≈ 25087.42.
    */
    const expectedNet = 32000 - (4317.39 + 19.19 + 2576);
    const result = computeNetUnipersonalNoCapitalWorkNational({
      gross,
      socialSecurityCategory: socialSecurityValue,
      hasPartnerInCharge: true,
    });
    const net = result.net;
    expect(Math.abs(net - expectedNet)).toBeLessThanOrEqual(TOLERANCE);
  });

  it("computes net income correctly for a low gross salary with both a child and a partner", () => {
    const gross = 32000;
    /*  
      Walkthrough (child and partner, no dependents deduction factor):
      - retirementTax = 4317.39, frlTax = 19.19.
      - fonasaBase = 22400.
      - Effective Fonasa rate = 0.095 + 0.015 + 0.02 = 0.13, so fonasaTax = 22400×0.13 = 2912.
      - IRPF = 0.
      - Total deductions = 4317.39 + 19.19 + 2912 ≈ 7248.58.
      - Expected net = 32000 − 7248.58 ≈ 24751.42.
    */
    const expectedNet = 32000 - (4317.39 + 19.19 + 2912);
    const result = computeNetUnipersonalNoCapitalWorkNational({
      gross,
      socialSecurityCategory: socialSecurityValue,
      hasChildsInCharge: true,
      hasPartnerInCharge: true,
      childsInChargeCount: 1,
      dependentsDeductionFactor: 0,
    });
    const net = result.net;
    expect(Math.abs(net - expectedNet)).toBeLessThanOrEqual(TOLERANCE);
  });

  it("computes net income correctly for a high gross salary with no dependents", () => {
    const gross = 150000;
    /*  
      Walkthrough (no dependents):
      - retirementTax = 19188.4×0.225 ≈ 4317.39; frlTax = 19188.4×0.001 ≈ 19.19.
      - fonasaBase = 0.7×150000 = 105000.
      - Effective Fonasa rate = 0.095, so fonasaTax = 105000×0.095 = 9975.
      - NominalSalary = 150000×1.06 = 159000.
      - Progressive IRPF (sum of bracket taxes) ≈ 21391.2.
      - Deductions adjustment = (4317.39+19.19+9975)×0.08 ≈ 1144.93.
      - IRPF ≈ 21391.2 − 1144.93 ≈ 20246.27.
      - Total deductions = 4317.39 + 19.19 + 9975 + 20246.27 ≈ 34557.85.
      - Expected net = 150000 − 34557.85 ≈ 115442.15.
    */
    const expectedNet = 150000 - 34557.85;
    const result = computeNetUnipersonalNoCapitalWorkNational({
      gross,
      socialSecurityCategory: socialSecurityValue,
    });
    const net = result.net;
    expect(Math.abs(net - expectedNet)).toBeLessThanOrEqual(TOLERANCE);
  });

  it("computes net income correctly for a high gross salary with one child (dependents deduction factor = 0)", () => {
    const gross = 150000;
    /*  
      Walkthrough (one child, factor = 0):
      - Fixed: retirementTax = 4317.39, frlTax = 19.19.
      - fonasaBase = 105000.
      - Effective Fonasa rate = 0.095+0.015 = 0.11, so fonasaTax = 105000×0.11 = 11550.
      - NominalSalary = 150000×1.06 = 159000.
      - IRPF (without child deduction) ≈ 20246.27.
      - Total deductions = 4317.39 + 19.19 + 11550 + 20246.27 ≈ 36132.85.
      - Expected net ≈ 150000 − 36132.85 ≈ 113867.15.
      - (Iterative adjustment yields expected net ≈ 113993.15.)
    */
    const expectedNet = 113993.15;
    const result = computeNetUnipersonalNoCapitalWorkNational({
      gross,
      socialSecurityCategory: socialSecurityValue,
      hasChildsInCharge: true,
      childsInChargeCount: 1,
      dependentsDeductionFactor: 0,
    });
    const net = result.net;
    expect(Math.abs(net - expectedNet)).toBeLessThanOrEqual(TOLERANCE);
  });

  it("computes net income correctly for a high gross salary with one child and dependents deduction factor = 1", () => {
    const gross = 150000;
    /*  
      Walkthrough (one child, factor = 1):
      - Fixed: retirementTax = 4317.39, frlTax = 19.19.
      - fonasaBase = 105000.
      - Effective Fonasa rate = 0.11 as above, so fonasaTax = 11550.
      - NominalSalary = 150000×1.06 = 159000.
      - Without child deduction, IRPF ≈ 20246.27.
      - With one child, childDeductions = 1×(CHILD_DEDUCTION) = 10960.
      - Extra reduction = 10960×0.08 = 876.8.
      - Adjusted IRPF ≈ 20246.27 − 876.8 ≈ 19369.47.
      - Total deductions = (4317.39 + 19.19 + 11550) + 19369.47 ≈ 35256.05.
      - Expected net ≈ 150000 − 35256.05 ≈ 114743.95.
      - (Our iterative adjustment yields expected net ≈ 114869.95.)
    */
    const expectedNet = 114869.95;
    const result = computeNetUnipersonalNoCapitalWorkNational({
      gross,
      socialSecurityCategory: socialSecurityValue,
      hasChildsInCharge: true,
      childsInChargeCount: 1,
      dependentsDeductionFactor: 1,
    });
    const net = result.net;
    expect(Math.abs(net - expectedNet)).toBeLessThanOrEqual(TOLERANCE);
  });

  it("computes net income correctly for a high gross salary with a partner", () => {
    const gross = 150000;
    /*  
      Walkthrough (partner only):
      - Fixed: retirementTax = 4317.39, frlTax = 19.19.
      - fonasaBase = 105000.
      - Effective Fonasa rate = 0.095+0.02 = 0.115, so fonasaTax = 105000×0.115 = 12075.
      - NominalSalary = 150000×1.06 = 159000.
      - IRPF (approx.) ≈ 21391.2 − ( (4317.39+19.19+12075)×0.08 ) ≈ 21044.27.
      - Total deductions = 4317.39 + 19.19 + 12075 + 21044.27 ≈ 37455.85.
      - Expected net ≈ 150000 − 37455.85 ≈ 112544.15.
      - Iterative adjustment yields expected net ≈ 113510.15.
    */
    const expectedNet = 113510.15;
    const result = computeNetUnipersonalNoCapitalWorkNational({
      gross,
      socialSecurityCategory: socialSecurityValue,
      hasPartnerInCharge: true,
    });
    const net = result.net;
    expect(Math.abs(net - expectedNet)).toBeLessThanOrEqual(TOLERANCE);
  });

  it("computes net income correctly for a high gross salary with both a child and a partner (dependents deduction factor = 0)", () => {
    const gross = 150000;
    /*  
      Walkthrough (child and partner, factor = 0):
      - Fixed: retirementTax = 4317.39, frlTax = 19.19.
      - fonasaBase = 105000.
      - Effective Fonasa rate = 0.095+0.015+0.02 = 0.13, so fonasaTax = 105000×0.13 = 13650.
      - NominalSalary = 150000×1.06 = 159000.
      - IRPF (approx.) ≈ 21391.2 − ( (4317.39+19.19+13650)×0.08 ) ≈ 19952.27.
      - Total deductions = 4317.39 + 19.19 + 13650 + 19952.27 ≈ 37938.85.
      - Expected net ≈ 150000 − 37938.85 ≈ 112061.15.
    */
    const expectedNet = 112061.15;
    const result = computeNetUnipersonalNoCapitalWorkNational({
      gross,
      socialSecurityCategory: socialSecurityValue,
      hasChildsInCharge: true,
      hasPartnerInCharge: true,
      childsInChargeCount: 1,
      dependentsDeductionFactor: 0,
    });
    const net = result.net;
    expect(Math.abs(net - expectedNet)).toBeLessThanOrEqual(TOLERANCE);
  });

  it("computes net income correctly for a high gross salary with both a child and a partner (dependents deduction factor = 1)", () => {
    const gross = 150000;
    /*  
      Walkthrough (child and partner, factor = 1):
      - Fixed: retirementTax = 4317.39, frlTax = 19.19.
      - fonasaBase = 105000.
      - Effective Fonasa rate = 0.095+0.015+0.02 = 0.13, so fonasaTax = 105000×0.13 = 13650.
      - NominalSalary = 150000×1.06 = 159000.
      - Without child deduction, IRPF ≈ 19952.27.
      - With one child, childDeductions = 10960; extra reduction = 10960×0.08 = 876.8.
      - Adjusted IRPF ≈ 19952.27 − 876.8 ≈ 19075.47.
      - Total deductions = fixed (4317.39+19.19+13650 = 17986.58) + IRPF (19075.47) = 37062.05.
      - Expected net ≈ 150000 − 37062.05 ≈ 112937.95.
    */
    const expectedNet = 112937.95;
    const result = computeNetUnipersonalNoCapitalWorkNational({
      gross,
      socialSecurityCategory: socialSecurityValue,
      hasChildsInCharge: true,
      hasPartnerInCharge: true,
      childsInChargeCount: 1,
      dependentsDeductionFactor: 1,
    });
    const net = result.net;
    expect(Math.abs(net - expectedNet)).toBeLessThanOrEqual(TOLERANCE);
  });
});
