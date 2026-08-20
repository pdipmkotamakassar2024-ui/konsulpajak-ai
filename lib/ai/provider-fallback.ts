import { selectRegulatoryEntries } from "./regulatory-knowledge";

export type AIProviderErrorCode =
  | "AI_AUTH"
  | "AI_BILLING_OR_QUOTA"
  | "AI_RATE_LIMIT"
  | "AI_MODEL_UNAVAILABLE"
  | "AI_NETWORK"
  | "AI_UNKNOWN";

function errorDetails(error: unknown, depth = 0): string {
  if (!error || typeof error !== "object" || depth > 3) return String(error || "");
  const candidate = error as {
    name?: unknown;
    message?: unknown;
    status?: unknown;
    statusCode?: unknown;
    responseBody?: unknown;
    cause?: unknown;
  };
  return [
    candidate.name,
    candidate.status,
    candidate.statusCode,
    candidate.message,
    candidate.responseBody,
    errorDetails(candidate.cause, depth + 1),
  ].map(String).join(" ").toLowerCase();
}

export function classifyAIProviderError(error: unknown): AIProviderErrorCode {
  const details = errorDetails(error);
  if (/billing|credit|quota.*(exceed|exhaust)|resource_exhausted/.test(details)) return "AI_BILLING_OR_QUOTA";
  if (/rate.?limit|too many requests|429/.test(details)) return "AI_RATE_LIMIT";
  if (/api.?key|unauth|permission|forbidden|401|403/.test(details)) return "AI_AUTH";
  if (/model.*(not found|unavailable)|404|500|503|internal.*(error|server)|overloaded|capacity/.test(details)) return "AI_MODEL_UNAVAILABLE";
  if (/network|fetch failed|econn|enotfound|etimedout|timeout|socket/.test(details)) return "AI_NETWORK";
  return "AI_UNKNOWN";
}

export function buildCuratedFallbackAnswer(query: string) {
  const entries = selectRegulatoryEntries(query, 2);
  if (entries.length === 0) return null;

  return [
    "> [!NOTE]\n> Sistem AI utama sedang mengalami gangguan. Berikut jawaban cadangan dari basis pengetahuan regulasi resmi yang telah ditinjau.",
    ...entries.map((entry) => [
      `### ${entry.title}`,
      ...entry.facts.map((fact) => `- ${fact}`),
      "Sumber resmi:",
      ...entry.officialSources.map((source) => `- [${source.label}](${source.url})`),
    ].join("\n")),
  ].join("\n\n");
}
