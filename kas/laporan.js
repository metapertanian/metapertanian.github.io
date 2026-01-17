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

  // Tombol centang bulan lalu
  const lastMonthBtn = document.createElement("button");
  lastMonthBtn.textContent = "Centang Bulan Sebelumnya";
  lastMonthBtn.style.margin = "6px 0";
  lastMonthBtn.onclick = selectLastMonth;
  checklist.appendChild(lastMonthBtn);

  checklist.appendChild(document.createElement("hr"));

  txs.forEach((t, i) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = i;
    label.appendChild(checkbox);
    label.append(` ${t.date} - ${t.description || "(Tanpa keterangan)"}`);
    checklist.appendChild(label);
    checklist.appendChild(document.createElement("br"));
  });
}

// =========================================================
// ✅ Centang otomatis bulan sebelumnya
// =========================================================
function selectLastMonth() {
  const periode = periodeSelect.value;
  const txs = kasData[periode]?.transaksi || [];

  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const checkboxes = checklist.querySelectorAll("input[type=checkbox]");
  checkboxes.forEach((cb, i) => {
    const d = new Date(txs[i].date);
    cb.checked =
      d.getMonth() === lastMonth.getMonth() &&
      d.getFullYear() === lastMonth.getFullYear();
  });
}

// =========================================================
// 🔑 Generate laporan
// =========================================================
function generateReport() {
  const periode = periodeSelect.value;
  const jenisKas = jenisKasSelect.value;
  const txs = kasData[periode]?.transaksi || [];

  const checked = [...checklist.querySelectorAll("input:checked")]
    .map(cb => parseInt(cb.value));

  if (checked.length === 0) {
    output.value = "❗ Pilih minimal satu transaksi.";
    return;
  }

  const selected = checked.map(i => txs[i]);
  const sortedSelected = [...selected].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const startDate = new Date(sortedSelected[0].date);
  const endDate = new Date(sortedSelected.at(-1).date);

  // ================= SALDO AWAL =================
  let saldoAwal = txs
    .filter(t => new Date(t.date) < startDate)
    .reduce((s, t) =>
      s + (t.type === "income" ? t.amount : -t.amount), 0
    );

  // ================= GROUPING =================
  function groupByDescription(arr) {
    const map = {};
    arr.forEach(t => {
      const key = t.description || new Date(t.date).toLocaleDateString("id-ID");
      if (!map[key]) map[key] = { total: 0, count: 0, list: [] };
      map[key].total += t.amount;
      map[key].count++;
      map[key].list.push(t);
    });
    return map;
  }

  const pemasukan = sortedSelected.filter(t => t.type === "income");
  const pengeluaran = sortedSelected.filter(t => t.type === "expense");

  const groupedIn = groupByDescription(pemasukan);
  const groupedOut = groupByDescription(pengeluaran);

  const totalIn = pemasukan.reduce((s, t) => s + t.amount, 0);
  const totalOut = pengeluaran.reduce((s, t) => s + t.amount, 0);
  const saldoAkhir = saldoAwal + totalIn - totalOut;

  // ================= INFO KAS =================
  const namaKas = {
    masjid: "Kas Masjid",
    ris: "Kas RIS",
    lainnya: "Kas Lainnya"
  }[jenisKas];

  const urlKas = `https://pulungriswanto.my.id/kas/${jenisKas}`;

  // ================= TEXT WA =================
  const lines = [];
  lines.push(`📢 *Laporan ${namaKas}*`);
  lines.push(`📅 ${formatMonthYear(startDate)} - ${formatMonthYear(endDate)}`);
  lines.push(`-------------------------`);
  lines.push(`💰 Saldo Awal: ${saldoAwal.toLocaleString("id-ID")}`);

  lines.push(`\n🟢 Pemasukan:`);
  Object.entries(groupedIn).forEach(([k, v]) => {
    lines.push(`+ ${k}: ${v.total.toLocaleString("id-ID")}`);
  });

  lines.push(`\n🔴 Pengeluaran:`);
  Object.entries(groupedOut).forEach(([k, v]) => {
    lines.push(`- ${k}: ${v.total.toLocaleString("id-ID")}`);
  });

  lines.push(`\n💰 Saldo Akhir: ${saldoAkhir.toLocaleString("id-ID")}`);
  lines.push(`📌 Info: ${urlKas}`);
  lines.push(`> dibuat otomatis oleh sistem`);

  output.value = lines.join("\n");

  // ================= PREVIEW =================
  const previewDiv = document.getElementById("reportPreview");
  previewDiv.innerHTML = `
  <div class="laporan-elegan">
    <h2>📊 ${namaKas}</h2>
    <p>📅 ${formatMonthYear(startDate)} - ${formatMonthYear(endDate)}</p>
    <hr>
    <p><b>Saldo Awal:</b> Rp ${saldoAwal.toLocaleString("id-ID")}</p>

    <h3>🟢 Pemasukan</h3>
    <ul>${Object.entries(groupedIn).map(([k,v]) =>
      `<li>${k}: Rp ${v.total.toLocaleString("id-ID")}</li>`).join("")}
    </ul>

    <h3>🔴 Pengeluaran</h3>
    <ul>${Object.entries(groupedOut).map(([k,v]) =>
      `<li>${k}: Rp ${v.total.toLocaleString("id-ID")}</li>`).join("")}
    </ul>

    <p><b>Saldo Akhir:</b> Rp ${saldoAkhir.toLocaleString("id-ID")}</p>
    <hr>
    <small>${urlKas}</small>
  </div>
  `;
}

// =========================================================
// 🧾 Utilities
// =========================================================
function formatMonthYear(date) {
  return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
}

function copyReport() {
  output.select();
  document.execCommand("copy");
  alert("Laporan disalin!");
}

function sendToWhatsApp() {
  window.open(`https://wa.me/?text=${encodeURIComponent(output.value)}`);
}

// =========================================================
// Init
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
  populatePeriodeOptions();
  populateChecklist();
  periodeSelect.addEventListener("change", populateChecklist);
});