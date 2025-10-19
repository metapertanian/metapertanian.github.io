function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeStyles(isDark);
}

// Saat halaman dimuat, ambil tema dari localStorage
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  const isDark = savedTheme === 'dark';
  if (isDark) document.body.classList.add('dark-theme');
  updateThemeStyles(isDark);
});

// 🔆 Fungsi update warna dinamis berdasarkan tema
function updateThemeStyles(isDark) {
  const kutipan = document.getElementById("kutipan");
  if (kutipan) {
    kutipan.style.color = isDark ? "#ffe082" : "#444";
    kutipan.style.textShadow = isDark ? "0 0 10px rgba(255,255,255,0.3)" : "none";
  }

  const infoRange = document.getElementById("infoRange");
  if (infoRange) {
    infoRange.style.color = isDark ? "#eee" : "#333";
  }
}

// ===============================
// 🔘 Navbar Toggle
// ===============================
function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("active");
}
document.querySelectorAll("#menu a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("menu").classList.remove("active");
  });
});

// ===============================
// 💬 Kutipan Bergantian
// ===============================
const kutipanList = [
  "Dari satu kamera, tersimpan seribu cerita.",
  "Jangan tunggu viral, buatlah karya yang bernilai.",
  "Kreator hebat lahir dari dusun yg kecil, tapi mimpi yg besar.",
];
let indexKutipan = 0, indexHuruf = 0, intervalHuruf;

