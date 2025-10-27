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


  
    // 📜 Aturan
const aturanEl = document.getElementById("aturanText");
if (aturanEl) {
  aturanEl.innerHTML = `
    <div style="
      background: var(--card-bg);
      padding: 18px 20px;
      border-radius: 14px;
      box-shadow: var(--shadow);
      line-height: 1.6;
      font-size: 0.95em;
      color: var(--text-color);
      border-left: 4px solid var(--highlight);
    ">
      <div style="margin-bottom:6px;font-weight:700;font-size:1em;color:var(--highlight);">
        🪧 Syarat & Ketentuan:
      </div>

      <ul style="list-style: none; padding-left: 0; margin: 0;">
  <li>• Pendaftaran: <span style="color:var(--accent);">${dataSeason.periode || "-"}</span></li>
  <li>• Boleh mendaftar 2x. yg dinilai yg terbaru.</li>
  <li>• Tema lomba: <b>${dataSeason.tema}</b></li>
  <li>• ${dataSeason.deskripsi}</li>
  <li>• Lomba terbuka untuk umum.</li>
  <li>• Video hasil karya sendiri dan belum pernah di upload.</li>
  <li>• Format bebas: lucu, edukatif, cinematic, dokumenter, atau motivasi.</li>
  <li>• Konten tidak boleh melanggar hukum.</li>
  <li>• Durasi maksimal 3 menit.</li>
  <li>• Kualitas video minimal HD (720p).</li>
  <li>• Panitia berhak meng-upload dan mengelola konten.</li>
  <li>• Poin dihitung pakai <b>algoritma internal</b> dan bersifat final.</li>
</ul>

      <hr style="margin:14px 0;border:none;border-top:1px dashed var(--border-color);">

      <div style="margin-bottom:6px;font-weight:700;font-size:1em;color:var(--highlight);">
        🏆 Kriteria Penilaian:
      </div>

      <div style="margin-left:10px;">
        <div><b>💡 Kreativitas</b>: <span style="opacity:0.85;">dihitung dari Ide Konsep, Editing, Karakter.</span></div>
        <div style="margin-top:6px;"><b>🏡 Lokal</b>: <span style="opacity:0.85;">Nuansa Lokal dan Dampak Positif atau Pesan Moral.</span></div>
        <div style="margin-top:6px;"><b>🚀 Viral</b>: <span style="opacity:0.85;">dihitung dari interaksi (like, komen, share).</span></div>

</div>

      <ul style="list-style: none; padding-left: 0; margin: 0;">
        <li>Boleh mengajak orang lain untuk menaikkan interaksi tapi dilarang spam, bot, atau beli interaksi. pelanggaran akan dikurangi poin.</li>
      </ul>

<hr style="margin:14px 0;border:none;border-top:1px dashed var(--border-color);">

<div style="margin-bottom:6px;font-weight:700;font-size:1em;color:var(--highlight);">
        ✍️ Cara Pendaftaran:
      </div>
ketik <b>daftar</b> di grup WA : RISMA, Karang Taruna, Tanjung Bulan Squad, atau grup yg disediakan panitia.
      

    </div>
  `;

// 🌟 Sponsor Section Elegan di bawah Aturan
const oldSponsor = document.getElementById("sponsorBox");
if (oldSponsor) oldSponsor.remove();

const sponsorBox = document.createElement("div");
sponsorBox.id = "sponsorBox";
sponsorBox.style.cssText = `
  margin-top: 6px;
  padding: 16px 18px;
  border-radius: 14px;
  background: var(--card-bg);
  color: var(--text-color);
  box-shadow: var(--shadow);
  text-align: center;
  font-size: 0.95rem;
  line-height: 1.6;
  transition: all 0.3s ease;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

// Pastikan bisa handle array maupun string
const sponsors = Array.isArray(dataSeason.Sponsor) ? dataSeason.Sponsor : [dataSeason.Sponsor || "-"];
const logos = Array.isArray(dataSeason.logoSponsor) ? dataSeason.logoSponsor : (dataSeason.logoSponsor ? [dataSeason.logoSponsor] : []);

let sponsorHTML = `
  <div style="font-weight:600; color:var(--highlight); letter-spacing:0.4px; margin-bottom:6px;">
    🤝 Didukung oleh
  </div>
`;

// Tambahkan logo jika ada
if (logos.length > 0) {
  sponsorHTML += `
    <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:14px;margin:10px 0;">
      ${logos.map(src => `
        <img src="${src}" alt="Sponsor Logo"
          style="max-height:55px; max-width:140px; object-fit:contain;
          filter:${document.body.classList.contains('dark-theme') ? 'brightness(0.9)' : 'none'};">
      `).join("")}
    </div>
  `;
}

// Tambahkan daftar nama sponsor
sponsorHTML += `
  <div style="margin-top:6px; font-style:italic; color:var(--accent); font-size:1.05rem;">
    ${sponsors.join(" • ")}
  </div>
`;

sponsorBox.innerHTML = sponsorHTML;
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
      margin:6px 0;transition:transform .15s;line-height:1.5;
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