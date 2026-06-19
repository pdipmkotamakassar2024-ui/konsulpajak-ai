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
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;

    // LIMIT: user login 25/hari, tamu sudah dicek di client
    if (user) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'user')
        .gte('created_at', today.toISOString());
      
      userMsgCount = count || 0;
    }
  } catch (err: any) {
    console.error('[route] Supabase error:', err?.message);
    // Continue without user if supabase fails (e.g., missing env vars)
  }

  if (userMsgCount >= 25) {
    return makeTextResponse(
      '**LIMIT HARIAN TERCAPAI**\n\nMaaf, Anda telah mencapai batas 25 pertanyaan untuk hari ini. Silakan kembali besok atau upgrade paket Anda di /harga.'
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
      model: google('gemini-1.5-flash'),
      system: `Anda adalah **KonsulPajak AI** — konsultan pajak cerdas berbasis AI untuk UMKM, karyawan, profesional, dan entitas bisnis di Indonesia. Anda WAJIB sepenuhnya berorientasi pada regulasi terbaru dan sistem **Coretax DJP**. 

## IDENTITAS & GAYA BAHASA
- **Singkat & Padat**: Berikan jawaban yang paling inti dan praktis (to-the-point).
- **TIDAK PERLU Menjelaskan Undang-Undang secara detail**: Cukup lampirkan nama peraturannya sebagai referensi di akhir jawaban.
- **Kasual & Profesional**: Bahasa Indonesia baku tapi santai.
- **Hindari Blank Answer**: Jika pertanyaan abu-abu tentang pajak, asumsikan konteks pajak Indonesia dan pandu pengguna.

## RUANG LINGKUP — PAJAK INDONESIA & CORETAX
- PPh 21, 22, 23, 25/29, 26, dan Final (termasuk UMKM 0.5%)
- PPN 11% & e-Faktur
- SPT Tahunan & Masa, e-Filing, SP2DK
- Sistem Coretax 2025/2026: Merujuk pada regulasi dan prosedur terbaru

## FORMAT OUTPUT
Untuk kalkulasi/kesimpulan penting: awali dengan \`> [!NOTE]\`
Untuk peringatan jatuh tempo/denda: awali dengan \`> [!WARNING]\`
Untuk template dokumen: awali dengan \`> [!IMPORTANT]\`

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
