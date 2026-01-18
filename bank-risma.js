// =======================================================
// BANK RISMA
// Rekap BONUS PANEN & SALDO ANGGOTA RISMA FARM
// =======================================================
// Membaca data dari:
// - rismafarm.js (RISMA_FARM)
// - umi.js (UMI)
// - umi2.js (UMI2)
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
   STATE
============================= */
let bonusAnggota = {};
let tarikAnggota = {};
let riwayat = [];

/* =============================
   INIT ANGGOTA
============================= */
if (typeof anggota === "undefined") {
  console.error("❌ anggota.js belum dimuat");
}

anggota.forEach(nama => {
  bonusAnggota[nama] = 0;
  tarikAnggota[nama] = 0;
});

/* =============================
   BACA BONUS PANEN (ANTI DOBEL)
============================= */
const PANEN_UNIK = new Set();

LAHAN_LIST.forEach(lahan => {
  Object.values(lahan.musim || {}).forEach(musim => {
    (musim.panen || []).forEach(p => {

      // === VALIDASI DATA PANEN ===
      if (!p.tanggal || !p.nama || !p.bonus) return;

      // === KUNCI UNIK PANEN ===
      const key = `${lahan.nama}|${p.tanggal}|${p.nama}|${p.bonus}`;
      if (PANEN_UNIK.has(key)) return;
      PANEN_UNIK.add(key);

      // === BONUS PER ANGGOTA ===
      if (p.bonusAnggota && typeof p.bonusAnggota === "object") {
        Object.entries(p.bonusAnggota).forEach(([nama, jumlah]) => {
          if (bonusAnggota[nama] !== undefined) {
            bonusAnggota[nama] += Number(jumlah);
          }
        });

        riwayat.push({
          tipe: "bonus",
          tanggal: p.tanggal,
          keterangan: `${p.nama} (${lahan.nama})`,
          jumlah: Number(p.bonus)
        });
      }

    });
  });
});

/* =============================
   BACA TARIK TUNAI
============================= */
if (typeof tarikTunai !== "undefined" && Array.isArray(tarikTunai)) {
  tarikTunai.forEach(t => {
    if (!t.nama || !t.jumlah) return;

    if (tarikAnggota[t.nama] !== undefined) {
      tarikAnggota[t.nama] += Number(t.jumlah);
    }

    riwayat.push({
      tipe: "tarik",
      tanggal: t.tanggal || "-",
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
   SORT RIWAYAT (TERBARU DI ATAS)
============================= */
riwayat.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

/* =============================
   TABEL ANGGOTA
============================= */
const tabelAnggota = anggota.map(nama => ({
  nama,
  bonus: bonusAnggota[nama],
  tarik: tarikAnggota[nama],
  saldo: bonusAnggota[nama] - tarikAnggota[nama]
})).sort((a, b) => b.saldo - a.saldo);

/* =============================
   EXPORT KE HTML
============================= */
window.BANK_RISMA_DATA = {
  totalBonus,
  totalTarik,
  sisaSaldo,
  tabelAnggota,
  riwayat
};

/* =============================
   DEBUG (BOLEH DIHAPUS)
============================= */
// console.log("BANK RISMA DATA:", window.BANK_RISMA_DATA);