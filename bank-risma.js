// bank-risma.js
// Rekap BONUS PANEN & SALDO BANK RISMA
// Membaca data dari semua lahan
// Bonus dihitung SEKALI per panen (anti dobel)
// Tarik tunai mengurangi saldo

/* =============================
   KONFIGURASI LAHAN
============================= */
const LAHAN_LIST = [
  typeof RISMA_FARM !== "undefined" ? RISMA_FARM : null,
  typeof UMI !== "undefined" ? UMI : null,
  typeof UMI2 !== "undefined" ? UMI2 : null,
  typeof HORTI !== "undefined" ? HORTI : null,
  typeof PANGAN !== "undefined" ? PANGAN : null
].filter(Boolean);

/* =============================
   STATE
============================= */
let bonusAnggota = {};
let tarikAnggota = {};
let riwayat = [];

/* =============================
   VALIDASI PANEN (ANTI DOBEL)
============================= */
const PANEN_UNIK = new Set();

/* =============================
   INIT ANGGOTA
============================= */
if (typeof anggota !== "undefined") {
  anggota.forEach(nama => {
    bonusAnggota[nama] = 0;
    tarikAnggota[nama] = 0;
  });
}

/* =============================
   BACA BONUS PANEN
============================= */
LAHAN_LIST.forEach(lahan => {
  Object.values(lahan.musim || {}).forEach(musim => {
    (musim.panen || []).forEach(p => {

      // ===== VALIDASI PANEN UNIK =====
      const panenID = `${lahan.nama}|${musim.label}|${p.tanggal}|${p.komoditas}`;
      if (PANEN_UNIK.has(panenID)) return;
      PANEN_UNIK.add(panenID);

      // ===== HITUNG BONUS =====
      if (
        p.bonusPanen &&
        p.bonusPanen.total > 0 &&
        Array.isArray(p.bonusPanen.anggota) &&
        p.bonusPanen.anggota.length > 0
      ) {
        const perOrang = p.bonusPanen.total / p.bonusPanen.anggota.length;

        p.bonusPanen.anggota.forEach(nama => {
          if (bonusAnggota[nama] !== undefined) {
            bonusAnggota[nama] += perOrang;
          }
        });

        riwayat.push({
          tipe: "bonus",
          tanggal: p.tanggal,
          keterangan: `Bonus Panen ${p.komoditas} – ${lahan.nama}`,
          jumlah: p.bonusPanen.total
        });
      }

    });
  });
});

/* =============================
   BACA TARIK TUNAI
============================= */
if (typeof tarikTunai !== "undefined") {
  tarikTunai.forEach(t => {
    if (tarikAnggota[t.nama] !== undefined) {
      tarikAnggota[t.nama] += t.jumlah;
    }

    riwayat.push({
      tipe: "tarik",
      tanggal: t.tanggal,
      keterangan: `Tarik Tunai – ${t.nama}`,
      jumlah: t.jumlah
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
   SORT DATA
============================= */
riwayat.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

const tabelAnggota = (typeof anggota !== "undefined" ? anggota : [])
  .map(nama => ({
    nama,
    bonus: bonusAnggota[nama] || 0,
    tarik: tarikAnggota[nama] || 0,
    saldo: (bonusAnggota[nama] || 0) - (tarikAnggota[nama] || 0)
  }))
  .sort((a, b) => b.saldo - a.saldo);

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