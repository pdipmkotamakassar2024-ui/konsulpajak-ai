import { createClient } from '@/utils/supabase/server';

const ADMIN_EMAILS = ['pdipmkotamakassar2024@gmail.com', 'ziqranraihan@gmail.com'];

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
      return new Response(JSON.stringify({ error: "Unauthorized: Admin access required" }), { status: 401 });
    }

    const { email, plan_type } = await req.json();

    if (!email || !plan_type) {
      return new Response(JSON.stringify({ error: "Email and plan_type are required" }), { status: 400 });
    }

    const expiresAt = new Date();
    if (plan_type === '1_bulan') {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else if (plan_type === '3_bulan') {
      expiresAt.setMonth(expiresAt.getMonth() + 3);
    } else if (plan_type === '1_tahun') {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
      return new Response(JSON.stringify({ error: "Invalid plan_type" }), { status: 400 });
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .upsert(
        { email, plan_type, expires_at: expiresAt.toISOString() },
        { onConflict: 'email' }
      )
      .select();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, data }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
      return new Response(JSON.stringify({ error: "Unauthorized: Admin access required" }), { status: 401 });
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .order('expires_at', { ascending: false });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, data }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
