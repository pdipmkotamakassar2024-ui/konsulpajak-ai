import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';
import { createClient } from '@/utils/supabase/server';

export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await req.json();
  console.log("INCOMING BODY:", body);
  const rawMessages = body.messages || [];
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // LIMIT LOGIC: Free users are limited to 5 messages.
  if (user) {
    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'user');
      
    // You would typically check if user is premium here. Assuming no premium flag yet:
    if (count !== null && count >= 5) {
      const encoder = new TextEncoder();
      const mockMessage = "> **LIMIT TERCAPAI**\\n\\nMaaf, Anda telah mencapai batas 5 pertanyaan gratis. Untuk melanjutkan konsultasi, analisis dokumen, dan tanya jawab tanpa batas, silakan [Upgrade ke Premium](/offline).";
      const stream = new ReadableStream({
        async start(controller) {
          const chunks = mockMessage.split(' ');
          for (let i = 0; i < chunks.length; i++) {
            await new Promise((resolve) => setTimeout(resolve, 50));
            const chunk = chunks[i] + (i === chunks.length - 1 ? '' : ' ');
            controller.enqueue(encoder.encode(`0:${JSON.stringify(chunk)}\n`));
          }
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'x-vercel-ai-data-stream': 'v1',
        },
      });
    }
  }

  // If no Gemini API key is provided, return a simulated mock streaming response
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    const encoder = new TextEncoder();
    const mockMessage = "Halo! Saya adalah KonsulPajak AI.\n\nSistem saat ini berjalan dalam mode **Offline/Demo** karena `GEMINI_API_KEY` belum dikonfigurasi.";
    const stream = new ReadableStream({
      async start(controller) {
        const chunks = mockMessage.split(' ');
        for (let i = 0; i < chunks.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 50));
          const chunk = chunks[i] + (i === chunks.length - 1 ? '' : ' ');
          controller.enqueue(encoder.encode(`0:${JSON.stringify(chunk)}\n`));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'x-vercel-ai-data-stream': 'v1',
      },
    });
  }

  // Sanitize messages to prevent "Cannot read properties of undefined (reading 'map')" in convertToModelMessages
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

  // Use convertToModelMessages to properly handle attachments and text (it returns a Promise)
  const messages = convertToModelMessages ? await convertToModelMessages(sanitizedMessages) : sanitizedMessages;

  const result = streamText({
    model: google('gemini-2.5-flash'),
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
- **Sistem Coretax**: Tinggalkan istilah dan langkah-langkah lawas DJP Online jika sudah digantikan oleh sistem Coretax. Panduan membuat e-Billing, pendaftaran NPWP (sekarang NIK), dan lapor SPT harus merujuk ke modul Coretax.

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

  return result.toTextStreamResponse();
}
