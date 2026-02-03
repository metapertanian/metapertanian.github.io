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
// MODE FORM
// ================================
let mode = "add"; // add | edit

function setMode(newMode) {
  mode = newMode;
  document.getElementById("formInputs").style.display =
    newMode === "edit" ? "block" : "none";
}

// ================================
// GENERATE CODE
// ================================
function generateCode() {
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
    return;
  }

  const formattedDate = formatTanggal(new Date(dateInput));

  // ================================
  // PREVIEW
  // ================================
  document.getElementById("previewDate").innerText = formattedDate;
  document.getElementById("previewDesc").innerText = description || "-";
  document.getElementById("previewType").innerText =
    type === "income" ? "Pemasukan" : "Pengeluaran";
  document.getElementById("previewAmount").innerText =
    amount.toLocaleString("id-ID");
  document.getElementById("previewNote").innerText = note || "-";

  // Foto
  const imgWrap = document.getElementById("previewImageContainer");
  if (foto) {
    document.getElementById("previewImage").src = foto;
    imgWrap.style.display = "block";
  } else {
    imgWrap.style.display = "none";
  }

  // Video
  const videoLink = document.getElementById("previewVideoLink");
  if (video) {
    videoLink.href = video;
    videoLink.style.display = "inline-block";
  } else {
    videoLink.style.display = "none";
  }

  document.getElementById("preview").style.display = "block";

  // ================================
  // OUTPUT CODE (DINAMIS)
  // ================================
  let rows = [];
  rows.push(`date: "${formattedDate}"`);
  rows.push(`type: "${type}"`);
  rows.push(`amount: ${amount}`);

  if (description) rows.push(`description: "${description}"`);
  if (note) rows.push(`note: "${note}"`);
  if (foto) rows.push(`foto: "${foto}"`);
  if (video) rows.push(`video: "${video}"`);

  const output = `{
  ${rows.join(",\n  ")}
},`;

  document.getElementById("result").innerText = output;
  document.getElementById("result").style.display = "block";
  document.getElementById("copyBtn").style.display = "block";

  setMode("add");
}

function copyToClipboard() {
  const resultText = document.getElementById("result").innerText;
  navigator.clipboard.writeText(resultText).then(() => {
    alert("Kode berhasil disalin!");
  });
}