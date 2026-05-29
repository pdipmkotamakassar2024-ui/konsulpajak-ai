"use client";

import Image from "next/image";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { logout } from "@/app/auth/actions";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { suggestions } from "./WelcomeState";

const tools = [
  {
    id: "kalkulator",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="18" rx="2" />
        <line x1="8" y1="10" x2="8" y2="10" strokeWidth="3" />
        <line x1="12" y1="10" x2="12" y2="10" strokeWidth="3" />
        <line x1="16" y1="10" x2="16" y2="10" strokeWidth="3" />
        <line x1="8" y1="14" x2="8" y2="14" strokeWidth="3" />
        <line x1="12" y1="14" x2="12" y2="14" strokeWidth="3" />
        <line x1="16" y1="14" x2="16" y2="14" strokeWidth="3" />
        <line x1="8" y1="18" x2="12" y2="18" />
        <line x1="8" y1="7" x2="16" y2="7" />
      </svg>
    ),
    label: "Kalkulator Pajak",
    href: "/kalkulator",
  },
  {
    id: "deadline",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    label: "Deadline Pajak",
    href: "/deadline",
    comingSoon: true,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelectChat?: (id: string) => void;
  onPromptClick?: (prompt: string) => void;
  user?: User | null;
}

export default function Sidebar({ isOpen, onClose, onNewChat, onSelectChat, onPromptClick, user }: SidebarProps) {
  const [recentChats, setRecentChats] = useState<{id: string, title: string}[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const supabase = createClient();

  useEffect(() => {
    if (user) {
      supabase.from('chats')
        .select('id, title')
        .order('created_at', { ascending: false })
        .limit(20)
        .then(({ data }) => {
          if (data) setRecentChats(data);
        });
    } else {
      setRecentChats([]);
    }
  }, [user]);

  const filteredChats = recentChats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={onClose} />
      )}

      <aside className={`sidebar ${isOpen ? "" : "closed"}`}>
        {/* Logo — enlarged */}
        <div className="sidebar-logo-section" style={{ padding: "16px 20px" }}>
          <Link href="/" style={{ display: "inline-block", textDecoration: "none" }}>
            <Image
              src="/logo-navbar.png"
              alt="KonsulPajak AI"
              width={240}
              height={65}
              style={{ height: "56px", width: "auto", objectFit: "contain" }}
              priority
            />
          </Link>
        </div>

        {/* New Chat button */}
        <button className="new-chat-btn" onClick={onNewChat} id="new-chat-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Konsultasi Baru
        </button>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          
          {/* Topik Populer / 6 Menus */}
          <div className="sidebar-section-label">Pintasan Topik</div>
          {suggestions.map((s, i) => (
            <div 
              key={`shortcut-${i}`} 
              className="sidebar-tool-item" 
              onClick={() => {
                if (onPromptClick) {
                  onPromptClick(s.prompt);
                  if (window.innerWidth < 768) onClose();
                }
              }}
              style={{ cursor: "pointer", fontSize: "13px" }}
            >
              <span style={{ fontSize: "14px", flexShrink: 0 }}>{s.icon}</span>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title}</span>
            </div>
          ))}

          <div className="sidebar-divider" />

          {/* Tools */}
          <div className="sidebar-section-label">Alat Bantu</div>
          {tools.map((tool) => 
            tool.comingSoon ? (
              <div key={tool.id} className="sidebar-tool-item" id={`sidebar-tool-${tool.id}`}
                style={{ opacity: 0.6, cursor: 'default', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <span style={{ color: "var(--primary-light)", flexShrink: 0 }}>{tool.icon}</span>
                  {tool.label}
                </span>
                <span style={{
                  fontSize: '9px', fontWeight: '700', color: '#fff',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  padding: '2px 7px', borderRadius: '99px', letterSpacing: '0.04em',
                  flexShrink: 0, textTransform: 'uppercase'
                }}>Segera</span>
              </div>
            ) : (
              <Link key={tool.id} href={tool.href} className="sidebar-tool-item" id={`sidebar-tool-${tool.id}`}>
                <span style={{ color: "var(--primary-light)", flexShrink: 0 }}>{tool.icon}</span>
                {tool.label}
              </Link>
            )
          )}

          <div className="sidebar-divider" />

          {/* Recent chats with search */}
          <div className="sidebar-section-label">Hari Ini</div>
          <div style={{ padding: "0 16px 8px 16px" }}>
            <input 
              type="text" 
              placeholder="Cari riwayat..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%", padding: "6px 12px", borderRadius: "6px",
                border: "1px solid var(--border)", background: "transparent",
                color: "var(--text-primary)", fontSize: "12px", outline: "none"
              }}
            />
          </div>
          {filteredChats.slice(0, 20).map((chat) => (
            <div key={chat.id} className="sidebar-chat-item" onClick={() => onSelectChat?.(chat.id)} style={{ cursor: "pointer" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: "var(--text-faint)" }}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {chat.title}
              </span>
            </div>
          ))}

        </div>

        {/* Bottom: CTA + Upgrade + User */}
        <div className="sidebar-bottom" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          
          <a 
            href="https://yunaconsulting.myscalev.com/konsultasi1on1?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAb21jcAR9_l9leHRuA2FlbQIxMQBzcnRjBmFwcF9pZA81NjcwNjczNDMzNTI0MjcAAacvwZHioMptZ7Zx0WseK4rfQuM9euKJmVzC9oOMsUsyO6yEJQqCJ_YGQPRZWw_aem_J_TWKgBxOItheICIn2C3_Q" 
            target="_blank" 
            rel="noopener noreferrer"
            className="upgrade-btn" 
            style={{ 
              background: "linear-gradient(135deg, #10B981, #059669)", 
              color: "white",
              border: "none",
              marginBottom: "0",
              fontWeight: "600",
              justifyContent: "center"
            }}
          >
            Konsultasi Offline 1-on-1
          </a>

          <Link href="/harga" className="upgrade-btn" id="sidebar-upgrade-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Upgrade ke Pro
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: "auto" }}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>

          <div className="user-info-row">
            <div className="user-avatar">{user ? (user.user_metadata?.name?.[0] || user.email?.[0] || 'U').toUpperCase() : 'G'}</div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user ? (user.user_metadata?.name || user.email) : "Pengguna Tamu"}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-faint)" }}>
                {user ? "Paket Gratis · Maks 5 Prompt" : "Belum Login"}
              </div>
            </div>
            {user ? (
              <form action={logout}>
                <button type="submit" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "var(--text-faint)" }} title="Keluar">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                  </svg>
                </button>
              </form>
            ) : (
              <Link href="/login" style={{ color: "var(--primary)", textDecoration: "none" }} title="Login">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
