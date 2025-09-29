// bsi.js
window.kasData = {
  "Tahap 1": {
    awal: "10 Oktober 2025",
    akhir: "9 Oktober 2026",
    plafond: "Rp 10.000.000",
    transaksi: [
      {
        tanggal: "2025-07-01",
        keterangan: "Pencairan KUR Super Mikro",
        kategori: "KUR BSI",
        tipe: "Modal",
        nominal: 2000000,
        luas: { jumlah: 0, satuan: "-" },
        umur: { jumlah: 0, satuan: "-" },
        hasil: { jumlah: 0, satuan: "-" },
        catatan: "Modal awal usaha",
        foto: "img/kur.png",
        video: ""
      },
      {
        tanggal: "2025-07-10",
        keterangan: "Pembelian Pupuk & Bibit",
        kategori: "Padi",
        tipe: "Biaya",
        nominal: 750000,
        luas: { jumlah: 6, satuan: "Rante" },
        umur: { jumlah: 0, satuan: "-" },
        hasil: { jumlah: 0, satuan: "-" },
        catatan: "Pengeluaran awal tanam padi",
        foto: "img/padi.jpg",
        video: ""
      },
      {
        tanggal: "2025-09-05",
        keterangan: "Panen Timun",
        kategori: "Timun",
        tipe: "Omzet",
        nominal: 5000000,
        luas: { jumlah: 500, satuan: "m² (1000 lubang)" },
        umur: { jumlah: 55, satuan: "Hari" },
        hasil: { jumlah: 650, satuan: "Kg" },
        catatan: "Hasil panen timun pertama",
        foto: "img/timun.jpg",
        video: ""
      },
      {
        tanggal: "2025-09-15",
        keterangan: "Angsuran KUR BSI ke-1",
        kategori: "KUR BSI",
        tipe: "Cicilan",
        nominal: 1000000,
        luas: { jumlah: 0, satuan: "-" },
        umur: { jumlah: 0, satuan: "-" },
        hasil: { jumlah: 0, satuan: "-" },
        catatan: "Pembayaran cicilan pertama",
        foto: "img/kur.png",
        video: ""
      }
    ]
  }
};

// ================= Urutkan Data Sekali di Awal =================
Object.values(window.kasData).forEach(p => {
  if (Array.isArray(p.transaksi)) {
    p.transaksi.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  }
});

// ================= Fungsi =================

// Ambil semua transaksi dari periode tertentu (sudah urut terbaru → lama)
function getTransactionsByPeriod(period) {
  return window.kasData[period]?.transaksi || [];
}

// Ambil semua periode
function getAllPeriods() {
  return Object.keys(window.kasData).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  );
}

// Ambil periode terbaru
function getLatestPeriod() {
  const periods = getAllPeriods();
  return periods[periods.length - 1] || null;
}

// Ambil semua transaksi dari seluruh periode (sudah urut terbaru → lama)
function getAllTransactions() {
  return Object.values(window.kasData).flatMap(p => p.transaksi || []);
}

// Ekspor ke window
if (typeof window !== "undefined") {
  window.kas = {
    getTransactionsByPeriod,
    getAllPeriods,
    getLatestPeriod,
    getAllTransactions,
    raw: window.kasData
  };
}