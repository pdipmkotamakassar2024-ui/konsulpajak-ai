import { describe, expect, it } from "vitest";
import { CORETAX_SYSTEM_PROMPT } from "./coretax-prompt";

describe("Coretax prompt", () => {
  it("preserves 2025+ Coretax guidance", () => {
    expect(CORETAX_SYSTEM_PROMPT).toContain("1 Januari 2025");
    expect(CORETAX_SYSTEM_PROMPT).toContain("CORETAX DJP");
    expect(CORETAX_SYSTEM_PROMPT).toContain("https://coretaxdjp.pajak.go.id");
  });

  it("keeps the tax-only refusal rule", () => {
    expect(CORETAX_SYSTEM_PROMPT).toContain("perpajakan Indonesia");
  });
});
