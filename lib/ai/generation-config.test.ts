import { describe, expect, it } from "vitest";
import { GEMINI_MODEL_ID, GROQ_MODEL_ID, getGeminiGenerationSettings, getGroqGenerationSettings } from "@/lib/ai/generation-config";

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

describe("Groq generation settings", () => {
  it("uses a capable free-tier model with bounded output", () => {
    const settings = getGroqGenerationSettings();

    expect(GROQ_MODEL_ID).toBe("openai/gpt-oss-120b");
    expect(settings).toEqual({ temperature: 0.2, maxOutputTokens: 4_096 });
  });
});
