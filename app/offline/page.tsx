"use client";

import Link from "next/link";
import Image from "next/image";

export default function OfflineConsultationPage() {
  return (
    <div className="app-layout" style={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh", padding: "40px 20px" }}>
      {/* Background ambient orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      
      {/* Header */}
      <div style={{ width: "100%", maxWidth: "800px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "60px", zIndex: 10 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
          <Image src="/logo-icon.jpeg" alt="Logo" width={32} height={32} style={{ borderRadius: "8px" }} />
          <span style={{ fontSize: "18px", fontWeight: "600", color: "#fff" }}>KonsulPajak AI</span>
        </Link>
        <Link href="/" style={{ fontSize: "14px", color: "var(--text-secondary)", textDecoration: "none", padding: "8px 16px", borderRadius: "99px", border: "1px solid var(--border)", background: "rgba(255,255,255,0.02)" }}>
          Kembali ke Chat
        </Link>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "600px", width: "100%", textAlign: "center", zIndex: 10, position: "relative" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 16px",
          background: "rgba(30,144,255,0.1)",
          border: "1px solid rgba(30,144,255,0.2)",
          borderRadius: "99px",
          color: "#38A3F5",
          fontSize: "13px",
          fontWeight: "600",
          marginBottom: "24px"
        }}>
          ✨ Layanan Premium & Offline
        </div>
        
        <h1 style={{ fontSize: "36px", fontWeight: "700", color: "#fff", marginBottom: "16px", letterSpacing: "-0.5px", lineHeight: "1.2" }}>
          Butuh Analisis Mendalam untuk Perusahaan Anda?
        </h1>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "40px", lineHeight: "1.6" }}>
          Konsultasi tatap muka eksklusif dengan konsultan pajak berlisensi resmi. Solusi komprehensif untuk tax planning, SP2DK, audit, hingga pendampingan hukum.
        </p>

        {/* Pricing/Feature Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "40px", textAlign: "left" }}>
          {[
            { title: "Konsultasi Tatap Muka / Zoom", desc: "Sesi 60-90 menit membahas secara spesifik masalah perpajakan Anda langsung dengan ahlinya." },
            { title: "Analisis SP2DK & Tindak Lanjut", desc: "Kami bantu menyusun tanggapan resmi dan strategi mitigasi risiko denda pajak." },
            { title: "Review Laporan Keuangan", desc: "Pemeriksaan detail sebelum pelaporan SPT Tahunan Badan atau Pribadi." },
            { title: "Akses AI Premium Tanpa Batas", desc: "Bebas batasan 5 chat. Tanya jawab, analisis foto faktur, dan kalkulator tak terbatas." }
          ].map((feature, i) => (
            <div key={i} style={{
              padding: "20px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              display: "flex",
              gap: "16px",
              alignItems: "flex-start"
            }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "rgba(16,185,129,0.1)", color: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <div>
                <h3 style={{ color: "#fff", fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>{feature.title}</h3>
                <p style={{ color: "var(--text-faint)", fontSize: "14px", lineHeight: "1.5" }}>{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <a 
          href="https://wa.me/6281234567890" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            width: "100%",
            padding: "16px",
            background: "linear-gradient(135deg, #1E90FF, #38A3F5)",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "600",
            borderRadius: "16px",
            textDecoration: "none",
            boxShadow: "0 8px 24px rgba(30,144,255,0.3)",
            transition: "all 0.2s"
          }}
        >
          Hubungi Admin via WhatsApp
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
        </a>
        <p style={{ marginTop: "16px", fontSize: "13px", color: "var(--text-faint)" }}>
          Atau kunjungi kantor kami di Jakarta Selatan. Senin-Jumat, 09.00 - 17.00 WIB.
        </p>
      </div>
    </div>
  );
}
