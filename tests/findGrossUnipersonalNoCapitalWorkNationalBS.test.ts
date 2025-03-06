import { describe, it, expect, vi } from "vitest";

vi.mock("../src/lib/utils.ts", async () => {
  const actual = await vi.importActual("../src/lib/utils.ts");
  return {
    ...actual,
    findGrossUnipersonalNoCapitalWorkNationalBS:
      actual.findGrossUnipersonalNoCapitalWorkNationalBS,
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

import {
  findGrossUnipersonalNoCapitalWorkNationalBS,
  computeNetUnipersonalNoCapitalWorkNational,
} from "../src/lib/utils";
import {
  BFC,
  BPC,
  HEALTH_INSURANCE_OVER_25BPC,
  LABOR_RETRAINING_CONTRIBUTION,
  RETIREMENT_CONTRIBUTIONS,
} from "../src/lib/constants";

const TOLERANCE = 1;

const socialSecurityValue = 11 * BFC;

describe("Gross salary calculation for unipersonal national billing", () => {
  it("calculates gross salary correctly when there are no dependents", () => {
    const desiredNet = 30000;

    const retirementTax = socialSecurityValue * RETIREMENT_CONTRIBUTIONS;
    const frlTax = socialSecurityValue * LABOR_RETRAINING_CONTRIBUTION;
    const fixedDeductions = retirementTax + frlTax;

    // For a gross high enough that 0.7*gross > 2.5*BPC,
    // effective Fonasa rate = HEALTH_INSURANCE_OVER_25BPC.base.
    const fonasaRate = HEALTH_INSURANCE_OVER_25BPC.base; // 0.095
    // Fonasa tax = 0.7 * gross * fonasaRate.
    // Thus: net = gross - (fixedDeductions + 0.7 * gross * fonasaRate)
    //       = gross * (1 - 0.7 * fonasaRate) - fixedDeductions.
    // Solve for gross:
    const expectedGross =
      (desiredNet + fixedDeductions) / (1 - 0.7 * fonasaRate);

    const gross = findGrossUnipersonalNoCapitalWorkNationalBS({
      desiredNet,
      socialSecurityCategory: socialSecurityValue,
    });
    expect(Math.abs(gross - expectedGross)).toBeLessThanOrEqual(TOLERANCE);
  });

  it("calculates gross salary correctly when the contractor has one child", () => {
    const desiredNet = 30000;
    const retirementTax = socialSecurityValue * RETIREMENT_CONTRIBUTIONS;
    const frlTax = socialSecurityValue * LABOR_RETRAINING_CONTRIBUTION;
    const fixedDeductions = retirementTax + frlTax;
    // For one child, effective Fonasa rate is:
    // base + children = 0.095 + 0.015 = 0.11.
    const fonasaRate =
      HEALTH_INSURANCE_OVER_25BPC.base + HEALTH_INSURANCE_OVER_25BPC.children;
    const expectedGross =
      (desiredNet + fixedDeductions) / (1 - 0.7 * fonasaRate);

    const gross = findGrossUnipersonalNoCapitalWorkNationalBS({
      desiredNet,
      socialSecurityCategory: socialSecurityValue,
      hasChildsInCharge: true,
      childsInChargeCount: 1,
      dependentsDeductionFactor: 0,
    });
    expect(Math.abs(gross - expectedGross)).toBeLessThanOrEqual(TOLERANCE);
  });

  it("calculates gross salary correctly when the contractor has a partner", () => {
    const desiredNet = 30000;
    const retirementTax = socialSecurityValue * RETIREMENT_CONTRIBUTIONS;
    const frlTax = socialSecurityValue * LABOR_RETRAINING_CONTRIBUTION;
    const fixedDeductions = retirementTax + frlTax;
    // For a partner only, effective Fonasa rate:
    // base + spouse = 0.095 + 0.02 = 0.115.
    const fonasaRate =
      HEALTH_INSURANCE_OVER_25BPC.base + HEALTH_INSURANCE_OVER_25BPC.spouse;
    const expectedGross =
      (desiredNet + fixedDeductions) / (1 - 0.7 * fonasaRate);

    const gross = findGrossUnipersonalNoCapitalWorkNationalBS({
      desiredNet,
      socialSecurityCategory: socialSecurityValue,
      hasPartnerInCharge: true,
    });
    expect(Math.abs(gross - expectedGross)).toBeLessThanOrEqual(TOLERANCE);
  });

  it("calculates gross salary correctly when the contractor has both a child and a partner", () => {
    const desiredNet = 30000;
    const retirementTax = socialSecurityValue * RETIREMENT_CONTRIBUTIONS;
    const frlTax = socialSecurityValue * LABOR_RETRAINING_CONTRIBUTION;
    const fixedDeductions = retirementTax + frlTax;
    const fonasaRate =
      HEALTH_INSURANCE_OVER_25BPC.base +
      HEALTH_INSURANCE_OVER_25BPC.children +
      HEALTH_INSURANCE_OVER_25BPC.spouse;
    const expectedGross =
      (desiredNet + fixedDeductions) / (1 - 0.7 * fonasaRate);

    const gross = findGrossUnipersonalNoCapitalWorkNationalBS({
      desiredNet,
      socialSecurityCategory: socialSecurityValue,
      hasChildsInCharge: true,
      hasPartnerInCharge: true,
      childsInChargeCount: 1,
      dependentsDeductionFactor: 0,
    });

    expect(Math.abs(gross - expectedGross)).toBeLessThanOrEqual(TOLERANCE);
  });

  it("calculates gross salary correctly for high net salary with extra solidarity fund contribution", () => {
    const desiredNet = 150000;
    const solidarityFundContribution = BPC;

    const gross = findGrossUnipersonalNoCapitalWorkNationalBS({
      desiredNet,
      socialSecurityCategory: socialSecurityValue,
      hasChildsInCharge: true,
      hasPartnerInCharge: true,
      solidarityFundContribution,
      appliesSolidarityFundAditional: true,
    });
    const computedNet = computeNetUnipersonalNoCapitalWorkNational({
      gross,
      socialSecurityCategory: socialSecurityValue,
      hasChildsInCharge: true,
      hasPartnerInCharge: true,
      solidarityFundContribution,
      appliesSolidarityFundAditional: true,
    });
    expect(Math.abs(computedNet - desiredNet)).toBeLessThanOrEqual(0.1);
  });

  it("calculates gross salary correctly for extremely high net salary with extra solidarity fund contribution", () => {
    const desiredNet = 500000;
    const solidarityFundContribution = 2 * BPC;

    const gross = findGrossUnipersonalNoCapitalWorkNationalBS({
      desiredNet,
      socialSecurityCategory: socialSecurityValue,
      hasChildsInCharge: true,
      hasPartnerInCharge: true,
      solidarityFundContribution,
      appliesSolidarityFundAditional: true,
    });
    const computedNet = computeNetUnipersonalNoCapitalWorkNational({
      gross,
      socialSecurityCategory: socialSecurityValue,
      hasChildsInCharge: true,
      hasPartnerInCharge: true,
      solidarityFundContribution,
      appliesSolidarityFundAditional: true,
    });
    expect(Math.abs(computedNet - desiredNet)).toBeLessThanOrEqual(0.1);
  });
});
