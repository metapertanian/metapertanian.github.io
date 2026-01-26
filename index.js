/* ===============================
   UTIL
================================ */
const rupiah = n => Number(n || 0).toLocaleString("id-ID");

/* ===============================
   AMBIL SEMUA PANEN (AMAN)
================================ */
function ambilSemuaPanen() {
  const kandidat = [
    typeof RISMA_FARM !== "undefined" ? RISMA_FARM : null,
    typeof UMI !== "undefined" ? UMI : null,
    typeof UMI2 !== "undefined" ? UMI2 : null,
    typeof HORTI !== "undefined" ? HORTI : null,
    typeof PANGAN !== "undefined" ? PANGAN : null
  ].filter(l => l && l.musim);

  let semua = [];

  kandidat.forEach(lahan => {
    const namaLahan = lahan.nama || "LAHAN";

    Object.values(lahan.musim).forEach(musim => {
      if (!Array.isArray(musim.panen)) return;

      musim.panen.forEach(p => {
        semua.push({
          tanggal: p.tanggal,
          komoditas: p.komoditas,
          qty: Number(p.qty || 0),
          satuan: p.satuan || "kg",
          nilai: Number(p.nilai || 0),
          bukti: p.bukti || null,
          lahan: namaLahan
        });
      });
    });
  });

  console.log("✅ PANEN TERBACA:", semua);
  return semua;
}

/* ===============================
   ANIMASI ANGKA HALUS
================================ */
function animateNumber(el, end, dur = 1400) {
  if (!el) return;

  // 🔥 Paksa posisi tengah (override CSS lama)
  el.style.display = "flex";
  el.style.justifyContent = "center";
  el.style.alignItems = "center";
  el.style.textAlign = "center";
  el.style.width = "100%";

  el.style.opacity = 1;
  el.style.transform = "none";
  el.style.visibility = "visible";

  const startTime = performance.now();

  function frame(now) {
    const progress = Math.min((now - startTime) / dur, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = rupiah(Math.floor(eased * end));

    if (progress < 1) requestAnimationFrame(frame);
  }

  el.textContent = "0";
  requestAnimationFrame(frame);
}

/* ===============================
   RINGKASAN TONASE PER KOMODITAS
================================ */
function renderRingkasan(data) {
  const map = {};

  data.forEach(p => {
    if (!p.komoditas) return;
    map[p.komoditas] = (map[p.komoditas] || 0) + p.qty;
  });

  const box = document.getElementById("ringkasanTonase");
  if (!box) return;
  box.innerHTML = "";

  Object.entries(map).forEach(([komoditas, total], i) => {
    const card = document.createElement("div");
    card.className = "card center";

    card.innerHTML = `
  <h3>${komoditas}</h3>
  <div class="big-number success">0</div>
  <small>Total Panen (kg)</small>
`;

    box.appendChild(card);

    const angka = card.querySelector(".big-number");

    setTimeout(() => {
      animateNumber(angka, total);
    }, 400 + i * 500);
  });
}

/* Klik Tampilkan Thumb */

function showImage(src) {
  if (!src) return;

  const overlay = document.createElement("div");
  overlay.style = `
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.8);
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:9999;
  `;

  overlay.innerHTML = `
    <img src="${src}" 
         style="
           max-width:90%;
           max-height:90%;
           border-radius:12px;
           box-shadow:0 10px 30px rgba(0,0,0,.6)
         ">
  `;

  overlay.onclick = () => overlay.remove();
  document.body.appendChild(overlay);
}


/* ===============================
   RIWAYAT PANEN (REUSE CSS RISMA FARM)
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
    box.innerHTML = `<small class="muted">Belum ada data panen</small>`;
    return;
  }

  const start = (page - 1) * PER_PAGE;
  const slice = dataGlobal.slice(start, start + PER_PAGE);

  slice.forEach(p => {
    box.innerHTML += `
      <div class="riwayat-item">

        <div class="riwayat-thumb ${p.bukti ? "" : "empty"}">
          ${
            p.bukti
              ? `<img
                    src="${p.bukti}"
                    class="bukti-img"
                    loading="lazy"
                    onclick="showImage(this.src)"
                 >`
              : `<span class="no-photo">NO FOTO</span>`
          }
        </div>

        <div>
          <div class="riwayat-date success" style="opacity:.65;font-size:13px">
            📅 ${p.tanggal}
          </div>

          <div class="riwayat-title">
            ${p.komoditas}
          </div>

          <div class="riwayat-detail">
            ${p.qty} ${p.satuan} · ${p.lahan}
          </div>

          <div class="riwayat-value success">
            Rp ${rupiah(p.nilai)}
          </div>
        </div>

      </div>
    `;
  });



  const totalPage = Math.ceil(dataGlobal.length / PER_PAGE);
  for (let i = 1; i <= totalPage; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = i === page ? "active" : "";
    btn.onclick = () => renderPagePanen(i);
    pag.appendChild(btn);
  }
}

/* ===============================
   INIT
================================ */
document.addEventListener("DOMContentLoaded", () => {
  const semuaPanen = ambilSemuaPanen();
  renderRingkasan(semuaPanen);
  renderRiwayatPanen(semuaPanen);
});