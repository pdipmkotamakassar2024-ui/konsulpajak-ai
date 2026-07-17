export const GEMINI_MODEL_ID = "gemini-2.5-flash";

export function getGeminiGenerationSettings() {
  return {
    temperature: 0.2,
    maxOutputTokens: 4_096,
    providerOptions: {
      google: {
        thinkingConfig: {
          // Gemini 2.5 Flash uses dynamic thinking by default. A zero budget
          // keeps internal thoughts from consuming the entire output budget.
          thinkingBudget: 0,
          includeThoughts: false,
        },
      },
    },
  };
}
