"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Fitur", href: "#fitur" },
  { label: "Harga", href: "#harga" },
  { label: "Blog Pajak", href: "#blog" },
  { label: "Tentang", href: "#tentang" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      id="navbar"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "all 0.3s ease",
        background: scrolled
          ? "rgba(13, 13, 13, 0.92)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(55, 65, 81, 0.4)"
          : "1px solid transparent",
      }}
    >
      <div
        className="container-custom"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 24px",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <Image
            src="/logo-navbar.png"
            alt="KonsulPajak AI"
            width={200}
            height={48}
            style={{ height: "40px", width: "auto", objectFit: "contain" }}
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
          className="hidden-mobile"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="btn-ghost"
              style={{ fontSize: "14px", color: "var(--text-secondary)" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
          className="hidden-mobile"
        >
          <Link href="/auth/login" className="btn-secondary" style={{ padding: "9px 20px", fontSize: "14px" }}>
            Masuk
          </Link>
          <Link href="/auth/register" className="btn-primary" style={{ padding: "9px 20px", fontSize: "14px" }}>
            Coba Gratis
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          id="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: "none",
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "8px",
            cursor: "pointer",
            color: "var(--text-primary)",
          }}
          className="show-mobile"
          aria-label="Buka menu"
        >
          {mobileOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="animate-slide-down"
          style={{
            background: "rgba(13, 13, 13, 0.98)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid var(--border)",
            padding: "16px 24px 24px",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                padding: "12px 0",
                color: "var(--text-secondary)",
                textDecoration: "none",
                fontSize: "15px",
                fontWeight: "500",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
            <Link href="/auth/login" className="btn-secondary" style={{ textAlign: "center" }}>
              Masuk
            </Link>
            <Link href="/auth/register" className="btn-primary" style={{ justifyContent: "center" }}>
              Coba Gratis
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
          .hidden-mobile { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
