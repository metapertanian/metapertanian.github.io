/* lahan.js */

/* ======================================================
UTIL
====================================================== */
const rupiah = n => Number(n||0).toLocaleString("id-ID");
const tgl = t => new Date(t).toLocaleDateString("id-ID",{
  day:"2-digit", month:"short", year:"numeric"
});



/* ======================================================
DATA MUSIM
====================================================== */
const musimKeys = Object.keys(RISMA_FARM.musim || {});
let musimAktif = RISMA_FARM.musim[musimKeys[0]];

/* ======================================================
DROPDOWN MUSIM
====================================================== */
const selectMusim = document.getElementById("pilihMusim");
musimKeys.forEach(k=>{
  const m = RISMA_FARM.musim[k];
  const opt = document.createElement("option");
  opt.value = k;
  opt.textContent = m.label;
  selectMusim.appendChild(opt);
});
selectMusim.onchange = () => {
  musimAktif = RISMA_FARM.musim[selectMusim.value];
  renderSemua();
};

/* ======================================================
INFO MUSIM (HANYA LOKASI)
====================================================== */
function renderInfoMusim(){
  document.getElementById("infoMusim").innerHTML =
    musimAktif.lokasi || "";
}

/* ======================================================
MODAL
====================================================== */

function renderModal(){
  let totalModal = 0;
  let html = `<table class="table">
    <tr><th>No</th><th>Nama</th><th>Jumlah</th></tr>`;

  const entries = Object.entries(musimAktif.modal || {});

  entries.forEach(([n,v],i)=>{
    totalModal += Number(v);
    html += `<tr>
      <td>${i+1}</td>
      <td>${n}</td>
      <td>Rp ${rupiah(v)}</td>
    </tr>`;
  });

  // ===============================
  // HITUNG TOTAL BIAYA
  // ===============================
  const totalBiaya = (musimAktif.biaya || [])
    .reduce((a,b)=>a + Number(b.jumlah||0), 0);

  // ===============================
  // JIKA BIAYA > MODAL → MODAL MANAJEMEN
  // ===============================
  let no = entries.length + 1;
  if(totalBiaya > totalModal){
    const tambahan = totalBiaya - totalModal;
    totalModal += tambahan;

    html += `<tr class="warning">
      <td>${no}</td>
      <td>MANAJEMEN</td>
      <td>Rp ${rupiah(tambahan)}</td>
    </tr>`;
  }

  // ===============================
  // TOTAL
  // ===============================
  html += `<tr class="total">
    <td colspan="2"><strong>Modal</strong></td>
    <td><strong>Rp ${rupiah(totalModal)}</strong></td>
  </tr></table>`;

  document.getElementById("tabelModal").innerHTML = html;
}

/* ======================================================
   POPUP DETAIL TRANSAKSI
====================================================== */
function showDetailTransaksi(data) {
  const modal = document.createElement("div");
  modal.className = "detail-modal";

  modal.innerHTML = `
    <div class="detail-card">
      <div class="detail-header">
        <strong>${data.jenis}</strong>
        <span class="close-btn">&times;</span>
      </div>

      <div class="detail-body">
        <div class="detail-date ${data.nilai >= 0 ? "success" : "danger"}"
     style="opacity:.7">
  ${tgl(data.tanggal)}
</div>

        <div class="detail-text">
          ${data.keterangan.replaceAll(" | ","<br>")}
        </div>

        <div class="detail-value ${data.nilai >= 0 ? "success":"danger"}">
          Rp ${rupiah(data.nilai)}
        </div>

        ${
          data.bukti
          ? `<img src="${data.bukti}" class="detail-img"
     onclick="event.stopPropagation(); showImage(this.src)">`
          : `<div class="no-photo">Tidak ada foto</div>`
        }
      </div>
    </div>
  `;

  modal.onclick = () => modal.remove();

  document.body.appendChild(modal);
}

