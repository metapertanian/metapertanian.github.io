
// =========================================================
// 🔎 Pencarian Kreator
// =========================================================
const searchContainer = document.createElement("div");
searchContainer.style.textAlign = "center";
searchContainer.style.margin = "10px 0";
searchContainer.innerHTML = `
  <input type="text" id="searchNama" placeholder="Cari nama kreator..."
    style="padding:10px 14px;border-radius:10px;width:75%;max-width:380px;
    border:1px solid var(--text-color);outline:none;
    background:var(--input-bg);color:var(--text-color);
    text-align:center;transition:all 0.3s ease;">
`;
const poinTitle = document.querySelector("#poin h2");
if (poinTitle) poinTitle.insertAdjacentElement("afterend", searchContainer);

// 🌟 Efek saat fokus pencarian: arahkan layar ke #poin tanpa menggeser form
document.addEventListener("focusin", e => {
  if (e.target.id === "searchNama") {
    const searchBox = e.target;
    searchBox.style.transform = "none";
    searchBox.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
    const poinSection = document.getElementById("poin");
    if (poinSection) {
      const y = poinSection.getBoundingClientRect().top + window.scrollY - 50; // offset agar judul tetap terlihat
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }
});

document.addEventListener("focusout", e => {
  if (e.target.id === "searchNama") {
    const searchBox = e.target;
    searchBox.style.boxShadow = "none";
  }
});

// =========================================================
// 🧮 Hitung Nilai
// =========================================================
function hitungTotal(p, tampilkanPoin) {
  const like = +p.like || 0, komen = +p.komen || 0, share = +p.share || 0;
  const ide = +p.ideKonsepNilai || 0, edit = +p.editing || 0, karakter = +p.karakter || 0;
  const nuansa = +p.nuansaLokal || 0, dampak = +p.dampakPositif || 0;
  const viral = tampilkanPoin ? ((like * 1.0) + (komen * 1.5) + (share * 1.5)) : 0;
  const nilaiKreatif = (ide * 1.5) + edit + (karakter * 0.5);
  const nilaiLokal = nuansa + dampak;
  const total = +(nilaiKreatif + nilaiLokal + (tampilkanPoin ? viral : 0)).toFixed(1);
  return { total, nilaiKreatif, nilaiLokal, viral };
}

// =========================================================
// 🔍 Filter Juara
// =========================================================
function cariPemenangBerdasarkanFilter(dataSeason, filter, tampilkanPoin) {
  if (!tampilkanPoin) return null;
  const data = (dataSeason.kreator || []).map(p => ({ ...p, ...hitungTotal(p, true) }));
  if (typeof filter === "string") return data.find(p => p.ideKonsepTipe?.toLowerCase().includes(filter.toLowerCase()));
  if (typeof filter === "object" && filter.field) {
    if (filter.mode === "max") return data.reduce((a, b) => (b[filter.field] > a[filter.field] ? b : a));
    else if (filter.value) return data.find(p => p[filter.field] === filter.value);
  }
  return null;
}

// =========================================================
// 📊 Tampilkan Data Season
// =========================================================
let currentPage = 1;
const itemsPerPage = 5;

function tampilkanDataSeason() {
  const season = selectSeason.value;
  const dataSeason = dataJuara[season];
  if (!dataSeason) return;

  const tampilkanPoin = (dataSeason.Poin === true || dataSeason.Poin === 'true' || dataSeason.Poin === 1 || dataSeason.Poin === '1');
  const data = Array.isArray(dataSeason.kreator) ? dataSeason.kreator.slice() : [];
  let ranking = data.map(p => ({ ...p, ...hitungTotal(p, tampilkanPoin) }));
  if (tampilkanPoin) ranking.sort((a, b) => b.total - a.total);

  const wadah = document.getElementById("daftarPeserta");
  if (!wadah) return;
  wadah.innerHTML = "";
  const isDark = document.body.classList.contains('dark-theme');

  // 🧾 Info Season
  infoRange.innerHTML = `
    <div style="background:var(--card-bg);padding:14px 16px;border-radius:12px;box-shadow:var(--shadow);">
      <div style="font-weight:700;color:var(--highlight);font-size:1.05em;">🎬 ${dataSeason.tema || "Tanpa Tema"}</div>
      <div style="margin-top:6px;color:${isDark ? '#ddd' : '#333'};">${dataSeason.deskripsi || ""}</div>
      <div style="margin-top:6px;color:${isDark ? '#bbb' : '#555'};">📅 ${dataSeason.periode || "-"}</div>
      <div style="margin-top:8px;font-size:0.9em;">
        🎗️ <span style="color:var(--highlight);">Sponsor:</span><br><i>${dataSeason.Sponsor || "-"}</i>
      </div>
    </div>
  `;

  
  // Aturan
  const aturanEl = document.getElementById("aturanText");
  if (aturanEl) {
    aturanEl.innerHTML = `
      • Lomba terbuka untuk umum.<br>
      • Konten sesuai tema: <b>${dataSeason.tema}</b><br>
      • ${dataSeason.deskripsi}<br>
      • Video hasil karya sendiri (bukan reupload).<br>
      • Format bebas: lucu, edukatif, cinematic, dokumenter, atau motivasi.<br><br>
      <b>Kriteria Penilaian:</b><br>
      <b>💡 Kreatifitas</b>: Maks 300 poin<br>
      dihitung dari Ide Konsep, Editing, Karakter.<br>
      <b>🏡 Lokal</b>: Maks 200 poin<br>
      dihitung dari Nuansa Lokal, Dampak Positif.<br>
      <b>🚀 Viral</b>: Poin tak terbatas<br>
      Algoritma kami akan menghitung otomatis dari reaksi (like, komen, share).<br><br>
      ✅ Boleh mengajak orang lain untuk menaikkan reaksi.<br>
      ⚠️ Dilarang spam, bot, atau beli reaksi, pelanggaran akan dikurangi poin bahkan diskualifikasi.
    `;

// 🌟 Sponsor Section Elegan di bawah Aturan
const sponsorBox = document.createElement("div");
sponsorBox.style.cssText = `
  margin-top: 18px;
  padding: 14px 16px;
  border-radius: 12px;
  background: var(--card-bg);
  color: var(--text-color);
  box-shadow: var(--shadow);
  text-align: center;
  font-size: 0.95rem;
  line-height: 1.6;
  transition: all 0.3s ease;
`;
sponsorBox.innerHTML = `
  <div style="font-weight:600; color:var(--highlight); letter-spacing:0.4px;">
    🤝 Didukung oleh:
  </div>
  <div style="margin-top:6px; font-style:italic; color:var(--accent); font-size:1.05rem;">
    ${dataSeason.Sponsor || "-"}
  </div>
`;

aturanEl.insertAdjacentElement("afterend", sponsorBox);
  }

  // 🔎 Filter + pagination
  const keyword = document.getElementById("searchNama") ? document.getElementById("searchNama").value.toLowerCase() : "";
  const filtered = keyword ? ranking.filter(p => p.nama.toLowerCase().includes(keyword)) : ranking;
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  if (currentPage > totalPages) currentPage = 1;
  const pageItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // 🧍‍♂️ Peserta Card
  pageItems.forEach(p => {
    const div = document.createElement("div");
    div.className = "peserta show";
    div.style.cssText = `
      background: var(--card-bg);
      border-radius:14px;
      box-shadow: var(--shadow);
      padding:14px 16px;
      margin:12px 0;
      transition:transform .18s;
    `;
    div.onmouseover = () => div.style.transform = "translateY(-4px)";
    div.onmouseleave = () => div.style.transform = "translateY(0)";

    const nomorRanking = tampilkanPoin ? `<span style="color:var(--highlight)">#${ranking.indexOf(p) + 1}</span> ` : "";
    const viralPart = tampilkanPoin ? `<b>${p.viral.toFixed(1)}</b>` : `<span style="color:gold">🔒</span>`;
    const peringatanViral = tampilkanPoin ? "" : `<div style="margin-top:6px;color:${isDark ? '#ffcc80' : '#b8860b'};font-size:0.9em;">⚠️ poin viral belum dihitung</div>`;

    div.innerHTML = `
      <div style="font-weight:700;font-size:1rem">${nomorRanking}${p.nama.toUpperCase()}</div>
      <div style="margin-top:6px;line-height:1.4">
        💡 Kreativitas: <b>${p.nilaiKreatif.toFixed(1)}</b><br>
        🏡 Lokal: <b>${p.nilaiLokal.toFixed(1)}</b><br>
        🚀 Viral: ${viralPart}
      </div>
      <div style="margin-top:8px;">⭐ <b style="color:var(--highlight)">${p.total.toFixed(1)}</b></div>
      ${peringatanViral}
      <a href="${p.linkVideo || '#'}" target="_blank" style="display:inline-block;margin-top:8px;color:var(--accent)">▶️ Lihat Video</a>
    `;
    wadah.appendChild(div);
  });

  // 🔢 Pagination
const pagination = document.getElementById("pagination");
if (pagination) {
  pagination.innerHTML = "";
  pagination.style.textAlign = "center";
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    const isActive = (i === currentPage);

    btn.style.cssText = `
      margin:4px;
      padding:6px 10px;
      border-radius:8px;
      border:none;
      cursor:${isActive ? "default" : "pointer"};
      background:${isActive ? "var(--highlight)" : "var(--card-bg)"};
      color:${isActive ? "var(--card-bg)" : "var(--text-color)"};
      box-shadow:var(--shadow);
      transition:all .25s ease;
    `;

    if (!isActive) {
      btn.addEventListener("mouseover", () => {
        btn.style.background = "var(--accent)";
        btn.style.color = "var(--card-bg)";
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.background = "var(--card-bg)";
        btn.style.color = "var(--text-color)";
      });
      btn.onclick = () => {
        currentPage = i;
        tampilkanDataSeason();
        document.getElementById("poin").scrollIntoView({ behavior: "smooth" });
      };
    }

    pagination.appendChild(btn);
  }
}

  // 🏆 Hadiah
const juaraBox = document.getElementById("hadiahList");
if (juaraBox) {
  juaraBox.innerHTML = "";
  const sudahMenang = new Set(); // ⛔️ untuk mencegah pemenang dobel

  (dataSeason.Hadiah || []).forEach(h => {
    let pemenang = null;

    if (tampilkanPoin) {
      // cari pemenang berdasarkan filter atau ranking
      if (h.filter) {
        pemenang = cariPemenangBerdasarkanFilter(dataSeason, h.filter, true);
      } else {
        const posisi = parseInt(h.kategori.replace(/\D/g, "")) - 1;
        pemenang = ranking[posisi];
      }

      // 🔁 pastikan tidak dobel hadiah
      if (pemenang && sudahMenang.has(pemenang.nama)) {
        // cari pengganti berikutnya yang belum menang
        pemenang = ranking.find(p => !sudahMenang.has(p.nama));
      }

      if (pemenang) sudahMenang.add(pemenang.nama);
    }

    const nama = tampilkanPoin && pemenang ? pemenang.nama : "Belum diumumkan";
    const card = document.createElement("div");
    card.className = "hadiah-card";
    card.style.cssText = `
      background: linear-gradient(145deg, var(--card-bg), ${isDark ? '#0d0d0d' : '#fefefe'});
      border-radius:14px;padding:16px;box-shadow:var(--shadow);
      margin:12px 0;transition:transform .15s;line-height:1.5;
    `;
    card.onmouseover = () => card.style.transform = "translateY(-4px)";
    card.onmouseleave = () => card.style.transform = "translateY(0)";

    card.innerHTML = `
      <div style="font-weight:700;font-size:1.05em">${h.kategori}</div>
      <div style="margin-top:6px;">🎁 ${h.hadiah}</div>
      <div style="margin-top:8px;">🏆 <span style="color:var(--highlight);font-weight:700">${nama}</span></div>
      ${pemenang ? `
        <div style="margin-top:8px;">⭐ <b>${pemenang.total.toFixed(1)}</b></div>
        <a href="${pemenang.linkVideo || '#'}" target="_blank" style="display:inline-block;margin-top:8px;color:var(--accent)">▶️ Lihat Video</a>
      ` : ""}
    `;
    juaraBox.appendChild(card);
  });
}
}

// =========================================================
// 🔁 Event Listeners
// =========================================================
selectSeason.addEventListener("change", () => {
  currentPage = 1;
  tampilkanDataSeason();
});
const searchInput = document.getElementById("searchNama");
if (searchInput) {
  searchInput.addEventListener("input", () => {
    currentPage = 1;
    tampilkanDataSeason();
  });
}
window.addEventListener("load", () => {
  setupKutipanObserver();
  tampilkanDataSeason();
});