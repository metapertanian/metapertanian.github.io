// =========================================================
// 🌗 Tema Terang & Gelap (default: terang, elegan & kontras lembut)
// =========================================================
function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  applyThemeColors();
  setTimeout(() => {
    startKutipanIfVisible();
    tampilkanDataSeason();
  }, 80);
}

function applyThemeColors() {
  const isDark = document.body.classList.contains('dark-theme');

  // 🎨 Warna dasar elegan
  document.documentElement.style.setProperty('--bg-color', isDark ? '#0b1216' : '#f3f5f7');
  document.documentElement.style.setProperty('--text-color', isDark ? '#f2f2f2' : '#1a1a1a');
  document.documentElement.style.setProperty('--card-bg', isDark ? 'rgba(255,255,255,0.05)' : '#ffffff');
  document.documentElement.style.setProperty('--input-bg', isDark ? '#101820' : '#ffffff');
  document.documentElement.style.setProperty('--shadow', isDark ? '0 2px 10px rgba(0,0,0,0.6)' : '0 2px 10px rgba(0,0,0,0.08)');
  document.documentElement.style.setProperty('--highlight', isDark ? '#ffeb3b' : '#c79400');
  document.documentElement.style.setProperty('--accent', isDark ? '#2196f3' : '#0077b6');
  document.documentElement.style.setProperty('--section-bg', isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)');

  document.documentElement.style.height = "100%";
  document.body.style.height = "100%";
  document.body.style.margin = "0";
  document.body.style.backgroundColor = "var(--bg-color)";
  document.body.style.color = "var(--text-color)";
  document.body.style.fontFamily = "Poppins, Arial, sans-serif";
  document.body.style.overflowX = "hidden";
  document.body.style.transition = "background-color .3s, color .3s";
}

window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  // 🟢 Tema terang sebagai default
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }
  applyThemeColors();

  // offset scroll agar tidak tertutup navbar
  document.querySelectorAll('section[id]').forEach(sec => {
    sec.style.scrollMarginTop = '90px';
    sec.style.background = 'var(--section-bg)';
    sec.style.borderRadius = '12px';
    sec.style.padding = '12px 10px';
    sec.style.margin = '16px auto';
    sec.style.maxWidth = '900px';
    sec.style.boxShadow = 'var(--shadow)';
  });

  setupKutipanObserver();
  setTimeout(() => tampilkanDataSeason(), 100);
});

// =========================================================
// 🔘 Navbar Toggle (muncul dari kiri)
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
// 📅 Dropdown Season & infoRange
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
infoRange.style.textAlign = "center";
selectSeason.insertAdjacentElement("afterend", infoRange);

// Tahun Hak Cipta Footer 
window.addEventListener("DOMContentLoaded", () => {
  const tahunEl = document.getElementById("tahun");
  if (tahunEl) tahunEl.textContent = new Date().getFullYear();
});