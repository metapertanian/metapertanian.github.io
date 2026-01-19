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
  2026: [

    
{
  "id": "KAS-2026-01-20-1768843120485",
  "tanggal": "2026-01-20",
  "tipe": "keluar",
  "kategori": "Tabungan",
  "sumber": "setoran bulan januari 2026",
  "detail": {
    "Faisol": 30000,
    "Nadia": 32500,
    "Pulung": 42500,
    "Tama": 12500,
    "Putri": 2500
  }
},
{
  "id": "KAS-2026-01-20-1768842965866",
  "tanggal": "2026-01-20",
  "tipe": "masuk",
  "kategori": "Tabungan",
  "sumber": "setoran bulan januari 2026",
  "detail": {
    "Faisol": 30000,
    "Nadia": 32500,
    "Pulung": 42500,
    "Tama": 12500,
    "Putri": 2500
  }
}

  ],

  /* =============================
     TAHUN 2025
  ============================= */
  2025: [

    {
  "id": "KAS-2026-01-20-1768843264649",
  "tanggal": "2026-01-20",
  "tipe": "masuk",
  "kategori": "Tabungan",
  "sumber": "setoran bulan januari 2026",
  "detail": {
    "Pulung": 100000,
    "Nadia": 50000
  }
}

  ]
};