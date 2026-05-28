"use client";

import { useState, useCallback } from "react";
import {
  PTKP_OPTIONS,
  PTKP,
  FINAL_KOP,
  TIDAK_FINAL_KOP,
  GOLONGAN_PNS,
  getTerCategory,
  getTerRate,
  calcPasal17,
  formatRupiah,
} from "@/lib/tax/pph21-data";

// ============================================================
//   Types
// ============================================================
type PemotonganType = "bulanan" | "tahunan" | "final" | "tidak_final";

interface CalcResult {
  label: string;
  value: number;
  highlight?: boolean;
  separator?: boolean;
  note?: string;
}

// ============================================================
//   Helper sub-components
// ============================================================
function InputField({ label, value, onChange, prefix = "Rp", note, disabled }: {
  label: string; value: string; onChange: (v: string) => void;
  prefix?: string; note?: string; disabled?: boolean;
}) {
  return (
    <div className="kalk-field">
      <label className="kalk-label">{label}</label>
      {note && <p className="kalk-note">{note}</p>}
      <div className="kalk-input-wrap">
        {prefix && <span className="kalk-prefix">{prefix}</span>}
        <input
          className="kalk-input"
          type="text"
          inputMode="numeric"
          value={value}
          disabled={disabled}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9]/g, "");
            const formatted = raw ? parseInt(raw).toLocaleString("id-ID") : "";
            onChange(formatted);
          }}
          placeholder="0"
        />
      </div>
    </div>
  );
}

