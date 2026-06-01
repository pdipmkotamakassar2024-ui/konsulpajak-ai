// ============================================================
//   PPh 21 Lookup Tables — PP No. 58 Tahun 2023
// ============================================================

// --- PTKP Table ---
export const PTKP: Record<string, number> = {
  "TK/0": 54_000_000,
  "TK/1": 58_500_000,
  "TK/2": 63_000_000,
  "TK/3": 67_500_000,
  "K/0":  58_500_000,
  "K/1":  63_000_000,
  "K/2":  67_500_000,
  "K/3":  72_000_000,
};

export const PTKP_OPTIONS = Object.keys(PTKP);

// --- TER Category mapping based on PTKP ---
export function getTerCategory(ptkpStatus: string): "A" | "B" | "C" {
  if (["TK/0", "TK/1"].includes(ptkpStatus)) return "A";
  if (["TK/2", "TK/3", "K/0"].includes(ptkpStatus)) return "B";
  return "C"; // K/1, K/2, K/3
}

// TER Tabel Kategori A (TK/0 dan TK/1)
// Format: [minBruto, maxBruto, rate]
export const TER_A: [number, number, number][] = [
  [0, 5_400_000, 0],
  [5_400_001, 5_650_000, 0.25],
  [5_650_001, 5_950_000, 0.5],
  [5_950_001, 6_300_000, 0.75],
  [6_300_001, 6_750_000, 1],
  [6_750_001, 7_500_000, 1.25],
  [7_500_001, 8_550_000, 1.5],
  [8_550_001, 9_650_000, 1.75],
  [9_650_001, 10_050_000, 2],
  [10_050_001, 10_350_000, 2.25],
  [10_350_001, 10_700_000, 2.5],
  [10_700_001, 11_050_000, 3],
  [11_050_001, 11_600_000, 3.5],
  [11_600_001, 12_500_000, 4],
  [12_500_001, 13_750_000, 5],
  [13_750_001, 15_100_000, 6],
  [15_100_001, 16_950_000, 7],
  [16_950_001, 19_750_000, 8],
  [19_750_001, 24_150_000, 9],
  [24_150_001, 26_450_000, 10],
  [26_450_001, 28_000_000, 11],
  [28_000_001, 30_050_000, 12],
  [30_050_001, 32_400_000, 13],
  [32_400_001, 35_400_000, 14],
  [35_400_001, 39_100_000, 15],
  [39_100_001, 43_850_000, 16],
  [43_850_001, 47_800_000, 17],
  [47_800_001, 51_400_000, 17.5],
  [51_400_001, 56_300_000, 18],
  [56_300_001, 62_200_000, 18.5],
  [62_200_001, 68_600_000, 19],
  [68_600_001, 77_500_000, 20],
  [77_500_001, 89_000_000, 21],
  [89_000_001, 103_000_000, 22],
  [103_000_001, 125_000_000, 23],
  [125_000_001, 157_000_000, 24],
  [157_000_001, 206_000_000, 25],
  [206_000_001, 337_000_000, 26],
  [337_000_001, 454_000_000, 28],
  [454_000_001, 550_000_000, 30],
  [550_000_001, 695_000_000, 31],
  [695_000_001, 910_000_000, 32],
  [910_000_001, 1_400_000_000, 33],
  [1_400_000_001, Infinity, 34],
];

