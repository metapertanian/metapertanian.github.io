// ===== Format tanggal =====
function formatDate(dateStr) {
  const months = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
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
    "Kacang Panjang": "🫘"
  };
  return icons[name] || "🌱";
}

// ===== Render Budidaya =====
const budidayaContainer = document.getElementById("budidaya-container");
budidayaData.forEach(item => {
  const year = new Date(item.tanggal).getFullYear();
  const foto = item.foto && item.foto.trim() !== "" ? item.foto : `img/${item.tanaman.toLowerCase().replace(" ", "-")}.png`;

  const card = document.createElement("div");
  card.className = "budidaya-card";

  card.innerHTML = `
    <div class="budidaya-photo">
      <img src="${foto}" alt="${item.tanaman} ${year}">
      <span class="year">${year}</span>
    </div>
    <div class="budidaya-info">
      <p><strong>Tanaman:</strong> ${getPlantIcon(item.tanaman)} ${item.tanaman}</p>
      <p><strong>Tanggal:</strong> ${formatDate(item.tanggal)}</p>
      <p><strong>Luas Lahan:</strong> ${item.luas}</p>
      <p><strong>Umur:</strong> ${item.umur}</p>
      <p><strong>Hasil Panen:</strong> ${item.hasil.jumlah} ${item.hasil.satuan}</p>
    </div>
  `;
  budidayaContainer.appendChild(card);
});

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
function animateCounter(el, target, suffix, delay) {
  let count = 0;
  const duration = 1500;
  const stepTime = 20;
  const steps = duration / stepTime;
  const increment = target / steps;

  function update() {
    count += increment;
    if (count >= target) count = target;
    el.textContent = Math.floor(count).toLocaleString() + (suffix || "");
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
    div.className = "achievement-item";
    div.innerHTML = `
      <span class="label">${getPlantIcon(tanaman)} ${tanaman}</span>
      <span class="value">0</span>
    `;
    achievementContainer.appendChild(div);
    const valueEl = div.querySelector(".value");
    animateCounter(valueEl, totals[tanaman].jumlah, " " + totals[tanaman].satuan, delay);
    delay += 900;
  }

  // Omzet
  const omzetEl = document.getElementById("omzet-value");
  animateCounter(omzetEl, totalOmzet, "", delay);
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

// ===== Navbar toggle =====
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Tahun footer
document.getElementById('year').textContent = new Date().getFullYear();