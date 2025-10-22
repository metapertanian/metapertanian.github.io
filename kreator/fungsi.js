// =========================================================
// 🌗 Tema Terang & Gelap
// =========================================================
function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  applyThemeColors();
  // pastikan kutipan dan daftar season di-refresh dengan warna baru
  // beri sedikit delay agar CSS custom properties sudah ter-apply
  setTimeout(() => {
    startKutipanIfVisible();
    tampilkanDataSeason();
  }, 50);
}

// Terapkan warna tema dan beberapa perbaikan layout
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

// saat halaman dimuat: set tema default gelap jika belum ada, apply colors,
// set scrollMarginTop untuk section agar scrollIntoView tidak tertutup navbar,
// mulai observer kutipan supaya typing hanya ketika elemen terlihat
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (!savedTheme || savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }
  applyThemeColors();

  // offset scroll untuk section
  document.querySelectorAll('section[id]').forEach(sec => {
    sec.style.scrollMarginTop = '100px';
  });

  // setup observer untuk kutipan (multipurpose)
  setupKutipanObserver();

  // jalankan pertama kali tampilkan data
  setTimeout(() => {
    tampilkanDataSeason();
  }, 80);
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
selectSeason.insertAdjacentElement("afterend", infoRange);

// =========================================================
// 🔎 Pencarian Kreator (letakkan tepat di bawah judul poin kreator)
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
// sisipkan tepat setelah judul poin kreator jika ada
const poinTitle = document.querySelector("#poin h2");
if (poinTitle) {
  poinTitle.insertAdjacentElement("afterend", searchContainer);
} else {
  // fallback: taruh setelah #poin
  const poinSection = document.getElementById("poin");
  if (poinSection) poinSection.insertAdjacentElement("afterbegin", searchContainer);
}

// =========================================================
// 🧮 Hitung Nilai
// =========================================================
function hitungTotal(p, tampilkanPoin) {
  const like = +p.like || 0;
  const komen = +p.komen || 0;
  const share = +p.share || 0;
  const ide = +p.ideKonsepNilai || 0;
  const edit = +p.editing || 0;
  const karakter = +p.karakter || 0;
  const nuansa = +p.nuansaLokal || 0;
  const dampak = +p.dampakPositif || 0;

  const viral = tampilkanPoin ? ((like * 1.0) + (komen * 1.5) + (share * 1.5)) : 0;
  const nilaiKreatif = (ide * 1.5) + edit + (karakter * 0.5);
  const nilaiLokal = nuansa + dampak;
  const total = +(nilaiKreatif + nilaiLokal + (tampilkanPoin ? viral : 0)).toFixed(1);
  return { total, nilaiKreatif, nilaiLokal, viral };
}

// =========================================================
// 🔍 Filter Juara (pembantu untuk hadiah)
 // hanya valid jika poin ditampilkan
function cariPemenangBerdasarkanFilter(dataSeason, filter, tampilkanPoin) {
  if (!tampilkanPoin) return null;
  const data = (dataSeason.kreator || []).map(p => ({ ...p, ...hitungTotal(p, true) }));
  if (typeof filter === "string") {
    return data.find(p => p.ideKonsepTipe?.toLowerCase().includes(filter.toLowerCase()));
  }
  if (typeof filter === "object" && filter.field) {
    if (filter.mode === "max") {
      return data.reduce((a, b) => (b[filter.field] > a[filter.field] ? b : a));
    } else if (filter.value) {
      return data.find(p => p[filter.field] === filter.value);
    }
  }
  return null;
}

// =========================================================
// 📊 Tampilkan Data Season (menggunakan season.periode, tema, deskripsi, dll)
// =========================================================
let currentPage = 1;
const itemsPerPage = 5;

