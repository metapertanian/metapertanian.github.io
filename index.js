/* ===============================
   BERTUNAS – index.js
   Portofolio panen lintas lahan
================================ */

// ================= DATA SOURCE =================
const allLahan = [
  window.rismafarm,
  window.umi,
  window.umi2
].filter(Boolean);

// ================= FLATTEN PANEN =================
const allPanen = allLahan.flatMap(lahan =>
  (lahan.panen || []).map(p => ({
    ...p,
    lahan: lahan.nama || "Lahan"
  }))
);

// ================= TOTAL PANEN PER KOMODITAS =================
function hitungTotalPanen() {
  const total = {};

  allPanen.forEach(p => {
    if (!total[p.komoditas]) {
      total[p.komoditas] = 0;
    }
    total[p.komoditas] += Number(p.qty || 0);
  });

  return total;
}

// ================= ANIMASI ANGKA =================
function animateValue(el, start, end, duration = 3000) {
  const range = end - start;
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.floor(start + range * progress);
    el.textContent = value.toLocaleString("id-ID");
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// ================= RENDER TOTAL PANEN =================
function renderTotalPanen() {
  const container = document.getElementById("totalPanen");
  const total = hitungTotalPanen();

  container.innerHTML = "";

  Object.entries(total).forEach(([komoditas, qty]) => {
    const card = document.createElement("div");
    card.className = "card stat";

    card.innerHTML = `
      <h3>${komoditas}</h3>
      <div class="stat-value">0</div>
      <small>kg</small>
    `;

    container.appendChild(card);

    const valueEl = card.querySelector(".stat-value");
    animateValue(valueEl, 0, qty);
  });
}

// ================= RIWAYAT PANEN =================
const ITEMS_PER_PAGE = 5;
let currentPage = 1;

function getSortedPanen() {
  return [...allPanen].sort(
    (a, b) => new Date(b.tanggal) - new Date(a.tanggal)
  );
}

function renderRiwayat(page = 1) {
  const container = document.getElementById("riwayatPanen");
  const data = getSortedPanen();

  const start = (page - 1) * ITEMS_PER_PAGE;
  const sliced = data.slice(start, start + ITEMS_PER_PAGE);

  container.innerHTML = "";

  sliced.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <strong>📆 ${formatTanggal(p.tanggal)}</strong>
      <p>🌱 ${p.komoditas}</p>
      <p>⚖️ ${p.qty.toLocaleString("id-ID")} ${p.satuan || "kg"}</p>
      <small>${p.lahan}</small>
    `;

    container.appendChild(card);
  });

  renderPagination(data.length);
}

// ================= PAGINATION =================
function renderPagination(totalItems) {
  const pageCount = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const container = document.getElementById("pagination");

  container.innerHTML = "";

  for (let i = 1; i <= pageCount; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = i === currentPage ? "active" : "";

    btn.onclick = () => {
      currentPage = i;
      renderRiwayat(i);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    container.appendChild(btn);
  }
}

// ================= UTIL =================
function formatTanggal(dateStr) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

// ================= INIT =================
renderTotalPanen();
renderRiwayat();