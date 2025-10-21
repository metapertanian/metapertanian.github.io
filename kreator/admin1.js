// =========================================================
// admin1.js
// =========================================================
// Bagian: Tema, Navigasi, Kutipan, Setup Dasar, Proteksi Admin (kode: pro95)
// Catatan: file ini tidak berisi logika perhitungan / render peserta (itu di admin2.js).
// =========================================================

/* ===========================
   Konfigurasi akses admin
   =========================== */
const ADMIN_CODE = "pro95"; // kode akses admin (case-sensitive)
let isAdminUnlocked = false;

/**
 * showAccessOverlay(message, blocked)
 * - menampilkan overlay pemberitahuan jika akses ditolak atau saat mengunci UI.
 * - jika blocked === true -> menutupi seluruh layar dan memblokir interaksi.
 */
function showAccessOverlay(message = "Access denied", blocked = true) {
  // hindari membuat overlay ganda
  if (document.getElementById("adminAccessOverlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "adminAccessOverlay";
  overlay.style.cssText = `
    position:fixed;
    inset:0;
    display:flex;
    align-items:center;
    justify-content:center;
    background: rgba(0,0,0,0.75);
    color:#fff;
    z-index:99999;
    font-family: Inter, Poppins, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    padding:20px;
    text-align:center;
  `;

  const box = document.createElement("div");
  box.style.cssText = `
    max-width:520px;
    width:100%;
    background: rgba(0,0,0,0.4);
    border-radius:12px;
    padding:26px;
    box-shadow: 0 6px 28px rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
  `;

  box.innerHTML = `
    <div style="font-size:1.3rem;font-weight:700;margin-bottom:10px;">${message}</div>
    <div style="margin-top:8px;font-size:0.95rem;opacity:0.95;">
      Jika Anda memiliki kode admin, muat ulang halaman dan masukkan kode saat diminta.
    </div>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  if (!blocked) {
    // jika tidak memblokir, tambahkan tombol tutup
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Tutup";
    closeBtn.style.cssText = `
      margin-top:16px;padding:8px 12px;border-radius:8px;border:none;cursor:pointer;
      background:#fff;color:#111;font-weight:600;
    `;
    closeBtn.onclick = () => {
      try { document.body.removeChild(overlay); } catch(e){}
    };
    box.appendChild(closeBtn);
  }
}

/**
 * requestAdminCode()
 * - Meminta kode admin segera saat halaman dimuat.
 * - Jika kode cocok -> panggil initAdmin().
 * - Jika tidak cocok -> tampilkan overlay akses ditolak.
 */
function requestAdminCode() {
  try {
    // gunakan prompt sederhana agar bisa langsung dipakai di berbagai environment
    const kode = prompt("Masukkan kode admin untuk membuka halaman admin:");
    if (kode === null) {
      // pengguna membatalkan prompt -> tampilkan overlay non-blocking
      showAccessOverlay("Akses admin dibatalkan oleh pengguna.", true);
      return;
    }
    if (kode === ADMIN_CODE) {
      isAdminUnlocked = true;
      // inisialisasi admin
      initAdmin();
    } else {
      isAdminUnlocked = false;
      showAccessOverlay("Kode admin salah — akses ditolak.", true);
    }
  } catch (e) {
    // fallback: jika prompt gagal (rare), tampilkan overlay error
    console.error("requestAdminCode error:", e);
    showAccessOverlay("Gagal memproses kode admin.", true);
  }
}

/* =========================================================
   Tema Gelap/Terang & Utility terkait
   ========================================================= */
function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  applyThemeColors();
  // pastikan kutipan dan daftar season di-refresh dengan warna baru
  setTimeout(() => {
    startKutipanIfVisible();
    // jika fungsi tampilkanDataSeason tersedia (di admin2.js), jalankan ulang
    if (typeof tampilkanDataSeason === "function") {
      try { tampilkanDataSeason(); } catch (e) { /* ignore */ }
    }
  }, 50);
}

function applyThemeColors() {
  const isDark = document.body.classList.contains('dark-theme');
  document.documentElement.style.setProperty('--bg-color', isDark ? '#071014' : '#f5f5f5');
  document.documentElement.style.setProperty('--text-color', isDark ? '#f1f1f1' : '#222');
  document.documentElement.style.setProperty('--card-bg', isDark ? 'rgba(255,255,255,0.06)' : '#fff');
  document.documentElement.style.setProperty('--input-bg', isDark ? '#111' : '#fff');
  document.documentElement.style.setProperty('--shadow', isDark ? '0 2px 8px rgba(255,255,255,0.06)' : '0 2px 8px rgba(0,0,0,0.08)');
  document.documentElement.style.setProperty('--highlight', isDark ? '#ffeb3b' : '#b8860b');

  // hilangkan garis putih di bawah layar & atur body
  document.documentElement.style.height = "100%";
  document.body.style.height = "100%";
  document.body.style.margin = "0";
  document.body.style.backgroundColor = "var(--bg-color)";
  document.body.style.overflowX = "hidden";
}

/* =========================================================
   Navbar Toggle (muncul dari kiri)
   ========================================================= */
function toggleMenu() {
  const menu = document.getElementById("menu");
  if (!menu) return;
  menu.classList.toggle("active");
  menu.style.left = menu.classList.contains("active") ? "0" : "-100%";
}
function setupNavbarLinksClose() {
  const menuLinks = document.querySelectorAll("#menu a");
  menuLinks.forEach(link => {
    link.addEventListener("click", () => {
      const menu = document.getElementById("menu");
      if (!menu) return;
      menu.classList.remove("active");
      menu.style.left = "-100%";
    });
  });
}

/* =========================================================
   Kutipan Bergantian (typing hanya saat elemen terlihat)
   ========================================================= */
const kutipanList = [
  "Dari satu kamera, tersimpan seribu cerita.",
  "Jangan tunggu viral, buatlah karya yang bernilai.",
  "Kreator hebat lahir dari dusun kecil, tapi mimpi yang besar.",
];
let indexKutipan = 0, indexHuruf = 0, intervalHuruf = null;
let kutipanObserver = null;

function setupKutipanObserver() {
  const kutipanEl = document.getElementById("kutipan");
  if (!kutipanEl) return;

  // disconnect lama jika ada
  if (kutipanObserver) {
    try { kutipanObserver.disconnect(); } catch (e) {}
    kutipanObserver = null;
  }

  kutipanObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startKutipanIfVisible();
      } else {
        stopKutipan();
      }
    });
  }, { threshold: 0.45 });

  try { kutipanObserver.observe(kutipanEl); } catch (e) { /* ignore */ }
}

function startKutipanIfVisible() {
  const kutipanEl = document.getElementById("kutipan");
  if (!kutipanEl) return;
  const rect = kutipanEl.getBoundingClientRect();
  const inView = rect.top < window.innerHeight && rect.bottom > 0;
  if (inView) {
    tampilkanKutipanHurufDemiHuruf();
  } else {
    kutipanEl.textContent = "";
  }
}

function stopKutipan() {
  const kutipanEl = document.getElementById("kutipan");
  if (kutipanEl) kutipanEl.textContent = "";
  if (intervalHuruf) {
    clearInterval(intervalHuruf);
    intervalHuruf = null;
  }
}

function tampilkanKutipanHurufDemiHuruf() {
  const elemen = document.getElementById("kutipan");
  if (!elemen) return;

  if (intervalHuruf) {
    clearInterval(intervalHuruf);
    intervalHuruf = null;
  }

  const teks = kutipanList[indexKutipan] || "";
  const isDark = document.body.classList.contains('dark-theme');

  // reset elemen & styling
  elemen.textContent = "";
  elemen.style.fontFamily = "'Poppins','Inter',sans-serif";
  elemen.style.fontSize = "1.2rem";
  elemen.style.fontWeight = "600";
  elemen.style.textAlign = "center";
  elemen.style.transition = "color 0.25s ease";
  elemen.style.color = isDark ? "#ffe082" : "#111";
  elemen.style.textShadow = isDark ? "0 0 10px rgba(255,255,255,0.28)" : "none";

  const textSpan = document.createElement('span');
  textSpan.style.color = 'inherit';
  textSpan.style.whiteSpace = 'pre-wrap';
  elemen.appendChild(textSpan);

  const cursor = document.createElement("span");
  cursor.textContent = "|";
  cursor.style.color = isDark ? "#ffd54f" : "#444";
  cursor.style.marginLeft = "2px";
  elemen.appendChild(cursor);

  indexHuruf = 0;
  intervalHuruf = setInterval(() => {
    // jika elemen sudah tidak terlihat di viewport saat mengetik => hentikan
    const rect = elemen.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) {
      stopKutipan();
      return;
    }

    if (indexHuruf < teks.length) {
      textSpan.textContent += teks[indexHuruf];
      indexHuruf++;
    } else {
      clearInterval(intervalHuruf);
      intervalHuruf = null;
      setTimeout(() => {
        indexKutipan = (indexKutipan + 1) % kutipanList.length;
        tampilkanKutipanHurufDemiHuruf();
      }, 3000);
    }
  }, 80);
}

/* =========================================================
   Setup: Select Season placeholder & Search Container
   - Populate actual seasons ketika admin2.js mempublish dataJuaraReady event
   ========================================================= */
const selectSeasonEl = document.getElementById("season");
const infoRangeEl = document.createElement("div");
infoRangeEl.id = "infoRange";
infoRangeEl.style.fontSize = "0.95em";
infoRangeEl.style.marginTop = "8px";

if (selectSeasonEl) {
  // sisipkan infoRange setelah select
  selectSeasonEl.insertAdjacentElement("afterend", infoRangeEl);
}

/**
 * populateSeasonsFromDataJuara()
 * - Jika dataJuara tersedia (dari admin2.js), isi opsi selectSeason.
 * - Dipanggil juga ketika event 'dataJuaraReady' diterima.
 */
function populateSeasonsFromDataJuara() {
  if (!selectSeasonEl) return;
  if (typeof dataJuara === "undefined" || !dataJuara) return;

  // bersihkan opsi lama
  selectSeasonEl.innerHTML = "";
  Object.keys(dataJuara).forEach(s => {
    const opt = document.createElement("option");
    opt.value = s;
    opt.textContent = s;
    selectSeasonEl.appendChild(opt);
  });
  // pilih season pertama jika ada
  const seasons = Object.keys(dataJuara || {});
  if (seasons.length > 0) selectSeasonEl.value = seasons[0];

  // jika admin2.js menyediakan fungsi tampilkanDataSeason, panggil sekali
  if (typeof tampilkanDataSeason === "function") {
    try { tampilkanDataSeason(); } catch (e) { /* ignore */ }
  }
}

/* =========================================================
   Pencarian Kreator (letakkan tepat di bawah judul poin kreator jika ada)
   ========================================================= */
function createSearchContainer() {
  const searchContainer = document.createElement("div");
  searchContainer.style.textAlign = "center";
  searchContainer.style.margin = "10px 0";
  searchContainer.innerHTML = `
    <input type="text" id="searchNama" placeholder="Cari nama kreator..." 
      style="padding:8px 12px;border-radius:8px;width:70%;max-width:360px;
      border:1px solid var(--text-color);outline:none;
      background:var(--input-bg);color:var(--text-color);
      text-align:center;transition:0.2s;">
  `;
  const poinTitle = document.querySelector("#poin h2");
  if (poinTitle) {
    poinTitle.insertAdjacentElement("afterend", searchContainer);
  } else {
    const poinSection = document.getElementById("poin");
    if (poinSection) poinSection.insertAdjacentElement("afterbegin", searchContainer);
  }

  // attach event listener untuk input (jika fungsi tampilkanDataSeason tersedia)
  const searchInput = searchContainer.querySelector("#searchNama");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      // reset page global jika ada
      if (typeof currentPage !== "undefined") currentPage = 1;
      if (typeof tampilkanDataSeason === "function") {
        try { tampilkanDataSeason(); } catch (e) { /* ignore */ }
      }
    });
  }
}

/* =========================================================
   Event listener helper: menunggu dataJuara dari admin2.js
   - admin2.js harus dispatchEvent(new Event('dataJuaraReady')) setelah mendefinisikan dataJuara
   ========================================================= */
window.addEventListener('dataJuaraReady', () => {
  try { populateSeasonsFromDataJuara(); } catch (e) {}
});

/* =========================================================
   initAdmin()
   - Dipanggil setelah kode admin valid.
   - Inisialisasi tema, navbar, kutipan, dan mencoba memanggil fungsi render dari admin2.js bila ada.
   ========================================================= */
function initAdmin() {
  // pastikan tidak dijalankan dua kali
  if (window.__adminInitialized) return;
  window.__adminInitialized = true;

  // set tema default jika belum ada
  const savedTheme = localStorage.getItem('theme');
  if (!savedTheme || savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
  applyThemeColors();

  // offset scroll untuk section (safety)
  document.querySelectorAll('section[id]').forEach(sec => {
    sec.style.scrollMarginTop = '100px';
  });

  // setup navbar behavior
  setupNavbarLinksClose();

  // setup kutipan observer
  setupKutipanObserver();

  // create search input if not present
  createSearchContainer();

  // jika dataJuara sudah tersedia, populate seasons sekarang juga
  populateSeasonsFromDataJuara();

  // event untuk perubahan season dibuat jika element ada
  if (selectSeasonEl) {
    selectSeasonEl.addEventListener("change", () => {
      // reset pagination jika ada
      if (typeof currentPage !== "undefined") currentPage = 1;
      if (typeof tampilkanDataSeason === "function") {
        try { tampilkanDataSeason(); } catch (e) { /* ignore */ }
      }
    });
  }

  // Setup tombol theme toggle jika ada
  const themeToggles = document.querySelectorAll("[data-toggle-theme]");
  themeToggles.forEach(btn => {
    btn.addEventListener("click", toggleTheme);
  });

  // attempt to call tampilkanDataSeason if admin2 provided it
  if (typeof tampilkanDataSeason === "function") {
    try { tampilkanDataSeason(); } catch (e) { /* ignore */ }
  }

  // pastikan observer kutipan aktif saat load
  setupKutipanObserver();
}

/* =========================================================
   Boot sequence: saat DOM siap, minta kode admin dulu
   ========================================================= */
window.addEventListener('DOMContentLoaded', () => {
  // safety: jika element penting belum ada, jangan crash
  // langsung request kode admin
  requestAdminCode();
});

// jika admin2.js nanti memerlukan cek isAdminUnlocked, ekspos variabel ini
window.isAdminUnlocked = () => !!isAdminUnlocked;

/* =========================================================
   Jika pengguna salah kode -> script lain harus berhenti
   - admin2.js harus memeriksa window.isAdminUnlocked() sebelum melakukan tindakan sensitif.
   ========================================================= */