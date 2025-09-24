function formatTanggal(tanggal) {
  const tahun = tanggal.getFullYear();
  const bulan = String(tanggal.getMonth() + 1).padStart(2, "0");
  const hari = String(tanggal.getDate()).padStart(2, "0");
  return `${tahun}-${bulan}-${hari}`;
}

function generateCode() {
  const tanaman = document.getElementById("tanaman").value;
  const tanggalInput = document.getElementById("tanggal").value;
  const umur = document.getElementById("umur").value.trim();
  const luas = document.getElementById("luas").value.trim();
  const hasilJumlah = parseInt(document.getElementById("hasilJumlah").value);
  const hasilSatuan = document.getElementById("hasilSatuan").value;
  const foto = document.getElementById("foto").value.trim();

  if (!tanggalInput || isNaN(hasilJumlah) || !luas || !umur) {
    alert("Mohon isi semua data dengan benar.");
    return;
  }

  const date = new Date(tanggalInput);
  const formattedDate = formatTanggal(date);

  // Preview
  document.getElementById("previewTanaman").innerText = tanaman;
  document.getElementById("previewDate").innerText = formattedDate;
  document.getElementById("previewUmur").innerText = umur;
  document.getElementById("previewLuas").innerText = luas;
  document.getElementById("previewHasil").innerText = hasilJumlah + " " + hasilSatuan;

  if (foto) {
    document.getElementById("previewImage").src = foto;
    document.getElementById("previewImageContainer").style.display = "block";
  } else {
    document.getElementById("previewImageContainer").style.display = "none";
  }
  document.getElementById("preview").style.display = "block";

  // Kode siap tempel ke budidaya.js
  const output = `{
  tanaman: "${tanaman}",
  tanggal: "${formattedDate}",
  luas: "${luas}",
  hasil: { jumlah: ${hasilJumlah}, satuan: "${hasilSatuan}" },
  umur: "${umur}",
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