import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, convertToModelMessages, createTextStreamResponse } from 'ai';
import { createClient } from '@/utils/supabase/server';

export const maxDuration = 30;

/**
 * Helper: buat text stream response untuk pesan error/limit.
 * TextStreamChatTransport mengharapkan Content-Type: text/plain.
 */
function makeTextResponse(text: string): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const words = text.split(' ');
      for (let i = 0; i < words.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 20));
        controller.enqueue(encoder.encode(words[i] + (i < words.length - 1 ? ' ' : '')));
      }
      controller.close();
    },
  });
  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  // SDK v6 / TextStreamChatTransport mengirim body dengan format:
  // { messages: UIMessage[], id: string, trigger: 'submit-message' }
  const rawMessages = body.messages || [];

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // ─── LIMIT: Tamu 5/hari (cek client-side), Login 25/hari (cek server) ────
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (user) {
    // Hitung pesan user hari ini dari semua chat milik user ini
    const { count: userMsgCount } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'user')
      .gte('created_at', today.toISOString());

    if (userMsgCount !== null && userMsgCount >= 25) {
      return makeTextResponse(
        '**LIMIT HARIAN TERCAPAI**\n\nMaaf, Anda telah mencapai batas 25 pertanyaan untuk hari ini. Silakan kembali besok atau upgrade paket Anda di /harga.'
      );
    }
  } else {
    // Untuk tamu: cek jumlah pesan user dalam session ini
    const userMessages = rawMessages.filter((m: any) => m.role === 'user');
    if (userMessages.length > 5) {
      return makeTextResponse(
        '**LIMIT HARIAN TERCAPAI**\n\nMaaf, Pengguna Tamu dibatasi maksimal 5 pertanyaan per 24 jam. Silakan Masuk untuk melanjutkan konsultasi.'
      );
    }
  }
  // ─────────────────────────────────────────────────────────────────────────

  // Jika tidak ada API key, kembalikan respons demo
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return makeTextResponse(
      'Halo! Saya adalah KonsulPajak AI.\n\nSistem saat ini berjalan dalam mode **Offline/Demo** karena API Key belum dikonfigurasi. Silakan hubungi admin untuk mengaktifkan layanan AI.'
    );
  }

  // Sanitize & konversi messages ke format model
  const sanitizedMessages = rawMessages.map((msg: any) => {
    if (msg.role === 'user') {
      // Ekstrak teks dari parts jika ada
      let textContent = '';
      if (typeof msg.content === 'string') {
        textContent = msg.content;
      } else if (Array.isArray(msg.parts)) {
        textContent = msg.parts
          .filter((p: any) => p.type === 'text')
          .map((p: any) => p.text || '')
          .join('');
      }
      return {
        role: 'user',
        content: textContent,
        parts: [{ type: 'text', text: textContent }],
      };
    }
    return msg;
  });

  // Konversi ke format model Gemini
  let modelMessages: any;
  try {
    modelMessages = convertToModelMessages(sanitizedMessages);
  } catch {
    modelMessages = sanitizedMessages;
  }

  // Init Gemini provider
  const customGoogle = createGoogleGenerativeAI({
    apiKey: (process.env.GOOGLE_GENERATIVE_AI_API_KEY || '').trim(),
  });

  const result = streamText({
    model: customGoogle('gemini-2.5-flash'),
    system: `Anda adalah **KonsulPajak AI** — konsultan pajak cerdas berbasis AI untuk UMKM, karyawan, profesional, dan entitas bisnis di Indonesia. Anda WAJIB sepenuhnya berorientasi pada regulasi terbaru dan sistem **Coretax DJP**. 

## IDENTITAS & GAYA BAHASA
- **SANGAT Singkat & Padat**: Jawab layaknya AI Gemini—berikan jawaban yang paling inti dan praktis (to-the-point).
- **TIDAK PERLU Menjelaskan Undang-Undang**: JANGAN menjelaskan isi pasal atau undang-undang secara panjang lebar. Cukup lampirkan nama peraturannya sebagai referensi di akhir jawaban.
- **Kasual & Profesional**: Bahasa Indonesia baku tapi santai.
- **Hindari Blank Answer**: Jika ada pertanyaan abu-abu seperti "bayar pajak influencer" atau "cara e-billing", asumsikan konteks pajak Indonesia dan pandu pengguna dengan ringkas, JANGAN menolak menjawab.

## RUANG LINGKUP — SISTEM CORETAX & PAJAK INDONESIA
Fokus HANYA pada konteks Indonesia, meliputi:
- PPh 21, 22, 23, 25/29, 26, dan Final (termasuk UMKM 0.5%)
- PPN 11% & e-Faktur
- SPT Tahunan & Masa, e-Filing, SP2DK
- **Sistem Coretax & Tahun 2025/2026**: WAJIB merujuk pada regulasi dan prosedur terbaru tahun pajak 2025/2026.

## FORMAT OUTPUT KHUSUS (COLORED OUTPUT)
Jika pengguna meminta simulasi perhitungan, template surat (SP2DK), atau kesimpulan spesifik yang butuh penekanan visual, gunakan format blockquote peringatan berikut:
- Untuk Hasil Kalkulasi / Kesimpulan Penting: Awali dengan \`> [!NOTE]\`
- Untuk Peringatan Jatuh Tempo / Denda: Awali dengan \`> [!WARNING]\`
- Untuk Dokumen / Template: Awali dengan \`> [!IMPORTANT]\`

## PENOLAKAN TOPIK DI LUAR PAJAK
Jika ditanya hal di luar pajak (resep masakan, koding), jawab sopan: "Maaf, saya hanya dilatih khusus untuk urusan perpajakan dan Coretax Indonesia."

Jika pengguna melampirkan gambar/faktur, analisis dokumen tersebut secara langsung dan berikan ringkasan angka pajaknya.`,
    messages: modelMessages,
  });

  // Kembalikan sebagai text stream (sesuai TextStreamChatTransport)
  const encoder = new TextEncoder();
  const textStream = new ReadableStream({
    async start(controller) {
      let hasContent = false;
      try {
        for await (const chunk of result.textStream) {
          hasContent = true;
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (error: any) {
        hasContent = true;
        console.error('Stream error:', error);
        const raw = String(error?.responseBody || error?.message || error || '');
        let errorMsg = '⚠️ Terjadi kesalahan saat menghubungi AI.';
        if (raw.includes('leaked') || raw.includes('PERMISSION_DENIED')) {
          errorMsg = '⚠️ **API Key Bermasalah** — API Key Gemini telah dinonaktifkan. Hubungi admin.';
        } else if (raw.includes('quota') || raw.includes('RESOURCE_EXHAUSTED')) {
          errorMsg = '⚠️ **Kuota Habis** — Kuota API Gemini telah terpakai. Coba lagi nanti.';
        } else if (raw.includes('API key not valid')) {
          errorMsg = '⚠️ **API Key Tidak Valid** — Kunci API yang dimasukkan salah.';
        } else {
          errorMsg = `⚠️ **Kesalahan:** ${error?.message || 'Gagal menghubungi layanan AI.'}`;
        }
        controller.enqueue(encoder.encode(errorMsg));
      }

      if (!hasContent) {
        controller.enqueue(encoder.encode(
          '⚠️ **Gagal mendapatkan respons dari AI.**\n\nPermintaan Anda mungkin diblokir oleh filter keamanan Gemini atau respons kosong.'
        ));
      }

      controller.close();
    },
  });

  return new Response(textStream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
