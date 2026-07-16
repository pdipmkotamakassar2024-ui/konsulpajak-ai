# KonsulPajak AI

Aplikasi konsultasi pajak Indonesia berbasis Next.js, Google Gemini, dan Supabase. Fitur yang tersedia meliputi chat streaming, riwayat untuk pengguna login, analisis gambar/PDF, kuota gratis, langganan manual, kalkulator PPh 21, dan knowledge base regulasi resmi bertanggal.

## Menjalankan secara lokal

Persyaratan: Node.js 20+ dan proyek Supabase.

```bash
npm ci
copy .env.example .env.local
npm run dev
```

Isi seluruh variabel pada `.env.local`. Jangan pernah memasukkan service-role key atau Gemini API key ke source control maupun variabel `NEXT_PUBLIC_*`.

## Verifikasi

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

CI menjalankan empat pemeriksaan tersebut pada setiap pull request dan push ke `main`.

## Database

Jalankan migrasi berurutan:

1. `supabase/migrations/202606300001_harden_chat_schema.sql`
2. `supabase/migrations/202607150001_atomic_quota_and_constraints.sql`

Migrasi kedua meretrofit constraint pada instalasi lama dan menyediakan RPC kuota atomik. API chat memerlukan `SUPABASE_SERVICE_ROLE_KEY`; jangan beri klien akses langsung ke `subscriptions` atau `usage_events`.

## Knowledge base regulasi

Fakta terkurasi berada di `lib/ai/regulatory-knowledge.ts` dan mencantumkan tanggal peninjauan serta sumber resmi DJP/JDIH. Tambahkan atau ubah entri hanya setelah memeriksa sumber primer, lalu perbarui test retrieval. Knowledge base bukan crawler otomatis; perubahan setelah tanggal peninjauan harus diverifikasi kembali.

## Batas lampiran dan chat

- Maksimal 3 lampiran dan total 3 MB per pesan.
- Gambar: JPG, PNG, WebP, maksimal 2 MB per file.
- PDF: maksimal 3 MB dan harus memiliki teks yang dapat diekstrak.
- Pesan: maksimal 8.000 karakter per pesan dan 40.000 karakter untuk riwayat request.
- Paket gratis: 5 permintaan dalam jendela 24 jam.

## Keamanan operasional

- Rotasi segera setiap secret yang pernah tampil di commit, issue, log, atau tangkapan layar.
- Lindungi branch `main`, wajibkan CI, aktifkan Dependabot/secret scanning, dan batasi akses Supabase service role.
- Tinjau kebijakan retensi Google Gemini dan Supabase sesuai akun produksi.
- Terapkan migrasi sebelum men-deploy kode API baru.

Detail produksi ada di [DEPLOYMENT.md](./DEPLOYMENT.md).
