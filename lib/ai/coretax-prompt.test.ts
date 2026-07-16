import { describe, expect, it } from "vitest";
import { buildCoretaxSystemPrompt } from "./coretax-prompt";
import { buildRegulatoryContext, selectRegulatoryEntries } from "./regulatory-knowledge";

describe("regulatory knowledge", () => {
  it("retrieves the current marketplace appointment before answering", () => {
    const entries = selectRegulatoryEntries("Apakah Shopee sudah memotong PPh 22?");
    expect(entries[0]?.id).toBe("marketplace-pph22-pmk37-2025");
    expect(buildRegulatoryContext("Shopee PMK 37")).toContain("1 Juli 2026");
  });

  it("retrieves the correct Coretax flow for SPT 2025", () => {
    const context = buildRegulatoryContext("cara lapor SPT Tahunan orang pribadi tahun 2025");
    expect(context).toContain("Buat Konsep SPT");
    expect(context).toContain("Jangan mengarahkan");
  });
});

describe("Coretax prompt", () => {
  it("requires current, contextual, and explicitly corrected answers", () => {
    const prompt = buildCoretaxSystemPrompt({ currentDate: "15 Juli 2026", regulatoryContext: "FAKTA RESMI" });
    expect(prompt).toContain("FAKTA RESMI");
    expect(prompt).toContain("Koreksi atas jawaban sebelumnya");
    expect(prompt).toContain("Jangan mengarang tanggal operasional");
    expect(prompt).toContain("Tahun Pajak 2024 dan sebelumnya");
  });
});
