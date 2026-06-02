import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';
import { createClient } from '@/utils/supabase/server';

export const maxDuration = 30;

/**
 * Helper: create a plain text streaming response.
 * TextStreamChatTransport on the client expects raw text chunks, NOT data stream format.
 */
function createTextStream(text: string, delayMs = 30): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Stream word by word for a typing effect
      const words = text.split(' ');
      for (let i = 0; i < words.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        const chunk = words[i] + (i === words.length - 1 ? '' : ' ');
        controller.enqueue(encoder.encode(chunk));
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
  const rawMessages = body.messages || [];
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // LIMIT LOGIC: Free users are limited to 20 messages per day.
  if (user) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'user')
      .gte('created_at', today.toISOString());
      
    if (count !== null && count >= 20) {
      return createTextStream(
        "**LIMIT HARIAN TERCAPAI**\n\nMaaf, Anda telah mencapai batas 20 pertanyaan gratis untuk hari ini. Silakan kembali besok atau Upgrade ke Premium untuk akses tanpa batas."
      );
    }
  }

  // If no Gemini API key is provided, return a demo response
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return createTextStream(
      "Halo! Saya adalah KonsulPajak AI.\n\nSistem saat ini berjalan dalam mode **Offline/Demo** karena API Key belum dikonfigurasi. Silakan hubungi admin untuk mengaktifkan layanan AI."
    );
  }

  // Sanitize messages
  const sanitizedMessages = rawMessages.map((msg: any) => {
    if (msg.role === 'user') {
      return {
        ...msg,
        experimental_attachments: msg.experimental_attachments || [],
        parts: msg.parts || [{ type: 'text', text: msg.content || '' }]
      };
    }
    return msg;
  });

    const messages = convertToModelMessages
      ? await convertToModelMessages(sanitizedMessages)
      : sanitizedMessages;

    // Initialize custom provider to ensure API key is trimmed and explicitly passed
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
- **Sistem Coretax & Tahun 2025/2026**: WAJIB merujuk pada regulasi dan prosedur terbaru tahun pajak 2025/2026. Tinggalkan istilah dan langkah-langkah lawas DJP Online tahun 2024 ke bawah jika sudah digantikan oleh sistem Coretax. Panduan membuat e-Billing, pendaftaran NPWP (sekarang NIK), dan lapor SPT harus merujuk ke modul Coretax yang berlaku saat ini.

## FORMAT OUTPUT KHUSUS (COLORED OUTPUT)
Jika pengguna meminta simulasi perhitungan, template surat (SP2DK), atau kesimpulan spesifik yang butuh penekanan visual, gunakan format blockquote peringatan berikut agar aplikasi merendernya dalam boks berwarna elegan:
- Untuk Hasil Kalkulasi / Kesimpulan Penting: Awali dengan \`> [!NOTE]\`
- Untuk Peringatan Jatuh Tempo / Denda: Awali dengan \`> [!WARNING]\`
- Untuk Dokumen / Template: Awali dengan \`> [!IMPORTANT]\`
Pastikan spasi dan format sesuai standar GitHub markdown alert. 

## PENOLAKAN TOPIK DI LUAR PAJAK
Jika ditanya hal di luar pajak (resep masakan, koding), jawab sopan: "Maaf, saya hanya dilatih khusus untuk urusan perpajakan dan Coretax Indonesia."

Jika pengguna melampirkan gambar/faktur, analisis dokumen tersebut secara langsung dan berikan ringkasan angka pajaknya.`,
      messages,
    });

    // Manually consume textStream with error handling.
    // toTextStreamResponse() swallows errors silently, so we must handle them ourselves.
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
          hasContent = true; // Prevent fallback from running
          console.error('Stream iteration error:', error);
          const raw = String(error?.responseBody || error?.message || error || '');
          let errorMsg = '⚠️ Terjadi kesalahan saat menghubungi AI.';
          if (raw.includes('leaked') || raw.includes('PERMISSION_DENIED')) {
            errorMsg = '⚠️ **API Key Bermasalah** — API Key Gemini telah dinonaktifkan oleh Google karena terdeteksi bocor. Silakan hubungi admin untuk mengganti API key.';
          } else if (raw.includes('quota') || raw.includes('RESOURCE_EXHAUSTED')) {
            errorMsg = '⚠️ **Kuota Habis** — Kuota API Gemini telah terpakai. Silakan coba lagi nanti.';
          } else if (raw.includes('API key not valid')) {
            errorMsg = '⚠️ **API Key Tidak Valid** — Kunci API yang dimasukkan salah atau ada kesalahan pengetikan.';
          } else {
            errorMsg = `⚠️ **Kesalahan:** ${error?.message || raw || 'Gagal menghubungi layanan AI.'}`;
          }
          controller.enqueue(encoder.encode(errorMsg));
        }

        // If stream ended with no content, the API likely failed silently (e.g. safety filters)
        if (!hasContent) {
          try {
            // result.response is a promise that may contain error details
            const resp = await Promise.race([
              result.response,
              new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
            ]);
            console.error('Silent failure API Response:', resp);
          } catch (e: any) {
            console.error('Silent failure API Error:', e);
          }
          controller.enqueue(encoder.encode(
            '⚠️ **Gagal mendapatkan respons dari AI.**\n\nPermintaan Anda mungkin diblokir oleh filter keamanan (Safety Filter) Gemini atau respons kosong.'
          ));
        }

        controller.close();
      },
    });

    return new Response(textStream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
}
