-- Buat tabel subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  plan_type TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Izinkan RLS public untuk insert/update dari server API dengan anon key (karena tidak ada service_role key)
-- Perhatian: Ini tidak sepenuhnya aman jika URL/Key bocor, namun dalam konteks ini API route melindunginya dengan ADMIN_PASSWORD.
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Kebijakan (Policy): Izinkan Semua Akses
-- Karena kita melakukan update melalui API khusus yang memiliki validasi password admin
CREATE POLICY "Allow All on subscriptions" 
ON public.subscriptions
FOR ALL
USING (true)
WITH CHECK (true);
