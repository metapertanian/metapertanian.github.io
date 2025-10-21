// =========================================================
// 🔐 Kode Akses Admin
// =========================================================
(function() {
  const kodeBenar = "pro95";
  let kodeInput = sessionStorage.getItem("kodeAksesAdmin");

  if (!kodeInput || kodeInput !== kodeBenar) {
    kodeInput = prompt("Masukkan kode akses admin:");
    if (kodeInput !== kodeBenar) {
      alert("Kode salah! Akses ditolak.");
      window.location.href = "/";
      return;
    }
    sessionStorage.setItem("kodeAksesAdmin", kodeInput);
  }
})();

// =========================================================
// 🌗 Tema Terang & Gelap
// =========================================================
function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  applyThemeColors();

  // pastikan kutipan & data season di-refresh setelah transisi warna
  setTimeout(() => {
    startKutipanIfVisible();
    tampilkanDataSeason();
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

  document.documentElement.style.height = "100%";
  document.body.style.height = "100%";
  document.body.style.margin = "0";
  document.body.style.backgroundColor = "var(--bg-color)";
  document.body.style.overflowX = "hidden";
}

// =========================================================
// 🚀 Inisialisasi Awal Saat DOM Siap
// =========================================================
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (!savedTheme || savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }
  applyThemeColors();

  document.querySelectorAll('section[id]').forEach(sec => {
    sec.style.scrollMarginTop = '100px';
  });

  setupKutipanObserver();

  setTimeout(() => {
    tampilkanDataSeason();
  }, 80);
});

// =========================================================
// 🔘 Navbar Toggle
// =========================================================
function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("active");
  menu.style.left = menu.classList.contains("active") ? "0" : "-100%";
}
document.querySelectorAll("#menu a").forEach(link => {
  link.addEventListener("click", () => {
    const menu = document.getElementById("menu");
    menu.classList.remove("active");
    menu.style.left = "-100%";
  });
});

// =========================================================
// 💬 Kutipan Bergantian
// =========================================================
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

  if (kutipanObserver) {
    try { kutipanObserver.disconnect(); } catch (e) {}
    kutipanObserver = null;
  }

  kutipanObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) startKutipanIfVisible();
      else stopKutipan();
    });
  }, { threshold: 0.45 });

  kutipanObserver.observe(kutipanEl);
}

function startKutipanIfVisible() {
  const el = document.getElementById("kutipan");
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const inView = rect.top < window.innerHeight && rect.bottom > 0;
  if (inView) tampilkanKutipanHurufDemiHuruf();
  else el.textContent = "";
}

function stopKutipan() {
  const el = document.getElementById("kutipan");
  if (el) el.textContent = "";
  if (intervalHuruf) {
    clearInterval(intervalHuruf);
    intervalHuruf = null;
  }
}

function tampilkanKutipanHurufDemiHuruf() {
  const el = document.getElementById("kutipan");
  if (!el) return;

  if (intervalHuruf) {
    clearInterval(intervalHuruf);
    intervalHuruf = null;
  }

  const teks = kutipanList[indexKutipan] || "";
  const isDark = document.body.classList.contains('dark-theme');

  el.textContent = "";
  el.style.fontFamily = "'Poppins','Inter',sans-serif";
  el.style.fontSize = "1.2rem";
  el.style.fontWeight = "600";
  el.style.textAlign = "center";
  el.style.transition = "color 0.25s ease";
  el.style.color = isDark ? "#ffe082" : "#111";
  el.style.textShadow = isDark ? "0 0 10px rgba(255,255,255,0.28)" : "none";

  const textSpan = document.createElement('span');
  textSpan.style.color = 'inherit';
  textSpan.style.whiteSpace = 'pre-wrap';
  el.appendChild(textSpan);

  const cursor = document.createElement("span");
  cursor.textContent = "|";
  cursor.style.color = isDark ? "#ffd54f" : "#444";
  cursor.style.marginLeft = "2px";
  el.appendChild(cursor);

  indexHuruf = 0;
  intervalHuruf = setInterval(() => {
    const rect = el.getBoundingClientRect();
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

// =========================================================
// 📅 Dropdown Season & Periode
// =========================================================
const selectSeason = document.getElementById("season");
Object.keys(dataJuara).forEach(s => {
  const opt = document.createElement("option");
  opt.value = s;
  opt.textContent = s;
  selectSeason.appendChild(opt);
});
selectSeason.value = Object.keys(dataJuara)[0];

const infoRange = document.createElement("div");
infoRange.id = "infoRange";
infoRange.style.fontSize = "0.95em";
infoRange.style.marginTop = "8px";
selectSeason.insertAdjacentElement("afterend", infoRange);

// =========================================================
// 💥 Poin Kreator — override jika false
// =========================================================
function getStatusPoin(seasonName) {
  const data = dataJuara[seasonName];
  let poin = data.Poin;
  // jika bernilai false atau "false", paksa true
  if (poin === false || poin === "false" || poin === 0 || poin == null) poin = true;
  return poin;
}

// =========================================================
// 🔎 Pencarian Kreator
// =========================================================
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
if (poinTitle) poinTitle.insertAdjacentElement("afterend", searchContainer);
else {
  const poinSection = document.getElementById("poin");
  if (poinSection) poinSection.insertAdjacentElement("afterbegin", searchContainer);
}