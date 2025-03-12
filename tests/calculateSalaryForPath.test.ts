import { describe, it, expect, vi } from "vitest";
import { BFC, BPC } from "../src/lib/constants";
import { calculateSalaryForPath } from "../src/lib/utils";
import { companyType, FormData } from "../src/lib/types";

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
    const data: FormData = {
      originCompanyType: companyType.unipersonal,
      currentSalary: 100000,
      targetCompanyType: "national",
      isProfessional: "true",
      professionalCategory: 17282,
      combinesCapitalAndWork: "true",
      childsInChargeCount: 2,
      disabledChildsInChargeCount: 0,
      dependentsDeductionFactor: 0.5,
      solidarityFundContribution: BPC,
      appliesSolidarityFundAditional: "true",
    };

    const result = calculateSalaryForPath(data);
    expect(result).toBeDefined();
    expect(result?.contractorSalary).toBeGreaterThan(data.currentSalary);
  });

  it("calculates salary correctly for SAS type contractors", () => {
    const data: FormData = {
      originCompanyType: companyType.SAS,
      targetCompanyType: "foreign",
      isProfessional: "false",
      currentSalary: 80000,
      hasChildsInCharge: "false",
      hasPartnerInCharge: "false",
    };

    const result = calculateSalaryForPath(data);
    expect(result).toBeDefined();
    expect(result?.contractorSalary).toBeGreaterThan(data.currentSalary);
  });

  it("calculates salary correctly for unipersonal contractors billing national without combining capital and work", () => {
    const data: FormData = {
      originCompanyType: companyType.unipersonal,
      currentSalary: 150000,
      combinesCapitalAndWork: "false",
      targetCompanyType: "national",
      isProfessional: "false",
      socialSecurityCategory: 15 * BFC,
      hasChildsInCharge: "true",
      childsInChargeCount: 2,
      disabledChildsInChargeCount: 1,
      dependentsDeductionFactor: 1,
    };

    const result = calculateSalaryForPath(data);
    expect(result).toBeDefined();
    expect(result?.contractorSalary).toBeGreaterThan(data.currentSalary);
  });

  it("calculates salary correctly for unipersonal contractors billing foreign combining capital and work", () => {
    const data: FormData = {
      targetCompanyType: "foreign",
      originCompanyType: companyType.unipersonal,
      currentSalary: 85000,
      combinesCapitalAndWork: "true",
      socialSecurityCategory: 25 * BFC,
      isProfessional: "false",
      hasChildsInCharge: "false",
      hasPartnerInCharge: "true",
    };

    const result = calculateSalaryForPath(data);
    expect(result).toBeDefined();
    expect(result?.contractorSalary).toBeGreaterThan(data.currentSalary);
  });

  it("handles scenario with minimal inputs", () => {
    const data: FormData = {
      targetCompanyType: "foreign",
      originCompanyType: companyType.unipersonal,
      currentSalary: 30000,
      isProfessional: "false",
      socialSecurityCategory: 11 * BFC,
    };

    const result = calculateSalaryForPath(data);
    expect(result).toBeDefined();
    expect(result?.contractorSalary).toBeGreaterThan(data.currentSalary);
  });
});
