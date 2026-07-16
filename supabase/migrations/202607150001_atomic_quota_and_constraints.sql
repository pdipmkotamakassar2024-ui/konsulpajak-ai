-- Retrofit constraints for older installations and make quota consumption atomic.

UPDATE public.subscriptions SET email = lower(trim(email)) WHERE email IS NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'messages_role_valid') THEN
    ALTER TABLE public.messages ADD CONSTRAINT messages_role_valid CHECK (role IN ('user', 'assistant')) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'subscriptions_plan_type_valid') THEN
    ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_plan_type_valid CHECK (plan_type IN ('1_bulan', '3_bulan', '1_tahun')) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'usage_events_subject_type_valid') THEN
    ALTER TABLE public.usage_events ADD CONSTRAINT usage_events_subject_type_valid CHECK (subject_type IN ('user', 'guest')) NOT VALID;
  END IF;
END $$;

ALTER TABLE public.messages VALIDATE CONSTRAINT messages_role_valid;
ALTER TABLE public.subscriptions VALIDATE CONSTRAINT subscriptions_plan_type_valid;
ALTER TABLE public.usage_events VALIDATE CONSTRAINT usage_events_subject_type_valid;

ALTER TABLE public.chats ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.messages ALTER COLUMN chat_id SET NOT NULL;
ALTER TABLE public.messages ALTER COLUMN role SET NOT NULL;
ALTER TABLE public.messages ALTER COLUMN content SET NOT NULL;
ALTER TABLE public.usage_events ALTER COLUMN subject_type SET NOT NULL;
ALTER TABLE public.usage_events ALTER COLUMN subject_id SET NOT NULL;

CREATE OR REPLACE FUNCTION public.consume_chat_quota(
  p_subject_type TEXT,
  p_subject_id TEXT,
  p_user_id UUID,
  p_email TEXT,
  p_subscribed BOOLEAN,
  p_attachments INTEGER,
  p_limit INTEGER,
  p_window_start TIMESTAMPTZ
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  used_count INTEGER;
  new_event_id UUID := gen_random_uuid();
BEGIN
  IF p_subject_type NOT IN ('user', 'guest') OR p_subject_id IS NULL OR length(p_subject_id) < 1 THEN
    RAISE EXCEPTION 'invalid quota subject';
  END IF;

  -- Serialize requests for the same subject so concurrent calls cannot overspend.
  PERFORM pg_advisory_xact_lock(hashtextextended(p_subject_type || ':' || p_subject_id, 0));

  IF NOT p_subscribed THEN
    SELECT count(*) INTO used_count
    FROM public.usage_events
    WHERE subject_type = p_subject_type
      AND subject_id = p_subject_id
      AND event_type = 'chat_message'
      AND created_at >= p_window_start;

    IF used_count >= p_limit THEN
      RETURN NULL;
    END IF;
  END IF;

  INSERT INTO public.usage_events (id, subject_type, subject_id, user_id, email, event_type, metadata)
  VALUES (
    new_event_id, p_subject_type, p_subject_id, p_user_id, lower(p_email), 'chat_message',
    jsonb_build_object('subscribed', p_subscribed, 'attachments', greatest(coalesce(p_attachments, 0), 0))
  );

  RETURN new_event_id;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_chat_quota(TEXT, TEXT, UUID, TEXT, BOOLEAN, INTEGER, INTEGER, TIMESTAMPTZ) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_chat_quota(TEXT, TEXT, UUID, TEXT, BOOLEAN, INTEGER, INTEGER, TIMESTAMPTZ) TO service_role;
