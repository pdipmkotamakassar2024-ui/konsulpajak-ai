export function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined) {
  if (!email) return false;
  return getAdminEmails().includes(email.trim().toLowerCase());
}

export function getAdminLoginUsername() {
  return process.env.ADMIN_USERNAME?.trim() || "admin";
}

export function getAdminLoginEmail() {
  return process.env.ADMIN_LOGIN_EMAIL?.trim().toLowerCase() || getAdminEmails()[0] || "";
}

export function isAdminUsername(username: string | null | undefined) {
  if (!username) return false;
  return username.trim().toLowerCase() === getAdminLoginUsername().toLowerCase();
}

interface AdminSessionUser {
  email?: string | null;
  app_metadata?: { provider?: unknown };
}

export function isPasswordAdminSession(user: AdminSessionUser | null | undefined) {
  return Boolean(
    user &&
    isAdminEmail(user.email) &&
    user.app_metadata?.provider === "email",
  );
}
