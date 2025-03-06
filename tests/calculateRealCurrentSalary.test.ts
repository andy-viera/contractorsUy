import { describe, it, expect, vi } from "vitest";
import { calculateRealCurrentSalary } from "../src/lib/utils";

vi.mock("../src/lib/constants.ts", () => {
  return {
    BPC: 6576.0,
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

describe("calculateRealCurrentSalary", () => {
  it("returns correct real monthly salary for a base salary of 30000", () => {
    // dailyRate = 30000 / 30 = 1000
    // holidaySalary = 1000 * 20 = 20000
    // annualRealSalary = 30000 * 13 + 20000 = 410000
    // real monthly salary = 410000 / 12 ≈ 34166.67
    const salary = 30000;
    const expected = 410000 / 12;
    const result = calculateRealCurrentSalary(salary);
    expect(result).toBeCloseTo(expected, 2);
  });

  it("returns correct real monthly salary for a base salary of 50000", () => {
    // dailyRate = 50000 / 30 ≈ 1666.67
    // holidaySalary ≈ 1666.67 * 20 = 33333.33
    // annualRealSalary = 50000 * 13 + 33333.33 ≈ 683333.33
    // real monthly salary ≈ 683333.33 / 12 ≈ 56944.44
    const salary = 50000;
    const expected = 683333.33 / 12;
    const result = calculateRealCurrentSalary(salary);
    expect(result).toBeCloseTo(expected, 2);
  });

  it("returns correct real monthly salary for a base salary of 20000", () => {
    // dailyRate = 20000 / 30 ≈ 666.67
    // holidaySalary ≈ 666.67 * 20 = 13333.33
    // annualRealSalary = 20000 * 13 + 13333.33 ≈ 273333.33
    // real monthly salary ≈ 273333.33 / 12 ≈ 22777.78
    const salary = 20000;
    const expected = 273333.33 / 12;
    const result = calculateRealCurrentSalary(salary);
    expect(result).toBeCloseTo(expected, 2);
  });

  it("returns correct real monthly salary for a base salary of 130032", () => {
    // dailyRate = 130032 / 30 = 4334.4
    // holidaySalary = 4334.4 * 20 = 86688
    // annualRealSalary = 130032 * 13 + 86688 = 1690416 + 86688 = 1777104
    // real monthly salary = 1777104 / 12 = 148092
    const salary = 130032;
    const expected = 148092;
    const result = calculateRealCurrentSalary(salary);
    expect(result).toBeCloseTo(expected, 2);
  });
});
