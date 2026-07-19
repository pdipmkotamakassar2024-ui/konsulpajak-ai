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

  it("always directs online NPWP registration to the official Coretax portal", () => {
    const entries = selectRegulatoryEntries("bagaimana cara daftar NPWP online?");
    const context = buildRegulatoryContext("bagaimana cara daftar NPWP online?");

    expect(entries[0]?.id).toBe("pendaftaran-npwp-online-coretax");
    expect(context).toContain("https://coretaxdjp.pajak.go.id");
    expect(context).toContain("Jangan mengarahkan pengguna ke e-Registration/ereg lama");
    expect(context).toContain("Aktivasi Akun Wajib Pajak");
  });

  it("retrieves the current construction rate matrix instead of the old 2 percent rate", () => {
    const context = buildRegulatoryContext("Saya PT pelaksana konstruksi dengan SBU kecil, kontrak Rp2,5 miliar. Berapa PPh Final Pasal 4 ayat 2?");

    expect(context).toContain("PP 9 Tahun 2022");
    expect(context).toContain("1,75%");
    expect(context).toContain("Rp43.750.000");
    expect(context).toContain("tarif lama");
  });
});

describe("Coretax prompt", () => {
  it("requires current, contextual, and explicitly corrected answers", () => {
    const prompt = buildCoretaxSystemPrompt({ currentDate: "15 Juli 2026", regulatoryContext: "FAKTA RESMI" });
    expect(prompt).toContain("FAKTA RESMI");
    expect(prompt).toContain("Koreksi atas jawaban sebelumnya");
    expect(prompt).toContain("Jangan mengarang tanggal operasional");
    expect(prompt).toContain("Tahun Pajak 2024 dan sebelumnya");
    expect(prompt).toContain("cara daftar/buat NPWP online");
    expect(prompt).toContain("klasifikasikan dahulu fakta penentu");
    expect(prompt).toContain("Jangan menyetujui koreksi pengguna");
    expect(prompt).toContain("Jangan menutup setiap jawaban dengan disclaimer generik");
  });
});
