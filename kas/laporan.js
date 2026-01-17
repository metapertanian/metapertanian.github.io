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

  const selectAllBtn = document.createElement("button");
  selectAllBtn.textContent = "Pilih Semua Transaksi";
  selectAllBtn.onclick = () => {
    checklist.querySelectorAll("input[type=checkbox]").forEach(cb => cb.checked = true);
  };

  const selectLastMonthBtn = document.createElement("button");
  selectLastMonthBtn.textContent = "Pilih 1 Bulan Terakhir";
  selectLastMonthBtn.style.marginLeft = "8px";
  selectLastMonthBtn.onclick = () => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    checklist.querySelectorAll("input[type=checkbox]").forEach(cb => {
      const tx = txs[cb.value];
      const d = new Date(tx.date);
      cb.checked = (d.getMonth() === lastMonth.getMonth() && d.getFullYear() === lastMonth.getFullYear());
    });
  };

  checklist.appendChild(selectAllBtn);
  checklist.appendChild(selectLastMonthBtn);
  checklist.appendChild(document.createElement("hr"));

  txs.forEach((t, i) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = i;
    label.appendChild(checkbox);
    label.append(` ${t.date} - ${t.description || formatTanggal(new Date(t.date))}`);
    checklist.appendChild(label);
    checklist.appendChild(document.createElement("br"));
  });
}

// =========================================================
// 🔑 Generate laporan
// =========================================================
function generateReport() {
  const periode = periodeSelect.value;
  const jenisKas = jenisKasSelect.value;
  const txs = kasData[periode]?.transaksi || [];

  const checked = Array.from(checklist.querySelectorAll("input[type=checkbox]:checked"))
    .map(cb => parseInt(cb.value));

  if (!checked.length) {
    output.value = "❗ Harap pilih setidaknya satu transaksi.";
    return;
  }

  const selected = checked.map(i => txs[i]).sort((a,b)=>new Date(a.date)-new Date(b.date));
  const startDate = new Date(selected[0].date);
  const endDate = new Date(selected.at(-1).date);

  let saldoAwal = txs
    .filter(t => new Date(t.date) < startDate)
    .reduce((s, t) => s + (t.type === "income" ? t.amount : -t.amount), 0);

  const filtered = selected.filter(t => !t.description?.toLowerCase().includes("saldo awal"));

  function group(arr) {
    const map = {};
    arr.forEach(t => {
      const label = t.description || formatTanggal(new Date(t.date));
      if (!map[label]) map[label] = { total: 0, count: 0 };
      map[label].total += t.amount;
      map[label].count++;
    });
    return map;
  }

  const pemasukan = filtered.filter(t => t.type === "income");
  const pengeluaran = filtered.filter(t => t.type === "expense");

  const groupedIn = group(pemasukan);
  const groupedOut = group(pengeluaran);

  const totalIn = pemasukan.reduce((s,t)=>s+t.amount,0);
  const totalOut = pengeluaran.reduce((s,t)=>s+t.amount,0);
  const saldoAkhir = saldoAwal + totalIn - totalOut;

  const judulKas = {
    masjid: "Kas Masjid",
    ris: "Kas RIS",
    lainnya: "Kas Lainnya"
  }[jenisKas];

  const linkKas = `https://pulungriswanto.my.id/kas/${jenisKas}`;

  const lines = [];
  lines.push(`📢 *Laporan ${judulKas}*`);
  lines.push(`📅 ${formatMonthYear(startDate)} - ${formatMonthYear(endDate)}`);
  lines.push(`-------------------------`);
  lines.push(`💰 Saldo Awal: ${saldoAwal.toLocaleString("id-ID")}`);

  lines.push(`\n🟢 Pemasukan:`);
  for (const [k,v] of Object.entries(groupedIn))
    lines.push(`+ ${k}: ${v.total.toLocaleString("id-ID")}`);

  lines.push(`\n🔴 Pengeluaran:`);
  for (const [k,v] of Object.entries(groupedOut))
    lines.push(`- ${k}: ${v.total.toLocaleString("id-ID")}`);

  lines.push(`\n💰 Saldo Akhir: ${saldoAkhir.toLocaleString("id-ID")}`);
  lines.push(`📌 Info: ${linkKas}`);

  output.value = lines.join("\n");

  document.getElementById("reportPreview").innerHTML = `
    <h2>${judulKas}</h2>
    <p>${formatMonthYear(startDate)} - ${formatMonthYear(endDate)}</p>
    <p><b>Saldo Awal:</b> ${saldoAwal.toLocaleString("id-ID")}</p>
    <p><b>Total Masuk:</b> ${totalIn.toLocaleString("id-ID")}</p>
    <p><b>Total Keluar:</b> ${totalOut.toLocaleString("id-ID")}</p>
    <p><b>Saldo Akhir:</b> ${saldoAkhir.toLocaleString("id-ID")}</p>
    <hr>
    <small>${linkKas}</small>
  `;
}

// =========================================================
function copyReport() {
  output.select();
  document.execCommand("copy");
}

function sendToWhatsApp() {
  window.open(`https://wa.me/?text=${encodeURIComponent(output.value)}`, "_blank");
}

function formatMonthYear(d) {
  return d.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
}

document.addEventListener("DOMContentLoaded", () => {
  populatePeriodeOptions();
  populateChecklist();
  periodeSelect.addEventListener("change", populateChecklist);
});