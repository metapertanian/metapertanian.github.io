// =============================
// BANK RISMA – FIX FINAL
// =============================

// -----------------------------
// VALIDASI DATA
// -----------------------------
if (typeof RISMA_FARM === "undefined") {
  console.error("RISMA_FARM tidak terbaca");
}
if (!Array.isArray(anggota)) {
  console.error("anggota.js tidak terbaca");
}

// -----------------------------
// DAFTAR LAHAN
// -----------------------------
const LAHAN_LIST = [
  RISMA_FARM,
  typeof UMI !== "undefined" ? UMI : null,
  typeof UMI2 !== "undefined" ? UMI2 : null
].filter(Boolean);

// -----------------------------
// INIT STATE
// -----------------------------
const bonusAnggota = {};
const tarikAnggota = {};
const riwayat = [];
const panenKey = new Set();

// -----------------------------
// INIT ANGGOTA
// -----------------------------
anggota.forEach(nama => {
  bonusAnggota[nama] = 0;
  tarikAnggota[nama] = 0;
});

// -----------------------------
// BACA BONUS PANEN
// -----------------------------
LAHAN_LIST.forEach(lahan => {
  Object.values(lahan.musim || {}).forEach(musim => {
    (musim.panen || []).forEach(p => {

      if (!p.bonusPanen) return;

      const { total, anggota: list } = p.bonusPanen;
      if (!total || !Array.isArray(list)) return;

      // cegah dobel
      const key = `${lahan.nama}-${p.tanggal}-${p.komoditas}-${total}`;
      if (panenKey.has(key)) return;
      panenKey.add(key);

      const perOrang = total / list.length;

      list.forEach(nama => {
        if (bonusAnggota[nama] !== undefined) {
          bonusAnggota[nama] += perOrang;
        }
      });

      riwayat.push({
        tipe: "bonus",
        tanggal: p.tanggal,
        keterangan: `${p.komoditas} – ${lahan.nama}`,
        jumlah: total
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

console.log("BANK RISMA BERHASIL", window.BANK_RISMA_DATA);