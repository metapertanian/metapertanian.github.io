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
    const checkboxes = checklist.querySelectorAll("input[type=checkbox]");
    checkboxes.forEach(cb => cb.checked = true);
  };
  checklist.appendChild(selectAllBtn);
  checklist.appendChild(document.createElement("hr"));

  // Tombol 1 bulan terakhir
  const lastMonthBtn = document.createElement("button");
  lastMonthBtn.textContent = "Pilih 1 Bulan Terakhir";
  lastMonthBtn.style.margin = "6px";
  lastMonthBtn.onclick = () => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const checkboxes = checklist.querySelectorAll("input[type=checkbox]");
    checkboxes.forEach(cb => {
      const txDate = new Date(txs[cb.value].date);
      cb.checked = txDate >= lastMonth && txDate <= endLastMonth;
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
    label.append(` ${t.date} - ${t.description || "-"}`);

    checklist.appendChild(label);
    checklist.appendChild(document.createElement("br"));
  });
}

// =========================================================
// 🔑 Generate laporan (BAGIAN 1)
// =========================================================
function generateReport() {
  const periode = periodeSelect.value;
  const txs = kasData[periode]?.transaksi || [];

  const checked = Array.from(
    checklist.querySelectorAll("input[type=checkbox]:checked")
  ).map(cb => parseInt(cb.value));

  if (checked.length === 0) {
    output.value = "❗ Harap pilih setidaknya satu transaksi.";
    return;
  }

  const selected = checked.map(i => txs[i]);
  const sortedSelected = [...selected].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const startDate = new Date(sortedSelected[0].date);
  const endDate = new Date(sortedSelected.at(-1).date);

  // ================= Saldo awal =================
  let saldoAwal = txs
    .filter(t => new Date(t.date) < startDate)
    .reduce(
      (s, t) =>
        s + (t.type === "income" ? t.amount : -t.amount),
      0
    );

  // Tambah saldo awal jika ada
  const saldoAwalDalamPeriode = sortedSelected.filter(t =>
    t.description?.toLowerCase().includes("saldo awal")
  );

  saldoAwal += saldoAwalDalamPeriode.reduce(
    (s, t) => s + t.amount,
    0
  );

  // Buang saldo awal dari laporan utama
  const filteredSelected = sortedSelected.filter(
    t => !t.description?.toLowerCase().includes("saldo awal")
  );

  // ================= Grouping =================
  function groupByDescription(arr) {
    const map = {};
    arr.forEach(t => {
      if (!map[t.description]) {
        map[t.description] = { total: 0, count: 0, list: [] };
      }
      map[t.description].total += t.amount;
      map[t.description].count++;
      map[t.description].list.push(t);
    });
    return map;
  }

  const pemasukan = filteredSelected.filter(t => t.type === "income");
  const pengeluaran = filteredSelected.filter(t => t.type === "expense");

  const groupedIn = groupByDescription(pemasukan);
  const groupedOut = groupByDescription(pengeluaran);

  const totalIn = pemasukan.reduce((s, t) => s + t.amount, 0);
  const totalOut = pengeluaran.reduce((s, t) => s + t.amount, 0);
  const saldoAkhir = saldoAwal + totalIn - totalOut;

  const startMonthYear = formatMonthYear(startDate);
  const endMonthYear = formatMonthYear(endDate);

  // ================= Laporan WA (Bagian 1) =================
  const lines = [];

  const jenisKas = jenisKasSelect.value;
  const namaKas =
    jenisKas === "masjid"
      ? "Kas Masjid Al-Huda"
      : jenisKas === "ris"
      ? "Kas RIS"
      : "Kas Lainnya";

  lines.push(`*📢 Laporan ${startMonthYear === endMonthYear ? "Bulanan" : "Tahunan"} ${namaKas}*`);
  lines.push("-------------------------");
  lines.push(`💰 *Saldo Awal:* *${saldoAwal.toLocaleString("id-ID")}*`);
  lines.push("\n🟢 *Pemasukan:*");

  if (pemasukan.length === 0) {
    lines.push("(Tidak ada)");
  } else {
    for (const [desc, obj] of Object.entries(groupedIn)) {
      const label =
        obj.count > 1
          ? `(${obj.count}x) ${desc}`
          : desc;

      lines.push(`+ ${label}: ${obj.total.toLocaleString("id-ID")}`);
    }
  }

  output.value = lines.join("\n");
}

