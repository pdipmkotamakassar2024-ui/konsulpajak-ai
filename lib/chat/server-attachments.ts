import type { ChatAttachment } from "./types";
import { stripDataUrlPrefix, validateAttachmentList } from "./attachments";

export interface ValidatedAttachment extends ChatAttachment {
  buffer: Buffer;
}

function hasExpectedSignature(type: string, buffer: Buffer) {
  if (type === "application/pdf") return buffer.subarray(0, 5).toString("ascii") === "%PDF-";
  if (type === "image/jpeg") return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (type === "image/png") return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (type === "image/webp") return buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP";
  return false;
}

export function validateAndDecodeAttachments(input: unknown): { attachments: ValidatedAttachment[]; error: string | null } {
  if (!Array.isArray(input)) return { attachments: [], error: "Format lampiran tidak valid." };

  const attachments = input as ChatAttachment[];
  const metaError = validateAttachmentList(attachments);
  if (metaError) return { attachments: [], error: metaError };

  const decoded: ValidatedAttachment[] = [];
  for (const attachment of attachments) {
    if (!attachment || typeof attachment.name !== "string" || typeof attachment.type !== "string" ||
        !Number.isSafeInteger(attachment.size) || attachment.size < 1 || typeof attachment.data !== "string") {
      return { attachments: [], error: "Metadata lampiran tidak valid." };
    }

    const base64 = stripDataUrlPrefix(attachment.data).replace(/\s/g, "");
    if (!base64 || base64.length % 4 !== 0 || !/^[A-Za-z0-9+/]+={0,2}$/.test(base64)) {
      return { attachments: [], error: `Isi file ${attachment.name} bukan Base64 yang valid.` };
    }

    const buffer = Buffer.from(base64, "base64");
    if (buffer.length !== attachment.size) {
      return { attachments: [], error: `Ukuran file ${attachment.name} tidak sesuai dengan data yang dikirim.` };
    }
    if (!hasExpectedSignature(attachment.type, buffer)) {
      return { attachments: [], error: `Format asli file ${attachment.name} tidak sesuai dengan tipe yang dipilih.` };
    }

    decoded.push({ ...attachment, data: base64, buffer });
  }

  return { attachments: decoded, error: null };
}
