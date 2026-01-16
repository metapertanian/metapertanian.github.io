// laporan.js — FINAL SESUAI STRUKTUR lahan.js BERTUNAS
// Mobile & WA Friendly

/* =============================
   PETA LAHAN
============================= */
const LAHAN_MAP = {
  rismafarm: typeof RISMA_FARM !== "undefined" ? RISMA_FARM : null
};

/* =============================
   INIT MUSIM
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

  Object.keys(lahan.musim)
    .sort((a, b) => b - a)
    .forEach(key => {
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent =
        lahan.musim[key].label || `Musim Tanam Ke-${key}`;
      musimSelect.appendChild(opt);
    });
}

/* =============================
   EVENT
============================= */
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(initMusim, 100);
});

document.getElementById("lahan")?.addEventListener("change", initMusim);

/* =============================
   GENERATE LAPORAN
============================= */
function generateLaporan() {
  const jenis = document.getElementById("jenis").value;
  const lahanKey = document.getElementById("lahan").value;
  const musimKey = document.getElementById("musim").value;

  const lahan = LAHAN_MAP[lahanKey];
  if (!lahan || !musimKey) {
    alert("Musim tanam belum dipilih");
    return;
  }

  const musim = lahan.musim[musimKey];
  let out = "";

  /* =============================
     RANGE TANGGAL DARI BIAYA
  ============================= */
  const biaya = musim.biaya || [];
  const tanggalList = biaya.map(b => b.tanggal).sort();
  const tanggalAwal = tanggalList[0] || "-";
  const tanggalAkhir = tanggalList[tanggalList.length - 1] || "-";

  /* =============================
     HEADER
  ============================= */
  out += `*${lahan.nama}* \`Bertani, Berbisnis, Berbagi\`\n\n`;
  out += `${musim.label}\n`;
  out += `${tanggalAwal} - ${tanggalAkhir}\n`;
  out += `——————————————\n\n`;

  /* =============================
     MODAL
  ============================= */
  if (
    ["modal", "modal-biaya", "modal-biaya-panen", "lengkap"].includes(jenis)
  ) {
    const modal = musim.modal || {};
    let totalModal = 0;

    out += `*MODAL USAHA*\n\n`;

    Object.entries(modal).forEach(([nama, nilai]) => {
      const n = Number(nilai);
      totalModal += n;
      out += `- ${nama}: ${n.toLocaleString("id-ID")}\n`;
    });

    out += `\nTotal Modal: *${totalModal.toLocaleString("id-ID")}*\n\n`;
  }

  /* =============================
     BIAYA & SKINCARE
  ============================= */
  if (
    ["biaya", "modal-biaya", "modal-biaya-panen", "lengkap"].includes(jenis)
  ) {
    let totalBiaya = 0;
    const komoditas = (musim.komoditas || []).join(", ");

    out += `*BIAYA & SKINCARE* Untuk Perawatan ${komoditas}\n\n`;

    if (biaya.length === 0) {
      out += `(belum ada data biaya)\n\n`;
    } else {
      biaya.forEach(b => {
        totalBiaya += Number(b.jumlah);
        out += `- ${b.keterangan} : ${Number(
          b.jumlah
        ).toLocaleString("id-ID")}\n`;
      });

      out += `\nTotal Biaya: *${totalBiaya.toLocaleString("id-ID")}*\n\n`;
    }
  }

  /* =============================
     HASIL PANEN
  ============================= */
  if (
    ["panen", "modal-biaya-panen", "lengkap"].includes(jenis)
  ) {
    const panen = musim.panen || [];
    let totalSurplus = 0;

    out += `*HASIL PANEN* (Surplus)\n\n`;

    if (panen.length === 0) {
      out += `(belum ada data panen)\n\n`;
    } else {
      panen.forEach(p => {
        totalSurplus += Number(p.surplus || 0);
        out += `- ${p.nama} : ${Number(
          p.surplus
        ).toLocaleString("id-ID")}\n`;
      });

      out += `\nTotal Surplus : *${totalSurplus.toLocaleString(
        "id-ID"
      )}*\n\n`;
    }

    /* =============================
       BAGI HASIL
    ============================= */
    if (jenis === "lengkap" && musim.skema) {
      out += `*BAGI HASIL*\n`;
      out += `(Skema: ${musim.skema.tipe.replace("_", " ")})\n\n`;

      Object.entries(musim.skema.pembagian).forEach(([nama, persen]) => {
        out += `- ${nama} : ${persen}%\n`;
      });

      out += `\n`;
    }
  }

  /* =============================
     NOTE
  ============================= */
  out += `> Note:\n`;
  out += `Pembagian hasil dilakukan setelah keuntungan dikurangi biaya.\n`;
  out += `📌 pulungriswanto.my.id/${lahanKey}`;

  document.getElementById("output").textContent = out;
}

/* =============================
   COPY
============================= */
function salinLaporan() {
  const teks = document.getElementById("output").textContent;
  if (!teks) return;
  navigator.clipboard.writeText(teks).then(() => {
    alert("Laporan berhasil disalin");
  });
}