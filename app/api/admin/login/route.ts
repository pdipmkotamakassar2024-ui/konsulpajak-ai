import { getAdminLoginEmail, isAdminEmail, isAdminUsername, isPasswordAdminSession } from "@/lib/auth/admin";
import { createClient } from "@/utils/supabase/server";

function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const username = typeof body?.username === "string" ? body.username : "";
    const password = typeof body?.password === "string" ? body.password : "";
    const adminEmail = getAdminLoginEmail();

    if (!adminEmail || !isAdminEmail(adminEmail)) {
      console.error("admin_login_not_configured");
      return json({ error: "Login admin belum dikonfigurasi pada server." }, 503);
    }

    if (!username || !password || username.length > 100 || password.length > 500 || !isAdminUsername(username)) {
      return json({ error: "Username atau password salah." }, 401);
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email: adminEmail, password });

    if (error || !isPasswordAdminSession(data.user)) {
      if (data.session) await supabase.auth.signOut();
      return json({ error: "Username atau password salah." }, 401);
    }

    return json({ success: true });
  } catch (error) {
    console.error("admin_login_failed", error);
    return json({ error: "Login admin gagal diproses." }, 500);
  }
}
