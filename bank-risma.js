// bank-risma.js // Rekap BONUS PANEN & SALDO BANK RISMA // Membaca data dari file lahan (rismafarm.js, umi.js, umi2.js, dll) // Mengurangi saldo berdasarkan tariktunai.js

// ====== KONFIGURASI ====== const LAHAN_LIST = [ typeof rismaFarm !== "undefined" ? rismaFarm : null, typeof umi !== "undefined" ? umi : null, typeof umi2 !== "undefined" ? umi2 : null ].filter(Boolean);

// ====== STATE ====== let bonusAnggota = {}; let tarikAnggota = {}; let riwayat = [];

// ====== INIT ====== anggota.forEach(nama => { bonusAnggota[nama] = 0; tarikAnggota[nama] = 0; });

// ====== BACA BONUS PANEN ====== LAHAN_LIST.forEach(lahan => { Object.values(lahan.musim || {}).forEach(musim => { (musim.panen || []).forEach(p => { if (p.bonusPanen && p.bonusPanen.total && p.bonusPanen.anggota) { const perOrang = p.bonusPanen.total / p.bonusPanen.anggota.length;

p.bonusPanen.anggota.forEach(nama => {
      if (bonusAnggota[nama] !== undefined) {
        bonusAnggota[nama] += perOrang;
      }
    });

    riwayat.push({
      tipe: "bonus",
      tanggal: p.tanggal,
      keterangan: `${p.komoditas} (${lahan.nama || "Lahan"})`,
      jumlah: p.bonusPanen.total
    });
  }
});

}); });

// ====== BACA TARIK TUNAI ====== if (typeof tarikTunai !== "undefined") { tarikTunai.forEach(t => { if (tarikAnggota[t.nama] !== undefined) { tarikAnggota[t.nama] += t.jumlah; }

riwayat.push({
  tipe: "tarik",
  tanggal: t.tanggal,
  keterangan: `Tarik Tunai - ${t.nama}`,
  jumlah: t.jumlah
});

}); }

// ====== HITUNG TOTAL ====== function hitungTotal(obj) { return Object.values(obj).reduce((a, b) => a + b, 0); }

const totalBonus = hitungTotal(bonusAnggota); const totalTarik = hitungTotal(tarikAnggota); const sisaSaldo = totalBonus - totalTarik;

// ====== SORT RIWAYAT (TERBARU) ====== riwayat.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

// ====== SORT ANGGOTA BERDASARKAN SALDO ====== const tabelAnggota = anggota.map(nama => { return { nama, bonus: bonusAnggota[nama], tarik: tarikAnggota[nama], saldo: bonusAnggota[nama] - tarikAnggota[nama] }; }).sort((a, b) => b.saldo - a.saldo);

// ====== EXPORT UNTUK UI ====== window.BANK_RISMA_DATA = { totalBonus, totalTarik, sisaSaldo, tabelAnggota, riwayat };