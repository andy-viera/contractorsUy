import { describe, it, expect, vi } from "vitest";

vi.mock("../src/lib/constants.ts", () => {
  const actual = vi.importActual("../src/lib/constants");
  return {
    ...actual,
  };
});

import { normalizeValue, normalizeConditions } from "../src/lib/utils";

describe("normalizeValue", () => {
  it("returns true for input 'true'", () => {
    expect(normalizeValue("true")).toBe(true);
  });

  it("returns false for input 'false'", () => {
    expect(normalizeValue("false")).toBe(false);
  });

  it("returns the original value when input is not 'true' or 'false'", () => {
    expect(normalizeValue("hello")).toBe("hello");
    expect(normalizeValue(123)).toBe(123);
    expect(normalizeValue(true)).toBe(true);
  });
});

describe("normalizeConditions", () => {
  it("returns an empty array when conditions is undefined", () => {
    expect(normalizeConditions(undefined)).toEqual([]);
  });

  it("wraps a single condition in an array and normalizes it", () => {
    expect(normalizeConditions("true")).toEqual([true]);
    expect(normalizeConditions("false")).toEqual([false]);
    expect(normalizeConditions("maybe")).toEqual(["maybe"]);
    expect(normalizeConditions(42)).toEqual([42]);
  });

  it("maps an array of conditions to normalized values", () => {
    const conditions = ["true", "false", "hello", 123];
    expect(normalizeConditions(conditions)).toEqual([
      true,
      false,
      "hello",
      123,
    ]);
  });
});
