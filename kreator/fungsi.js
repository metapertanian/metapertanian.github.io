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
  "Jangan tunggu viral, buatlah karya yang bernilai.",
  "Kreator hebat lahir dari dusun yg kecil, tapi mimpi yg besar.",
];
let indexKutipan = 0, indexHuruf = 0, intervalHuruf;

function tampilkanKutipanHurufDemiHuruf() {
  const elemen = document.getElementById("kutipan");
  const teks = kutipanList[indexKutipan];
  elemen.textContent = "";
  elemen.style.fontFamily = "'Poppins', 'Inter', sans-serif";
  elemen.style.fontSize = "1.6rem";
  elemen.style.fontWeight = "600";
  elemen.style.textAlign = "center";
  elemen.style.color = "#ffe082";
  elemen.style.textShadow = "0 0 10px rgba(255,255,255,0.3)";

  const cursor = document.createElement("span");
  cursor.textContent = "|";
  cursor.style.color = "#ffd54f";
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
<li>Lomba terbuka untuk umum.</li>
<li>Video harus diambil di <b>Tanjung Bulan</b>.</li>
<li>Edit boleh dilakukan di mana saja.</li>
<li>Video hasil karya sendiri (belum pernah diunggah).</li>
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
🚀 Viral dihitung otomatis (like, komen, share).<br><br>
Dilarang spam komen, beli like/share, atau bot.
`;

// ===============================
// 🏅 Hitung Nilai Total
// ===============================
function hitungTotal(p, tampilkanPoin) {
  const like = Number(p.like) || 0;
  const komen = Number(p.komen) || 0;
  const share = Number(p.share) || 0;
  const ide = Number(p.ideKonsepNilai) || 0;
  const edit = Number(p.editing) || 0;
  const karakter = Number(p.karakter) || 0;
  const nuansa = Number(p.nuansaLokal) || 0;
  const dampak = Number(p.dampakPositif) || 0;

  const viral = (like * 1.0) + (komen * 1.5) + (share * 1.5);
  const nilaiKreatif = (ide * 1.5) + edit + (karakter * 0.5);
  const nilaiLokal = nuansa + dampak;
  const total = tampilkanPoin
    ? parseFloat((nilaiKreatif + nilaiLokal + viral).toFixed(1))
    : parseFloat((nilaiKreatif + nilaiLokal).toFixed(1));
  return { total, nilaiKreatif, nilaiLokal, viral };
}

// ===============================
// 🔢 Ranking per Season
// ===============================
function prosesRanking(data, tampilkanPoin) {
  return data.map(p => ({ ...p, ...hitungTotal(p, tampilkanPoin) }))
             .sort((a, b) => b.total - a.total);
}

// ===============================
// 🎞️ Animasi Nilai Bergulir
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

// ===============================
// 📊 Tampilkan Data Season
// ===============================
function tampilkanDataSeason() {
  const season = selectSeason.value;
  const dataSeason = dataJuara[season];
  if (!dataSeason) return;

  const data = dataSeason.kreator || [];
  const tampilkanPoin = dataSeason.Poin === true || dataSeason.Poin === "true";
  const sponsor = dataSeason.Sponsor || "-";
  const hadiah = dataSeason.Hadiah || {
    juara1: "Hadiah Utama",
    juara2: "Hadiah Kedua",
    juara3: "Hadiah Ketiga"
  };
  const ranking = prosesRanking(data, tampilkanPoin);

  const wadah = document.getElementById("daftarPeserta");
  wadah.innerHTML = "";

  const awal = dataSeason.awal || "-";
  const akhir = dataSeason.akhir || "-";

  infoRange.innerHTML = `
    <div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:10px; margin-top:8px;">
      <div style="font-weight:700; color:#fff;">${awal} - ${akhir}</div>
      <div style="margin-top:4px; font-size:0.95em;">
        <span style="color:#ffeb3b;">🎗️ Sponsor:</span><br>
        <span style="font-style:italic; color:#fdd835;">${sponsor}</span>
      </div>
      <div style="margin-top:8px; color:#90caf9; font-size:0.9em;">
        🏆 <b>Hadiah:</b> Juara 1 (${hadiah.juara1}), Juara 2 (${hadiah.juara2}), Juara 3 (${hadiah.juara3})
      </div>
    </div>
  `;

  ranking.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "peserta show";
    const rankDisplay = tampilkanPoin ? `<div class="rank">#${i + 1}</div>` : "";

    let hadiahText = "";
    if (i === 0) hadiahText = `<div class="hadiah">🏅 ${hadiah.juara1}</div>`;
    else if (i === 1) hadiahText = `<div class="hadiah">🥈 ${hadiah.juara2}</div>`;
    else if (i === 2) hadiahText = `<div class="hadiah">🥉 ${hadiah.juara3}</div>`;

    div.innerHTML = `
      ${rankDisplay}
      <div class="nama">${p.nama.toUpperCase()}</div>
      <div class="nilai">
        💡 Kreativitas: <span>${p.nilaiKreatif.toFixed(1)}</span><br>
        🏡 Lokal: <span>${p.nilaiLokal.toFixed(1)}</span><br>
        🚀 Viral: ${tampilkanPoin ? `<span>${p.viral.toFixed(1)}</span>` : `<span style="color:gold">🔒</span>`}
      </div>
      <div class="total">⭐ <span class="angka">0.0</span></div>
      ${hadiahText}
      <div class="status">${tampilkanPoin ? "✅ Poin sudah dihitung lengkap" : "⏳ Poin viral belum ditampilkan"}</div>
      <a href="${p.linkVideo}" target="_blank" class="link">📺 Lihat Video</a>
    `;
    wadah.appendChild(div);

    const totalEl = div.querySelector(".angka");
    totalEl.dataset.animated = "false";
    setTimeout(() => animateValue(totalEl, 0, p.total, 2000), i * 400);
  });
}

// ===============================
// 🕹️ Scroll Listener
// ===============================
function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
}
window.addEventListener("scroll", () => {
  document.querySelectorAll(".angka").forEach(el => {
    if (isInViewport(el) && el.dataset.animated === "false") {
      el.dataset.animated = "true";
      const nilai = parseFloat(el.textContent);
      animateValue(el, 0, nilai, 2000);
    }
  });
});

tampilkanDataSeason();
selectSeason.addEventListener("change", tampilkanDataSeason);