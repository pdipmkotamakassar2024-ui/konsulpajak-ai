"use client";

const stats = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
    value: ">10.000",
    label: "Peraturan DJP & Kemenkeu",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    value: "AES-256",
    label: "Enkripsi Data Dokumen",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    value: "99.9%",
    label: "Akurasi Referensi Hukum",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    value: "<3 Detik",
    label: "Rata-rata Waktu Jawaban",
  },
];

const badges = [
  { icon: "🏛️", text: "Database Resmi DJP" },
  { icon: "🔐", text: "SSL Terenkripsi" },
  { icon: "🤖", text: "Powered by Google Gemini" },
  { icon: "🇮🇩", text: "Hukum Pajak Indonesia" },
];

export default function TrustBar() {
  return (
    <section
      id="kepercayaan"
      style={{
        padding: "80px 0",
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle blue glow top center */}
      <div style={{
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "600px",
        height: "2px",
        background: "var(--gradient-blue)",
        boxShadow: "0 0 30px rgba(30,144,255,0.4)",
      }} />

      <div className="container-custom">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <span className="section-label" style={{ marginBottom: "16px", display: "inline-flex" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Dibangun di Atas Kepercayaan
          </span>
          <h2 className="section-title" style={{ marginTop: "12px" }}>
            Bukan AI Asal Tebak —{" "}
            <span className="gradient-text">Berbasis Hukum Nyata</span>
          </h2>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginBottom: "52px",
        }}
          className="stats-grid"
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="card-surface card-hover"
              style={{
                padding: "28px 24px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                textAlign: "center",
                alignItems: "center",
              }}
            >
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "var(--radius-md)",
                background: "rgba(30,144,255,0.1)",
                border: "1px solid rgba(30,144,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary-light)",
              }}>
                {stat.icon}
              </div>
              <div>
                <div style={{
                  fontSize: "28px",
                  fontWeight: "800",
                  color: "var(--text-primary)",
                  lineHeight: "1",
                  letterSpacing: "-0.02em",
                }} className="gradient-text">
                  {stat.value}
                </div>
                <div style={{
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  marginTop: "6px",
                  lineHeight: "1.4",
                }}>
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Badges row */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          {badges.map((badge) => (
            <div
              key={badge.text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                background: "var(--bg-surface-2)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-full)",
                transition: "all 0.2s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border-blue)";
                (e.currentTarget as HTMLElement).style.background = "rgba(30,144,255,0.06)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLElement).style.background = "var(--bg-surface-2)";
              }}
            >
              <span style={{ fontSize: "18px" }}>{badge.icon}</span>
              <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: "500" }}>
                {badge.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
