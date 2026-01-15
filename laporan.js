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
   - otomatis pilih musim TERBARU
============================= */
function initMusim() {
  const lahanKey = document.getElementById("lahan").value;
  const lahan = LAHAN_MAP[lahanKey];
  const select = document.getElementById("musim");

  select.innerHTML = "";

  if (!lahan || !lahan.musim) return;

  Object.keys(lahan.musim)
    .sort((a, b) => b - a) // musim terbaru di atas
    .forEach(key => {
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = lahan.musim[key].label || `Musim Tanam Ke-${key}`;
      select.appendChild(opt);
    });

  // 🔴 PENTING: auto pilih musim teratas agar tidak error
  if (select.options.length > 0) {
    select.selectedIndex = 0;
  }
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
    const totalModal = Object.values(modal).reduce(
      (a, b) => a + Number(b || 0),
      0
    );

    if (totalModal === 0) {
      output += `- Tidak ada data modal\n\n`;
    } else {
      Object.entries(modal).forEach(([sumber, nilai]) => {
        output += `- ${sumber.toUpperCase()}: ${Number(nilai).toLocaleString("id-ID")}\n`;
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
        const nilai = Number(b.nilai || 0);
        totalBiaya += nilai;

        output += `📆 ${b.tanggal}\n`;
        output += `${b.nama}\n`;
        output += `Rp ${nilai.toLocaleString("id-ID")}\n\n`;
      });

      output += `Total Biaya: ${totalBiaya.toLocaleString("id-ID")}\n\n`;
    }
  }

  /* =============================
     HASIL PANEN
  ============================= */
  if (jenis === "panen" || jenis === "full") {
    output += `*HASIL PANEN*\n\n`;

    const panen = musim.panen || [];

    if (panen.length === 0) {
      output += `- Tidak ada data panen\n\n`;
    } else {
      panen.forEach(p => {
        const omzet = Number(p.nilai || 0);
        const biayaPanen = Number(p.biayaPanen || 0);
        const surplus = omzet - biayaPanen;

        output += `📆 ${p.tanggal}\n`;
        output += `${p.nama}\n`;
        output += `⚖️ ${p.qty} ${p.satuan || "kg"}\n`;
        output += `💰 Omzet: ${omzet.toLocaleString("id-ID")}\n`;
        output += `🚜 Biaya Panen: ${biayaPanen.toLocaleString("id-ID")}\n`;
        output += `📊 *Surplus Panen: ${surplus.toLocaleString("id-ID")}*\n\n`;

        if (
          p.bonusPanen &&
          p.bonusPanen.total > 0 &&
          Array.isArray(p.bonusPanen.anggota)
        ) {
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
   COPY LAPORAN
============================= */
function salinLaporan() {
  const teks = document.getElementById("output").textContent;
  if (!teks || teks.includes("Pilih")) return;

  navigator.clipboard.writeText(teks).then(() => {
    alert("Laporan berhasil disalin");
  });
}