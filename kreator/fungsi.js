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

// =========================================================
// 📊 Tampilkan Data Season
// =========================================================
let currentPage = 1;
const itemsPerPage = 5;

function tampilkanDataSeason() {
  const season = selectSeason.value;
  const dataSeason = dataJuara[season];
  if (!dataSeason) return;

  const tampilkanPoin = (dataSeason.Poin === true || dataSeason.Poin === 'true' || dataSeason.Poin === 1 || dataSeason.Poin === '1');
  const data = Array.isArray(dataSeason.kreator) ? dataSeason.kreator.slice() : [];
  let ranking = data.map(p => ({ ...p, ...hitungTotal(p, tampilkanPoin) }));
  if (tampilkanPoin) ranking.sort((a, b) => b.total - a.total);

  const wadah = document.getElementById("daftarPeserta");
  if (!wadah) return;
  wadah.innerHTML = "";
  const isDark = document.body.classList.contains('dark-theme');

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

  
  // Aturan
  const aturanEl = document.getElementById("aturanText");
  if (aturanEl) {
    aturanEl.innerHTML = `
      • Lomba terbuka untuk umum.<br>
      • Konten sesuai tema: <b>${dataSeason.tema}</b><br>
      • ${dataSeason.deskripsi}<br>
      • Video hasil karya sendiri (bukan reupload).<br>
      • Format bebas: lucu, edukatif, cinematic, dokumenter, atau motivasi.<br><br>
      <b>Kriteria Penilaian:</b><br><br>
      <b>💡 Kreatifitas</b>: Maks 300 poin<br>
      dihitung dari <u>Ide Konsep</u> (150), <u>Editing</u> (100), <u>Karakter</u> (50).<br>
      <b>🏡 Lokal</b>: Maks 200 poin<br>
      dihitung dari <u>Nuansa Lokal</u> (100), <u>Dampak Positif</u> (100).<br>
      <b>🚀 Viral</b>: Tak terbatas<br>
      dihitung otomatis dari reaksi (like, komen, share) menggunakan Algoritma kami.<br><br>
      ✅ Boleh mengajak orang lain untuk menaikkan reaksi.<br>
      ⚠️ Dilarang spam, bot, atau beli reaksi — pelanggaran keras = diskualifikasi.
    `;
  }

  // 🔎 Filter + pagination
  const keyword = document.getElementById("searchNama") ? document.getElementById("searchNama").value.toLowerCase() : "";
  const filtered = keyword ? ranking.filter(p => p.nama.toLowerCase().includes(keyword)) : ranking;
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  if (currentPage > totalPages) currentPage = 1;
  const pageItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // 🧍‍♂️ Peserta Card
  pageItems.forEach(p => {
    const div = document.createElement("div");
    div.className = "peserta show";
    div.style.cssText = `
      background: var(--card-bg);
      border-radius:14px;
      box-shadow: var(--shadow);
      padding:14px 16px;
      margin:12px 0;
      transition:transform .18s;
    `;
    div.onmouseover = () => div.style.transform = "translateY(-4px)";
    div.onmouseleave = () => div.style.transform = "translateY(0)";

    const nomorRanking = tampilkanPoin ? `<span style="color:var(--highlight)">#${ranking.indexOf(p) + 1}</span> ` : "";
    const viralPart = tampilkanPoin ? `<b>${p.viral.toFixed(1)}</b>` : `<span style="color:gold">🔒</span>`;
    const peringatanViral = tampilkanPoin ? "" : `<div style="margin-top:6px;color:${isDark ? '#ffcc80' : '#b8860b'};font-size:0.9em;">⚠️ poin viral belum dihitung</div>`;

    div.innerHTML = `
      <div style="font-weight:700;font-size:1rem">${nomorRanking}${p.nama.toUpperCase()}</div>
      <div style="margin-top:6px;line-height:1.4">
        💡 Kreativitas: <b>${p.nilaiKreatif.toFixed(1)}</b><br>
        🏡 Lokal: <b>${p.nilaiLokal.toFixed(1)}</b><br>
        🚀 Viral: ${viralPart}
      </div>
      <div style="margin-top:8px;">⭐ <b style="color:var(--highlight)">${p.total.toFixed(1)}</b></div>
      ${peringatanViral}
      <a href="${p.linkVideo || '#'}" target="_blank" style="display:inline-block;margin-top:8px;color:var(--accent)">▶️ Lihat Video</a>
    `;
    wadah.appendChild(div);
  });

  // 🔢 Pagination
  const pagination = document.getElementById("pagination");
  if (pagination) {
    pagination.innerHTML = "";
    pagination.style.textAlign = "center";
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = (i === currentPage) ? "active" : "";
      btn.style.cssText = `
        margin:4px;padding:6px 10px;border-radius:8px;border:none;
        cursor:pointer;
        background:${i === currentPage ? 'var(--highlight)' : (isDark ? '#1b1b1b' : '#e6e6e6')};
        color:${i === currentPage ? '#000' : (isDark ? '#fff' : '#111')};
      `;
      btn.onclick = () => {
        currentPage = i;
        tampilkanDataSeason();
        document.getElementById("poin").scrollIntoView({ behavior: "smooth" });
      };
      pagination.appendChild(btn);
    }
  }

  // 🏆 Hadiah
  const juaraBox = document.getElementById("hadiahList");
  if (juaraBox) {
    juaraBox.innerHTML = "";
    (dataSeason.Hadiah || []).forEach(h => {
      const pemenang = tampilkanPoin
        ? (h.filter ? cariPemenangBerdasarkanFilter(dataSeason, h.filter, true)
          : ranking[parseInt(h.kategori.replace(/\D/g, "")) - 1])
        : null;
      const nama = tampilkanPoin && pemenang ? pemenang.nama : "Belum diumumkan";

      const card = document.createElement("div");
      card.className = "hadiah-card";
      card.style.cssText = `
        background: linear-gradient(145deg, var(--card-bg), ${isDark ? '#0d0d0d' : '#fefefe'});
        border-radius:14px;padding:16px;box-shadow:var(--shadow);
        margin:12px 0;transition:transform .15s;line-height:1.5;
      `;
      card.onmouseover = () => card.style.transform = "translateY(-4px)";
      card.onmouseleave = () => card.style.transform = "translateY(0)";

      card.innerHTML = `
        <div style="font-weight:700;font-size:1.05em">${h.kategori}</div>
        <div style="margin-top:6px;">🎁 ${h.hadiah}</div>
        <div style="margin-top:8px;">🏆 <span style="color:var(--highlight);font-weight:700">${nama}</span></div>
        ${pemenang ? `
          <div style="margin-top:8px;">⭐ <b>${pemenang.total.toFixed(1)}</b></div>
          <a href="${pemenang.linkVideo || '#'}" target="_blank" style="display:inline-block;margin-top:8px;color:var(--accent)">▶️ Lihat Video</a>
        ` : ""}
      `;
      juaraBox.appendChild(card);
    });
  }
}

// =========================================================
// 🔁 Event Listeners
// =========================================================
selectSeason.addEventListener("change", () => {
  currentPage = 1;
  tampilkanDataSeason();
});
const searchInput = document.getElementById("searchNama");
if (searchInput) {
  searchInput.addEventListener("input", () => {
    currentPage = 1;
    tampilkanDataSeason();
  });
}
window.addEventListener("load", () => {
  setupKutipanObserver();
  tampilkanDataSeason();
});