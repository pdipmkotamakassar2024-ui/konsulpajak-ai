import { describe, expect, it } from "vitest";
import { MAX_TOTAL_ATTACHMENT_BYTES, validateAttachmentList, stripDataUrlPrefix } from "./attachments";
import { validateAndDecodeAttachments } from "./server-attachments";

describe("attachment validation", () => {
  it("accepts supported image and PDF metadata", () => {
    expect(validateAttachmentList([
      { name: "faktur.png", type: "image/png", size: 1024 },
      { name: "tagihan.pdf", type: "application/pdf", size: 2048 },
    ])).toBeNull();
  });

  it("rejects unsupported files and too many attachments", () => {
    expect(validateAttachmentList([{ name: "data.exe", type: "application/x-msdownload", size: 1 }])).toContain("tidak didukung");
    expect(validateAttachmentList([
      { name: "1.png", type: "image/png", size: 1 },
      { name: "2.png", type: "image/png", size: 1 },
      { name: "3.png", type: "image/png", size: 1 },
      { name: "4.png", type: "image/png", size: 1 },
    ])).toContain("Maksimal");
  });

  it("strips data URL prefixes", () => {
    expect(stripDataUrlPrefix("data:image/png;base64,abc123")).toBe("abc123");
  });

  it("rejects attachment totals above the request budget", () => {
    expect(validateAttachmentList([
      { name: "1.png", type: "image/png", size: MAX_TOTAL_ATTACHMENT_BYTES / 2 + 1 },
      { name: "2.png", type: "image/png", size: MAX_TOTAL_ATTACHMENT_BYTES / 2 + 1 },
    ])).toContain("Total lampiran");
  });

  it("validates decoded length and file signature on the server", () => {
    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1]);
    expect(validateAndDecodeAttachments([{ name: "ok.png", type: "image/png", size: png.length, data: png.toString("base64") }]).error).toBeNull();
    expect(validateAndDecodeAttachments([{ name: "fake.png", type: "image/png", size: 4, data: Buffer.from("evil").toString("base64") }]).error).toContain("Format asli");
  });
});
