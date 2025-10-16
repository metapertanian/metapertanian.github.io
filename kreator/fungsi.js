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
// 💬 Kutipan Bergantian (huruf demi huruf + efek mengetik)
// ===============================
const kutipanList = [
  "Dari satu kamera, tersimpan seribu cerita.",
  "Kreator hebat lahir dari dusun yang kecil, tapi mimpi yang besar.",
  "Jangan tunggu viral, buatlah karya yang bernilai."
];

let indexKutipan = 0;
let indexHuruf = 0;
let intervalHuruf;

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
kamu bisa mengajak teman/saudara untuk menaikkan like/komen/share. tapi tidak diperbolehkan melakukan komen spam, membeli atau menggunakan bot untuk menaikkan like/komen/share.<br><br>
siapa saja yg sengaja melakukan kecurangan akan kami kurangi poin atau bahkan kami diskualifikasi.
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
// 📊 Poin Kreator (dengan animasi total poin)
// ===============================
const tampilkanPoin = false; // true = tampilkan semua poin, false = sembunyikan poin viral & ranking
const statusPenilaian = "belum"; // “belum” atau “tutup”
const pesertaPerHalaman = 10;

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
  let data = dataPeserta[season].kreator;

  const hasilRanking = data.map(p => {
    const viral = tampilkanPoin ? (p.like * 1.0 + p.komen * 1.5 + p.share * 1.5) : 0;
    const nilaiKreatif = (p.ideKonsepNilai * 1.5) + (p.editing * 1.0) + (p.karakter * 0.5);
    const nilaiLokal = (p.nuansaLokal * 1.0) + (p.dampakPositif * 1.0);
    const total = nilaiKreatif + nilaiLokal + viral;
    return { ...p, nilaiKreatif, nilaiLokal, viral, total };
  });

  if (tampilkanPoin) {
    data = hasilRanking.sort((a, b) => b.total - a.total);
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

      const nilaiHTML = `
        <div class="nilai">
          💡 Kreativitas: <span>${p.nilaiKreatif.toFixed(1)}</span><br>
          🏡 Lokal: <span>${p.nilaiLokal.toFixed(1)}</span>
          ${tampilkanPoin ? `<br>🚀 Viral: <span>${p.viral.toFixed(1)}</span>` : ""}
        </div>
        <div class="total">⭐ <span class="angka">0.0</span></div>
      `;

      div.innerHTML = `
        ${rankHTML}
        <div class="nama">${p.nama.toUpperCase()}</div>
        ${nilaiHTML}
        <a href="${p.linkVideo}" target="_blank" class="link">📺 Lihat Video</a>
      `;

      wadah.appendChild(div);

      // animasi total poin
      const totalEl = div.querySelector(".angka");
      animateValue(totalEl, 0, p.total, 1500 + i * 200);
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
  font-size: 1.15rem;
  color: #fafafa;
  font-style: italic;
  text-align: center;
  margin: 20px auto;
  max-width: 90%;
  letter-spacing: 0.5px;
  min-height: 30px;
  position: relative;
}
.cursor {
  display: inline-block;
  animation: blink 0.8s infinite;
  color: #4caf50;
}
@keyframes blink {
  0%, 50%, 100% { opacity: 1; }
  25%, 75% { opacity: 0; }
}

.hadiah-card {
  background: linear-gradient(145deg, #0f2027, #203a43, #2c5364);
  color: #fff;
  border-radius: 14px;
  padding: 16px;
  margin: 12px 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  transition: 0.3s;
}
.hadiah-card:hover { transform: scale(1.03); }
.hadiah-card .judul { font-weight: bold; font-size: 1.1em; margin-bottom: 6px; }
.hadiah-card .isi { font-size: 0.95em; opacity: 0.9; margin-bottom: 6px; }
.hadiah-card .juara { font-size: 0.9em; background:#ffffff1a; padding:4px 8px; border-radius:8px; }

.peserta {
  background: #181818;
  border-radius: 14px;
  padding: 16px;
  margin: 10px 0;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
  color: #fff;
  transition: 0.3s ease;
}
.peserta:hover { transform: translateY(-3px); background:#1e1e1e; }
.peserta .rank { font-weight: bold; color: #4caf50; }
.peserta .nama { font-size: 1.1em; margin: 4px 0; }
.peserta .total { font-weight: bold; color: #ffd54f; margin-top: 4px; font-size:1.05em; }
.peserta .link { display:block; margin-top:6px; color:#81d4fa; text-decoration:none; font-size:0.9em; }
.peserta .nilai { font-size: 0.9em; opacity: 0.95; }

#pagination { text-align:center; margin:15px 0; }
#pagination button {
  background:#2e7d32;
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