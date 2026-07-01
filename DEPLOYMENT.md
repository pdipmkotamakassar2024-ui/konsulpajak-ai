# Production Deployment

## Required Environment Variables

Set these in Vercel Project Settings > Environment Variables:

- `NEXT_PUBLIC_SITE_URL=https://konsulpajak-ai.com`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only, never expose to browser)
- `GOOGLE_GENERATIVE_AI_API_KEY` (rotated key only)

Apply `supabase/migrations/202606300001_harden_chat_schema.sql` in Supabase before deploying the API changes.

## Secret Rotation

The previous Gemini key was committed in a test file. Treat it as compromised:

1. Revoke/delete the old key in Google AI Studio or Google Cloud.
2. Create a new Gemini API key.
3. Put the new key in Vercel and local `.env.local`.
4. Force redeploy Vercel after updating the variable.

## Domain Setup

Canonical domain: `https://konsulpajak-ai.com`

In Vercel:

1. Open Project Settings > Domains.
2. Add `konsulpajak-ai.com`.
3. Add `www.konsulpajak-ai.com`.
4. Set `konsulpajak-ai.com` as the primary domain.

In Hostinger DNS Zone:

1. Keep Hostinger nameservers active so Hostinger email/MX records stay intact.
2. Remove conflicting A/AAAA/CNAME records only for `@` and `www`.
3. Add:
   - `A` record: host `@` -> `76.76.21.21`
   - `CNAME` record: host `www` -> `cname.vercel-dns.com`

In Supabase Auth URL settings:

1. Add `https://konsulpajak-ai.com/api/auth/callback` to allowed redirect URLs.
2. Keep localhost callback for local development if needed.

References:

- Vercel Domains: https://vercel.com/docs/projects/domains
- Hostinger DNS records: https://support.hostinger.com/en/articles/1583227-how-to-manage-dns-records-at-hostinger
