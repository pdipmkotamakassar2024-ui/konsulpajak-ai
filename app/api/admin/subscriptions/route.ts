import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: Request) {
  try {
    const { email, plan_type, admin_password } = await req.json();

    const correctPassword = process.env.ADMIN_PASSWORD;
    if (!correctPassword || admin_password !== correctPassword) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

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
    const authHeader = req.headers.get('Authorization');
    const correctPassword = process.env.ADMIN_PASSWORD;
    
    if (!correctPassword || authHeader !== `Bearer ${correctPassword}`) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
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
