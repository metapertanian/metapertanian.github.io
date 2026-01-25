// laporan.js FINAL — BERTUNAS (STABIL)
// Lahan → Musim → Jenis (dropdown)
// Panen saja = 1 panen detail + bonus + bank otomatis

/* =============================
   MAP LAHAN
============================= */
const LAHAN_MAP = {
  rismafarm: typeof RISMA_FARM !== "undefined" ? RISMA_FARM : null,
  umi: typeof UMI !== "undefined" ? UMI : null,
  umi2: typeof UMI2 !== "undefined" ? UMI2 : null,
  horti: typeof HORTI !== "undefined" ? HORTI : null,
  pangan: typeof PANGAN !== "undefined" ? PANGAN : null
};

/* =============================
   BANK
============================= */
const BANK = typeof BANK_RISMA !== "undefined" ? BANK_RISMA : null;

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
    .sort((a,b)=>Number(b)-Number(a))
    .forEach(k=>{
      const o=document.createElement("option");
      o.value=k;
      o.textContent=lahan.musim[k].label||`Musim Tanam Ke-${k}`;
      musimSelect.appendChild(o);
    });

  musimSelect.selectedIndex = 0;
  initPanenTanggal();
}

/* =============================
   INIT PANEN DROPDOWN
============================= */
function initPanenTanggal() {
  const panenSelect = document.getElementById("panenTanggal");
  if (!panenSelect) return;

  const lahanKey = document.getElementById("lahan").value;
  const musimKey = document.getElementById("musim").value;
  const data = LAHAN_MAP[lahanKey]?.musim?.[musimKey];

  panenSelect.innerHTML = "";

  if (!data || !data.panen || !data.panen.length) {
    panenSelect.innerHTML = `<option value="">Tidak ada panen</option>`;
    return;
  }

  data.panen.forEach((p,i)=>{
    const o=document.createElement("option");
    o.value=i;
    o.textContent=`${formatTanggal(p.tanggal)} – ${p.komoditas}`;
    panenSelect.appendChild(o);
  });
}

/* =============================
   EVENT
============================= */
document.addEventListener("DOMContentLoaded",()=>{
  initMusim();
  document.getElementById("lahan")?.addEventListener("change",initMusim);
  document.getElementById("musim")?.addEventListener("change",initPanenTanggal);
});

