import { describe, expect, it } from "vitest";
import { validateAttachmentList, stripDataUrlPrefix } from "./attachments";

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
});
