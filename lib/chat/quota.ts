import { createHmac } from "node:crypto";

export const FREE_CHAT_LIMIT = 5;
export const QUOTA_WINDOW_MS = 24 * 60 * 60 * 1000;

export function isFreeQuotaExceeded(usedCount: number) {
  return usedCount >= FREE_CHAT_LIMIT;
}

export function guestQuotaSubjectId(guestId: string, secret: string) {
  return createHmac("sha256", secret).update(`guest:${guestId}`).digest("hex");
}