// TER Tabel Kategori B (TK/2, TK/3, K/0)
export const TER_B: [number, number, number][] = [
  [0, 6_200_000, 0],
  [6_200_001, 6_500_000, 0.25],
  [6_500_001, 6_850_000, 0.5],
  [6_850_001, 7_300_000, 0.75],
  [7_300_001, 9_200_000, 1],
  [9_200_001, 10_750_000, 1.5],
  [10_750_001, 11_250_000, 2],
  [11_250_001, 11_600_000, 2.5],
  [11_600_001, 12_600_000, 3],
  [12_600_001, 13_600_000, 4],
  [13_600_001, 14_950_000, 5],
  [14_950_001, 16_400_000, 6],
  [16_400_001, 18_450_000, 7],
  [18_450_001, 21_850_000, 8],
  [21_850_001, 26_000_000, 9],
  [26_000_001, 27_700_000, 10],
  [27_700_001, 29_350_000, 11],
  [29_350_001, 31_450_000, 12],
  [31_450_001, 33_950_000, 13],
  [33_950_001, 37_100_000, 14],
  [37_100_001, 41_100_000, 15],
  [41_100_001, 45_800_000, 16],
  [45_800_001, 49_500_000, 17],
  [49_500_001, 53_800_000, 17.5],
  [53_800_001, 58_500_000, 18],
  [58_500_001, 64_000_000, 18.5],
  [64_000_001, 71_000_000, 19],
  [71_000_001, 80_000_000, 20],
  [80_000_001, 93_000_000, 21],
  [93_000_001, 109_000_000, 22],
  [109_000_001, 129_000_000, 23],
  [129_000_001, 163_000_000, 24],
  [163_000_001, 211_000_000, 25],
  [211_000_001, 374_000_000, 26],
  [374_000_001, 459_000_000, 28],
  [459_000_001, 555_000_000, 30],
  [555_000_001, 704_000_000, 31],
  [704_000_001, 957_000_000, 32],
  [957_000_001, 1_405_000_000, 33],
  [1_405_000_001, Infinity, 34],
];

// TER Tabel Kategori C (K/1, K/2, K/3)
export const TER_C: [number, number, number][] = [
  [0, 6_600_000, 0],
  [6_600_001, 6_950_000, 0.25],
  [6_950_001, 7_350_000, 0.5],
  [7_350_001, 7_800_000, 0.75],
  [7_800_001, 8_850_000, 1],
  [8_850_001, 9_800_000, 1.25],
  [9_800_001, 10_950_000, 1.5],
  [10_950_001, 11_200_000, 2],
  [11_200_001, 12_050_000, 3],
  [12_050_001, 12_950_000, 4],
  [12_950_001, 14_150_000, 5],
  [14_150_001, 15_550_000, 6],
  [15_550_001, 17_050_000, 7],
  [17_050_001, 19_500_000, 8],
  [19_500_001, 22_700_000, 9],
  [22_700_001, 25_950_000, 10],
  [25_950_001, 28_100_000, 11],
  [28_100_001, 30_100_000, 12],
  [30_100_001, 32_600_000, 13],
  [32_600_001, 35_400_000, 14],
  [35_400_001, 39_400_000, 15],
  [39_400_001, 43_800_000, 16],
  [43_800_001, 47_600_000, 17],
  [47_600_001, 51_600_000, 17.5],
  [51_600_001, 56_600_000, 18],
  [56_600_001, 61_000_000, 18.5],
  [61_000_001, 66_700_000, 19],
  [66_700_001, 74_500_000, 20],
  [74_500_001, 86_000_000, 21],
  [86_000_001, 101_000_000, 22],
  [101_000_001, 122_000_000, 23],
  [122_000_001, 155_000_000, 24],
  [155_000_001, 193_000_000, 25],
  [193_000_001, 289_000_000, 26],
  [289_000_001, 394_000_000, 28],
  [394_000_001, 524_000_000, 30],
  [524_000_001, 686_000_000, 31],
  [686_000_001, 828_000_000, 32],
  [828_000_001, 1_390_000_000, 33],
  [1_390_000_001, Infinity, 34],
];

// --- Pasal 17 Progressive Rates ---
export const PASAL_17: [number, number, number][] = [
  [0, 60_000_000, 5],
  [60_000_001, 250_000_000, 15],
  [250_000_001, 500_000_000, 25],
  [500_000_001, 5_000_000_000, 30],
  [5_000_000_001, Infinity, 35],
];

// --- Kode Objek Pajak (KOP) for PPh 21 Final ---
export interface FinalTaxParam {
  label: string;
  needsGolongan?: boolean;
  calculate: (bruto: number, golongan?: string) => number;
}

