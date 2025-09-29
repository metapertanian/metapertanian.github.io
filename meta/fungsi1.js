// =================== Utilitas ===================
// Format angka ke Rupiah
function formatRupiah(num) {
  return "Rp " + num.toLocaleString("id-ID");
}

// Parsing tanggal string
function toDate(str) {
  return new Date(str + "T00:00:00");
}

// Sort berdasarkan tanggal
function sortByDate(a, b) {
  return toDate(a.date) - toDate(b.date);
}

// Format tanggal pendek dua baris
function formatTanggalPendekHTML(dateStr) {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString("id-ID", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month}<br>${year}`;
}

// Format tanggal panjang
function formatTanggalPanjang(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

// =================== Data & Periode ===================
let currentPeriode = null;

// Normalisasi data dari bsi.js → income/expense
function normalizeTransactions(rawTxs) {
  return rawTxs.map(tx => {
    let type = "expense";
    if (tx.tipe && (tx.tipe.toLowerCase() === "omzet" || tx.tipe.toLowerCase() === "modal")) {
      type = "income";
    }
    return {
      ...tx,
      date: tx.tanggal,
      description: tx.keterangan,
      category: tx.kategori,
      type: type,
      amount: tx.nominal,
      note: tx.catatan,
      foto: tx.foto,
      video: tx.video
    };
  });
}

function getRawTransactions() {
  if (window.kasData && currentPeriode && window.kasData[currentPeriode]) {
    const raw = window.kasData[currentPeriode].transaksi || [];
    return normalizeTransactions(raw);
  }
  console.warn("Tidak ada data kas tersedia atau periode belum dipilih.");
  return [];
}

// Hitung saldo berjalan
function computeLedger(startingBalance = 0) {
  const raw = getRawTransactions();
  const sorted = raw.slice().sort(sortByDate);
  let balance = startingBalance;

  return sorted.map(tx => {
    if (tx.type === "income") balance += tx.amount;
    else balance -= tx.amount;
    return { ...tx, balanceAfter: balance };
  });
}

// Ringkasan total
function summary() {
  const raw = getRawTransactions();
  const income = raw.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = raw.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  return { income, expense, net: income - expense };
}

// Ringkasan per komoditas
function summaryByKomoditas() {
  const raw = getRawTransactions();
  const grouped = {};

  raw.forEach(tx => {
    const kategori = tx.category || "Lainnya";
    if (!grouped[kategori]) {
      grouped[kategori] = { omzet: 0, biaya: 0 };
    }
    if (tx.type === "income") {
      grouped[kategori].omzet += tx.amount;
    } else {
      grouped[kategori].biaya += tx.amount;
    }
  });

  Object.keys(grouped).forEach(k => {
    grouped[k].laba = grouped[k].omzet - grouped[k].biaya;
  });

  return grouped;
}