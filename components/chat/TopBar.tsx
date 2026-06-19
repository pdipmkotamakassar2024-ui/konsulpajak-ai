"use client";

import Link from "next/link";

interface TopBarProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  user?: any;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export default function TopBar({ onToggleSidebar, sidebarOpen, user, darkMode, onToggleDarkMode }: TopBarProps) {
  return (
    <div className="topbar">
      {/* Left: Sidebar toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button
          id="sidebar-toggle-btn"
          className="topbar-toggle"
          onClick={onToggleSidebar}
          title={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Center: Model + Status */}
      <div className="topbar-center">
        <div className="model-badge" id="model-indicator">
          <span style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#10B981",
            flexShrink: 0,
            boxShadow: "0 0 6px #10B981",
          }} />
          KonsulPajak AI
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-faint)" }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Right: actions */}
      <div className="topbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

        {/* Dark/Light mode toggle */}
        <button
          id="dark-mode-toggle"
          onClick={onToggleDarkMode}
          title={darkMode ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
          aria-label="Toggle dark mode"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '36px', height: '36px', borderRadius: '50%',
            background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = darkMode ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.12)'}
          onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}
        >
          {darkMode ? (
            // Sun icon (untuk mode terang)
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            // Moon icon (untuk mode gelap)
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>

        {/* WhatsApp admin */}
        <a
          href="https://wa.me/6285256276676"
          target="_blank"
          rel="noopener noreferrer"
          id="wa-admin-btn"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#25D366', color: 'white', textDecoration: 'none', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 2px 8px rgba(37,211,102,0.3)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(37,211,102,0.45)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(37,211,102,0.3)'; }}
          title="Hubungi Admin via WhatsApp"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
          </svg>
        </a>

        {/* Hanya tampilkan tombol Masuk jika belum login — HAPUS Daftar Gratis */}
        {!user && (
          <Link href="/login" id="topbar-login-btn" className="topbar-login-btn">
            Masuk
          </Link>
        )}
      </div>
    </div>
  );
}
