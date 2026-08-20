# Production Deployment

## Required Environment Variables

Set these in Vercel Project Settings > Environment Variables:

- `NEXT_PUBLIC_SITE_URL=https://konsulpajak-ai.com`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only, never expose to browser)
- `GROQ_API_KEY` (primary provider; rotated key only)
- `GOOGLE_GENERATIVE_AI_API_KEY` (optional fallback)
- `ADMIN_EMAILS` (comma-separated, server-only)
- `ADMIN_USERNAME` (username khusus halaman `/admin/login`; default `admin` bila tidak diisi)
- `ADMIN_LOGIN_EMAIL` (akun email/password Supabase yang dipakai oleh login admin; harus tercantum di `ADMIN_EMAILS`)

## Admin Login

Login admin terpisah dari login Google milik member dan tersedia di `https://konsulpajak-ai.com/admin/login`.

1. Di Supabase Authentication > Users, buat akun email/password admin atau atur password pada akun admin yang sudah ada.
2. Isi `ADMIN_LOGIN_EMAIL` dengan email akun tersebut dan pastikan email yang sama ada di `ADMIN_EMAILS`.
3. Isi `ADMIN_USERNAME` dengan username yang akan digunakan pengelola.
4. Redeploy setelah mengubah environment variables. Password tidak disimpan di Vercel atau source code; Supabase Auth yang menyimpan dan memverifikasinya.

Apply every file in `supabase/migrations/` in filename order before deploying API changes. The 15 July 2026 migration adds validated constraints and the atomic `consume_chat_quota` RPC required by `/api/chat`.

## Secret Rotation

The previous Gemini key was committed in a test file. Treat it as compromised:

1. Revoke/delete the old key in Google AI Studio or Google Cloud.
2. Create a new Gemini API key.
3. Put the new key in Vercel and local `.env.local`.
4. Force redeploy Vercel after updating the variable.
5. Remove the leaked value from open issues, logs, or screenshots after rotation; history must still be treated as compromised.

## Release Gate

Run `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build`. Protect `main` and require the GitHub Actions CI check before merging.

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
