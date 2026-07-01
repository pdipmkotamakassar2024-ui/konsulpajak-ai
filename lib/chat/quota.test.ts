import { describe, expect, it } from "vitest";
import { FREE_CHAT_LIMIT, isFreeQuotaExceeded } from "./quota";

describe("free quota", () => {
  it("blocks exactly at the free quota", () => {
    expect(isFreeQuotaExceeded(FREE_CHAT_LIMIT - 1)).toBe(false);
    expect(isFreeQuotaExceeded(FREE_CHAT_LIMIT)).toBe(true);
  });
});
