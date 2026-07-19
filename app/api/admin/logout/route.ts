import { createClient } from "@/utils/supabase/server";

export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return Response.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
}
