import { describe, expect, it } from "vitest";
import { calcPasal17, getTerCategory, getTerRate } from "./pph21-data";

describe("PPh 21 helpers", () => {
  it("maps PTKP to TER category", () => {
    expect(getTerCategory("TK/0")).toBe("A");
    expect(getTerCategory("K/0")).toBe("B");
    expect(getTerCategory("K/1")).toBe("C");
  });

  it("calculates TER monthly rate for known low-income bracket", () => {
    expect(getTerRate(5_400_000, "A")).toBe(0);
    expect(getTerRate(5_500_000, "A")).toBe(0.0025);
  });

  it("calculates progressive Pasal 17 annual tax", () => {
    expect(calcPasal17(60_000_000)).toBe(3_000_000);
    expect(calcPasal17(100_000_000)).toBe(9_000_000);
  });
});
