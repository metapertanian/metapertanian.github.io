const periodeSelect = document.getElementById("periode");
const checklist = document.getElementById("checklist");
const output = document.getElementById("reportOutput");
const jenisKasSelect = document.getElementById("jenisKas");

// =============================
// INIT
// =============================
document.addEventListener("DOMContentLoaded", () => {
  populatePeriodeOptions();
  populateChecklist();
  periodeSelect.addEventListener("change", populateChecklist);
});

// =============================
// PERIODE
// =============================
function populatePeriodeOptions() {
  periodeSelect.innerHTML = "";
  Object.keys(kasData).forEach(p => {
    const opt = document.createElement("option");
    opt.value = p;
    opt.textContent = p;
    periodeSelect.appendChild(opt);
  });
}

// =============================
// CHECKLIST
// =============================
function populateChecklist() {
  const periode = periodeSelect.value;
  const txs = kasData[periode]?.transaksi || [];

  checklist.innerHTML = "";

  const btn = document.createElement("button");
  btn.textContent = "Centang Bulan Sebelumnya";
  btn.onclick = selectLastMonth;
  checklist.appendChild(btn);
  checklist.appendChild(document.createElement("hr"));

  txs.forEach((t, i) => {
    const label = document.createElement("label");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.value = i;

    label.appendChild(cb);
    label.append(` ${t.date} - ${t.description || "(Tanpa keterangan)"}`);
    checklist.appendChild(label);
    checklist.appendChild(document.createElement("br"));
  });
}

// =============================
// CENTANG BULAN LALU
// =============================
function selectLastMonth() {
  const periode = periodeSelect.value;
  const txs = kasData[periode]?.transaksi || [];

  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const cbs = checklist.querySelectorAll("input[type=checkbox]");
  cbs.forEach((cb, i) => {
    const d = new Date(txs[i].date);
    cb.checked =
      d.getMonth() === lastMonth.getMonth() &&
      d.getFullYear() === lastMonth.getFullYear();
  });
}

// =============================
// GENERATE LAPORAN
// =============================
function generateReport() {
  const periode = periodeSelect.value;
  const jenisKas = jenisKasSelect.value;
  const txs = kasData[periode]?.transaksi || [];

  const checked = [...checklist.querySelectorAll("input:checked")]
    .map(cb => parseInt(cb.value));

  if (!checked.length) {
    output.value = "❗ Pilih minimal satu transaksi.";
    return;
  }

  const selected = checked.map(i => txs[i]);
  const sorted = [...selected].sort((a, b) => new Date(a.date) - new Date(b.date));

  const start = new Date(sorted[0].date);
  const end = new Date(sorted.at(-1).date);

  // =============================
  // SALDO AWAL
  // =============================
  const saldoAwal = txs
    .filter(t => new Date(t.date) < start)
    .reduce((s, t) => s + (t.type === "income" ? t.amount : -t.amount), 0);

  const pemasukan = sorted.filter(t => t.type === "income");
  const pengeluaran = sorted.filter(t => t.type === "expense");

  const totalIn = pemasukan.reduce((s, t) => s + t.amount, 0);
  const totalOut = pengeluaran.reduce((s, t) => s + t.amount, 0);
  const saldoAkhir = saldoAwal + totalIn - totalOut;

  const namaKas = {
    masjid: "Kas Masjid",
    ris: "Kas RIS",
    lainnya: "Kas Lainnya"
  }[jenisKas];

  const urlKas = `https://pulungriswanto.my.id/kas/${jenisKas}`;

  // =============================
  // OUTPUT WA
  // =============================
  const lines = [];
  lines.push(`📢 *Laporan ${namaKas}*`);
  lines.push(`📅 ${formatMonthYear(start)} - ${formatMonthYear(end)}`);
  lines.push(`-----------------------`);
  lines.push(`💰 Saldo Awal: ${saldoAwal.toLocaleString("id-ID")}`);

  lines.push(`\n🟢 Pemasukan:`);
  pemasukan.forEach(t => {
    const ket = t.description || new Date(t.date).toLocaleDateString("id-ID");
    lines.push(`+ ${ket}: ${t.amount.toLocaleString("id-ID")}`);
  });

  lines.push(`\n🔴 Pengeluaran:`);
  pengeluaran.forEach(t => {
    const ket = t.description || new Date(t.date).toLocaleDateString("id-ID");
    lines.push(`- ${ket}: ${t.amount.toLocaleString("id-ID")}`);
  });

  lines.push(`\n💰 Saldo Akhir: ${saldoAkhir.toLocaleString("id-ID")}`);
  lines.push(`📌 Info: ${urlKas}`);

  output.value = lines.join("\n");
}

// =============================
// UTIL
// =============================
function formatMonthYear(d) {
  return d.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric"
  });
}

function copyReport() {
  output.select();
  document.execCommand("copy");
  alert("Laporan disalin!");
}

function sendToWhatsApp() {
  window.open(`https://wa.me/?text=${encodeURIComponent(output.value)}`);
}