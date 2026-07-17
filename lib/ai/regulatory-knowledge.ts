export interface RegulatoryEntry {
  id: string;
  title: string;
  reviewedAt: string;
  effectiveFrom?: string;
  keywords: string[];
  facts: string[];
  officialSources: { label: string; url: string }[];
}

export const REGULATORY_KNOWLEDGE_VERSION = "2026-07-17";

export const REGULATORY_KNOWLEDGE: RegulatoryEntry[] = [
  {
    id: "pph-final-jasa-konstruksi-pp9-2022",
    title: "PPh Final Jasa Konstruksi berdasarkan PP 9 Tahun 2022",
    reviewedAt: REGULATORY_KNOWLEDGE_VERSION,
    effectiveFrom: "2022-02-21",
    keywords: [
      "jasa konstruksi", "pekerjaan konstruksi", "pelaksana konstruksi", "konsultansi konstruksi",
      "konstruksi terintegrasi", "sbu", "sertifikat badan usaha", "sbu kecil", "pph final konstruksi",
      "pph pasal 4 ayat 2", "pph 4 ayat 2", "nilai kontrak",
    ],
    facts: [
      "PP 9 Tahun 2022 berlaku sejak 21 Februari 2022 dan mengganti matriks tarif lama jasa konstruksi. Tarif 2% untuk pelaksanaan konstruksi berkualifikasi kecil adalah tarif lama; sejak tanggal tersebut tarif yang berlaku menjadi 1,75%.",
      "Pekerjaan konstruksi oleh penyedia yang memiliki SBU kualifikasi kecil, atau sertifikat kompetensi kerja untuk usaha orang perseorangan: 1,75%.",
      "Pekerjaan konstruksi tanpa SBU atau sertifikat kompetensi kerja untuk usaha orang perseorangan: 4%.",
      "Pekerjaan konstruksi oleh penyedia selain kategori kecil dan tanpa sertifikat di atas (antara lain berkualifikasi menengah/besar): 2,65%.",
      "Pekerjaan konstruksi terintegrasi dengan SBU: 2,65%; tanpa SBU: 4%.",
      "Jasa konsultansi konstruksi dengan SBU atau sertifikat kompetensi kerja untuk usaha orang perseorangan: 3,5%; tanpa sertifikat: 6%.",
      "Tarif ditentukan oleh jenis layanan dan status sertifikasi/kualifikasi, bukan semata-mata nilai kontrak atau bentuk badan. Jika pengguna sudah menyebut PT, pelaksana/pekerjaan konstruksi, dan SBU kecil, data penentu sudah cukup: gunakan tarif 1,75% tanpa meminta konfirmasi tambahan.",
      "Contoh pasti dengan asumsi Rp2.500.000.000 merupakan jumlah pembayaran sebelum PPN: PPh Final = 1,75% × Rp2.500.000.000 = Rp43.750.000. Jangan menjawab 2% atau Rp50.000.000 untuk pelaksana konstruksi dengan SBU kecil pada transaksi yang tunduk pada PP 9 Tahun 2022.",
    ],
    officialSources: [
      { label: "BPK — PP 9 Tahun 2022 (status berlaku dan matriks tarif)", url: "https://peraturan.bpk.go.id/Details/199710/pp-no-9-tahun-2022" },
      { label: "JDIH Kemenkeu — PP 9 Tahun 2022", url: "https://www.jdih.kemenkeu.go.id/dok/pp-9-tahun-2022/view" },
      { label: "DJP — Tarif PPh Final Jasa Konstruksi Turun", url: "https://pajak.go.id/index.php/en/node/76970" },
    ],
  },
  {
    id: "marketplace-pph22-pmk37-2025",
    title: "Pemungutan PPh Pasal 22 oleh marketplace",
    reviewedAt: REGULATORY_KNOWLEDGE_VERSION,
    effectiveFrom: "2025-07-14",
    keywords: ["marketplace", "shopee", "tokopedia", "lazada", "blibli", "pph 22", "pph22", "pmk 37", "pedagang online"],
    facts: [
      "PMK 37 Tahun 2025 berlaku sejak 14 Juli 2025 dan mengatur penunjukan marketplace sebagai pemungut PPh Pasal 22; PMK ini bukan pajak baru.",
      "Pada 1 Juli 2026 DJP resmi menunjuk Blibli, Shopee, Tokopedia, dan Lazada sebagai pemungut PPh Pasal 22.",
      "Tarif pemungutan adalah 0,5% dari peredaran bruto yang tercantum dalam dokumen tagihan, tidak termasuk PPN dan PPnBM.",
      "Wajib Pajak orang pribadi dengan peredaran bruto tahun berjalan sampai Rp500 juta dapat tidak dipungut setelah menyampaikan surat pernyataan sesuai ketentuan kepada marketplace.",
      "Jangan menyimpulkan tanggal mulai pemotongan operasional tertentu bila tanggal itu tidak tercantum pada sumber/keputusan penunjukan yang tersedia. Bedakan tanggal PMK berlaku, tanggal penunjukan marketplace, dan tanggal implementasi teknis.",
    ],
    officialSources: [
      { label: "DJP — Pemungutan PPh oleh Marketplace", url: "https://pajak.go.id/id/pemungutan-pph-oleh-marketplace" },
      { label: "DJP — Penunjukan Empat Marketplace (1 Juli 2026)", url: "https://pajak.go.id/id/siaran-pers/pemerintah-implementasi-pmk-372025-melalui-penunjukan-empat-marketplace-sebagai" },
      { label: "JDIH Kemenkeu — PMK 37 Tahun 2025", url: "https://jdih.kemenkeu.go.id/dok/pmk-37-tahun-2025" },
    ],
  },
  {
    id: "spt-op-2025-coretax",
    title: "Pelaporan SPT Tahunan Orang Pribadi Tahun Pajak 2025 di Coretax",
    reviewedAt: REGULATORY_KNOWLEDGE_VERSION,
    effectiveFrom: "2026-01-01",
    keywords: ["spt 2025", "spt tahunan", "lapor spt", "orang pribadi", "1770ss", "1770s", "1770", "coretax"],
    facts: [
      "SPT Tahunan Orang Pribadi Tahun Pajak 2025 dilaporkan melalui Coretax DJP.",
      "Alur resminya: Surat Pemberitahuan (SPT) > Surat Pemberitahuan (SPT) > Buat Konsep SPT; pilih PPh Orang Pribadi, SPT Tahunan, periode Januari–Desember 2025, dan status Normal atau Pembetulan.",
      "Setelah konsep dibuat, buka dengan ikon pensil, gunakan Posting untuk menarik data yang tersedia, periksa dan lengkapi formulir, lalu bayar bila kurang bayar dan laporkan dengan otorisasi yang berlaku.",
      "Jangan mengarahkan pengguna Tahun Pajak 2025 untuk memilih formulir lama 1770SS/1770S/1770. Formulir lama relevan pada layanan tahun pajak 2024 dan sebelumnya.",
    ],
    officialSources: [
      { label: "DJP Coretaxpedia — Lapor SPT Tahunan Orang Pribadi", url: "https://www.pajak.go.id/coretaxpedia/lapor-spt-tahunan-orang-pribadi" },
      { label: "DJP — SPT Tahunan Orang Pribadi", url: "https://www.pajak.go.id/panduan-layanan-pajak/konten/pelaporan/2025/orang-pribadi/spt/spt-tahunan-pph-wajib-pajak-orang-pribadi" },
    ],
  },
  {
    id: "ppn-2025",
    title: "Tarif PPN sejak 2025",
    reviewedAt: REGULATORY_KNOWLEDGE_VERSION,
    effectiveFrom: "2025-01-01",
    keywords: ["ppn", "ppn 11", "ppn 12", "tarif 11", "tarif 12", "barang mewah", "dpp nilai lain"],
    facts: [
      "Sejak 1 Januari 2025 tarif PPN menurut undang-undang adalah 12%.",
      "Untuk barang/jasa nonmewah, DPP nilai lain 11/12 dari harga jual atau penggantian membuat beban efektif tetap 11%.",
      "Tarif penuh 12% berlaku pada barang dan jasa mewah tertentu sesuai ketentuan. Karena itu jawaban tidak boleh sekadar mengatakan semua transaksi dikenai PPN 11%.",
    ],
    officialSources: [
      { label: "DJP — Kebijakan PPN 2025", url: "https://www.pajak.go.id/id/siaran-pers/ppn-2025-kebijakan-baru-beban-pajak-tetap-ringan-untuk-masyarakat" },
    ],
  },
  {
    id: "umkm-pp20-2026",
    title: "PPh Final UMKM berdasarkan PP 20 Tahun 2026",
    reviewedAt: REGULATORY_KNOWLEDGE_VERSION,
    effectiveFrom: "2026-01-01",
    keywords: ["umkm", "0,5%", "0.5%", "pp 20", "omzet 500 juta", "pph final", "koperasi", "perseroan perorangan"],
    facts: [
      "PP 20 Tahun 2026 mempertahankan tarif PPh Final UMKM 0,5% dan menajamkan penerimanya menjadi Wajib Pajak orang pribadi, perseroan perorangan, dan koperasi yang memenuhi ketentuan.",
      "Bagian omzet sampai Rp500 juta setahun yang tidak dikenai PPh Final hanya berlaku bagi Wajib Pajak orang pribadi, bukan otomatis bagi semua bentuk usaha.",
      "Pastikan menanyakan bentuk Wajib Pajak, omzet, jenis penghasilan, dan masa pemanfaatan fasilitas sebelum menyimpulkan kewajiban.",
    ],
    officialSources: [
      { label: "DJP — PPh Final UMKM Tetap 0,5 Persen", url: "https://www.pajak.go.id/id/siaran-pers/pph-final-umkm-tetap-05-persen-djp-perkuat-ketepatan-sasaran" },
    ],
  },
  {
    id: "jatuh-tempo-pmk81-2024",
    title: "Jatuh tempo pembayaran pajak masa",
    reviewedAt: REGULATORY_KNOWLEDGE_VERSION,
    effectiveFrom: "2025-01-01",
    keywords: ["jatuh tempo", "batas bayar", "batas setor", "pph 21", "tanggal 10", "tanggal 15", "pmk 81"],
    facts: [
      "PMK 81 Tahun 2024 menyeragamkan jatuh tempo pembayaran atau penyetoran banyak jenis pajak masa, termasuk PPh Pasal 21, menjadi paling lambat tanggal 15 bulan berikutnya.",
      "Jangan lagi menyebut tanggal 10 sebagai batas setor PPh Pasal 21 untuk masa pajak yang tunduk pada ketentuan baru.",
    ],
    officialSources: [
      { label: "DJP — Penyederhanaan Jatuh Tempo Pembayaran", url: "https://www.pajak.go.id/id/berita/pemerintah-sederhanakan-jatuh-tempo-pembayaran-pajak-lewat-peraturan-menkeu" },
    ],
  },
];

