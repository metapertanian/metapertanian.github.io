// =======================================================
// bank-risma.js
// BANK RISMA – Rekap BONUS PANEN & SALDO ANGGOTA
// Sumber data:
// - rismafarm.js
// - umi.js
// - umi2.js
// - tariktunai.js
// =======================================================

/* =============================
   KONFIGURASI LAHAN
============================= */
const LAHAN_LIST = [
  typeof RISMA_FARM !== "undefined" ? RISMA_FARM : null,
  typeof UMI !== "undefined" ? UMI : null,
  typeof UMI2 !== "undefined" ? UMI2 : null
].filter(Boolean);

/* =============================
   VALIDASI DATA DASAR
============================= */
if (typeof anggota === "undefined") {
  console.error("❌ anggota.js belum dimuat");
}

/* =============================
   STATE
============================= */
const bonusAnggota = {};
const tarikAnggota = {};
const riwayat = [];

// 🔒 KUNCI UNIK PANEN (ANTI HITUNG 2x)
const PANEN_UNIK = new Set();

/* =============================
   INIT ANGGOTA
============================= */
anggota.forEach(nama => {
  bonusAnggota[nama] = 0;
  tarikAnggota[nama] = 0;
});

/* =============================
   BACA BONUS PANEN DARI SEMUA LAHAN
============================= */
LAHAN_LIST.forEach(lahan => {
  if (!lahan.musim) return;

  Object.values(lahan.musim).forEach(musim => {
    if (!Array.isArray(musim.panen)) return;

    musim.panen.forEach(p => {

      // VALIDASI STRUKTUR BONUS PANEN
      if (
        !p.bonusPanen ||
        !p.bonusPanen.total ||
        !Array.isArray(p.bonusPanen.anggota) ||
        p.bonusPanen.anggota.length === 0
      ) return;

      const totalBonus = Number(p.bonusPanen.total);
      if (totalBonus <= 0) return;

      // 🔒 KUNCI UNIK (lahan + tanggal + komoditas + total bonus)
      const key = `${lahan.nama}|${p.tanggal}|${p.komoditas}|${totalBonus}`;
      if (PANEN_UNIK.has(key)) return;
      PANEN_UNIK.add(key);

      const perOrang = totalBonus / p.bonusPanen.anggota.length;

      // TAMBAHKAN KE SALDO ANGGOTA
      p.bonusPanen.anggota.forEach(nama => {
        if (bonusAnggota[nama] !== undefined) {
          bonusAnggota[nama] += perOrang;
        }
      });

      // RIWAYAT BONUS
      riwayat.push({
        tipe: "bonus",
        tanggal: p.tanggal,
        keterangan: `${p.komoditas} (${lahan.nama})`,
        jumlah: totalBonus
      });

    });
  });
});

/* =============================
   BACA TARIK TUNAI
============================= */
if (typeof tarikTunai !== "undefined" && Array.isArray(tarikTunai)) {
  tarikTunai.forEach(t => {
    if (!t || !t.nama || !t.jumlah) return;

    if (tarikAnggota[t.nama] !== undefined) {
      tarikAnggota[t.nama] += Number(t.jumlah);
    }

    riwayat.push({
      tipe: "tarik",
      tanggal: t.tanggal,
      keterangan: `Tarik Tunai - ${t.nama}`,
      jumlah: Number(t.jumlah)
    });
  });
}

/* =============================
   HITUNG TOTAL
============================= */
function hitungTotal(obj) {
  return Object.values(obj).reduce((a, b) => a + b, 0);
}

const totalBonus = hitungTotal(bonusAnggota);
const totalTarik = hitungTotal(tarikAnggota);
const sisaSaldo = totalBonus - totalTarik;

/* =============================
   TABEL ANGGOTA
============================= */
const tabelAnggota = anggota.map(nama => {
  const bonus = bonusAnggota[nama] || 0;
  const tarik = tarikAnggota[nama] || 0;

  return {
    nama,
    bonus,
    tarik,
    saldo: bonus - tarik
  };
}).sort((a, b) => b.saldo - a.saldo);

/* =============================
   SORT RIWAYAT (TERBARU DI ATAS)
============================= */
riwayat.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

/* =============================
   EXPORT GLOBAL
============================= */
window.BANK_RISMA_DATA = {
  totalBonus,
  totalTarik,
  sisaSaldo,
  tabelAnggota,
  riwayat
};

// DEBUG (boleh dihapus kalau sudah yakin)
console.log("✅ BANK RISMA OK", window.BANK_RISMA_DATA);