function SelectField({ label, options, value, onChange, note }: {
  label: string; options: { value: string; label: string }[];
  value: string; onChange: (v: string) => void; note?: string;
}) {
  return (
    <div className="kalk-field">
      <label className="kalk-label">{label}</label>
      {note && <p className="kalk-note">{note}</p>}
      <select className="kalk-select" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function ResultRow({ item }: { item: CalcResult }) {
  if (item.separator) return <div className="kalk-result-separator" />;
  return (
    <div className={`kalk-result-row ${item.highlight ? "highlight" : ""}`}>
      <span className="kalk-result-label">{item.label}</span>
      <span className="kalk-result-value">{formatRupiah(item.value)}</span>
    </div>
  );
}

// ============================================================
//   PPh 21 Bulanan (TER)
// ============================================================
function BulananForm() {
  const [bruto, setBruto] = useState("");
  const [ptkp, setPtkp] = useState("TK/0");
  const [results, setResults] = useState<CalcResult[] | null>(null);

  const calculate = useCallback(() => {
    const brutoNum = parseFloat(bruto.replace(/[^0-9]/g, "")) || 0;
    const category = getTerCategory(ptkp);
    const rate = getTerRate(brutoNum, category);
    const pph = Math.round(brutoNum * rate);

    setResults([
      { label: "Penghasilan Bruto", value: brutoNum },
      { label: `Kategori TER ${category}`, value: 0, note: `Tarif: ${(rate * 100).toFixed(2)}%` } as any,
      { separator: true } as any,
      { label: "PPh 21 Dipotong (Bulanan)", value: pph, highlight: true },
      { label: "Estimasi Setahun (×12)", value: pph * 12 },
      { label: "Neto Diterima", value: brutoNum - pph },
    ]);
  }, [bruto, ptkp]);

  return (
    <div className="kalk-form">
      <InputField label="Penghasilan Bruto (Bulanan)" value={bruto} onChange={setBruto}
        note="Masukkan gaji pokok + semua tunjangan sebelum pajak" />
      <SelectField label="Status PTKP" options={PTKP_OPTIONS.map(o => ({ value: o, label: o }))} value={ptkp} onChange={setPtkp} />
      <button className="kalk-btn" onClick={calculate}>Hitung PPh 21</button>
      {results && (
        <div className="kalk-results">
          <div className="kalk-results-title">Hasil Perhitungan</div>
          {results.map((r, i) => r.separator
            ? <div key={i} className="kalk-result-separator" />
            : r.note
              ? <div key={i} className="kalk-result-row info">
                  <span className="kalk-result-label">{r.label}</span>
                  <span className="kalk-result-value rate-badge">{r.note}</span>
                </div>
              : <ResultRow key={i} item={r} />
          )}
          <div className="kalk-disclaimer">
            Dihitung berdasarkan PP No. 58 Tahun 2023 (Tarif Efektif Rata-rata / TER)
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
//   PPh 21 Tahunan (A1/A2)
// ============================================================
function TahunanForm() {
  const [gaji, setGaji] = useState("");
  const [tunjangan, setTunjangan] = useState("");
  const [bonus, setBonus] = useState("");
  const [iuranPensiun, setIuranPensiun] = useState("");
  const [ptkp, setPtkp] = useState("TK/0");
  const [bulan, setBulan] = useState("12");
  const [results, setResults] = useState<CalcResult[] | null>(null);

  const calculate = useCallback(() => {
    const n = (v: string) => parseFloat(v.replace(/[^0-9]/g, "")) || 0;
    const gajiNum = n(gaji);
    const tunjanganNum = n(tunjangan);
    const bonusNum = n(bonus);
    const pensiun = n(iuranPensiun);
    const bulanNum = parseInt(bulan) || 12;

    const totalBruto = (gajiNum + tunjanganNum) * bulanNum + bonusNum;

    // Biaya Jabatan: 5% dari bruto, max 500.000/bulan = 6.000.000/tahun
    const biayaJabatan = Math.min(totalBruto * 0.05, 6_000_000);
    const totalPengurang = biayaJabatan + pensiun;
    const neto = totalBruto - totalPengurang;
    const pkp = Math.max(0, neto - PTKP[ptkp]);

    // Round PKP to nearest thousand (Pembulatan ribuan ke bawah)
    const pkpRounded = Math.floor(pkp / 1000) * 1000;
    const pphTerutang = calcPasal17(pkpRounded);

    setResults([
      { label: `Total Penghasilan Bruto (${bulanNum} bln)`, value: totalBruto },
      { label: "Biaya Jabatan (maks Rp 6 jt/thn)", value: -biayaJabatan },
      { label: "Iuran Pensiun (dibayar sendiri)", value: -pensiun },
      { separator: true } as any,
      { label: "Penghasilan Neto", value: neto },
      { label: `PTKP (${ptkp})`, value: -PTKP[ptkp] },
      { separator: true } as any,
      { label: "PKP (Penghasilan Kena Pajak)", value: pkpRounded },
      { separator: true } as any,
      { label: "PPh 21 Terutang Setahun", value: pphTerutang, highlight: true },
      { label: `PPh 21 Per Bulan (÷${bulanNum})`, value: Math.round(pphTerutang / bulanNum) },
    ]);
  }, [gaji, tunjangan, bonus, iuranPensiun, ptkp, bulan]);

  return (
    <div className="kalk-form">
      <div className="kalk-row-2">
        <SelectField label="Masa Penghasilan (Bulan)"
          options={Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: `${i + 1} Bulan` }))}
          value={bulan} onChange={setBulan} />
        <SelectField label="Status PTKP" options={PTKP_OPTIONS.map(o => ({ value: o, label: o }))} value={ptkp} onChange={setPtkp} />
      </div>
      <InputField label="Gaji Pokok (Per Bulan)" value={gaji} onChange={setGaji} />
      <InputField label="Tunjangan-tunjangan (Per Bulan)" value={tunjangan} onChange={setTunjangan}
        note="Tunjangan jabatan, transport, makan, dll" />
      <InputField label="Bonus / THR (Total Setahun)" value={bonus} onChange={setBonus}
        note="Masukkan total bonus/THR yang diterima sepanjang tahun" />
      <InputField label="Iuran Pensiun/JHT (Total, Dibayar Sendiri)" value={iuranPensiun} onChange={setIuranPensiun}
        note="Iuran yang menjadi tanggungan karyawan (bukan perusahaan)" />
      <button className="kalk-btn" onClick={calculate}>Hitung PPh 21 Tahunan</button>
      {results && (
        <div className="kalk-results">
          <div className="kalk-results-title">Hasil Rekap Tahunan (A1/A2)</div>
          {results.map((r, i) =>
            r.separator ? <div key={i} className="kalk-result-separator" />
              : <ResultRow key={i} item={r} />
          )}
          <div className="kalk-disclaimer">
            Menggunakan Tarif Progresif Pasal 17 dengan Biaya Jabatan sesuai PMK 168/2023
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
//   PPh 21 Final
// ============================================================
function FinalForm() {
  const [kopKey, setKopKey] = useState(Object.keys(FINAL_KOP)[0]);
  const [bruto, setBruto] = useState("");
  const [golongan, setGolongan] = useState("III/a");
  const [results, setResults] = useState<CalcResult[] | null>(null);

  const kop = FINAL_KOP[kopKey];

  const calculate = useCallback(() => {
    const brutoNum = parseFloat(bruto.replace(/[^0-9]/g, "")) || 0;
    const pph = kop.calculate(brutoNum, golongan);

    setResults([
      { label: "Penghasilan Bruto", value: brutoNum },
      { separator: true } as any,
      { label: "PPh 21 Final Dipotong", value: pph, highlight: true },
      { label: "Neto Diterima", value: brutoNum - pph },
    ]);
  }, [bruto, golongan, kop]);

  return (
    <div className="kalk-form">
      <SelectField label="Kode Objek Pajak (KOP)"
        options={Object.entries(FINAL_KOP).map(([k, v]) => ({ value: k, label: `${k} — ${v.label}` }))}
        value={kopKey} onChange={setKopKey} />
      <InputField label="Penghasilan Bruto" value={bruto} onChange={setBruto} />
      {kop.needsGolongan && (
        <SelectField label="Golongan PNS"
          options={GOLONGAN_PNS.map(g => ({ value: g, label: g }))}
          value={golongan} onChange={setGolongan}
          note="Gol I & II = 0%, Gol III = 5%, Gol IV = 15%" />
      )}
      <button className="kalk-btn" onClick={calculate}>Hitung PPh 21 Final</button>
      {results && (
        <div className="kalk-results">
          <div className="kalk-results-title">Hasil Perhitungan PPh 21 Final</div>
          {results.map((r, i) => r.separator ? <div key={i} className="kalk-result-separator" /> : <ResultRow key={i} item={r} />)}
          <div className="kalk-disclaimer">PPh Final bersifat TUNTAS — tidak diperhitungkan dalam SPT Tahunan</div>
        </div>
      )}
    </div>
  );
}

// ============================================================
//   PPh 21 Tidak Final
// ============================================================
function TidakFinalForm() {
  const [kopKey, setKopKey] = useState(Object.keys(TIDAK_FINAL_KOP)[0]);
  const [bruto, setBruto] = useState("");
  const [ptkp, setPtkp] = useState("TK/0");
  const [results, setResults] = useState<CalcResult[] | null>(null);

  const kop = TIDAK_FINAL_KOP[kopKey];

  const calculate = useCallback(() => {
    const brutoNum = parseFloat(bruto.replace(/[^0-9]/g, "")) || 0;
    const dpp = Math.round(brutoNum * kop.dppFactor);
    const ptkpVal = kop.hasPTKP ? PTKP[ptkp] : 0;
    const pkp = Math.max(0, Math.floor((dpp - ptkpVal) / 1000) * 1000);
    const pph = calcPasal17(pkp);

    setResults([
      { label: "Penghasilan Bruto", value: brutoNum },
      { label: `DPP (${kop.dppFactor * 100}% dari Bruto)`, value: dpp },
      ...(kop.hasPTKP ? [{ label: `PTKP (${ptkp})`, value: -ptkpVal } as CalcResult] : []),
      { separator: true } as any,
      { label: "PKP (Penghasilan Kena Pajak)", value: pkp },
      { separator: true } as any,
      { label: "PPh 21 Terutang (Pasal 17)", value: pph, highlight: true },
      { label: "Neto Diterima", value: brutoNum - pph },
    ]);
  }, [bruto, ptkp, kop]);

  return (
    <div className="kalk-form">
      <SelectField label="Kode Objek Pajak / Jenis Penerima"
        options={Object.entries(TIDAK_FINAL_KOP).map(([k, v]) => ({ value: k, label: v.label }))}
        value={kopKey} onChange={setKopKey} />
      <div className="kalk-info-card">
        <span>📌 DPP untuk jenis ini:</span>
        <strong>{kop.dppFactor * 100}% dari Bruto</strong>
      </div>
      <InputField label="Penghasilan Bruto" value={bruto} onChange={setBruto} />
      {kop.hasPTKP && (
        <SelectField label="Status PTKP" options={PTKP_OPTIONS.map(o => ({ value: o, label: o }))} value={ptkp} onChange={setPtkp} />
      )}
      <button className="kalk-btn" onClick={calculate}>Hitung PPh 21</button>
      {results && (
        <div className="kalk-results">
          <div className="kalk-results-title">Hasil Perhitungan PPh 21 Tidak Final</div>
          {results.map((r, i) => r.separator ? <div key={i} className="kalk-result-separator" /> : <ResultRow key={i} item={r} />)}
          <div className="kalk-disclaimer">Tarif Progresif Pasal 17 UU PPh — dapat dikreditkan di SPT Tahunan</div>
        </div>
      )}
    </div>
  );
}

// ============================================================
//   Main Page Component
// ============================================================
const TABS: { key: PemotonganType; label: string; icon: string; desc: string }[] = [
  { key: "bulanan", label: "PPh 21 Bulanan", icon: "📅", desc: "Pegawai Tetap (TER)" },
  { key: "tahunan", label: "PPh 21 Tahunan", icon: "📊", desc: "Rekap A1 / A2" },
  { key: "final", label: "PPh 21 Final", icon: "✅", desc: "PNS, Pesangon" },
  { key: "tidak_final", label: "PPh 21 Tdk Final", icon: "🔄", desc: "Tenaga Ahli, Komisaris" },
];

export default function KalkulatorPage() {
  const [activeTab, setActiveTab] = useState<PemotonganType>("bulanan");

  return (
    <div className="kalk-shell">
    <div className="kalk-page">
      {/* Back Button */}
      <a href="/" className="kalk-back-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Kembali ke Chat
      </a>

      {/* Header */}
      <div className="kalk-header">
        <h1 className="kalk-title">
          <span className="kalk-title-icon">🧮</span>
          Kalkulator PPh 21
        </h1>
        <p className="kalk-subtitle">
          Hitung pajak penghasilan karyawan sesuai PP No. 58/2023 & PMK 168/2023 secara akurat
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="kalk-tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`kalk-tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className="kalk-tab-icon">{tab.icon}</span>
            <span className="kalk-tab-text">
              <span className="kalk-tab-label">{tab.label}</span>
              <span className="kalk-tab-desc">{tab.desc}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Form Panel */}
      <div className="kalk-panel">
        {activeTab === "bulanan" && <BulananForm />}
        {activeTab === "tahunan" && <TahunanForm />}
        {activeTab === "final" && <FinalForm />}
        {activeTab === "tidak_final" && <TidakFinalForm />}
      </div>

      {/* Footer */}
      <p className="kalk-footer-note">
        ⚠️ Kalkulator ini bersifat <strong>estimasi</strong>. Untuk perhitungan resmi, konsultasikan dengan konsultan pajak berlisensi atau DJP.
      </p>

      <style>{`
        .kalk-shell {
          height: 100vh;
          overflow-y: auto;
          background: var(--bg-base);
        }

        .kalk-page {
          padding: 28px 24px 80px;
          max-width: 860px;
          margin: 0 auto;
        }

        .kalk-back-btn {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 600; color: var(--text-muted);
          text-decoration: none; margin-bottom: 24px;
          padding: 8px 14px; border-radius: 8px;
          border: 1px solid var(--border); background: var(--bg-surface);
          transition: all 0.2s;
        }
        .kalk-back-btn:hover { color: var(--primary); border-color: var(--primary); }


        /* Header */
        .kalk-header { text-align: center; margin-bottom: 36px; }
        .kalk-title {
          display: flex; align-items: center; justify-content: center; gap: 12px;
          font-size: 32px; font-weight: 800; color: var(--text-primary);
          margin-bottom: 10px;
        }
        .kalk-title-icon { font-size: 36px; }
        .kalk-subtitle { color: var(--text-muted); font-size: 15px; max-width: 520px; margin: 0 auto; }

        /* Tabs */
        .kalk-tabs {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 10px; margin-bottom: 28px;
        }
        @media (max-width: 640px) {
          .kalk-tabs { grid-template-columns: repeat(2, 1fr); }
        }
        .kalk-tab {
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          padding: 14px 10px; border-radius: 14px;
          border: 1.5px solid var(--border); background: var(--bg-surface);
          cursor: pointer; transition: all 0.2s; text-align: center;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .kalk-tab:hover { border-color: var(--primary); background: var(--primary-subtle); }
        .kalk-tab.active {
          border-color: var(--primary); background: var(--primary-subtle);
          box-shadow: 0 0 0 3px rgba(30,144,255,0.1);
        }
        .kalk-tab-icon { font-size: 22px; }
        .kalk-tab-text { display: flex; flex-direction: column; gap: 1px; }
        .kalk-tab-label { font-size: 12px; font-weight: 700; color: var(--text-primary); }
        .kalk-tab-desc { font-size: 10.5px; color: var(--text-muted); }

        /* Panel */
        .kalk-panel {
          background: var(--bg-surface); border: 1.5px solid var(--border);
          border-radius: 20px; padding: 32px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
        }

        /* Form elements */
        .kalk-form { display: flex; flex-direction: column; gap: 20px; }
        .kalk-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 560px) { .kalk-row-2 { grid-template-columns: 1fr; } }
        .kalk-field { display: flex; flex-direction: column; gap: 6px; }
        .kalk-label { font-size: 13.5px; font-weight: 600; color: var(--text-secondary); }
        .kalk-note { font-size: 11.5px; color: var(--text-muted); margin-top: -2px; }
        .kalk-input-wrap {
          display: flex; align-items: center; gap: 0;
          border: 1.5px solid var(--border); border-radius: 10px;
          overflow: hidden; background: var(--bg-input);
          transition: border-color 0.2s;
        }
        .kalk-input-wrap:focus-within { border-color: var(--primary); }
        .kalk-prefix {
          padding: 0 14px; background: var(--bg-surface-2); border-right: 1.5px solid var(--border);
          font-size: 13px; font-weight: 600; color: var(--text-muted);
          height: 44px; display: flex; align-items: center; flex-shrink: 0;
        }
        .kalk-input {
          flex: 1; padding: 0 14px; height: 44px; font-size: 15px; font-weight: 500;
          border: none; outline: none; background: transparent;
          color: var(--text-primary); font-family: 'Inter', monospace;
          text-align: right;
        }
        .kalk-input:disabled { background: var(--bg-surface-2); color: var(--text-faint); }
        .kalk-select {
          width: 100%; padding: 0 14px; height: 44px; font-size: 13.5px; font-weight: 500;
          border: 1.5px solid var(--border); border-radius: 10px; outline: none;
          background: var(--bg-input); color: var(--text-primary); cursor: pointer;
          transition: border-color 0.2s;
        }
        .kalk-select:focus { border-color: var(--primary); }

        /* Info Card */
        .kalk-info-card {
          display: flex; align-items: center; justify-content: space-between;
          background: var(--primary-subtle); border: 1px solid var(--border-blue);
          border-radius: 10px; padding: 12px 16px; font-size: 13.5px;
          color: var(--text-secondary);
        }
        .kalk-info-card strong { color: var(--primary); font-size: 15px; }

        /* Button */
        .kalk-btn {
          width: 100%; padding: 14px; border-radius: 12px;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white; font-size: 15px; font-weight: 700; border: none; cursor: pointer;
          transition: all 0.2s; box-shadow: 0 4px 12px rgba(30,144,255,0.3);
          margin-top: 4px;
        }
        .kalk-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(30,144,255,0.4); }
        .kalk-btn:active { transform: translateY(0); }

        /* Results */
        .kalk-results {
          border: 1.5px solid var(--border-blue); border-radius: 16px;
          overflow: hidden; background: var(--primary-subtle);
          animation: fadeUp 0.3s ease;
        }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .kalk-results-title {
          padding: 14px 20px; font-size: 13px; font-weight: 700;
          color: var(--primary); text-transform: uppercase; letter-spacing: 0.06em;
          background: rgba(30,144,255,0.08); border-bottom: 1px solid var(--border-blue);
        }
        .kalk-result-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 11px 20px; font-size: 14px; color: var(--text-secondary);
          border-bottom: 1px solid var(--border-subtle);
        }
        .kalk-result-row:last-child { border-bottom: none; }
        .kalk-result-row.highlight {
          background: rgba(30,144,255,0.08);
        }
        .kalk-result-row.highlight .kalk-result-label { font-weight: 700; color: var(--text-primary); }
        .kalk-result-row.highlight .kalk-result-value {
          font-weight: 800; font-size: 18px; color: var(--primary);
        }
        .kalk-result-row.info { background: rgba(0,0,0,0.02); }
        .kalk-result-label { font-weight: 500; }
        .kalk-result-value { font-weight: 600; font-family: 'Inter', monospace; font-size: 14px; }
        .rate-badge {
          background: var(--primary); color: white; font-size: 12px;
          padding: 3px 10px; border-radius: 99px; font-weight: 700;
        }
        .kalk-result-separator { height: 1px; background: var(--border-blue); margin: 4px 0; }
        .kalk-disclaimer {
          padding: 10px 20px; font-size: 11.5px; color: var(--text-faint);
          border-top: 1px solid var(--border-subtle); font-style: italic;
        }

        /* Footer */
        .kalk-footer-note {
          text-align: center; margin-top: 24px; font-size: 12.5px;
          color: var(--text-muted); line-height: 1.6;
        }
      `}</style>
    </div>
    </div>
  );
}
