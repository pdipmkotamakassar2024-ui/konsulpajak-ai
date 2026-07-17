import { describe, expect, it } from "vitest";
import { FREE_CHAT_LIMIT, guestQuotaSubjectId, isFreeQuotaExceeded } from "./quota";

describe("free quota", () => {
  it("blocks exactly at the free quota", () => {
    expect(isFreeQuotaExceeded(FREE_CHAT_LIMIT - 1)).toBe(false);
    expect(isFreeQuotaExceeded(FREE_CHAT_LIMIT)).toBe(true);
  });
});

describe("guestQuotaSubjectId", () => {
  it("keeps quota isolated per guest cookie", () => {
    const secret = "server-secret";
    const firstGuest = guestQuotaSubjectId("guest-a", secret);

    expect(firstGuest).toBe(guestQuotaSubjectId("guest-a", secret));
    expect(firstGuest).not.toBe(guestQuotaSubjectId("guest-b", secret));
    expect(firstGuest).not.toContain("guest-a");
  });
});
