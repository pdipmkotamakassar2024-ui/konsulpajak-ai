import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

const ADMIN_EMAILS = ['pdipmkotamakassar2024@gmail.com', 'ziqranraihan@gmail.com'];

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
      return json({ error: "Unauthorized: Admin access required" }, 401);
    }

    const { email, plan_type } = await req.json();

    if (!email || !plan_type) {
      return json({ error: "Email and plan_type are required" }, 400);
    }

    const expiresAt = new Date();
    if (plan_type === '1_bulan') {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else if (plan_type === '3_bulan') {
      expiresAt.setMonth(expiresAt.getMonth() + 3);
    } else if (plan_type === '1_tahun') {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
      return json({ error: "Invalid plan_type" }, 400);
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from('subscriptions')
      .upsert(
        { email, plan_type, expires_at: expiresAt.toISOString(), updated_at: new Date().toISOString() },
        { onConflict: 'email' }
      )
      .select();

    if (error) {
      return json({ error: error.message }, 500);
    }

    return json({ success: true, data });
  } catch (err: any) {
    return json({ error: err.message }, 500);
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
      return json({ error: "Unauthorized: Admin access required" }, 401);
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from('subscriptions')
      .select('*')
      .order('expires_at', { ascending: false });

    if (error) {
      return json({ error: error.message }, 500);
    }

    return json({ success: true, data });
  } catch (err: any) {
    return json({ error: err.message }, 500);
  }
}