function tampilkanKutipanHurufDemiHuruf() {
  const elemen = document.getElementById("kutipan");
  const teks = kutipanList[indexKutipan];
  elemen.textContent = "";
  elemen.style.fontFamily = "'Poppins', 'Inter', sans-serif";
  elemen.style.fontSize = "1.2rem";
  elemen.style.fontWeight = "600";
  elemen.style.textAlign = "center";

  const isDark = document.body.classList.contains('dark-theme');
  elemen.style.color = isDark ? "#ffe082" : "#333";
  elemen.style.textShadow = isDark ? "0 0 10px rgba(255,255,255,0.3)" : "none";

  const cursor = document.createElement("span");
  cursor.textContent = "|";
  cursor.style.color = isDark ? "#ffd54f" : "#666";
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
// 🔎 Kolom Pencarian
// ===============================
const searchContainer = document.createElement("div");
searchContainer.className = "search-container";
searchContainer.innerHTML = `
  <input type="text" id="searchNama" placeholder="Cari nama peserta..." 
  class="input-cari">
`;

const poinSection = document.getElementById("poin");
if (poinSection) poinSection.insertAdjacentElement("beforeend", searchContainer);

let currentPage = 1;
const itemsPerPage = 5;

// ===============================
// 🧮 Hitung Nilai
// ===============================
function hitungTotal(p, tampilkanPoin) {
  const like = Number(p.like) || 0;
  const komen = Number(p.komen) || 0;
  const share = Number(p.share) || 0;
  const ide = Number(p.ideKonsepNilai) || 0;
  const edit = Number(p.editing) || 0;
  const karakter = Number(p.karakter) || 0;
  const nuansa = Number(p.nuansaLokal) || 0;
  const dampak = Number(p.dampakPositif) || 0;

  const viral = (like * 1.0) + (komen * 1.5) + (share * 1.5);
  const nilaiKreatif = (ide * 1.5) + edit + (karakter * 0.5);
  const nilaiLokal = nuansa + dampak;
  const total = tampilkanPoin
    ? parseFloat((nilaiKreatif + nilaiLokal + viral).toFixed(1))
    : parseFloat((nilaiKreatif + nilaiLokal).toFixed(1));

  return { total, nilaiKreatif, nilaiLokal, viral };
}

// ===============================
// 🏆 Cari Pemenang
// ===============================
function cariPemenangBerdasarkanFilter(dataSeason, filter) {
  const data = dataSeason.kreator.map(p => ({ ...p, ...hitungTotal(p, true) }));

  if (typeof filter === "string") {
    return data.find(p => p.ideKonsepTipe && p.ideKonsepTipe.toLowerCase().includes(filter.toLowerCase()));
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

// ===============================
// 📊 Tampilkan Data Season
// ===============================
function tampilkanDataSeason() {
  const season = selectSeason.value;
  const dataSeason = dataJuara[season];
  if (!dataSeason) return;

  const data = dataSeason.kreator || [];
  const tampilkanPoin = dataSeason.Poin === true || dataSeason.Poin === "true";
  const sponsor = dataSeason.Sponsor || "-";

  const ranking = data
    .map(p => ({ ...p, ...hitungTotal(p, tampilkanPoin) }))
    .sort((a, b) => b.total - a.total);

  const wadah = document.getElementById("daftarPeserta");
  wadah.innerHTML = "";

  const awal = dataSeason.awal || "-";
  const akhir = dataSeason.akhir || "-";
  const isDark = document.body.classList.contains('dark-theme');

  infoRange.innerHTML = `
    <div style="background:${isDark ? 'rgba(255,255,255,0.05)' : '#f5f5f5'}; padding:10px; border-radius:10px;">
      <div style="font-weight:700; color:${isDark ? '#fff' : '#333'};">${awal} - ${akhir}</div>
      <div style="margin-top:4px; font-size:0.95em;">
        <span style="color:${isDark ? '#ffeb3b' : '#cc7a00'};">🎗️ Sponsor:</span><br>
        <span style="font-style:italic; color:${isDark ? '#fdd835' : '#333'};">${sponsor}</span>
      </div>
    </div>
  `;

  // 🔎 Filter nama
  const keyword = document.getElementById("searchNama").value.toLowerCase();
  const filtered = ranking.filter(p => p.nama.toLowerCase().includes(keyword));

  // 📄 Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  if (currentPage > totalPages) currentPage = 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  // 🎥 Tampilkan peserta
  pageItems.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "peserta show";
    const rankDisplay = tampilkanPoin ? `<div class="rank">#${startIndex + i + 1}</div>` : "";
    div.innerHTML = `
      ${rankDisplay}
      <div class="nama">${p.nama.toUpperCase()}</div>
      <div class="nilai">
        💡 Kreativitas: <span>${p.nilaiKreatif.toFixed(1)}</span><br>
        🏡 Lokal: <span>${p.nilaiLokal.toFixed(1)}</span><br>
        🚀 Viral: ${tampilkanPoin ? `<span>${p.viral.toFixed(1)}</span>` : `<span style="color:gold">🔒</span>`}
      </div>
      <div class="total">⭐ <span>${p.total.toFixed(1)}</span></div>
      <a href="${p.linkVideo}" target="_blank" class="link">📺 Lihat Video</a>
    `;
    wadah.appendChild(div);
  });

  // 📄 Pagination button
  const pagination = document.getElementById("pagination");
  if (pagination) {
    pagination.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = (i === currentPage) ? "active" : "";
      btn.onclick = () => {
        currentPage = i;
        tampilkanDataSeason();
      };
      pagination.appendChild(btn);
    }
  }

  // 🏆 Hadiah & Juara dinamis
  const juaraBox = document.getElementById("hadiahList");
  if (juaraBox) {
    juaraBox.innerHTML = "";
    (dataSeason.Hadiah || []).forEach(h => {
      const pemenang = tampilkanPoin
        ? (h.filter ? cariPemenangBerdasarkanFilter(dataSeason, h.filter) : ranking[parseInt(h.kategori.replace(/\D/g, "")) - 1])
        : null;
      const nama = pemenang ? pemenang.nama : "Belum diumumkan";
      const card = document.createElement("div");
      card.className = "hadiah";
      card.innerHTML = `
        <b>${h.kategori}</b><br>
        🎁 ${h.hadiah}<br>
        🏆 <span class="namaJuara">${nama}</span>
      `;
      juaraBox.appendChild(card);
    });
  }
}

// ===============================
// 📢 Event Listener
// ===============================
selectSeason.addEventListener("change", tampilkanDataSeason);
document.getElementById("searchNama").addEventListener("input", tampilkanDataSeason);

// 🚀 Jalankan Pertama Kali
window.addEventListener("load", tampilkanDataSeason);