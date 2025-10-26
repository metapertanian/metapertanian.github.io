// =========================================================
// 💬 QUOTES VIEWER INTERAKTIF - Rumah Kreator
// =========================================================

const kutipanTeks = document.getElementById("kutipanTeks");
const quoteListEl = document.getElementById("quoteList");
const paginationEl = document.getElementById("pagination");
const kategoriSelect = document.getElementById("kategoriSelect");
const temaSelect = document.getElementById("temaSelect");
const subtemaSelect = document.getElementById("subtemaSelect");

let semuaKutipan = [];
let indexKutipan = 0;
let halamanSaatIni = 1;
const jumlahPerHalaman = 5;

// =========================================================
// 📁 Struktur Kategori (Contoh)
const struktur = {
  motivasi: {
    "mulai-sekarang": ["berhenti-menunda", "percaya-diri", "disiplin"]
  },
  persahabatan: {
    "teman-sejati": ["setia", "percaya"]
  }
};

// =========================================================
// 🧭 Dropdown Logic
function isiDropdown() {
  kategoriSelect.innerHTML = Object.keys(struktur)
    .map(k => `<option value="${k}">${k.replace(/-/g, " ")}</option>`)
    .join("");
  updateTema();
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
  muatKutipan();
}

// =========================================================
// 📂 Muat File JSON
async function muatKutipan() {
  semuaKutipan = [];
  const kategori = kategoriSelect.value;
  const tema = temaSelect.value;
  const subtema = subtemaSelect.value;
  const path = `/kreator/qoutes/${kategori}/${tema}/${subtema}.json`;

  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error("File tidak ditemukan");
    const data = await res.json();
    semuaKutipan = data.sort(() => Math.random() - 0.5);
    indexKutipan = 0;
    tampilkanKutipanUtama();
    tampilkanKutipanList();
  } catch (err) {
    quoteListEl.innerHTML = `<p style="text-align:center;color:red;">⚠️ Gagal memuat kutipan (${err.message})</p>`;
  }
}

// =========================================================
// 🎬 Tampilkan Kutipan Utama
function tampilkanKutipanUtama() {
  if (semuaKutipan.length === 0) {
    kutipanTeks.textContent = "Tidak ada kutipan ditemukan.";
    return;
  }
  kutipanTeks.textContent = `“${semuaKutipan[indexKutipan]}”`;
}

function nextKutipan() {
  indexKutipan = (indexKutipan + 1) % semuaKutipan.length;
  tampilkanKutipanUtama();
}

function prevKutipan() {
  indexKutipan = (indexKutipan - 1 + semuaKutipan.length) % semuaKutipan.length;
  tampilkanKutipanUtama();
}

function salinKutipan() {
  const teks = kutipanTeks.textContent.replace(/[“”]/g, "").trim();
  navigator.clipboard.writeText(teks);
  alert("Kutipan disalin ke clipboard!");
}

// =========================================================
// 📜 Daftar Kutipan + Pagination
function tampilkanKutipanList() {
  const mulai = (halamanSaatIni - 1) * jumlahPerHalaman;
  const selesai = mulai + jumlahPerHalaman;
  const halamanKutipan = semuaKutipan.slice(mulai, selesai);

  quoteListEl.innerHTML = halamanKutipan
    .map(q => `<div class="quote-card">“${q}”</div>`)
    .join("");

  buatPagination();
}

function buatPagination() {
  const totalHalaman = Math.ceil(semuaKutipan.length / jumlahPerHalaman);
  paginationEl.innerHTML = "";
  for (let i = 1; i <= totalHalaman; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.onclick = () => {
      halamanSaatIni = i;
      tampilkanKutipanList();
    };
    if (i === halamanSaatIni) btn.style.background = "var(--highlight)";
    paginationEl.appendChild(btn);
  }
}

// =========================================================
// 🔍 Pencarian
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
// 🚀 Inisialisasi
window.addEventListener("DOMContentLoaded", () => {
  isiDropdown();
  kategoriSelect.onchange = updateTema;
  temaSelect.onchange = updateSubtema;
  subtemaSelect.onchange = muatKutipan;
  muatKutipan();
});