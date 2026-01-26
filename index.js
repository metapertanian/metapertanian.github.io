/* ===============================
   UTIL
================================ */
const rupiah = n => Number(n || 0).toLocaleString("id-ID");

/* ===============================
   AMBIL SEMUA PANEN
================================ */
function ambilSemuaPanen() {
  const lahanList = [
    window.RISMA_FARM,
    window.UMI,
    window.UMI2,
    window.HORTI,
    window.PANGAN
  ].filter(Boolean);

  let semua = [];

  lahanList.forEach(lahan => {
    Object.values(lahan.musim || {}).forEach(musim => {
      (musim.panen || []).forEach(p => {
        semua.push({
          tanggal: p.tanggal,
          komoditas: p.komoditas,
          qty: Number(p.qty || 0),
          satuan: p.satuan || "kg",
          nilai: Number(p.nilai || 0),
          lahan: lahan.nama
        });
      });
    });
  });

  return semua;
}

/* ===============================
   ANIMASI ANGKA HALUS
================================ */
function animateNumber(el, end, dur = 1200) {
  let start = 0;
  const t0 = performance.now();

  function step(t) {
    const p = Math.min((t - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.floor(eased * end);
    el.textContent = rupiah(val);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ===============================
   RINGKASAN TONASE PER KOMODITAS
================================ */
function renderRingkasan(data) {
  const map = {};

  data.forEach(p => {
    map[p.komoditas] = (map[p.komoditas] || 0) + p.qty;
  });

  const box = document.getElementById("ringkasanTonase");
  box.innerHTML = "";

  Object.entries(map).forEach(([komoditas, total]) => {
    const card = document.createElement("div");
    card.className = "card center";
    card.innerHTML = `
      <h3>${komoditas}</h3>
      <div class="big-number success">0</div>
      <small>Total Panen (kg)</small>
    `;
    box.appendChild(card);
    animateNumber(card.querySelector(".big-number"), total);
  });
}

/* ===============================
   RIWAYAT PANEN + PAGINATION
================================ */
const PER_PAGE = 5;
let dataGlobal = [];

function renderRiwayat(data) {
  dataGlobal = data.sort(
    (a, b) => new Date(b.tanggal) - new Date(a.tanggal)
  );
  renderPage(1);
}

function renderPage(page) {
  const box = document.getElementById("riwayatPanen");
  const pag = document.getElementById("pagination");
  box.innerHTML = "";
  pag.innerHTML = "";

  const start = (page - 1) * PER_PAGE;
  const slice = dataGlobal.slice(start, start + PER_PAGE);

  slice.forEach(p => {
    const div = document.createElement("div");
    div.className = "panen-card";
    div.innerHTML = `
      <div>
        <strong>${p.komoditas}</strong>
        <div class="muted">
          📆 ${p.tanggal} · ${p.qty} ${p.satuan} · ${p.lahan}
        </div>
      </div>
      <div class="nilai success">
        Rp ${rupiah(p.nilai)}
      </div>
    `;
    box.appendChild(div);
  });

  const totalPage = Math.ceil(dataGlobal.length / PER_PAGE);
  for (let i = 1; i <= totalPage; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = i === page ? "active" : "";
    btn.onclick = () => renderPage(i);
    pag.appendChild(btn);
  }
}

/* ===============================
   INIT
================================ */
const semuaPanen = ambilSemuaPanen();
renderRingkasan(semuaPanen);
renderRiwayat(semuaPanen);