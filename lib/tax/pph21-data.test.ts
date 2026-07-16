import { describe, expect, it } from "vitest";
import { calcBiayaJabatan, calcPasal17, calcPesangonTax, calcPph21Tahunan, calcTidakFinalTax, getTerCategory, getTerRate } from "./pph21-data";

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

  it("prorates the job-expense cap by months worked", () => {
    expect(calcBiayaJabatan(200_000_000, 3)).toBe(1_500_000);
    expect(calcPph21Tahunan({ monthlySalary: 50_000_000, monthlyAllowance: 0, annualBonus: 0, employeePensionContribution: 0, months: 3, ptkpStatus: "TK/0" }).biayaJabatan).toBe(1_500_000);
  });

  it("uses the correct 5% pesangon bracket from Rp50m to Rp100m", () => {
    expect(calcPesangonTax(50_000_000)).toBe(0);
    expect(calcPesangonTax(100_000_000)).toBe(2_500_000);
    expect(calcPesangonTax(600_000_000)).toBe(87_500_000);
  });

  it("calculates supported non-employee DPP factors", () => {
    expect(calcTidakFinalTax(100_000_000, 0.5)).toEqual({ dpp: 50_000_000, roundedDpp: 50_000_000, tax: 2_500_000 });
  });
});
