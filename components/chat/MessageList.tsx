"use client";

import { UIMessage } from "ai";

// For future RAG implementation
interface ExtendedMessage extends UIMessage {
  legalSources?: { name: string; url: string; pasal?: string }[];
}

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function formatContent(text: string) {
  // Use ReactMarkdown to properly parse asterisks, bold, italics, tables, and lists
  // and prevent raw unique characters from showing.
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        blockquote: ({ children, ...props }) => {
          // Check if this is a GitHub style alert (e.g. > [!NOTE], > [!WARNING], > [!IMPORTANT])
          let contentStr = "";
          if (children && Array.isArray(children)) {
            children.forEach((child: any) => {
              if (typeof child === "string") contentStr += child;
              else if (child && child.props && child.props.children) {
                if (typeof child.props.children === "string") contentStr += child.props.children;
                else if (Array.isArray(child.props.children)) contentStr += child.props.children.join("");
              }
            });
          } else if (typeof children === "string") {
            contentStr = children;
          }

          const isNote = contentStr.includes("[!NOTE]");
          const isWarning = contentStr.includes("[!WARNING]");
          const isImportant = contentStr.includes("[!IMPORTANT]");

          if (isNote || isWarning || isImportant) {
            let bgColor = "rgba(30, 144, 255, 0.1)";
            let borderColor = "rgba(30, 144, 255, 0.3)";
            let textColor = "var(--primary-light)";
            let icon = "💡";
            let type = "NOTE";

            if (isWarning) {
              bgColor = "rgba(245, 158, 11, 0.1)";
              borderColor = "rgba(245, 158, 11, 0.3)";
              textColor = "#fcd34d";
              icon = "⚠️";
              type = "WARNING";
            } else if (isImportant) {
              bgColor = "rgba(16, 185, 129, 0.1)";
              borderColor = "rgba(16, 185, 129, 0.3)";
              textColor = "#6ee7b7";
              icon = "📄";
              type = "IMPORTANT";
            }

            // Extract the actual content without the tag
            const parsedChildren: any = React.Children.map(children, (child: any) => {
              if (typeof child === "string") {
                return child.replace(/\[!(NOTE|WARNING|IMPORTANT)\]/, "");
              } else if (child && child.props && child.props.children) {
                if (typeof child.props.children === "string") {
                  return React.cloneElement(child, {}, child.props.children.replace(/\[!(NOTE|WARNING|IMPORTANT)\]/, ""));
                }
              }
              return child;
            });

            return (
              <div style={{
                background: bgColor,
                borderLeft: `4px solid ${borderColor}`,
                padding: "16px",
                margin: "12px 0",
                borderRadius: "0 8px 8px 0",
                color: "var(--text-primary)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: textColor, fontWeight: "600", fontSize: "14px" }}>
                  <span>{icon}</span> {type}
                </div>
                <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
                  {parsedChildren}
                </div>
              </div>
            );
          }

          // Normal blockquote
          return <blockquote {...props} style={{ borderLeft: "4px solid var(--border)", paddingLeft: "16px", color: "var(--text-secondary)", margin: "12px 0", fontStyle: "italic" }}>{children}</blockquote>;
        },
        a: ({ ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-light)", textDecoration: "underline", textUnderlineOffset: "4px" }} />,
        h1: ({ ...props }) => <h1 {...props} style={{ fontSize: "20px", fontWeight: "700", marginTop: "16px", marginBottom: "8px" }} />,
        h2: ({ ...props }) => <h2 {...props} style={{ fontSize: "18px", fontWeight: "600", marginTop: "16px", marginBottom: "8px" }} />,
        h3: ({ ...props }) => <h3 {...props} style={{ fontSize: "16px", fontWeight: "600", marginTop: "12px", marginBottom: "6px" }} />,
        p: ({ ...props }) => <p {...props} style={{ marginBottom: "8px", lineHeight: "1.6" }} />,
        ul: ({ ...props }) => <ul {...props} style={{ marginBottom: "8px", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "4px" }} />,
        ol: ({ ...props }) => <ol {...props} style={{ marginBottom: "8px", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "4px" }} />,
        li: ({ ...props }) => <li {...props} style={{ lineHeight: "1.5" }} />,
        table: ({ ...props }) => (
          <div style={{ overflowX: "auto", margin: "16px 0" }}>
            <table {...props} style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }} />
          </div>
        ),
        th: ({ ...props }) => <th {...props} style={{ border: "1px solid var(--border)", padding: "8px 12px", background: "rgba(255,255,255,0.05)", textAlign: "left" }} />,
        td: ({ ...props }) => <td {...props} style={{ border: "1px solid var(--border)", padding: "8px 12px" }} />,
      }}
    >
      {text}
    </ReactMarkdown>
  );
}

function getMessageText(msg: any): string {
  // SDK v6 (TextStreamChatTransport): text is stored in parts[] with type='text'
  // Check parts FIRST — content may be empty string even when parts has the real text
  if (Array.isArray(msg.parts) && msg.parts.length > 0) {
    const fromParts = msg.parts
      .filter((p: any) => p.type === 'text')
      .map((p: any) => p.text || '')
      .join('');
    if (fromParts) return fromParts;
  }
  // Fallback: direct content string
  if (typeof msg.content === 'string' && msg.content.trim()) return msg.content;
  // Last resort
  if (typeof msg.text === 'string' && msg.text.trim()) return msg.text;
  return '';
}

interface MessageListProps {
  messages: any[];
  isTyping: boolean;
  onRegenerate?: (messageId: string) => void | Promise<void>;
}

export default function MessageList({ messages, isTyping, onRegenerate }: MessageListProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [likedIds, setLikedIds] = React.useState<Set<string>>(new Set());
  const lastAssistantId = messages.findLast((message) => message.role === "assistant")?.id;

  const copyAnswer = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId((current) => current === id ? null : current), 1500);
  };

  const toggleLike = (id: string) => {
    setLikedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

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
                  <button className="msg-action-btn" title="Salin jawaban" aria-label="Salin jawaban" onClick={() => copyAnswer(msg.id, getMessageText(msg))}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    {copiedId === msg.id ? "Tersalin" : "Salin"}
                  </button>
                  <button className="msg-action-btn" title="Beri penilaian bagus" aria-label="Jawaban bagus" aria-pressed={likedIds.has(msg.id)} onClick={() => toggleLike(msg.id)} style={likedIds.has(msg.id) ? { color: "var(--primary)" } : undefined}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
                      <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                    </svg>
                    {likedIds.has(msg.id) ? "Disukai" : "Bagus"}
                  </button>
                  {msg.id === lastAssistantId && (
                    <button className="msg-action-btn" title="Ulangi jawaban" aria-label="Ulangi jawaban" disabled={isTyping} onClick={() => onRegenerate?.(msg.id)}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="1 4 1 10 7 10" />
                        <path d="M3.51 15a9 9 0 1 0 .49-4.39" />
                      </svg>
                      Ulangi
                    </button>
                  )}
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
