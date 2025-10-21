// =========================================================
// admin2.js
// =========================================================
// Bagian: dataJuara, perhitungan poin, render peserta, pagination, filter.
// Pastikan admin1.js telah dijalankan dan memeriksa kode admin terlebih dahulu.
// =========================================================

/* =========================================================
   Safety check: jangan jalankan bila admin belum dibuka
   ========================================================= */
function ensureAdminUnlockedOrThrow() {
  if (typeof window.isAdminUnlocked === "function") {
    if (!window.isAdminUnlocked()) {
      console.warn("Aksi dibatalkan: admin belum dibuka (kode admin belum dimasukkan).");
      // Jangan throw agar halaman tidak crash; cukup hentikan eksekusi fungsi yang sensitif.
      return false;
    }
  }
  return true;
}

/* =========================================================
   Contoh dataJuara (struktur yang diperlukan)
   - Kamu bisa mengganti / load dari server / firebase sesuai kebutuhan
   ========================================================= */
const dataJuara = {
  "Season 1": {
    periode: "01 Jan 2025 - 31 Jan 2025",
    tema: "Pertanian Kreatif",
    deskripsi: "Kompetisi video pendek tentang inovasi pertanian.",
    Sponsor: "Komunitas Tanjung Bulan",
    Poin: false, // meskipun false, viral tetap dihitung & tampil
    Hadiah: [
      { kategori: "Juara 1", hadiah: "Rp 2.000.000" },
      { kategori: "Juara 2", hadiah: "Rp 1.000.000" },
      { kategori: "Juara 3", hadiah: "Rp 500.000" }
    ],
    kreator: [
      { nama: "Andi", like: 120, komen: 30, share: 12, ideKonsepNilai: 60, editing: 70, karakter: 30, nuansaLokal: 50, dampakPositif: 40, linkVideo: "https://youtu.be/example1", ideKonsepTipe: "edukasi" },
      { nama: "Budi", like: 80, komen: 10, share: 5, ideKonsepNilai: 50, editing: 60, karakter: 20, nuansaLokal: 40, dampakPositif: 30, linkVideo: "https://youtu.be/example2", ideKonsepTipe: "dokumenter" },
      { nama: "Citra", like: 300, komen: 45, share: 30, ideKonsepNilai: 80, editing: 90, karakter: 45, nuansaLokal: 60, dampakPositif: 70, linkVideo: "https://youtu.be/example3", ideKonsepTipe: "hiburan" }
    ]
  },
  "Season 2": {
    periode: "01 Feb 2025 - 28 Feb 2025",
    tema: "Sayur Lokal",
    deskripsi: "Video inspiratif tentang sayur-sayuran lokal.",
    Sponsor: "Dinamis Farm",
    Poin: true,
    Hadiah: [
      { kategori: "Juara 1", hadiah: "Rp 3.000.000", filter: { field: "total", mode: "max" } },
      { kategori: "Juara 2", hadiah: "Rp 1.500.000" },
      { kategori: "Juara 3", hadiah: "Rp 750.000" }
    ],
    kreator: [
      { nama: "Dewi", like: 220, komen: 20, share: 25, ideKonsepNilai: 70, editing: 80, karakter: 40, nuansaLokal: 55, dampakPositif: 45, linkVideo: "https://youtu.be/example4", ideKonsepTipe: "edukasi" },
      { nama: "Eko", like: 40, komen: 5, share: 2, ideKonsepNilai: 45, editing: 50, karakter: 20, nuansaLokal: 30, dampakPositif: 20, linkVideo: "https://youtu.be/example5", ideKonsepTipe: "tutorial" }
    ]
  }
};

// Expose dataJuara global supaya admin1.js bisa membaca
window.dataJuara = dataJuara;

// beri tahu admin1.js bahwa dataJuara siap
window.dispatchEvent(new Event('dataJuaraReady'));

/* =========================================================
   Utility format rupiah dan angka
   ========================================================= */
