// ===== Format tanggal =====
function formatDate(dateStr) {
  const months = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  const d = new Date(dateStr);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// ===== Icon tanaman =====
function getPlantIcon(name) {
  const icons = {
    "Jagung": "🌽",
    "Timun": "🥒",
    "Cabai": "🌶️",
    "Singkong": "🥔",
    "Padi": "🌾",
    "Terong": "🍆",
    "Tomat": "🍅",
    "Semangka": "🍉",
    "Melon": "🍈"
  };
  return icons[name] || "🌱";
}

// ===== Format Rupiah =====
function formatRupiah(angka) {
  return "Rp " + angka.toLocaleString("id-ID");
}

// ===== Ambil data budidaya dari window.kasData (gabungan semua tahap) =====
function getBudidayaData() {
  return Object.values(window.kasData).flatMap(p => p.transaksi || []);
}

// ===== Render Budidaya dengan Pagination =====
const budidayaContainer = document.getElementById("budidaya-container");
const paginationContainer = document.createElement("div");
paginationContainer.className = "pagination";
budidayaContainer.after(paginationContainer);

let currentPage = 1;
const itemsPerPage = 6;

function renderBudidaya(page = 1, doScroll = false) {
  const budidayaData = getBudidayaData();
  budidayaContainer.innerHTML = "";
  paginationContainer.innerHTML = "";
  currentPage = page;

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const items = budidayaData.slice(start, end);

  items.forEach(item => {
    const tanggalLengkap = formatDate(item.tanggal);
    const foto = item.foto && item.foto.trim() !== "" 
      ? item.foto 
      : "img/default.jpg";

    const card = document.createElement("div");
    card.className = "budidaya-card";

    card.innerHTML = `
      <div class="budidaya-photo">
        <img src="${foto}" alt="${item.kategori || 'Tanaman'}"
             onerror="this.onerror=null; this.src='img/default.jpg';">
        <span class="year">${tanggalLengkap}</span>
      </div>
      <div class="budidaya-info">
        <p><strong>${getPlantIcon(item.kategori)} ${item.kategori || "-"}</strong></p>
        <p><strong>Luas:</strong> ${item.luas?.jumlah || "-"} ${item.luas?.satuan || ""}</p>
        <p><strong>Umur:</strong> ${item.umur?.jumlah || "-"} ${item.umur?.satuan || ""}</p>
        <p><strong>Hasil:</strong> ${item.hasil?.jumlah || "-"} ${item.hasil?.satuan || ""}</p>
        <p><strong>Omzet:</strong> ${item.nominal ? formatRupiah(item.nominal) : "-"}</p>
        ${item.catatan && item.catatan.trim() !== "" ? `<p><em>Catatan: ${item.catatan}</em></p>` : ""}
        ${item.video && item.video.trim() !== "" ? `<p><a href="${item.video}" target="_blank">▶️ Tonton Video Dokumentasi</a></p>` : ""}
      </div>
    `;
    budidayaContainer.appendChild(card);
  });

  // Pagination
  const totalPages = Math.ceil(budidayaData.length / itemsPerPage);
  if (totalPages > 1) {
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "« Baru";
    prevBtn.disabled = page === 1;
    prevBtn.onclick = () => renderBudidaya(page - 1, true);
    paginationContainer.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement("button");
      pageBtn.textContent = i;
      if (i === page) pageBtn.classList.add("active");
      pageBtn.onclick = () => renderBudidaya(i, true);
      paginationContainer.appendChild(pageBtn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Lama »";
    nextBtn.disabled = page === totalPages;
    nextBtn.onclick = () => renderBudidaya(page + 1, true);
    paginationContainer.appendChild(nextBtn);
  }

  // 🔥 Scroll hanya kalau dipicu pagination (lebih cepat, jarak kecil)
  if (doScroll) {
    const navHeight = document.querySelector(".nav")?.offsetHeight || 0;
    const topPos = budidayaContainer.getBoundingClientRect().top + window.scrollY - navHeight - 2;
    window.scrollTo({ top: topPos, behavior: "smooth" });
  }

  // ✨ Highlight kartu pertama
  const firstCard = budidayaContainer.querySelector(".budidaya-card");
  if (firstCard) {
    firstCard.classList.add("highlight");
    setTimeout(() => firstCard.classList.remove("highlight"), 3000);
  }
}

// ===== Hitung total hasil per tanaman + Omzet =====
function calculateAchievements() {
  const budidayaData = getBudidayaData();
  const totals = {};
  let totalOmzet = 0;

  budidayaData.forEach(item => {
    const { kategori, hasil, nominal } = item;
    if (!totals[kategori]) totals[kategori] = { jumlah: 0, satuan: hasil?.satuan || "" };
    if (hasil && totals[kategori].satuan === hasil.satuan) {
      totals[kategori].jumlah += hasil.jumlah;
    }
    if (nominal) totalOmzet += nominal;
  });
  return { totals, totalOmzet };
}

// ===== Animasi counter =====
function animateCounter(el, target, suffix, delay, isRupiah = false) {
  let count = 0;
  const duration = 1500;
  const stepTime = 20;
  const steps = duration / stepTime;
  const increment = target / steps;

  function update() {
    count += increment;
    if (count >= target) count = target;

    if (isRupiah) {
      el.textContent = formatRupiah(Math.floor(count));
    } else {
      el.textContent = Math.floor(count).toLocaleString("id-ID") + (suffix || "");
    }

    if (count < target) setTimeout(update, stepTime);
    else el.classList.add("glow");
  }
  setTimeout(update, delay);
}

// ===== Render Pencapaian =====
const achievementContainer = document.getElementById("achievement-container");
function renderAchievements() {
  achievementContainer.innerHTML = "";
  let delay = 0;
  const { totals, totalOmzet } = calculateAchievements();

  for (let tanaman in totals) {
    const div = document.createElement("div");
    div.className = "achievement-item card";
    div.innerHTML = `
      <div class="label">${getPlantIcon(tanaman)} ${tanaman}</div>
      <div class="value">0</div>
    `;
    achievementContainer.appendChild(div);

    const valueEl = div.querySelector(".value");
    animateCounter(valueEl, totals[tanaman].jumlah, " " + totals[tanaman].satuan, delay, false);
    delay += 900;
  }

  // Omzet total
  const omzetEl = document.getElementById("omzet-value");
  animateCounter(omzetEl, totalOmzet, "", delay, true);
}

// Observer agar animasi reset tiap scroll
const achievementSection = document.getElementById("pencapaian");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      renderAchievements();
    }
  });
}, { threshold: 0.5 });
observer.observe(achievementSection);

