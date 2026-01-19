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

  /* =============================
     GABUNG SEMUA TRANSAKSI
  ============================= */
  const semuaTransaksi = Object.values(KAS_BANK_RISMA)
    .flat()
    .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

  /* =============================
     HITUNG GLOBAL
  ============================= */
  function hitungGlobal() {
    const anggota = {};
    let totalMasuk = 0;
    let totalKeluar = 0;

    semuaTransaksi.forEach(trx => {
      Object.entries(trx.detail || {}).forEach(([nama, nilai]) => {
        if (!anggota[nama]) {
          anggota[nama] = { masuk: 0, keluar: 0 };
        }

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

    <!-- SUMMARY MENURUN -->
    <section class="card" style="text-align:center">
      <small id="summaryLabel">Total Saldo</small>
      <div class="big-number success" id="summaryValue">0</div>
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
      <div id="riwayat"></div>
      <div id="pagination" class="pagination"></div>
    </section>
  `;

  /* =============================
     ANIMASI ANGKA
  ============================= */
  function animate(elm, end) {
    let start = 0;
    const dur = 1200;
    const t0 = performance.now();

    function step(t) {
      const p = Math.min((t - t0) / dur, 1);
      elm.textContent = Math.floor(p * end).toLocaleString("id-ID");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* =============================
     ANIMASI SUMMARY BERGANTIAN
  ============================= */
  let summaryIndex = 0;
  function animateSummary(data) {
    const list = [
      { label: "Total Saldo", value: data.totalMasuk, cls: "success" },
      { label: "Tarik Tunai", value: data.totalKeluar, cls: "danger" },
      { label: "Sisa Saldo", value: data.sisaSaldo, cls: "success" }
    ];

    const item = list[summaryIndex % list.length];
    const labelEl = el("summaryLabel");
    const valueEl = el("summaryValue");

    labelEl.textContent = item.label;
    valueEl.className = `big-number ${item.cls}`;
    animate(valueEl, item.value);

    summaryIndex++;
  }

  /* =============================
     RENDER DATA
  ============================= */
  let currentPage = 1;
  const perPage = 5;
  let globalData;

  function render() {
    globalData = hitungGlobal();

    animateSummary(globalData);
    setInterval(() => animateSummary(globalData), 3000);

    const tbody = el("tabelAnggota");
    tbody.innerHTML = "";
    globalData.tabel.forEach((a, i) => {
      tbody.innerHTML += `
        <tr>
          <td>${i + 1}</td>
          <td>${a.nama}</td>
          <td>${ribu(a.masuk)}</td>
          <td>${ribu(a.keluar)}</td>
          <td><strong>${ribu(a.saldo)}</strong></td>
        </tr>
      `;
    });

    renderRiwayat(globalData.riwayat);
  }

  function renderRiwayat(data) {
    const box = el("riwayat");
    box.innerHTML = "";

    const start = (currentPage - 1) * perPage;
    const items = data.slice(start, start + perPage);

    items.forEach(r => {
      const total = Object.values(r.detail).reduce((a,b)=>a+b,0);
      const anggotaDetail = Object.entries(r.detail)
        .map(([n,v]) => `${n}: ${v.toLocaleString("id-ID")}`)
        .join("<br>");

      box.innerHTML += `
        <div class="riwayat-item">
          <div class="riwayat-date">${r.tanggal}</div>
          <div>
            <strong>${r.kategori}</strong> – ${r.sumber}<br>
            <span class="${r.tipe}">
              ${r.tipe === "masuk" ? "+" : "-"}
              ${total.toLocaleString("id-ID")}
            </span>
            <div class="muted" style="margin-top:6px;font-size:.85rem">
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
        renderRiwayat(globalData.riwayat);
        el("riwayatSection").scrollIntoView({ behavior: "smooth" });
      };
      pag.appendChild(b);
    }
  }

  render();

})();