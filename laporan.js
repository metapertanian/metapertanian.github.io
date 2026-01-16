// laporan.js FINAL — BERTUNAS
// Lahan → Musim → Jenis Laporan (checkbox)
// PHP saja = 1 panen detail

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
   INIT MUSIM
============================= */
function initMusim() {
  const lahanKey = document.getElementById("lahan").value;
  const musimSelect = document.getElementById("musim");
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
  initPanenTanggal();
}

/* =============================
   INIT PANEN DROPDOWN (PHP SAJA)
============================= */
function initPanenTanggal() {
  const lahanKey = document.getElementById("lahan").value;
  const musimKey = document.getElementById("musim").value;
  const panenSelect = document.getElementById("panenTanggal");

  if (!panenSelect) return;

  panenSelect.innerHTML = "";

  const data = LAHAN_MAP[lahanKey]?.musim?.[musimKey];
  if (!data || !data.panen || data.panen.length === 0) {
    panenSelect.innerHTML = `<option value="">Tidak ada panen</option>`;
    return;
  }

  data.panen.forEach((p, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `${formatTanggal(p.tanggal)} – ${p.komoditas}`;
    panenSelect.appendChild(opt);
  });
}

/* =============================
   EVENT
============================= */
document.addEventListener("DOMContentLoaded", () => {
  initMusim();
  document.getElementById("lahan")?.addEventListener("change", initMusim);
  document.getElementById("musim")?.addEventListener("change", initPanenTanggal);
});

/* =============================
   GENERATE LAPORAN
============================= */
function generateLaporan() {
  const lahanKey = document.getElementById("lahan").value;
  const musimKey = document.getElementById("musim").value;
  const output = document.getElementById("output");

  const chkModal = document.getElementById("chkModal")?.checked;
  const chkBiaya = document.getElementById("chkBiaya")?.checked;
  const chkPanen = document.getElementById("chkPanen")?.checked;
  const chkLengkap = document.getElementById("chkLengkap")?.checked;

  const lahan = LAHAN_MAP[lahanKey];
  const data = lahan?.musim?.[musimKey];

  if (!data) {
    alert("Data musim tidak ditemukan");
    return;
  }

  let out = "";

  /* =============================
     HEADER
  ============================= */
  const tglBiaya = (data.biaya || []).map(b => b.tanggal).sort();
  out += `*${lahan.nama}* \n\`Bertani, Berbisnis, Berbagi\`\n\n`;
  out += `${data.label}\n`;
  out += `${formatTanggal(tglBiaya[0])} - ${formatTanggal(tglBiaya.at(-1))}\n`;
  out += `——————————————\n\n`;

  /* =============================
     MODAL
  ============================= */
  let totalModal = 0;
  if (chkModal || chkLengkap) {
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
  if (chkBiaya || chkLengkap) {
    out += `*BIAYA & SKINCARE* Untuk Perawatan ${data.komoditas.join(", ")}\n\n`;
    (data.biaya || []).forEach(b => {
      totalBiaya += Number(b.jumlah);
      out += `- ${b.keterangan} : ${rupiah(b.jumlah)}\n`;
    });
    out += `\nTotal Biaya: *${rupiah(totalBiaya)}*\n\n`;
  }

  /* =============================
     PHP SAJA (1 PANEN DETAIL)
  ============================= */
  if (chkPanen && !chkModal && !chkBiaya && !chkLengkap) {
    const idx = document.getElementById("panenTanggal")?.value;
    const p = data.panen?.[idx];

    if (!p) {
      output.textContent = "*HASIL PANEN*\n\nBelum ada data panen";
      return;
    }

    const surplus = p.nilai - (p.biayaPanen || 0);

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

    out += `\n👉 pulungriswanto.my.id/bank-risma`;
    output.textContent = out;
    return;
  }

  /* =============================
     PANEN RINGKAS
  ============================= */
  if (chkLengkap) {
    let totalSurplus = 0;
    out += `*HASIL PANEN*\n\n`;

    if (!data.panen.length) {
      out += `(belum ada data panen)\n\n`;
    } else {
      const map = {};
      data.panen.forEach(p => {
        const s = p.nilai - (p.biayaPanen || 0);
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

    if (data.skema) {
      out += `*BAGI HASIL*\n\n`;
      const labaBersih = totalSurplus - totalBiaya;
      Object.entries(data.skema.pembagian).forEach(([k,p])=>{
        out += `- ${k} (${p}%) : ${rupiah(labaBersih * p / 100)}\n`;
      });
    }
  }

  out += `\n📌 pulungriswanto.my.id/${lahanKey}`;
  output.textContent = out;
}

/* =============================
   COPY
============================= */
function salinLaporan() {
  navigator.clipboard.writeText(
    document.getElementById("output").textContent
  );
  alert("Laporan disalin");
}