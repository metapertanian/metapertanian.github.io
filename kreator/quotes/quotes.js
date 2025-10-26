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
const cariInput = document.getElementById("cariInput");

let intervalHuruf = null;
let indexHuruf = 0;
let menghapus = false;
let jeda = false;
let teksAktif = "";

// =========================================================
// 🚀 Muat file JSON berdasarkan kategori/tema/subtema
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

    if (!data.kutipan || !Array.isArray(data.kutipan)) {
      throw new Error("Format JSON salah (tidak ada array 'kutipan')");
    }

    semuaQuotes = data.kutipan.sort(() => Math.random() - 0.5); // acak urutan
    currentQuoteIndex = 0;
    tampilkanKutipanHurufDemiHuruf(semuaQuotes[currentQuoteIndex]);
    tampilkanDaftarQuotes();
  } catch (e) {
    kutipanTeks.textContent = `⚠️ ${e.message}`;
    semuaQuotes = [];
    quoteList.innerHTML = "";
  }
}

// =========================================================
// 💬 Kutipan utama dengan animasi huruf demi huruf
// =========================================================
function tampilkanKutipanHurufDemiHuruf(teksBaru = null) {
  const el = kutipanTeks;
  clearInterval(intervalHuruf);

  if (!teksBaru) {
    teksAktif = semuaQuotes[currentQuoteIndex] || "";
  } else {
    teksAktif = teksBaru;
  }

  el.textContent = "";
  indexHuruf = 0;
  menghapus = false;

  intervalHuruf = setInterval(() => {
    if (jeda) return;

    if (!menghapus && indexHuruf < teksAktif.length) {
      el.textContent += teksAktif[indexHuruf++];
    } else if (!menghapus && indexHuruf >= teksAktif.length) {
      menghapus = true;
      clearInterval(intervalHuruf);
      setTimeout(() => hapusHurufDemiHuruf(), 2500);
    }
  }, 40);
}

function hapusHurufDemiHuruf() {
  const el = kutipanTeks;
  clearInterval(intervalHuruf);
  indexHuruf = teksAktif.length;

  intervalHuruf = setInterval(() => {
    if (jeda) return;

    if (indexHuruf > 0) {
      el.textContent = teksAktif.substring(0, --indexHuruf);
    } else {
      clearInterval(intervalHuruf);
      intervalHuruf = null;
      nextKutipan();
    }
  }, 25);
}

function nextKutipan() {
  if (semuaQuotes.length === 0) return;
  currentQuoteIndex = (currentQuoteIndex + 1) % semuaQuotes.length;
  tampilkanKutipanHurufDemiHuruf(semuaQuotes[currentQuoteIndex]);
}

function prevKutipan() {
  if (semuaQuotes.length === 0) return;
  currentQuoteIndex = (currentQuoteIndex - 1 + semuaQuotes.length) % semuaQuotes.length;
  tampilkanKutipanHurufDemiHuruf(semuaQuotes[currentQuoteIndex]);
}

function salinKutipan() {
  const text = kutipanTeks.textContent.trim();
  if (!text) return;
  navigator.clipboard.writeText(text);
  kutipanTeks.textContent = "✅ Disalin ke clipboard!";
  clearInterval(intervalHuruf);
  setTimeout(() => tampilkanKutipanHurufDemiHuruf(teksAktif), 1000);
}

// pause animasi saat disentuh
kutipanTeks.addEventListener("click", () => {
  jeda = !jeda;
  if (!jeda && intervalHuruf === null) tampilkanKutipanHurufDemiHuruf(teksAktif);
});

// =========================================================
// 📄 Pagination + Pencarian Interaktif
// =========================================================
function filterKutipan(keyword = "") {
  keyword = keyword.toLowerCase();
  const hasil = semuaQuotes.filter(q => q.toLowerCase().includes(keyword));
  halamanAktif = 1;
  tampilkanDaftarQuotes(hasil);

  // scroll ke bagian cari
  const el = document.getElementById("cariInput");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  el.focus();
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
      <button onclick="navigator.clipboard.writeText('${q.replace(/'/g, "\\'")}')">📋</button>
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