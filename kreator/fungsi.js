// ====== NAVBAR TOGGLE ======
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", () => navLinks.classList.toggle("active"));
navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => navLinks.classList.remove("active")));

// ====== KUTIPAN BERGANTIAN ======
const quotes = [
  "📷 Dari satu kamera, menyimpan seribu cerita."
  "🔥 Kreator hebat lahir dari dusun yang kecil, tapi mimpi yang besar.",
  "💫 Jangan tunggu viral, buatlah karya yang bernilai."
];
let qIndex = 0;
const quoteEl = document.getElementById("heroQuote");
function rotateQuote() {
  quoteEl.textContent = quotes[qIndex];
  qIndex = (qIndex + 1) % quotes.length;
  setTimeout(rotateQuote, 5000);
}
rotateQuote();

// ====== DROPDOWN SEASON ======
const seasonDropdown = document.getElementById("seasonDropdown");
const daftarHadiah = document.getElementById("daftarHadiah");
const poinKontainer = document.getElementById("poinKontainer");
const pagination = document.getElementById("pagination");

const seasons = [...new Set(hasilRanking.map(p => p.season))];
seasons.forEach(season => {
  const opt = document.createElement("option");
  opt.value = season;
  opt.textContent = "Season " + season;
  seasonDropdown.appendChild(opt);
});
let selectedSeason = seasonDropdown.value || seasons[0];
seasonDropdown.value = selectedSeason;
seasonDropdown.addEventListener("change", () => {
  selectedSeason = seasonDropdown.value;
  renderHadiah();
  renderPoin();
});

// ====== STATUS PENILAIAN ======
const statusPenilaian = "belum"; // ubah ke "tutup" jika hasil sudah final
const tampilkanPoin = (statusPenilaian === "tutup");

// ====== RENDER HADIAH ======
function renderHadiah() {
  const hadiahList = [
    { kategori: "Juara 1", hadiah: "Paket Data + Uang Pembinaan 100 ribu + Sertifikat" },
    { kategori: "Juara 2", hadiah: "Paket Data + Uang Pembinaan 75 ribu + Sertifikat" },
    { kategori: "Juara 3", hadiah: "Paket Data + Uang Pembinaan 50 ribu + Sertifikat" },
    { kategori: "Ide Konsep Terbaik", hadiah: "Paket Data + Uang Pembinaan 40 ribu + Sertifikat" },
    { kategori: "Konten Terfavorit", hadiah: "Paket Data + Uang Pembinaan 35 ribu + Sertifikat" },
    { kategori: "Konten Terlucu", hadiah: "Paket Data + Uang Pembinaan 30 ribu + Sertifikat" },
    { kategori: "Paling Tanjung Bulan", hadiah: "Paket Data + Uang Pembinaan 25 ribu + Sertifikat" },
    { kategori: "Paling Inspiratif", hadiah: "Paket Data + Uang Pembinaan 25 ribu + Sertifikat" }
  ];

  daftarHadiah.innerHTML = "";
  const pesertaSeason = hasilRanking.filter(p => p.season === selectedSeason);

  hadiahList.forEach((h, i) => {
    const div = document.createElement("div");
    div.className = "hadiah-item";

    const juara = pesertaSeason[i];
    const tampilNama = tampilkanPoin && juara ? `<b>${juara.nama}</b> – ${juara.total} pts` : "<i>Belum diumumkan</i>";

    div.innerHTML = `
      <h3>${h.kategori}</h3>
      <p>🎁 ${h.hadiah}</p>
      <p>🏅 ${tampilNama}</p>
    `;
    daftarHadiah.appendChild(div);
  });
}

// ====== RENDER POIN ======
let currentPage = 1;
const perPage = 10;

function renderPoin() {
  poinKontainer.innerHTML = "";
  pagination.innerHTML = "";

  const pesertaSeason = hasilRanking.filter(p => p.season === selectedSeason);
  const totalPages = Math.ceil(pesertaSeason.length / perPage);
  const start = (currentPage - 1) * perPage;
  const end = start + perPage;

  pesertaSeason.slice(start, end).forEach((p, i) => {
    const poinText = tampilkanPoin
      ? `${p.total} pts`
      : `<i>Penilaian masih berlangsung...</i>`;
    const card = document.createElement("div");
    card.className = "poin-card";
    card.innerHTML = `
      <div class="rank">#${start + i + 1}</div>
      <div class="nama">${p.nama}</div>
      <div class="nilai">${poinText}</div>
    `;
    poinKontainer.appendChild(card);
  });

  // Pagination
  if (totalPages > 1) {
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      if (i === currentPage) btn.classList.add("active");
      btn.onclick = () => { currentPage = i; renderPoin(); };
      pagination.appendChild(btn);
    }
  }
}

// ====== INISIALISASI ======
renderHadiah();
renderPoin();