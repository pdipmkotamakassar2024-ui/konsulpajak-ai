import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return json({ error: "Unauthorized" }, 401);
  }

  const admin = createAdminClient();
  const { data: chat, error: chatError } = await admin
    .from("chats")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (chatError) {
    return json({ error: chatError.message }, 500);
  }

  if (!chat) {
    return json({ error: "Chat not found" }, 404);
  }

  const { data, error: messageError } = await admin
    .from("messages")
    .select("id, role, content, created_at")
    .eq("chat_id", id)
    .order("created_at", { ascending: true });

  if (messageError) {
    return json({ error: messageError.message }, 500);
  }

  return json({ data: data ?? [] });
}