// ================= Tambahan laporan =================
lines.push(`\n*Total Pemasukan:* ${totalIn.toLocaleString("id-ID")}`);
lines.push(`\n🔴 *Pengeluaran:*`);

if (pengeluaran.length === 0) {
  lines.push("(Tidak ada)");
} else {
  for (const [desc, obj] of Object.entries(groupedOut)) {
    const labelText = desc && desc.trim() !== ""
      ? desc
      : new Date(obj.list[0].date).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric"
        });

    const label = obj.count > 1
      ? `(${obj.count}x) ${labelText}`
      : labelText;

    lines.push(`- ${label}: ${obj.total.toLocaleString("id-ID")}`);
  }
}

lines.push(`\n*Total Pengeluaran:* ${totalOut.toLocaleString("id-ID")}`);
lines.push(`\n💰 *Saldo Akhir:* *${saldoAkhir.toLocaleString("id-ID")}*`);
lines.push("-------------------------");

// ================= Video =================
const videoTxs = filteredSelected.filter(t => t.video);

if (videoTxs.length > 0) {
  lines.push("\n🎥 *Dokumentasi Video:*");
  videoTxs.forEach(t => {
    const humanDate = new Date(t.date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
    lines.push(`• ${t.description}`);
    lines.push(`  ${t.video}`);
    lines.push(`  (${humanDate})`);
  });
}

lines.push(`📌 Info: 👉 pulungriswanto.my.id/kas/${jenisKas}`);
lines.push("> dibuat otomatis oleh sistem");

output.value = lines.join("\n");

// =========================================================
// PREVIEW HTML
// =========================================================
const previewDiv = document.getElementById("reportPreview");

let html = `
<div class="laporan-elegan">
  <div class="header">
    <img class="logo" src="/img/risma_1.png" style="width:100px;border-radius:50%;">
    <h2>📊 ${startMonthYear === endMonthYear ? "Laporan Bulanan" : "Laporan Tahunan"} Kas</h2>
    <p>📆 ${startMonthYear === endMonthYear ? startMonthYear : `${startMonthYear} - ${endMonthYear}`}</p>
    <hr>
  </div>

  <p><b>Saldo Awal:</b> Rp ${saldoAwal.toLocaleString("id-ID")}</p>

  <h3 style="color:green;">🟢 Pemasukan</h3>
`;

if (pemasukan.length === 0) {
  html += `<p>(Tidak ada pemasukan)</p>`;
} else {
  html += "<ul>";
  for (const [desc, obj] of Object.entries(groupedIn)) {
    const label = obj.count > 1 ? `(${obj.count}x) ${desc}` : desc;
    html += `<li>${label}: <b>Rp ${obj.total.toLocaleString("id-ID")}</b></li>`;
  }
  html += "</ul>";
}

html += `<p><b>Total Pemasukan:</b> Rp ${totalIn.toLocaleString("id-ID")}</p>`;

html += `<h3 style="color:#d63031;">🔴 Pengeluaran</h3>`;

if (pengeluaran.length === 0) {
  html += `<p>(Tidak ada pengeluaran)</p>`;
} else {
  html += "<ul>";
  for (const [desc, obj] of Object.entries(groupedOut)) {
    const label = obj.count > 1 ? `(${obj.count}x) ${desc}` : desc;
    html += `<li>${label}: <b>Rp ${obj.total.toLocaleString("id-ID")}</b></li>`;
  }
  html += "</ul>";
}

html += `
<p><b>Total Pengeluaran:</b> Rp ${totalOut.toLocaleString("id-ID")}</p>
<p><b>Saldo Akhir:</b> Rp ${saldoAkhir.toLocaleString("id-ID")}</p>
<hr>
<div class="footer">
  📌 Info: <a href="https://pulungriswanto.my.id/kas/${jenisKas}" target="_blank">
  pulungriswanto.my.id/kas/${jenisKas}</a><br>
  <small>Dibuat otomatis oleh sistem</small>
</div>
</div>
`;

previewDiv.innerHTML = html;
previewDiv.style.display = "block";