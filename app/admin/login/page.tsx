"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Login admin gagal.");
        return;
      }

      window.location.assign("/admin");
    } catch {
      setError("Tidak dapat terhubung ke server. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "24px", background: "#F8FAFC", fontFamily: "var(--font-inter), sans-serif" }}>
      <section style={{ width: "100%", maxWidth: "420px", padding: "32px", borderRadius: "18px", background: "white", boxShadow: "0 12px 35px rgba(15, 23, 42, 0.08)" }}>
        <div style={{ marginBottom: "28px", textAlign: "center" }}>
          <div style={{ width: "48px", height: "48px", margin: "0 auto 14px", display: "grid", placeItems: "center", borderRadius: "14px", color: "white", background: "#2563EB", fontWeight: 800 }}>A</div>
          <h1 style={{ margin: 0, color: "#0F172A", fontSize: "25px" }}>Login Admin</h1>
          <p style={{ margin: "8px 0 0", color: "#64748B", fontSize: "14px" }}>Akses khusus pengelola KonsulPajak AI</p>
        </div>

        {error && <div role="alert" style={{ marginBottom: "18px", padding: "12px", borderRadius: "9px", color: "#991B1B", background: "#FEE2E2", fontSize: "14px" }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "17px" }}>
          <label style={{ display: "grid", gap: "7px", color: "#334155", fontSize: "14px", fontWeight: 600 }}>
            Username
            <input autoComplete="username" autoFocus value={username} onChange={(event) => setUsername(event.target.value)} required style={{ width: "100%", padding: "12px 13px", border: "1px solid #CBD5E1", borderRadius: "9px", fontSize: "15px", outlineColor: "#2563EB" }} />
          </label>
          <label style={{ display: "grid", gap: "7px", color: "#334155", fontSize: "14px", fontWeight: 600 }}>
            Password
            <input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required style={{ width: "100%", padding: "12px 13px", border: "1px solid #CBD5E1", borderRadius: "9px", fontSize: "15px", outlineColor: "#2563EB" }} />
          </label>
          <button type="submit" disabled={loading} style={{ marginTop: "4px", padding: "13px", border: 0, borderRadius: "9px", color: "white", background: loading ? "#94A3B8" : "#2563EB", fontSize: "15px", fontWeight: 700, cursor: loading ? "wait" : "pointer" }}>
            {loading ? "Memeriksa..." : "Masuk ke Dashboard"}
          </button>
        </form>

        <p style={{ margin: "22px 0 0", textAlign: "center", fontSize: "13px" }}>
          <Link href="/" style={{ color: "#2563EB", textDecoration: "none" }}>Kembali ke halaman utama</Link>
        </p>
      </section>
    </main>
  );
}
