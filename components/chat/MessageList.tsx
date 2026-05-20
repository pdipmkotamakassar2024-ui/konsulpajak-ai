"use client";

import { UIMessage } from "ai";

// For future RAG implementation
interface ExtendedMessage extends UIMessage {
  legalSources?: { name: string; url: string; pasal?: string }[];
}

function formatContent(text: string) {
  // Simple markdown-like formatting
  return text
    .split("\n")
    .map((line, i) => {
      // Bold
      const parts = line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={j}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      // Bullet points
      if (line.trim().startsWith("•") || line.trim().startsWith("-")) {
        return (
          <div key={i} style={{ display: "flex", gap: "8px", marginTop: "2px" }}>
            <span style={{ color: "var(--primary-light)", flexShrink: 0 }}>•</span>
            <span>{parts}</span>
          </div>
        );
      }

      if (line === "") return <div key={i} style={{ height: "8px" }} />;

      return <div key={i}>{parts}</div>;
    });
}

function getMessageText(msg: any): string {
  if (typeof msg.content === 'string') return msg.content;
  if (typeof msg.text === 'string') return msg.text;
  if (Array.isArray(msg.parts)) {
    return msg.parts.map((p: any) => p.text || '').join('');
  }
  return '';
}

interface MessageListProps {
  messages: any[];
  isTyping: boolean;
}

export default function MessageList({ messages, isTyping }: MessageListProps) {
  return (
    <div className="messages-container">
      {messages.map((msg) => (
        <div key={msg.id} className="message-row">
          {msg.role === "user" ? (
            // User message
            <div className="message-user">
              <div className="message-user-bubble">{getMessageText(msg)}</div>
            </div>
          ) : (
            // AI message
            <div className="message-ai">
              {/* Avatar */}
              <div className="message-ai-avatar">AI</div>

              {/* Content */}
              <div className="message-ai-content">
                <div className="message-ai-name">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  KonsulPajak AI
                  <span style={{
                    fontSize: "11px",
                    color: "var(--text-faint)",
                    fontWeight: "400",
                    marginLeft: "4px",
                  }}>
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                <div className="message-ai-text">
                  {formatContent(getMessageText(msg))}
                </div>

                {/* Legal sources */}
                {(msg as ExtendedMessage).legalSources && ((msg as ExtendedMessage).legalSources?.length ?? 0) > 0 && (
                  <div className="legal-sources">
                    <span style={{ fontSize: "11.5px", color: "var(--text-faint)", width: "100%", marginBottom: "4px" }}>
                      📎 Sumber Hukum:
                    </span>
                    {(msg as ExtendedMessage).legalSources!.map((src) => (
                      <a
                        key={src.name}
                        href={src.url}
                        className="legal-source-chip"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        {src.name}
                        {src.pasal && (
                          <span style={{ opacity: 0.7, fontWeight: "400" }}>· {src.pasal}</span>
                        )}
                      </a>
                    ))}
                  </div>
                )}

                {/* Message actions */}
                <div className="message-actions">
                  <button className="msg-action-btn" title="Salin jawaban" aria-label="Salin jawaban">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Salin
                  </button>
                  <button className="msg-action-btn" title="Beri penilaian bagus" aria-label="Jawaban bagus">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
                      <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                    </svg>
                    Bagus
                  </button>
                  <button className="msg-action-btn" title="Ulangi jawaban" aria-label="Ulangi jawaban">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="1 4 1 10 7 10" />
                      <path d="M3.51 15a9 9 0 1 0 .49-4.39" />
                    </svg>
                    Ulangi
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Typing indicator */}
      {isTyping && (
        <div className="typing-indicator">
          <div className="message-ai-avatar">AI</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div className="message-ai-name">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              KonsulPajak AI
              <span style={{ fontSize: "11px", color: "var(--success)", fontWeight: "500" }}>
                sedang mengetik…
              </span>
            </div>
            <div className="typing-dots">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
