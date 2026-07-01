import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, type ModelMessage } from "ai";
import { CORETAX_SYSTEM_PROMPT } from "@/lib/ai/coretax-prompt";
import type { ChatAttachment } from "@/lib/chat/types";
import { stripDataUrlPrefix, validateAttachmentList } from "@/lib/chat/attachments";
import { FREE_CHAT_LIMIT, QUOTA_WINDOW_MS, isFreeQuotaExceeded } from "@/lib/chat/quota";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export const maxDuration = 60;
export const runtime = "nodejs";

const GUEST_COOKIE = "kp_guest_id";

type CoreMsg = { role: "user" | "assistant"; content: string };

function makeTextResponse(text: string, headers?: HeadersInit): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const words = text.split(" ");
      for (let i = 0; i < words.length; i += 1) {
        await new Promise((resolve) => setTimeout(resolve, 15));
        controller.enqueue(encoder.encode(words[i] + (i < words.length - 1 ? " " : "")));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      ...headers,
    },
  });
}

function extractText(msg: any): string {
  if (Array.isArray(msg.parts)) {
    const fromParts = msg.parts
      .filter((part: any) => part.type === "text")
      .map((part: any) => String(part.text || ""))
      .join("");
    if (fromParts.trim()) return fromParts.trim();
  }

  if (typeof msg.content === "string" && msg.content.trim()) {
    return msg.content.trim();
  }

  if (typeof msg.text === "string" && msg.text.trim()) {
    return msg.text.trim();
  }

  return "";
}

