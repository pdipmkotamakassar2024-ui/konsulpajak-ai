import { describe, expect, it } from "vitest";
import { buildCuratedFallbackAnswer, classifyAIProviderError } from "./provider-fallback";

describe("AI provider fallback", () => {
  it("classifies provider failures without exposing their raw message", () => {
    expect(classifyAIProviderError(new Error("RESOURCE_EXHAUSTED: quota exceeded"))).toBe("AI_BILLING_OR_QUOTA");
    expect(classifyAIProviderError(new Error("429 too many requests"))).toBe("AI_RATE_LIMIT");
    expect(classifyAIProviderError(new Error("API key invalid"))).toBe("AI_AUTH");
    expect(classifyAIProviderError(new Error("fetch failed ETIMEDOUT"))).toBe("AI_NETWORK");
  });

  it("answers marketplace questions from curated sources during an outage", () => {
    const answer = buildCuratedFallbackAnswer("apa itu pajak marketplace?");
    expect(answer).toContain("Pemungutan PPh Pasal 22 oleh marketplace");
    expect(answer).toContain("0,5%");
    expect(answer).toContain("Sumber resmi");
  });

  it("answers the reported online-store scenario during an outage", () => {
    const answer = buildCuratedFallbackAnswer("Saya punya toko online dengan omzet sekitar 30 juta per bulan. Berapa pajak yang harus saya bayar?");
    expect(answer).toContain("PPh Final UMKM");
    expect(answer).toContain("Rp500 juta");
  });

  it("answers the reported PPN and PPh 21 deadline question during an outage", () => {
    const answer = buildCuratedFallbackAnswer("Kapan batas pelaporan PPN dan PPh 21?");
    expect(answer).toContain("tanggal 20 bulan berikutnya");
    expect(answer).toContain("akhir bulan berikutnya");
  });

  it("returns null when no curated rule matches", () => {
    expect(buildCuratedFallbackAnswer("halo apa kabar")).toBeNull();
  });
});
