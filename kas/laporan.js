const periodeSelect = document.getElementById("periode");
const checklist = document.getElementById("checklist");
const output = document.getElementById("reportOutput");
const jenisKasSelect = document.getElementById("jenisKas");

// =========================================================
// 🗓 Populate periode options
// =========================================================
function populatePeriodeOptions() {
  const periodeKeys = Object.keys(kasData);
  periodeSelect.innerHTML = "";
  periodeKeys.forEach(p => {
    const option = document.createElement("option");
    option.value = p;
    option.textContent = p;
    periodeSelect.appendChild(option);
  });
}

// =========================================================
// 📋 Populate checklist transaksi
// =========================================================
function populateChecklist() {
  const periode = periodeSelect.value;
  const txs = kasData[periode]?.transaksi || [];
  checklist.innerHTML = "";

  // Tombol pilih semua
  const selectAllBtn = document.createElement("button");
  selectAllBtn.textContent = "Pilih Semua Transaksi";
  selectAllBtn.style.margin = "6px 0";
  selectAllBtn.onclick = () => {
    checklist.querySelectorAll("input[type=checkbox]")
      .forEach(cb => cb.checked = true);
  };
  checklist.appendChild(selectAllBtn);
  checklist.appendChild(document.createElement("hr"));

  // Tombol bulan terakhir
  const lastMonthBtn = document.createElement("button");
  lastMonthBtn.textContent = "Pilih 1 Bulan Terakhir";
  lastMonthBtn.style.margin = "6px";
  lastMonthBtn.onclick = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0);

    checklist.querySelectorAll("input[type=checkbox]").forEach(cb => {
      const txDate = new Date(txs[cb.value].date);
      cb.checked = txDate >= start && txDate <= end;
    });
  };
  checklist.appendChild(lastMonthBtn);

  // Daftar transaksi
  txs.forEach((t, i) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = i;

    label.appendChild(checkbox);
    label.append(` ${t.date} - ${t.description}`);
    checklist.appendChild(label);
    checklist.appendChild(document.createElement("br"));
  });
}

// =========================================================
// 🔑 Generate laporan
// =========================================================
function generateReport() {
  const periode = periodeSelect.value;
  const txs = kasData[periode]?.transaksi || [];

  const checked = [...checklist.querySelectorAll("input:checked")]
    .map(cb => parseInt(cb.value));

  if (!checked.length) {
    output.value = "❗ Harap pilih minimal satu transaksi.";
    return;
  }

  const selected = checked.map(i => txs[i]);
  const sorted = [...selected].sort((a, b) => new Date(a.date) - new Date(b.date));

  const startDate = new Date(sorted[0].date);
  const endDate = new Date(sorted.at(-1).date);

  // Saldo awal
  let saldoAwal = txs
    .filter(t => new Date(t.date) < startDate)
    .reduce((s, t) => s + (t.type === "income" ? t.amount : -t.amount), 0);

  const filtered = sorted.filter(t => !t.description.toLowerCase().includes("saldo awal"));

  const pemasukan = filtered.filter(t => t.type === "income");
  const pengeluaran = filtered.filter(t => t.type === "expense");

  const totalIn = pemasukan.reduce((s, t) => s + t.amount, 0);
  const totalOut = pengeluaran.reduce((s, t) => s + t.amount, 0);
  const saldoAkhir = saldoAwal + totalIn - totalOut;

  const jenisKas = jenisKasSelect.value;
  const namaKas =
    jenisKas === "masjid" ? "Kas Masjid Al-Huda" :
    jenisKas === "ris" ? "Kas RIS" : "Kas Lainnya";

  const lines = [];
  lines.push(`📢 *Laporan ${namaKas}*`);
  lines.push("-------------------------");
  lines.push(`💰 Saldo Awal: ${saldoAwal.toLocaleString("id-ID")}`);
  lines.push("\n🟢 Pemasukan:");

  if (!pemasukan.length) lines.push("(Tidak ada)");
  pemasukan.forEach(t =>
    lines.push(`+ ${t.description}: ${t.amount.toLocaleString("id-ID")}`)
  );

  lines.push(`\nTotal Pemasukan: ${totalIn.toLocaleString("id-ID")}`);
  lines.push("\n🔴 Pengeluaran:");

  if (!pengeluaran.length) lines.push("(Tidak ada)");
  pengeluaran.forEach(t =>
    lines.push(`- ${t.description}: ${t.amount.toLocaleString("id-ID")}`)
  );

  lines.push(`\nTotal Pengeluaran: ${totalOut.toLocaleString("id-ID")}`);
  lines.push(`💰 Saldo Akhir: ${saldoAkhir.toLocaleString("id-ID")}`);
  lines.push("-------------------------");
  lines.push(`📌 https://pulungriswanto.my.id/kas/${jenisKas}`);

  output.value = lines.join("\n");

  // Preview
  document.getElementById("reportPreview").innerHTML = `
    <h3>${namaKas}</h3>
    <p><b>Saldo Akhir:</b> Rp ${saldoAkhir.toLocaleString("id-ID")}</p>
  `;
}

// =========================================================
// 📋 Copy
// =========================================================
function copyReport() {
  navigator.clipboard.writeText(output.value);
  alert("Laporan disalin!");
}

// =========================================================
// 📲 WhatsApp
// =========================================================
function sendToWhatsApp() {
  const url = `https://wa.me/?text=${encodeURIComponent(output.value)}`;
  window.open(url, "_blank");
}

// =========================================================
// 📅 Format bulan
// =========================================================
function formatMonthYear(date) {
  return date.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric"
  });
}

// =========================================================
// 🖨 Print
// =========================================================
function printReport() {
  const win = window.open("", "_blank");
  win.document.write(`
    <html>
    <head><title>Laporan</title></head>
    <body>${document.getElementById("reportPreview").innerHTML}</body>
    </html>
  `);
  win.print();
}

// =========================================================
// Init
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
  populatePeriodeOptions();
  populateChecklist();
  periodeSelect.addEventListener("change", populateChecklist);
});