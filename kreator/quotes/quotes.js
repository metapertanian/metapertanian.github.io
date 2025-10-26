// =========================================================
// 💬 Pemanggil Kutipan Berdasarkan Kategori / Tema / Subtema
// =========================================================

const basePath = "/kreator/quotes"; // 🟢 Perbaikan path
let semuaKutipan = [];
let halamanAktif = 1;
const perHalaman = 5;

// 🎯 Inisialisasi utama
window.addEventListener("DOMContentLoaded", () => {
  tampilkanTahun();
  setupEventHandlers();
  tampilkanKutipanAcak();
});

// =========================================================
// 🧩 Event & Interaksi
// =========================================================

function setupEventHandlers() {
  const kategoriSelect = document.getElementById("kategori");
  const temaSelect = document.getElementById("tema");
  const subtemaSelect = document.getElementById("subtema");
  const cariInput = document.getElementById("cariKutipan");

  // ubah tema/subtema setiap dropdown berubah
  kategoriSelect.addEventListener("change", muatKutipan);
  temaSelect.addEventListener("change", muatKutipan);
  subtemaSelect.addEventListener("change", muatKutipan);

  // pencarian kutipan
  cariInput.addEventListener("input", () => tampilkanKutipan(semuaKutipan));
}

// =========================================================
// 📁 Ambil kutipan dari file JSON
// =========================================================
async function muatKutipan() {
  const kategori = document.getElementById("kategori").value.trim().toLowerCase();
  const tema = document.getElementById("tema").value.trim().toLowerCase().replace(/\s+/g, "-");
  const subtema = document.getElementById("subtema").value.trim().toLowerCase().replace(/\s+/g, "-");
  const pesanStatus = document.getElementById("pesanStatus");

  const path = `${basePath}/${kategori}/${tema}/${subtema}.json`;
  pesanStatus.textContent = "⏳ Memuat kutipan...";
  pesanStatus.style.color = "gray";

  try {
    const res = await fetch(`${path}?v=${Date.now()}`);
    if (!res.ok) throw new Error("File tidak ditemukan");
    semuaKutipan = await res.json();

    if (!Array.isArray(semuaKutipan) || semuaKutipan.length === 0) {
      throw new Error("File kosong atau format tidak valid");
    }

    shuffleArray(semuaKutipan);
    halamanAktif = 1;
    tampilkanKutipan(semuaKutipan);
    pesanStatus.textContent = "";
  } catch (err) {
    semuaKutipan = [];
    tampilkanKutipan([]);
    pesanStatus.textContent = `⚠️ Gagal memuat kutipan (${err.message})`;
    pesanStatus.style.color = "red";
  }
}

// =========================================================
// 📄 Tampilkan kutipan acak di atas (seperti di beranda)
// =========================================================
function tampilkanKutipanAcak() {
  const kutipanEl = document.getElementById("kutipanUtama");
  const btnSalin = document.getElementById("salinKutipan");

  if (!kutipanEl) return;

  const pesanDefault = "Memuat kutipan inspiratif...";
  kutipanEl.textContent = pesanDefault;

  btnSalin.addEventListener("click", () => {
    navigator.clipboard.writeText(kutipanEl.textContent.trim());
    btnSalin.textContent = "✅ Disalin!";
    setTimeout(() => (btnSalin.textContent = "Salin"), 1500);
  });

  // tampilkan kutipan acak dari data terakhir dimuat
  setInterval(() => {
    if (semuaKutipan.length > 0) {
      const random = semuaKutipan[Math.floor(Math.random() * semuaKutipan.length)];
      kutipanEl.textContent = random;
    }
  }, 6000);
}

// =========================================================
// 📃 Tampilkan daftar kutipan (5 per halaman)
// =========================================================
function tampilkanKutipan(data) {
  const container = document.getElementById("daftarKutipan");
  const cari = document.getElementById("cariKutipan").value.trim().toLowerCase();

  const hasil = data.filter(q => q.toLowerCase().includes(cari));
  const totalHalaman = Math.ceil(hasil.length / perHalaman);
  const awal = (halamanAktif - 1) * perHalaman;
  const tampil = hasil.slice(awal, awal + perHalaman);

  if (hasil.length === 0) {
    container.innerHTML = "<p style='text-align:center;color:gray;'>Tidak ada kutipan ditemukan.</p>";
    document.getElementById("pagination").innerHTML = "";
    return;
  }

  container.innerHTML = tampil.map(q => `
    <div class="quote-card">
      <p>${q}</p>
      <button onclick="salinKutipanTeks('${encodeURIComponent(q)}')">Salin</button>
    </div>
  `).join("");

  let htmlPag = "";
  for (let i = 1; i <= totalHalaman; i++) {
    htmlPag += `<button class="page-btn ${i === halamanAktif ? "active" : ""}" onclick="gantiHalaman(${i})">${i}</button>`;
  }
  document.getElementById("pagination").innerHTML = htmlPag;
}

function gantiHalaman(hal) {
  halamanAktif = hal;
  tampilkanKutipan(semuaKutipan);
}

function salinKutipanTeks(teks) {
  navigator.clipboard.writeText(decodeURIComponent(teks));
  alert("✅ Kutipan disalin!");
}

// =========================================================
// 🌀 Utilitas
// =========================================================
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function tampilkanTahun() {
  const el = document.getElementById("tahun");
  if (el) el.textContent = new Date().getFullYear();
}