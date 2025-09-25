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

// ===== Render Budidaya dengan Pagination =====
const budidayaContainer = document.getElementById("budidaya-container");
const paginationContainer = document.createElement("div");
paginationContainer.className = "pagination";
budidayaContainer.after(paginationContainer);

let currentPage = 1;
const itemsPerPage = 5;

function renderBudidaya(page = 1) {
  budidayaContainer.innerHTML = "";
  paginationContainer.innerHTML = "";
  currentPage = page;

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const items = budidayaData.slice(start, end);

  items.forEach(item => {
    const year = new Date(item.tanggal).getFullYear();

    // Pakai foto dari data, kalau kosong fallback ke default.jpg
    const foto = item.foto && item.foto.trim() !== "" 
      ? item.foto 
      : "img/default.jpg";

    const card = document.createElement("div");
    card.className = "budidaya-card"; // tanpa fade-in

    card.innerHTML = `
      <div class="budidaya-photo">
        <img src="${foto}" alt="${item.tanaman || 'Tanaman'} ${year}"
             onerror="this.onerror=null; this.src='img/default.jpg';">
        <span class="year">${year}</span>
      </div>
      <div class="budidaya-info">
        <p><strong>${getPlantIcon(item.tanaman)} ${item.tanaman || "-"}</strong></p>
        <p><strong>Tanggal:</strong> ${formatDate(item.tanggal)}</p>
        <p><strong>Luas:</strong> ${item.luas || "-"}</p>
        <p><strong>Umur:</strong> ${item.umur || "-"}</p>
        <p><strong>Hasil:</strong> ${item.hasil.jumlah} ${item.hasil.satuan}</p>
        <p><strong>Omzet:</strong> ${item.omzet ? formatRupiah(item.omzet) : "-"}</p>
      </div>
    `;
    budidayaContainer.appendChild(card);
  });

  // Render pagination
  const totalPages = Math.ceil(budidayaData.length / itemsPerPage);
  if (totalPages > 1) {
    // Prev button
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "« Prev";
    prevBtn.disabled = page === 1;
    prevBtn.onclick = () => renderBudidaya(page - 1);
    paginationContainer.appendChild(prevBtn);

    // Numbered buttons
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement("button");
      pageBtn.textContent = i;
      if (i === page) pageBtn.classList.add("active");
      pageBtn.onclick = () => renderBudidaya(i);
      paginationContainer.appendChild(pageBtn);
    }

    // Next button
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next »";
    nextBtn.disabled = page === totalPages;
    nextBtn.onclick = () => renderBudidaya(page + 1);
    paginationContainer.appendChild(nextBtn);
  }
}

// ===== Hitung total hasil per tanaman + Omzet =====
function calculateAchievements() {
  const totals = {};
  let totalOmzet = 0;
  budidayaData.forEach(item => {
    const { tanaman, hasil, omzet } = item;
    if (!totals[tanaman]) totals[tanaman] = { jumlah: 0, satuan: hasil.satuan };
    if (totals[tanaman].satuan === hasil.satuan) {
      totals[tanaman].jumlah += hasil.jumlah;
    }
    if (omzet) totalOmzet += omzet;
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
const { totals, totalOmzet } = calculateAchievements();

function renderAchievements() {
  achievementContainer.innerHTML = "";
  let delay = 0;
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

// ===== Typing effect per huruf untuk quote =====
const quoteEl = document.getElementById("quote");
const fullText = "Menanam Harapan untuk Masa Depan";
let index = 0;
let isDeleting = false;

function typeEffect() {
  if (!quoteEl) return;
  if (!isDeleting) {
    quoteEl.textContent = fullText.slice(0, index + 1);
    index++;
    if (index === fullText.length) {
      isDeleting = true;
      setTimeout(typeEffect, 2000);
      return;
    }
  } else {
    quoteEl.textContent = fullText.slice(0, index - 1);
    index--;
    if (index === 0) {
      isDeleting = false;
    }
  }
  setTimeout(typeEffect, isDeleting ? 80 : 120);
}
if (quoteEl) typeEffect();

// ===== Fade-in scroll (untuk elemen lain, bukan budidaya) =====
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

// Fallback: selalu tampil meskipun observer gagal
window.addEventListener("load", () => {
  faders.forEach(el => el.classList.add("visible"));
  renderBudidaya(1); // render halaman pertama saat load
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