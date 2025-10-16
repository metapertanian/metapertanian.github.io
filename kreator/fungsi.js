// ===============================
// 🔘 Navbar Toggle
// ===============================
function toggleMenu() {
  document.getElementById("menu").classList.toggle("active");
}

// ===============================
// 💬 Kutipan Bergantian
// ===============================
const kutipanList = [
  "📷 Dari satu kamera, menyimpan seribu cerita.",
  "🔥 Kreator hebat lahir dari dusun yang kecil, tapi mimpi yang besar.",
  "💫 Jangan tunggu viral, buatlah karya yang bernilai."
];
let indexKutipan = 0;
function gantiKutipan() {
  document.getElementById("kutipan").textContent = kutipanList[indexKutipan];
  indexKutipan = (indexKutipan + 1) % kutipanList.length;
}
setInterval(gantiKutipan, 3500);
gantiKutipan();

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
• Lomba ini untuk umum.<br>
• Lokasi video harus berada di Tanjung Bulan.<br>
• Pengeditan boleh dilakukan di mana saja.<br>
• Konten hasil editan sendiri dan belum pernah diunggah.<br>
• Tema: kehidupan, kreativitas, dan inspirasi di Tanjung Bulan.<br>
• Gaya video: lucu, edukatif, dokumenter, cinematic, atau motivasi.<br><br>
<b>Poin Juri:</b><br>
💡 Kreativitas: ide konsep (150), editing (100), karakter (50).<br>
🏡 Dampak Dusun: nuansa dusun (100), dampak positif (100).<br>
Total: 500 poin.<br><br>
<b>Poin TikTok:</b><br>
🚀 Performa Viral: poin tak terbatas dari like, komen, dan share.<br>
Peserta boleh meminta bantuan teman, tapi dilarang memakai bot atau membeli like/komen/share.
`;

// ===============================
// 🎁 Hadiah Pemenang
// ===============================
const hadiahKategori = [
  { kategori: "Juara 1", hadiah: "Paket Data + Uang 100rb + Sertifikat" },
  { kategori: "Juara 2", hadiah: "Paket Data + Uang 75rb + Sertifikat" },
  { kategori: "Juara 3", hadiah: "Paket Data + Uang 50rb + Sertifikat" },
  { kategori: "Ide Konsep Terbaik", hadiah: "Paket Data + Uang 40rb + Sertifikat" },
  { kategori: "Konten Terfavorit", hadiah: "Paket Data + Uang 35rb + Sertifikat" },
  { kategori: "Konten Terlucu", hadiah: "Paket Data + Uang 30rb + Sertifikat" },
  { kategori: "Paling Tanjung Bulan", hadiah: "Paket Data + Uang 25rb + Sertifikat" },
  { kategori: "Paling Inspiratif", hadiah: "Paket Data + Uang 25rb + Sertifikat" },
];

function tampilkanHadiah() {
  const wadah = document.getElementById("hadiahList");
  wadah.innerHTML = "";
  hadiahKategori.forEach(h => {
    const div = document.createElement("div");
    div.className = "peserta show";
    div.innerHTML = `<b>${h.kategori}</b><br>${h.hadiah}`;
    wadah.appendChild(div);
  });
}
tampilkanHadiah();

// ===============================
// 📊 Tampilkan Poin Kreator
// ===============================
const statusPenilaian = "tutup";
const pesertaPerHalaman = 10;

function tampilkanDataSeason() {
  const season = selectSeason.value;
  const data = dataPeserta[season].kreator;

  const hasilRanking = data.map(p => {
    const viral = (p.like * 1.0) + (p.komen * 1.5) + (p.share * 1.5);
    const nilaiKreatif = (p.ideKonsepNilai * 1.5) + (p.editing * 1.0) + (p.karakter * 0.5);
    const nilaiLokal = (p.nuansaLokal * 1.0) + (p.dampakPositif * 1.0);
    const total = Math.round(nilaiKreatif + nilaiLokal + viral);
    return { ...p, nilaiKreatif, nilaiLokal, viral, total };
  }).sort((a, b) => b.total - a.total);

  let halaman = 1;
  const totalHalaman = Math.ceil(hasilRanking.length / pesertaPerHalaman);

  function render() {
    const start = (halaman - 1) * pesertaPerHalaman;
    const end = start + pesertaPerHalaman;
    const pesertaTampil = hasilRanking.slice(start, end);

    const wadah = document.getElementById("daftarPeserta");
    wadah.innerHTML = "";

    pesertaTampil.forEach((p, i) => {
      const div = document.createElement("div");
      div.className = "peserta show";
      div.innerHTML = `
        <div class="rank">#${start + i + 1}</div>
        <div class="nama">${p.nama.toUpperCase()}</div>
        <div class="nilai">
          💡 Kreativitas: <span>${p.nilaiKreatif.toFixed(1)}</span><br>
          🏡 Lokal: <span>${p.nilaiLokal.toFixed(1)}</span><br>
          🚀 Viral: <span>${p.viral.toFixed(1)}</span>
        </div>
        <div class="total">${p.total}</div>
        <a href="${p.linkVideo}" target="_blank" class="link">${p.linkVideo}</a>
      `;
      wadah.appendChild(div);
    });

    const pag = document.getElementById("pagination");
    pag.innerHTML = "";
    for (let i = 1; i <= totalHalaman; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.onclick = () => { halaman = i; render(); };
      pag.appendChild(btn);
    }

    document.getElementById("statusPoin").textContent =
      "✅ Penilaian telah selesai.";
  }

  render();
}
tampilkanDataSeason();