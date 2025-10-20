// =========================================================
// 🌗 Tema Terang & Gelap
// =========================================================
function toggleTheme() {
  document.body.classList.toggle("dark-theme");
  const isDark = document.body.classList.contains("dark-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  applyThemeColors();
  setTimeout(() => tampilkanKutipanHurufDemiHuruf(), 50);
  tampilkanDataSeason();
}

// Terapkan warna tema + hilangkan garis putih bawah layar
function applyThemeColors() {
  const isDark = document.body.classList.contains("dark-theme");
  document.documentElement.style.setProperty("--bg-color", isDark ? "#121212" : "#f5f5f5");
  document.documentElement.style.setProperty("--text-color", isDark ? "#f1f1f1" : "#222");
  document.documentElement.style.setProperty("--card-bg", isDark ? "rgba(255,255,255,0.06)" : "#fff");
  document.documentElement.style.setProperty("--input-bg", isDark ? "#1e1e1e" : "#fff");
  document.documentElement.style.setProperty("--shadow", isDark ? "0 2px 8px rgba(255,255,255,0.08)" : "0 2px 8px rgba(0,0,0,0.12)");
  document.documentElement.style.setProperty("--highlight", isDark ? "#ffeb3b" : "#b8860b");

  // 🔧 Hapus garis putih di bawah layar
  document.documentElement.style.cssText = `
    height:100%;
    overflow-x:hidden;
    margin:0;
    padding:0;
    background:var(--bg-color);
  `;
  document.body.style.cssText = `
    min-height:100vh;
    overflow-x:hidden;
    margin:0;
    padding:0;
    background:var(--bg-color);
  `;
}

window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (!savedTheme || savedTheme === "dark") document.body.classList.add("dark-theme");
  applyThemeColors();
  setTimeout(() => tampilkanKutipanHurufDemiHuruf(), 100);
  document.querySelectorAll("section[id]").forEach(sec => (sec.style.scrollMarginTop = "100px"));
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
let indexKutipan = 0,
  indexHuruf = 0,
  intervalHuruf;

function tampilkanKutipanHurufDemiHuruf() {
  const elemen = document.getElementById("kutipan");
  if (!elemen) return;
  const teks = kutipanList[indexKutipan];
  const isDark = document.body.classList.contains("dark-theme");
  elemen.textContent = "";
  elemen.style.fontFamily = "'Poppins','Inter',sans-serif";
  elemen.style.fontSize = "1.2rem";
  elemen.style.fontWeight = "600";
  elemen.style.textAlign = "center";
  elemen.style.transition = "color 0.3s ease";
  elemen.style.color = isDark ? "#ffe082" : "#111";
  elemen.style.textShadow = isDark
    ? "0 0 10px rgba(255,255,255,0.3)"
    : "0 0 3px rgba(0,0,0,0.1)";
  requestAnimationFrame(() => {
    const cursor = document.createElement("span");
    cursor.textContent = "|";
    cursor.style.color = isDark ? "#ffd54f" : "#555";
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
  });
}

// =========================================================
// 📅 Dropdown Season
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
infoRange.style.fontSize = "0.9em";
infoRange.style.marginTop = "6px";
selectSeason.insertAdjacentElement("afterend", infoRange);

// =========================================================
// 🔎 Pencarian Kreator
// =========================================================
const searchContainer = document.createElement("div");
searchContainer.style.textAlign = "center";
searchContainer.style.margin = "10px 0";
searchContainer.innerHTML = `
  <input type="text" id="searchNama" placeholder="Cari nama kreator..." 
  style="padding:8px 12px;border-radius:8px;width:70%;max-width:300px;
  border:1px solid var(--text-color);outline:none;
  background:var(--input-bg);color:var(--text-color);
  text-align:center;transition:0.3s;">    
`;
const poinTitle = document.querySelector("#poin h2");
if (poinTitle) poinTitle.insertAdjacentElement("afterend", searchContainer);

let currentPage = 1;
const itemsPerPage = 5;

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

  const viral = tampilkanPoin ? like * 1 + komen * 1.5 + share * 1.5 : 0;
  const nilaiKreatif = ide * 1.5 + edit + karakter * 0.5;
  const nilaiLokal = nuansa + dampak;
  const total = +(nilaiKreatif + nilaiLokal + (tampilkanPoin ? viral : 0)).toFixed(1);
  return { total, nilaiKreatif, nilaiLokal, viral };
}

