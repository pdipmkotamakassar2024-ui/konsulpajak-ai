export const GEMINI_MODEL_ID = "gemini-2.5-flash";

export function getGeminiGenerationSettings() {
  return {
    temperature: 0.2,
    maxOutputTokens: 4_096,
    providerOptions: {
      google: {
        thinkingConfig: {
          // Keep reasoning bounded while leaving enough room for the visible
          // answer. This improves legal classification without dynamic spikes.
          thinkingBudget: 1_024,
          includeThoughts: false,
        },
      },
    },
  };
}
