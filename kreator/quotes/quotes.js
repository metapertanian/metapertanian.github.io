// =========================================================
// 📜 Quotes.js — untuk /kreator/quotes/
// =========================================================

let semuaQuotes = [];
let halamanAktif = 1;
const perHalaman = 5;
let currentQuoteIndex = 0;
let intervalHuruf = null;
let menghapus = false;
let jeda = false;
let teksAktif = "";

// Elemen
const kategoriSelect = document.getElementById("kategoriSelect");
const temaSelect = document.getElementById("temaSelect");
const subtemaSelect = document.getElementById("subtemaSelect");
const quoteList = document.getElementById("quoteList");
const pagination = document.getElementById("pagination");
const kutipanTeks = document.getElementById("kutipanTeks");
const cariInput = document.getElementById("cariInput");

// =========================================================
// 🧭 Baca struktur folder otomatis
// =========================================================
async function loadDropdown() {
  try {
    // ambil daftar folder kategori
    const kategoriRes = await fetch("/kreator/quotes/index.json");
    if (!kategoriRes.ok) throw new Error("Gagal membaca daftar kategori");
    const struktur = await kategoriRes.json();

    kategoriSelect.innerHTML = `<option value="">Pilih Kategori</option>`;
    Object.keys(struktur).forEach(kat => {
      const opt = document.createElement("option");
      opt.value = kat;
      opt.textContent = kat;
      kategoriSelect.appendChild(opt);
    });

    kategoriSelect.onchange = () => {
      temaSelect.innerHTML = `<option value="">Pilih Tema</option>`;
      subtemaSelect.innerHTML = `<option value="">Pilih Subtema</option>`;
      const temaData = struktur[kategoriSelect.value];
      if (temaData) {
        Object.keys(temaData).forEach(t => {
          const opt = document.createElement("option");
          opt.value = t;
          opt.textContent = t.replace(/-/g, " ");
          temaSelect.appendChild(opt);
        });
      }
    };

    temaSelect.onchange = () => {
      subtemaSelect.innerHTML = `<option value="">Pilih Subtema</option>`;
      const subtemaData = struktur[kategoriSelect.value]?.[temaSelect.value];
      if (subtemaData) {
        subtemaData.forEach(st => {
          const opt = document.createElement("option");
          opt.value = st;
          opt.textContent = st.replace(/-/g, " ");
          subtemaSelect.appendChild(opt);
        });
      }
    };

    subtemaSelect.onchange = () => {
      halamanAktif = 1;
      loadQuotes();
    };
  } catch (e) {
    console.warn("⚠️ Tidak dapat memuat dropdown otomatis:", e);
  }
}

// =========================================================
// 🚀 Muat file JSON
// =========================================================
async function loadQuotes() {
  const kategori = kategoriSelect.value;
  const tema = temaSelect.value;
  const subtema = subtemaSelect.value;
  if (!kategori || !tema || !subtema) {
    kutipanTeks.textContent = "📂 Pilih kategori, tema, dan subtema terlebih dahulu.";
    return;
  }

  const path = `/kreator/quotes/${kategori}/${tema}/${subtema}.json`;
  kutipanTeks.textContent = "⏳ Memuat kutipan...";
  quoteList.innerHTML = "";

  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error("File tidak ditemukan");
    const data = await res.json();
    if (!data.kutipan || !Array.isArray(data.kutipan)) throw new Error("Format JSON salah");

    semuaQuotes = data.kutipan;
    currentQuoteIndex = 0;
    tampilkanKutipanHurufDemiHuruf();
    tampilkanDaftarQuotes();
  } catch (e) {
    kutipanTeks.textContent = `⚠️ ${e.message}`;
    semuaQuotes = [];
    quoteList.innerHTML = "";
  }
}

// =========================================================
// ✍️ Efek mengetik dan menghapus huruf demi huruf
// =========================================================
function tampilkanKutipanHurufDemiHuruf(teksBaru = null) {
  clearInterval(intervalHuruf);

  if (!teksBaru) teksAktif = semuaQuotes[currentQuoteIndex] || "";
  else teksAktif = teksBaru;

  kutipanTeks.textContent = "";
  let i = 0;
  menghapus = false;
  intervalHuruf = setInterval(() => {
    if (jeda) return;
    if (!menghapus && i < teksAktif.length) {
      kutipanTeks.textContent += teksAktif[i++];
    } else if (!menghapus && i >= teksAktif.length) {
      menghapus = true;
      clearInterval(intervalHuruf);
      setTimeout(() => hapusHurufDemiHuruf(), 2500);
    }
  }, 40);
}

function hapusHurufDemiHuruf() {
  clearInterval(intervalHuruf);
  let i = teksAktif.length;
  intervalHuruf = setInterval(() => {
    if (jeda) return;
    if (i > 0) {
      kutipanTeks.textContent = teksAktif.substring(0, --i);
    } else {
      clearInterval(intervalHuruf);
      setTimeout(() => nextKutipan(), 500);
    }
  }, 30);
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
  setTimeout(() => tampilkanKutipanHurufDemiHuruf(), 1000);
}

kutipanTeks.addEventListener("click", () => {
  jeda = !jeda;
  if (!jeda) hapusHurufDemiHuruf();
});

// =========================================================
// 📄 Pagination + Pencarian
// =========================================================
function filterKutipan(keyword = "") {
  keyword = keyword.toLowerCase();
  const hasil = semuaQuotes.filter(q => q.toLowerCase().includes(keyword));
  tampilkanDaftarQuotes(hasil);

  // scroll ke bawah navbar agar fokus ke hasil
  const cariBox = document.getElementById("cariInput");
  const y = cariBox.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top: y, behavior: "smooth" });
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
// 🚀 Inisialisasi
// =========================================================
window.addEventListener("DOMContentLoaded", () => {
  loadDropdown(); // muat daftar kategori-tema-subtema
});