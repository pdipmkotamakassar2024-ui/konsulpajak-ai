export const GEMINI_MODEL_ID = "gemini-2.5-flash";
export const GROQ_MODEL_ID = "openai/gpt-oss-120b";
export const GROQ_RESEARCH_MODEL_ID = "groq/compound";

const LIVE_RESEARCH_PATTERNS = [
  /\b(terbaru|terkini|sekarang|saat ini|hari ini|update|sudah berlaku|masih berlaku)\b/i,
  /\b(kapan|batas|tenggat|deadline)\b.*\b(lapor|bayar|setor|pelaporan|pembayaran)\b/i,
  /\b(berita|pengumuman|siaran pers|ditunjuk|penunjukan)\b/i,
  /\b(20(?:2[6-9]|[3-9]\d))\b/,
];

/**
 * Uses Groq Compound only when live web research is materially useful. This
 * protects the much smaller Compound daily quota while keeping current-law
 * questions grounded in fresh sources.
 */
export function shouldUseLiveResearch(query: string) {
  const normalized = query.replace(/\s+/g, " ").trim();
  return LIVE_RESEARCH_PATTERNS.some((pattern) => pattern.test(normalized));
}

export function selectGroqModel(query: string) {
  return shouldUseLiveResearch(query) ? GROQ_RESEARCH_MODEL_ID : GROQ_MODEL_ID;
}

export function getGroqGenerationSettings() {
  return {
    temperature: 0.2,
    maxOutputTokens: 4_096,
  };
}

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
