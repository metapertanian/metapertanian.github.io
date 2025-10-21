// =========================================================
// 🧮 Hitung Nilai
// =========================================================
function hitungTotal(p, tampilkanPoin) {
  const like = Number(p.like) || 0;
  const komen = Number(p.komen) || 0;
  const share = Number(p.share) || 0;
  const ide = Number(p.ideKonsepNilai) || 0;
  const edit = Number(p.editing) || 0;
  const karakter = Number(p.karakter) || 0;
  const nuansa = Number(p.nuansaLokal) || 0;
  const dampak = Number(p.dampakPositif) || 0;

  const viral = tampilkanPoin ? (like * 1.0) + (komen * 1.5) + (share * 1.5) : 0;
  const nilaiKreatif = (ide * 1.5) + edit + (karakter * 0.5);
  const nilaiLokal = nuansa + dampak;
  const total = +(nilaiKreatif + nilaiLokal + viral).toFixed(1);

  return { total, nilaiKreatif, nilaiLokal, viral };
}

// =========================================================
// 🔍 Filter Juara (pembantu untuk hadiah)
// =========================================================
function cariPemenangBerdasarkanFilter(dataSeason, filter, tampilkanPoin) {
  if (!tampilkanPoin) return null;
  const data = (dataSeason.kreator || []).map(p => ({ ...p, ...hitungTotal(p, true) }));

  if (typeof filter === "string") {
    return data.find(p => p.ideKonsepTipe?.toLowerCase().includes(filter.toLowerCase()));
  }

  if (typeof filter === "object" && filter.field) {
    if (filter.mode === "max") {
      return data.reduce((a, b) => (b[filter.field] > a[filter.field] ? b : a));
    }
    if (filter.value) {
      return data.find(p => p[filter.field] === filter.value);
    }
  }

  return null;
}

// =========================================================
// 📊 Tampilkan Data Season
// =========================================================
let currentPage = 1;
const itemsPerPage = 5;

