}

function updateTema() {
  const kategori = kategoriSelect.value;
  const temaList = struktur[kategori] || {};
  temaSelect.innerHTML = Object.keys(temaList)
    .map(t => `<option value="${t}">${t.replace(/-/g, " ")}</option>`)
    .join("");
  updateSubtema();
}

function updateSubtema() {
  const kategori = kategoriSelect.value;
  const tema = temaSelect.value;
  const subtemaList = struktur[kategori]?.[tema] || [];
  subtemaSelect.innerHTML = subtemaList
    .map(s => `<option value="${s}">${s.replace(/-/g, " ")}</option>`)
    .join("");
  muatSemuaKutipan();
}

// =========================================================
// 📂 Muat Semua JSON dari subtema dalam tema
// =========================================================
async function muatSemuaKutipan() {
  semuaKutipan = [];
  const kategori = kategoriSelect.value;
  const tema = temaSelect.value;
  const subtema = subtemaSelect.value;

  const path = `/kreator/quote/${kategori}/${tema}/${subtema}.json`;

  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error("File tidak ditemukan");
    const data = await res.json();
    semuaKutipan = data.sort(() => Math.random() - 0.5);
    tampilkanKutipan();
    tampilkanKutipanAcak();
  } catch (err) {
    quoteListEl.innerHTML = `<p style="text-align:center;color:red;">⚠️ Gagal memuat kutipan (${err.message})</p>`;
  }
}

// =========================================================
// 💬 Tampilkan Kutipan dengan Pagination
// =========================================================
function tampilkanKutipan() {
  const mulai = (halamanSaatIni - 1) * jumlahPerHalaman;
  const selesai = mulai + jumlahPerHalaman;
  const halamanKutipan = semuaKutipan.slice(mulai, selesai);

  quoteListEl.innerHTML = halamanKutipan
    .map(q => `<div class="quote-card">“${q}”</div>`)
    .join("");

  buatPagination();
}

// =========================================================
// 📄 Pagination Buttons
// =========================================================
function buatPagination() {
  const totalHalaman = Math.ceil(semuaKutipan.length / jumlahPerHalaman);
  paginationEl.innerHTML = "";

  for (let i = 1; i <= totalHalaman; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.onclick = () => {
      halamanSaatIni = i;
      tampilkanKutipan();
    };
    if (i === halamanSaatIni) btn.style.background = "var(--highlight)";
    paginationEl.appendChild(btn);
  }
}

// =========================================================
// 🔍 Cari Kutipan
// =========================================================
function filterKutipan(keyword) {
  const cards = document.querySelectorAll(".quote-card");
  keyword = keyword.toLowerCase();
  cards.forEach(card => {
    card.style.display = card.textContent.toLowerCase().includes(keyword)
      ? "block"
      : "none";
  });
}

// =========================================================
// 🎲 Kutipan Acak + Salin
// =========================================================
function tampilkanKutipanAcak() {
  if (semuaKutipan.length === 0) return;
  const random = semuaKutipan[Math.floor(Math.random() * semuaKutipan.length)];
  kutipanAcakEl.firstChild.textContent = `“${random}”`;
}
function salinKutipan() {
  const teks = kutipanAcakEl.textContent.replace("Salin", "").trim();
  navigator.clipboard.writeText(teks);
  alert("Kutipan disalin ke clipboard!");
}

// =========================================================
// 🚀 Jalankan
// =========================================================
window.addEventListener("DOMContentLoaded", () => {
  isiDropdown();
  kategoriSelect.onchange = updateTema;
  temaSelect.onchange = updateSubtema;
  subtemaSelect.onchange = muatSemuaKutipan;
  muatSemuaKutipan();
});
