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

export default function ChatInterface({ user }: { user: User | null }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const activeChatIdRef = useRef<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    activeChatIdRef.current = activeChatId;
  }, [activeChatId]);

  const chat = useChat({
    transport: new TextStreamChatTransport({ api: '/api/chat' }),
    onFinish: async (event) => {
      // Save AI message to DB when finished
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
  const sendMessage = chat.sendMessage;

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Close sidebar on small screens by default
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
    setMessages([]); // clear current
    const { data } = await supabase.from('messages')
      .select('*')
      .eq('chat_id', id)
      .order('created_at', { ascending: true });
      
    if (data) {
      // Convert db messages to UI messages format
      const uiMessages = data.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        // Include parts to satisfy SDK v6 if needed
        parts: [{ type: 'text', text: msg.content }]
      }));
      // @ts-ignore
      setMessages(uiMessages);
    }
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleSend = async (content: string, files?: File[]) => {
    if ((!content.trim() && (!files || files.length === 0)) || isLoading) return;
    
    let currentChatId = activeChatId;
    
    // GUEST LIMIT CHECK (Max 10 questions)
    if (!user) {
      const guestMsgCount = parseInt(localStorage.getItem('guestMsgCount') || '0');
      if (guestMsgCount >= 10) {
         window.alert("Batas akses gratis untuk pengguna tamu telah habis (Maks. 10 kali). Silakan login atau daftar secara gratis untuk melanjutkan konsultasi.");
         return;
      }
      localStorage.setItem('guestMsgCount', (guestMsgCount + 1).toString());
    }
    
    // Create new chat if this is the first message
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

    // Save user message to database (without the image data for now to save space, or just text)
    if (currentChatId && user && content) {
      await supabase.from('messages').insert({
        chat_id: currentChatId,
        role: 'user',
        content: content + (files?.length ? ' [Mengirim lampiran gambar]' : '')
      });
    }

    // Send to AI SDK using append
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

        {/* Input bar — always visible */}
        <ChatInputBar onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  );
}
