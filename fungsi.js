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
  
// ===== Format Rupiah =====  
function formatRupiah(angka) {  
  return "Rp " + angka.toLocaleString("id-ID");  
}  
  
// ===== Render Budidaya =====  
const budidayaContainer = document.getElementById("budidaya-container");  
budidayaData.forEach(item => {  
  const year = new Date(item.tanggal).getFullYear();  
  
  // Nama file gambar fallback  
  const namaFile = item.tanaman   
    ? item.tanaman.toLowerCase().replace(/\s+/g, "-")   
    : "default";  
  
  // Tentukan foto (pakai default jika kosong / salah)  
  const foto = item.foto && item.foto.trim() !== ""   
    ? item.foto   
    : `img/${namaFile}.jpg`;  
  
  const card = document.createElement("div");  
  card.className = "budidaya-card fade-in";  
  
  card.innerHTML = `  
    <div class="budidaya-photo">  
      <img src="${foto}" alt="${item.tanaman || 'Tanaman'} ${year}"  
           onerror="this.onerror=null; this.src='img/default.jpg'; this.style.display='block';">  
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
  
  // Omzet  
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
  
// Fallback: selalu tampil meskipun observer gagal  
window.addEventListener("load", () => {  
  faders.forEach(el => el.classList.add("visible"));  
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