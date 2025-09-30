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
  return toDate(a.tanggal) - toDate(b.tanggal);
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

// Ambil data asli dari umi.js
function getRawTransactions() {
  if (window.kasData && currentPeriode && window.kasData[currentPeriode]) {
    return window.kasData[currentPeriode].transaksi || [];
  }
  console.warn("Tidak ada data transaksi tersedia atau periode belum dipilih.");
  return [];
}

// Mapping tipe transaksi dari umi.js → income/expense
function mapTransaction(tx) {
  let type = "expense"; // default keluar
  if (tx.tipe === "Modal" || tx.tipe === "Omzet") type = "income";
  if (tx.tipe === "Biaya" || tx.tipe === "Cicilan") type = "expense";

  return {
    date: tx.tanggal,
    description: tx.keterangan,
    category: tx.kategori,
    type,
    subType: tx.tipe, // Modal / Omzet / Biaya / Cicilan
    amount: tx.nominal,
    note: tx.catatan,
    foto: tx.foto,
    video: tx.video
  };
}

// Hitung saldo berjalan
function computeLedger(startingBalance = 0) {
  const raw = getRawTransactions().map(mapTransaction);
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
  const raw = getRawTransactions().map(mapTransaction);
  const income = raw.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = raw.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  return { income, expense, net: income - expense };
}

// =================== Render Tabel ===================
function renderSummaryTable() {
  const ledger = computeLedger();
  const tbody = document.querySelector("#summary-body");
  if (!tbody) return;
  tbody.innerHTML = "";

  ledger.forEach(row => {
    const tr = document.createElement("tr");

    const dateTd = document.createElement("td");
    dateTd.innerHTML = formatTanggalPendekHTML(row.date);

    const incomeTd = document.createElement("td");
    incomeTd.textContent = row.type === "income" ? (row.amount / 1000).toLocaleString("id-ID") : "-";
    if (row.type === "income") {
      incomeTd.classList.add("income");
      incomeTd.style.cursor = "pointer";
      incomeTd.style.textDecoration = "underline";
      incomeTd.addEventListener("click", () => showTransactionPopup(row, incomeTd));
    }

    const expenseTd = document.createElement("td");
    expenseTd.textContent = row.type === "expense" ? (row.amount / 1000).toLocaleString("id-ID") : "-";
    if (row.type === "expense") {
      expenseTd.classList.add("expense");
      expenseTd.style.cursor = "pointer";
      expenseTd.style.textDecoration = "underline";
      expenseTd.addEventListener("click", () => showTransactionPopup(row, expenseTd));
    }

    const balanceTd = document.createElement("td");
    balanceTd.textContent = (row.balanceAfter / 1000).toLocaleString("id-ID");

    tr.append(dateTd, incomeTd, expenseTd, balanceTd);
    tbody.appendChild(tr);
  });

  const sums = summary();
  const tfoot = document.querySelector("#summary-foot");
  if (!tfoot) return;
  tfoot.innerHTML = `
    <tr class="totals">
      <td><strong>Total</strong></td>
      <td class="income"><strong>${(sums.income / 1000).toLocaleString("id-ID")}</strong></td>
      <td class="expense"><strong>${(sums.expense / 1000).toLocaleString("id-ID")}</strong></td>
      <td><strong>${((sums.income - sums.expense) / 1000).toLocaleString("id-ID")}</strong></td>
    </tr>
  `;
}