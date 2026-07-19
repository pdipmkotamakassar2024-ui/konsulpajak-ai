import { afterEach, describe, expect, it } from "vitest";
import { getAdminLoginEmail, getAdminLoginUsername, isAdminEmail, isAdminUsername, isPasswordAdminSession } from "./admin";

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
});

describe("admin authentication configuration", () => {
  it("normalizes the admin allowlist", () => {
    process.env.ADMIN_EMAILS = " Owner@Example.com, second@example.com ";
    expect(isAdminEmail("owner@example.com")).toBe(true);
    expect(isAdminEmail("member@example.com")).toBe(false);
  });

  it("uses a separate username and configured login email", () => {
    process.env.ADMIN_USERNAME = "Pengelola";
    process.env.ADMIN_LOGIN_EMAIL = "ADMIN@example.com";
    expect(getAdminLoginUsername()).toBe("Pengelola");
    expect(isAdminUsername(" pengelola ")).toBe(true);
    expect(getAdminLoginEmail()).toBe("admin@example.com");
  });

  it("falls back to username admin and the first allowed email", () => {
    delete process.env.ADMIN_USERNAME;
    delete process.env.ADMIN_LOGIN_EMAIL;
    process.env.ADMIN_EMAILS = "first@example.com,second@example.com";
    expect(getAdminLoginUsername()).toBe("admin");
    expect(getAdminLoginEmail()).toBe("first@example.com");
  });

  it("rejects an allowed admin email when the session came from Google", () => {
    process.env.ADMIN_EMAILS = "admin@example.com";

    expect(isPasswordAdminSession({ email: "admin@example.com", app_metadata: { provider: "email" } })).toBe(true);
    expect(isPasswordAdminSession({ email: "admin@example.com", app_metadata: { provider: "google" } })).toBe(false);
  });
});
