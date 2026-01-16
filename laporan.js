// laporan.js
// Generator laporan BERTUNAS (WA Friendly)

/* =============================
   PETA LAHAN
============================= */
const LAHAN_MAP = {
  rismafarm: typeof RISMA_FARM !== "undefined" ? RISMA_FARM : null,
  umi: typeof UMI !== "undefined" ? UMI : null,
  umi2: typeof UMI2 !== "undefined" ? UMI2 : null
};

/* =============================
   INIT MUSIM
============================= */
function initMusim() {
  const lahan = LAHAN_MAP[document.getElementById("lahan").value];
  const musimSelect = document.getElementById("musim");
  musimSelect.innerHTML = "";

  if (!lahan || !lahan.musim) {
    musimSelect.innerHTML = `<option>Tidak ada musim</option>`;
    return;
  }

  Object.keys(lahan.musim)
    .sort((a, b) => b - a)
    .forEach(k => {
      const opt = document.createElement("option");
      opt.value = k;
      opt.textContent = lahan.musim[k].label || `Musim Tanam Ke-${k}`;
      musimSelect.appendChild(opt);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(initMusim, 100);
});

document.getElementById("lahan")?.addEventListener("change", initMusim);

/* =============================
   GENERATE LAPORAN
============================= */
function generateLaporan() {
  const lahanKey = document.getElementById("lahan").value;
  const musimKey = document.getElementById("musim").value;

  const lahan = LAHAN_MAP[lahanKey];
  if (!lahan || !musimKey) {
    alert("Data belum lengkap");
    return;
  }

  const musim = lahan.musim[musimKey];
  let out = "";

  /* RANGE TANGGAL BIAYA */
  const biaya = musim.biaya || [];
  const tanggalList = biaya.map(b => b.tanggal).sort();
  const tAwal = tanggalList[0] || "-";
  const tAkhir = tanggalList[tanggalList.length - 1] || "-";

  /* HEADER */
  out += `*${lahan.nama || "RISMA FARM"}* ^Bertani, Berbisnis, Berbagi^\n`;
  out += `${musim.label || `Musim Tanam Ke-${musimKey}`}\n`;
  out += `${tAwal} - ${tAkhir}\n`;
  out += `——————————————\n\n`;

  /* MODAL */
  out += `*MODAL USAHA*\n`;
  const modal = musim.modal || {};
  const totalModal = Object.values(modal).reduce((a, b) => a + Number(b || 0), 0);

  Object.entries(modal).forEach(([k, v]) => {
    out += `- ${k.toUpperCase()}: ${Number(v).toLocaleString("id-ID")}\n`;
  });
  out += `Total Modal: *${totalModal.toLocaleString("id-ID")}*\n\n`;

  /* BIAYA */
  out += `*BIAYA SKINCARE* Untuk Perawatan ${musim.komoditas || "Tanaman"}\n`;

  let totalBiaya = 0;
  if (biaya.length === 0) {
    out += `- Tidak ada data biaya\n\n`;
  } else {
    biaya.forEach(b => {
      totalBiaya += Number(b.jumlah || 0);
      out += `${b.keterangan} : ${Number(b.jumlah).toLocaleString("id-ID")}\n`;
    });
    out += `\nTotal Biaya: *${totalBiaya.toLocaleString("id-ID")}*\n\n`;
  }

  /* PANEN */
  out += `*HASIL PANEN*\n\n`;
  const panen = musim.panen || [];

  if (panen.length === 0) {
    out += `- Tidak ada data panen\n\n`;
  }

  /* NOTE */
  out += `> Note:\n`;
  out += `Pembagian hasil dilakukan setelah dikurangi modal & biaya produksi sesuai kesepakatan.\n`;
  out += `📌 pulungriswanto.my.id/${lahanKey}`;

  document.getElementById("output").textContent = out;
}

/* =============================
   COPY
============================= */
function salinLaporan() {
  navigator.clipboard.writeText(
    document.getElementById("output").textContent
  ).then(() => alert("Laporan disalin"));
}