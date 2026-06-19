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
import { createClient } from "@/utils/supabase/client";

// ─── Guest rate-limit helpers (5 pertanyaan per 24 jam per perangkat) ─────────
const GUEST_LIMIT = 5;
const GUEST_KEY = "guestRateLimit";

interface GuestRateData {
  count: number;
  resetAt: number; // timestamp ms
}

function getGuestData(): GuestRateData {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    if (!raw) return { count: 0, resetAt: Date.now() + 24 * 60 * 60 * 1000 };
    const parsed: GuestRateData = JSON.parse(raw);
    // Reset jika sudah lewat 24 jam
    if (Date.now() > parsed.resetAt) {
      const fresh = { count: 0, resetAt: Date.now() + 24 * 60 * 60 * 1000 };
      localStorage.setItem(GUEST_KEY, JSON.stringify(fresh));
      return fresh;
    }
    return parsed;
  } catch {
    return { count: 0, resetAt: Date.now() + 24 * 60 * 60 * 1000 };
  }
}

function incrementGuestCount(): number {
  const data = getGuestData();
  const updated = { ...data, count: data.count + 1 };
  localStorage.setItem(GUEST_KEY, JSON.stringify(updated));
  return updated.count;
}

function getRemainingGuest(): number {
  const data = getGuestData();
  return Math.max(0, GUEST_LIMIT - data.count);
}
// ─────────────────────────────────────────────────────────────────────────────

export default function ChatInterface({ user }: { user: User | null }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const activeChatIdRef = useRef<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // ─── Dark mode: apply to <html> element ───────────────────────────────────
  useEffect(() => {
    // Load saved preference
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

  const chat = useChat({
    transport: new TextStreamChatTransport({ api: '/api/chat' }),
    onFinish: async (event) => {
      // Simpan pesan AI ke DB setelah selesai streaming
      const chatId = activeChatIdRef.current;
      if (chatId && user && event.message) {
        const msg = event.message;
        // @ts-ignore
        const textContent = typeof msg.content === 'string' ? msg.content : (Array.isArray((msg as any).parts) ? (msg as any).parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') : '');
        if (textContent) {
          await supabase.from('messages').insert({
            chat_id: chatId,
            role: 'assistant',
            content: textContent
          });
        }
      }
    }
  });

  const messages = chat.messages || [];
  const status = chat.status || "ready";
  const isLoading = status === "submitted" || status === "streaming";
  const setMessages = chat.setMessages;

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Tutup sidebar di layar kecil secara default
  useEffect(() => {
    if (window.innerWidth < 768) {
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
    const { data } = await supabase.from('messages')
      .select('*')
      .eq('chat_id', id)
      .order('created_at', { ascending: true });

    if (data) {
      const uiMessages = data.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        parts: [{ type: 'text', text: msg.content }]
      }));
      // @ts-ignore
      setMessages(uiMessages);
    }
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleSend = async (content: string, files?: File[]) => {
    if ((!content.trim() && (!files || files.length === 0)) || isLoading) return;

    // ─── GUEST RATE LIMIT: 5 pertanyaan per 24 jam per perangkat ─────────
    if (!user) {
      const data = getGuestData();
      if (data.count >= GUEST_LIMIT) {
        const resetDate = new Date(data.resetAt);
        const resetStr = resetDate.toLocaleString("id-ID", {
          hour: "2-digit", minute: "2-digit", day: "numeric", month: "long"
        });
        window.alert(
          `Batas pertanyaan harian habis!\n\n` +
          `Pengguna tamu dibatasi ${GUEST_LIMIT} pertanyaan per 24 jam.\n` +
          `Limit akan reset pada: ${resetStr}\n\n` +
          `Silakan Masuk/Login untuk melanjutkan konsultasi.`
        );
        return;
      }
      incrementGuestCount();
    }
    // ─────────────────────────────────────────────────────────────────────

    let currentChatId = activeChatId;

    // Buat chat baru jika ini pesan pertama (user login)
    if (!currentChatId && user) {
      const title = content ? content.substring(0, 50) + (content.length > 50 ? "..." : "") : "Konsultasi Gambar";
      const { data } = await supabase.from('chats').insert({
        user_id: user.id,
        title: title
      }).select().single();

      if (data) {
        currentChatId = data.id;
        setActiveChatId(data.id);
        activeChatIdRef.current = data.id;
      }
    }

    // Simpan pesan user ke database
    if (currentChatId && user && content) {
      await supabase.from('messages').insert({
        chat_id: currentChatId,
        role: 'user',
        content: content + (files?.length ? ' [Mengirim lampiran gambar]' : '')
      });
    }

    // Kirim ke AI SDK
    if (chat.append) {
      chat.append({
        role: 'user',
        content: content || "Tolong analisis dokumen/gambar ini.",
        experimental_attachments: files
      });
    } else {
      console.error("No append function found in useChat.");
    }
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
        onPromptClick={handleSend}
        user={user}
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
          {messages.length === 0 ? (
            <WelcomeState onPromptClick={handleSend} />
          ) : (
            <MessageList messages={messages} isTyping={isLoading} />
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input bar — selalu tampil */}
        <ChatInputBar onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  );
}