export const FINAL_KOP: Record<string, FinalTaxParam> = {
  "21-401-07": {
    label: "Honor PNS dari APBN/APBD",
    needsGolongan: true,
    calculate: (bruto, golongan) => {
      if (!golongan) return 0;
      const tarif = golongan.startsWith("I") || golongan.startsWith("II") ? 0 :
                    golongan.startsWith("III") ? 0.05 : 0.15;
      return bruto * tarif;
    }
  },
  "21-402-01": {
    label: "Pesangon (Sekaligus)",
    calculate: (bruto) => {
      // Tarif berjenjang pesangon
      let tax = 0;
      if (bruto > 500_000_000) {
        tax += (bruto - 500_000_000) * 0.25; bruto = 500_000_000;
      }
      if (bruto > 100_000_000) {
        tax += (bruto - 100_000_000) * 0.15; bruto = 100_000_000;
      }
      if (bruto > 50_000_000) {
        tax += (bruto - 50_000_000) * 0.10; bruto = 50_000_000;
      }
      if (bruto > 0) {
        tax += bruto * 0;
      }
      return tax;
    }
  },
};

export interface TidakFinalParam {
  label: string;
  dppFactor: 0.5 | 1;  // 50% or 100% dari bruto
}

export const TIDAK_FINAL_KOP: Record<string, TidakFinalParam> = {
  "21-100-01": { label: "Tenaga Ahli (Konsultan, Dokter, dll)", dppFactor: 0.5 },
  "21-100-02": { label: "Agen Asuransi / Distributor MLM", dppFactor: 0.5 },
  "21-100-03": { label: "Penjaja Barang Dagangan", dppFactor: 0.5 },
  "21-100-04": { label: "Anggota Dewan Komisaris (Bukan Pegawai)", dppFactor: 1 },
  "21-100-05": { label: "Mantan Pegawai (Jasa Produksi/Bonus)", dppFactor: 1 },
  "21-100-06": { label: "Peserta Kegiatan/Lomba", dppFactor: 1 },
};

// Golongan PNS for dropdown
export const GOLONGAN_PNS_OPTIONS = [
  { value: "I/a", label: "I/a - Juru Muda (0%)" },
  { value: "I/b", label: "I/b - Juru Muda Tk. I (0%)" },
  { value: "I/c", label: "I/c - Juru (0%)" },
  { value: "I/d", label: "I/d - Juru Tk. I (0%)" },
  { value: "II/a", label: "II/a - Pengatur Muda (0%)" },
  { value: "II/b", label: "II/b - Pengatur Muda Tk. I (0%)" },
  { value: "II/c", label: "II/c - Pengatur (0%)" },
  { value: "II/d", label: "II/d - Pengatur Tk. I (0%)" },
  { value: "III/a", label: "III/a - Penata Muda (5%)" },
  { value: "III/b", label: "III/b - Penata Muda Tk. I (5%)" },
  { value: "III/c", label: "III/c - Penata (5%)" },
  { value: "III/d", label: "III/d - Penata Tk. I (5%)" },
  { value: "IV/a", label: "IV/a - Pembina (15%)" },
  { value: "IV/b", label: "IV/b - Pembina Tk. I (15%)" },
  { value: "IV/c", label: "IV/c - Pembina Utama Muda (15%)" },
  { value: "IV/d", label: "IV/d - Pembina Utama Madya (15%)" },
  { value: "IV/e", label: "IV/e - Pembina Utama (15%)" }
];

// ============================================================
//   Core Calculation Functions
// ============================================================

/** Lookup TER rate based on bruto and category */
export function getTerRate(bruto: number, category: "A" | "B" | "C"): number {
  const table = category === "A" ? TER_A : category === "B" ? TER_B : TER_C;
  for (const [min, max, rate] of table) {
    if (bruto >= min && bruto <= max) return rate / 100;
  }
  return 0.34; // max rate
}

/** Calculate progressive Pasal 17 tax on PKP */
export function calcPasal17(pkp: number): number {
  let tax = 0;
  let remaining = pkp;
  let prevMax = 0;
  for (const [min, max, rate] of PASAL_17) {
    if (remaining <= 0) break;
    const bracket = (max === Infinity ? remaining : Math.min(max, pkp)) - prevMax;
    const taxable = Math.min(remaining, bracket);
    if (taxable > 0) tax += taxable * (rate / 100);
    remaining -= taxable;
    prevMax = max;
  }
  return Math.max(0, Math.floor(tax));
}

/** Format number as Indonesian Rupiah */
export function formatRupiah(val: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);
}

/** Parse a localized number string back to a raw number */
export function parseNumber(val: string): number {
  return parseFloat(val.replace(/[^0-9]/g, "")) || 0;
}
