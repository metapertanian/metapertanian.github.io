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
// 🏅 Hitung Nilai Total
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
// 🔢 Ranking per Season
// ===============================
function prosesRanking(data, tampilkanPoin) {
  if (!tampilkanPoin) {
    // Jika poin belum dibuka → urut sesuai urutan input
    return data.map(p => ({ ...p, ...hitungTotal(p, false) }));
  }
  // Jika poin dibuka → urut berdasarkan nilai total
  return data.map(p => ({ ...p, ...hitungTotal(p, true) }))
             .sort((a, b) => b.total - a.total);
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
  const ranking = prosesRanking(data, tampilkanPoin);
  const wadah = document.getElementById("daftarPeserta");
  wadah.innerHTML = "";

  const awal = dataSeason.awal || "-";
  const akhir = dataSeason.akhir || "-";

  // 🏆 Info Umum
  infoRange.innerHTML = `
    <div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:10px; margin-top:8px;">
      <div style="font-weight:700; color:#fff;">${awal} - ${akhir}</div>
      <div style="margin-top:4px; font-size:0.95em;">
        <span style="color:#ffeb3b;">🎗️ Sponsor:</span><br>
        <span style="font-style:italic; color:#fdd835;">${sponsor}</span>
      </div>
    </div>
  `;

  // 🧑‍🎨 Daftar Peserta
  ranking.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "peserta show";
    const rankDisplay = tampilkanPoin ? `<div class="rank">#${i + 1}</div>` : "";

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
}

// ===============================
// 🎁 Juara Otomatis
// ===============================
function tampilkanHadiah() {
  const wadah = document.getElementById("hadiahList");
  wadah.innerHTML = "";

  const season = selectSeason.value;
  const dataSeason = dataJuara[season];
  const tampilkanPoin = dataSeason.Poin === true || dataSeason.Poin === "true";
  const data = dataSeason.kreator || [];
  const ranking = prosesRanking(data, tampilkanPoin);
  const sudahMenang = new Set();

  function pilihUnik(arr) {
    return arr.find(p => !sudahMenang.has(p.nama));
  }

  const juara1 = tampilkanPoin ? pilihUnik(ranking) : null;
  if (juara1) sudahMenang.add(juara1.nama);
  const juara2 = tampilkanPoin ? pilihUnik(ranking) : null;
  if (juara2) sudahMenang.add(juara2.nama);
  const juara3 = tampilkanPoin ? pilihUnik(ranking) : null;
  if (juara3) sudahMenang.add(juara3.nama);

  const ideTerbaik = tampilkanPoin ? pilihUnik(ranking.sort((a,b)=>b.ideKonsepNilai - a.ideKonsepNilai)) : null;
  const viralTertinggi = tampilkanPoin ? pilihUnik(ranking.sort((a,b)=>b.viral - a.viral)) : null;
  const lucu = tampilkanPoin ? pilihUnik(ranking.filter(d=>d.ideKonsepTipe.toLowerCase()==="humoris").sort((a,b)=>b.ideKonsepNilai - a.ideKonsepNilai)) : null;
  const lokal = tampilkanPoin ? pilihUnik(ranking.sort((a,b)=>b.nuansaLokal - a.nuansaLokal)) : null;
  const inspiratif = tampilkanPoin ? pilihUnik(ranking.filter(d=>d.ideKonsepTipe.toLowerCase()==="inspiratif").sort((a,b)=>b.ideKonsepNilai - a.ideKonsepNilai)) : null;

  const hadiahKategori = [
    { kategori: "Juara 1", hadiah: "Paket Data + 100rb + Sertifikat", juara: juara1 },
    { kategori: "Juara 2", hadiah: "Paket Data + 75rb + Sertifikat", juara: juara2 },
    { kategori: "Juara 3", hadiah: "Paket Data + 50rb + Sertifikat", juara: juara3 },
    { kategori: "Ide Konsep Terbaik", hadiah: "Paket Data + 40rb + Sertifikat", juara: ideTerbaik },
    { kategori: "Konten Terfavorit", hadiah: "Paket Data + 35rb + Sertifikat", juara: viralTertinggi },
    { kategori: "Konten Terlucu", hadiah: "Paket Data + 30rb + Sertifikat", juara: lucu },
    { kategori: "Paling Tanjung Bulan", hadiah: "Paket Data + 25rb + Sertifikat", juara: lokal },
    { kategori: "Paling Inspiratif", hadiah: "Paket Data + 25rb + Sertifikat", juara: inspiratif }
  ];

  hadiahKategori.forEach(h => {
    const juaraData = tampilkanPoin && h.juara
      ? `<div class="juara">🏆 ${h.juara.nama} <span class="poin">(${h.juara.total.toFixed(1)} pts)</span></div>`
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

selectSeason.addEventListener("change", () => {
  tampilkanDataSeason();
  tampilkanHadiah();
});

tampilkanDataSeason();
tampilkanHadiah();