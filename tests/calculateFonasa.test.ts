import { describe, it, expect, vi } from "vitest";

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

import { calculateFonasa } from "../src/lib/utils";

describe("calculateFonasa", () => {
  it("returns correct contribution for taxable amount above threshold with no dependents", () => {
    const baseTaxableAmount = 20000;
    // Since 20000 > 2.5 * 6576 (≈16440), we use HEALTH_INSURANCE_OVER_25BPC.
    // Effective rate = base = 0.095.
    // Expected contribution = 20000 × 0.095 = 1900.
    const expected = 20000 * 0.095;
    const result = calculateFonasa(baseTaxableAmount);
    expect(result).toBeCloseTo(expected, 2);
  });

  it("returns correct contribution for taxable amount above threshold with one child", () => {
    const baseTaxableAmount = 20000;
    // Over threshold: initial rate = 0.095.
    // With one child, add HEALTH_INSURANCE_OVER_25BPC.children (0.015).
    // Total effective rate = 0.095 + 0.015 = 0.11.
    // Expected contribution = 20000 × 0.11 = 2200.
    const expected = 20000 * (0.095 + 0.015);
    const result = calculateFonasa(baseTaxableAmount, true, false);
    expect(result).toBeCloseTo(expected, 2);
  });

  it("returns correct contribution for taxable amount above threshold with a partner", () => {
    const baseTaxableAmount = 20000;
    // Over threshold: initial rate = 0.095.
    // With partner only, add HEALTH_INSURANCE_OVER_25BPC.spouse (0.02).
    // Total effective rate = 0.095 + 0.02 = 0.115.
    // Expected contribution = 20000 × 0.115 = 2300.
    const expected = 20000 * (0.095 + 0.02);
    const result = calculateFonasa(baseTaxableAmount, false, true);
    expect(result).toBeCloseTo(expected, 2);
  });

  it("returns correct contribution for taxable amount above threshold with both a child and a partner", () => {
    const baseTaxableAmount = 20000;
    // Over threshold: initial rate = 0.095.
    // With both dependents, add children (0.015) and spouse (0.02).
    // Total effective rate = 0.095 + 0.015 + 0.02 = 0.13.
    // Expected contribution = 20000 × 0.13 = 2600.
    const expected = 20000 * (0.095 + 0.015 + 0.02);
    const result = calculateFonasa(baseTaxableAmount, true, true);
    expect(result).toBeCloseTo(expected, 2);
  });

  it("returns correct contribution for taxable amount below threshold with no dependents", () => {
    const baseTaxableAmount = 15000; // 15000 < 2.5*6576 ≈ 16440
    // Use HEALTH_INSURANCE_UNDER_25BPC.
    // Effective rate = UNDER_25BPC.base = 0.08.
    // Expected contribution = 15000 × 0.08 = 1200.
    const expected = 15000 * 0.08;
    const result = calculateFonasa(baseTaxableAmount);
    expect(result).toBeCloseTo(expected, 2);
  });

  it("returns correct contribution for taxable amount below threshold with one child", () => {
    const baseTaxableAmount = 15000;
    // Under threshold: initial rate = UNDER_25BPC.base = 0.08.
    // With one child, add UNDER_25BPC.children, which is 0.
    // Total effective rate remains 0.08.
    // Expected contribution = 15000 × 0.08 = 1200.
    const expected = 15000 * 0.08;
    const result = calculateFonasa(baseTaxableAmount, true, false);
    expect(result).toBeCloseTo(expected, 2);
  });

  it("returns correct contribution for taxable amount below threshold with a partner", () => {
    const baseTaxableAmount = 15000;
    // Under threshold: initial rate = 0.08.
    // With partner only, add UNDER_25BPC.spouse = 0.02.
    // Total effective rate = 0.08 + 0.02 = 0.10.
    // Expected contribution = 15000 × 0.10 = 1500.
    const expected = 15000 * (0.08 + 0.02);
    const result = calculateFonasa(baseTaxableAmount, false, true);
    expect(result).toBeCloseTo(expected, 2);
  });

  it("returns correct contribution for taxable amount below threshold with both a child and a partner", () => {
    const baseTaxableAmount = 15000;
    // Under threshold: initial rate = 0.08.
    // With both dependents, add children (0) and spouse (0.02) = 0.02.
    // Total effective rate = 0.08 + 0.02 = 0.10.
    // Expected contribution = 15000 × 0.10 = 1500.
    const expected = 15000 * (0.08 + 0.02);
    const result = calculateFonasa(baseTaxableAmount, true, true);
    expect(result).toBeCloseTo(expected, 2);
  });
});
