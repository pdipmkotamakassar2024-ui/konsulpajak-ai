import Link from "next/link";

export const metadata = {
  title: "Kebijakan Privasi | KonsulPajak AI",
  description: "Kebijakan privasi KonsulPajak AI untuk penggunaan chat pajak, akun, dan lampiran dokumen.",
};

export default function PrivasiPage() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #F8FAFC 0%, #EEF4FF 100%)",
      color: "#0B1B3B",
      fontFamily: "var(--font-inter), system-ui, sans-serif",
      padding: "48px 20px 72px",
    }}>
      <article style={{ maxWidth: "820px", margin: "0 auto", background: "#FFFFFF", border: "1px solid #E4EAF2", borderRadius: "16px", padding: "32px", boxShadow: "0 8px 30px rgba(15,23,42,0.06)" }}>
        <Link href="/" style={{ color: "#2563EB", textDecoration: "none", fontSize: "14px", fontWeight: 600 }}>
          ← Kembali ke Konsultasi
        </Link>

        <h1 style={{ fontSize: "32px", lineHeight: 1.2, marginTop: "24px", marginBottom: "12px" }}>
          Kebijakan Privasi
        </h1>
        <p style={{ color: "#64748B", marginBottom: "28px" }}>
          Terakhir diperbarui: 30 Juni 2026
        </p>

        {[
          {
            title: "Data yang diproses",
            body: "KonsulPajak AI memproses pertanyaan chat, riwayat konsultasi untuk pengguna login, alamat email akun, status langganan, dan lampiran yang Anda unggah untuk dianalisis. Jangan mengunggah data yang tidak diperlukan untuk konsultasi pajak.",
          },
          {
            title: "Tujuan pemrosesan",
            body: "Data digunakan untuk memberikan jawaban pajak, menyimpan riwayat konsultasi, membatasi penggunaan paket gratis, mengelola langganan, dan menjaga keamanan layanan.",
          },
          {
            title: "Lampiran dokumen",
            body: "Gambar dan PDF yang Anda kirim diproses untuk menjawab pertanyaan terkait. PDF berbasis teks dapat diekstrak sebelum dikirim ke model AI. Jika dokumen berisi NPWP, NIK, alamat, atau data finansial, pastikan Anda memang ingin data tersebut dianalisis.",
          },
          {
            title: "Penyimpanan dan akses",
            body: "Riwayat chat pengguna login disimpan di database Supabase dan hanya dapat diakses oleh akun terkait serta proses server internal. Data langganan hanya dikelola melalui akses admin.",
          },
          {
            title: "Batasan layanan",
            body: "Jawaban AI dapat mengandung kesalahan dan bukan pengganti nasihat resmi konsultan pajak berlisensi. Informasi penting tetap perlu diverifikasi dengan dokumen resmi DJP atau profesional pajak.",
          },
          {
            title: "Kontak",
            body: "Untuk permintaan penghapusan data atau pertanyaan privasi, hubungi admin melalui WhatsApp yang tersedia di aplikasi.",
          },
        ].map((section) => (
          <section key={section.title} style={{ marginTop: "24px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "8px" }}>{section.title}</h2>
            <p style={{ color: "#334155", lineHeight: 1.75 }}>{section.body}</p>
          </section>
        ))}
      </article>
    </main>
  );
}
