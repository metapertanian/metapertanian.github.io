// ===============================
// 🌗 Tema Terang & Gelap
// ===============================
function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  applyThemeColors();
  tampilkanKutipanHurufDemiHuruf();
  tampilkanDataSeason();
}

// Terapkan warna tema
function applyThemeColors() {
  const isDark = document.body.classList.contains('dark-theme');
  document.documentElement.style.setProperty('--bg-color', isDark ? '#121212' : '#f5f5f5');
  document.documentElement.style.setProperty('--text-color', isDark ? '#f1f1f1' : '#222');
  document.documentElement.style.setProperty('--card-bg', isDark ? 'rgba(255,255,255,0.05)' : '#fff');
  document.documentElement.style.setProperty('--input-bg', isDark ? '#1e1e1e' : '#fff');
  document.documentElement.style.setProperty('--shadow', isDark ? '0 2px 6px rgba(255,255,255,0.08)' : '0 2px 6px rgba(0,0,0,0.1)');
  document.documentElement.style.setProperty('--highlight', isDark ? '#ffeb3b' : '#b8860b');
}

window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (!savedTheme || savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }
  applyThemeColors();
});

// ===============================
// 🔘 Navbar Toggle
// ===============================
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

// ===============================
// 💬 Kutipan Bergantian
// ===============================
const kutipanList = [
  "Dari satu kamera, tersimpan seribu cerita.",
  "Jangan tunggu viral, buatlah karya yang bernilai.",
  "Kreator hebat lahir dari dusun kecil, tapi mimpi yang besar.",
];
let indexKutipan = 0, indexHuruf = 0, intervalHuruf;

function tampilkanKutipanHurufDemiHuruf() {
  const elemen = document.getElementById("kutipan");
  const teks = kutipanList[indexKutipan];
  elemen.textContent = "";
  elemen.style.fontFamily = "'Poppins','Inter',sans-serif";
  elemen.style.fontSize = "1.2rem";
  elemen.style.fontWeight = "600";
  elemen.style.textAlign = "center";

  const isDark = document.body.classList.contains("dark-theme");
  elemen.style.color = isDark ? "#ffe082" : "#333";
  elemen.style.textShadow = isDark ? "0 0 10px rgba(255,255,255,0.3)" : "none";

  const cursor = document.createElement("span");
  cursor.textContent = "|";
  cursor.style.color = isDark ? "#ffd54f" : "#444";
  elemen.appendChild(cursor);

  indexHuruf = 0;
  clearInterval(intervalHuruf);
  intervalHuruf = setInterval(() => {
    if (indexHuruf < teks.length) {
      cursor.before(teks[indexHuruf]);
      indexHuruf++;
    } else {
      clearInterval(intervalHuruf);
      setTimeout(() => {
        indexKutipan = (indexKutipan + 1) % kutipanList.length;
        tampilkanKutipanHurufDemiHuruf();
      }, 3000);
    }
  }, 80);
}
tampilkanKutipanHurufDemiHuruf();

// ===============================
// 📅 Dropdown Season
// ===============================
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
infoRange.style.fontSize = "0.9em";
infoRange.style.marginTop = "6px";
selectSeason.insertAdjacentElement("afterend", infoRange);

// ===============================
// 🔎 Pencarian Peserta
// ===============================
const searchContainer = document.createElement("div");
searchContainer.style.textAlign = "center";
searchContainer.style.margin = "10px 0";
searchContainer.innerHTML = `
  <input type="text" id="searchNama" placeholder="Cari nama peserta..." 
  style="padding:8px 12px;border-radius:8px;width:70%;max-width:300px;
  border:1px solid var(--text-color);outline:none;
  background:var(--input-bg);color:var(--text-color);
  text-align:center;transition:0.3s;">
`;

const poinTitle = document.querySelector("#poin h2");
if (poinTitle) poinTitle.insertAdjacentElement("afterend", searchContainer);

let currentPage = 1;
const itemsPerPage = 5;

// ===============================
// 📜 Aturan Lomba
// ===============================
document.getElementById("aturanText").innerHTML = `
<ul style="line-height:1.6">
<li>Lomba terbuka untuk umum.</li>
<li>Video harus diambil di <b>Tanjung Bulan</b>.</li>
<li>Edit boleh dilakukan di mana saja.</li>
<li>Video hasil karya sendiri (belum pernah diunggah).</li>
<li>Tema: kehidupan, kreativitas, dan inspirasi di Tanjung Bulan.</li>
<li>Gaya video: lucu, edukatif, dokumenter, cinematic, atau motivasi.</li>
</ul>
<br><b>Poin Juri:</b><br>
💡 Kreativitas:<br>
• ide konsep (150),<br>• editing (100),<br>• karakter (50).<br>
🏡 Dampak Dusun:<br>• nuansa (100),<br>• dampak positif (100).<br>
<b>Total Maksimal:</b> 500 poin.<br><br>
<b>Poin TikTok:</b><br>🚀 Viral dihitung otomatis (like, komen, share).<br><br>
Dilarang spam komen, beli like/share, atau bot.
`;

