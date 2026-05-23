"use client";

import Image from "next/image";

export const suggestions = [
  {
    icon: "💼",
    title: "PPh 21 Karyawan",
    desc: "Berapa pajak saya jika gaji Rp 8 juta per bulan?",
    prompt: "Berapa pajak PPh 21 saya jika gaji pokok Rp 8 juta per bulan dengan status TK/0?",
  },
  {
    icon: "🛒",
    title: "Pajak Jualan Online",
    desc: "Omzet toko online 30 juta/bulan, kena pajak berapa?",
    prompt: "Saya punya toko online dengan omzet sekitar 30 juta per bulan. Berapa pajak yang harus saya bayar?",
  },
  {
    icon: "📊",
    title: "Lapor SPT Tahunan",
    desc: "Panduan step-by-step lapor SPT pribadi 2024",
    prompt: "Bagaimana cara lapor SPT Tahunan orang pribadi untuk tahun pajak 2024? Saya karyawan swasta.",
  },
  {
    icon: "🏪",
    title: "Pajak UMKM 0,5%",
    desc: "Apakah saya bisa bayar pajak hanya 0,5%?",
    prompt: "Apa itu pajak UMKM 0,5%? Syaratnya apa dan bagaimana cara mendaftarkan diri?",
  },
  {
    icon: "🧾",
    title: "Analisis Dokumen",
    desc: "Upload faktur atau struk untuk dihitung pajaknya",
    prompt: "Saya ingin upload faktur pajak untuk dianalisis. Bagaimana caranya dan apa yang bisa Anda bantu?",
  },
  {
    icon: "📋",
    title: "Template SP2DK",
    desc: "Buat surat tanggapan SP2DK yang profesional",
    prompt: "Saya menerima Surat Permintaan Penjelasan Data dan Keterangan (SP2DK) dari KPP. Bagaimana cara meresponsnya?",
  },
];

interface WelcomeStateProps {
  onPromptClick: (prompt: string) => void;
}

export default function WelcomeState({ onPromptClick }: WelcomeStateProps) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Selamat Pagi" :
    hour < 15 ? "Selamat Siang" :
    hour < 18 ? "Selamat Sore" : "Selamat Malam";

  return (
    <div className="welcome-container" style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "70vh", // To ensure it centers within the scroll area
      paddingTop: 0,
    }}>
      {/* Animated logo */}
      <div className="welcome-logo-wrapper animate-fade-up" style={{ marginBottom: "32px" }}>
        <div className="welcome-logo-ring-2" style={{ width: "160px", height: "160px" }} />
        <div className="welcome-logo-ring" style={{ width: "140px", height: "140px" }} />
        <Image
          src="/logo-tengah.png"
          alt="KonsulPajak AI"
          width={120}
          height={120}
          className="welcome-logo-img"
          style={{ width: "120px", height: "120px" }}
          priority
        />
      </div>

      {/* Greeting */}
      <h1 className="welcome-greeting animate-fade-up-1" style={{ marginBottom: "12px", fontSize: "36px" }}>
        {greeting}! 👋 Saya{" "}
        <span>KonsulPajak AI</span>
      </h1>

      <p className="welcome-subtitle animate-fade-up-2" style={{ marginBottom: "40px", fontSize: "18px" }}>
        Asisten Konsultan Pajak Coretax Anda.
      </p>

      {/* Suggestions grid removed per user request (moved to sidebar) */}

      {/* Trust badges */}
      <div
        className="animate-fade-up-3"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginTop: "24px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {[
          { icon: "📚", text: ">10.000 Peraturan DJP" },
          { icon: "⚡", text: "Jawaban < 3 Detik" },
        ].map((b) => (
          <div
            key={b.text}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              color: "var(--text-faint)",
            }}
          >
            <span style={{ fontSize: "14px" }}>{b.icon}</span>
            {b.text}
          </div>
        ))}
      </div>
      <p style={{ marginTop: "12px", fontSize: "11px", color: "var(--text-faint)", textAlign: "center", width: "100%" }}>
        Berdasarkan peraturan resmi DJP & Sistem Coretax.
      </p>
    </div>
  );
}
