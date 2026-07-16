import type { ChatAttachment } from "./types";

export const MAX_ATTACHMENTS = 3;
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
export const MAX_PDF_BYTES = 3 * 1024 * 1024;
export const MAX_TOTAL_ATTACHMENT_BYTES = 3 * 1024 * 1024;

export const ALLOWED_ATTACHMENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;

export function validateAttachmentMeta(file: Pick<ChatAttachment, "name" | "type" | "size">) {
  if (!ALLOWED_ATTACHMENT_TYPES.includes(file.type as typeof ALLOWED_ATTACHMENT_TYPES[number])) {
    return `File ${file.name} tidak didukung. Gunakan JPG, PNG, WebP, atau PDF.`;
  }

  const maxSize = file.type === "application/pdf" ? MAX_PDF_BYTES : MAX_IMAGE_BYTES;
  if (file.size > maxSize) {
    const mb = Math.round(maxSize / 1024 / 1024);
    return `File ${file.name} terlalu besar. Batas ${mb} MB.`;
  }

  return null;
}

export function validateAttachmentList(files: Array<Pick<ChatAttachment, "name" | "type" | "size">>) {
  if (files.length > MAX_ATTACHMENTS) {
    return `Maksimal ${MAX_ATTACHMENTS} lampiran per pesan.`;
  }

  for (const file of files) {
    const error = validateAttachmentMeta(file);
    if (error) return error;
  }

  const totalSize = files.reduce((total, file) => total + file.size, 0);
  if (totalSize > MAX_TOTAL_ATTACHMENT_BYTES) {
    return "Total lampiran terlalu besar. Batas total 3 MB per pesan.";
  }

  return null;
}

export function stripDataUrlPrefix(value: string) {
  const marker = ";base64,";
  const markerIndex = value.indexOf(marker);
  return markerIndex >= 0 ? value.slice(markerIndex + marker.length) : value;
}