function tampilkanDataSeason() {
  const seasonKey = selectSeason.value;
  const dataSeason = dataJuara[seasonKey];
  if (!dataSeason) return;

  const tampilkanPoin = [true, "true", 1, "1"].includes(dataSeason.Poin);

  const dataKreator = Array.isArray(dataSeason.kreator) ? [...dataSeason.kreator] : [];
  const ranking = dataKreator.map(p => ({ ...p, ...hitungTotal(p, tampilkanPoin) }));

  if (tampilkanPoin) ranking.sort((a, b) => b.total - a.total);

  const wadah = document.getElementById("daftarPeserta");
  if (!wadah) return;
  wadah.innerHTML = "";

  const isDark = document.body.classList.contains("dark-theme");

  // === Info Season ===
  infoRange.innerHTML = `
    <div style="background:${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"};padding:14px;border-radius:12px;margin-top:8px;">
      <div style="font-size:1.05em;font-weight:700;color:${isDark ? "#ffeb3b" : "#b8860b"};">
        🎬 Tema: <span style="color:${isDark ? "#fff" : "#111"};">${dataSeason.tema || "Tanpa Tema"}</span>
      </div>
      <div style="font-size:0.95em;margin-top:8px;line-height:1.4;color:${isDark ? "#ddd" : "#333"};">
        ${dataSeason.deskripsi || ""}
      </div>
      <div style="margin-top:10px;color:${isDark ? "#ddd" : "#444"};">📅 ${dataSeason.periode || "-"}</div>
      <div style="margin-top:8px;font-size:0.95em;">
        <span style="color:${isDark ? "#ffeb3b" : "#b8860b"};">🎗️ Sponsor:</span><br>
        <span style="font-style:italic;color:${isDark ? "#fdd835" : "#5a4b00"};">${dataSeason.Sponsor || "-"}</span>
      </div>
    </div>
  `;

  // === Aturan Lomba ===
  const aturanEl = document.getElementById("aturanText");
  if (aturanEl) {
    aturanEl.innerHTML = `
      • Lomba terbuka untuk umum.<br>
      • Konten sesuai tema: <b>${dataSeason.tema}</b><br>
      • ${dataSeason.deskripsi}<br><br>
      • Video hasil editan sendiri dan belum pernah diunggah sebelumnya.<br>
      • Gaya video bebas: lucu, edukatif, dokumenter, cinematic, atau motivasi.<br><br>
      <b>Poin Juri:</b><br>
      💡 Kreativitas:<br>
      • ide konsep (150), editing (100), karakter (50).<br><br>
      🏡 Dampak Dusun:<br>
      • nuansa (100), dampak positif (100).<br><br>
      <b>Total Maksimal:</b> 500 poin.<br><br>
      <b>Poin TikTok:</b><br>
      🚀 Poin Viral tak terbatas, dihitung otomatis dari like, komen, share.<br><br>
      Kreator boleh minta bantuan teman/saudara untuk interaksi,<br>
      tapi dilarang spam atau memakai bot/beli interaksi.<br>
      Pelanggaran = pengurangan poin atau diskualifikasi.
    `;
  }

  // === Filter Pencarian ===
  const keyword = document.getElementById("searchNama")?.value.toLowerCase() || "";
  const filtered = keyword ? ranking.filter(p => p.nama.toLowerCase().includes(keyword)) : ranking;

  // === Pagination ===
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  currentPage = Math.min(currentPage, totalPages);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const pageItems = filtered.slice(startIdx, startIdx + itemsPerPage);

  // === Daftar Peserta ===
  for (const peserta of pageItems) {
    const div = document.createElement("div");
    div.className = "peserta show";
    div.style.cssText = `
      background: var(--card-bg);
      border-radius:12px;
      box-shadow: var(--shadow);
      padding:12px;
      margin:10px 0;
      transition: transform .18s;
    `;
    div.onmouseenter = () => (div.style.transform = "translateY(-4px)");
    div.onmouseleave = () => (div.style.transform = "translateY(0)");

    const rankNum = tampilkanPoin ? `<span style="color:var(--highlight);margin-right:6px">#${ranking.indexOf(peserta) + 1}</span>` : "";
    const viralText = tampilkanPoin ? `<b>${peserta.viral.toFixed(1)}</b>` : `<span style="color:gold">🔒</span>`;
    const warningViral = tampilkanPoin ? "" : `<div style="margin-top:6px;color:${isDark ? "#ffcc80" : "#b8860b"};font-size:0.9em;">⚠️ poin viral belum dihitung</div>`;

    div.innerHTML = `
      <div class="nama" style="font-weight:700;font-size:1rem">${rankNum}${peserta.nama.toUpperCase()}</div>
      <div class="nilai" style="margin-top:6px;">
        💡 Kreativitas: <b>${peserta.nilaiKreatif.toFixed(1)}</b><br>
        🏡 Lokal: <b>${peserta.nilaiLokal.toFixed(1)}</b><br>
        🚀 Viral: ${viralText}
      </div>
      <div class="total" style="margin-top:8px;">⭐ <b style="color:var(--highlight);">${peserta.total.toFixed(1)}</b></div>
      ${warningViral}
      <a href="${peserta.linkVideo || "#"}" target="_blank" class="link" style="display:inline-block;margin-top:8px;color:${isDark ? "#81d4fa" : "#0077b6"};">▶️ Lihat Video</a>
    `;
    wadah.appendChild(div);
  }

  // === Navigasi Halaman ===
  const paginationEl = document.getElementById("pagination");
  if (paginationEl) {
    paginationEl.innerHTML = "";
    paginationEl.style.textAlign = "center";

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = i === currentPage ? "active" : "";
      btn.style.cssText = `
        margin:4px;
        padding:6px 10px;
        border-radius:8px;
        border:none;
        cursor:pointer;
        background:${i === currentPage ? "var(--highlight)" : (isDark ? "#2b2b2b" : "#e6e6e6")};
        color:${i === currentPage ? "#000" : (isDark ? "#fff" : "#111")};
      `;
      btn.onclick = () => {
        currentPage = i;
        tampilkanDataSeason();
        document.getElementById("poin")?.scrollIntoView({ behavior: "smooth" });
      };
      paginationEl.appendChild(btn);
    }
  }

  // === Daftar Hadiah ===
  const hadiahList = document.getElementById("hadiahList");
  if (hadiahList) {
    hadiahList.innerHTML = "";

    (dataSeason.Hadiah || []).forEach(h => {
      const pemenang = tampilkanPoin
        ? (h.filter
            ? cariPemenangBerdasarkanFilter(dataSeason, h.filter, true)
            : ranking[parseInt(h.kategori.replace(/\D/g, ""), 10) - 1])
        : null;

      const namaPemenang = tampilkanPoin && pemenang ? pemenang.nama : "Belum diumumkan";
      const card = document.createElement("div");

      card.className = "hadiah-card";
      card.style.cssText = `
        background: linear-gradient(145deg, var(--card-bg), ${isDark ? "#0f0f0f" : "#fafafa"});
        color: var(--text-color);
        border-radius:14px;
        padding:16px;
        margin:12px 0;
        box-shadow: var(--shadow);
        text-align:left;
        transition: transform .15s;
        line-height:1.4;
      `;
      card.onmouseenter = () => (card.style.transform = "translateY(-4px)");
      card.onmouseleave = () => (card.style.transform = "translateY(0)");

      card.innerHTML = `
        <div style="font-weight:700;font-size:1.05em">${h.kategori}</div>
        <div style="margin-top:6px;">🎁 ${h.hadiah}</div>
        <div style="margin-top:8px;">🏆 <span style="color:var(--highlight);font-weight:700">${namaPemenang}</span></div>
        ${pemenang && tampilkanPoin ? `
          <div style="margin-top:8px;">⭐ <b>${pemenang.total.toFixed(1)}</b></div>
          <a href="${pemenang.linkVideo || "#"}" target="_blank" style="display:inline-block;margin-top:8px;color:${isDark ? "#81d4fa" : "#0077b6"};">▶️ Lihat Video</a>
        ` : ""}
      `;
      hadiahList.appendChild(card);
    });
  }
}

// =========================================================
// 🎧 Event Listeners
// =========================================================
selectSeason.addEventListener("change", () => {
  currentPage = 1;
  tampilkanDataSeason();
});

document.getElementById("searchNama")?.addEventListener("input", () => {
  currentPage = 1;
  tampilkanDataSeason();
});

window.addEventListener("load", () => {
  setupKutipanObserver?.();
  tampilkanDataSeason();
});