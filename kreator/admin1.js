// =========================================================
// 🌗 Tema Terang & Gelap
// =========================================================
function toggleTheme() {
  document.body.classList.toggle("dark-theme");
  const isDark = document.body.classList.contains("dark-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

// Terapkan tema saat load
(function () {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
  }
})();

// =========================================================
// 🍔 Menu Navigasi
// =========================================================
function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("show");
}

// Tutup menu saat klik luar
document.addEventListener("click", (e) => {
  const menu = document.getElementById("menu");
  const toggle = document.querySelector(".nav-toggle");
  if (menu && !menu.contains(e.target) && !toggle.contains(e.target)) {
    menu.classList.remove("show");
  }
});

// =========================================================
// ✨ Kutipan (menulis di layar saat muncul)
// =========================================================
const kutipanEl = document.getElementById("kutipan");
const kutipanList = [
  "Kreativitas adalah suara jiwa.",
  "Satu karya bisa mengubah banyak hal.",
  "Berkaryalah meski sederhana.",
  "Setiap ide punya makna.",
  "Konsistensi lebih penting daripada kesempurnaan."
];

let observerKutipan;
function setupKutipanObserver() {
  if (!kutipanEl) return;
  if (observerKutipan) observerKutipan.disconnect();

  observerKutipan = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        tampilkanKutipan();
      } else {
        kutipanEl.textContent = "";
      }
    });
  });
  observerKutipan.observe(kutipanEl);
}

function tampilkanKutipan() {
  const random = kutipanList[Math.floor(Math.random() * kutipanList.length)];
  kutipanEl.textContent = "";
  let index = 0;
  const interval = setInterval(() => {
    kutipanEl.textContent = random.slice(0, index++);
    if (index > random.length) clearInterval(interval);
  }, 60);
}

// =========================================================
// 🔐 Kode Rahasia Admin (pro95)
// =========================================================
function bukaHalamanAdmin() {
  const kode = prompt("Masukkan kode admin untuk membuka halaman ini:");
  if (kode !== "pro95") {
    alert("❌ Kode salah. Akses ditolak.");
    window.location.href = "/"; // kembali ke beranda
  } else {
    alert("✅ Selamat datang, Admin!");
  }
}

// =========================================================
// 🧭 Data Season
// =========================================================
const selectSeason = document.getElementById("season");
const infoRange = document.createElement("div");
const statusPoin = document.getElementById("statusPoin");

let dataJuara = {};

// =========================================================
// 📦 Muat Data Juara dari file juara.js
// =========================================================
window.addEventListener("DOMContentLoaded", () => {
  if (typeof semuaJuara !== "undefined") {
    dataJuara = semuaJuara;
    isiSeason();
  }
  setupKutipanObserver();
  bukaHalamanAdmin();
});

// =========================================================
// 🗓️ Isi Pilihan Season
// =========================================================
function isiSeason() {
  if (!selectSeason) return;
  selectSeason.innerHTML = "";

  const keys = Object.keys(dataJuara);
  if (keys.length === 0) {
    const opt = document.createElement("option");
    opt.textContent = "Belum ada season";
    selectSeason.appendChild(opt);
    return;
  }

  keys.forEach((key) => {
    const opt = document.createElement("option");
    const s = dataJuara[key];
    opt.value = key;
    opt.textContent = s.nama || `Season ${key}`;
    selectSeason.appendChild(opt);
  });

  selectSeason.value = keys[keys.length - 1];
  tampilkanDataSeason(); // panggil fungsi di admin2.js
}

// =========================================================
// ⚙️ Status Poin
// =========================================================
function updateStatusPoin(dataSeason) {
  if (!statusPoin) return;
  let tampilkanPoin = (
    dataSeason.Poin === true ||
    dataSeason.Poin === "true" ||
    dataSeason.Poin === 1 ||
    dataSeason.Poin === "1"
  );

  // 🔧 jika tampilkanPoin false, anggap true (selalu tampilkan poin)
  if (!tampilkanPoin) tampilkanPoin = true;

  statusPoin.innerHTML = `
    <div style="margin:12px 0;padding:10px 14px;border-radius:12px;
    background:var(--card-bg);box-shadow:var(--shadow);
    color:var(--text-color);font-size:0.95em;">
      <b>Status Poin:</b> ${tampilkanPoin ? "🟢 Ditampilkan" : "🔒 Disembunyikan (tetap dibaca true)"}
    </div>
  `;
}

// =========================================================
// 🚀 Event awal
// =========================================================
window.addEventListener("load", () => {
  if (selectSeason && selectSeason.value && dataJuara[selectSeason.value]) {
    updateStatusPoin(dataJuara[selectSeason.value]);
  }
});