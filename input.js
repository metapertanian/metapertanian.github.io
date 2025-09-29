function formatTanggal(tanggal) {
  const tahun = tanggal.getFullYear();
  const bulan = String(tanggal.getMonth() + 1).padStart(2, "0");
  const hari = String(tanggal.getDate()).padStart(2, "0");
  return `${tahun}-${bulan}-${hari}`;
}

function generateCode() {
  const keterangan = document.getElementById("keterangan").value.trim();
  const kategori = document.getElementById("kategori").value.trim();
  const tipe = document.getElementById("tipe").value.trim();

  const tanggalInput = document.getElementById("tanggal").value;

  const luasJumlah = document.getElementById("luas").value.trim();
  const luasSatuan = document.getElementById("luasSatuan").value.trim();

  const umurJumlah = document.getElementById("umur").value.trim();
  const umurSatuan = document.getElementById("umurSatuan").value.trim();

  const hasilJumlah = parseInt(document.getElementById("hasilJumlah").value);
  const hasilSatuan = document.getElementById("hasilSatuan").value.trim();

  const nominal = parseInt(document.getElementById("nominal").value) || 0;

  let catatan = document.getElementById("catatan").value.trim();
  let foto = document.getElementById("foto").value.trim();
  let video = document.getElementById("video").value.trim();

  if (!tanggalInput || isNaN(hasilJumlah) || !luasJumlah || !umurJumlah) {
    alert("Mohon isi semua data dengan benar.");
    return;
  }

  const date = new Date(tanggalInput);
  const formattedDate = formatTanggal(date);

  // Jika foto kosong → otomatis isi img/[kategori].jpg
  if (!foto) {
    foto = `img/${kategori.toLowerCase().replace(/\s+/g, "-")}.jpg`;
  }

  // Jika video kosong → default string kosong
  if (!video) video = "";

  // Preview
  document.getElementById("previewTanaman").innerText = keterangan + " (" + kategori + ")";
  document.getElementById("previewDate").innerText = formattedDate;
  document.getElementById("previewLuas").innerText = luasJumlah + " " + luasSatuan;
  document.getElementById("previewUmur").innerText = umurJumlah + " " + umurSatuan;
  document.getElementById("previewHasil").innerText = hasilJumlah + " " + hasilSatuan;
  document.getElementById("previewOmzet").innerText = tipe + ": Rp " + nominal.toLocaleString("id-ID");

  document.getElementById("previewImage").src = foto;
  document.getElementById("previewImageContainer").style.display = "block";

  document.getElementById("preview").style.display = "block";

  // Output JSON sesuai struktur baru
  const output = `{
  tanggal: "${formattedDate}",
  keterangan: "${keterangan}",
  kategori: "${kategori}",
  tipe: "${tipe}",
  nominal: ${nominal},
  luas: { jumlah: ${luasJumlah}, satuan: "${luasSatuan}" },
  umur: { jumlah: ${umurJumlah}, satuan: "${umurSatuan}" },
  hasil: { jumlah: ${hasilJumlah}, satuan: "${hasilSatuan}" },
  catatan: "${catatan}",
  foto: "${foto}",
  video: "${video}"
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

// Dropdown otomatis saat halaman load
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