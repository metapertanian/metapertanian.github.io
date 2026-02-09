function formatTanggal(tanggal) {
  const tahun = tanggal.getFullYear();
  const bulan = String(tanggal.getMonth() + 1).padStart(2, "0");
  const hari = String(tanggal.getDate()).padStart(2, "0");
  return `${tahun}-${bulan}-${hari}`;
}

function tambahNol() {
  const amountInput = document.getElementById("amount");
  let val = amountInput.value.trim();
  if (!val) val = "0";
  amountInput.value = parseInt(val + "000");
}

// ================================
// DATA TRANSAKSI
// ================================
let transaksiList = [];

// ================================
// AMBIL DATA FORM
// ================================
function getFormData() {
  let description = document.getElementById("description").value.trim();
  const jenisKas = document.getElementById("jenisKas").value;

  if (!description && jenisKas === "masjid") {
    description = "Infak Jumat";
  }

  const type = document.getElementById("type").value;
  const amount = parseInt(document.getElementById("amount").value);
  const note = document.getElementById("note").value.trim();
  const dateInput = document.getElementById("tanggal").value;
  const foto = document.getElementById("foto").value.trim();
  const video = document.getElementById("video").value.trim();

  if (isNaN(amount) || !dateInput) {
    alert("Mohon isi tanggal dan jumlah dengan benar.");
    return null;
  }

  const formattedDate = formatTanggal(new Date(dateInput));

  let obj = { date: formattedDate, type, amount };

  if (description) obj.description = description;
  if (note) obj.note = note;
  if (foto) obj.foto = foto;
  if (video) obj.video = video;

  return obj;
}

// ================================
// TAMBAH TRANSAKSI
// ================================
function addTransaction() {
  const data = getFormData();
  if (!data) return;

  transaksiList.push(data);

  renderList();
  renderOutput();
  resetForm();
}

// ================================
// EDIT (HAPUS + ISI FORM + SCROLL)
// ================================
function editTransaction(index) {
  const t = transaksiList[index];

  document.getElementById("tanggal").value = t.date;
  document.getElementById("type").value = t.type;
  document.getElementById("amount").value = t.amount;
  document.getElementById("description").value = t.description || "";
  document.getElementById("note").value = t.note || "";
  document.getElementById("foto").value = t.foto || "";
  document.getElementById("video").value = t.video || "";

  transaksiList.splice(index, 1);

  renderList();
  renderOutput();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ================================
// HAPUS
// ================================
function deleteTransaction(index) {
  if (!confirm("Hapus transaksi ini?")) return;
  transaksiList.splice(index, 1);
  renderList();
  renderOutput();
}

// ================================
// HITUNG TOTAL
// ================================
function hitungTotal() {
  let pemasukan = 0;
  let pengeluaran = 0;

  transaksiList.forEach(t => {
    if (t.type === "income") pemasukan += t.amount;
    if (t.type === "expense") pengeluaran += t.amount;
  });

  return { pemasukan, pengeluaran };
}

// ================================
// LIST TRANSAKSI + TOTAL (PREVIEW)
// ================================
function renderList() {
  const preview = document.getElementById("preview");

  if (!transaksiList.length) {
    preview.innerHTML = "";
    preview.style.display = "none";
    return;
  }

  const { pemasukan, pengeluaran } = hitungTotal();
  const saldo = pemasukan - pengeluaran;

  const totalHTML = `
    <div style="padding:10px;border:1px solid #555;border-radius:8px;margin-bottom:10px">
      <strong>📊 Ringkasan</strong><br>
      💰 Pemasukan: <b>Rp ${pemasukan.toLocaleString("id-ID")}</b><br>
      💸 Pengeluaran: <b>Rp ${pengeluaran.toLocaleString("id-ID")}</b><br>
      🧾 Saldo: <b>Rp ${saldo.toLocaleString("id-ID")}</b>
    </div>
  `;

  const listHTML = transaksiList
    .map(
      (t, i) => `
      <div style="border:1px solid #444;padding:8px;border-radius:6px;margin-top:6px">
        <strong>${t.date}</strong> — Rp ${t.amount.toLocaleString("id-ID")}
        <div style="margin-top:6px">
          <button onclick="editTransaction(${i})">✏️ Edit</button>
          <button onclick="deleteTransaction(${i})" style="background:#e53935;color:#fff">🗑 Hapus</button>
        </div>
      </div>
    `
    )
    .join("");

  preview.innerHTML = totalHTML + listHTML;
  preview.style.display = "block";
}

// ================================
// OUTPUT KODE
// ================================
function renderOutput() {
  let text = transaksiList
    .map(t => {
      let rows = [];
      for (let k in t) {
        rows.push(
          typeof t[k] === "string"
            ? `${k}: "${t[k]}"`
            : `${k}: ${t[k]}`
        );
      }
      return `{\n  ${rows.join(",\n  ")}\n},`;
    })
    .join(",\n");

  document.getElementById("result").innerText = text;
  document.getElementById("result").style.display = "block";
  document.getElementById("copyBtn").style.display = "block";
}

// ================================
// RESET FORM
// ================================
function resetForm() {
  document.getElementById("description").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("note").value = "";
  document.getElementById("foto").value = "";
  document.getElementById("video").value = "";
}

// ================================
// COPY
// ================================
function copyToClipboard() {
  navigator.clipboard
    .writeText(document.getElementById("result").innerText)
    .then(() => alert("Kode berhasil disalin!"));
}