// ===============================
// 🧮 Hitung Nilai
// ===============================
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

// ===============================
// 🔍 Filter Juara
// ===============================
function cariPemenangBerdasarkanFilter(dataSeason, filter, tampilkanPoin) {
  if (!tampilkanPoin) return null; // 🔒 Kunci jika poin belum dibuka
  const data = dataSeason.kreator.map(p => ({ ...p, ...hitungTotal(p, true) }));
  if (typeof filter === "string")
    return data.find(p => p.ideKonsepTipe?.toLowerCase().includes(filter.toLowerCase()));
  if (typeof filter === "object" && filter.field) {
    if (filter.mode === "max")
      return data.reduce((a, b) => (b[filter.field] > a[filter.field] ? b : a));
    else if (filter.value)
      return data.find(p => p[filter.field] === filter.value);
  }
  return null;
}

// ===============================
// 📊 Tampilkan Data Season
// ===============================
function tampilkanDataSeason() {
  const season = selectSeason.value;
  const dataSeason = dataJuara[season];
  if (!dataSeason) return;

  const data = dataSeason.kreator || [];
  const tampilkanPoin = !!dataSeason.Poin;
  const sponsor = dataSeason.Sponsor || "-";

  let ranking = data.map(p => ({ ...p, ...hitungTotal(p, tampilkanPoin) }));

  if (tampilkanPoin) ranking.sort((a, b) => b.total - a.total);

  const wadah = document.getElementById("daftarPeserta");
  wadah.innerHTML = "";

  const awal = dataSeason.awal || "-";
  const akhir = dataSeason.akhir || "-";
  const isDark = document.body.classList.contains("dark-theme");

  infoRange.innerHTML = `
  <div style="background:${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'};padding:10px;border-radius:10px;margin-top:8px;">
    <div style="font-weight:700;color:${isDark ? '#fff':'#222'};">${awal} - ${akhir}</div>
    <div style="margin-top:4px;font-size:0.95em;">
      <span style="color:${isDark ? '#ffeb3b':'#b8860b'};">🎗️ Sponsor:</span><br>
      <span style="font-style:italic;color:${isDark ? '#fdd835':'#5a4b00'};">${sponsor}</span>
    </div>
    ${!tampilkanPoin ? `<div style="margin-top:6px;color:${isDark ? '#ffcc80':'#b8860b'};font-size:0.9em;">⚠️ Poin viral belum dibuka</div>` : ""}
  </div>`;

  const keyword = document.getElementById("searchNama").value.toLowerCase();
  const filtered = ranking.filter(p => p.nama.toLowerCase().includes(keyword));

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  if (currentPage > totalPages) currentPage = 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  pageItems.forEach(p => {
    const div = document.createElement("div");
    div.className = "peserta show";
    div.innerHTML = `
      <div class="nama">${p.nama.toUpperCase()}</div>
      <div class="nilai">
        💡 Kreativitas: <span>${p.nilaiKreatif.toFixed(1)}</span><br>
        🏡 Lokal: <span>${p.nilaiLokal.toFixed(1)}</span><br>
        🚀 Viral: ${tampilkanPoin ? `<span>${p.viral.toFixed(1)}</span>` : `<span style="color:gold">🔒</span>`}
      </div>
      <div class="total">⭐ <span>${p.total.toFixed(1)}</span></div>
      <a href="${p.linkVideo}" target="_blank" class="link">📺 Lihat Video</a>`;
    wadah.appendChild(div);
  });

  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = (i === currentPage) ? "active" : "";
    btn.onclick = () => {
      currentPage = i;
      tampilkanDataSeason();
      document.getElementById("poin").scrollIntoView({ behavior: "smooth" });
    };
    pagination.appendChild(btn);
  }

  const juaraBox = document.getElementById("hadiahList");
  juaraBox.innerHTML = "";
  (dataSeason.Hadiah || []).forEach(h => {
    const pemenang = tampilkanPoin
      ? (h.filter ? cariPemenangBerdasarkanFilter(dataSeason, h.filter, true)
        : ranking[parseInt(h.kategori.replace(/\D/g, "")) - 1])
      : null;

    const nama = (tampilkanPoin && pemenang) ? pemenang.nama : "Belum diumumkan";

    const card = document.createElement("div");
    card.className = "hadiah-card";
    card.style.cssText = `
      background:var(--card-bg);
      color:var(--text-color);
      border-radius:12px;
      padding:15px;
      margin:10px;
      box-shadow:var(--shadow);
      text-align:center;
      transition:0.3s;
    `;
    card.innerHTML = `
      <b>${h.kategori}</b><br>
      🎁 ${h.hadiah}<br>
      🏆 <span style="color:var(--highlight)">${nama}</span>
    `;
    juaraBox.appendChild(card);
  });
}

selectSeason.addEventListener("change", tampilkanDataSeason);
document.getElementById("searchNama").addEventListener("input", tampilkanDataSeason);
window.addEventListener("load", tampilkanDataSeason);