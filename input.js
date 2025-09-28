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
  const kategori = document.getElementById("kategori").value.trim();
  const tipe = document.getElementById("tipe").value.trim();

  const tanggalInput = document.getElementById("tanggal").value;
  const luas = document.getElementById("luas").value.trim();
  const luasSatuan = document.getElementById("luasSatuan").value.trim();

  const umur = document.getElementById("umur").value.trim();
  const umurSatuan = document.getElementById("umurSatuan").value.trim();

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
  document.getElementById("previewTanaman").innerText = tanaman + " (" + kategori + ")";
  document.getElementById("previewDate").innerText = formattedDate;
  document.getElementById("previewLuas").innerText = luas + " " + luasSatuan;
  document.getElementById("previewUmur").innerText = umur + " " + umurSatuan;
  document.getElementById("previewHasil").innerText = hasilJumlah + " " + hasilSatuan;
  document.getElementById("previewOmzet").innerText = tipe + ": Rp " + omzet.toLocaleString("id-ID");

  document.getElementById("previewImage").src = foto;
  document.getElementById("previewImageContainer").style.display = "block";

  document.getElementById("preview").style.display = "block";

  // Output JSON siap tempel ke budidaya.js
  const output = `{
  tanaman: "${tanaman}",
  kategori: "${kategori}",
  tipe: "${tipe}",
  tanggal: "${formattedDate}",
  luas: "${luas} ${luasSatuan}",
  umur: "${umur} ${umurSatuan}",
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

// Tambahkan dropdown otomatis saat halaman load
document.addEventListener("DOMContentLoaded", () => {
  // Kategori
  document.getElementById("kategori").innerHTML = `
    <option value="Timun">Timun</option>
    <option value="Cabai">Cabai</option>
    <option value="Terong">Terong</option>
    <option value="Jagung">Jagung</option>
    <option value="Singkong">Singkong</option>
    <option value="Padi">Padi</option>
    <option value="Melon">Melon</option>
    <option value="Semangka">Semangka</option>
  `;

  // Tipe
  document.getElementById("tipe").innerHTML = `
    <option value="Biaya">Biaya</option>
    <option value="Omzet">Omzet</option>
    <option value="Modal">Modal</option>
    <option value="Cicilan">Cicilan</option>
  `;

  // Satuan Luas
  document.getElementById("luasSatuan").innerHTML = `
    <option value="M²">M²</option>
    <option value="Rante">Rante</option>
    <option value="Ha">Ha</option>
  `;

  // Satuan Umur
  document.getElementById("umurSatuan").innerHTML = `
    <option value="Hari">Hari</option>
    <option value="Bulan">Bulan</option>
    <option value="Tahun">Tahun</option>
  `;

  // Satuan Hasil
  document.getElementById("hasilSatuan").innerHTML = `
    <option value="Ons">Ons</option>
    <option value="Kg">Kg</option>
    <option value="Ton">Ton</option>
  `;
});