// ===== Dynamic Quote (3 fitur bergantian) =====
const quoteEl = document.getElementById("quote");
const quotes = [
  "Kemitraan Pertanian Modern",
  "Algoritma Catatan Keuangan",
  "Membenahi Tanah Pertanian"
];
let qIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  if (!quoteEl) return;
  const currentText = quotes[qIndex];
  
  if (!isDeleting) {
    quoteEl.textContent = currentText.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentText.length) {
      isDeleting = true;
      setTimeout(typeEffect, 2000);
      return;
    }
  } else {
    quoteEl.textContent = currentText.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      qIndex = (qIndex + 1) % quotes.length;
    }
  }
  setTimeout(typeEffect, isDeleting ? 60 : 100);
}
if (quoteEl) typeEffect();

// ===== Fade-in scroll =====
const faders = document.querySelectorAll('.fade-in');
const appearOptions = { threshold: 0.2 };
const appearOnScroll = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      entry.target.classList.remove('visible');
    }
  });
}, appearOptions);
faders.forEach(f => appearOnScroll.observe(f));

window.addEventListener("load", () => {
  faders.forEach(el => el.classList.add("visible"));
  renderBudidaya(1); // awal
});

// ===== Navbar toggle =====
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Tutup navbar otomatis setelah klik link
const navLinkItems = navLinks.querySelectorAll("a");
navLinkItems.forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

// Tahun footer
document.getElementById('year').textContent = new Date().getFullYear();