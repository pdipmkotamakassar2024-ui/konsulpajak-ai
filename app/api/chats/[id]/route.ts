import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return json({ error: "Invalid chat id" }, 400);

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return json({ error: "Unauthorized" }, 401);

  try {
    const admin = createAdminClient();
    const { error, count } = await admin.from("chats").delete({ count: "exact" }).eq("id", id).eq("user_id", user.id);
    if (error) throw error;
    if (!count) return json({ error: "Chat not found" }, 404);
    return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("chat_delete_failed", error);
    return json({ error: "Chat could not be deleted" }, 500);
  }
}
