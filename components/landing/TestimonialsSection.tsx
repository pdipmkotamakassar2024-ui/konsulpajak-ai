"use client";

import Link from "next/link";

const testimonials = [
  {
    id: 1,
    name: "Budi Santoso",
    role: "Pemilik Toko Online",
    avatar: "BS",
    rating: 5,
    text: "Saya bingung harus bayar pajak berapa untuk toko online saya. Ternyata omzet saya masih bebas pajak! Terima kasih KonsulPajak AI, penjelasannya jelas banget dan ada sumber hukumnya.",
    tag: "Pajak UMKM",
  },
  {
    id: 2,
    name: "Siti Rahmawati",
    role: "Freelance Designer",
    avatar: "SR",
    rating: 5,
    text: "Sebagai freelancer, saya selalu bingung cara lapor SPT. Sekarang tinggal tanya AI, langsung ada panduan step-by-step. Hemat waktu dan tidak perlu bayar konsultan mahal.",
    tag: "SPT Tahunan",
  },
  {
    id: 3,
    name: "Ahmad Fauzi",
    role: "Direktur CV Maju Bersama",
    avatar: "AF",
    rating: 5,
    text: "Fitur upload dokumen sangat membantu. Saya upload laporan keuangan, langsung AI analisis dan kasih rekomendasi pajak yang harus dibayar. Efisien sekali untuk bisnis saya.",
    tag: "Pajak Badan",
  },
  {
    id: 4,
    name: "Dewi Lestari",
    role: "Akuntan Publik",
    avatar: "DL",
    rating: 5,
    text: "Sebagai akuntan, saya butuh tools yang akurat dengan referensi hukum yang jelas. KonsulPajak AI memberikan sumber peraturan yang bisa langsung saya verifikasi. Sangat profesional.",
    tag: "Profesional",
  },
  {
    id: 5,
    name: "Riko Permana",
    role: "Pedagang Pasar Modern",
    avatar: "RP",
    rating: 5,
    text: "Dulu takut sama urusan pajak karena tidak ngerti. Sekarang tanya AI pakai bahasa biasa, jawabannya juga bahasa sehari-hari. Aplikasi ini benar-benar untuk rakyat!",
    tag: "UMKM",
  },
  {
    id: 6,
    name: "Hana Pertiwi",
    role: "Content Creator",
    avatar: "HP",
    rating: 5,
    text: "Penghasilan dari YouTube dan Instagram bikin bingung pajaknya. AI langsung jelasin tentang PPh 21 final dan cara pelaporannya. Jauh lebih mudah dari baca peraturan sendiri.",
    tag: "Creator Economy",
  },
];

const StarRating = ({ count }: { count: number }) => (
  <div style={{ display: "flex", gap: "2px" }}>
    {Array.from({ length: count }).map((_, i) => (
      <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="0">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ))}
  </div>
);

export default function TestimonialsSection() {
  return (
    <section
      id="testimoni"
      className="section-padding"
      style={{ background: "var(--bg-base)", position: "relative", overflow: "hidden" }}
    >
      {/* BG orbs */}
      <div style={{
        position: "absolute",
        bottom: "0",
        right: "-10%",
        width: "500px",
        height: "500px",
        background: "radial-gradient(circle, rgba(30,144,255,0.07) 0%, transparent 70%)",
        borderRadius: "50%",
        pointerEvents: "none",
      }} />

      <div className="container-custom" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "56px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <span className="section-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            Dipercaya Pengguna
          </span>
          <h2 className="section-title" style={{ textAlign: "center" }}>
            Apa Kata Mereka yang{" "}
            <span className="gradient-text">Sudah Mencoba?</span>
          </h2>
          <p className="section-subtitle" style={{ textAlign: "center" }}>
            Dari UMKM hingga profesional — semua merasakan manfaatnya.
          </p>

          {/* Aggregate rating */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 24px",
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-full)",
          }}>
            <StarRating count={5} />
            <span style={{ fontWeight: "700", color: "var(--text-primary)", fontSize: "16px" }}>4.9</span>
            <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>dari 500+ ulasan</span>
          </div>
        </div>

        {/* Masonry grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
          className="testimonials-grid"
        >
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              className="card-surface card-hover"
              style={{
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                animationDelay: `${i * 0.1}s`,
              }}
            >
              {/* Tag */}
              <span className="badge badge-blue">{t.tag}</span>

              {/* Stars */}
              <StarRating count={t.rating} />

              {/* Quote */}
              <p style={{
                fontSize: "14px",
                color: "var(--text-secondary)",
                lineHeight: "1.75",
                flex: 1,
              }}>
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "var(--gradient-blue)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#fff",
                  flexShrink: 0,
                }}>
                  {t.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "14px", color: "var(--text-primary)" }}>{t.name}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA below testimonials */}
        <div style={{ textAlign: "center", marginTop: "56px" }}>
          <div style={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            padding: "48px 56px",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-blue)",
            borderRadius: "var(--radius-xl)",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Glow bg */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse at center, rgba(30,144,255,0.08) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
            <span style={{ fontSize: "32px" }}>🚀</span>
            <h3 style={{ fontSize: "24px", fontWeight: "800", color: "var(--text-primary)", position: "relative" }}>
              Bergabung dengan ribuan pengguna
            </h3>
            <p style={{ fontSize: "15px", color: "var(--text-muted)", position: "relative" }}>
              Mulai konsultasi pajak gratis sekarang. Tidak perlu kartu kredit.
            </p>
            <Link
              href="/auth/register"
              className="btn-primary"
              id="testimonial-cta"
              style={{ padding: "14px 40px", fontSize: "16px", position: "relative" }}
            >
              Mulai Gratis Sekarang
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .testimonials-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .testimonials-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
