/* =========================================================
   KAS BANK RISMA
   INPUT DATA MASUK / KELUAR
========================================================= */

function kasId(tanggal) {
  return `KAS-${tanggal}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

const KAS_BANK_RISMA = {

  /* =============================
     TAHUN 2026 (TERBARU DI ATAS)
  ============================= */
  Idul Fitri 1447H: [

    {
      id: kasId("2026-01-16"),
      tanggal: "2026-01-16",
      tipe: "masuk", // masuk | keluar
      kategori: "Bonus Panen",
      sumber: "Panen Cabai RISMA FARM",
      detail: {
        Pulung: 12500,
        Tama: 12500,
        Putri: 12500,
        Nadia: 12500
      },
      bukti: "https://imgur.com/bonus-cabai-16jan.jpg"
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
      },
      bukti: [
        "https://imgur.com/tarik-pulung.jpg",
        "https://imgur.com/tarik-putri.jpg"
      ]
    }

  ],

  /* =============================
     TAHUN 2025
  ============================= */
  Idul Fitri 1446H: [

    {
      id: kasId("2025-12-30"),
      tanggal: "2025-12-30",
      tipe: "masuk",
      kategori: "Bonus Panen",
      sumber: "Panen Awal",
      detail: {
        Faisol: 20000,
        Nadia: 20000
      }
      // bukti boleh tidak diisi
    }

  ]
};