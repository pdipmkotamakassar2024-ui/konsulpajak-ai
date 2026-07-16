"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import WelcomeState from "./WelcomeState";
import MessageList from "./MessageList";
import ChatInputBar from "./ChatInputBar";

import { User } from "@supabase/supabase-js";
import type { ChatAttachment, ChatSummary, StoredChatMessage } from "@/lib/chat/types";

export default function ChatInterface({ user }: { user: User | null }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const activeChatIdRef = useRef<string | null>(null);
  const [chatListVersion, setChatListVersion] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ─── Dark mode ───────────────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("darkMode", String(next));
      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  };
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    activeChatIdRef.current = activeChatId;
  }, [activeChatId]);

  // ─── useChat dengan API yang benar untuk @ai-sdk/react v3 / ai v6 ────────
  // Versi ini menggunakan sendMessage (bukan append), dan DefaultChatTransport
  const { messages, status, sendMessage, setMessages, regenerate, error, clearError } = useChat({
    transport: new TextStreamChatTransport({ api: '/api/chat' }),
    onFinish: () => {
      if (user) setChatListVersion((value) => value + 1);
    },
  });
  // ─────────────────────────────────────────────────────────────────────────

  const isLoading = status === "submitted" || status === "streaming";

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Tutup sidebar di layar kecil
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, []);

  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
  };

  const loadChat = async (id: string) => {
    if (!user) return;
    setActiveChatId(id);
    setMessages([]);

    const res = await fetch(`/api/chats/${id}/messages`);
    if (!res.ok) {
      window.alert("Gagal memuat riwayat chat.");
      return;
    }

    const payload = await res.json();
    const data = (payload.data || []) as StoredChatMessage[];

    if (data) {
      const uiMessages = data.map((msg) => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        parts: [{ type: 'text' as const, text: msg.content }],
        createdAt: msg.created_at ? new Date(msg.created_at) : undefined,
      }));
      setMessages(uiMessages as any);
    }
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const createChat = async (title: string) => {
    const res = await fetch("/api/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      throw new Error(payload.error || "Gagal membuat chat baru.");
    }

    const payload = await res.json();
    return payload.data as ChatSummary;
  };

  const handleSend = async (content: string, attachments?: ChatAttachment[]) => {
    if ((!content.trim() && (!attachments || attachments.length === 0)) || isLoading) return;

    let currentChatId = activeChatId;
    const displayText = content || "Tolong analisis lampiran ini.";

    // Buat chat baru jika ini pesan pertama (user login)
    if (!currentChatId && user) {
      const chat = await createChat(displayText);
      currentChatId = chat.id;
      setActiveChatId(chat.id);
      activeChatIdRef.current = chat.id;
      setChatListVersion((value) => value + 1);
    }

    // ─── Kirim ke AI SDK menggunakan sendMessage ───────────────────────────
    // API yang benar untuk @ai-sdk/react v3.x + ai v6.x
    await sendMessage(
      { text: displayText },
      { body: { chatId: currentChatId, attachments: attachments || [] } }
    );
    // ──────────────────────────────────────────────────────────────────────
  };

  const deleteChat = async (id: string) => {
    const response = await fetch(`/api/chats/${id}`, { method: "DELETE" });
    if (!response.ok) {
      window.alert("Chat gagal dihapus.");
      return;
    }
    if (activeChatIdRef.current === id) handleNewChat();
    setChatListVersion((value) => value + 1);
  };

  const handleRegenerate = async (messageId: string) => {
    if (isLoading) return;
    clearError();
    await regenerate({ messageId, body: { chatId: activeChatIdRef.current, attachments: [], isRegeneration: true } });
  };

  return (
    <div className="app-layout">
      {/* Background ambient orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
        onSelectChat={loadChat}
        onDeleteChat={deleteChat}
        onPromptClick={handleSend}
        user={user}
        refreshKey={chatListVersion}
      />

      {/* Main content */}
      <div className="main-content">
        {/* Top bar */}
        <TopBar
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          sidebarOpen={sidebarOpen}
          user={user}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />

        {/* Scrollable chat area */}
        <div className="chat-scroll-area">
          {error && (
            <div role="alert" style={{ margin: "12px auto", maxWidth: "760px", padding: "12px 16px", borderRadius: "10px", background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.25)", color: "#dc2626", fontSize: "13px", display: "flex", justifyContent: "space-between", gap: "12px" }}>
              <span>{error.message || "Permintaan gagal. Silakan coba kembali."}</span>
              <button onClick={clearError} aria-label="Tutup pesan kesalahan" style={{ border: 0, background: "transparent", color: "inherit", cursor: "pointer", fontWeight: 700 }}>×</button>
            </div>
          )}
          {messages.length === 0 ? (
            <WelcomeState />
          ) : (
            <MessageList messages={messages} isTyping={isLoading} onRegenerate={handleRegenerate} />
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input bar — selalu tampil */}
        <ChatInputBar onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  );
}
