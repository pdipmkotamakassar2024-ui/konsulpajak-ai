export interface RegulatoryEntry {
  id: string;
  title: string;
  reviewedAt: string;
  effectiveFrom?: string;
  keywords: string[];
  facts: string[];
  officialSources: { label: string; url: string }[];
}

export const REGULATORY_KNOWLEDGE_VERSION = "2026-07-27";

export const REGULATORY_KNOWLEDGE: RegulatoryEntry[] = [
  {
    id: "pendaftaran-npwp-online-coretax",
    title: "Pendaftaran NPWP Online melalui Coretax DJP",
    reviewedAt: REGULATORY_KNOWLEDGE_VERSION,
    keywords: [
      "daftar npwp", "buat npwp", "bikin npwp", "npwp online", "registrasi npwp",
      "pendaftaran npwp", "pendaftaran wajib pajak", "cara mendapat npwp", "aktivasi nik",
    ],
    facts: [
      "Pendaftaran NPWP online yang berlaku saat ini harus diarahkan langsung ke portal resmi Coretax DJP: https://coretaxdjp.pajak.go.id. Jangan mengarahkan pengguna ke e-Registration/ereg lama.",
      "Untuk orang pribadi penduduk Indonesia yang belum terdaftar: buka Coretax DJP, klik 'Daftar di sini', pilih 'Perorangan', pilih bahwa Wajib Pajak memiliki NIK, lalu pilih 'Pendaftaran dengan Aktivasi NIK/Aktivasi NIK'.",
      "Lengkapi isian, gunakan email dan nomor ponsel aktif untuk OTP, lakukan verifikasi identitas dengan swafoto dan Validasi Foto, centang pernyataan, lalu klik Kirim Pengajuan.",
      "Setelah permohonan berhasil, periksa email yang didaftarkan untuk menerima nomor NPWP dan cetakan NPWP digital dalam format PDF; kartu tidak lagi dikirim secara fisik melalui pos.",
      "Bedakan pendaftaran Wajib Pajak baru dengan aktivasi akun. Pengguna yang sudah memiliki NPWP tetapi belum memiliki akses Coretax tidak perlu mendaftar NPWP ulang; arahkan ke menu Aktivasi Akun Wajib Pajak.",
      "Jangan meminta pengguna mengirimkan NIK, swafoto, OTP, atau kata sandi melalui percakapan. Pastikan domain tujuan adalah coretaxdjp.pajak.go.id.",
    ],
    officialSources: [
      { label: "DJP Coretaxpedia — Pendaftaran WP Orang Pribadi", url: "https://www.pajak.go.id/coretaxpedia/pendaftaran-wp-orang-pribadi" },
      { label: "Portal resmi Coretax DJP", url: "https://coretaxdjp.pajak.go.id" },
    ],
  },
  {
    id: "spt-masa-pph-unifikasi-coretax",
    title: "SPT Masa PPh Unifikasi melalui Coretax DJP",
    reviewedAt: REGULATORY_KNOWLEDGE_VERSION,
    effectiveFrom: "2025-01-01",
    keywords: [
      "pph unifikasi", "spt unifikasi", "spt masa unifikasi", "ebupot unifikasi",
      "e-bupot unifikasi", "bukti potong unifikasi", "apa itu unifikasi", "coretax unifikasi",
    ],
    facts: [
      "SPT Masa PPh Unifikasi adalah satu SPT Masa yang dipakai Pemotong/Pemungut untuk melaporkan kewajiban pemotongan/pemungutan, penyetoran hasil pemotongan/pemungutan, dan/atau penyetoran sendiri atas beberapa jenis PPh dalam satu Masa Pajak.",
      "Cakupannya meliputi PPh Pasal 4 ayat (2), PPh Pasal 15, PPh Pasal 22, dan PPh Pasal 23/26. PPh Pasal 21 dan PPh Pasal 26 yang berkaitan dengan pekerjaan, jasa, atau kegiatan orang pribadi dilaporkan melalui SPT Masa PPh Pasal 21/26, bukan digabung secara umum ke SPT Masa PPh Unifikasi.",
      "Tujuan unifikasi adalah menyatukan pembuatan bukti potong/pungut dan pelaporan beberapa jenis PPh yang sebelumnya terpisah. PPh Unifikasi bukan jenis atau tarif pajak baru.",
      "Untuk masa pajak pada era Coretax, akses portal https://coretaxdjp.pajak.go.id lalu gunakan menu Surat Pemberitahuan (SPT), buat SPT, dan pilih jenis SPT PPh Unifikasi. Coretax menggunakan SPT Masa PPh Unifikasi untuk seluruh Wajib Pajak, tidak lagi dibedakan antara instansi pemerintah dan non-instansi pemerintah.",
      "Sejak PMK 81 Tahun 2024 berlaku, pembayaran/penyetoran masa untuk PPh yang dicakup diseragamkan paling lambat tanggal 15 bulan berikutnya; batas pelaporan SPT Masa PPh Unifikasi tetap paling lambat tanggal 20 bulan berikutnya. Jika jatuh tempo bertepatan dengan hari libur, ikuti ketentuan pergeseran ke hari kerja berikutnya.",
      "Jangan menjawab bahwa PPh Unifikasi mencakup PPh Pasal 21 secara umum. Jelaskan pengecualian PPh 21/26 orang pribadi agar pengguna tidak salah memilih SPT.",
    ],
    officialSources: [
      { label: "DJP — SPT Masa PPh Unifikasi", url: "https://pajak.go.id/panduan-layanan-pajak/konten/pelaporan/2025/badan/spt/spt-masa-pph-unifikasi" },
      { label: "DJP — Buku Manual Coretax SPT Masa Unifikasi", url: "https://pajak.go.id/sites/default/files/2025-01/Buku%20Manual%20Coretax%202024%20-%20Seri%20SPT%20Masa%20Unifikasi.pdf" },
      { label: "DJP — PMK 81/2024 dan batas penyetoran tanggal 15", url: "https://www.pajak.go.id/id/siaran-pers/pemerintah-terbitkan-aturan-pelaksanaan-sistem-inti-administrasi-perpajakan-coretax" },
    ],
  },
  {
    id: "objek-jasa-pph23-pmk141-2015",
    title: "Objek Jasa PPh Pasal 23 berdasarkan PMK 141/PMK.03/2015",
    reviewedAt: REGULATORY_KNOWLEDGE_VERSION,
    effectiveFrom: "2015-08-27",
    keywords: [
      "pph 23", "pph23", "pasal 23", "jasa pph 23", "objek pph 23", "tarif pph 23",
      "jasa apa saja", "jenis jasa", "pmk 141", "jasa teknik", "jasa manajemen", "jasa konsultan",
    ],
    facts: [
      "Imbalan jasa yang menjadi objek PPh Pasal 23 dipotong 2% dari jumlah bruto tidak termasuk PPN, sepanjang dibayarkan kepada Wajib Pajak dalam negeri/BUT, tidak sudah dikenai PPh final, dan bukan jasa yang telah dipotong PPh Pasal 21. Jika penerima tidak memiliki NPWP, tarif menjadi 100% lebih tinggi sesuai ketentuan yang berlaku.",
      "Kelompok utama objek jasa PPh Pasal 23 adalah jasa teknik, jasa manajemen, jasa konsultan, serta 'jasa lain' yang dirinci dalam PMK 141/PMK.03/2015. Jasa konstruksi harus diperiksa khusus: jika tunduk pada rezim PPh Final jasa konstruksi, jangan dipaksakan menjadi PPh Pasal 23.",
      "Daftar jasa lain PMK 141 meliputi: penilai/appraisal; aktuaris; akuntansi, pembukuan dan atestasi laporan keuangan; hukum; arsitektur; perencanaan kota/arsitektur lanskap; desain; pengeboran serta jasa penunjang migas, panas bumi dan pertambangan; penunjang penerbangan/bandar udara; penebangan hutan; pengolahan limbah; penyedia tenaga kerja/tenaga ahli; perantara/keagenan; perdagangan surat berharga tertentu; kustodian; dubbing/sulih suara; mixing film; pembuatan sarana promosi; software, hardware dan sistem komputer; pembuatan/pengelolaan website; internet; penyimpanan/pengolahan/penyaluran data; instalasi dan pemeliharaan mesin/peralatan/utilitas; perawatan kendaraan; maklon; keamanan; event organizer; media/periklanan; pembasmian hama; cleaning service; sedot septic tank; pemeliharaan kolam; serta katering/tata boga.",
      "Daftar tersebut juga mencakup: freight forwarding; logistik; pengurusan dokumen; pengepakan; loading/unloading; laboratorium/pengujian; pengelolaan parkir; penyondiran tanah; penyiapan/pengolahan lahan; pembibitan/penanaman; pemeliharaan tanaman; pemanenan; pengolahan hasil pertanian/perkebunan/perikanan/peternakan/perhutanan; dekorasi; pencetakan/penerbitan; penerjemahan; pengangkutan/ekspedisi selain yang diatur Pasal 15; pelayanan kepelabuhanan; pengangkutan melalui pipa; penitipan anak; pelatihan/kursus; pengiriman/pengisian uang ATM; sertifikasi; survei; tester; serta jasa lain yang pembayarannya dibebankan pada APBN/APBD.",
      "Dasar pemotongan untuk jasa selain katering pada prinsipnya seluruh pembayaran tidak termasuk PPN. Gaji tenaga kerja, material, pembayaran pihak ketiga, dan reimbursement dapat dikeluarkan dari jumlah bruto hanya bila memenuhi syarat serta didukung kontrak, faktur, dan bukti pembayaran yang dipersyaratkan; tanpa bukti, dasar pemotongan adalah keseluruhan pembayaran tidak termasuk PPN.",
      "Sebelum menyimpulkan suatu transaksi terkena PPh Pasal 23, identifikasi jenis jasa, pihak pemberi dan penerima penghasilan, status dalam negeri/BUT, apakah sudah terkena PPh 21, PPh final atau Pasal 15, serta komponen jumlah bruto dan PPN.",
    ],
    officialSources: [
      { label: "DJP — PPh Pasal 23/26", url: "https://www.pajak.go.id/id/pph-pasal-2326" },
      { label: "DJP — PMK 141/PMK.03/2015 (status aktif dan daftar jasa)", url: "https://pajak.go.id/en/node/63200" },
    ],
  },
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
    keywords: ["umkm", "0,5%", "0.5%", "pp 20", "omzet", "omset", "omzet 500 juta", "pph final", "koperasi", "perseroan perorangan", "toko online", "usaha online", "usaha kecil", "pajak toko"],
    facts: [
      "PP 20 Tahun 2026 mempertahankan tarif PPh Final UMKM 0,5% dan menajamkan penerimanya menjadi Wajib Pajak orang pribadi, perseroan perorangan, dan koperasi yang memenuhi ketentuan.",
      "Bagian omzet sampai Rp500 juta setahun yang tidak dikenai PPh Final hanya berlaku bagi Wajib Pajak orang pribadi, bukan otomatis bagi semua bentuk usaha.",
      "Contoh: toko online milik orang pribadi dengan omzet stabil Rp30 juta per bulan memiliki proyeksi omzet Rp360 juta setahun. Jika memenuhi syarat fasilitas PPh Final UMKM dan omzet kumulatif tahun berjalan belum melewati Rp500 juta, PPh Finalnya masih nihil. Jika usahanya berbentuk badan, kesimpulan ini tidak berlaku otomatis sehingga bentuk Wajib Pajak dan masa fasilitas harus diperiksa.",
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
    keywords: ["jatuh tempo", "batas bayar", "batas setor", "batas lapor", "batas pelaporan", "pelaporan ppn", "pelaporan pph 21", "pph 21", "tanggal 10", "tanggal 15", "tanggal 20", "pmk 81"],
    facts: [
      "PMK 81 Tahun 2024 menyeragamkan jatuh tempo pembayaran atau penyetoran banyak jenis pajak masa, termasuk PPh Pasal 21, menjadi paling lambat tanggal 15 bulan berikutnya.",
      "SPT Masa PPh Pasal 21/26 dilaporkan paling lambat tanggal 20 bulan berikutnya setelah Masa Pajak berakhir.",
      "SPT Masa PPN bagi PKP dilaporkan paling lambat akhir bulan berikutnya setelah Masa Pajak berakhir dan tetap wajib disampaikan walaupun tidak ada penyerahan BKP/JKP. PPN kurang bayar disetor paling lambat akhir bulan berikutnya sebelum SPT Masa PPN disampaikan.",
      "Jangan lagi menyebut tanggal 10 sebagai batas setor PPh Pasal 21 untuk masa pajak yang tunduk pada ketentuan baru.",
    ],
    officialSources: [
      { label: "DJP — Penyederhanaan Jatuh Tempo Pembayaran", url: "https://www.pajak.go.id/id/berita/pemerintah-sederhanakan-jatuh-tempo-pembayaran-pajak-lewat-peraturan-menkeu" },
      { label: "DJP — SPT Masa PPN", url: "https://www.pajak.go.id/panduan-layanan-pajak/konten/pelaporan/2025/badan/spt/spt-masa-ppn" },
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
  if (entries.length === 0) return "Tidak ada entri knowledge base terkurasi yang cocok. Anda tetap boleh menjawab konsep perpajakan umum yang stabil secara ringkas. Jangan menolak hanya karena entri tidak ditemukan, tetapi jangan mengarang tarif, tenggat, dasar hukum, atau prosedur yang dapat berubah; bila fakta mutakhir itu menentukan jawaban, nyatakan bagian yang perlu diverifikasi melalui DJP/JDIH.";

  return entries.map((entry) => [
    `### ${entry.title}`,
    `Ditinjau: ${entry.reviewedAt}${entry.effectiveFrom ? ` | Mulai berlaku: ${entry.effectiveFrom}` : ""}`,
    ...entry.facts.map((fact) => `- ${fact}`),
    "Sumber resmi:",
    ...entry.officialSources.map((source) => `- ${source.label}: ${source.url}`),
  ].join("\n")).join("\n\n");
}
