import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://konsulpajak-ai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "KonsulPajak AI — Konsultan Pajak Pribadi untuk UMKM & Profesional",
  description:
    "Konsultasi pajak Indonesia berbasis AI dengan knowledge base regulasi terkurasi, kalkulator PPh 21, dan panduan Coretax.",
  keywords: [
    "konsultan pajak",
    "pajak UMKM",
    "PPh 21",
    "PPN",
    "SPT Tahunan",
    "AI pajak Indonesia",
    "DJP",
    "kalkulator pajak",
  ],
  openGraph: {
    title: "KonsulPajak AI — Konsultan Pajak Pribadi Berbasis AI",
    description:
      "Pusing urus pajak? Biar AI yang hitung & jelaskan. Konsultan pajak untuk UMKM dan Profesional.",
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "KonsulPajak AI",
    images: [
      {
        url: "/logo-icon.jpeg",
        width: 1200,
        height: 630,
        alt: "KonsulPajak AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KonsulPajak AI — Konsultan Pajak Berbasis AI",
    description: "Pusing urus pajak? Biar AI yang hitung & jelaskan.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