function parseCookie(header: string | null, name: string) {
  if (!header) return null;
  const parts = header.split(";").map((part) => part.trim());
  const match = parts.find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

function guestCookieHeader(guestId: string) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${GUEST_COOKIE}=${encodeURIComponent(guestId)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000${secure}`;
}

function buildCoreMessages(rawMessages: any[]) {
  const messages: CoreMsg[] = [];

  for (const msg of rawMessages) {
    if (msg.role !== "user" && msg.role !== "assistant") continue;
    const text = extractText(msg);
    if (text) messages.push({ role: msg.role, content: text });
  }

  return messages;
}

function getLastUserText(messages: CoreMsg[]) {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i].role === "user") return messages[i].content;
  }
  return "";
}

async function extractPdfText(attachment: ChatAttachment) {
  const { PDFParse } = await import("pdf-parse");
  const buffer = Buffer.from(stripDataUrlPrefix(attachment.data), "base64");
  const parser = new PDFParse({ data: buffer });

  try {
    const parsed = await parser.getText();
    return String(parsed.text || "").trim();
  } finally {
    await parser.destroy();
  }
}

async function buildModelMessages(coreMessages: CoreMsg[], attachments: ChatAttachment[]) {
  const modelMessages: ModelMessage[] = coreMessages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  if (attachments.length === 0) return modelMessages;

  const lastUserIndex = modelMessages.findLastIndex((msg) => msg.role === "user");
  if (lastUserIndex < 0) return modelMessages;

  const baseText = String(modelMessages[lastUserIndex].content || "");
  const contentParts: any[] = [{ type: "text", text: baseText }];
  const pdfTexts: string[] = [];

  for (const attachment of attachments) {
    if (attachment.type === "application/pdf") {
      const text = await extractPdfText(attachment);
      if (!text) {
        throw new Error(`PDF ${attachment.name} tidak berisi teks yang bisa dibaca. Coba unggah gambar halaman atau PDF OCR.`);
      }
      pdfTexts.push(`\n\n--- Isi PDF: ${attachment.name} ---\n${text.slice(0, 12000)}`);
      continue;
    }

    contentParts.push({
      type: "image",
      image: Buffer.from(stripDataUrlPrefix(attachment.data), "base64"),
      mediaType: attachment.type,
    });
  }

  if (pdfTexts.length > 0) {
    contentParts[0].text = `${baseText}${pdfTexts.join("")}`;
  }

  modelMessages[lastUserIndex] = {
    role: "user",
    content: contentParts,
  };

  return modelMessages;
}

function messageForStorage(text: string, attachments: ChatAttachment[]) {
  if (attachments.length === 0) return text;
  const names = attachments.map((item) => item.name).join(", ");
  return `${text || "Tolong analisis lampiran ini."}\n\n[Lampiran: ${names}]`;
}

async function getActiveSubscription(admin: ReturnType<typeof createAdminClient>, email?: string | null) {
  if (!email) return false;

  const { data } = await admin
    .from("subscriptions")
    .select("expires_at")
    .eq("email", email)
    .maybeSingle();

  return Boolean(data?.expires_at && new Date(data.expires_at) > new Date());
}

async function verifyChatOwner(admin: ReturnType<typeof createAdminClient>, chatId: string, userId: string) {
  const { data, error } = await admin
    .from("chats")
    .select("id")
    .eq("id", chatId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return Boolean(data);
}

async function enforceQuota(params: {
  admin: ReturnType<typeof createAdminClient>;
  subjectType: "user" | "guest";
  subjectId: string;
  userId?: string;
  email?: string | null;
  subscribed: boolean;
  attachments: number;
}) {
  const { admin, subjectType, subjectId, userId, email, subscribed, attachments } = params;
  const windowStart = new Date(Date.now() - QUOTA_WINDOW_MS).toISOString();

  if (!subscribed) {
    const { count, error } = await admin
      .from("usage_events")
      .select("id", { count: "exact", head: true })
      .eq("subject_type", subjectType)
      .eq("subject_id", subjectId)
      .eq("event_type", "chat_message")
      .gte("created_at", windowStart);

    if (error) throw error;
    if (isFreeQuotaExceeded(count || 0)) {
      return false;
    }
  }

  const { error: insertError } = await admin.from("usage_events").insert({
    subject_type: subjectType,
    subject_id: subjectId,
    user_id: userId || null,
    email: email || null,
    event_type: "chat_message",
    metadata: { subscribed, attachments },
  });

  if (insertError) throw insertError;
  return true;
}

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return makeTextResponse("Request tidak valid.");
  }

  let admin: ReturnType<typeof createAdminClient>;
  try {
    admin = createAdminClient();
  } catch (error: any) {
    return makeTextResponse(`Konfigurasi server belum lengkap: ${error.message}`);
  }

  const rawMessages: any[] = Array.isArray(body.messages) ? body.messages : [];
  const attachments: ChatAttachment[] = Array.isArray(body.attachments) ? body.attachments : [];
  const attachmentError = validateAttachmentList(attachments);
  if (attachmentError) return makeTextResponse(attachmentError);

  const coreMessages = buildCoreMessages(rawMessages);
  const lastUserText = getLastUserText(coreMessages);

  if (coreMessages.length === 0 || !lastUserText) {
    return makeTextResponse("Pesan tidak diterima dengan benar. Silakan coba lagi.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const cookieHeader = req.headers.get("cookie");
  let guestId = parseCookie(cookieHeader, GUEST_COOKIE);
  let setCookie: string | undefined;

  if (!user && !guestId) {
    guestId = crypto.randomUUID();
    setCookie = guestCookieHeader(guestId);
  }

  const subjectType = user ? "user" : "guest";
  const subjectId = user?.id || guestId;
  if (!subjectId) return makeTextResponse("Sesi pengguna tidak valid. Silakan refresh halaman.");

  const hasActiveSubscription = user ? await getActiveSubscription(admin, user.email) : false;

  try {
    const allowed = await enforceQuota({
      admin,
      subjectType,
      subjectId,
      userId: user?.id,
      email: user?.email,
      subscribed: hasActiveSubscription,
      attachments: attachments.length,
    });

    if (!allowed) {
      const headers = setCookie ? { "Set-Cookie": setCookie } : undefined;
      return makeTextResponse(
        `**LIMIT HARIAN TERCAPAI**\n\nMaaf, Anda telah mencapai batas ${FREE_CHAT_LIMIT} pertanyaan gratis dalam 24 jam terakhir. Silakan kembali nanti atau upgrade Paket Pro Anda di menu Harga.`,
        headers
      );
    }
  } catch (error: any) {
    return makeTextResponse(`Gagal memeriksa kuota: ${error.message}`);
  }

  const chatId = typeof body.chatId === "string" ? body.chatId : null;
  if (user && chatId) {
    const ownsChat = await verifyChatOwner(admin, chatId, user.id).catch(() => false);
    if (!ownsChat) return makeTextResponse("Chat tidak ditemukan atau bukan milik Anda.");
  }

  const apiKey = (process.env.GOOGLE_GENERATIVE_AI_API_KEY || "").trim();
  if (!apiKey) {
    return makeTextResponse(
      "KonsulPajak AI berjalan dalam mode Demo karena API Key belum dikonfigurasi. Hubungi admin untuk mengaktifkan layanan AI."
    );
  }

  let modelMessages: ModelMessage[];
  try {
    modelMessages = await buildModelMessages(coreMessages, attachments);
  } catch (error: any) {
    return makeTextResponse(error.message || "Lampiran gagal diproses. Silakan coba file lain.");
  }

  if (user && chatId) {
    await admin.from("messages").insert({
      chat_id: chatId,
      role: "user",
      content: messageForStorage(lastUserText, attachments),
    });
    await admin.from("chats").update({ updated_at: new Date().toISOString() }).eq("id", chatId);
  }

  const google = createGoogleGenerativeAI({ apiKey });
  let result: any;

  try {
    result = streamText({
      model: google("gemini-2.5-flash"),
      system: CORETAX_SYSTEM_PROMPT,
      messages: modelMessages,
    });
  } catch (error: any) {
    return makeTextResponse(`Gagal menginisialisasi AI: ${error?.message || "Unknown error"}`);
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let fullText = "";
      let hasContent = false;

      try {
        for await (const chunk of result.textStream) {
          if (!chunk) continue;
          hasContent = true;
          fullText += chunk;
          controller.enqueue(encoder.encode(chunk));
        }

        if (!hasContent) {
          controller.enqueue(encoder.encode("Respons AI kosong. Silakan coba lagi dengan pertanyaan yang lebih spesifik."));
        }

        if (user && chatId && fullText.trim()) {
          await admin.from("messages").insert({
            chat_id: chatId,
            role: "assistant",
            content: fullText.trim(),
          });
          await admin.from("chats").update({ updated_at: new Date().toISOString() }).eq("id", chatId);
        }
      } catch (error: any) {
        const raw = String(error?.responseBody || error?.message || error || "");
        let errorMsg = "Terjadi kesalahan saat memproses respons AI.";
        if (raw.includes("PERMISSION_DENIED") || raw.includes("API key not valid")) {
          errorMsg = "API Key Gemini tidak valid atau telah dinonaktifkan. Hubungi admin.";
        } else if (raw.includes("RESOURCE_EXHAUSTED") || raw.includes("quota")) {
          errorMsg = "Kuota API Gemini telah terpakai. Coba lagi nanti.";
        } else if (raw.includes("INVALID_ARGUMENT")) {
          errorMsg = `Format pesan salah: ${raw.slice(0, 200)}`;
        }
        controller.enqueue(encoder.encode(`\n\n${errorMsg}`));
      } finally {
        controller.close();
      }
    },
  });

  const headers = new Headers({ "Content-Type": "text/plain; charset=utf-8" });
  if (setCookie) headers.set("Set-Cookie", setCookie);

  return new Response(stream, { headers });
}
