/* =========================================================
   BANK RISMA – FULL UI & LOGIC
========================================================= */

(function () {

  if (typeof KAS_BANK_RISMA === "undefined") {
    document.body.innerHTML = "<p>Data BANK RISMA tidak ditemukan</p>";
    return;
  }

  /* =============================
     UTIL
  ============================= */
  const rupiahRibu = n => Math.floor(n / 1000);
  const el = id => document.getElementById(id);

  /* =============================
     SORT PERIODE (TERBARU)
  ============================= */
  const periodeList = Object.keys(KAS_BANK_RISMA)
    .map(Number)
    .sort((a, b) => b - a);

  let periodeAktif = periodeList[0];

  /* =============================
     HITUNG DATA PERIODE
  ============================= */
  function hitungPeriode(tahun) {
    const data = KAS_BANK_RISMA[tahun] || [];

    const anggotaMap = {};
    let totalMasuk = 0;
    let totalKeluar = 0;

    data.forEach(trx => {
      Object.entries(trx.detail || {}).forEach(([nama, nilai]) => {
        if (!anggotaMap[nama]) {
          anggotaMap[nama] = { masuk: 0, keluar: 0 };
        }

        if (trx.tipe === "masuk") {
          anggotaMap[nama].masuk += nilai;
          totalMasuk += nilai;
        } else {
          anggotaMap[nama].keluar += nilai;
          totalKeluar += nilai;
        }
      });
    });

    const tabel = Object.keys(anggotaMap).map(nama => ({
      nama,
      masuk: anggotaMap[nama].masuk,
      keluar: anggotaMap[nama].keluar,
      saldo: anggotaMap[nama].masuk - anggotaMap[nama].keluar
    })).sort((a, b) => b.saldo - a.saldo);

    return {
      tabel,
      riwayat: data.slice().sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)),
      totalMasuk,
      totalKeluar,
      sisaSaldo: totalMasuk - totalKeluar
    };
  }

  /* =============================
     RENDER HALAMAN
  ============================= */
  const app = document.getElementById("bankApp");
  app.innerHTML = `
    <div style="text-align:center">
      <img src="/img/risma_1.png" style="width:110px;border-radius:50%;box-shadow:0 4px 12px rgba(0,0,0,.3)">
      <h1 style="margin:10px 0">BANK RISMA</h1>

      <select id="periodeSelect"></select>
    </div>

    <section class="grid-3" style="margin-top:20px">
      <div class="card"><small>Total Saldo</small><div class="big-number" id="totalMasuk">0</div></div>
      <div class="card"><small>Tarik Tunai</small><div class="big-number danger" id="totalKeluar">0</div></div>
      <div class="card"><small>Sisa Saldo</small><div class="big-number success" id="sisaSaldo">0</div></div>
    </section>

    <section class="card">
      <table>
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

    <section class="card">
      <h3>Riwayat Transaksi</h3>
      <div id="riwayat"></div>
      <div id="pagination" class="pagination"></div>
    </section>
  `;

  /* =============================
     DROPDOWN PERIODE
  ============================= */
  const periodeSelect = el("periodeSelect");
  periodeList.forEach(p => {
    const o = document.createElement("option");
    o.value = p;
    o.textContent = p;
    periodeSelect.appendChild(o);
  });
  periodeSelect.value = periodeAktif;

  /* =============================
     ANIMASI ANGKA
  ============================= */
  function animate(elm, end) {
    let start = 0;
    const dur = 3000;
    const t0 = performance.now();

    function step(t) {
      const p = Math.min((t - t0) / dur, 1);
      elm.textContent = Math.floor(p * end).toLocaleString("id-ID");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* =============================
     RENDER DATA
  ============================= */
  let currentPage = 1;
  const perPage = 5;

  function render() {
    const { tabel, riwayat, totalMasuk, totalKeluar, sisaSaldo } =
      hitungPeriode(periodeAktif);

    animate(el("totalMasuk"), totalMasuk);
    animate(el("totalKeluar"), totalKeluar);
    animate(el("sisaSaldo"), sisaSaldo);

    const tbody = el("tabelAnggota");
    tbody.innerHTML = "";
    tabel.forEach((a, i) => {
      tbody.innerHTML += `
        <tr>
          <td>${i + 1}</td>
          <td>${a.nama}</td>
          <td>${rupiahRibu(a.masuk)}</td>
          <td>${rupiahRibu(a.keluar)}</td>
          <td><strong>${rupiahRibu(a.saldo)}</strong></td>
        </tr>
      `;
    });

    renderRiwayat(riwayat);
  }

  function renderRiwayat(data) {
    const box = el("riwayat");
    box.innerHTML = "";

    const start = (currentPage - 1) * perPage;
    const items = data.slice(start, start + perPage);

    items.forEach(r => {
      box.innerHTML += `
        <div class="riwayat-item">
          <strong>${r.tanggal}</strong><br>
          ${r.kategori} – ${r.sumber}<br>
          <b>${r.tipe === "masuk" ? "+" : "-"}${Object.values(r.detail).reduce((a,b)=>a+b,0).toLocaleString("id-ID")}</b>
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
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
      pag.appendChild(b);
    }
  }

  periodeSelect.onchange = () => {
    periodeAktif = Number(periodeSelect.value);
    currentPage = 1;
    render();
  };

  render();

})();