function formatRupiah(num) {
  try {
    if (isNaN(num)) return "Rp 0";
    return "Rp " + Number(num).toLocaleString("id-ID");
  } catch (e) {
    return "Rp " + String(num);
  }
}

/* =========================================================
   Perhitungan Nilai
   - PENTING: Viral selalu dihitung dari like, komen, share.
   - Viral akan selalu dimasukkan ke total.
   - dataSeason.Poin akan menentukan apakah kita menampilkan nomor ranking dan/atau mengurutkan berdasarkan total,
     tetapi TIDAK akan mempengaruhi apakah viral dihitung.
   ========================================================= */
function hitungTotal(p) {
  // pastikan numeric
  const like = +p.like || 0;
  const komen = +p.komen || 0;
  const share = +p.share || 0;
  const ide = +p.ideKonsepNilai || 0;
  const edit = +p.editing || 0;
  const karakter = +p.karakter || 0;
  const nuansa = +p.nuansaLokal || 0;
  const dampak = +p.dampakPositif || 0;

  // viral ALWAYS dihitung
  const viral = ((like * 1.0) + (komen * 1.5) + (share * 1.5));

  const nilaiKreatif = (ide * 1.5) + edit + (karakter * 0.5);
  const nilaiLokal = nuansa + dampak;

  // total memasukkan viral senantiasa
  const total = +(nilaiKreatif + nilaiLokal + viral).toFixed(1);

  return { total, nilaiKreatif, nilaiLokal, viral };
}

/* =========================================================
   Filter Juara (pembantu untuk hadiah)
   - Jika filter null => kembalikan null
   - Jika filter.mode === 'max' dan field diberikan -> cari max
   - Jika filter.value disediakan -> cari exact match
   ========================================================= */
function cariPemenangBerdasarkanFilter(dataSeason, filter) {
  if (!filter || typeof filter !== "object") return null;
  const arr = (dataSeason.kreator || []).map(p => ({ ...p, ...hitungTotal(p) }));
  if (!arr.length) return null;

  if (filter.mode === "max" && filter.field) {
    return arr.reduce((a, b) => (b[filter.field] > a[filter.field] ? b : a));
  }
  if (filter.field && typeof filter.value !== "undefined") {
    return arr.find(p => p[filter.field] === filter.value) || null;
  }
  return null;
}

/* =========================================================
   Rendering UI: tampilkanDataSeason
   - Memeriksa window.isAdminUnlocked() sebelum melakukan render sensitif.
   - Menampilkan viral selalu.
   - Jika dataSeason.Poin === false -> tidak mengurutkan ranking dan tidak menampilkan nomor urut.
     Namun masih menampilkan total (termasuk viral).
   ========================================================= */

let currentPage = 1;
const itemsPerPage = 5;

