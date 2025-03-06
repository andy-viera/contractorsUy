import { describe, it, expect, vi } from "vitest";

vi.mock("../src/lib/constants.ts", () => {
  return {
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
  };
});

import {
  calculateIrpfFromNetSalaryBS,
  calculateIRPF,
} from "../src/lib/utils.ts";
import { MINIMUM_WAGE } from "../src/lib/constants.ts";

describe("calculateIrpfFromNetSalaryBS", () => {
  it("should compute a tax value such that computed net salary equals the desired net salary (no contributions)", () => {
    const desiredNet = 30000;
    const tax = calculateIrpfFromNetSalaryBS({ netSalary: desiredNet });
    const grossEstimate = desiredNet + tax;

    const { totalIRPF } = calculateIRPF({ nominalSalary: grossEstimate });
    const computedNet = grossEstimate - totalIRPF;

    expect(Math.abs(computedNet - desiredNet)).toBeLessThanOrEqual(0.1);
  });

  it("should compute a tax value such that computed net salary equals the desired net salary (with contributions)", () => {
    const desiredNet = 30000;
    const retirementContributions = 1000;
    const fonasaContributions = 500;
    const frlContribution = 200;
    const professionalFundContributions = 300;
    const solidarityFundContributions = 1200;
    const additionalSolidarityFund = true;
    const otherDeductions = 100;
    const contributionsSum =
      retirementContributions + fonasaContributions + frlContribution;

    const tax = calculateIrpfFromNetSalaryBS({
      netSalary: desiredNet,
      retirementContributions,
      fonasaContributions,
      frlContribution,
      professionalFundContributions,
      solidarityFundContributions,
      additionalSolidarityFund,
      otherDeductions,
    });
    const grossEstimate = desiredNet + tax + contributionsSum;

    const { totalIRPF } = calculateIRPF({
      nominalSalary: grossEstimate,
      retirementContributions,
      fonasaContributions,
      frlContribution,
      professionalFundContributions,
      solidarityFundContributions,
      additionalSolidarityFund,
      otherDeductions,
    });
    const computedNet = grossEstimate - totalIRPF - contributionsSum;
    expect(Math.abs(computedNet - desiredNet)).toBeLessThanOrEqual(0.1);
  });

  it("should compute tax for net salary equal to the minimum wage", () => {
    const desiredNet = MINIMUM_WAGE;
    const tax = calculateIrpfFromNetSalaryBS({ netSalary: desiredNet });
    const grossEstimate = desiredNet + tax;
    const { totalIRPF } = calculateIRPF({ nominalSalary: grossEstimate });
    const computedNet = grossEstimate - totalIRPF;
    expect(Math.abs(computedNet - desiredNet)).toBeLessThanOrEqual(0.1);
  });

  it("should compute tax for an extremely high net salary", () => {
    const desiredNet = 500000;
    const tax = calculateIrpfFromNetSalaryBS({ netSalary: desiredNet });
    const grossEstimate = desiredNet + tax;
    const { totalIRPF } = calculateIRPF({ nominalSalary: grossEstimate });
    const computedNet = grossEstimate - totalIRPF;
    expect(Math.abs(computedNet - desiredNet)).toBeLessThanOrEqual(0.1);
  });
});
