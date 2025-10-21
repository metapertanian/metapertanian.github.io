// =========================================================
// 🧩 ADMIN1.JS – Tampilan, Tema, Kutipan, & Proteksi Akses
// =========================================================

// ===================== 🔒 AKSES ADMIN =====================
(function () {
  const kode = prompt("Masukkan kode akses admin:");
  if (kode !== "pro95") {
    alert("Kode salah! Akses ditolak.");
    window.location.href = "/";
  }
})();

// ===================== 🌗 TEMA TERANG & GELAP =====================
function toggleTheme() {
  document.body.classList.toggle("dark-theme");
  const isDark = document.body.classList.contains("dark-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

// Terapkan tema tersimpan saat halaman dimuat
window.addEventListener("load", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
  }
});

// ===================== 📜 KUTIPAN OTOMATIS =====================
const kutipanList = [
  "Kreativitas adalah keberanian untuk mencoba hal baru!",
  "Jangan takut gagal, takutlah jika tidak pernah mencoba.",
  "Satu karya kecil bisa berdampak besar.",
  "Jadilah kreator yang menginspirasi dunia.",
  "Setiap karya punya cerita. Buatlah ceritamu berkesan.",
];

let kutipanIndex = 0;
const elemenKutipan = document.getElementById("kutipan");

function tampilkanKutipan() {
  elemenKutipan.textContent = kutipanList[kutipanIndex];
  kutipanIndex = (kutipanIndex + 1) % kutipanList.length;
}

setInterval(tampilkanKutipan, 4000);
tampilkanKutipan();

// ===================== 📱 NAVIGASI MENU =====================
function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("show");
}

// Tutup menu saat klik di luar area
document.addEventListener("click", (e) => {
  const menu = document.getElementById("menu");
  const toggle = document.querySelector(".nav-toggle");
  if (!menu.contains(e.target) && !toggle.contains(e.target)) {
    menu.classList.remove("show");
  }
});

// ===================== 🎯 SEASON & DATA PESERTA =====================
let tampilkanPoin = true; // default true
let seasonAktif = null;

// Paksa tampilkanPoin tetap true meski diset false di data
function cekTampilkanPoin() {
  if (typeof tampilkanPoin === "boolean" && !tampilkanPoin) {
    tampilkanPoin = true;
  }
}

// Panggil fungsi saat halaman selesai dimuat
window.addEventListener("load", () => {
  cekTampilkanPoin();
  isiDropdownSeason();
});

// ===================== 🔽 DROPDOWN SEASON =====================
function isiDropdownSeason() {
  const seasonSelect = document.getElementById("season");
  seasonSelect.innerHTML = "";

  if (typeof dataJuara === "undefined") {
    console.error("❌ dataJuara tidak ditemukan. Pastikan juara.js dimuat sebelum admin1.js");
    return;
  }

  Object.keys(dataJuara).forEach((seasonKey) => {
    const option = document.createElement("option");
    option.value = seasonKey;
    option.textContent = seasonKey.replace("season", "Season ");
    seasonSelect.appendChild(option);
  });

  seasonAktif = seasonSelect.value;
  tampilkanDataSeason();
}

// ===================== 🏆 TAMPILKAN DATA SEASON =====================
function tampilkanDataSeason() {
  cekTampilkanPoin();
  const seasonSelect = document.getElementById("season");
  const seasonDipilih = seasonSelect.value;
  seasonAktif = seasonDipilih;

  const dataSeason = dataJuara[seasonDipilih];

  if (!dataSeason) {
    document.getElementById("daftarPeserta").innerHTML = "<p>Data tidak ditemukan.</p>";
    return;
  }

  // tampilkan hadiah
  const hadiahList = document.getElementById("hadiahList");
  hadiahList.innerHTML = "";
  dataSeason.hadiah.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "hadiah-item";
    div.innerHTML = `<strong>Juara ${i + 1}:</strong> ${item}`;
    hadiahList.appendChild(div);
  });

  // tampilkan status poin
  const statusPoin = document.getElementById("statusPoin");
  statusPoin.innerHTML = `<p>📢 Poin Viral: ${
    dataSeason.poinViralTerkunci ? "🔒 Dikunci (masih dihitung otomatis)" : "🟢 Aktif"
  }</p>`;

  // kirim data peserta ke admin2.js
  if (typeof renderDaftarPeserta === "function") {
    renderDaftarPeserta(dataSeason.peserta || []);
  } else {
    console.warn("⚠️ Fungsi renderDaftarPeserta belum dimuat dari admin2.js");
  }
}

// ===================== 💾 SIMPAN & MUAT STATUS THEME =====================
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
  }
});

// =========================================================
// ✨ Akhir dari admin1.js
// =========================================================