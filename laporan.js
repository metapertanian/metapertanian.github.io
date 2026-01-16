// laporan.js FINAL — BERTUNAS (FIXED)
// Auto laba bersih, PHP mode, skema bagi hasil
// COMPATIBLE dengan struktur lahan.js

/* =============================
   DOM ELEMENT (WAJIB ADA)
============================= */
const jenisSelect = document.getElementById("jenis");
const lahanSelect = document.getElementById("lahan");
const musimSelect = document.getElementById("musim");
const output = document.getElementById("output");

/* =============================
   MAP LAHAN
============================= */
const LAHAN_MAP = {
  rismafarm: typeof RISMA_FARM !== "undefined" ? RISMA_FARM : null
};

/* =============================
   UTIL
============================= */
function rupiah(n) {
  return Number(n || 0).toLocaleString("id-ID");
}

function formatTanggal(tgl) {
  if (!tgl) return "-";
  const b = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
  const d = new Date(tgl);
  return `${d.getDate()} ${b[d.getMonth()]} ${d.getFullYear()}`;
}

/* =============================
   INIT MUSIM (FIXED)
============================= */
function initMusim() {
  const lahanKey = lahanSelect.value;
  const lahan = LAHAN_MAP[lahanKey];

  musimSelect.innerHTML = "";

  if (!lahan || !lahan.musim) {
    musimSelect.innerHTML = `<option value="">Tidak ada musim</option>`;
    return;
  }

  Object.keys(lahan.musim)
    .sort((a, b) => Number(b) - Number(a))
    .forEach(k => {
      const opt = document.createElement("option");
      opt.value = k;
      opt.textContent = lahan.musim[k].label || `Musim Tanam Ke-${k}`;
      musimSelect.appendChild(opt);
    });

  musimSelect.selectedIndex = 0;
}

/* =============================
   EVENT LISTENER (AMAN HP)
============================= */
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(initMusim, 100);
});

lahanSelect.addEventListener("change", () => {
  setTimeout(initMusim, 50);
});

/* =============================
   GENERATE LAPORAN
============================= */
function generateLaporan() {
  const jenis = jenisSelect.value;
  const lahanKey = lahanSelect.value;
  const musimKey = musimSelect.value;

  const lahan = LAHAN_MAP[lahanKey];
  const data = lahan?.musim?.[musimKey];

  if (!data) {
    alert("Data musim tidak ditemukan");
    return;
  }

  let out = "";

  /* =============================
     HEADER + TANGGAL
  ============================= */
  const tglBiaya = (data.biaya || []).map(b => b.tanggal).sort();
  const tAwal = formatTanggal(tglBiaya[0]);
  const tAkhir = formatTanggal(tglBiaya[tglBiaya.length - 1]);

  out += `*${lahan.nama}* \`Bertani, Berbisnis, Berbagi\`\n\n`;
  out += `${data.label}\n${tAwal} - ${tAkhir}\n`;
  out += `——————————————\n\n`;

  /* =============================
     MODAL
  ============================= */
  let totalModal = 0;
  if (["modal","modal-biaya","modal-biaya-panen","lengkap"].includes(jenis)) {
    out += `*MODAL USAHA*\n\n`;
    Object.entries(data.modal || {}).forEach(([k,v]) => {
      totalModal += Number(v);
      out += `- ${k} : ${rupiah(v)}\n`;
    });
    out += `\nTotal Modal: *${rupiah(totalModal)}*\n\n`;
  }

  /* =============================
     BIAYA
  ============================= */
  let totalBiaya = 0;
  if (["biaya","modal-biaya","modal-biaya-panen","lengkap"].includes(jenis)) {
    out += `*BIAYA & SKINCARE* Untuk Perawatan ${data.komoditas.join(", ")}\n\n`;
    (data.biaya || []).forEach(b => {
      totalBiaya += Number(b.jumlah);
      out += `- ${b.keterangan} : ${rupiah(b.jumlah)}\n`;
    });
    out += `\nTotal Biaya: *${rupiah(totalBiaya)}*\n\n`;
  }

  /* =============================
     PHP SAJA (DETAIL)
  ============================= */
  if (jenis === "panen") {
    if (!data.panen.length) {
      out += `*HASIL PANEN*\n\n(belum ada data panen)\n`;
    } else {
      data.panen.forEach(p => {
        const surplus = p.nilai - p.biayaPanen;
        out += `*HASIL PANEN : ${p.komoditas}*\n`;
        out += `${formatTanggal(p.tanggal)}\n`;
        out += `Berat : ${p.qty} ${p.satuan || "kg"}\n`;
        out += `Omzet : ${rupiah(p.nilai)}\n`;
        out += `Biaya Panen : ${rupiah(p.biayaPanen)}\n\n`;
        out += `Surplus : *${rupiah(surplus)}*\n\n`;

        if (p.bonusPanen?.total) {
          const per = p.bonusPanen.total / p.bonusPanen.anggota.length;
          out += `*BONUS PANEN* : ${rupiah(p.bonusPanen.total)}\n`;
          p.bonusPanen.anggota.forEach((a,i)=>{
            out += `${i+1}. ${a} : ${rupiah(per)}\n`;
          });
        }

        out += `\n👉 pulungriswanto.my.id/bank-risma\n\n`;
      });
    }

    output.textContent = out;
    return;
  }

  /* =============================
     PANEN RINGKAS
  ============================= */
  let totalSurplus = 0;
  if (["modal-biaya-panen","lengkap"].includes(jenis)) {
    out += `*HASIL PANEN*\n\n`;
    if (!data.panen.length) {
      out += `(belum ada data panen)\n\n`;
    } else {
      const map = {};
      data.panen.forEach(p => {
        const s = p.nilai - p.biayaPanen;
        totalSurplus += s;
        map[p.komoditas] ??= [];
        map[p.komoditas].push({tgl:p.tanggal, s});
      });

      Object.entries(map).forEach(([kom,list])=>{
        out += `# ${kom}\n`;
        let tot = 0;
        list.forEach((x,i)=>{
          tot += x.s;
          out += `${i+1}. ${formatTanggal(x.tgl)} : ${rupiah(x.s)}\n`;
        });
        out += `Surplus ${kom} : ${rupiah(tot)}\n\n`;
      });

      out += `Total Surplus : *${rupiah(totalSurplus)}*\n\n`;
    }
  }

  /* =============================
     BAGI HASIL
  ============================= */
  if (jenis === "lengkap" && data.skema) {
    out += `*BAGI HASIL*\n\n`;
    const labaBersih = totalSurplus - totalBiaya;
    Object.entries(data.skema.pembagian).forEach(([k,p])=>{
      out += `- ${k} (${p}%) : ${rupiah(labaBersih * p / 100)}\n`;
    });
    out += `\n`;
  }

  out += `> Note:\nBagi hasil dilakukan setelah *keuntungan* (surplus dikurangi biaya).\n`;
  out += `📌 pulungriswanto.my.id/${lahanKey}`;

  output.textContent = out;
}

/* =============================
   COPY
============================= */
function salinLaporan() {
  navigator.clipboard.writeText(output.textContent);
  alert("Laporan disalin");
}