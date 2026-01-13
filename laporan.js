// =====================================================
// laporan.js
// LAPORAN PER MUSIM – RISMA FARM
// ❌ Tidak ada laporan gabungan antar musim
// =====================================================

// ---------- UTIL ----------
function rupiah(n) {
  return Number(n || 0).toLocaleString("id-ID");
}

function pilihLahan(key) {
  if (key === "risma") return rismaFarm;
  if (key === "umi") return umi;
  if (key === "umi2") return umi2;
  return null;
}

// ---------- INIT ----------
window.addEventListener("DOMContentLoaded", () => {
  const lahanSelect = document.getElementById("lahan");
  lahanSelect.addEventListener("change", isiMusim);
  isiMusim(); // load awal
});

// ---------- ISI MUSIM ----------
function isiMusim() {
  const lahanKey = document.getElementById("lahan").value;
  const lahan = pilihLahan(lahanKey);
  const musimSelect = document.getElementById("musim");

  musimSelect.innerHTML = "";

  if (!lahan || !lahan.musim) return;

  // data terbaru selalu di atas → urutan object dipertahankan
  Object.entries(lahan.musim).forEach(([key, m]) => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = m.label;
    musimSelect.appendChild(opt);
  });
}

// ---------- GENERATE LAPORAN ----------
function generateLaporan() {
  const jenis = document.getElementById("jenis").value;
  const lahanKey = document.getElementById("lahan").value;
  const musimKey = document.getElementById("musim").value;

  const lahan = pilihLahan(lahanKey);
  if (!lahan || !lahan.musim || !lahan.musim[musimKey]) {
    alert("Data musim tidak ditemukan");
    return;
  }

  const musim = lahan.musim[musimKey];

  let teks = `*LAPORAN ${musim.label.toUpperCase()}*\n`;
  teks += `${lahan.nama || ""}\n\n`;

  // ===== MODAL =====
  if (jenis === "modal") {
    teks += "*MODAL*\n";
    Object.entries(musim.modal || {}).forEach(([k, v]) => {
      teks += `- ${k}: ${rupiah(v)}\n`;
    });
  }

  // ===== BIAYA =====
  if (jenis === "biaya") {
    teks += "*BIAYA PRODUKSI*\n";
    (musim.biaya || []).forEach(b => {
      teks += `📆 ${b.tanggal}\n${b.keterangan}\n💸 ${rupiah(b.jumlah)}\n\n`;
    });
  }

  // ===== PANEN (PHP) =====
  if (jenis === "panen") {
    teks += "*PHP* (Pencatatan Hasil Panen)\n\n";

    (musim.panen || []).forEach(p => {
      const biayaPanen = p.biayaPanen || 0;
      const surplus = (p.nilai || 0) - biayaPanen;

      teks += "—————\n\n";
      teks += `📆 ${p.tanggal}\n`;
      teks += `${p.komoditas}\n`;
      teks += `⚖️ ${p.qty} ${p.satuan || "kg"}\n`;
      teks += `💰 Omzet: ${rupiah(p.nilai)}\n`;
      teks += `🚜 Biaya Panen: ${rupiah(biayaPanen)}\n`;
      teks += `📊 *Surplus Panen: ${rupiah(surplus)}*\n\n`;
    });

    teks += "*Catatan:*\nSurplus panen belum memperhitungkan biaya produksi lain.";
  }

  // ===== LAPORAN PENUH =====
  if (jenis === "full") {
    const totalModal = Object.values(musim.modal || {}).reduce((a, b) => a + b, 0);
    const totalBiaya = (musim.biaya || []).reduce((a, b) => a + b.jumlah, 0);
    const totalPanen = (musim.panen || []).reduce((a, b) => a + b.nilai, 0);
    const laba = totalPanen - totalBiaya;

    teks += "*RINGKASAN USAHA*\n";
    teks += `Modal: ${rupiah(totalModal)}\n`;
    teks += `Biaya Produksi: ${rupiah(totalBiaya)}\n`;
    teks += `Omzet Panen: ${rupiah(totalPanen)}\n`;
    teks += `*Laba Bersih: ${rupiah(laba)}*\n\n`;

    // ===== BAGI HASIL (HANYA JIKA ADA) =====
    if (musim.skema && musim.skema.tipe === "laba_bersih") {
      teks += "*PEMBAGIAN LABA*\n";
      Object.entries(musim.skema.pembagian || {}).forEach(([k, v]) => {
        teks += `- ${k}: ${rupiah((laba * v) / 100)} (${v}%)\n`;
      });
    }
  }

  document.getElementById("output").textContent = teks;
}

// ---------- SALIN ----------
function salin() {
  const teks = document.getElementById("output").textContent;
  if (!teks) return alert("Tidak ada laporan untuk disalin");

  navigator.clipboard.writeText(teks).then(() => {
    alert("Laporan berhasil disalin");
  });
}