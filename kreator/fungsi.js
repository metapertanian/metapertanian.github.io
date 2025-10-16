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
  "Kreator hebat lahir dari dusun yang kecil, tapi mimpi yang besar.",
  "Jangan tunggu viral, buatlah karya yang bernilai."
];
let indexKutipan = 0, indexHuruf = 0, intervalHuruf;
function tampilkanKutipanHurufDemiHuruf() {
  const elemen = document.getElementById("kutipan");
  const teks = kutipanList[indexKutipan];
  elemen.textContent = "";
  const cursor = document.createElement("span");
  cursor.className = "cursor";
  cursor.textContent = "|";
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

// Tambahkan elemen info range nilai
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
<li>Lomba ini untuk umum.</li>
<li>Lokasi video harus berada di <b>Tanjung Bulan</b>.</li>
<li>Pengeditan boleh dilakukan di mana saja.</li>
<li>Konten hasil editan sendiri dan belum pernah diunggah.</li>
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
🚀 Performa Viral: poin tak terbatas<br>
dihitung otomatis dari jumlah like, komen, dan share.<br><br>
kamu bisa mengajak teman/saudara untuk menaikkan like/komen/share. tapi tidak diperbolehkan melakukan komen spam, membeli atau menggunakan bot.<br><br>
yang ketahuan curang akan dikurangi poin atau didiskualifikasi.
`;

// ===============================
// ⚙️ Pengaturan
// ===============================
const tampilkanPoin = false; // ⬅️ ubah true/false untuk mode tampilan

// ===============================
// 🏅 Fungsi Hitung Nilai
// ===============================
function hitungTotal(p) {
  const viral = (p.like * 1.0) + (p.komen * 1.5) + (p.share * 1.5);
  const nilaiKreatif = (p.ideKonsepNilai * 1.5) + (p.editing) + (p.karakter * 0.5);
  const nilaiLokal = (p.nuansaLokal) + (p.dampakPositif);
  const total = Math.round(nilaiKreatif + nilaiLokal + viral);
  return { total, nilaiKreatif, nilaiLokal, viral };
}

// ===============================
// 🔢 Ranking (Jika poin aktif)
// ===============================
function prosesRanking(data) {
  return data.map(p => ({ ...p, ...hitungTotal(p) }))
             .sort((a, b) => b.total - a.total);
}

// ===============================
// 🎁 Hadiah + Juara Otomatis
// ===============================
function tampilkanHadiah() {
  const wadah = document.getElementById("hadiahList");
  wadah.innerHTML = "";

  const data = dataJuara[selectSeason.value].kreator;
  const ranking = tampilkanPoin ? prosesRanking(data) : data.map(p => ({ ...p, ...hitungTotal(p) }));

  const juara1 = ranking[0];
  const juara2 = ranking[1];
  const juara3 = ranking[2];

  const ideTerbaik = [...ranking].sort((a,b)=>b.ideKonsepNilai - a.ideKonsepNilai)[0];
  const viralTertinggi = [...ranking].sort((a,b)=>b.viral - a.viral)[0];
  const lucu = ranking.filter(d=>d.ideKonsepTipe.toLowerCase()==="humoris").sort((a,b)=>b.ideKonsepNilai - a.ideKonsepNilai)[0];
  const lokal = [...ranking].sort((a,b)=>b.nuansaLokal - a.nuansaLokal)[0];
  const inspiratif = ranking.filter(d=>d.ideKonsepTipe.toLowerCase()==="inspiratif").sort((a,b)=>b.ideKonsepNilai - a.ideKonsepNilai)[0];

  const hadiahKategori = [
    { kategori: "Juara 1", hadiah: "Paket Data + Uang 100rb + Sertifikat", juara: tampilkanPoin ? juara1 : null },
    { kategori: "Juara 2", hadiah: "Paket Data + Uang 75rb + Sertifikat", juara: tampilkanPoin ? juara2 : null },
    { kategori: "Juara 3", hadiah: "Paket Data + Uang 50rb + Sertifikat", juara: tampilkanPoin ? juara3 : null },
    { kategori: "Ide Konsep Terbaik", hadiah: "Paket Data + Uang 40rb + Sertifikat", juara: tampilkanPoin ? ideTerbaik : null },
    { kategori: "Konten Terfavorit", hadiah: "Paket Data + Uang 35rb + Sertifikat", juara: tampilkanPoin ? viralTertinggi : null },
    { kategori: "Konten Terlucu", hadiah: "Paket Data + Uang 30rb + Sertifikat", juara: tampilkanPoin ? lucu : null },
    { kategori: "Paling Tanjung Bulan", hadiah: "Paket Data + Uang 25rb + Sertifikat", juara: tampilkanPoin ? lokal : null },
    { kategori: "Paling Inspiratif", hadiah: "Paket Data + Uang 25rb + Sertifikat", juara: tampilkanPoin ? inspiratif : null }
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
tampilkanHadiah();

// ===============================
// 📊 Data Peserta
// ===============================
function animateValue(el, start, end, duration) {
  let startTime = null;
  function anim(currentTime) {
    if (!startTime) startTime = currentTime;
    const progress = Math.min((currentTime - startTime) / duration, 1);
    el.textContent = (start + (end - start) * progress).toFixed(1);
    if (progress < 1) requestAnimationFrame(anim);
  }
  requestAnimationFrame(anim);
}

function tampilkanDataSeason() {
  const season = selectSeason.value;
  const data = dataJuara[season].kreator;
  const ranking = tampilkanPoin ? prosesRanking(data) : data.map(p => ({ ...p, ...hitungTotal(p) }));

  const wadah = document.getElementById("daftarPeserta");
  wadah.innerHTML = "";

  const awal = dataJuara[season].awal || "-";
  const akhir = dataJuara[season].akhir || "-";
  infoRange.textContent = `periode: ${awal} - ${akhir}`;

  ranking.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "peserta show";
    div.innerHTML = `
      ${tampilkanPoin ? `<div class="rank">#${i + 1}</div>` : ""}
      <div class="nama">${p.nama.toUpperCase()}</div>
      <div class="nilai">
        💡 Kreativitas: <span>${p.nilaiKreatif.toFixed(1)}</span><br>
        🏡 Lokal: <span>${p.nilaiLokal.toFixed(1)}</span><br>
        ${tampilkanPoin ? `🚀 Viral: <span>${p.viral.toFixed(1)}</span><br>` : ""}
      </div>
      <div class="total">⭐ <span class="angka">0.0</span></div>
      <a href="${p.linkVideo}" target="_blank" class="link">📺 Lihat Video</a>
    `;
    wadah.appendChild(div);

    const totalEl = div.querySelector(".angka");
    animateValue(totalEl, 0, p.total, 2000 + i * 250);
  });
}
tampilkanDataSeason();
selectSeason.addEventListener("change", tampilkanDataSeason);

// ===============================
// 🎨 Styling
// ===============================
const style = document.createElement("style");
style.innerHTML = `
body { background:#111; color:#fff; font-family:'Segoe UI',sans-serif; overflow-x:hidden; }
.cursor { display:inline-block; animation:blink 0.8s infinite; color:#4caf50; }
@keyframes blink {0%,50%,100%{opacity:1;}25%,75%{opacity:0;}}

.hadiah-card {
  background: linear-gradient(145deg,#0f2027,#203a43,#2c5364);
  color:#fff; border-radius:14px; padding:16px; margin:12px 0;
  box-shadow:0 4px 12px rgba(0,0,0,0.3); transition:0.3s;
}
.hadiah-card:hover { transform:scale(1.03); }
.hadiah-card .judul { font-weight:bold; font-size:1.1em; margin-bottom:6px; }
.hadiah-card .isi { font-size:0.95em; opacity:0.9; margin-bottom:6px; }
.hadiah-card .juara { font-size:0.9em; background:#ffffff1a; padding:4px 8px; border-radius:8px; }

.peserta {
  background:#181818; border-radius:14px; padding:16px; margin:10px 0;
  box-shadow:0 2px 5px rgba(0,0,0,0.3); color:#fff; transition:0.3s ease;
}
.peserta:hover { transform:translateY(-3px); background:#1e1e1e; }
.peserta .rank { font-weight:bold; color:#4caf50; }
.peserta .nama { font-size:1.1em; margin:4px 0; }
.peserta .total { font-weight:bold; color:#ffd54f; margin-top:4px; font-size:1.05em; }
.peserta .link { display:block; margin-top:6px; color:#81d4fa; text-decoration:none; font-size:0.9em; }
.peserta .nilai { font-size:0.9em; opacity:0.95; }
`;
document.head.appendChild(style);