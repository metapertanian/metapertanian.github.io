// ===============================
// 🔘 Navbar Toggle
// ===============================
function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("active");
}

// Tutup menu otomatis saat salah satu item diklik
document.querySelectorAll("#menu a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("menu").classList.remove("active");
  });
});

// ===============================
// 💬 Kutipan Bergantian (huruf demi huruf)
// ===============================
const kutipanList = [
  "📷 Dari satu kamera, menyimpan seribu cerita.",
  "🔥 Kreator hebat lahir dari dusun yang kecil, tapi mimpi yang besar.",
  "💫 Jangan tunggu viral, buatlah karya yang bernilai."
];

let indexKutipan = 0;
let indexHuruf = 0;
let intervalHuruf;

function tampilkanKutipanHurufDemiHuruf() {
  const elemen = document.getElementById("kutipan");
  const teks = kutipanList[indexKutipan];
  elemen.textContent = "";

  indexHuruf = 0;
  clearInterval(intervalHuruf);
  intervalHuruf = setInterval(() => {
    if (indexHuruf < teks.length) {
      elemen.textContent += teks[indexHuruf];
      indexHuruf++;
    } else {
      clearInterval(intervalHuruf);
      indexKutipan = (indexKutipan + 1) % kutipanList.length;
      setTimeout(tampilkanKutipanHurufDemiHuruf, 2000);
    }
  }, 80);
}
tampilkanKutipanHurufDemiHuruf();

// ===============================
// 📅 Dropdown Season
// ===============================
const selectSeason = document.getElementById("season");
Object.keys(dataPeserta).forEach(s => {
  const opt = document.createElement("option");
  opt.value = s;
  opt.textContent = s;
  selectSeason.appendChild(opt);
});
selectSeason.value = Object.keys(dataPeserta)[0];

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
💡 Kreativitas: ide (150), editing (100), karakter (50).<br>
🏡 Dampak Dusun: nuansa (100), dampak positif (100).<br>
<b>Total Maksimal:</b> 500 poin.<br><br>
<b>Poin TikTok:</b><br>
🚀 Performa Viral dihitung otomatis dari jumlah like, komen, dan share.
`;

// ===============================
// 🎁 Hadiah Pemenang + Nama Juara
// ===============================
const hadiahKategori = [
  { kategori: "Juara 1", hadiah: "Paket Data + Uang 100rb + Sertifikat", juara: null },
  { kategori: "Juara 2", hadiah: "Paket Data + Uang 75rb + Sertifikat", juara: null },
  { kategori: "Juara 3", hadiah: "Paket Data + Uang 50rb + Sertifikat", juara: null },
  { kategori: "Ide Konsep Terbaik", hadiah: "Paket Data + Uang 40rb + Sertifikat", juara: null },
  { kategori: "Konten Terfavorit", hadiah: "Paket Data + Uang 35rb + Sertifikat", juara: null },
  { kategori: "Konten Terlucu", hadiah: "Paket Data + Uang 30rb + Sertifikat", juara: null },
  { kategori: "Paling Tanjung Bulan", hadiah: "Paket Data + Uang 25rb + Sertifikat", juara: null },
  { kategori: "Paling Inspiratif", hadiah: "Paket Data + Uang 25rb + Sertifikat", juara: null }
];

function tampilkanHadiah() {
  const wadah = document.getElementById("hadiahList");
  wadah.innerHTML = "";

  hadiahKategori.forEach(h => {
    const juaraData = h.juara
      ? `<div class="juara">🏆 ${h.juara.nama} (${h.juara.total} pts)</div>`
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
// 📊 Poin Kreator
// ===============================
const tampilkanPoin = false; // true = tampilkan ranking & poin, false = sembunyikan viral & ranking
const statusPenilaian = "belum"; // “belum” atau “tutup”
const pesertaPerHalaman = 10;

function tampilkanDataSeason() {
  const season = selectSeason.value;
  let data = dataPeserta[season].kreator;

  // Hitung poin hanya jika tampilkanPoin = true
  const hasilRanking = data.map(p => {
    const viral = tampilkanPoin ? (p.like * 1.0 + p.komen * 1.5 + p.share * 1.5) : 0;
    const nilaiKreatif = (p.ideKonsepNilai * 1.5) + (p.editing * 1.0) + (p.karakter * 0.5);
    const nilaiLokal = (p.nuansaLokal * 1.0) + (p.dampakPositif * 1.0);
    const total = Math.round(nilaiKreatif + nilaiLokal + viral);
    return { ...p, nilaiKreatif, nilaiLokal, viral, total };
  });

  if (tampilkanPoin) {
    data = hasilRanking.sort((a, b) => b.total - a.total);
  } else {
    data = hasilRanking; // urut sesuai pendataan
  }

  let halaman = 1;
  const totalHalaman = Math.ceil(data.length / pesertaPerHalaman);

  function render() {
    const start = (halaman - 1) * pesertaPerHalaman;
    const end = start + pesertaPerHalaman;
    const pesertaTampil = data.slice(start, end);
    const wadah = document.getElementById("daftarPeserta");
    wadah.innerHTML = "";

    pesertaTampil.forEach((p, i) => {
      const div = document.createElement("div");
      div.className = "peserta show";

      const rankHTML = tampilkanPoin ? `<div class="rank">#${start + i + 1}</div>` : "";

      const nilaiHTML = tampilkanPoin
        ? `<div class="nilai">
            💡 Kreativitas: <span>${p.nilaiKreatif.toFixed(1)}</span><br>
            🏡 Lokal: <span>${p.nilaiLokal.toFixed(1)}</span><br>
            🚀 Viral: <span>${p.viral.toFixed(1)}</span>
          </div>
          <div class="total">⭐ ${p.total}</div>`
        : `<div class="nilai-tersembunyi">🔒 Poin viral dikunci</div>`;

      div.innerHTML = `
        ${rankHTML}
        <div class="nama">${p.nama.toUpperCase()}</div>
        ${nilaiHTML}
        <a href="${p.linkVideo}" target="_blank" class="link">📺 Lihat Video</a>
      `;
      wadah.appendChild(div);
    });

    // pagination
    const pag = document.getElementById("pagination");
    pag.innerHTML = "";
    for (let i = 1; i <= totalHalaman; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.onclick = () => { halaman = i; render(); };
      if (i === halaman) btn.classList.add("aktif");
      pag.appendChild(btn);
    }

    // status
    const statusEl = document.getElementById("statusPoin");
    statusEl.textContent =
      statusPenilaian === "belum"
        ? "⏳ Penilaian masih berlangsung..."
        : "✅ Penilaian telah selesai.";
  }

  render();
}
tampilkanDataSeason();