/* ======================================================
TABEL BIAYA
====================================================== */
function renderTabelBiaya(){
  let total = 0;
  let html = `<table class="table">
    <tr><th>No</th><th>Tanggal</th><th>Keterangan</th><th>Harga</th></tr>`;
  const biayaSorted = [...musimAktif.biaya].sort(
  (a,b) => new Date(a.tanggal) - new Date(b.tanggal)
);

biayaSorted.forEach((b,i)=>{
    total += b.jumlah;
    html += `<tr style="cursor:pointer"
  onclick='showDetailTransaksi({
    jenis:"Biaya",
    tanggal:"${b.tanggal}",
    keterangan:"${b.keterangan}",
    nilai:-${b.jumlah},
    bukti:${b.bukti ? `"${b.bukti}"` : "null"}
  })'>
      <td>${i+1}</td>
      <td>${tgl(b.tanggal)}</td>
      <td>${b.keterangan}</td>
      <td>Rp ${rupiah(b.jumlah)}</td>
    </tr>`;
  });
  html += `<tr class="total">
    <td colspan="3"><strong>Total</strong></td>
    <td><strong>Rp ${rupiah(total)}</strong></td>
  </tr></table>`;
  document.getElementById("tabelBiaya").innerHTML = html;
}

/* ======================================================
PANEN PER KOMODITAS (DIPISAH)
====================================================== */
function renderTabelPanen(){
  const box = document.getElementById("tabelPanen");
  box.innerHTML = "";

  const grup = {};
  musimAktif.panen.forEach(p=>{
    if(!grup[p.komoditas]) grup[p.komoditas] = [];
    grup[p.komoditas].push(p);
  });

  Object.entries(grup).forEach(([komoditas,data])=>{
    let totalOmzet = 0;
    let totalBiayaPanen = 0;

    let html = `
      <br/>
      <h3 style="margin-top:14px">${komoditas}</h3>
      <table class="table">
        <tr>
          <th>No</th>
          <th>Tanggal</th>
          <th>Biaya Panen</th>
          <th>Omzet</th>
        </tr>
    `;

    const dataSorted = [...data].sort(
      (a,b)=>new Date(a.tanggal)-new Date(b.tanggal)
    );

    dataSorted.forEach((p,i)=>{
      totalOmzet += p.nilai;
      totalBiayaPanen += (p.biayaPanen || 0);

      html += `
        <tr style="cursor:pointer"
          onclick='showDetailTransaksi({
            jenis:"Panen ${komoditas}",
            tanggal:"${p.tanggal}",
            keterangan:"Omzet Rp ${rupiah(p.nilai)} | Biaya Panen Rp ${rupiah(p.biayaPanen||0)}",
            nilai:${p.nilai - (p.biayaPanen||0)},
            bukti:${p.bukti ? `"${p.bukti}"` : "null"}
          })'>
          <td>${i+1}</td>
          <td>${tgl(p.tanggal)}</td>
          <td>Rp ${rupiah(p.biayaPanen||0)}</td>
          <td>Rp ${rupiah(p.nilai)}</td>
        </tr>`;
    });

    html += `
      <tr class="total">
        <td colspan="2"><strong>Total</strong></td>
        <td><strong>Rp ${rupiah(totalBiayaPanen)}</strong></td>
        <td><strong>Rp ${rupiah(totalOmzet)}</strong></td>
      </tr>
    </table>
    `;

    box.innerHTML += html;
  });
}

/* ======================================================
LABA & BAGI HASIL (KAPITAL + PERSEN)
====================================================== */
function renderLaba(){
  const totalBiayaModal = musimAktif.biaya.reduce((a,b)=>a+b.jumlah,0);
  const totalBiayaPanen = musimAktif.panen.reduce((a,b)=>a+(b.biayaPanen||0),0);
  const totalOmzet = musimAktif.panen.reduce((a,b)=>a+b.nilai,0);

  const totalBiaya = totalBiayaModal + totalBiayaPanen;
  const laba = totalOmzet - totalBiaya;

  let html = `
  <section class="card">
    <h2>📊 Bagi Hasil</h2>

    <div class="stat"><small>Total Omzet</small><strong>Rp ${rupiah(totalOmzet)}</strong></div>
    <div class="stat"><small>Total Biaya</small><strong>Rp ${rupiah(totalBiaya)}</strong></div>
    <div class="stat">
      <small>Laba Bersih</small>
      <strong class="${laba>=0?'success':'danger'}">Rp ${rupiah(laba)}</strong>
    </div>

    <hr style="margin:12px 0">
    <table class="table">
      <tr>
        <th>No</th>
        <th>Penerima</th>
        <th>Modal + Persentase</th>
        <th>Total</th>
      </tr>
  `;

  let no = 1;

  Object.entries(musimAktif.skema.pembagian||{}).forEach(([nama,persen])=>{
    const bagian = laba * persen / 100;

    html += `
      <tr>
        <td>${no++}</td>
        <td>${nama}</td>
        <td>${persen}%</td>
        <td>Rp ${rupiah(bagian)}</td>
      </tr>
    `;
  });

  html += `
    </table>
  </section>
  `;

  document.getElementById("labaSection").innerHTML = html;
}

