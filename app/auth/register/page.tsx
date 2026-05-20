import Link from "next/link";
import Image from "next/image";
import { signup } from "../actions";

export default function RegisterPage() {
  return (
    <div className="auth-layout" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-base)", position: "relative", overflow: "hidden" }}>
      {/* Background Orbs */}
      <div className="bg-orb bg-orb-1" style={{ filter: "blur(80px)" }} />
      <div className="bg-orb bg-orb-2" style={{ filter: "blur(100px)" }} />
      
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "400px", padding: "20px" }}>
        
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link href="/">
            <Image
              src="/logo-navbar.png"
              alt="KonsulPajak AI"
              width={180}
              height={44}
              style={{ height: "40px", width: "auto", margin: "0 auto" }}
            />
          </Link>
        </div>

        {/* Card */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", padding: "32px", boxShadow: "0 4px 24px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.04)", border: "1px solid var(--border-subtle)" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "8px", textAlign: "center" }}>
            Buat Akun Gratis
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "28px", textAlign: "center" }}>
            Mulai tanya jawab pajak dalam hitungan detik.
          </p>

          <button style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "11px 16px", backgroundColor: "#FFFFFF", border: "1.5px solid var(--border)", borderRadius: "12px", color: "var(--text-secondary)", fontSize: "14px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s ease", marginBottom: "20px" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-surface-2)"; e.currentTarget.style.borderColor = "var(--border-blue)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#FFFFFF"; e.currentTarget.style.borderColor = "var(--border)"; }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Daftar dengan Google
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border-subtle)" }} />
            <span style={{ fontSize: "12px", color: "var(--text-faint)", fontWeight: "500", textTransform: "uppercase" }}>Atau Email</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border-subtle)" }} />
          </div>

          <form action={signup} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label htmlFor="name" style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>Nama Lengkap</label>
              <input id="name" name="name" type="text" placeholder="Budi Santoso" required style={{ width: "100%", padding: "11px 14px", backgroundColor: "#FFFFFF", border: "1.5px solid var(--border)", borderRadius: "10px", color: "var(--text-primary)", fontSize: "14px", outline: "none", transition: "border-color 0.2s ease" }} 
                onFocus={(e) => e.currentTarget.style.borderColor = "var(--primary)"}
                onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
              />
            </div>
            <div>
              <label htmlFor="email" style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>Email</label>
              <input id="email" name="email" type="email" placeholder="nama@email.com" required style={{ width: "100%", padding: "11px 14px", backgroundColor: "#FFFFFF", border: "1.5px solid var(--border)", borderRadius: "10px", color: "var(--text-primary)", fontSize: "14px", outline: "none", transition: "border-color 0.2s ease" }} 
                onFocus={(e) => e.currentTarget.style.borderColor = "var(--primary)"}
                onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
              />
            </div>
            <div>
              <label htmlFor="password" style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>Password</label>
              <input id="password" name="password" type="password" placeholder="Minimal 8 karakter" required minLength={8} style={{ width: "100%", padding: "11px 14px", backgroundColor: "#FFFFFF", border: "1.5px solid var(--border)", borderRadius: "10px", color: "var(--text-primary)", fontSize: "14px", outline: "none", transition: "border-color 0.2s ease" }}
                onFocus={(e) => e.currentTarget.style.borderColor = "var(--primary)"}
                onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
              />
            </div>
            
            <button type="submit" style={{ width: "100%", padding: "11px 16px", backgroundColor: "var(--primary)", border: "none", borderRadius: "10px", color: "#FFFFFF", fontSize: "14px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s ease", marginTop: "8px", boxShadow: "0 2px 8px rgba(30,144,255,0.3)" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(30,144,255,0.4)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(30,144,255,0.3)"; }}
            >
              Buat Akun
            </button>
          </form>

          <p style={{ fontSize: "11.5px", color: "var(--text-faint)", textAlign: "center", marginTop: "20px", lineHeight: 1.5 }}>
            Dengan mendaftar, Anda menyetujui <Link href="/syarat" style={{ color: "var(--primary)", textDecoration: "none" }}>Syarat & Ketentuan</Link> serta <Link href="/privasi" style={{ color: "var(--primary)", textDecoration: "none" }}>Kebijakan Privasi</Link> kami.
          </p>
        </div>

        <p style={{ textAlign: "center", fontSize: "14px", color: "var(--text-muted)", marginTop: "24px" }}>
          Sudah punya akun? <Link href="/auth/login" style={{ color: "var(--primary)", fontWeight: "600", textDecoration: "none" }}>Masuk</Link>
        </p>

      </div>
    </div>
  );
}
