// =========================================================
// 🔒 ADMIN PANEL TANJUNG BULAN - FILE: admin1.js
// =========================================================

// ================== Proteksi Kode Admin ==================
(function () {
  const kode = prompt("Masukkan kode akses admin:");
  if (kode !== "pro95") {
    alert("Kode salah! Akses ditolak.");
    document.body.innerHTML =
      "<h2 style='text-align:center;margin-top:20vh;font-family:sans-serif'>❌ Akses Ditolak</h2>";
    throw new Error("Akses ditolak: kode admin salah.");
  }
})();

// =========================================================
// 🌗 Tema Terang & Gelap
// =========================================================
function toggleTheme() {
  document.body.classList.toggle("dark-theme");
  const isDark = document.body.classList.contains("dark-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  const icon = document.querySelector("#themeToggle i");
  if (icon)
    icon.className = isDark ? "fas fa-moon" : "fas fa-sun";
}

function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    const icon = document.querySelector("#themeToggle i");
    if (icon) icon.className = "fas fa-moon";
  }
}

// =========================================================
// ✨ Kutipan - Muncul hanya saat di layar
// =========================================================
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const quote = entry.target.querySelector(".kutipan");
      if (quote) {
        if (entry.isIntersecting) {
          quote.style.opacity = "1";
          quote.style.transform = "translateY(0)";
        } else {
          quote.style.opacity = "0";
          quote.style.transform = "translateY(20px)";
        }
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".card").forEach((card) => observer.observe(card));

// =========================================================
// 📋 Navigasi Dasar
// =========================================================
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

// =========================================================
// 🧠 Inisialisasi Awal
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
  loadTheme();

  // tombol tema
  const themeButton = document.getElementById("themeToggle");
  if (themeButton) themeButton.addEventListener("click", toggleTheme);

  // jika dataJuara dari juara.js sudah tersedia, tampilkan season pertama
  if (typeof dataJuara !== "undefined" && Object.keys(dataJuara).length > 0) {
    const firstSeason = Object.keys(dataJuara)[0];
    if (typeof tampilkanDataSeason === "function") {
      tampilkanDataSeason(firstSeason);
    } else {
      console.warn("⚠️ Fungsi tampilkanDataSeason belum didefinisikan (admin2.js belum dimuat).");
    }
  } else {
    console.warn("⚠️ Tidak ada dataJuara ditemukan. Pastikan juara.js dimuat sebelum admin1.js.");
  }
});

// =========================================================
// 🧭 Fungsi Utilitas Navigasi Musim
// =========================================================
function buatDropdownSeason() {
  const dropdown = document.getElementById("dropdownSeason");
  if (!dropdown || typeof dataJuara === "undefined") return;

  dropdown.innerHTML = "";
  Object.keys(dataJuara).forEach((season) => {
    const opt = document.createElement("option");
    opt.value = season;
    opt.textContent = season;
    dropdown.appendChild(opt);
  });

  dropdown.addEventListener("change", (e) => {
    const season = e.target.value;
    if (typeof tampilkanDataSeason === "function") tampilkanDataSeason(season);
  });
}

// panggil ulang setelah halaman siap
window.addEventListener("load", () => {
  if (typeof dataJuara !== "undefined") buatDropdownSeason();
});

// =========================================================
// 🎨 Efek Visual Tambahan (Opsional)
// =========================================================
window.addEventListener("scroll", () => {
  const navbar = document.querySelector("nav");
  if (navbar) {
    if (window.scrollY > 50) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  }
});

// =========================================================
// ✅ Akhir File admin1.js
// =========================================================