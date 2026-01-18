// =============================
// BANK RISMA – FINAL STABLE
// =============================

// -----------------------------
// AMBIL DATA LAHAN
// -----------------------------
const LAHAN_LIST = [
  typeof RISMA_FARM !== "undefined" ? RISMA_FARM : null,
  typeof UMI !== "undefined" ? UMI : null,
  typeof UMI2 !== "undefined" ? UMI2 : null
].filter(Boolean);

// -----------------------------
// INIT STATE
// -----------------------------
const bonusAnggota = {};
const tarikAnggota = {};
const riwayat = [];
const panenSudahDihitung = new Set();

// -----------------------------
// INIT ANGGOTA
// -----------------------------
if (!Array.isArray(anggota)) {
  console.error("anggota.js tidak terbaca");
}

anggota.forEach(nama => {
  bonusAnggota[nama] = 0;
  tarikAnggota[nama] = 0;
});

// -----------------------------
// FUNGSI AMBIL BONUS PANEN
// -----------------------------
function extractBonusPanen(p) {
  if (!p) return null;

  // Format 1 (ideal)
  if (
    p.bonusPanen &&
    typeof p.bonusPanen === "object" &&
    p.bonusPanen.total > 0 &&
    Array.isArray(p.bonusPanen.anggota)
  ) {
    return {
      total: Number(p.bonusPanen.total),
      anggota: p.bonusPanen.anggota
    };
  }

  // Format 2 (bonus angka langsung)
  if (typeof p.bonusPanen === "number" && p.bonusPanen > 0) {
    return {
      total: p.bonusPanen,
      anggota: anggota
    };
  }

  // Format 3 (bonus / bonus_panen / bagiHasil)
  const alt = p.bonus || p.bonus_panen || p.bagiHasil;
  if (alt && alt.total > 0 && Array.isArray(alt.anggota)) {
    return {
      total: Number(alt.total),
      anggota: alt.anggota
    };
  }

  return null;
}

// -----------------------------
// BACA PANEN
// -----------------------------
LAHAN_LIST.forEach(lahan => {
  Object.values(lahan.musim || {}).forEach(musim => {
    (musim.panen || []).forEach(p => {

      // VALIDASI DOUBEL
      const idPanen = `${lahan.nama}-${p.tanggal}-${p.komoditas || ""}`;
      if (panenSudahDihitung.has(idPanen)) return;
      panenSudahDihitung.add(idPanen);

      const bonus = extractBonusPanen(p);
      if (!bonus) return;

      const perOrang = bonus.total / bonus.anggota.length;

      bonus.anggota.forEach(nama => {
        if (bonusAnggota[nama] !== undefined) {
          bonusAnggota[nama] += perOrang;
        }
      });

      riwayat.push({
        tipe: "bonus",
        tanggal: p.tanggal,
        keterangan: `${p.komoditas || "Panen"} (${lahan.nama || "Lahan"})`,
        jumlah: bonus.total
      });

    });
  });
});

// -----------------------------
// TARIK TUNAI
// -----------------------------
if (Array.isArray(tarikTunai)) {
  tarikTunai.forEach(t => {
    if (tarikAnggota[t.nama] !== undefined) {
      tarikAnggota[t.nama] += t.jumlah;
    }

    riwayat.push({
      tipe: "tarik",
      tanggal: t.tanggal,
      keterangan: `Tarik Tunai - ${t.nama}`,
      jumlah: t.jumlah
    });
  });
}

// -----------------------------
// HITUNG TOTAL
// -----------------------------
const totalBonus = Object.values(bonusAnggota).reduce((a, b) => a + b, 0);
const totalTarik = Object.values(tarikAnggota).reduce((a, b) => a + b, 0);
const sisaSaldo = totalBonus - totalTarik;

// -----------------------------
// TABEL ANGGOTA
// -----------------------------
const tabelAnggota = anggota.map(nama => ({
  nama,
  bonus: bonusAnggota[nama],
  tarik: tarikAnggota[nama],
  saldo: bonusAnggota[nama] - tarikAnggota[nama]
})).sort((a, b) => b.saldo - a.saldo);

// -----------------------------
// SORT RIWAYAT
// -----------------------------
riwayat.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

// -----------------------------
// EXPORT
// -----------------------------
window.BANK_RISMA_DATA = {
  totalBonus,
  totalTarik,
  sisaSaldo,
  tabelAnggota,
  riwayat
};

console.log("BANK RISMA OK", window.BANK_RISMA_DATA);