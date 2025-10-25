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
// 📅 Dropdown Season & infoRange (jalankan hanya jika ada elemen #season)
// =========================================================
const selectSeason = document.getElementById("season");
if (selectSeason && typeof dataJuara !== "undefined") {
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
}

// 🧾 Info Season  
  infoRange.innerHTML = `  
    <div style="background:var(--card-bg);padding:14px 16px;border-radius:12px;box-shadow:var(--shadow);">  
      <div style="font-weight:700;color:var(--highlight);font-size:1.05em;">🎬 ${dataSeason.tema || "Tanpa Tema"}</div>  
      <div style="margin-top:6px;color:${isDark ? '#ddd' : '#333'};">${dataSeason.deskripsi || ""}</div>  
      <div style="margin-top:6px;color:${isDark ? '#bbb' : '#555'};">📅 ${dataSeason.periode || "-"}</div>  
      <div style="margin-top:8px;font-size:0.9em;">  
        🎗️ <span style="color:var(--highlight);">Sponsor:</span><br><i>${dataSeason.Sponsor || "-"}</i>  
      </div>  
    </div>  
  `;

// Tahun Footer otomatis 
window.addEventListener("DOMContentLoaded", () => {
  const elTahun = document.getElementById("tahun");
  if (elTahun) elTahun.textContent = new Date().getFullYear();
});

// =========================================================
// 🔎 Pencarian Kreator
// =========================================================
const searchContainer = document.createElement("div");
searchContainer.style.textAlign = "center";
searchContainer.style.margin = "10px 0";
searchContainer.innerHTML = `
  <input type="text" id="searchNama" placeholder="Cari nama kreator..."
    style="padding:10px 14px;border-radius:10px;width:75%;max-width:380px;
    border:1px solid var(--text-color);outline:none;
    background:var(--input-bg);color:var(--text-color);
    text-align:center;transition:all 0.3s ease;">
`;
const poinTitle = document.querySelector("#poin h2");
if (poinTitle) poinTitle.insertAdjacentElement("afterend", searchContainer);

// 🌟 Efek saat fokus pencarian: arahkan layar ke #poin tanpa menggeser form
document.addEventListener("focusin", e => {
  if (e.target.id === "searchNama") {
    const searchBox = e.target;
    searchBox.style.transform = "none";
    searchBox.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
    const poinSection = document.getElementById("poin");
    if (poinSection) {
      const y = poinSection.getBoundingClientRect().top + window.scrollY - 50; // offset agar judul tetap terlihat
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }
});

document.addEventListener("focusout", e => {
  if (e.target.id === "searchNama") {
    const searchBox = e.target;
    searchBox.style.boxShadow = "none";
  }
});

// =========================================================
// 🧮 Hitung Nilai
// =========================================================
function hitungTotal(p, tampilkanPoin) {
  const like = +p.like || 0, komen = +p.komen || 0, share = +p.share || 0;
  const ide = +p.ideKonsepNilai || 0, edit = +p.editing || 0, karakter = +p.karakter || 0;
  const nuansa = +p.nuansaLokal || 0, dampak = +p.dampakPositif || 0;
  const viral = tampilkanPoin ? ((like * 1.0) + (komen * 1.5) + (share * 1.5)) : 0;
  const nilaiKreatif = (ide * 1.5) + edit + (karakter * 0.5);
  const nilaiLokal = nuansa + dampak;
  const total = +(nilaiKreatif + nilaiLokal + (tampilkanPoin ? viral : 0)).toFixed(1);
  return { total, nilaiKreatif, nilaiLokal, viral };
}

// =========================================================
// 🔍 Filter Juara
// =========================================================
function cariPemenangBerdasarkanFilter(dataSeason, filter, tampilkanPoin) {
  if (!tampilkanPoin) return null;
  const data = (dataSeason.kreator || []).map(p => ({ ...p, ...hitungTotal(p, true) }));
  if (typeof filter === "string") return data.find(p => p.ideKonsepTipe?.toLowerCase().includes(filter.toLowerCase()));
  if (typeof filter === "object" && filter.field) {
    if (filter.mode === "max") return data.reduce((a, b) => (b[filter.field] > a[filter.field] ? b : a));
    else if (filter.value) return data.find(p => p[filter.field] === filter.value);
  }
  return null;
}
