import { describe, expect, it } from "vitest";
import { GEMINI_MODEL_ID, GROQ_MODEL_ID, GROQ_RESEARCH_MODEL_ID, getGeminiGenerationSettings, getGroqGenerationSettings, selectGroqModel, shouldUseLiveResearch } from "@/lib/ai/generation-config";

describe("Gemini generation settings", () => {
  it("reserves the output budget for a visible answer", () => {
    const settings = getGeminiGenerationSettings();

    expect(GEMINI_MODEL_ID).toBe("gemini-2.5-flash");
    expect(settings.maxOutputTokens).toBe(4_096);
    expect(settings.providerOptions.google.thinkingConfig).toEqual({
      thinkingBudget: 1_024,
      includeThoughts: false,
    });
  });
});

describe("Groq model routing", () => {
  it.each([
    "Apa aturan pajak marketplace terbaru?",
    "Apakah PMK ini masih berlaku saat ini?",
    "Kapan batas pelaporan PPN sekarang?",
    "Ada pengumuman DJP tahun 2026?",
  ])("routes time-sensitive question to live research: %s", (query) => {
    expect(shouldUseLiveResearch(query)).toBe(true);
    expect(selectGroqModel(query)).toBe(GROQ_RESEARCH_MODEL_ID);
  });

  it.each([
    "Apa itu PPh Unifikasi?",
    "Hitung PPh Final konstruksi untuk kontrak 2,5 miliar",
    "Bagaimana cara daftar NPWP online?",
  ])("keeps stable or curated question on the high-capacity model: %s", (query) => {
    expect(shouldUseLiveResearch(query)).toBe(false);
    expect(selectGroqModel(query)).toBe(GROQ_MODEL_ID);
  });
});

describe("Groq generation settings", () => {
  it("uses a capable free-tier model with bounded output", () => {
    const settings = getGroqGenerationSettings();

    expect(GROQ_MODEL_ID).toBe("openai/gpt-oss-120b");
    expect(settings).toEqual({ temperature: 0.2, maxOutputTokens: 4_096 });
  });
});
