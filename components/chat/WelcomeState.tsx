"use client";

import Image from "next/image";

// Daftar saran prompt — tetap sama seperti sebelumnya
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
    desc: "Panduan step-by-step lapor SPT pribadi 2025/2026",
    prompt: "Bagaimana cara lapor SPT Tahunan orang pribadi untuk tahun pajak 2025/2026? Saya karyawan swasta.",
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
];

interface WelcomeStateProps {
  onPromptClick: (prompt: string) => void;
}

export default function WelcomeState({ onPromptClick }: WelcomeStateProps) {
  return (
    <div
      className="welcome-container"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh",
        paddingTop: 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ===== Dekorasi lingkaran transparan melayang di background ===== */}
      <div
        className="floating-circle"
        style={{
          position: "absolute",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "rgba(59,130,246,0.15)",
          filter: "blur(2px)",
          top: "10%",
          left: "8%",
          animation: "floatCircle1 6s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        className="floating-circle"
        style={{
          position: "absolute",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          background: "rgba(99,102,241,0.18)",
          filter: "blur(2px)",
          top: "20%",
          right: "12%",
          animation: "floatCircle2 7s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        className="floating-circle"
        style={{
          position: "absolute",
          width: "35px",
          height: "35px",
          borderRadius: "50%",
          background: "rgba(139,92,246,0.2)",
          filter: "blur(2px)",
          bottom: "25%",
          left: "15%",
          animation: "floatCircle3 5s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        className="floating-circle"
        style={{
          position: "absolute",
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          background: "rgba(59,130,246,0.17)",
          filter: "blur(2px)",
          bottom: "30%",
          right: "18%",
          animation: "floatCircle4 8s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* ===== Logo dengan efek glow dan ring ===== */}
      <div
        className="welcome-logo-wrapper animate-fade-up"
        style={{
          marginBottom: "32px",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Dekorasi sparkle ✦ di sekitar logo */}
        <span
          className="sparkle sparkle-1"
          style={{
            position: "absolute",
            fontSize: "14px",
            color: "#3B82F6",
            top: "5px",
            left: "-10px",
            animation: "sparkleAnim1 2.5s ease-in-out infinite",
            pointerEvents: "none",
          }}
        >
          ✦
        </span>
        <span
          className="sparkle sparkle-2"
          style={{
            position: "absolute",
            fontSize: "10px",
            color: "#6366F1",
            top: "-8px",
            right: "10px",
            animation: "sparkleAnim2 3s ease-in-out infinite",
            pointerEvents: "none",
          }}
        >
          ✦
        </span>
        <span
          className="sparkle sparkle-3"
          style={{
            position: "absolute",
            fontSize: "12px",
            color: "#8B5CF6",
            bottom: "5px",
            left: "0px",
            animation: "sparkleAnim3 2s ease-in-out infinite",
            pointerEvents: "none",
          }}
        >
          ✦
        </span>
        <span
          className="sparkle sparkle-4"
          style={{
            position: "absolute",
            fontSize: "8px",
            color: "#60A5FA",
            bottom: "-5px",
            right: "-5px",
            animation: "sparkleAnim4 3.5s ease-in-out infinite",
            pointerEvents: "none",
          }}
        >
          ✦
        </span>

        {/* Lingkaran putih dengan outer glow dan border ring */}
        <div
          style={{
            width: "140px",
            height: "140px",
            borderRadius: "50%",
            background: "#FFFFFF",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 0 40px rgba(59,130,246,0.25)",
            border: "3px solid rgba(59,130,246,0.15)",
          }}
        >
          <Image
            src="/logo-tengah.png"
            alt="KonsulPajak AI"
            width={100}
            height={100}
            className="welcome-logo-img"
            style={{ width: "100px", height: "100px", borderRadius: "50%" }}
            priority
          />
        </div>
      </div>

      {/* ===== Judul utama ===== */}
      <h1
        className="animate-fade-up animate-delay-100"
        style={{
          textAlign: "center",
          marginBottom: "4px",
          fontFamily: "'Poppins', sans-serif",
          fontSize: "clamp(36px, 5vw, 54px)",
          fontWeight: 800,
          color: "#0B1B3B",
          lineHeight: 1.2,
        }}
      >
        Selamat Datang! <span className="wave-emoji">👋</span>
      </h1>

      {/* ===== Nama brand dengan gradient ===== */}
      <h2
        className="animate-fade-up animate-delay-100"
        style={{
          textAlign: "center",
          marginTop: "0px",
          marginBottom: "0px",
          fontFamily: "'Poppins', sans-serif",
          fontSize: "clamp(36px, 5vw, 54px)",
          fontWeight: 800,
          lineHeight: 1.2,
        }}
      >
        <span
          style={{
            background: "linear-gradient(90deg, #3B82F6, #2563EB, #6366F1, #8B5CF6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            whiteSpace: "nowrap",
          }}
        >
          KonsulPajak AI
        </span>
      </h2>

      {/* ===== Garis dekoratif gradient di bawah nama brand ===== */}
      <div
        className="animate-fade-up animate-delay-100"
        style={{
          width: "180px",
          height: "6px",
          background: "linear-gradient(90deg, #3B82F6, #60A5FA)",
          borderRadius: "50px",
          marginTop: "8px",
          marginBottom: "16px",
        }}
      />

      {/* ===== Subtitle ===== */}
      <p
        className="animate-fade-up-2"
        style={{
          marginBottom: "40px",
          fontFamily: "'Inter', sans-serif",
          fontSize: "22px",
          fontWeight: 400,
          color: "#6B7280",
          textAlign: "center",
        }}
      >
        Asisten Konsultan Pajak Coretax Anda.
      </p>

      {/* ===== Wave SVG di bagian bawah container ===== */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          lineHeight: 0,
          pointerEvents: "none",
        }}
      >
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ width: "100%", height: "60px", display: "block" }}
        >
          <path
            d="M0,40 C360,100 1080,0 1440,60 L1440,120 L0,120 Z"
            fill="rgba(59,130,246,0.06)"
          />
          <path
            d="M0,60 C320,10 720,110 1440,40 L1440,120 L0,120 Z"
            fill="rgba(99,102,241,0.04)"
          />
        </svg>
      </div>

      {/* ===== Keyframes untuk animasi dekorasi ===== */}
      <style jsx>{`
        /* Animasi lingkaran melayang */
        @keyframes floatCircle1 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-18px) translateX(10px); }
        }
        @keyframes floatCircle2 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(14px) translateX(-12px); }
        }
        @keyframes floatCircle3 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-12px) translateX(-8px); }
        }
        @keyframes floatCircle4 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(10px) translateX(6px); }
        }

        /* Animasi sparkle berkedip dan bergerak halus */
        @keyframes sparkleAnim1 {
          0%, 100% { opacity: 0.3; transform: scale(0.8) translateY(0px); }
          50% { opacity: 1; transform: scale(1.2) translateY(-6px); }
        }
        @keyframes sparkleAnim2 {
          0%, 100% { opacity: 0.4; transform: scale(1) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.3) rotate(20deg); }
        }
        @keyframes sparkleAnim3 {
          0%, 100% { opacity: 0.2; transform: scale(0.9) translateX(0px); }
          50% { opacity: 1; transform: scale(1.1) translateX(5px); }
        }
        @keyframes sparkleAnim4 {
          0%, 100% { opacity: 0.5; transform: scale(1) translateY(0px); }
          50% { opacity: 0.8; transform: scale(1.4) translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
