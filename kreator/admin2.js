// =========================================================
// 🧩 ADMIN2.JS - Fungsi lanjutan (Kelanjutan dari admin1.js)
// =========================================================

// =================== Konfigurasi Akses Admin ===================
function cekKodeAdmin() {
  const kode = prompt("Masukkan kode akses admin:");
  if (kode === "pro95") {
    localStorage.setItem("isAdmin", "true");
    alert("✅ Akses admin berhasil dibuka!");
    window.location.href = "admin.html";
  } else {
    alert("❌ Kode salah. Akses ditolak.");
  }
}

function cekStatusAdmin() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  if (!isAdmin) {
    alert("🚫 Anda tidak memiliki akses admin!");
    window.location.href = "index.html";
  }
}

// =================== Data Peserta ===================
let pesertaList = JSON.parse(localStorage.getItem("pesertaList")) || [];

// Fungsi simpan data peserta
function simpanPeserta() {
  localStorage.setItem("pesertaList", JSON.stringify(pesertaList));
}

// Fungsi render daftar peserta ke tabel
function renderPeserta() {
  const tbody = document.getElementById("tabelPeserta");
  if (!tbody) return;

  tbody.innerHTML = "";
  pesertaList.forEach((peserta, index) => {
    const baris = document.createElement("tr");

    const poinFinal = peserta.poinViralLocked
      ? peserta.poinUtama
      : peserta.poinUtama + peserta.poinViral;

    baris.innerHTML = `
      <td>${index + 1}</td>
      <td>${peserta.nama}</td>
      <td>${peserta.kategori}</td>
      <td>${formatRupiah(poinFinal)}</td>
      <td>
        <button class="btn-edit" onclick="editPeserta(${index})">Edit</button>
        <button class="btn-hapus" onclick="hapusPeserta(${index})">Hapus</button>
      </td>
    `;
    tbody.appendChild(baris);
  });
}

// =================== Tambah Peserta ===================
function tambahPeserta() {
  const nama = document.getElementById("namaPeserta").value.trim();
  const kategori = document.getElementById("kategoriPeserta").value;
  const poinUtama = parseInt(document.getElementById("poinUtama").value) || 0;
  const poinViral = parseInt(document.getElementById("poinViral").value) || 0;
  const tampilkanPoin =
    document.getElementById("tampilkanPoin").checked || true; // jika false -> true

  if (nama === "") {
    alert("Nama peserta tidak boleh kosong!");
    return;
  }

  const pesertaBaru = {
    nama,
    kategori,
    poinUtama,
    poinViral,
    tampilkanPoin: tampilkanPoin,
    poinViralLocked: false,
  };

  pesertaList.push(pesertaBaru);
  simpanPeserta();
  renderPeserta();
  resetForm();
  alert("✅ Peserta baru berhasil ditambahkan!");
}

// =================== Edit & Hapus Peserta ===================
let indexEdit = -1;

function editPeserta(index) {
  const peserta = pesertaList[index];
  document.getElementById("namaPeserta").value = peserta.nama;
  document.getElementById("kategoriPeserta").value = peserta.kategori;
  document.getElementById("poinUtama").value = peserta.poinUtama;
  document.getElementById("poinViral").value = peserta.poinViral;
  document.getElementById("tampilkanPoin").checked = peserta.tampilkanPoin;

  indexEdit = index;
  document.getElementById("btnTambah").style.display = "none";
  document.getElementById("btnUpdate").style.display = "inline-block";
}

function updatePeserta() {
  if (indexEdit < 0) return;

  const nama = document.getElementById("namaPeserta").value.trim();
  const kategori = document.getElementById("kategoriPeserta").value;
  const poinUtama = parseInt(document.getElementById("poinUtama").value) || 0;
  const poinViral = parseInt(document.getElementById("poinViral").value) || 0;
  const tampilkanPoin =
    document.getElementById("tampilkanPoin").checked || true; // tetap true bila false

  pesertaList[indexEdit] = {
    ...pesertaList[indexEdit],
    nama,
    kategori,
    poinUtama,
    poinViral,
    tampilkanPoin,
  };

  simpanPeserta();
  renderPeserta();
  resetForm();
  document.getElementById("btnTambah").style.display = "inline-block";
  document.getElementById("btnUpdate").style.display = "none";
  indexEdit = -1;
  alert("✅ Data peserta berhasil diperbarui!");
}

function hapusPeserta(index) {
  if (confirm("Apakah Anda yakin ingin menghapus peserta ini?")) {
    pesertaList.splice(index, 1);
    simpanPeserta();
    renderPeserta();
  }
}

// =================== Reset Form ===================
function resetForm() {
  document.getElementById("namaPeserta").value = "";
  document.getElementById("kategoriPeserta").value = "Umum";
  document.getElementById("poinUtama").value = "";
  document.getElementById("poinViral").value = "";
  document.getElementById("tampilkanPoin").checked = true;
  document.getElementById("btnTambah").style.display = "inline-block";
  document.getElementById("btnUpdate").style.display = "none";
}

// =================== Kunci & Buka Poin Viral ===================
function toggleKunciPoin(index) {
  pesertaList[index].poinViralLocked = !pesertaList[index].poinViralLocked;
  simpanPeserta();
  renderPeserta();
}

// =================== Format Rupiah ===================
function formatRupiah(num) {
  return "Rp " + num.toLocaleString("id-ID");
}

// =================== Inisialisasi ===================
document.addEventListener("DOMContentLoaded", () => {
  renderPeserta();
});