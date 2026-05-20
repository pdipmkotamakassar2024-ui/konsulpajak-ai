"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "Gagal melakukan login dengan Google.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Ambient orbs */}
      <div style={{
        position: "absolute", top: "-20%", left: "-10%",
        width: "600px", height: "600px",
        background: "radial-gradient(circle, rgba(30,144,255,0.15) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-20%", right: "-10%",
        width: "500px", height: "500px",
        background: "radial-gradient(circle, rgba(56,163,245,0.12) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />

      {/* Card */}
      <div style={{
        position: "relative",
        zIndex: 10,
        width: "100%",
        maxWidth: "420px",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "24px",
        padding: "48px 40px",
        boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
      }}>
        {/* Logo & Brand */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{
            width: "64px", height: "64px",
            background: "linear-gradient(135deg, #1E90FF, #38A3F5)",
            borderRadius: "18px",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
            boxShadow: "0 8px 24px rgba(30,144,255,0.4)",
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h1 style={{
            fontSize: "26px", fontWeight: "700",
            color: "#ffffff", marginBottom: "8px",
            letterSpacing: "-0.5px",
          }}>
            KonsulPajak AI
          </h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: "1.5" }}>
            Konsultan pajak pribadi berbasis AI<br/>untuk UMKM & Profesional Indonesia
          </p>
        </div>

        {/* Divider */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          marginBottom: "28px",
        }}/>

        {/* Error message */}
        {error && (
          <div style={{
            marginBottom: "20px",
            padding: "12px 16px",
            background: "rgba(239,68,68,0.15)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "12px",
            color: "#fca5a5",
            fontSize: "13px",
            textAlign: "center",
          }}>
            {error}
          </div>
        )}

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          style={{
            width: "100%",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
            background: isLoading ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.95)",
            color: "#1a1a2e",
            fontWeight: "600", fontSize: "15px",
            padding: "14px 20px",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "14px",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.7 : 1,
            transition: "all 0.2s ease",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.background = "#ffffff"; }}
          onMouseLeave={(e) => { if (!isLoading) e.currentTarget.style.background = "rgba(255,255,255,0.95)"; }}
        >
          {isLoading ? (
            <div style={{
              width: "20px", height: "20px",
              border: "2px solid #94a3b8", borderTopColor: "#1E90FF",
              borderRadius: "50%", animation: "spin 0.8s linear infinite",
            }}/>
          ) : (
            <svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          <span>{isLoading ? "Menghubungkan ke Google..." : "Lanjutkan dengan Google"}</span>
        </button>

        {/* Features */}
        <div style={{ marginTop: "28px" }}>
          {[
            { icon: "🔒", text: "Login aman dengan akun Google Anda" },
            { icon: "💬", text: "Riwayat konsultasi pajak tersimpan" },
            { icon: "⚡", text: "Akses AI konsultan 24/7" },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "8px 0",
              color: "rgba(255,255,255,0.5)",
              fontSize: "13px",
              borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none",
            }}>
              <span style={{ fontSize: "16px" }}>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Back link */}
        <div style={{ marginTop: "28px", textAlign: "center" }}>
          <Link href="/" style={{
            color: "rgba(30,144,255,0.8)",
            fontSize: "13px",
            textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: "4px",
            transition: "color 0.2s",
          }}>
            ← Kembali ke halaman utama
          </Link>
        </div>

        {/* Footer */}
        <p style={{
          marginTop: "20px",
          textAlign: "center",
          fontSize: "11px",
          color: "rgba(255,255,255,0.25)",
          lineHeight: "1.6",
        }}>
          Dengan masuk, Anda menyetujui syarat penggunaan kami.<br/>
          Data Anda diproses sesuai kebijakan privasi.
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
