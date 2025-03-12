import { describe, it, expect, vi } from "vitest";
import { BFC, BPC, companyType } from "../src/lib/constants";
import { calculateSalaryForPath } from "../src/lib/utils";

vi.mock("../src/lib/utils", async () => {
  const actual = await vi.importActual("../src/lib/utils");
  return {
    ...actual,
    parseWithDots: actual.parseWithDots,
    calculateSalaryForPath: actual.calculateSalaryForPath,
  };
});

describe("calculateSalaryForPath", () => {
  it("calculates salary correctly for professional contractors", () => {
    const data = {
      originCompanyType: companyType.unipersonal,
      currentSalary: 100000,
      isProfessional: true,
      professionalCategory: 17282,
      combinesCapitalAndWork: true,
      childsInChargeCount: 2,
      disabledChildsInCharge: 0,
      dependentsDeductionFactor: 0.5,
      solidarityFundContribution: BPC,
      appliesSolidarityFundAditional: true,
    };

    const result = calculateSalaryForPath(data);
    expect(result).toBeDefined();
    expect(result?.contractorSalary).toBeGreaterThan(data.currentSalary);
  });

  it("calculates salary correctly for SAS type contractors", () => {
    const data = {
      originCompanyType: companyType.SAS,
      currentSalary: 80000,
      hasChildsInCharge: false,
      hasPartnerInCharge: false,
    };

    const result = calculateSalaryForPath(data);
    expect(result).toBeDefined();
    expect(result?.contractorSalary).toBeGreaterThan(data.currentSalary);
  });

  it("calculates salary correctly for unipersonal contractors billing national without combining capital and work", () => {
    const data = {
      originCompanyType: companyType.unipersonal,
      currentSalary: 150000,
      combinesCapitalAndWork: false,
      targetCompanyType: "national",
      socialSecurityCategory: 15 * BFC,
      hasChildsInCharge: true,
      childsInChargeCount: 2,
      disabledChildsInCharge: 1,
      dependentsDeductionFactor: 1,
    };

    const result = calculateSalaryForPath(data);
    expect(result).toBeDefined();
    expect(result?.contractorSalary).toBeGreaterThan(data.currentSalary);
  });

  it("calculates salary correctly for unipersonal contractors billing foreign combining capital and work", () => {
    const data = {
      originCompanyType: companyType.unipersonal,
      currentSalary: 85000,
      combinesCapitalAndWork: true,
      socialSecurityCategory: 25 * BFC,
      isProfessional: false,
      hasChildsInCharge: false,
      hasPartnerInCharge: true,
    };

    const result = calculateSalaryForPath(data);
    expect(result).toBeDefined();
    expect(result?.contractorSalary).toBeGreaterThan(data.currentSalary);
  });

  it("handles scenario with minimal inputs", () => {
    const data = {
      originCompanyType: companyType.unipersonal,
      currentSalary: 30000,
      isProfessional: false,
      socialSecurityCategory: 11 * BFC,
    };

    const result = calculateSalaryForPath(data);
    expect(result).toBeDefined();
    expect(result?.contractorSalary).toBeGreaterThan(data.currentSalary);
  });
});
