// umi.js
window.kasData = {
  "Tanam 2": {
    Luas: "6000 m²",
    Tempat: "Kavlingan Tanjung Bulan RT 01/01",
    transaksi: [
      {
        tanggal: "2025-09-23",
        keterangan: "Edet Jaseng",
        kategori: "Singkong",
        tipe: "Biaya",
        nominal: 525000,
        luas: { jumlah: 6000, satuan: "M²" },
        umur: { jumlah: 0, satuan: "Bulan" },
        hasil: { jumlah: 0, satuan: "Ton" },
        catatan: "15 rante x 35.000",
        foto: "",
        video: ""
      }
    ]
  },
  "Tanam 1": {
    Luas: "6700 m²",
    Tempat: "Kavlingan Tanjung Bulan RT 01/01",
    transaksi: [
      {
        tanggal: "2025-08-29",
        keterangan: "Hasil Panen",
        kategori: "Singkong",
        tipe: "Omzet",
        nominal: 6000000,
        luas: { jumlah: 6700, satuan: "M²" },
        umur: { jumlah: 9, satuan: "Bulan" },
        hasil: { jumlah: 15, satuan: "Ton" },
        catatan: "harga bersih Rp 400 /Kg",
        foto: "",
        video: ""
      },
      {
        tanggal: "2025-08-28",
        keterangan: "Biaya Perawatan",
        kategori: "Singkong",
        tipe: "Biaya",
        nominal: 3000000,
        luas: { jumlah: 6700, satuan: "M²" },
        umur: { jumlah: 0, satuan: "Bulan" },
        hasil: { jumlah: 0, satuan: "Ton" },
        catatan: "catatan tidak ditulis, kira2 pak lurah",
        foto: "",
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
function getTransactionsByPeriod(period) {
  return window.kasData[period]?.transaksi || [];
}

function getAllPeriods() {
  return Object.keys(window.kasData).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  );
}

function getLatestPeriod() {
  const periods = getAllPeriods();
  return periods[periods.length - 1] || null;
}

function getAllTransactions() {
  return Object.values(window.kasData).flatMap(p => p.transaksi || []);
}

if (typeof window !== "undefined") {
  window.kas = {
    getTransactionsByPeriod,
    getAllPeriods,
    getLatestPeriod,
    getAllTransactions,
    raw: window.kasData
  };
}