/* =============================
   GENERATE LAPORAN
============================= */
function generateLaporan() {
  const jenis=document.getElementById("jenis").value;
  const lahanKey=document.getElementById("lahan").value;
  const musimKey=document.getElementById("musim").value;
  const output=document.getElementById("output");

  const lahan=LAHAN_MAP[lahanKey];
  const data=lahan?.musim?.[musimKey];
  if(!data){alert("Data musim tidak ditemukan");return;}

  let out="";

  /* =============================
     HEADER + RENTANG TANGGAL
  ============================= */
  const tglSemua=[
    ...(data.biaya||[]).map(b=>b.tanggal),
    ...(data.panen||[]).map(p=>p.tanggal)
  ].sort();

  const judulJenis = document
  .getElementById("jenis")
  .selectedOptions[0]
  .textContent;

const periode = `${formatTanggal(tglSemua[0])} - ${formatTanggal(tglSemua.at(-1))}`;

out += `*Laporan ${judulJenis} ${lahan.nama.toUpperCase()}*\n`;
out += `> Bertani, Berbisnis, Berbagi\n\n`;
out += `${data.lokasi || "-"}\n`;
out += `${data.label}\n`;
out += `${periode}\n`;
out += `————————————\n\n`;

  let totalModal=0;
  let totalBiaya=0;
  let totalSurplus=0;

  /* =============================
     MODAL
  ============================= */
  if(["modal","modal-biaya","modal-biaya-panen","lengkap"].includes(jenis)){
    out+=`*INVESTOR*\n\n`;
    Object.entries(data.modal || {}).forEach(([k, v]) => {
  totalModal += Number(v);
  out += `- ${k} : ${rupiah(v)}\n`;
});

// =============================
// HITUNG TOTAL BIAYA
// =============================
const biayaTotal = (data.biaya || [])
  .reduce((a, b) => a + Number(b.jumlah || 0), 0);

// =============================
// JIKA BIAYA > MODAL → MANAJEMEN
// =============================
if (biayaTotal > totalModal) {
  const tambahan = biayaTotal - totalModal;
  totalModal += tambahan;
  out += `- MANAJEMEN : ${rupiah(tambahan)}\n`;
}

out += `\nTotal Modal: *${rupiah(totalModal)}*\n\n`;
  }

  /* =============================
     BIAYA
  ============================= */
  if(["biaya","modal-biaya","biaya-panen","modal-biaya-panen","lengkap"].includes(jenis)){
    out+=`*BIAYA & SKINCARE*\n\n`;
    (data.biaya||[]).forEach(b=>{
      totalBiaya+=Number(b.jumlah);
      out+=`- ${b.keterangan} : ${rupiah(b.jumlah)}\n`;
    });
    out+=`\nTotal Biaya: *${rupiah(totalBiaya)}*\n\n`;
  }

  /* =============================
     PANEN SAJA (DETAIL)
  ============================= */
  if(jenis==="panen"){
    const idx=document.getElementById("panenTanggal")?.value;
    const p=data.panen?.[idx];
    if(!p){
      output.textContent="*HASIL PANEN*\n\nBelum ada data";
      return;
    }

    const surplus=p.nilai-(p.biayaPanen||0);

    out+=`*HASIL PANEN* : ${p.komoditas}\n`;
    out+=`📆 ${formatTanggal(p.tanggal)}\n`;
    out+=`Berat : ${p.qty} ${p.satuan||"kg"}\n`;
    out+=`Biaya Panen : ${rupiah(p.biayaPanen)}\n`;
    out+=`Omzet : ${rupiah(p.nilai)}\n\n`;
    out+=`Surplus : *${rupiah(surplus)}*\n`;
    out+=`👉 pulungriswanto.my.id/${lahanKey}\n`;

    if(p.bonusPanen?.total){
      out+=`——————————————\n\n`;
      out+=`*BONUS PANEN : ${rupiah(p.bonusPanen.total)}*\n`;
      const per=p.bonusPanen.total/p.bonusPanen.anggota.length;
      p.bonusPanen.anggota.forEach((a,i)=>{
        out+=`${i+1}. ${a} : ${rupiah(per)}\n`;
      });

      if(BANK){
        out+=`\n*BANK RISMA : ${rupiah(BANK.saldo)}*\n`;
        Object.entries(BANK.anggota||{}).forEach(([n,s],i)=>{
          out+=`${i+1}. ${n} : ${rupiah(s)}\n`;
        });
        out+=`\n👉 pulungriswanto.my.id/bank-risma`;
      }
    }

    output.textContent=out;
    return;
  }

  /* =============================
     PANEN RINGKAS
  ============================= */
  if(["biaya-panen","modal-biaya-panen","lengkap"].includes(jenis)){
    out+=`*HASIL PANEN*\n\n`;
    if(!data.panen.length){
      out+=`(belum ada data panen)\n\n`;
    }else{
      const map={};
      data.panen.forEach(p=>{
        const s=p.nilai-(p.biayaPanen||0);
        totalSurplus+=s;
        map[p.komoditas]??=[];
        map[p.komoditas].push({tgl:p.tanggal,s});
      });

      Object.entries(map).forEach(([k,l])=>{
        out+=`# ${k}\n`;
        let tot=0;
        l.forEach((x,i)=>{
          tot+=x.s;
          out+=`${i+1}. ${formatTanggal(x.tgl)} : ${rupiah(x.s)}\n`;
        });
        out+=`Surplus ${k} : ${rupiah(tot)}\n\n`;
      });

      out+=`Total Surplus : *${rupiah(totalSurplus)}*\n\n`;
    }
  }

  /* =============================
     BAGI HASIL
  ============================= */
  if(jenis==="lengkap" && data.skema){
    out+=`*BAGI HASIL*\n\n`;
    const laba=totalSurplus-totalBiaya;
    Object.entries(data.skema.pembagian).forEach(([k,p])=>{
      out+=`- ${k} (${p}%) : ${rupiah(laba*p/100)}\n`;
    });
  }

  out+=`\n📌 pulungriswanto.my.id/${lahanKey}`;
  output.textContent=out;
}

/* =============================
   COPY
============================= */
function salinLaporan(){
  navigator.clipboard.writeText(
    document.getElementById("output").textContent
  );
  alert("Laporan disalin");
}