function tampilkanDataSeason() {
  const season = selectSeason.value;
  const dataSeason = dataJuara[season];
  if (!dataSeason) return;

  // Pastikan properti Poin ditafsirkan boolean benar
  const tampilkanPoin = (
    dataSeason.Poin === true ||
    dataSeason.Poin === 'true' ||
    dataSeason.Poin === 1 ||
    dataSeason.Poin === '1'
  );

  const data = Array.isArray(dataSeason.kreator) ? dataSeason.kreator.slice() : [];
  // generate nilai berdasarkan tampilkanPoin; jika Poin=false maka viral=0 dan total = kreatif+lokal
  let ranking = data.map(p => ({ ...p, ...hitungTotal(p, tampilkanPoin) }));

  // jika poin ditampilkan, urutkan berdasarkan total (ranking). Jika tidak, pertahankan urutan data (pendataan)
  if (tampilkanPoin) ranking.sort((a, b) => b.total - a.total);

  const wadah = document.getElementById("daftarPeserta");
  if (!wadah) return;
  wadah.innerHTML = "";
  const isDark = document.body.classList.contains('dark-theme');

  // Info season: gunakan tema, deskripsi, dan periode
  infoRange.innerHTML = `
    <div style="background:${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'};padding:14px;border-radius:12px;margin-top:8px;">
      <div style="font-size:1.05em;font-weight:700;color:${isDark ? '#ffeb3b' : '#b8860b'};">
        🎬 Tema: <span style="color:${isDark ? '#fff' : '#111'};">${dataSeason.tema || "Tanpa Tema"}</span>
      </div>
      <div style="font-size:0.95em;margin-top:8px;line-height:1.4;color:${isDark ? '#ddd' : '#333'};">
        ${dataSeason.deskripsi || ""}
      </div>
      <div style="margin-top:10px;color:${isDark ? '#ddd' : '#444'};">📅 ${dataSeason.periode || "-"}</div>
      <div style="margin-top:8px;font-size:0.95em;">
        <span style="color:${isDark ? '#ffeb3b':'#b8860b'};">🎗️ Sponsor:</span><br>
        <span style="font-style:italic;color:${isDark ? '#fdd835':'#5a4b00'};">${dataSeason.Sponsor || "-"}</span>
      </div>
    </div>
  `;

  // Aturan lomba (menggunakan tema & deskripsi dari season)
  const aturanEl = document.getElementById("aturanText");
  if (aturanEl) {
    aturanEl.innerHTML = `
      • Lomba terbuka untuk umum.<br>
      • Konten sesuai tema: <b>${dataSeason.tema}</b><br>
      • ${dataSeason.deskripsi}<br><br>
      • Video hasil editan sendiri dan belum pernah di upload di sosial media manapun.<br>
      • Gaya video bebas: lucu, edukatif, dokumenter, cinematic, atau motivasi.<br><br>
      <b>Poin Juri:</b><br>
      💡 Kreativitas:<br>
      • ide konsep (150),<br>
      • editing (100),<br>
      • karakter (50).<br><br>
      🏡 Dampak Dusun:<br>
      • nuansa (100),<br>
      • dampak positif (100).<br><br>
      <b>Total Maksimal:</b> 500 poin.<br><br>
      <b>Poin TikTok:</b><br>
      🚀 Poin Viral tak terbatas, dihitung otomatis dari like, komen, share.<br><br>
      Kreator dapat meminta bantuan teman/saudara untuk mendapatkan like/komen/share,<br>
      tapi dilarang spam dan dilarang menggunakan bot / beli like, komen, share.<br>
      Pelanggaran akan dikurangi poin atau diskualifikasi.
    `;
  }

  // Filter berdasarkan pencarian (tetap mempertahankan urutan data jika poin false)
  const keyword = document.getElementById("searchNama") ? document.getElementById("searchNama").value.toLowerCase() : "";
  const filtered = keyword ? ranking.filter(p => p.nama.toLowerCase().includes(keyword)) : ranking;

  // pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  if (currentPage > totalPages) currentPage = 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  // tampilkan peserta (jika Poin false => tidak tampil nomor ranking dan urutan sesuai data)
  pageItems.forEach(p => {
    const div = document.createElement("div");
    div.className = "peserta show";
    div.style.cssText = `
      background: var(--card-bg);
      border-radius:12px;
      box-shadow: var(--shadow);
      padding:12px;
      margin:10px 0;
      transition: transform .18s;
    `;
    div.onmouseover = () => div.style.transform = "translateY(-4px)";
    div.onmouseleave = () => div.style.transform = "translateY(0)";

    const nomorRanking = tampilkanPoin ? `<span style="color:var(--highlight);margin-right:6px">#${ranking.indexOf(p) + 1}</span>` : "";
    const viralPart = tampilkanPoin
      ? `<b>${p.viral.toFixed(1)}</b>`
      : `<span style="color:gold">🔒</span>`;

    // jika poin tersembunyi, total sudah dihitung hanya kreatif+lokal (hitungTotal sudah mengembalikan itu)
    const peringatanViral = tampilkanPoin ? "" : `<div style="margin-top:6px;color:${isDark ? '#ffcc80' : '#b8860b'};font-size:0.9em;">⚠️ poin viral belum dihitung</div>`;

    div.innerHTML = `
      <div class="nama" style="font-weight:700;font-size:1rem">${nomorRanking}${p.nama.toUpperCase()}</div>
      <div class="nilai" style="margin-top:6px;">
        💡 Kreativitas: <b>${p.nilaiKreatif.toFixed(1)}</b><br>
        🏡 Lokal: <b>${p.nilaiLokal.toFixed(1)}</b><br>
        🚀 Viral: ${viralPart}
      </div>
      <div class="total" style="margin-top:8px;">⭐ <b style="color:var(--highlight);">${p.total.toFixed(1)}</b></div>
      ${peringatanViral}
      <a href="${p.linkVideo || '#'}" target="_blank" class="link" style="display:inline-block;margin-top:8px;color:${isDark ? '#81d4fa' : '#0077b6'};">▶️ Lihat Video</a>
    `;
    wadah.appendChild(div);
  });

  // pagination rendering (tombol meng-scroll ke top poin)
  const pagination = document.getElementById("pagination");
  if (pagination) {
    pagination.innerHTML = "";
    pagination.style.textAlign = "center";
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = (i === currentPage) ? "active" : "";
      btn.style.cssText = `
        margin:4px;
        padding:6px 10px;
        border-radius:8px;
        border:none;
        cursor:pointer;
        background:${i === currentPage ? 'var(--highlight)' : (isDark ? '#2b2b2b' : '#e6e6e6')};
        color:${i === currentPage ? '#000' : (isDark ? '#fff' : '#111')};
      `;
      btn.onclick = () => {
        currentPage = i;
        tampilkanDataSeason();
        const poinEl = document.getElementById("poin");
        if (poinEl) poinEl.scrollIntoView({ behavior: "smooth" });
      };
      pagination.appendChild(btn);
    }
  }

  // tampilkan hadiah (jika poin false => nama "Belum diumumkan")
  const juaraBox = document.getElementById("hadiahList");
  if (juaraBox) {
    juaraBox.innerHTML = "";
    (dataSeason.Hadiah || []).forEach(h => {
      const pemenang = tampilkanPoin
        ? (h.filter ? cariPemenangBerdasarkanFilter(dataSeason, h.filter, true)
          : ranking[parseInt(h.kategori.replace(/\D/g, "")) - 1])
        : null;
      const adaPemenang = tampilkanPoin && pemenang;
      const nama = adaPemenang ? pemenang.nama : "Belum diumumkan";

      const card = document.createElement("div");
      card.className = "hadiah-card";
      card.style.cssText = `
        background: linear-gradient(145deg, var(--card-bg), ${isDark ? '#0f0f0f' : '#fafafa'});
        color: var(--text-color);
        border-radius:14px;
        padding:16px;
        margin:12px 0;
        box-shadow: var(--shadow);
        text-align:left;
        transition: transform .15s;
        line-height:1.4;
      `;
      card.onmouseover = () => card.style.transform = "translateY(-4px)";
      card.onmouseleave = () => card.style.transform = "translateY(0)";

      let isiCard = `
        <div style="font-weight:700;font-size:1.05em">${h.kategori}</div>
        <div style="margin-top:6px;">🎁 ${h.hadiah}</div>
        <div style="margin-top:8px;">🏆 <span style="color:var(--highlight);font-weight:700">${nama}</span></div>
      `;

      if (adaPemenang) {
        isiCard += `
          <div style="margin-top:8px;">⭐ <b>${pemenang.total.toFixed(1)}</b></div>
          <a href="${pemenang.linkVideo || '#'}" target="_blank" style="display:inline-block;margin-top:8px;color:${isDark ? '#81d4fa' : '#0077b6'};">▶️ Lihat Video</a>
        `;
      }

      card.innerHTML = isiCard;
      juaraBox.appendChild(card);
    });
  }
}

// =========================================================
// Event listeners
// =========================================================
selectSeason.addEventListener("change", () => {
  // reset pagination on season change
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
  // pastikan observer kutipan aktif saat load
  setupKutipanObserver();
  tampilkanDataSeason();
});