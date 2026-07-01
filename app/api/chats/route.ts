import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function makeTitle(input: unknown) {
  const raw = typeof input === "string" ? input.trim() : "";
  if (!raw) return "Konsultasi Baru";
  return raw.length > 50 ? `${raw.slice(0, 50)}...` : raw;
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return json({ error: "Unauthorized" }, 401);
  }

  const admin = createAdminClient();
  const { data, error: dbError } = await admin
    .from("chats")
    .select("id, title, created_at, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(30);

  if (dbError) {
    return json({ error: dbError.message }, 500);
  }

  return json({ data: data ?? [] });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return json({ error: "Unauthorized" }, 401);
  }

  const body = await req.json().catch(() => ({}));
  const title = makeTitle(body.title);
  const admin = createAdminClient();

  const { data, error: dbError } = await admin
    .from("chats")
    .insert({ user_id: user.id, title })
    .select("id, title, created_at, updated_at")
    .single();

  if (dbError) {
    return json({ error: dbError.message }, 500);
  }

  return json({ data }, 201);
}
