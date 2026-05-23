"use client";

import Link from "next/link";

interface TopBarProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  user?: any;
}

export default function TopBar({ onToggleSidebar, sidebarOpen, user }: TopBarProps) {
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
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
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

      {/* Right: Auth actions */}
      <div className="topbar-actions">
        {!user && (
          <>
            <Link href="/login" id="topbar-login-btn" className="topbar-login-btn">
              Masuk
            </Link>
            <Link
              href="/login"
              id="topbar-register-btn"
              style={{
                padding: "7px 18px",
                background: "#FFFFFF",
                border: "1.5px solid var(--border)",
                borderRadius: "99px",
                color: "var(--text-secondary)",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)";
                (e.currentTarget as HTMLElement).style.color = "var(--primary-dark)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
              }}
            >
              Daftar Gratis
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
