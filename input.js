// ================= Format Tanggal =================
function formatTanggal(tanggal) {
  const tahun = tanggal.getFullYear();
  const bulan = String(tanggal.getMonth() + 1).padStart(2, "0");
  const hari = String(tanggal.getDate()).padStart(2, "0");
  return `${tahun}-${bulan}-${hari}`;
}

// ================= Tombol +000 =================
function tambahNol() {
  const nominalInput = document.getElementById("nominal");
  let nilai = nominalInput.value.trim();

  if (!nilai) {
    nominalInput.value = "0";
  } else {
    // hanya angka
    nilai = nilai.replace(/\D/g, "");
    nominalInput.value = nilai + "000";
  }
}

// ================= Generate Kode JSON =================
function generateCode() {
  const tanggalInput = document.getElementById("tanggal").value;
  const keterangan = document.getElementById("keterangan").value.trim();
  const kategori = document.getElementById("kategori").value.trim();
  const tipe = document.getElementById("tipe").value.trim(); // Biaya / Omzet / Modal / Cicilan / Ongkos
  const nominal = parseInt(document.getElementById("nominal").value) || 0;

  const luasJumlah = document.getElementById("luas").value.trim();
  const luasSatuan = document.getElementById("luasSatuan").value.trim();

  const umurJumlah = document.getElementById("umur").value.trim();
  const umurSatuan = document.getElementById("umurSatuan").value.trim();

  const hasilJumlah = document.getElementById("hasilJumlah").value.trim();
  const hasilSatuan = document.getElementById("hasilSatuan").value.trim();

  let catatan = document.getElementById("catatan").value.trim();
  let foto = document.getElementById("foto").value.trim();
  let video = document.getElementById("video").value.trim();

  // Validasi wajib isi
  if (!tanggalInput || !keterangan || !kategori || !tipe || nominal <= 0) {
    alert("Mohon isi semua data wajib (Tanggal, Keterangan, Kategori, Tipe, Nominal).");
    return;
  }

  const date = new Date(tanggalInput);
  const formattedDate = formatTanggal(date);

  // Foto → jika user isi manual
  if (foto && !foto.startsWith("/")) {
    foto = "/" + foto;
  }

  // Default kosong
  if (!catatan) catatan = "";
  if (!video) video = "";

  // ================= Preview =================
  document.getElementById("previewTanggal").innerText = formattedDate;
  document.getElementById("previewKeterangan").innerText = keterangan;
  document.getElementById("previewKategori").innerText = kategori;

  // preview tipe dengan warna class
  const tipeEl = document.getElementById("previewTipe");
  tipeEl.innerText = tipe;
  tipeEl.className = "type " + tipe.toLowerCase(); // sinkron dengan CSS fungsi2.js

  document.getElementById("previewNominal").innerText = "Rp " + nominal.toLocaleString("id-ID");
  document.getElementById("previewLuas").innerText = luasJumlah ? (luasJumlah + " " + luasSatuan) : "-";
  document.getElementById("previewUmur").innerText = umurJumlah ? (umurJumlah + " " + umurSatuan) : "-";
  document.getElementById("previewHasil").innerText = hasilJumlah ? (hasilJumlah + " " + hasilSatuan) : "-";
  document.getElementById("previewCatatan").innerText = catatan || "-";

  if (foto) {
    document.getElementById("previewImage").src = foto;
    document.getElementById("previewImageContainer").style.display = "block";
  } else {
    document.getElementById("previewImageContainer").style.display = "none";
  }

  document.getElementById("preview").style.display = "block";

  // ================= Output JSON =================
  const output = `{
  tanggal: "${formattedDate}",
  keterangan: "${keterangan}",
  kategori: "${kategori}",
  tipe: "${tipe}",
  nominal: ${nominal},
  luas: { jumlah: ${luasJumlah || 0}, satuan: "${luasJumlah ? luasSatuan : ""}" },
  umur: { jumlah: ${umurJumlah || 0}, satuan: "${umurJumlah ? umurSatuan : ""}" },
  hasil: { jumlah: ${hasilJumlah || 0}, satuan: "${hasilJumlah ? hasilSatuan : ""}" },
  catatan: "${catatan}",
  foto: "${foto}",
  video: "${video}"
},`;

  const resultDiv = document.getElementById("result");
  resultDiv.innerText = output;
  resultDiv.style.display = "block";
  document.getElementById("copyBtn").style.display = "block";
}

// ================= Copy to Clipboard =================
function copyToClipboard() {
  const resultText = document.getElementById("result").innerText;
  navigator.clipboard.writeText(resultText).then(() => {
    alert("Kode berhasil disalin!");
  });
}

// ================= Inject CSS untuk Preview =================
(function injectTypeStyles(){
  if (document.getElementById("mp-type-styles-input")) return;
  const style = document.createElement("style");
  style.id = "mp-type-styles-input";
  style.innerHTML = `
.type {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
}
.type.modal {
  background: #2e7d32; /* hijau tua */
}
.type.omzet {
  background: #43a047; /* hijau terang */
}
.type.biaya {
  background: #e53935; /* merah */
}
.type.cicilan {
  background: #fb8c00; /* oranye */
}
.type.ongkos {
  background: #6a1b9a; /* ungu */
}
`;
  document.head.appendChild(style);
})();