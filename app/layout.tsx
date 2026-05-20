import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KonsulPajak AI — Konsultan Pajak Pribadi untuk UMKM & Profesional",
  description:
    "Konsultasi pajak Indonesia berbasis AI. Hitung pajak, pahami aturan DJP, dan lapor SPT dengan mudah. Didukung database >10.000 peraturan pajak resmi.",
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
    url: "https://konsulpajak-ai.com",
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
      <head>
        <link rel="icon" href="/logo-icon.jpeg" type="image/jpeg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
