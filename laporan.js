// laporan.js FINAL — BERTUNAS
// Auto laba bersih, PHP mode, skema bagi hasil

/* =============================
   MAP LAHAN
============================= */
const LAHAN_MAP = {
  rismafarm: typeof RISMA_FARM !== "undefined" ? RISMA_FARM : null
};

/* =============================
   UTIL
============================= */
function formatTanggal(tgl) {
  if (!tgl) return "-";
  const bulan = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
  const d = new Date(tgl);
  return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
}

function rupiah(n) {
  return Number(n || 0).toLocaleString("id-ID");
}

/* =============================
   INIT MUSIM
============================= */
function initMusim() {
  const lahan = LAHAN_MAP[lahanSelect.value];
  musim.innerHTML = "";
  if (!lahan) return;

  Object.keys(lahan.musim)
    .sort((a, b) => b - a)
    .forEach(k => {
      const o = document.createElement("option");
      o.value = k;
      o.textContent = lahan.musim[k].label;
      musim.appendChild(o);
    });
}

/* =============================
   EVENT
============================= */
document.addEventListener("DOMContentLoaded", () => setTimeout(initMusim, 100));
lahan.addEventListener("change", initMusim);

/* =============================
   GENERATE
============================= */
function generateLaporan() {
  const jenis = jenisSelect.value;
  const lahanKey = lahan.value;
  const musimKey = musim.value;

  const data = LAHAN_MAP[lahanKey]?.musim?.[musimKey];
  if (!data) return alert("Data musim tidak ditemukan");

  let out = "";

  /* =============================
     HEADER & TANGGAL
  ============================= */
  const tanggalBiaya = (data.biaya || []).map(b => b.tanggal).sort();
  const tAwal = formatTanggal(tanggalBiaya[0]);
  const tAkhir = formatTanggal(tanggalBiaya[tanggalBiaya.length - 1]);

  out += `*${LAHAN_MAP[lahanKey].nama}*\n \`Bertani, Berbisnis, Berbagi\`\n\n`;
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
    data.biaya.forEach(b => {
      totalBiaya += Number(b.jumlah);
      out += `- ${b.keterangan} : ${rupiah(b.jumlah)}\n`;
    });
    out += `\nTotal Biaya: *${rupiah(totalBiaya)}*\n\n`;
  }

  /* =============================
     PHP SAJA (DETAIL)
  ============================= */
  if (jenis === "panen") {
    data.panen.forEach(p => {
      out += `*HASIL PANEN : ${p.komoditas}*\n`;
      out += `${formatTanggal(p.tanggal)}\n`;
      out += `Berat : ${p.qty} ${p.satuan || "kg"}\n`;
      out += `Omzet : ${rupiah(p.nilai)}\n`;
      out += `Biaya Panen : ${rupiah(p.biayaPanen)}\n\n`;

      const surplus = p.nilai - p.biayaPanen;
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

    output.textContent = out;
    return;
  }

  /* =============================
     PANEN RINGKAS
  ============================= */
  let totalSurplus = 0;
  if (["modal-biaya-panen","lengkap"].includes(jenis)) {
    out += `*HASIL PANEN*\n\n`;
    if (data.panen.length === 0) {
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
     BAGI HASIL OTOMATIS
  ============================= */
  if (jenis === "lengkap" && data.skema) {
    out += `*BAGI HASIL*\n\n`;
    const labaBersih = totalSurplus - totalBiaya;
    Object.entries(data.skema.pembagian).forEach(([k,p])=>{
      out += `- ${k} (${p}%) : ${rupiah(labaBersih * p / 100)}\n`;
    });
    out += `\n`;
  }

  out += `> Note:\nbagi hasil dilakukan setelah didapat *keuntungan*, yaitu *surplus* dikurangi *biaya*.\n`;
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