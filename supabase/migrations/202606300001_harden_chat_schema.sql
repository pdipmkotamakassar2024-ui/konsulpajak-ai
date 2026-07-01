-- Canonical schema for KonsulPajak AI production.
-- Apply this in Supabase SQL Editor before deploying API changes that use service role.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Konsultasi Baru',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Existing databases may already have partial tables from earlier drafts.
ALTER TABLE public.chats ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.chats ADD COLUMN IF NOT EXISTS title TEXT NOT NULL DEFAULT 'Konsultasi Baru';
ALTER TABLE public.chats ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
ALTER TABLE public.chats ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;

ALTER TABLE public.chats
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS title TEXT NOT NULL DEFAULT 'Konsultasi Baru',
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now());

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;

ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user',
  ADD COLUMN IF NOT EXISTS content TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now());

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('1_bulan', '3_bulan', '1_tahun')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS plan_type TEXT;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;

ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS plan_type TEXT,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now());

ALTER TABLE public.subscriptions
  ALTER COLUMN email SET NOT NULL,
  ALTER COLUMN plan_type SET NOT NULL,
  ALTER COLUMN expires_at SET NOT NULL;

CREATE TABLE IF NOT EXISTS public.usage_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_type TEXT NOT NULL CHECK (subject_type IN ('user', 'guest')),
  subject_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  event_type TEXT NOT NULL DEFAULT 'chat_message',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS chats_user_updated_idx ON public.chats(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS messages_chat_created_idx ON public.messages(chat_id, created_at ASC);
CREATE INDEX IF NOT EXISTS subscriptions_email_idx ON public.subscriptions(email);
CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_email_unique_idx ON public.subscriptions(email);
CREATE INDEX IF NOT EXISTS usage_events_subject_created_idx ON public.usage_events(subject_type, subject_id, created_at DESC);
CREATE INDEX IF NOT EXISTS usage_events_user_created_idx ON public.usage_events(user_id, created_at DESC);

-- Migrate older root schema if it was applied before canonical table names existed.
DO $$
BEGIN
  IF to_regclass('public.chat_sessions') IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'chat_sessions'
      AND column_name = 'updated_at'
    ) THEN
      EXECUTE $migrate_chats$
        INSERT INTO public.chats (id, user_id, title, created_at, updated_at)
        SELECT id, user_id, title, created_at, COALESCE(updated_at, created_at)
        FROM public.chat_sessions
        ON CONFLICT (id) DO NOTHING
      $migrate_chats$;
    ELSE
      EXECUTE $migrate_chats$
        INSERT INTO public.chats (id, user_id, title, created_at, updated_at)
        SELECT id, user_id, title, created_at, created_at
        FROM public.chat_sessions
        ON CONFLICT (id) DO NOTHING
      $migrate_chats$;
    END IF;
  END IF;

  IF to_regclass('public.chat_messages') IS NOT NULL THEN
    EXECUTE $migrate_messages$
      INSERT INTO public.messages (id, chat_id, role, content, created_at)
      SELECT id, session_id, role, content, created_at
      FROM public.chat_messages
      WHERE role IN ('user', 'assistant')
      ON CONFLICT (id) DO NOTHING
    $migrate_messages$;
  END IF;
END $$;

ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own chats" ON public.chats;
DROP POLICY IF EXISTS "Users can insert their own chats" ON public.chats;
DROP POLICY IF EXISTS "Users can update their own chats" ON public.chats;
DROP POLICY IF EXISTS "Users can delete their own chats" ON public.chats;

CREATE POLICY "Users can view their own chats"
ON public.chats FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chats"
ON public.chats FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chats"
ON public.chats FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chats"
ON public.chats FOR DELETE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view messages in their chats" ON public.messages;
DROP POLICY IF EXISTS "Users can insert messages in their chats" ON public.messages;

CREATE POLICY "Users can view messages in their chats"
ON public.messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.chats
    WHERE public.chats.id = public.messages.chat_id
    AND public.chats.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert messages in their chats"
ON public.messages FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.chats
    WHERE public.chats.id = public.messages.chat_id
    AND public.chats.user_id = auth.uid()
  )
);

-- Remove permissive legacy subscription policy if it exists.
DROP POLICY IF EXISTS "Allow All on subscriptions" ON public.subscriptions;

-- No anon/authenticated policies on subscriptions or usage_events by design.
-- Server API uses SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS.
