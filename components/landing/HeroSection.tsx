"use client";

import Link from "next/link";

const ChatMockup = () => (
  <div
    style={{
      background: "var(--bg-surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-xl)",
      padding: "0",
      overflow: "hidden",
      boxShadow: "var(--shadow-lg), 0 0 80px rgba(30,144,255,0.12)",
      width: "100%",
      maxWidth: "480px",
    }}
    className="animate-float"
  >
    {/* Topbar */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "14px 18px",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg-surface-2)",
      }}
    >
      <div style={{ display: "flex", gap: "6px" }}>
        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#EF4444" }} />
        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#F59E0B" }} />
        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10B981" }} />
      </div>
      <div style={{
        flex: 1,
        background: "var(--bg-surface)",
        borderRadius: "6px",
        padding: "4px 10px",
        fontSize: "12px",
        color: "var(--text-faint)",
      }}>
        konsulpajak-ai.com
      </div>
    </div>

    {/* Chat messages */}
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px", minHeight: "280px" }}>
      {/* User message */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
        <div style={{ fontSize: "11px", color: "var(--text-faint)" }}>Anda</div>
        <div className="chat-bubble-user">
          Berapa pajak saya jika omzet jualan online 30 juta per bulan? 🛒
        </div>
      </div>

      {/* AI response */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{
            width: "22px", height: "22px", borderRadius: "50%",
            background: "var(--gradient-blue)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "11px", fontWeight: "700", color: "#fff"
          }}>AI</div>
          <span style={{ fontSize: "11px", color: "var(--text-faint)" }}>KonsulPajak AI</span>
          <span className="badge badge-green" style={{ fontSize: "10px", padding: "2px 7px" }}>● Live</span>
        </div>
        <div className="chat-bubble-ai">
          Kabar baik! Dengan omzet <strong style={{ color: "var(--primary-light)" }}>Rp 30 juta/bulan = Rp 360 juta/tahun</strong>, Anda masih di bawah batas Rp 500 juta. Berdasarkan <strong style={{ color: "var(--primary-light)" }}>PP 55/2022</strong>, Anda dapat memanfaatkan tarif PPh Final UMKM <strong style={{ color: "var(--success)" }}>0,5%</strong> alias bebas pajak! 🎉
        </div>
      </div>

      {/* Typing indicator */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{
            width: "22px", height: "22px", borderRadius: "50%",
            background: "var(--gradient-blue)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "11px", fontWeight: "700", color: "#fff"
          }}>AI</div>
        </div>
        <div className="chat-bubble-ai" style={{ display: "flex", alignItems: "center", gap: "4px", padding: "12px 16px" }}>
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    </div>

    {/* Legal source bar */}
    <div style={{
      borderTop: "1px solid var(--border)",
      padding: "10px 18px",
      background: "rgba(30,144,255,0.05)",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
      <span style={{ fontSize: "12px", color: "var(--primary-light)", fontWeight: "500" }}>Sumber: PP 55/2022 · UU HPP No. 7/2021</span>
    </div>

    {/* Input bar */}
    <div style={{
      borderTop: "1px solid var(--border)",
      padding: "12px 18px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    }}>
      <div style={{
        flex: 1,
        background: "var(--bg-surface-2)",
        borderRadius: "var(--radius-full)",
        padding: "9px 14px",
        fontSize: "13px",
        color: "var(--text-faint)",
        border: "1px solid var(--border)",
      }}>
        Tanya seputar pajak...
      </div>
      <button style={{
        width: "34px", height: "34px",
        background: "var(--gradient-blue)",
        border: "none",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        flexShrink: 0,
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </div>
  </div>
);

export default function HeroSection() {
  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        background: "var(--gradient-hero)",
        paddingTop: "80px",
      }}
    >
      {/* Background Orbs */}
      <div style={{
        position: "absolute",
        top: "15%",
        left: "-5%",
        width: "500px",
        height: "500px",
        background: "radial-gradient(circle, rgba(30,144,255,0.12) 0%, transparent 70%)",
        borderRadius: "50%",
        pointerEvents: "none",
        animation: "orb-pulse 6s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute",
        bottom: "10%",
        right: "-5%",
        width: "400px",
        height: "400px",
        background: "radial-gradient(circle, rgba(0,191,255,0.08) 0%, transparent 70%)",
        borderRadius: "50%",
        pointerEvents: "none",
        animation: "orb-pulse 8s ease-in-out infinite 2s",
      }} />

      {/* Grid overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(30,144,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(30,144,255,0.04) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        pointerEvents: "none",
      }} />

      <div className="container-custom" style={{ position: "relative", zIndex: 1 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "60px",
          alignItems: "center",
        }}
          className="hero-grid"
        >
          {/* Left: Text Content */}
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            {/* Label */}
            <div className="animate-fade-up" style={{ display: "flex", alignItems: "center" }}>
              <span className="section-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                Konsultan Pajak Berbasis AI
              </span>
            </div>

            {/* Headline */}
            <div className="animate-fade-up-delay-1">
              <h1 style={{
                fontSize: "clamp(36px, 5vw, 60px)",
                fontWeight: "900",
                lineHeight: "1.1",
                letterSpacing: "-0.03em",
                color: "var(--text-primary)",
                marginBottom: "0",
              }}>
                Pusing Urus Pajak?{" "}
                <span className="gradient-text">Biar AI yang Hitung & Jelaskan.</span>
              </h1>
            </div>

            {/* Sub-headline */}
            <div className="animate-fade-up-delay-2">
              <p style={{
                fontSize: "18px",
                color: "var(--text-muted)",
                lineHeight: "1.8",
                maxWidth: "480px",
              }}>
                Konsultan pajak pribadi untuk <strong style={{ color: "var(--text-secondary)" }}>UMKM dan Profesional</strong>. Berbasis aturan resmi DJP, dijelaskan dengan bahasa manusia.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="animate-fade-up-delay-3" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link
                href="/auth/register"
                className="btn-primary"
                id="hero-cta-primary"
                style={{ padding: "14px 32px", fontSize: "16px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                Mulai Konsultasi Gratis
              </Link>
              <Link
                href="#fitur"
                className="btn-secondary"
                id="hero-cta-secondary"
                style={{ padding: "14px 28px", fontSize: "16px" }}
              >
                Lihat Fitur
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="animate-fade-up-delay-4" style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
              {[
                { icon: "🔒", text: "Enkripsi AES-256" },
                { icon: "✅", text: "Berbasis Aturan DJP" },
                { icon: "⚡", text: "Jawaban Instan" },
              ].map((item) => (
                <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "16px" }}>{item.icon}</span>
                  <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "500" }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Chat Mockup */}
          <div
            className="animate-fade-up-delay-2 hero-mockup"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* Glow behind mockup */}
            <div style={{
              position: "absolute",
              inset: "-20px",
              background: "radial-gradient(ellipse, rgba(30,144,255,0.15) 0%, transparent 70%)",
              borderRadius: "50%",
              pointerEvents: "none",
              zIndex: 0,
            }} />
            <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
              <ChatMockup />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .hero-mockup {
            justify-content: center !important;
          }
        }
      `}</style>
    </section>
  );
}
