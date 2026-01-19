function kasId(tanggal) {
  return `KAS-${tanggal}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

/* =========================================================
   DATA KAS BANK RISMA (PER TAHUN)
   👉 PERIODE TERBARU DI PALING ATAS
========================================================= */
const KAS_BANK_RISMA = {

  /* =============================
     TAHUN 2026
  ============================= */
  2026: [

    {
      id: kasId("2026-01-16"),
      tanggal: "2026-01-16",
      tipe: "masuk",                 // masuk | keluar
      kategori: "Bonus Panen",
      sumber: "Panen Cabai",
      detail: {
        Pulung: 12500,
        Tama: 12500,
        Putri: 12500,
        Nadia: 12500
      }
    },

    {
      id: kasId("2026-01-20"),
      tanggal: "2026-01-20",
      tipe: "keluar",
      kategori: "Tarik Tunai",
      sumber: "Penarikan Bonus",
      detail: {
        Pulung: 20000,
        Putri: 10000
      }
    }

  ],

  /* =============================
     TAHUN 2025
  ============================= */
  2025: [

    {
      id: kasId("2025-12-30"),
      tanggal: "2025-12-30",
      tipe: "masuk",
      kategori: "Bonus Panen",
      sumber: "Panen Cabai Awal",
      detail: {
        Faisol: 20000,
        Nadia: 20000
      }
    }

  ]
};