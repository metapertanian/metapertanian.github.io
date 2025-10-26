// =========================================================
// 📜 Quotes.js — untuk /kreator/quotes/
// =========================================================

let semuaQuotes = [];
let halamanAktif = 1;
const perHalaman = 5;
let currentQuoteIndex = 0;

const kategoriSelect = document.getElementById("kategoriSelect");
const temaSelect = document.getElementById("temaSelect");
const subtemaSelect = document.getElementById("subtemaSelect");
const quoteList = document.getElementById("quoteList");
const pagination = document.getElementById("pagination");
const kutipanTeks = document.getElementById("kutipanTeks");

// =========================================================
// 🚀 Fungsi untuk memuat file JSON
// =========================================================
async function loadQuotes() {
  const kategori = kategoriSelect.value || "motivasi";
  const tema = temaSelect.value || "mulai-sekarang";
  const subtema = subtemaSelect.value || "berhenti-menunda";
  const path = `/kreator/quotes/${kategori}/${tema}/${subtema}.json`;

  kutipanTeks.textContent = "⏳ Memuat kutipan...";
  quoteList.innerHTML = "";

  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error("File tidak ditemukan");
    const data = await res.json();

    // pastikan formatnya seperti yang kamu kirim
    if (!data.kutipan || !Array.isArray(data.kutipan)) {
      throw new Error("Format JSON salah (tidak ada array 'kutipan')");
    }

    semuaQuotes = data.kutipan;
    currentQuoteIndex = 0;
    tampilkanKutipanUtama();
    tampilkanDaftarQuotes();
  } catch (e) {
    kutipanTeks.textContent = `⚠️ ${e.message}`;
    semuaQuotes = [];
    quoteList.innerHTML = "";
  }
}

// =========================================================
// 💬 Kutipan utama
// =========================================================
function tampilkanKutipanUtama() {
  if (semuaQuotes.length === 0) {
    kutipanTeks.textContent = "Tidak ada kutipan ditemukan.";
    return;
  }
  kutipanTeks.textContent = semuaQuotes[currentQuoteIndex];
}

function nextKutipan() {
  if (semuaQuotes.length === 0) return;
  currentQuoteIndex = (currentQuoteIndex + 1) % semuaQuotes.length;
  tampilkanKutipanUtama();
}

function prevKutipan() {
  if (semuaQuotes.length === 0) return;
  currentQuoteIndex = (currentQuoteIndex - 1 + semuaQuotes.length) % semuaQuotes.length;
  tampilkanKutipanUtama();
}

function salinKutipan() {
  const text = kutipanTeks.textContent.trim();
  if (!text) return;
  navigator.clipboard.writeText(text);
  kutipanTeks.textContent = "✅ Disalin ke clipboard!";
  setTimeout(() => tampilkanKutipanUtama(), 1000);
}

// =========================================================
// 📄 Pagination + pencarian
// =========================================================
function filterKutipan(keyword = "") {
  keyword = keyword.toLowerCase();
  const hasil = semuaQuotes.filter(q => q.toLowerCase().includes(keyword));
  tampilkanDaftarQuotes(hasil);
}

function tampilkanDaftarQuotes(data = semuaQuotes) {
  quoteList.innerHTML = "";
  pagination.innerHTML = "";

  if (data.length === 0) {
    quoteList.innerHTML = "<p style='text-align:center;color:var(--highlight)'>Tidak ada hasil ditemukan.</p>";
    return;
  }

  const totalHalaman = Math.ceil(data.length / perHalaman);
  const start = (halamanAktif - 1) * perHalaman;
  const halamanData = data.slice(start, start + perHalaman);

  halamanData.forEach(q => {
    const card = document.createElement("div");
    card.className = "quote-card";
    card.innerHTML = `
      <p>${q}</p>
      <button onclick="navigator.clipboard.writeText('${q.replace(/'/g, "\\'")}')">📋 Salin</button>
    `;
    quoteList.appendChild(card);
  });

  for (let i = 1; i <= totalHalaman; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === halamanAktif) btn.style.background = "var(--highlight)";
    btn.onclick = () => {
      halamanAktif = i;
      tampilkanDaftarQuotes(data);
    };
    pagination.appendChild(btn);
  }
}

// =========================================================
// 🧭 Dropdown Listener
// =========================================================
[kategoriSelect, temaSelect, subtemaSelect].forEach(sel =>
  sel.addEventListener("change", () => {
    halamanAktif = 1;
    loadQuotes();
  })
);

window.addEventListener("DOMContentLoaded", loadQuotes);