// =========================================================
// 🔍 Filter Juara
// =========================================================
function cariPemenangBerdasarkanFilter(dataSeason, filter, tampilkanPoin) {
  if (!tampilkanPoin) return null;
  const data = dataSeason.kreator.map(p => ({ ...p, ...hitungTotal(p, true) }));
  if (typeof filter === "string")
    return data.find(p =>
      p.ideKonsepTipe?.toLowerCase().includes(filter.toLowerCase())
    );
  if (typeof filter === "object" && filter.field) {
    if (filter.mode === "max")
      return data.reduce((a, b) => (b[filter.field] > a[filter.field] ? b : a));
    else if (filter.value)
      return data.find(p => p[filter.field] === filter.value);
  }
  return null;
}

// =========================================================
// 📊 Tampilkan Data Season
// =========================================================
function tampilkanDataSeason() {
  const season = selectSeason.value;
  const dataSeason = dataJuara[season];
  if (!dataSeason) return;

  const tampilkanPoin =
    dataSeason.Poin === true ||
    dataSeason.Poin === "true" ||
    dataSeason.Poin === 1;

  let ranking = dataSeason.kreator.map(p => ({
    ...p,
    ...hitungTotal(p, tampilkanPoin),
  }));
  if (tampilkanPoin) ranking.sort((a, b) => b.total - a.total);

  const wadah = document.getElementById("daftarPeserta");
  wadah.innerHTML = "";
  const isDark = document.body.classList.contains("dark-theme");

  // 🎨 Info Season
  infoRange.innerHTML = `
    <div style="background:${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"};padding:12px;border-radius:12px;margin-top:8px;">
      <div style="font-size:1.1em;font-weight:700;color:${isDark ? "#ffeb3b" : "#b8860b"};">
        🎬 Tema: <span style="color:${isDark ? "#fff" : "#111"};">${dataSeason.tema || "Tanpa Tema"}</span>
      </div>
      <div style="font-size:0.95em;margin-top:6px;line-height:1.4;">${dataSeason.deskripsi || ""}</div><br>
      <div style="margin-top:6px;color:${isDark ? "#bbb" : "#333"};">📅 ${dataSeason.periode || "-"}</div><br>
      <div style="margin-top:4px;font-size:0.95em;">
        <span style="color:${isDark ? "#ffeb3b" : "#b8860b"};">🎗️ Sponsor:</span><br>
        <span style="font-style:italic;color:${isDark ? "#fdd835" : "#5a4b00"};">${dataSeason.Sponsor || "-"}</span>
      </div>
    </div>`;

  // 📜 Aturan Lomba
  document.getElementById("aturanText").innerHTML = `
    • Lomba terbuka untuk umum.<br>
    • Konten sesuai tema: <b>${dataSeason.tema}</b><br>
    • ${dataSeason.deskripsi}<br><br>
    • Video hasil karya sendiri dan belum pernah diunggah.<br>
    • Gaya bebas: lucu, edukatif, dokumenter, cinematic, atau motivasi.<br><br>
    <b>Poin Juri:</b><br>
    💡 Kreativitas (maks 300):<br>
    ide konsep (150), editing (100), karakter (50).<br><br>
    🏡 Lokal (maks 200):<br>
    nuansa lokal (100), dampak positif (100).<br><br>
    <b>Poin TikTok:</b><br>
    🚀 Viral: poin tak terbatas, dihitung dari like, komen, share.<br><br>
    • Diperbolehkan mengajak teman atau saudara untuk menaikkan like, komen, share.<br>
    • Dilarang spam/bot/beli untuk menaikkan like, komen, share.<br>
    • Pelanggaran akan dikurangi poin atau bahkan diskualifikasi.
  `;

  // 🔍 Filter + Pagination + Hadiah (tanpa ubah struktur)
  const keyword = document.getElementById("searchNama").value.toLowerCase();
  const filtered = keyword ? ranking.filter(p => p.nama.toLowerCase().includes(keyword)) : ranking;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  if (currentPage > totalPages) currentPage = 1;
  const start = (currentPage - 1) * itemsPerPage;
  const pageItems = filtered.slice(start, start + itemsPerPage);

  pageItems.forEach(p => {
    const div = document.createElement("div");
    div.className = "peserta";
    div.style.cssText = `
      background:var(--card-bg);
      border-radius:12px;
      box-shadow:var(--shadow);
      padding:12px;
      margin:10px 0;
      transition:transform .2s;
    `;
    div.onmouseover = () => (div.style.transform = "translateY(-3px)");
    div.onmouseleave = () => (div.style.transform = "translateY(0)");

    const rank = tampilkanPoin ? `<span style="color:var(--highlight)">#${ranking.indexOf(p) + 1}</span> ` : "";
    div.innerHTML = `
      <div style="font-weight:700;">${rank}${p.nama.toUpperCase()}</div>
      <div>
        💡 Kreativitas: <b>${p.nilaiKreatif.toFixed(1)}</b><br>
        🏡 Lokal: <b>${p.nilaiLokal.toFixed(1)}</b><br>
        🚀 Viral: ${tampilkanPoin ? `<b>${p.viral.toFixed(1)}</b>` : `<span style="color:gold">🔒</span>`}
      </div>
      <div style="margin-top:5px;">⭐ <b style="color:var(--highlight);">${p.total.toFixed(1)}</b></div>
      <a href="${p.linkVideo}" target="_blank" style="display:inline-block;margin-top:8px;color:${isDark ? "#4fc3f7" : "#0077b6"};">▶️ Lihat Video</a>
    `;
    wadah.appendChild(div);
  });

  // 📄 Pagination
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  pagination.style.cssText = "text-align:center;margin-top:20px;";
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.style.cssText = `
      margin:3px;
      padding:6px 10px;
      border-radius:8px;
      border:none;
      cursor:pointer;
      background:${i === currentPage ? "var(--highlight)" : isDark ? "#333" : "#ddd"};
      color:${i === currentPage ? "#000" : isDark ? "#fff" : "#111"};
      transition:all .2s;
    `;
    btn.onmouseover = () => (btn.style.filter = "brightness(1.2)");
    btn.onmouseleave = () => (btn.style.filter = "brightness(1)");
    btn.onclick = () => {
      currentPage = i;
      tampilkanDataSeason();
      document.getElementById("poin").scrollIntoView({ behavior: "smooth" });
    };
    pagination.appendChild(btn);
  }

  // 🏆 Hadiah Juara
  const juaraBox = document.getElementById("hadiahList");
  juaraBox.innerHTML = "";
  (dataSeason.Hadiah || []).forEach(h => {
    const pemenang = tampilkanPoin
      ? h.filter
        ? cariPemenangBerdasarkanFilter(dataSeason, h.filter, true)
        : ranking[parseInt(h.kategori.replace(/\D/g, "")) - 1]
      : null;
    const adaPemenang = tampilkanPoin && pemenang;
    const nama = adaPemenang ? pemenang.nama : "Belum diumumkan";

    const card = document.createElement("div");
    card.className = "hadiah-card";
    card.style.cssText = `
      background:linear-gradient(145deg, var(--card-bg), ${isDark ? "#1a1a1a" : "#f9f9f9"});
      color:var(--text-color);
      border-radius:14px;
      padding:18px;
      margin:12px;
      box-shadow:var(--shadow);
      text-align:left;
      line-height:1.5;
      transition:transform .2s, box-shadow .2s;
    `;
    card.onmouseover = () => (card.style.transform = "scale(1.02)");
    card.onmouseleave = () => (card.style.transform = "scale(1)");

    card.innerHTML = `
      <div style="font-size:1.1em;font-weight:700;margin-bottom:6px;">${h.kategori}</div>
      🎁 ${h.hadiah}<br>
      🏆 <span style="color:var(--highlight);font-weight:700;">${nama}</span>
      ${adaPemenang ? `
        <br>⭐ <b>${pemenang.total.toFixed(1)}</b>
        <br><a href="${pemenang.linkVideo}" target="_blank" 
        style="display:inline-block;margin-top:6px;color:${isDark ? "#81d4fa" : "#0077b6"};">▶️ Lihat Video</a>` : ""}
    `;
    juaraBox.appendChild(card);
  });
}

selectSeason.addEventListener("change", tampilkanDataSeason);
document.getElementById("searchNama").addEventListener("input", tampilkanDataSeason);
window.addEventListener("load", tampilkanDataSeason);