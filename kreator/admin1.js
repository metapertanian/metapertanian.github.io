// =========================================================
// 🧩 ADMIN1.JS - Fungsi utama dan tampilan umum
// =========================================================

// =================== Tema Terang & Gelap ===================
function toggleTheme() {
  document.body.classList.toggle("dark-theme");
  const isDark = document.body.classList.contains("dark-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateThemeIcon(isDark);
}

function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  const isDark = savedTheme === "dark";
  document.body.classList.toggle("dark-theme", isDark);
  updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
  const themeIcon = document.getElementById("themeIcon");
  if (themeIcon) themeIcon.textContent = isDark ? "🌙" : "☀️";
}

document.addEventListener("DOMContentLoaded", loadTheme);

// =================== Navigasi Halaman ===================
function bukaHalaman(idHalaman) {
  const halaman = document.querySelectorAll(".halaman");
  halaman.forEach((el) => el.classList.add("hidden"));

  const target = document.getElementById(idHalaman);
  if (target) target.classList.remove("hidden");
}

// =================== Kode Akses Admin (pro95) ===================
function bukaAksesAdmin() {
  const kode = prompt("Masukkan kode akses admin:");
  if (kode === "pro95") {
    localStorage.setItem("isAdmin", "true");
    alert("✅ Akses admin berhasil dibuka!");
    window.location.href = "admin.html";
  } else {
    alert("❌ Kode salah! Coba lagi.");
  }
}

function logoutAdmin() {
  localStorage.removeItem("isAdmin");
  alert("Anda telah keluar dari mode admin.");
  window.location.href = "index.html";
}

// =================== Elemen Dinamis ===================
function tampilkanPesanUtama() {
  const pesan = document.getElementById("pesanUtama");
  const waktu = new Date().getHours();
  let ucapan = "";

  if (waktu < 10) ucapan = "Selamat pagi 🌤️";
  else if (waktu < 15) ucapan = "Selamat siang ☀️";
  else if (waktu < 18) ucapan = "Selamat sore 🌇";
  else ucapan = "Selamat malam 🌙";

  pesan.textContent = ucapan + " Kreator Tanjung Bulan!";
}

document.addEventListener("DOMContentLoaded", tampilkanPesanUtama);

// =================== Poin & Tampilan ===================
let pesertaList = JSON.parse(localStorage.getItem("pesertaList")) || [];

function renderKartuPeserta() {
  const container = document.getElementById("kartuContainer");
  if (!container) return;

  container.innerHTML = "";

  pesertaList.forEach((peserta) => {
    // jika tampilkanPoin false → tetap dianggap true
    const showPoin = peserta.tampilkanPoin !== false;

    const poinViral =
      peserta.poinViralLocked === true
        ? "⚠️ poin viral belum dihitung"
        : formatRupiah(peserta.poinUtama + peserta.poinViral);

    const kartu = document.createElement("div");
    kartu.className = "kartu-peserta";

    kartu.innerHTML = `
      <h3>${peserta.nama}</h3>
      <p>Kategori: ${peserta.kategori}</p>
      ${
        showPoin
          ? `<p class="poin">${poinViral}</p>`
          : `<p class="poin">Poin disembunyikan</p>`
      }
    `;

    container.appendChild(kartu);
  });
}

document.addEventListener("DOMContentLoaded", renderKartuPeserta);

// =================== Utilitas Umum ===================
function formatRupiah(num) {
  return "Rp " + num.toLocaleString("id-ID");
}

// =================== Efek Animasi ===================
function animasiNilai(idElemen, nilaiAkhir) {
  const elemen = document.getElementById(idElemen);
  if (!elemen) return;

  let nilaiSekarang = 0;
  const durasi = 3000;
  const langkah = Math.ceil(nilaiAkhir / (durasi / 30));

  const interval = setInterval(() => {
    nilaiSekarang += langkah;
    if (nilaiSekarang >= nilaiAkhir) {
      nilaiSekarang = nilaiAkhir;
      clearInterval(interval);
    }
    elemen.textContent = formatRupiah(nilaiSekarang);
  }, 30);
}

// =================== Penutup ===================
console.log("✅ admin1.js siap digunakan");