function tampilkanDataSeason() {
  // cek admin unlocked
  if (!ensureAdminUnlockedOrThrow()) {
    // jika tidak unlocked, jangan render daftar peserta
    const wadah = document.getElementById("daftarPeserta");
    if (wadah) wadah.innerHTML = `<div style="padding:18px;color:var(--text-color);">Akses admin belum dibuka. Masukkan kode admin terlebih dahulu.</div>`;
    return;
  }

  const selectSeason = document.getElementById("season");
  if (!selectSeason) return;
  const seasonKey = selectSeason.value;
  const dataSeason = window.dataJuara ? window.dataJuara[seasonKey] : null;
  if (!dataSeason) return;

  // tetap hitung viral selalu — tampilkanPoin hanya mengontrol tampilan ranking/urut
  const tampilkanPoin = (
    dataSeason.Poin === true ||
    dataSeason.Poin === 'true' ||
    dataSeason.Poin === 1 ||
    dataSeason.Poin === '1'
  );

  const data = Array.isArray(dataSeason.kreator) ? dataSeason.kreator.slice() : [];
  // selalu hitung nilai lengkap untuk setiap peserta (viral included)
  let processed = data.map(p => ({ ...p, ...hitungTotal(p) }));

  // jika tampilkanPoin true -> urutkan berdasarkan total desc; jika false -> pertahankan urutan input
  if (tampilkanPoin) {
    processed.sort((a, b) => b.total - a.total);
  }

  const wadah = document.getElementById("daftarPeserta");
  if (!wadah) return;
  wadah.innerHTML = "";
  const isDark = document.body.classList.contains('dark-theme');

  // Info season (tema, deskripsi, periode, sponsor)
  const infoRange = document.getElementById("infoRange");
  if (infoRange) {
    infoRange.innerHTML = `
      <div style="background:${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'};padding:14px;border-radius:12px;margin-top:8px;">
        <div style="font-size:1.05em;font-weight:700;color:${isDark ? '#ffeb3b' : '#b8860b'};">
          🎬 Tema: <span style="color:${isDark ? '#fff' : '#111'};">${dataSeason.tema || "Tanpa Tema"}</span>
        </div>
        <div style="font-size:0.95em;margin-top:8px;line-height:1.4;color:${isDark ? '#ddd' : '#333'};">
          ${dataSeason.deskripsi || ""}
        </div>
        <div style="margin-top:10px;color:${isDark ? '#ddd' : '#444'};">📅 ${dataSeason.periode || "-"}</div>
        <div style="margin-top:8px;font-size:0.95em;">
          <span style="color:${isDark ? '#ffeb3b':'#b8860b'};">🎗️ Sponsor:</span><br>
          <span style="font-style:italic;color:${isDark ? '#fdd835':'#5a4b00'};">${dataSeason.Sponsor || "-"}</span>
        </div>
      </div>
    `;
  }

  // Filter berdasarkan pencarian
  const keyword = document.getElementById("searchNama") ? document.getElementById("searchNama").value.toLowerCase() : "";
  const filtered = keyword ? processed.filter(p => (p.nama || "").toLowerCase().includes(keyword)) : processed;

  // pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  if (currentPage > totalPages) currentPage = 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  // render peserta
  pageItems.forEach((p, idx) => {
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
    div.onmouseover = () => div.style.transform = "translateY(-4px)";
    div.onmouseleave = () => div.style.transform = "translateY(0)";

    // jika tampilkanPoin true -> nomor ranking berdasarkan urutan processed (yang telah di-sort)
    // jika false -> tidak menampilkan nomor ranking (sesuai permintaan)
    const nomorRanking = tampilkanPoin ? `<span style="color:var(--highlight);margin-right:6px">#${(startIndex + idx) + 1}</span>` : "";

    // Tampilkan viral selalu (angka dengan 1 desimal)
    const viralPart = `<b>${(p.viral||0).toFixed(1)}</b>`;

    // Tampilkan total (termasuk viral karena kita selalu menghitung viral)
    const totalPart = `<b style="color:var(--highlight);">${(p.total||0).toFixed(1)}</b>`;

    div.innerHTML = `
      <div class="nama" style="font-weight:700;font-size:1rem">${nomorRanking}${(p.nama || "").toUpperCase()}</div>
      <div class="nilai" style="margin-top:6px;">
        💡 Kreativitas: <b>${(p.nilaiKreatif||0).toFixed(1)}</b><br>
        🏡 Lokal: <b>${(p.nilaiLokal||0).toFixed(1)}</b><br>
        🚀 Viral: ${viralPart}
      </div>
      <div class="total" style="margin-top:8px;">⭐ ${totalPart}</div>
      <a href="${p.linkVideo || '#'}" target="_blank" class="link" style="display:inline-block;margin-top:8px;color:${isDark ? '#81d4fa' : '#0077b6'};">▶️ Lihat Video</a>
    `;
    wadah.appendChild(div);
  });

  // pagination rendering
  const pagination = document.getElementById("pagination");
  if (pagination) {
    pagination.innerHTML = "";
    pagination.style.textAlign = "center";
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = (i === currentPage) ? "active" : "";
      btn.style.cssText = `
        margin:4px;
        padding:6px 10px;
        border-radius:8px;
        border:none;
        cursor:pointer;
        background:${i === currentPage ? 'var(--highlight)' : (isDark ? '#2b2b2b' : '#e6e6e6')};
        color:${i === currentPage ? '#000' : (isDark ? '#fff' : '#111')};
      `;
      btn.onclick = () => {
        currentPage = i;
        tampilkanDataSeason();
        const poinEl = document.getElementById("poin");
        if (poinEl) poinEl.scrollIntoView({ behavior: "smooth" });
      };
      pagination.appendChild(btn);
    }
  }

  // tampilkan hadiah (nama pemenang jika dapat ditentukan, atau "Belum diumumkan")
  const juaraBox = document.getElementById("hadiahList");
  if (juaraBox) {
    juaraBox.innerHTML = "";
    (dataSeason.Hadiah || []).forEach(h => {
      // jika ada filter, coba temukan pemenang berdasarkan filter (mis. max total)
      const pemenang = h.filter ? cariPemenangBerdasarkanFilter(dataSeason, h.filter) : (tampilkanPoin ? processed[parseInt(h.kategori.replace(/\D/g, "")) - 1] : null);
      const adaPemenang = !!pemenang;
      const nama = adaPemenang ? pemenang.nama : "Belum diumumkan";

      const card = document.createElement("div");
      card.className = "hadiah-card";
      card.style.cssText = `
        background: linear-gradient(145deg, var(--card-bg), ${isDark ? '#0f0f0f' : '#fafafa'});
        color: var(--text-color);
        border-radius:14px;
        padding:16px;
        margin:12px 0;
        box-shadow: var(--shadow);
        text-align:left;
        transition: transform .15s;
        line-height:1.4;
      `;
      card.onmouseover = () => card.style.transform = "translateY(-4px)";
      card.onmouseleave = () => card.style.transform = "translateY(0)";

      let isiCard = `
        <div style="font-weight:700;font-size:1.05em">${h.kategori}</div>
        <div style="margin-top:6px;">🎁 ${h.hadiah}</div>
        <div style="margin-top:8px;">🏆 <span style="color:var(--highlight);font-weight:700">${nama}</span></div>
      `;

      if (adaPemenang) {
        isiCard += `
          <div style="margin-top:8px;">⭐ <b>${(pemenang.total||0).toFixed(1)}</b></div>
          <a href="${pemenang.linkVideo || '#'}" target="_blank" style="display:inline-block;margin-top:8px;color:${isDark ? '#81d4fa' : '#0077b6'};">▶️ Lihat Video</a>
        `;
      }

      card.innerHTML = isiCard;
      juaraBox.appendChild(card);
    });
  }
}

