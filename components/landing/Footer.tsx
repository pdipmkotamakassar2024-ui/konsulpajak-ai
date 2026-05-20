"use client";

import Image from "next/image";
import Link from "next/link";

const footerLinks = {
  Produk: [
    { label: "Fitur", href: "#fitur" },
    { label: "Harga", href: "#harga" },
    { label: "Kalkulator Pajak", href: "/kalkulator" },
    { label: "Template SP2DK", href: "/template-sp2dk" },
    { label: "Blog Pajak", href: "/blog" },
  ],
  Hukum: [
    { label: "UU HPP No. 7/2021", href: "#" },
    { label: "PP 55/2022 (Pajak UMKM)", href: "#" },
    { label: "UU PPh", href: "#" },
    { label: "UU PPN", href: "#" },
    { label: "PMK Terbaru", href: "#" },
  ],
  Perusahaan: [
    { label: "Tentang Kami", href: "/tentang" },
    { label: "Kontak", href: "/kontak" },
    { label: "Kebijakan Privasi", href: "/privasi" },
    { label: "Syarat & Ketentuan", href: "/syarat" },
    { label: "Keamanan Data", href: "/keamanan" },
  ],
};

export default function Footer() {
  return (
    <footer
      id="footer"
      style={{
        background: "var(--bg-base)",
        borderTop: "1px solid var(--border)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top gradient line */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(30,144,255,0.4), transparent)",
      }} />

      <div className="container-custom" style={{ padding: "64px 24px 40px" }}>
        {/* Main grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
          gap: "40px",
          marginBottom: "56px",
        }}
          className="footer-grid"
        >
          {/* Brand column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Image
              src="/logo-navbar.png"
              alt="KonsulPajak AI"
              width={180}
              height={44}
              style={{ height: "36px", width: "auto", objectFit: "contain" }}
            />
            <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.7", maxWidth: "260px" }}>
              Konsultan pajak berbasis AI untuk UMKM dan profesional Indonesia. Akurat, transparan, dan terpercaya.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              {[
                {
                  label: "Twitter/X",
                  href: "#",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.258 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                    </svg>
                  ),
                },
                {
                  label: "Instagram",
                  href: "#",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  ),
                },
                {
                  label: "LinkedIn",
                  href: "#",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  ),
                },
              ].map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--bg-surface-2)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-muted)",
                    transition: "all 0.2s ease",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border-blue)";
                    (e.currentTarget as HTMLElement).style.color = "var(--primary-light)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(30,144,255,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                    (e.currentTarget as HTMLElement).style.background = "var(--bg-surface-2)";
                  }}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{
                fontSize: "13px",
                fontWeight: "700",
                color: "var(--text-primary)",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
              }}>
                {category}
              </div>
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{
                    fontSize: "14px",
                    color: "var(--text-muted)",
                    textDecoration: "none",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--primary-light)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-muted)")}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="divider-gradient" style={{ marginBottom: "32px" }} />

        {/* Bottom bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}>
          <div style={{ fontSize: "13px", color: "var(--text-faint)" }}>
            © 2025 KonsulPajak AI. Hak Cipta Dilindungi.
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            color: "var(--text-faint)",
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Informasi di platform ini bersifat edukatif dan tidak menggantikan konsultan pajak profesional berlisensi.</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 500px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
