"use client";

import { useState } from "react";

const features = [
  {
    id: "chatbot",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: "Chatbot Bahasa Awam",
    description:
      "Tanya pajak seperti ngobrol sama teman. Tidak perlu hafal istilah teknis — AI kami menerjemahkan aturan pajak yang rumit menjadi bahasa yang mudah dipahami siapapun.",
    points: [
      "Jawaban dalam Bahasa Indonesia",
      "Memahami konteks pertanyaan",
      "Sumber hukum transparan",
      "Riwayat konsultasi tersimpan",
    ],
    color: "#1E90FF",
  },
  {
    id: "kalkulator",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="18" rx="2" ry="2" />
        <line x1="8" y1="10" x2="8" y2="10" />
        <line x1="12" y1="10" x2="12" y2="10" />
        <line x1="16" y1="10" x2="16" y2="10" />
        <line x1="8" y1="14" x2="8" y2="14" />
        <line x1="12" y1="14" x2="12" y2="14" />
        <line x1="16" y1="14" x2="16" y2="14" />
        <line x1="8" y1="18" x2="12" y2="18" />
        <line x1="16" y1="18" x2="16" y2="18" />
        <line x1="8" y1="7" x2="16" y2="7" />
      </svg>
    ),
    title: "Kalkulator Pajak Otomatis",
    description:
      "Masukkan penghasilan untuk mendapat estimasi PPh 21 pegawai, bukan pegawai, dan penghasilan final tertentu berdasarkan parameter yang tersedia.",
    points: [
      "PPh 21 bulanan dengan TER",
      "Rekonsiliasi PPh 21 tahunan",
      "Pesangon dan honorarium tertentu",
      "Estimasi disertai dasar perhitungan",
    ],
    color: "#00BFFF",
  },
  {
    id: "spt",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: "Panduan Lapor SPT",
    description:
      "Panduan step-by-step laporan SPT Tahunan dan Masa yang disesuaikan dengan profil pajak Anda. Dari UMKM hingga karyawan, semua ada panduannya.",
    points: [
      "SPT Tahunan Orang Pribadi",
      "SPT Tahunan Badan (PPh 25/29)",
      "Checklist dokumen persyaratan",
      "Alur Coretax untuk Tahun Pajak 2025+",
    ],
    color: "#1E90FF",
  },
];

const HowItWorksStep = ({ number, title, desc }: { number: string; title: string; desc: string }) => (
  <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
    <div style={{
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      background: "var(--gradient-blue)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "14px",
      fontWeight: "700",
      color: "#fff",
      flexShrink: 0,
    }}>
      {number}
    </div>
    <div>
      <div style={{ fontWeight: "600", color: "var(--text-primary)", fontSize: "15px", marginBottom: "4px" }}>{title}</div>
      <div style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.6" }}>{desc}</div>
    </div>
  </div>
);

export default function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(0);
  const active = features[activeFeature];

  return (
    <section
      id="fitur"
      className="section-padding"
      style={{ background: "var(--bg-base)", position: "relative", overflow: "hidden" }}
    >
      {/* Subtle grid */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `linear-gradient(rgba(30,144,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(30,144,255,0.03) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
        pointerEvents: "none",
      }} />

      <div className="container-custom" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "64px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <span className="section-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Fitur Unggulan
          </span>
          <h2 className="section-title" style={{ textAlign: "center" }}>
            Semua yang Anda Butuhkan{" "}
            <span className="gradient-text">dalam Satu Platform</span>
          </h2>
          <p className="section-subtitle" style={{ textAlign: "center" }}>
            Dari konsultasi ringan hingga perhitungan pajak kompleks — KonsulPajak AI siap membantu kapan saja.
          </p>
        </div>

        {/* Feature Tabs */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "40px",
          flexWrap: "wrap",
        }}>
          {features.map((f, i) => (
            <button
              key={f.id}
              id={`feature-tab-${f.id}`}
              onClick={() => setActiveFeature(i)}
              style={{
                padding: "10px 22px",
                borderRadius: "var(--radius-full)",
                border: activeFeature === i
                  ? "1px solid rgba(30,144,255,0.5)"
                  : "1px solid var(--border)",
                background: activeFeature === i
                  ? "rgba(30,144,255,0.12)"
                  : "var(--bg-surface)",
                color: activeFeature === i ? "var(--primary-light)" : "var(--text-muted)",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ color: activeFeature === i ? "var(--primary-light)" : "var(--text-muted)" }}>
                {f.icon}
              </span>
              {f.title}
            </button>
          ))}
        </div>

        {/* Active Feature Card */}
        <div
          key={active.id}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "40px",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-blue)",
            borderRadius: "var(--radius-xl)",
            padding: "48px",
            animation: "fadeIn 0.3s ease",
          }}
          className="feature-detail-grid"
        >
          {/* Left: Description */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{
              width: "64px",
              height: "64px",
              borderRadius: "var(--radius-lg)",
              background: `rgba(30,144,255,0.12)`,
              border: "1px solid rgba(30,144,255,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: active.color,
            }}>
              {active.icon}
            </div>
            <div>
              <h3 style={{ fontSize: "26px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "12px" }}>
                {active.title}
              </h3>
              <p style={{ fontSize: "16px", color: "var(--text-muted)", lineHeight: "1.8" }}>
                {active.description}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {active.points.map((point) => (
                <div key={point} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: How it works */}
          <div style={{
            background: "var(--bg-surface-2)",
            borderRadius: "var(--radius-lg)",
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            border: "1px solid var(--border)",
          }}>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Cara Kerja
            </div>
            <HowItWorksStep number="1" title="Ketik pertanyaan Anda" desc="Tanya dalam bahasa sehari-hari, AI akan memahami konteks pertanyaan pajak Anda." />
            <HowItWorksStep number="2" title="Topik dicocokkan" desc="Pertanyaan dicocokkan dengan knowledge base regulasi terkurasi yang relevan." />
            <HowItWorksStep number="3" title="Jawaban disusun" desc="AI menyusun penjelasan praktis dari konteks regulasi resmi yang tersedia." />
            <HowItWorksStep number="4" title="Sumber dapat diperiksa" desc="Untuk topik yang tersedia, jawaban menyertakan tautan DJP atau JDIH untuk verifikasi mandiri." />
          </div>
        </div>

        {/* Bottom 3 cards quick overview */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          marginTop: "32px",
        }}
          className="features-mini-grid"
        >
          {[
            { icon: "📤", title: "Upload Dokumen", desc: "PDF teks serta gambar JPG, PNG, atau WebP dapat dianalisis AI" },
            { icon: "📖", title: "Referensi Hukum", desc: "Topik terkurasi menyertakan sumber DJP atau JDIH yang bisa dibuka" },
            { icon: "🧮", title: "Kalkulator PPh 21", desc: "Estimasi TER bulanan, rekonsiliasi tahunan, dan kategori tertentu" },
          ].map((item) => (
            <div
              key={item.title}
              className="card-surface card-hover"
              style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <span style={{ fontSize: "28px" }}>{item.icon}</span>
              <div style={{ fontWeight: "700", color: "var(--text-primary)", fontSize: "15px" }}>{item.title}</div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.6" }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .feature-detail-grid { grid-template-columns: 1fr !important; }
          .features-mini-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
