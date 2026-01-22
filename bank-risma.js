/* =========================================================
   BANK RISMA – TANPA PERIODE (GLOBAL)
========================================================= */

(function () {

  if (typeof KAS_BANK_RISMA === "undefined") {
    document.body.innerHTML = "<p>Data BANK RISMA tidak ditemukan</p>";
    return;
  }

  /* =============================
     UTIL
  ============================= */
  const el = id => document.getElementById(id);
  const ribu = n => Math.floor(n / 1000);

  const formatTanggal = t => {
    const d = new Date(t);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  /* =============================
     GABUNG SEMUA TRANSAKSI
  ============================= */
  const semuaTransaksi = Object.values(KAS_BANK_RISMA)
    .flat()
    .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

  /* =============================
     HITUNG GLOBAL (TABEL TIDAK TERFILTER)
  ============================= */
  function hitungGlobal() {
    const anggota = {};
    let totalMasuk = 0;
    let totalKeluar = 0;

    semuaTransaksi.forEach(trx => {
      Object.entries(trx.detail || {}).forEach(([nama, nilai]) => {
        if (!anggota[nama]) anggota[nama] = { masuk: 0, keluar: 0 };

        if (trx.tipe === "masuk") {
          anggota[nama].masuk += nilai;
          totalMasuk += nilai;
        } else {
          anggota[nama].keluar += nilai;
          totalKeluar += nilai;
        }
      });
    });

    const tabel = Object.entries(anggota)
      .map(([nama, v]) => ({
        nama,
        masuk: v.masuk,
        keluar: v.keluar,
        saldo: v.masuk - v.keluar
      }))
      .sort((a, b) => b.saldo - a.saldo);

    return {
      tabel,
      riwayat: semuaTransaksi,
      totalMasuk,
      totalKeluar,
      sisaSaldo: totalMasuk - totalKeluar
    };
  }

  /* =============================
     RENDER UI
  ============================= */
  const app = el("bankApp");
  app.innerHTML = `
    <div class="bank-header">
      <img src="/img/risma_1.png" class="bank-logo">
      <h1 class="bank-title">BANK RISMA</h1>
    </div>

    <section class="card summary-stack" style="text-align:center">
      <div class="summary-item">
        <small>Saldo Masuk</small>
        <div class="big-number success" id="totalMasuk">0</div>
      </div>
      <div class="summary-item">
        <small>Saldo Keluar</small>
        <div class="big-number danger" id="totalKeluar">0</div>
      </div>
      <div class="summary-item">
        <small>Sisa Saldo</small>
        <div class="big-number success" id="sisaSaldo">0</div>
      </div>
    </section>

    <section class="card">
      <table class="bank-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Anggota</th>
            <th>Masuk<br>(Ribu)</th>
            <th>Keluar<br>(Ribu)</th>
            <th>Saldo<br>(Ribu)</th>
          </tr>
        </thead>
        <tbody id="tabelAnggota"></tbody>
      </table>
    </section>

    <section class="card" id="riwayatSection">
      <h3>Riwayat Transaksi</h3>

      <!-- FILTER DIPINDAHKAN KE SINI -->
      <div style="margin:10px 0 16px">
        <label><strong>Filter Anggota</strong></label>
        <select id="filterAnggota">
          <option value="">Semua Anggota</option>
        </select>
      </div>

      <div id="riwayat"></div>
      <div id="pagination" class="pagination"></div>
    </section>
  `;

  /* =============================
     ANIMASI COUNT UP + FADE
  ============================= */
  function animate(elm, end, delay = 0) {
    setTimeout(() => {
      elm.style.opacity = 0;
      elm.style.transform = "translateY(8px)";

      const dur = 2400;
      const t0 = performance.now();

      function step(t) {
        const p = Math.min((t - t0) / dur, 1);
        const eased = easeOut(p);
        const value = Math.floor(eased * end);

        elm.textContent = value.toLocaleString("id-ID");
        elm.style.opacity = eased;
        elm.style.transform = `translateY(${8 - 8 * eased}px)`;

        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }, delay);
  }

/* ===============================
Tampilkan Foto Thumbnail 
============================== */
window.showImage = function (src) {
  const m = document.createElement("div");
  m.className = "img-modal";
  m.innerHTML = `<img src="${src}">`;
  m.onclick = () => m.remove();
  document.body.appendChild(m);
};

  /* =============================
     RENDER DATA
  ============================= */
  let currentPage = 1;
  const perPage = 5;
  let globalData;

  function render() {
    globalData = hitungGlobal();

    animate(el("totalMasuk"), globalData.totalMasuk, 0);
    animate(el("totalKeluar"), globalData.totalKeluar, 900);
    animate(el("sisaSaldo"), globalData.sisaSaldo, 1800);

    const tbody = el("tabelAnggota");
    tbody.innerHTML = "";
    globalData.tabel.forEach((a, i) => {
  let saldoCls =
    a.saldo > 0 ? "success" :
    a.saldo < 0 ? "danger"  :
    "muted";

  tbody.innerHTML += `
    <tr class="row-hover"
        onclick="filterByName('${a.nama}')">

      <td class="muted">${i + 1}</td>

      <td class="nama-cell">
        ${a.nama}
      </td>

      <td class="success angka">
        ${ribu(a.masuk)}
      </td>

      <td class="danger angka">
        ${ribu(a.keluar)}
      </td>

      <td class="angka saldo ${saldoCls}">
        <strong>${ribu(a.saldo)}</strong>
      </td>

    </tr>
  `;
});

    renderRiwayat();
  }

/* =========================
Riwayat Transaksi 
========================= */

  function renderRiwayat() {
  const box = el("riwayat");
  box.innerHTML = "";

  const filter = el("filterAnggota").value;
  const data = filter
    ? globalData.riwayat.filter(r => r.detail && r.detail[filter])
    : globalData.riwayat;

  const start = (currentPage - 1) * perPage;
  const items = data.slice(start, start + perPage);

  items.forEach(r => {
    const total = Object.values(r.detail || {}).reduce((a,b)=>a+b,0);

    const anggotaDetail = Object.entries(r.detail || {})
  .map(([n,v]) => {
    let cls = "muted";

    if (filter && n === filter) {
      cls = r.tipe === "masuk"
        ? "highlight-masuk"
        : "highlight-keluar";
    }

    return `
      <div class="${cls}" style="line-height:1.3;margin-bottom:2px">
        ${n}: Rp ${v.toLocaleString("id-ID")}
      </div>
    `;
  })
  .join("");

    box.innerHTML += `
  <div class="riwayat-item">

    <div class="riwayat-thumb ${r.bukti ? "" : "empty"}">
      ${
        r.bukti
          ? `<img 
              src="${r.bukti}" 
              loading="lazy"
              alt="Bukti transaksi"
              onclick="event.stopPropagation(); showImage(this.src)"
            >`
          : `<span class="no-photo">NO FOTO</span>`
      }
    </div>

    <div class="riwayat-content">
      <div class="riwayat-date ${r.tipe === "masuk" ? "success" : "danger"}"
           style="opacity:.65;font-size:13px">
        ${formatTanggal(r.tanggal)}
      </div>

      <div class="riwayat-title">
        ${r.kategori}
      </div>

      <div class="riwayat-detail">
        ${r.sumber}
      </div>

      <div class="riwayat-value ${r.tipe === "masuk" ? "success" : "danger"}">
        ${r.tipe === "masuk" ? "+" : "-"}Rp ${total.toLocaleString("id-ID")}
      </div>

      <div class="riwayat-detail" style="margin-top:6px">
        ${anggotaDetail}
      </div>
    </div>

  </div>
`;
  });

  renderPagination(data.length);
}


  function renderPagination(total) {
    const pag = el("pagination");
    pag.innerHTML = "";
    const pages = Math.ceil(total / perPage);

    for (let i = 1; i <= pages; i++) {
      const b = document.createElement("button");
      b.textContent = i;
      if (i === currentPage) b.classList.add("active");
      b.onclick = () => {
        currentPage = i;
        renderRiwayat();
        el("riwayatSection").scrollIntoView({ behavior: "smooth" });
      };
      pag.appendChild(b);
    }
  }


/* =================================
   Klik Nama ke filter
================================ */
window.filterByName = function (nama) {
  el("filterAnggota").value = nama;
  currentPage = 1;
  renderRiwayat();
  el("riwayatSection").scrollIntoView({ behavior: "smooth" });
};

  /* =============================
     INIT FILTER
  ============================= */
  const filterSelect = el("filterAnggota");
  const namaUnik = new Set();

  semuaTransaksi.forEach(t =>
    Object.keys(t.detail || {}).forEach(n => namaUnik.add(n))
  );

  [...namaUnik].sort().forEach(n => {
    const o = document.createElement("option");
    o.value = n;
    o.textContent = n;
    filterSelect.appendChild(o);
  });

  filterSelect.onchange = () => {
    currentPage = 1;
    renderRiwayat();
  };

  render();

})();