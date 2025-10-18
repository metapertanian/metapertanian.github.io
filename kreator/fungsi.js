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
  elemen.style.color = "#ffe082";
  elemen.style.textShadow = "0 0 10px rgba(255,255,255,0.3)";

  const cursor = document.createElement("span");
  cursor.textContent = "|";
  cursor.style.color = "#ffd54f";
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
infoRange.style.color = "#ccc";
infoRange.style.fontSize = "0.9em";
infoRange.style.marginTop = "6px";
selectSeason.insertAdjacentElement("afterend", infoRange);

// ===============================
// 🔎 Kolom Pencarian + Pagination
// ===============================
const searchContainer = document.createElement("div");
searchContainer.style.textAlign = "center";
searchContainer.style.margin = "10px 0";
searchContainer.innerHTML = `
  <input type="text" id="searchNama" placeholder="Cari nama peserta..." 
  style="padding:8px 12px; border-radius:8px; width:70%; max-width:300px; border:none; outline:none; background:#222; color:#fff; text-align:center;">
`;
document.getElementById("poinKreator").insertAdjacentElement("afterend", searchContainer);

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
<br>
<b>Poin Juri:</b><br>
💡 Kreativitas:<br>
• ide konsep (150),<br>
• editing (100),<br>
• karakter (50).<br>
🏡 Dampak Dusun:<br>
• nuansa (100),<br>
• dampak positif (100).<br>
<b>Total Maksimal:</b> 500 poin.<br><br>
<b>Poin TikTok:</b><br>
🚀 Viral dihitung otomatis (like, komen, share).<br><br>
Dilarang spam komen, beli like/share, atau bot.
`;

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
  infoRange.innerHTML = `
    <div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:10px; margin-top:8px;">
      <div style="font-weight:700; color:#fff;">${awal} - ${akhir}</div>
      <div style="margin-top:4px; font-size:0.95em;">
        <span style="color:#ffeb3b;">🎗️ Sponsor:</span><br>
        <span style="font-style:italic; color:#fdd835;">${sponsor}</span>
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

  // 🔢 Pagination Navigation
  const pagination = document.createElement("div");
  pagination.style.textAlign = "center";
  pagination.style.margin = "15px 0";
  pagination.innerHTML = `
    <button ${currentPage === 1 ? "disabled" : ""} id="prevPage" style="margin-right:10px;">⬅️</button>
    <span style="color:#fff;">Halaman ${currentPage} / ${totalPages}</span>
    <button ${currentPage === totalPages ? "disabled" : ""} id="nextPage" style="margin-left:10px;">➡️</button>
  `;
  wadah.appendChild(pagination);

  document.getElementById("prevPage").onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      tampilkanDataSeason();
    }
  };
  document.getElementById("nextPage").onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      tampilkanDataSeason();
    }
  };
}

document.getElementById("searchNama").addEventListener("input", () => {
  currentPage = 1;
  tampilkanDataSeason();
});

selectSeason.addEventListener("change", () => {
  currentPage = 1;
  tampilkanDataSeason();
  tampilkanHadiah();
});

// ===============================
// 🎁 Juara Otomatis (tetap sama)
// ===============================
function tampilkanHadiah() {
  const wadah = document.getElementById("hadiahList");
  wadah.innerHTML = "";

  const season = selectSeason.value;
  const dataSeason = dataJuara[season];
  const tampilkanPoin = dataSeason.Poin === true || dataSeason.Poin === "true";
  const data = dataSeason.kreator || [];
  const ranking = data.map(p => ({ ...p, ...hitungTotal(p, tampilkanPoin) }))
                      .sort((a, b) => b.total - a.total);
  const sudahMenang = new Set();
  const hadiahList = dataSeason.Hadiah || [];

  function pilihPemenang(filter, posisi) {
    let kandidat = ranking;
    if (posisi !== undefined) {
      const juara = kandidat[posisi - 1];
      if (juara && !sudahMenang.has(juara.nama)) {
        sudahMenang.add(juara.nama);
        return juara;
      }
    }
    if (filter) {
      if (typeof filter === "string") {
        kandidat = kandidat.filter(p => (p.ideKonsepTipe || "").toLowerCase() === filter.toLowerCase());
      } else if (typeof filter === "object") {
        const { field, value, mode } = filter;
        if (mode === "max") kandidat = [...kandidat].sort((a, b) => (b[field] || 0) - (a[field] || 0));
        else if (value) kandidat = kandidat.filter(p => (p[field] || "").toLowerCase() === value.toLowerCase());
      }
    }
    const juara = kandidat.find(p => !sudahMenang.has(p.nama));
    if (juara) sudahMenang.add(juara.nama);
    return juara;
  }

  hadiahList.forEach(h => {
    let juara = null;
    if (tampilkanPoin) {
      if (h.kategori.toLowerCase().includes("juara 1")) juara = pilihPemenang(null, 1);
      else if (h.kategori.toLowerCase().includes("juara 2")) juara = pilihPemenang(null, 2);
      else if (h.kategori.toLowerCase().includes("juara 3")) juara = pilihPemenang(null, 3);
      else if (h.filter) juara = pilihPemenang(h.filter);
      else juara = pilihPemenang();
    }
    const juaraData = tampilkanPoin && juara
      ? `<div class="juara">🏆 ${juara.nama} <span class="poin">(${juara.total.toFixed(1)} pts)</span></div>`
      : `<div class="juara">⏳ Belum diumumkan</div>`;
    const div = document.createElement("div");
    div.className = "hadiah-card";
    div.innerHTML = `
      <div class="judul">${h.kategori}</div>
      <div class="isi">${h.hadiah}</div>
      ${juaraData}
    `;
    wadah.appendChild(div);
  });
}

tampilkanDataSeason();
tampilkanHadiah();