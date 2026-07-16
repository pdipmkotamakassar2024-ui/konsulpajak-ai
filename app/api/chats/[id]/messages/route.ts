import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
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
    console.error("chat_owner_lookup_failed", chatError);
    return json({ error: "Chat could not be loaded" }, 500);
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
    console.error("message_list_failed", messageError);
    return json({ error: "Messages could not be loaded" }, 500);
  }

  return json({ data: data ?? [] });
}
