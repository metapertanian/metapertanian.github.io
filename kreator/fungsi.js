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
Kamu bisa mengajak teman/saudara untuk menaikkan like/komen/share. Tapi tidak diperbolehkan melakukan komen spam, membeli atau menggunakan bot.<br><br>
Yang ketahuan curang akan dikurangi poin atau didiskualifikasi.
`;

// ===============================
// ⚙️ Pengaturan
// ===============================
const tampilkanPoin = false; // ubah true/false untuk mode tampilan

// ===============================
// 🏅 Fungsi Hitung Nilai (tanpa pembulatan kasar)
// ===============================
function hitungTotal(p) {
  const viral = (p.like * 1.0) + (p.komen * 1.5) + (p.share * 1.5);
  const nilaiKreatif = (p.ideKonsepNilai * 1.5) + (p.editing) + (p.karakter * 0.5);
  const nilaiLokal = (p.nuansaLokal) + (p.dampakPositif);
  const total = parseFloat((nilaiKreatif + nilaiLokal + viral).toFixed(2)); // tampilkan 2 desimal
  return { total, nilaiKreatif, nilaiLokal, viral };
}

// ===============================
// 🔢 Ranking
// ===============================
function prosesRanking(data) {
  return data.map(p => ({ ...p, ...hitungTotal(p) }))
             .sort((a, b) => b.total - a.total);
}

// ===============================
// 🎁 Hadiah + Juara Otomatis (1 Orang 1 Hadiah)
// ===============================
function tampilkanHadiah() {
  const wadah = document.getElementById("hadiahList");
  wadah.innerHTML = "";

  const season = selectSeason.value;
  const data = dataJuara[season].kreator;
  const ranking = prosesRanking(data);
  const sudahMenang = new Set();

  function pilihUnik(arr, sorter) {
    return arr.find(p => !sudahMenang.has(p.nama) && sorter(p));
  }

  const juara1 = pilihUnik(ranking, () => true);
  sudahMenang.add(juara1.nama);
  const juara2 = pilihUnik(ranking, p => p !== juara1);
  sudahMenang.add(juara2.nama);
  const juara3 = pilihUnik(ranking, p => ![juara1, juara2].includes(p));
  sudahMenang.add(juara3.nama);

  const ideTerbaik = pilihUnik(ranking.sort((a,b)=>b.ideKonsepNilai - a.ideKonsepNilai), () => true);
  if (ideTerbaik) sudahMenang.add(ideTerbaik.nama);

  const viralTertinggi = pilihUnik(ranking.sort((a,b)=>b.viral - a.viral), () => true);
  if (viralTertinggi) sudahMenang.add(viralTertinggi.nama);

  const lucu = pilihUnik(ranking.filter(d=>d.ideKonsepTipe.toLowerCase()==="humoris")
                              .sort((a,b)=>b.ideKonsepNilai - a.ideKonsepNilai), () => true);
  if (lucu) sudahMenang.add(lucu.nama);

  const lokal = pilihUnik(ranking.sort((a,b)=>b.nuansaLokal - a.nuansaLokal), () => true);
  if (lokal) sudahMenang.add(lokal.nama);

  const inspiratif = pilihUnik(ranking.filter(d=>d.ideKonsepTipe.toLowerCase()==="inspiratif")
                                     .sort((a,b)=>b.ideKonsepNilai - a.ideKonsepNilai), () => true);
  if (inspiratif) sudahMenang.add(inspiratif.nama);

  const hadiahKategori = [
    { kategori: "Juara 1", hadiah: "Paket Data + Uang 100rb + Sertifikat", juara: juara1 },
    { kategori: "Juara 2", hadiah: "Paket Data + Uang 75rb + Sertifikat", juara: juara2 },
    { kategori: "Juara 3", hadiah: "Paket Data + Uang 50rb + Sertifikat", juara: juara3 },
    { kategori: "Ide Konsep Terbaik", hadiah: "Paket Data + Uang 40rb + Sertifikat", juara: ideTerbaik },
    { kategori: "Konten Terfavorit", hadiah: "Paket Data + Uang 35rb + Sertifikat", juara: viralTertinggi },
    { kategori: "Konten Terlucu", hadiah: "Paket Data + Uang 30rb + Sertifikat", juara: lucu },
    { kategori: "Paling Tanjung Bulan", hadiah: "Paket Data + Uang 25rb + Sertifikat", juara: lokal },
    { kategori: "Paling Inspiratif", hadiah: "Paket Data + Uang 25rb + Sertifikat", juara: inspiratif }
  ];

  hadiahKategori.forEach(h => {
    const poinText = tampilkanPoin
      ? `(${h.juara ? h.juara.total.toFixed(2) : "0.00"} pts)`
      : `<span style="color:gold">🔒 Viral Terkunci</span>`;

    const juaraData = h.juara
      ? `<div class="juara">🏆 ${h.juara.nama} <span class="poin">${poinText}</span></div>`
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
selectSeason.addEventListener("change", tampilkanHadiah);
tampilkanHadiah();

// ===============================
// 📊 Data Peserta + Animasi Nilai
// ===============================
function animateValue(el, start, end, duration) {
  let startTime = null;
  function anim(currentTime) {
    if (!startTime) startTime = currentTime;
    const progress = Math.min((currentTime - startTime) / duration, 1);
    el.textContent = (start + (end - start) * progress).toFixed(2);
    if (progress < 1) requestAnimationFrame(anim);
  }
  requestAnimationFrame(anim);
}

function tampilkanDataSeason() {
  const season = selectSeason.value;
  const data = dataJuara[season].kreator;
  const ranking = prosesRanking(data);

  const wadah = document.getElementById("daftarPeserta");
  wadah.innerHTML = "";

  const awal = dataJuara[season].awal || "-";
  const akhir = dataJuara[season].akhir || "-";
  infoRange.textContent = `Periode: ${awal} - ${akhir}`;

  ranking.forEach((p, i) => {
    const viralText = tampilkanPoin
      ? `🚀 Viral: <span>${p.viral.toFixed(2)}</span><br>`
      : `🚀 Viral: <span style="color:gold">🔒</span><br>`;

    const div = document.createElement("div");
    div.className = "peserta show";
    div.innerHTML = `
      <div class="rank">#${i + 1}</div>
      <div class="nama">${p.nama.toUpperCase()}</div>
      <div class="nilai">
        💡 Kreativitas: <span>${p.nilaiKreatif.toFixed(2)}</span><br>
        🏡 Lokal: <span>${p.nilaiLokal.toFixed(2)}</span><br>
        ${viralText}
      </div>
      <div class="total">⭐ <span class="angka">0.00</span></div>
      <a href="${p.linkVideo}" target="_blank" class="link">📺 Lihat Video</a>
    `;
    wadah.appendChild(div);

    const totalEl = div.querySelector(".angka");
    animateValue(totalEl, 0, p.total, 2000 + i * 250);
  });
}
tampilkanDataSeason();
selectSeason.addEventListener("change", tampilkanDataSeason);