// ===============================
// 🎨 Styling Tambahan
// ===============================
const style = document.createElement("style");
style.innerHTML = `
#kutipan {
  font-size: 1.1rem;
  color: #fafafa;
  font-style: italic;
  margin: 20px auto;
  text-align: center;
  letter-spacing: 0.5px;
  max-width: 90%;
  transition: all 0.3s ease;
}

.hadiah-card {
  background: linear-gradient(145deg,#1b5e20,#2e7d32);
  color: #fff;
  border-radius: 14px;
  padding: 16px;
  margin: 12px 0;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  transition: 0.3s;
}
.hadiah-card:hover { transform: scale(1.03); }
.hadiah-card .judul { font-weight: bold; font-size: 1.1em; margin-bottom: 6px; }
.hadiah-card .isi { font-size: 0.95em; opacity: 0.9; margin-bottom: 6px; }
.hadiah-card .juara { font-size: 0.9em; background:#fff2; padding:4px 8px; border-radius:8px; }

.peserta {
  background: #222;
  border-radius: 14px;
  padding: 16px;
  margin: 10px 0;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  color: #fff;
}
.peserta .rank { font-weight: bold; color: #4caf50; }
.peserta .nama { font-size: 1.1em; margin: 4px 0; }
.peserta .total { font-weight: bold; color: #ffd54f; margin-top: 4px; }
.peserta .link { display:block; margin-top:6px; color:#81d4fa; text-decoration:none; font-size:0.9em; }
.peserta .nilai-tersembunyi { font-style:italic; opacity:0.8; margin-top:4px; }

#pagination { text-align:center; margin:15px 0; }
#pagination button {
  background:#1b5e20;
  border:none;
  color:#fff;
  padding:6px 12px;
  margin:2px;
  border-radius:8px;
  cursor:pointer;
  transition:0.3s;
}
#pagination button:hover, #pagination button.aktif {
  background:#43a047;
}
`;
document.head.appendChild(style);