/* =========================================================
   Event bindings & helper functions
   ========================================================= */
window.tampilkanDataSeason = tampilkanDataSeason; // expose agar admin1.js bisa memanggilnya

// Jika admin1.js telah memanggil populateSeasonsFromDataJuara via event 'dataJuaraReady',
// maka tampilkanDataSeason akan dipanggil otomatis. Namun kita juga attach beberapa listener.
function setupAdmin2EventBindings() {
  // search input listener (jika ada)
  const searchInput = document.getElementById("searchNama");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      currentPage = 1;
      tampilkanDataSeason();
    });
  }

  // pagination buttons dibuat oleh fungsi tampilkanDataSeason setiap kali dipanggil

  // Jika select season berubah, muat ulang
  const selectSeason = document.getElementById("season");
  if (selectSeason) {
    selectSeason.addEventListener("change", () => {
      currentPage = 1;
      tampilkanDataSeason();
    });
  }
}

// panggil setup bindings sekarang (aman karena fungsi ini idempotent)
setupAdmin2EventBindings();

/* =========================================================
   Jika admin belum unlocked lalu user memasukkan kode kemudian admin1.js memanggil initAdmin,
   user bisa memicu tampilkanDataSeason() — semua fungsi akan memeriksa unlocked saat render.
   ========================================================= */

/* =========================================================
   Akhir file admin2.js
   ========================================================= */