function normalize(value: string) {
  return value.toLocaleLowerCase("id-ID").replace(/[^a-z0-9%,./\s-]/g, " ");
}

export function selectRegulatoryEntries(query: string, maxEntries = 4): RegulatoryEntry[] {
  const haystack = normalize(query);
  return REGULATORY_KNOWLEDGE
    .map((entry) => ({
      entry,
      score: entry.keywords.reduce((score, keyword) => score + (haystack.includes(normalize(keyword)) ? Math.max(2, keyword.length / 4) : 0), 0),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxEntries)
    .map(({ entry }) => entry);
}

export function buildRegulatoryContext(query: string): string {
  const entries = selectRegulatoryEntries(query);
  if (entries.length === 0) return "Tidak ada entri knowledge base terkurasi yang cocok. Nyatakan keterbatasan dan jangan mengarang aturan, tarif, tanggal, atau prosedur.";

  return entries.map((entry) => [
    `### ${entry.title}`,
    `Ditinjau: ${entry.reviewedAt}${entry.effectiveFrom ? ` | Mulai berlaku: ${entry.effectiveFrom}` : ""}`,
    ...entry.facts.map((fact) => `- ${fact}`),
    "Sumber resmi:",
    ...entry.officialSources.map((source) => `- ${source.label}: ${source.url}`),
  ].join("\n")).join("\n\n");
}
