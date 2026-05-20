"use client";

import { useRef, useEffect, useState } from "react";

interface ChatInputBarProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInputBar({ onSend, isLoading }: ChatInputBarProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "24px";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "24px";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input-wrapper">
      <div className="chat-input-bar" style={{ maxWidth: "760px", width: "100%" }}>
        {/* Attachment button */}
        <button
          id="attach-file-btn"
          className="input-icon-btn"
          title="Upload dokumen (PDF, foto, Excel)"
          aria-label="Upload dokumen"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          id="chat-input"
          className="chat-textarea"
          placeholder="Tanya apa saja tentang pajak Indonesia…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isLoading}
          aria-label="Input pertanyaan pajak"
        />

        {/* Right actions */}
        <div className="chat-input-actions">
          {/* Char count if getting long */}
          {value.length > 200 && (
            <span style={{ fontSize: "11px", color: "var(--text-faint)", flexShrink: 0 }}>
              {value.length}
            </span>
          )}

          {/* Send button */}
          <button
            id="send-message-btn"
            className="send-btn"
            onClick={handleSend}
            disabled={!value.trim() || isLoading}
            title="Kirim (Enter)"
            aria-label="Kirim pesan"
          >
            {isLoading ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="input-disclaimer">
        KonsulPajak AI dapat membuat kesalahan. Verifikasi informasi penting dengan konsultan berlisensi.&nbsp;
        <a href="/privasi" style={{ color: "var(--text-faint)", textDecoration: "underline", textUnderlineOffset: "2px" }}>
          Privasi
        </a>
      </p>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
