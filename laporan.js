// laporan.js
// Generator laporan BERTUNAS (per lahan & per musim tanam)
// WA-friendly, mobile-safe

/* =============================
   PETA LAHAN (HARUS SAMA DENGAN FILE LAHAN)
============================= */
const LAHAN_MAP = {
  rismafarm: typeof RISMA_FARM !== "undefined" ? RISMA_FARM : null,
  umi: typeof UMI !== "undefined" ? UMI : null,
  umi2: typeof UMI2 !== "undefined" ? UMI2 : null
};

/* =============================
   INIT MUSIM (ANTI KOSONG)
============================= */
function initMusim() {
  const lahanSelect = document.getElementById("lahan");
  const musimSelect = document.getElementById("musim");
  if (!lahanSelect || !musimSelect) return;

  const lahanKey = lahanSelect.value;
  const lahan = LAHAN_MAP[lahanKey];

  musimSelect.innerHTML = "";

  if (!lahan || !lahan.musim) {
    musimSelect.innerHTML = `<option value="">Tidak ada musim</option>`;
    return;
  }

  const musimKeys = Object.keys(lahan.musim)
    .map(k => Number(k))
    .sort((a, b) => b - a); // TERBARU DI ATAS

  musimKeys.forEach(k => {
    const musim = lahan.musim[k];
    const opt = document.createElement("option");
    opt.value = k;
    opt.textContent = musim.label || `Musim Tanam Ke-${k}`;
    musimSelect.appendChild(opt);
  });

  // 🔴 PENTING: AUTO PILIH MUSIM TERBARU
  musimSelect.selectedIndex = 0;
}

/* =============================
   EVENT (AMAN DI MOBILE)
============================= */
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(initMusim, 100); // delay kecil utk HP
});

document.getElementById("lahan")?.addEventListener("change", () => {
  setTimeout(initMusim, 50);
});

/* =============================
   GENERATE LAPORAN
============================= */
function generateLaporan() {
  const jenis = document.getElementById("jenis").value;
  const lahanKey = document.getElementById("lahan").value;
  const musimKey = document.getElementById("musim").value;

  const lahan = LAHAN_MAP[lahanKey];
  if (!lahan || !lahan.musim || !musimKey) {
    alert("Musim tanam belum tersedia");
    return;
  }

  const musim = lahan.musim[musimKey];
  let out = "";

  /* HEADER */
  out += `*${lahan.nama || lahanKey.toUpperCase()}*\n`;
  out += `${musim.label || `Musim Tanam Ke-${musimKey}`}\n`;
  out += `——————————————\n\n`;

  /* MODAL */
  if (jenis === "modal" || jenis === "full") {
    out += `*MODAL USAHA*\n`;
    const modal = musim.modal || {};
    const total = Object.values(modal).reduce((a, b) => a + Number(b || 0), 0);

    if (total === 0) {
      out += `- Tidak ada data modal\n\n`;
    } else {
      Object.entries(modal).forEach(([k, v]) => {
        out += `- ${k.toUpperCase()}: ${Number(v).toLocaleString("id-ID")}\n`;
      });
      out += `Total Modal: ${total.toLocaleString("id-ID")}\n\n`;
    }
  }

  /* BIAYA */
  if (jenis === "biaya" || jenis === "full") {
    out += `*BIAYA PRODUKSI*\n`;
    const biaya = musim.biaya || [];
    let total = 0;

    if (biaya.length === 0) {
      out += `- Tidak ada data biaya\n\n`;
    } else {
      biaya.forEach(b => {
        total += Number(b.nilai || 0);
        out += `📆 ${b.tanggal}\n${b.nama}\nRp ${Number(b.nilai).toLocaleString("id-ID")}\n\n`;
      });
      out += `Total Biaya: ${total.toLocaleString("id-ID")}\n\n`;
    }
  }

  /* PANEN */
  if (jenis === "panen" || jenis === "full") {
    out += `*HASIL PANEN*\n\n`;
    const panen = musim.panen || [];

    if (panen.length === 0) {
      out += `- Tidak ada data panen\n\n`;
    } else {
      panen.forEach(p => {
        const omzet = Number(p.nilai || 0);
        const biayaPanen = Number(p.biayaPanen || 0);
        out += `📆 ${p.tanggal}\n${p.nama}\n`;
        out += `⚖️ ${p.qty} ${p.satuan || "kg"}\n`;
        out += `💰 Omzet: ${omzet.toLocaleString("id-ID")}\n`;
        out += `🚜 Biaya Panen: ${biayaPanen.toLocaleString("id-ID")}\n`;
        out += `📊 *Surplus: ${(omzet - biayaPanen).toLocaleString("id-ID")}*\n\n`;
      });
    }
  }

  document.getElementById("output").textContent = out;
}

/* =============================
   COPY
============================= */
function salinLaporan() {
  const t = document.getElementById("output").textContent;
  if (!t || t.includes("Pilih")) return;
  navigator.clipboard.writeText(t).then(() => alert("Laporan disalin"));
}