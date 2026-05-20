import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await req.json();
  const rawMessages = body.messages;

  // If no Gemini API key is provided, return a simulated mock streaming response
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    const encoder = new TextEncoder();
    const mockMessage = "Halo! Saya adalah KonsulPajak AI.\n\nSistem saat ini berjalan dalam mode **Offline/Demo** karena `GEMINI_API_KEY` belum dikonfigurasi. Untuk membuat saya bisa menjawab pertanyaan pajak secara nyata, silakan dapatkan API Key dari [Google AI Studio](https://aistudio.google.com/app/apikey) dan tambahkan ke file `.env.local` Anda.\n\nContoh respons yang akan Anda dapatkan jika sistem aktif:\n> Untuk UMKM dengan omzet di bawah Rp 500 juta setahun, tidak dikenakan Pajak Penghasilan (PPh) Final 0,5% sesuai dengan UU HPP No. 7 Tahun 2021.";

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

  // Convert UIMessage format (parts-based) to simple model messages (content-based)
  // SDK v6 useChat sends: { role, parts: [{ type: "text", text: "..." }] }
  // streamText expects: { role, content: "..." }
  const messages = Array.isArray(rawMessages) ? rawMessages.map((msg: any) => {
    // If message already has content as string, use it directly
    if (typeof msg.content === 'string') {
      return { role: msg.role, content: msg.content };
    }
    // If message has parts array (SDK v6 UIMessage format), extract text
    if (Array.isArray(msg.parts)) {
      const textContent = msg.parts
        .filter((p: any) => p.type === 'text')
        .map((p: any) => p.text)
        .join('');
      return { role: msg.role, content: textContent };
    }
    // Fallback
    return { role: msg.role, content: '' };
  }) : [];

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: "Anda adalah KonsulPajak AI, konsultan pajak pribadi berbasis AI untuk UMKM dan Profesional di Indonesia. Jawablah pertanyaan seputar pajak Indonesia dengan bahasa manusia yang ramah, mudah dimengerti, namun tetap profesional. Selalu mengacu pada hukum DJP atau Kemenkeu yang berlaku saat ini.",
    messages,
  });

  return result.toUIMessageStreamResponse();
}
