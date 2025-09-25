function formatTanggal(tanggal) {
  const tahun = tanggal.getFullYear();
  const bulan = String(tanggal.getMonth() + 1).padStart(2, "0");
  const hari = String(tanggal.getDate()).padStart(2, "0");
  return `${tahun}-${bulan}-${hari}`;
}

// Tambah 000 untuk omzet
function tambahNolOmzet() {
  const omzetInput = document.getElementById("omzet");
  let val = omzetInput.value.trim();
  if (!val) val = "0";
  omzetInput.value = parseInt(val + "000");
}

function generateCode() {
  const tanaman = document.getElementById("tanaman").value.trim();
  const tanggalInput = document.getElementById("tanggal").value;
  const luas = document.getElementById("luas").value.trim();
  const umur = document.getElementById("umur").value.trim();
  const hasilJumlah = parseInt(document.getElementById("hasilJumlah").value);
  const hasilSatuan = document.getElementById("hasilSatuan").value.trim();
  const omzet = parseInt(document.getElementById("omzet").value) || 0;
  let foto = document.getElementById("foto").value.trim();

  if (!tanggalInput || isNaN(hasilJumlah) || !luas || !umur) {
    alert("Mohon isi semua data dengan benar.");
    return;
  }

  const date = new Date(tanggalInput);
  const formattedDate = formatTanggal(date);

  // Jika foto kosong → otomatis isi img/[tanaman].jpg
  if (!foto) {
    foto = `img/${tanaman.toLowerCase().replace(/\s+/g, "-")}.jpg`;
  }

  // Preview
  document.getElementById("previewTanaman").innerText = tanaman;
  document.getElementById("previewDate").innerText = formattedDate;
  document.getElementById("previewLuas").innerText = luas;
  document.getElementById("previewUmur").innerText = umur;
  document.getElementById("previewHasil").innerText = hasilJumlah + " " + hasilSatuan;
  document.getElementById("previewOmzet").innerText = "Rp " + omzet.toLocaleString("id-ID");

  document.getElementById("previewImage").src = foto;
  document.getElementById("previewImageContainer").style.display = "block";

  document.getElementById("preview").style.display = "block";

  // Output JSON siap tempel ke budidaya.js
  const output = `{
  tanaman: "${tanaman}",
  tanggal: "${formattedDate}",
  luas: "${luas}",
  umur: "${umur}",
  hasil: { jumlah: ${hasilJumlah}, satuan: "${hasilSatuan}" },
  omzet: ${omzet},
  foto: "${foto}"
},`;

  const resultDiv = document.getElementById("result");
  resultDiv.innerText = output;
  resultDiv.style.display = "block";
  document.getElementById("copyBtn").style.display = "block";
}

function copyToClipboard() {
  const resultText = document.getElementById("result").innerText;
  navigator.clipboard.writeText(resultText).then(() => {
    alert("Kode berhasil disalin!");
  });
}