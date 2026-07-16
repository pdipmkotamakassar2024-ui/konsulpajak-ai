"use client";

import Link from "next/link";

const plans = [
  {
    id: "gratis",
    name: "Gratis",
    tagline: "Untuk mencoba",
    price: "Rp 0",
    period: "Selamanya",
    description: "Mulai konsultasi pajak tanpa biaya. Cocok untuk kebutuhan ringan.",
    cta: "Mulai Gratis",
    ctaHref: "/auth/register",
    popular: false,
    features: [
      { text: "5 pertanyaan per 24 jam", included: true },
      { text: "Sumber resmi untuk topik terkurasi", included: true },
      { text: "Kalkulator PPh 21", included: true },
      { text: "Riwayat tersimpan untuk akun login", included: true },
      { text: "Upload gambar/PDF dalam batas ukuran", included: true },
    ],
  },
  {
    id: "umkm",
    name: "UMKM",
    tagline: "Paling populer",
    price: "Rp 99.000",
    period: "per bulan",
    description: "Solusi lengkap untuk usaha kecil dan menengah. Hemat waktu dan biaya konsultan.",
    cta: "Mulai Sekarang",
    ctaHref: "/auth/register?plan=umkm",
    popular: true,
    features: [
      { text: "Pertanyaan unlimited", included: true },
      { text: "Sumber resmi untuk topik terkurasi", included: true },
      { text: "Kalkulator PPh 21", included: true },
      { text: "Riwayat konsultasi tersimpan", included: true },
      { text: "Upload gambar/PDF dalam batas ukuran", included: true },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Untuk profesional",
    price: "Rp 299.000",
    period: "per bulan",
    description: "Untuk akuntan, konsultan, dan bisnis yang membutuhkan fitur lengkap dan dukungan penuh.",
    cta: "Hubungi Kami",
    ctaHref: "/kontak",
    popular: false,
    features: [
      { text: "Pertanyaan unlimited", included: true },
      { text: "Sumber resmi untuk topik terkurasi", included: true },
      { text: "Kalkulator PPh 21", included: true },
      { text: "Riwayat konsultasi tersimpan", included: true },
      { text: "Upload gambar/PDF dalam batas ukuran", included: true },
    ],
  },
];

export default function PricingSection() {
  return (
    <section
      id="harga"
      className="section-padding"
      style={{
        background: "var(--bg-surface)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow center */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "800px",
        height: "500px",
        background: "radial-gradient(ellipse, rgba(30,144,255,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="container-custom" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "56px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <span className="section-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            Harga Transparan
          </span>
          <h2 className="section-title" style={{ textAlign: "center" }}>
            Pilih Paket yang{" "}
            <span className="gradient-text">Sesuai Kebutuhan</span>
          </h2>
          <p className="section-subtitle" style={{ textAlign: "center" }}>
            Mulai gratis, upgrade kapan saja. Tidak ada biaya tersembunyi.
          </p>

          {/* Transfer manual notice */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            background: "rgba(245, 158, 11, 0.1)",
            border: "1px solid rgba(245, 158, 11, 0.25)",
            borderRadius: "var(--radius-full)",
            fontSize: "13px",
            color: "#F59E0B",
            fontWeight: "500",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Saat ini pembayaran melalui transfer bank manual. Hubungi kami untuk upgrade.
          </div>
        </div>

        {/* Pricing Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
          alignItems: "start",
        }}
          className="pricing-grid"
        >
          {plans.map((plan) => (
            <div
              key={plan.id}
              id={`pricing-${plan.id}`}
              className={plan.popular ? "pricing-card-popular" : "card-surface card-hover"}
              style={{
                borderRadius: "var(--radius-xl)",
                padding: "36px 32px",
                display: "flex",
                flexDirection: "column",
                gap: "0",
                position: "relative",
                ...(plan.popular ? { transform: "scale(1.04)" } : {}),
              }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div style={{
                  position: "absolute",
                  top: "-14px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "var(--gradient-blue)",
                  borderRadius: "var(--radius-full)",
                  padding: "5px 16px",
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#fff",
                  whiteSpace: "nowrap",
                  boxShadow: "0 4px 15px rgba(30,144,255,0.4)",
                }}>
                  ⭐ Paling Populer
                </div>
              )}

              {/* Plan header */}
              <div style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontWeight: "800", fontSize: "20px", color: "var(--text-primary)" }}>{plan.name}</span>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic" }}>{plan.tagline}</span>
                </div>
                <div style={{ marginBottom: "8px" }}>
                  <span style={{
                    fontSize: "36px",
                    fontWeight: "900",
                    color: plan.popular ? "var(--primary-light)" : "var(--text-primary)",
                    letterSpacing: "-0.02em",
                  }}>
                    {plan.price}
                  </span>
                  <span style={{ fontSize: "14px", color: "var(--text-muted)", marginLeft: "6px" }}>
                    /{plan.period}
                  </span>
                </div>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.6" }}>
                  {plan.description}
                </p>
              </div>

              {/* Divider */}
              <div className="divider-gradient" style={{ marginBottom: "24px" }} />

              {/* Features list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px", flex: 1 }}>
                {plan.features.map((feature) => (
                  <div key={feature.text} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {feature.included ? (
                      <svg className="pricing-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg className="pricing-x" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    )}
                    <span style={{
                      fontSize: "14px",
                      color: feature.included ? "var(--text-secondary)" : "var(--text-faint)",
                    }}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                href={plan.ctaHref}
                id={`pricing-cta-${plan.id}`}
                className={plan.popular ? "btn-primary" : "btn-secondary"}
                style={{ justifyContent: "center", width: "100%" }}
              >
                {plan.cta}
                {plan.popular && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p style={{ textAlign: "center", fontSize: "13px", color: "var(--text-faint)", marginTop: "40px" }}>
          Knowledge base terkurasi terakhir ditinjau 15 Juli 2026; perubahan regulasi setelah tanggal itu perlu diverifikasi. <br />
          Butuh paket khusus untuk perusahaan?{" "}
          <Link href="/kontak" style={{ color: "var(--primary-light)", textDecoration: "none", fontWeight: "500" }}>
            Hubungi tim kami →
          </Link>
        </p>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .pricing-grid { grid-template-columns: 1fr !important; }
          .pricing-grid > div { transform: scale(1) !important; }
        }
      `}</style>
    </section>
  );
}
