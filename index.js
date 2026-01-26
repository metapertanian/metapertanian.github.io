/* ===============================
   UTIL
================================ */
const rupiah = n => Number(n || 0).toLocaleString("id-ID");

/* ===============================
   AMBIL SEMUA PANEN (AMAN)
================================ */
function ambilSemuaPanen() {
  const lahanList = [
    window.RISMA_FARM,
    window.UMI,
    window.UMI2,
    window.HORTI,
    window.PANGAN
  ].filter(l => l && l.musim);

  let semua = [];

  lahanList.forEach(lahan => {
    const namaLahan = lahan.nama || "Lahan Tidak Diketahui";

    Object.values(lahan.musim).forEach(musim => {
      if (!musim.panen) return;

      // 🔑 INI KUNCI UTAMANYA
      const daftarPanen = Array.isArray(musim.panen)
        ? musim.panen
        : Object.values(musim.panen);

      daftarPanen.forEach(p => {
        if (!p || !p.tanggal || !p.komoditas) return;

        semua.push({
          tanggal: p.tanggal,
          komoditas: String(p.komoditas).toUpperCase(),
          qty: Number(p.qty || 0),
          satuan: p.satuan || "kg",
          nilai: Number(p.nilai || 0),
          lahan: namaLahan
        });
      });
    });
  });

  console.log("✅ Total panen terbaca:", semua.length);
  return semua;
}

/* ===============================
   ANIMASI ANGKA
================================ */
function animateNumber(el, end, dur = 1200) {
  let start = 0;
  const t0 = performance.now();

  function step(t) {
    const p = Math.min((t - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = rupiah(Math.floor(eased * end));
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ===============================
   RINGKASAN TONASE
================================ */
function renderRingkasan(data) {
  const box = document.getElementById("ringkasanTonase");
  if (!box) return;

  box.innerHTML = "";

  if (!data.length) {
    box.innerHTML = "<small class='muted'>Belum ada data panen</small>";
    return;
  }

  const map = {};
  data.forEach(p => {
    map[p.komoditas] = (map[p.komoditas] || 0) + p.qty;
  });

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

function renderRiwayatPanen(data) {
  dataGlobal = [...data].sort(
    (a, b) => new Date(b.tanggal) - new Date(a.tanggal)
  );
  renderPagePanen(1);
}

function renderPagePanen(page) {
  const box = document.getElementById("riwayatPanen");
  const pag = document.getElementById("pagination");
  if (!box || !pag) return;

  box.innerHTML = "";
  pag.innerHTML = "";

  if (!dataGlobal.length) {
    box.innerHTML = "<small class='muted'>Belum ada riwayat panen</small>";
    return;
  }

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
    if (i === page) btn.classList.add("active");
    btn.onclick = () => renderPagePanen(i);
    pag.appendChild(btn);
  }
}

/* ===============================
   INIT
================================ */
const semuaPanen = ambilSemuaPanen();
renderRingkasan(semuaPanen);
renderRiwayatPanen(semuaPanen);