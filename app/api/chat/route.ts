import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import { createClient } from '@/utils/supabase/server';

export const maxDuration = 60;

// ─── Helper: buat text/plain streaming response ───────────────────────────────
function makeTextResponse(text: string): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const words = text.split(' ');
      for (let i = 0; i < words.length; i++) {
        await new Promise((r) => setTimeout(r, 15));
        controller.enqueue(encoder.encode(words[i] + (i < words.length - 1 ? ' ' : '')));
      }
      controller.close();
    },
  });
  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

// ─── Helper: ekstrak teks dari UIMessage SDK v6 ────────────────────────────────
function extractText(msg: any): string {
  // SDK v6 sendMessage({ text }) → content: "", parts: [{type:'text', text:'...'}]
  // Cek parts terlebih dahulu
  if (Array.isArray(msg.parts)) {
    const fromParts = msg.parts
      .filter((p: any) => p.type === 'text')
      .map((p: any) => String(p.text || ''))
      .join('');
    if (fromParts.trim()) return fromParts.trim();
  }
  // Fallback ke content string
  if (typeof msg.content === 'string' && msg.content.trim()) {
    return msg.content.trim();
  }
  return '';
}

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return makeTextResponse('⚠️ Request tidak valid.');
  }

  const rawMessages: any[] = body.messages || [];
  
  // Debug: log format pesan yang masuk
  console.log('[route] messages count:', rawMessages.length);
  if (rawMessages.length > 0) {
    const last = rawMessages[rawMessages.length - 1];
    console.log('[route] last message role:', last.role);
    console.log('[route] last message content:', String(last.content).slice(0, 100));
    console.log('[route] last message parts:', JSON.stringify(last.parts || []).slice(0, 200));
  }

  let userMsgCount = 0;
  let hasActiveSubscription = false;
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;

    if (user && user.email) {
      // Cek apakah user memiliki paket aktif
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('expires_at')
        .eq('email', user.email)
        .maybeSingle();

      if (sub && new Date(sub.expires_at) > new Date()) {
        hasActiveSubscription = true;
      }

      // LIMIT: 5/hari untuk user tanpa langganan
      if (!hasActiveSubscription) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Ambil semua chat_id milik user ini
        const { data: userChats } = await supabase
          .from('chats')
          .select('id')
          .eq('user_id', user.id);

        const chatIds = userChats?.map((c) => c.id) || [];

        if (chatIds.length > 0) {
          const { count } = await supabase
            .from('messages')
            .select('id', { count: 'exact', head: true })
            .eq('role', 'user')
            .in('chat_id', chatIds)
            .gte('created_at', today.toISOString());
          
          userMsgCount = count || 0;
        } else {
          userMsgCount = 0;
        }
      }
    }
  } catch (err: any) {
    console.error('[route] Supabase error:', err?.message);
    // Continue without user if supabase fails
  }

  if (user && !hasActiveSubscription && userMsgCount >= 5) {
    return makeTextResponse(
      '**LIMIT HARIAN TERCAPAI**\n\nMaaf, Anda telah mencapai batas 5 pertanyaan gratis untuk hari ini. Silakan kembali besok atau upgrade Paket Pro Anda di menu Harga.'
    );
  }

  // Cek API key
  const apiKey = (process.env.GOOGLE_GENERATIVE_AI_API_KEY || '').trim();
  if (!apiKey) {
    return makeTextResponse(
      'Halo! Saya KonsulPajak AI.\n\nSistem berjalan dalam mode **Demo** karena API Key belum dikonfigurasi. Hubungi admin untuk mengaktifkan layanan AI.'
    );
  }

  // ─── Konversi UIMessage[] → CoreMessage[] sederhana ──────────────────────
  // Hindari convertToModelMessages yang berpotensi error dengan format baru SDK v6
  type CoreMsg = { role: 'user' | 'assistant'; content: string };
  const coreMessages: CoreMsg[] = [];

  for (const msg of rawMessages) {
    if (msg.role === 'user') {
      const text = extractText(msg);
      console.log('[route] user text extracted:', text.slice(0, 100));
      if (text) {
        coreMessages.push({ role: 'user', content: text });
      }
    } else if (msg.role === 'assistant') {
      const text = extractText(msg);
      if (text) {
        coreMessages.push({ role: 'assistant', content: text });
      }
    }
  }

  // Jika tidak ada pesan user sama sekali, tolak
  if (coreMessages.length === 0 || !coreMessages.some(m => m.role === 'user')) {
    console.error('[route] No valid user message found. rawMessages:', JSON.stringify(rawMessages).slice(0, 500));
    return makeTextResponse('⚠️ Pesan tidak diterima dengan benar. Silakan coba lagi.');
  }

  console.log('[route] coreMessages count:', coreMessages.length);

  // ─── Panggil Gemini ───────────────────────────────────────────────────────
  const google = createGoogleGenerativeAI({ apiKey });

  let result: any;
  try {
    result = streamText({
      model: google('gemini-2.5-flash'),
      system: `Anda adalah **KonsulPajak AI** — konsultan pajak cerdas berbasis AI untuk UMKM, karyawan, profesional, dan entitas bisnis di Indonesia.

## IDENTITAS & GAYA BAHASA
- **Singkat & Padat**: Berikan jawaban yang paling inti dan praktis (to-the-point).
- **Kasual & Profesional**: Bahasa Indonesia baku tapi santai dan mudah dipahami awam.
- **TIDAK PERLU BASA-BASI**: JANGAN menggunakan salam pembuka seperti "Halo!", "Selamat pagi", dll. Langsung jawab intinya.
- **Hindari Blank Answer**: Jika pertanyaan abu-abu tentang pajak, asumsikan konteks pajak Indonesia dan pandu pengguna.
- **TIDAK PERLU** menjelaskan pasal UU secara panjang — cukup lampirkan nama peraturannya sebagai referensi singkat di akhir jawaban jika relevan.

---

## ⚠️ PERINGATAN KRITIS — SISTEM CORETAX (WAJIB DIPATUHI)
**Sejak 1 Januari 2025, SEMUA kewajiban perpajakan tahun 2025 ke atas wajib menggunakan sistem CORETAX DJP, bukan DJP Online.** DJP Online adalah sistem LAMA yang sudah digantikan.

- **HARI INI ADALAH TAHUN 2026 DAN CORETAX SUDAH 100% BERJALAN PENUH.**
- **DILARANG KERAS** menggunakan kata "nantinya", "direncanakan", "akan berlaku", "tahap transisi", atau "sosialisasi". Jawablah seolah-olah Coretax adalah satu-satunya realita sistem pajak sehari-hari saat ini.
- **JANGAN** mengarahkan pengguna ke DJP Online untuk kewajiban tahun 2025 ke atas dengan alasan apapun.
- **SELALU** berikan langkah-langkah Coretax sebagai satu-satunya cara utama untuk e-billing, e-faktur, e-bupot, SPT, dan pembayaran pajak.
- DJP Online hanya relevan untuk pembetulan tahun pajak 2024 ke bawah (dan Anda tidak perlu membahasnya kecuali ditanya spesifik soal 2024 ke bawah).

---

## PANDUAN PROSEDUR CORETAX DJP 2025 (KNOWLEDGE BASE)

### 🔐 Akses & Aktivasi Coretax
- **URL Resmi:** https://coretaxdjp.pajak.go.id
- **Login:** Gunakan NPWP 16 digit (atau NIK) + kata sandi.
- **Pengguna lama DJP Online:** Reset password via menu "Lupa Kata Sandi" — link dikirim ke email/SMS terdaftar.
- **Pengguna baru:** Pilih "Aktivasi Akun Wajib Pajak" atau "Daftar di Sini".
- **Kode Otorisasi:** Wajib dibuat setelah aktivasi — digunakan untuk menandatangani transaksi pajak digital.

### 🔑 Cara Membuat E-Billing (Kode Billing) di Coretax
Terdapat 3 (tiga) skema pembuatan kode billing di Coretax DJP:

**Skema 1: Cara Membuat Kode Billing Mandiri (Layanan Mandiri)**
Digunakan untuk bayar pajak di luar pelaporan SPT atau tagihan resmi (misal PPh Final UMKM).
1. Buka https://coretaxdjp.pajak.go.id dan login menggunakan NIK/NPWP 16 digit.
2. Pilih menu **"Pembayaran"**.
3. Klik opsi **"Layanan Mandiri Kode Billing"**.
4. Pilih Kode Akun Pajak (KAP) dan Kode Jenis Setoran (KJS) yang sesuai.
5. Isi Masa Pajak, Tahun Pajak, dan Nominal pajak.
6. Klik **"Buat Kode Billing"**. Sistem akan menerbitkan 15 digit angka Kode Billing.

**Skema 2: Cara Membuat Kode Billing Saat Pelaporan SPT**
Sangat dipermudah saat lapor SPT yang berstatus Kurang Bayar.
1. Isi konsep SPT di menu **"Surat Pemberitahuan"**.
2. Jika status Kurang Bayar, gulir ke bagian paling bawah formulir SPT.
3. Klik tombol **"Simpan Konsep dan Bayar dan Lapor"**.
4. Akan muncul pop-up, klik **"Buat Billing Mandiri"**.
5. Sistem otomatis mengisi KAP, KJS, dan nominal. Kode billing otomatis terbit untuk dibayar.

**Skema 3: Pembuatan Kode Billing Atas Tagihan Pajak (SKP/STP)**
Jika menerima Surat Tagihan Pajak (STP) atau SKP.
1. Login ke portal Coretax.
2. Pilih menu **"Pembayaran"**, lalu klik **"Layanan Pembuatan Kode Billing Atas Tagihan Pajak"**.
3. Sistem akan otomatis menampilkan daftar tagihan yang belum lunas.
4. Centang tagihan yang ingin dibayar, lalu isi "Jumlah yang akan dibayar".
5. Klik **"Buat Kode Billing"**.

> [!NOTE]
> **Masa Berlaku Kode Billing Coretax adalah 7x24 jam (7 hari kalender)**. Jika kedaluwarsa sebelum dibayar, Anda cukup membuat kode billing baru tanpa denda (selama belum lewat jatuh tempo penyetoran bulanan/tahunan).

### 🧾 E-Faktur di Coretax
- Pembuatan faktur pajak keluaran dan pengkreditan pajak masukan dilakukan **langsung di dalam sistem Coretax**.
- Data faktur akan **otomatis ter-posting** ke SPT Masa PPN — tidak perlu upload manual seperti di sistem lama.
- Akses: Menu **"Faktur Pajak"** > **"Faktur Keluaran"** atau **"Faktur Masukan"**.

### 📋 E-Bupot (Bukti Potong) di Coretax
- Digunakan untuk PPh Unifikasi (PPh 23/26, 4 ayat 2, 15, 22) dan PPh 21/26.
- Akses: Menu **"Pemotongan/Pemungutan Pajak"** > pilih jenis PPh yang sesuai.
- Bukti potong yang dibuat otomatis terhubung ke pelaporan SPT Masa.

### 📑 Pelaporan SPT di Coretax
- **SPT Masa PPN:** Data faktur yang sudah dibuat otomatis masuk ke SPT. Tinggal review dan lapor.
- **SPT Masa Unifikasi (PPh 23, 4(2), dll):** Terintegrasi dengan data e-bupot.
- **SPT Tahunan:** Tersedia di menu "Pelaporan" > "SPT Tahunan".
- Semua SPT tahun 2025 ke atas wajib dilaporkan melalui Coretax.

### 🏪 Ketentuan UMKM di Coretax
- UMKM omzet di bawah Rp500 juta/tahun: **tidak wajib** bayar PPh Final 0,5%, tapi tetap wajib lapor SPT Tahunan.
- UMKM omzet di atas Rp500 juta: wajib bayar PPh Final 0,5% dari omzet bruto.
- Coretax menyediakan fitur **"Pencatatan"** untuk UMKM yang tidak menyelenggarakan pembukuan penuh.
- Pelaporan omzet bulanan dilakukan melalui menu khusus UMKM di Coretax.

### 📅 Jatuh Tempo Umum (Tetap Sama)
- **PPh 21 Masa:** Setor paling lambat tanggal 10 bulan berikutnya; lapor paling lambat tanggal 20.
- **PPN Masa:** Setor paling lambat akhir bulan berikutnya; lapor paling lambat akhir bulan berikutnya.
- **PPh 25 Masa:** Setor paling lambat tanggal 15 bulan berikutnya.
- **SPT Tahunan OP:** Paling lambat 31 Maret tahun berikutnya.
- **SPT Tahunan Badan:** Paling lambat 30 April tahun berikutnya.

---

## RUANG LINGKUP PAJAK YANG DITANGANI
PPh 21, 22, 23, 25/29, 26, Final (termasuk UMKM 0,5%), PPN 11%, e-Faktur, e-Bupot, SPT Tahunan & Masa, e-Filing, e-Billing, SP2DK, dan semua prosedur di sistem Coretax DJP 2025.

## FORMAT OUTPUT
- Kalkulasi/kesimpulan penting: gunakan \`> [!NOTE]\`
- Peringatan jatuh tempo/denda: gunakan \`> [!WARNING]\`
- Template dokumen: gunakan \`> [!IMPORTANT]\`

## PENOLAKAN
Jika ditanya hal di luar pajak, jawab: "Maaf, saya hanya dilatih untuk urusan perpajakan Indonesia."`,
      messages: coreMessages,
    });
  } catch (initError: any) {
    console.error('[route] streamText init error:', initError?.message || initError);
    return makeTextResponse(`⚠️ Gagal menginisialisasi AI: ${initError?.message || 'Unknown error'}`);
  }

  // ─── Stream respons ke client ─────────────────────────────────────────────
  const encoder = new TextEncoder();
  const textStream = new ReadableStream({
    async start(controller) {
      let hasContent = false;
      try {
        for await (const chunk of result.textStream) {
          if (chunk) {
            hasContent = true;
            controller.enqueue(encoder.encode(chunk));
          }
        }
      } catch (streamError: any) {
        hasContent = true;
        console.error('[route] stream error:', streamError?.message || streamError);
        const raw = String(streamError?.responseBody || streamError?.message || streamError || '');
        let errorMsg = '⚠️ Terjadi kesalahan saat memproses respons AI.';
        if (raw.includes('PERMISSION_DENIED') || raw.includes('leaked') || raw.includes('API key not valid')) {
          errorMsg = '⚠️ **API Key Bermasalah** — Kunci API Gemini tidak valid atau telah dinonaktifkan. Hubungi admin.';
        } else if (raw.includes('RESOURCE_EXHAUSTED') || raw.includes('quota')) {
          errorMsg = '⚠️ **Kuota Habis** — Kuota API Gemini telah terpakai. Coba lagi nanti.';
        } else if (raw.includes('INVALID_ARGUMENT')) {
          errorMsg = `⚠️ **Format Pesan Salah** — ${raw.slice(0, 200)}`;
        } else {
          errorMsg = `⚠️ Error: ${streamError?.message || raw.slice(0, 200)}`;
        }
        controller.enqueue(encoder.encode(errorMsg));
      }

      if (!hasContent) {
        // Coba ambil error dari response
        let detail = '';
        try {
          const resp = await Promise.race([
            result.response,
            new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
          ]) as any;
          console.error('[route] empty response:', JSON.stringify(resp).slice(0, 500));
          detail = JSON.stringify(resp).slice(0, 300);
        } catch (e: any) {
          detail = e?.message || '';
        }
        console.error('[route] No content in stream. Detail:', detail);
        controller.enqueue(encoder.encode(
          `⚠️ **Respons AI kosong.**\n\nKemungkinan penyebab: filter keamanan Gemini, format pesan tidak valid, atau kuota habis.\n\nDetail: ${detail || 'Tidak ada detail tersedia.'}`
        ));
      }

      controller.close();
    },
  });

  return new Response(textStream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
