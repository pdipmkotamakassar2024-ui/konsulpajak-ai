"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [planType, setPlanType] = useState("1_bulan");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchSubscriptions = async () => {
    try {
      const res = await fetch("/api/admin/subscriptions");
      if (res.ok) {
        const data = await res.json();
        setSubscriptions(data.data || []);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setErrorMessage("Akses Ditolak: Anda bukan Admin atau belum login.");
      }
    } catch (err) {
      console.error(err);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          plan_type: planType,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`Sukses! Paket untuk ${email} telah diaktifkan.`);
        setEmail("");
        fetchSubscriptions();
      } else {
        setMessage(`Gagal: ${data.error}`);
      }
    } catch (err: any) {
      setMessage(`Gagal: ${err.message}`);
    }
    setLoading(false);
  };

  if (isAuthenticated === null) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>
        <p style={{ color: "#6B7280" }}>Memeriksa otentikasi admin...</p>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>
        <div style={{ background: "white", padding: "40px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", width: "100%", maxWidth: "400px", textAlign: "center" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#991B1B", marginBottom: "16px" }}>Akses Ditolak</h1>
          <p style={{ color: "#374151", marginBottom: "24px" }}>{errorMessage}</p>
          <Link href="/login" style={{ display: "inline-block", padding: "12px 24px", background: "#3B82F6", color: "white", textDecoration: "none", borderRadius: "8px", fontWeight: 600 }}>
            Ke Halaman Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "Inter, sans-serif", padding: "40px 20px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#0B1B3B", marginBottom: "32px" }}>Dashboard Admin</h1>

        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#1F2937", marginBottom: "20px" }}>Aktivasi Paket Manual</h2>
          {message && (
            <div style={{ padding: "12px", borderRadius: "8px", background: message.includes("Sukses") ? "#D1FAE5" : "#FEE2E2", color: message.includes("Sukses") ? "#065F46" : "#991B1B", marginBottom: "20px", fontSize: "14px" }}>
              {message}
            </div>
          )}
          <form onSubmit={handleActivate} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#374151", marginBottom: "8px" }}>Email Pengguna (yang terdaftar di sistem)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@contoh.com"
                required
                style={{ width: "100%", padding: "12px", border: "1px solid #D1D5DB", borderRadius: "8px", outline: "none" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#374151", marginBottom: "8px" }}>Pilih Paket</label>
              <select
                value={planType}
                onChange={(e) => setPlanType(e.target.value)}
                style={{ width: "100%", padding: "12px", border: "1px solid #D1D5DB", borderRadius: "8px", outline: "none", background: "white" }}
              >
                <option value="1_bulan">Paket Bulanan (1 Bulan)</option>
                <option value="3_bulan">Paket 3 Bulan</option>
                <option value="1_tahun">Paket Tahunan (1 Tahun)</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: "14px", background: "#10B981", color: "white", border: "none", borderRadius: "8px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", marginTop: "8px" }}
            >
              {loading ? "Memproses..." : "Aktifkan Paket Sekarang"}
            </button>
          </form>
        </div>

        <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#1F2937", marginBottom: "20px" }}>Daftar Pelanggan Aktif</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #E5E7EB", color: "#6B7280" }}>
                  <th style={{ padding: "12px 0" }}>Email</th>
                  <th style={{ padding: "12px 0" }}>Paket</th>
                  <th style={{ padding: "12px 0" }}>Kedaluwarsa Pada</th>
                  <th style={{ padding: "12px 0" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: "24px 0", textAlign: "center", color: "#9CA3AF" }}>Belum ada data pelanggan.</td>
                  </tr>
                ) : (
                  subscriptions.map((sub) => {
                    const isExpired = new Date(sub.expires_at) < new Date();
                    return (
                      <tr key={sub.id} style={{ borderBottom: "1px solid #E5E7EB" }}>
                        <td style={{ padding: "16px 0", color: "#111827", fontWeight: 500 }}>{sub.email}</td>
                        <td style={{ padding: "16px 0", color: "#374151" }}>
                          {sub.plan_type === '1_bulan' ? '1 Bulan' : sub.plan_type === '3_bulan' ? '3 Bulan' : '1 Tahun'}
                        </td>
                        <td style={{ padding: "16px 0", color: "#6B7280" }}>{new Date(sub.expires_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                        <td style={{ padding: "16px 0" }}>
                          <span style={{ padding: "4px 10px", borderRadius: "99px", fontSize: "12px", fontWeight: 600, background: isExpired ? "#FEE2E2" : "#D1FAE5", color: isExpired ? "#991B1B" : "#065F46" }}>
                            {isExpired ? "Kedaluwarsa" : "Aktif"}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