/* ======================================================
RIWAYAT TRANSAKSI + FOTO (THUMBNAIL)
====================================================== */
const PER_PAGE = 5;
let riwayat = [];

function kumpulkanRiwayat(){
  riwayat = [];

  musimAktif.biaya.forEach(b=>{
    riwayat.push({
      tanggal:b.tanggal,
      jenis:"Biaya",
      ket:b.keterangan,
      nilai:-b.jumlah,
      bukti:b.bukti||null
    });
  });

  musimAktif.panen.forEach(p=>{
  riwayat.push({
    tanggal: p.tanggal,
    jenis: "Panen",
    ket: `${p.komoditas} | Omzet Rp ${rupiah(p.nilai)} | Biaya Panen Rp ${rupiah(p.biayaPanen||0)}`,
    nilai: p.nilai - (p.biayaPanen||0),
    bukti: p.bukti || null   // ✅ INI KUNCI
  });
});

  riwayat.sort((a,b)=>new Date(b.tanggal)-new Date(a.tanggal));
}

function showImage(src){
  const m=document.createElement("div");
  m.className="img-modal";
  m.innerHTML=`<img src="${src}">`;
  m.onclick=()=>m.remove();
  document.body.appendChild(m);
}





function renderRiwayat(page=1){
  const box=document.getElementById("riwayatTransaksi");
  const pag=document.getElementById("pagination");
  box.innerHTML=""; 
  pag.innerHTML="";

  riwayat.slice((page-1)*PER_PAGE,page*PER_PAGE).forEach(r=>{
    box.innerHTML+=`
    <div class="riwayat-item">

      <div class="riwayat-thumb ${r.bukti ? "" : "empty"}">
        ${
          r.bukti
          ? `<img 
              src="${r.bukti}"
              class="bukti-img"
              loading="lazy"
              alt="Bukti transaksi"
              onclick="showImage(this.src)"
            >`
          : `<span class="no-photo">NO FOTO</span>`
        }
      </div>

      <div>
        <div class="riwayat-date ${r.nilai >= 0 ? "success" : "danger"}"
     style="opacity:.65;font-size:13px">
  ${tgl(r.tanggal)}
</div>
        <div class="riwayat-title">${r.jenis}</div>

        <div class="riwayat-detail">
          ${r.ket.replaceAll(" | ","<br>")}
        </div>

        <div class="riwayat-value ${r.nilai>=0?'success':'danger'}">
          Rp ${rupiah(r.nilai)}
        </div>
      </div>

    </div>`;
  });

  const max=Math.min(5,Math.ceil(riwayat.length/PER_PAGE));
  for(let i=1;i<=max;i++){
    const b=document.createElement("button");
    b.textContent=i;
    if(i===page)b.classList.add("active");
    b.onclick=()=>{
      renderRiwayat(i);
      document.getElementById("riwayatSection")
        .scrollIntoView({behavior:"smooth"});
    };
    pag.appendChild(b);
  }
}

/* ======================================================
INIT
====================================================== */
function renderSemua(){
  renderInfoMusim();
  renderModal();
  renderTabelBiaya();
  renderTabelPanen();
  renderLaba();
  kumpulkanRiwayat();
  renderRiwayat(1);
}
renderSemua();