import { describe, it, expect, vi } from "vitest";

vi.mock("../src/lib/constants.ts", () => {
  return {
    BPC: 6576.0,
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

vi.mock("../src/lib/utils.ts", async () => {
  const actual = await vi.importActual("../src/lib/utils.ts");
  return {
    ...actual,
    calculateFonasa: actual.calculateFonasa,
    calculateTaxes: actual.calculateTaxes,
  };
});

import { calculateTaxes } from "../src/lib/utils";
import {
  RETIREMENT_CONTRIBUTIONS,
  RETIREMENT_CONTRIBUTIONS_CAP,
  LABOR_RETRAINING_CONTRIBUTION,
} from "../src/lib/constants";
import { calculateFonasa } from "../src/lib/utils";

describe("calculateTaxes", () => {
  it("calculates taxes correctly with no dependents and default fonasaBaseTaxableAmount (socialSecurityValue = 20000)", () => {
    const socialSecurityValue = 20000;
    const expectedRetirementTax = Math.min(
      socialSecurityValue * RETIREMENT_CONTRIBUTIONS,
      RETIREMENT_CONTRIBUTIONS_CAP
    );
    const expectedFrlTax = socialSecurityValue * LABOR_RETRAINING_CONTRIBUTION;
    const expectedFonasaTax = calculateFonasa(
      socialSecurityValue,
      false,
      false
    );
    const result = calculateTaxes({
      socialSecurityValue,
      hasChildsInCharge: false,
      hasPartnerInCharge: false,
    });
    expect(result.retirementTax).toBeCloseTo(expectedRetirementTax, 2);
    expect(result.frlTax).toBeCloseTo(expectedFrlTax, 2);
    expect(result.fonasaTax).toBeCloseTo(expectedFonasaTax, 2);
  });

  it("calculates taxes correctly with one child (socialSecurityValue = 20000)", () => {
    const socialSecurityValue = 20000;
    const expectedRetirementTax = Math.min(
      socialSecurityValue * RETIREMENT_CONTRIBUTIONS,
      RETIREMENT_CONTRIBUTIONS_CAP
    );
    const expectedFrlTax = socialSecurityValue * LABOR_RETRAINING_CONTRIBUTION;
    const expectedFonasaTax = calculateFonasa(socialSecurityValue, true, false);
    const result = calculateTaxes({
      socialSecurityValue,
      hasChildsInCharge: true,
      hasPartnerInCharge: false,
    });
    expect(result.retirementTax).toBeCloseTo(expectedRetirementTax, 2);
    expect(result.frlTax).toBeCloseTo(expectedFrlTax, 2);
    expect(result.fonasaTax).toBeCloseTo(expectedFonasaTax, 2);
  });

  it("calculates taxes correctly with a partner (socialSecurityValue = 20000)", () => {
    const socialSecurityValue = 20000;
    const expectedRetirementTax = Math.min(
      socialSecurityValue * RETIREMENT_CONTRIBUTIONS,
      RETIREMENT_CONTRIBUTIONS_CAP
    );
    const expectedFrlTax = socialSecurityValue * LABOR_RETRAINING_CONTRIBUTION;
    const expectedFonasaTax = calculateFonasa(socialSecurityValue, false, true);
    const result = calculateTaxes({
      socialSecurityValue,
      hasChildsInCharge: false,
      hasPartnerInCharge: true,
    });
    expect(result.retirementTax).toBeCloseTo(expectedRetirementTax, 2);
    expect(result.frlTax).toBeCloseTo(expectedFrlTax, 2);
    expect(result.fonasaTax).toBeCloseTo(expectedFonasaTax, 2);
  });

  it("calculates taxes correctly with both a child and a partner (socialSecurityValue = 20000)", () => {
    const socialSecurityValue = 20000;
    const expectedRetirementTax = Math.min(
      socialSecurityValue * RETIREMENT_CONTRIBUTIONS,
      RETIREMENT_CONTRIBUTIONS_CAP
    );
    const expectedFrlTax = socialSecurityValue * LABOR_RETRAINING_CONTRIBUTION;
    const expectedFonasaTax = calculateFonasa(socialSecurityValue, true, true);
    const result = calculateTaxes({
      socialSecurityValue,
      hasChildsInCharge: true,
      hasPartnerInCharge: true,
    });
    expect(result.retirementTax).toBeCloseTo(expectedRetirementTax, 2);
    expect(result.frlTax).toBeCloseTo(expectedFrlTax, 2);
    expect(result.fonasaTax).toBeCloseTo(expectedFonasaTax, 2);
  });

  it("calculates taxes correctly with custom fonasaBaseTaxableAmount with higher socialSecurityValue", () => {
    const socialSecurityValue = 45000;
    const customBase = 30000;
    const expectedRetirementTax = Math.min(
      socialSecurityValue * RETIREMENT_CONTRIBUTIONS,
      RETIREMENT_CONTRIBUTIONS_CAP
    );
    const expectedFrlTax = socialSecurityValue * LABOR_RETRAINING_CONTRIBUTION;
    const expectedFonasaTax = calculateFonasa(customBase, false, false);
    const result = calculateTaxes({
      socialSecurityValue,
      fonasaBaseTaxableAmount: customBase,
      hasChildsInCharge: false,
      hasPartnerInCharge: false,
    });
    expect(result.retirementTax).toBeCloseTo(expectedRetirementTax, 2);
    expect(result.frlTax).toBeCloseTo(expectedFrlTax, 2);
    expect(result.fonasaTax).toBeCloseTo(expectedFonasaTax, 2);
  });

  it("calculates taxes correctly with both a child and a partner with higher socialSecurityValue", () => {
    const socialSecurityValue = 45000;
    const expectedRetirementTax = Math.min(
      socialSecurityValue * RETIREMENT_CONTRIBUTIONS,
      RETIREMENT_CONTRIBUTIONS_CAP
    );
    const expectedFrlTax = socialSecurityValue * LABOR_RETRAINING_CONTRIBUTION;
    const expectedFonasaTax = calculateFonasa(socialSecurityValue, true, true);
    const result = calculateTaxes({
      socialSecurityValue,
      hasChildsInCharge: true,
      hasPartnerInCharge: true,
    });
    expect(result.retirementTax).toBeCloseTo(expectedRetirementTax, 2);
    expect(result.frlTax).toBeCloseTo(expectedFrlTax, 2);
    expect(result.fonasaTax).toBeCloseTo(expectedFonasaTax, 2);
  });
});
