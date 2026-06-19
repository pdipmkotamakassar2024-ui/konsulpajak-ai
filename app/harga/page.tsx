export default function HargaPage() {
  const plans = [
    {
      id: "monthly",
      name: "Paket Bulanan",
      price: "49.000",
      period: "/ bulan",
      duration: "1 Bulan",
      popular: false,
      color: "#3B82F6",
      gradient: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
      features: [
        "25 pertanyaan per hari",
        "Riwayat konsultasi tersimpan",
        "Analisis dokumen & faktur pajak",
        "Respons prioritas AI",
        "Dukungan via WhatsApp",
      ],
    },
    {
      id: "quarterly",
      name: "Paket 3 Bulan",
      price: "99.000",
      period: "/ 3 bulan",
      duration: "3 Bulan",
      popular: true,
      color: "#6366F1",
      gradient: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
      savings: "Hemat Rp 48.000",
      features: [
        "25 pertanyaan per hari",
        "Riwayat konsultasi tersimpan",
        "Analisis dokumen & faktur pajak",
        "Respons prioritas AI",
        "Dukungan via WhatsApp",
        "Template surat SP2DK",
      ],
    },
    {
      id: "yearly",
      name: "Paket Tahunan",
      price: "249.000",
      period: "/ tahun",
      duration: "1 Tahun",
      popular: false,
      color: "#8B5CF6",
      gradient: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
      savings: "Hemat Rp 339.000",
      features: [
        "25 pertanyaan per hari",
        "Riwayat konsultasi tersimpan",
        "Analisis dokumen & faktur pajak",
        "Respons prioritas AI",
        "Dukungan via WhatsApp",
        "Template surat SP2DK",
        "Konsultasi offline 1x gratis",
        "Update regulasi terbaru",
      ],
    },
  ];

  const WA_NUMBER = "6285256276676";

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #F8FAFC 0%, #EEF4FF 100%)",
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      padding: "60px 24px 80px",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "6px 16px",
          background: "rgba(99,102,241,0.1)",
          border: "1px solid rgba(99,102,241,0.25)",
          borderRadius: "99px",
          fontSize: "13px", fontWeight: 600, color: "#4F46E5",
          marginBottom: "20px",
        }}>
          <span>⚡</span> Akses Tanpa Batas
        </div>
        <h1 style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "clamp(28px, 4vw, 48px)",
          fontWeight: 800,
          color: "#0B1B3B",
          marginBottom: "16px",
          lineHeight: 1.15,
        }}>
          Pilih Paket yang Tepat<br/>
          <span style={{
            background: "linear-gradient(90deg, #3B82F6, #6366F1, #8B5CF6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>untuk Anda</span>
        </h1>
        <p style={{ fontSize: "17px", color: "#6B7280", maxWidth: "520px", margin: "0 auto", lineHeight: 1.7 }}>
          Konsultasi pajak tanpa batas waktu. Bayar sekali, akses penuh sepanjang periode paket.
        </p>
      </div>

      {/* Plans Grid */}
      <div style={{
        display: "flex",
        gap: "24px",
        justifyContent: "center",
        alignItems: "stretch",
        flexWrap: "wrap",
        maxWidth: "1100px",
        margin: "0 auto",
      }}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            style={{
              flex: "1 1 300px",
              maxWidth: "340px",
              background: "#FFFFFF",
              borderRadius: "24px",
              padding: "32px 28px 36px",
              boxShadow: plan.popular
                ? "0 20px 60px rgba(99,102,241,0.18), 0 4px 20px rgba(99,102,241,0.1)"
                : "0 4px 20px rgba(15,23,42,0.06)",
              border: plan.popular
                ? "2px solid rgba(99,102,241,0.4)"
                : "1.5px solid rgba(15,23,42,0.08)",
              position: "relative",
              transform: plan.popular ? "scale(1.04)" : "scale(1)",
              transition: "box-shadow 0.2s ease, transform 0.2s ease",
            }}
          >
            {/* Popular badge */}
            {plan.popular && (
              <div style={{
                position: "absolute",
                top: "-14px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "linear-gradient(90deg, #6366F1, #8B5CF6)",
                color: "white",
                fontSize: "12px",
                fontWeight: 700,
                padding: "5px 18px",
                borderRadius: "99px",
                letterSpacing: "0.04em",
                whiteSpace: "nowrap",
                boxShadow: "0 4px 12px rgba(99,102,241,0.35)",
              }}>
                ⭐ PALING POPULER
              </div>
            )}

            {/* Plan icon + name */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{
                width: "48px", height: "48px",
                background: plan.gradient,
                borderRadius: "14px",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "14px",
                boxShadow: `0 6px 20px ${plan.color}30`,
              }}>
                <span style={{ fontSize: "22px" }}>
                  {plan.id === "monthly" ? "📅" : plan.id === "quarterly" ? "🗓️" : "🏆"}
                </span>
              </div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: plan.color, marginBottom: "4px" }}>
                {plan.duration}
              </div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "#0B1B3B" }}>
                {plan.name}
              </div>
            </div>

            {/* Price */}
            <div style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#6B7280", marginTop: "4px" }}>Rp</span>
                <span style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "42px",
                  fontWeight: 800,
                  color: "#0B1B3B",
                  lineHeight: 1,
                }}>{plan.price}</span>
                <span style={{ fontSize: "13px", color: "#9CA3AF" }}>{plan.period}</span>
              </div>
              {plan.savings && (
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  marginTop: "8px",
                  padding: "3px 10px",
                  background: "rgba(16,185,129,0.1)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  borderRadius: "99px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#059669",
                }}>
                  ✓ {plan.savings}
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "#F0F4F9", margin: "20px 0" }} />

            {/* Features */}
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px 0", display: "flex", flexDirection: "column", gap: "10px" }}>
              {plan.features.map((feat, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "14px", color: "#374151" }}>
                  <span style={{
                    width: "18px", height: "18px",
                    background: plan.gradient,
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginTop: "1px",
                    fontSize: "10px", color: "white", fontWeight: 700,
                  }}>✓</span>
                  {feat}
                </li>
              ))}
            </ul>

            {/* CTA button */}
            <a
              href={`https://wa.me/${WA_NUMBER}?text=Halo Admin KonsulPajak AI! Saya ingin berlangganan ${plan.name} (Rp ${plan.price}${plan.period}). Mohon bantu proses pembayarannya. Terima kasih!`}
              target="_blank"
              rel="noopener noreferrer"
              id={`btn-plan-${plan.id}`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                width: "100%",
                padding: "14px 20px",
                background: plan.popular ? plan.gradient : "#FFFFFF",
                color: plan.popular ? "#FFFFFF" : plan.color,
                border: `2px solid ${plan.color}`,
                borderRadius: "14px",
                fontSize: "15px",
                fontWeight: 700,
                textDecoration: "none",
                transition: "all 0.2s ease",
                boxShadow: plan.popular ? `0 8px 24px ${plan.color}35` : "none",
                cursor: "pointer",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
              </svg>
              Beli via WhatsApp
            </a>
          </div>
        ))}
      </div>

      {/* Trust section */}
      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <p style={{ fontSize: "14px", color: "#9CA3AF", marginBottom: "16px" }}>
          Pembayaran aman & mudah melalui WhatsApp Admin
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "32px", flexWrap: "wrap" }}>
          {["🔒 Pembayaran Aman", "📞 Respon Cepat", "✅ Aktivasi Instan", "🔄 Bisa Perpanjang"].map((item, i) => (
            <span key={i} style={{ fontSize: "13px", color: "#6B7280", fontWeight: 500 }}>{item}</span>
          ))}
        </div>
      </div>

      {/* Back button */}
      <div style={{ textAlign: "center", marginTop: "48px" }}>
        <a href="/" style={{
          color: "#3B82F6", fontSize: "14px", textDecoration: "none",
          display: "inline-flex", alignItems: "center", gap: "4px",
          fontWeight: 500,
        }}>
          ← Kembali ke Konsultasi
        </a>
      </div>
    </div>
  );
}
