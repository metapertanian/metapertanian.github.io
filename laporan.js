// laporan.js
// Generator laporan BERTUNAS (per lahan & per musim tanam)
// Output WA-friendly (text only)

/* =============================
   PETA LAHAN
============================= */
const LAHAN_MAP = {
  rismafarm: typeof RISMA_FARM !== "undefined" ? RISMA_FARM : null,
  umi: typeof UMI !== "undefined" ? UMI : null,
  umi2: typeof UMI2 !== "undefined" ? UMI2 : null
};

/* =============================
   INIT MUSIM SELECT
============================= */
function initMusim() {
  const lahanKey = document.getElementById("lahan").value;
  const lahan = LAHAN_MAP[lahanKey];
  const select = document.getElementById("musim");

  select.innerHTML = "";

  if (!lahan || !lahan.musim) return;

  // urutkan musim DESC (terbaru di atas)
  Object.keys(lahan.musim)
    .sort((a, b) => b - a)
    .forEach(key => {
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = lahan.musim[key].label || `Musim Tanam Ke-${key}`;
      select.appendChild(opt);
    });
}

document.getElementById("lahan").addEventListener("change", initMusim);
document.addEventListener("DOMContentLoaded", initMusim);

/* =============================
   GENERATE LAPORAN
============================= */
function generateLaporan() {
  const jenis = document.getElementById("jenis").value;
  const lahanKey = document.getElementById("lahan").value;
  const musimKey = document.getElementById("musim").value;

  const lahan = LAHAN_MAP[lahanKey];
  if (!lahan || !lahan.musim || !lahan.musim[musimKey]) {
    alert("Data musim tidak ditemukan");
    return;
  }

  const musim = lahan.musim[musimKey];
  let output = "";

  /* =============================
     HEADER
  ============================= */
  output += `*${lahan.nama || lahanKey.toUpperCase()}*\n`;
  output += `${musim.label || `Musim Tanam Ke-${musimKey}`}\n`;
  output += `——————————————\n\n`;

  /* =============================
     MODAL
  ============================= */
  if (jenis === "modal" || jenis === "full") {
    output += `*MODAL USAHA*\n`;

    const modal = musim.modal || {};
    const totalModal = Object.values(modal).reduce((a, b) => a + b, 0);

    if (totalModal === 0) {
      output += `- Tidak ada data modal\n\n`;
    } else {
      Object.entries(modal).forEach(([sumber, nilai]) => {
        output += `- ${sumber.toUpperCase()}: ${nilai.toLocaleString("id-ID")}\n`;
      });
      output += `Total Modal: ${totalModal.toLocaleString("id-ID")}\n\n`;
    }
  }

  /* =============================
     BIAYA
  ============================= */
  if (jenis === "biaya" || jenis === "full") {
    output += `*BIAYA PRODUKSI*\n`;

    const biaya = musim.biaya || [];
    let totalBiaya = 0;

    if (biaya.length === 0) {
      output += `- Tidak ada data biaya\n\n`;
    } else {
      biaya.forEach(b => {
        totalBiaya += b.nilai;
        output += `📆 ${b.tanggal}\n${b.nama}\nRp ${b.nilai.toLocaleString("id-ID")}\n\n`;
      });
      output += `Total Biaya: ${totalBiaya.toLocaleString("id-ID")}\n\n`;
    }
  }

  /* =============================
     PANEN (PHP)
  ============================= */
  if (jenis === "panen" || jenis === "full") {
    output += `*PHP* (Pencatatan Hasil Panen)\n\n`;

    const panen = musim.panen || [];
    if (panen.length === 0) {
      output += `- Tidak ada data panen\n\n`;
    } else {
      panen.forEach(p => {
        const biayaPanen = p.biayaPanen || 0;
        const surplus = p.nilai - biayaPanen;

        output += `—————\n\n`;
        output += `📆 ${p.tanggal}\n`;
        output += `${p.nama}\n`;
        output += `⚖️ ${p.qty} ${p.satuan || "kg"}\n`;
        output += `💰 Omzet: ${p.nilai.toLocaleString("id-ID")}\n`;
        output += `🚜 Biaya Panen: ${biayaPanen.toLocaleString("id-ID")}\n`;
        output += `📊 *Surplus Panen: ${surplus.toLocaleString("id-ID")}*\n\n`;

        if (p.bonusPanen && p.bonusPanen.total > 0) {
          const perOrang =
            p.bonusPanen.total / p.bonusPanen.anggota.length;

          output += `*Bonus Panen*: ${p.bonusPanen.total.toLocaleString("id-ID")}\n`;
          p.bonusPanen.anggota.forEach((a, i) => {
            output += `${i + 1}. ${a}: ${perOrang.toLocaleString("id-ID")}\n`;
          });
          output += `\n`;
        }
      });

      output += `*Catatan:*\nSurplus panen belum dikurangi biaya produksi lain.\n\n`;
    }
  }

  document.getElementById("output").textContent = output;
}

/* =============================
   COPY
============================= */
function salinLaporan() {
  const teks = document.getElementById("output").textContent;
  if (!teks || teks.includes("pilih")) return;

  navigator.clipboard.writeText(teks).then(() => {
    alert("Laporan berhasil disalin");
  });
}