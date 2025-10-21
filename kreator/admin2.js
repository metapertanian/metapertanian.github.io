// =========================================================
// 🧩 ADMIN2.JS – Data Peserta, Poin, Pagination & Tampilan
// =========================================================

let semuaPeserta = [];
let halamanAktif = 1;
const jumlahPerHalaman = 10;

// ===================== 🎯 RENDER DAFTAR PESERTA =====================
function renderDaftarPeserta(pesertaList) {
  semuaPeserta = pesertaList;
  halamanAktif = 1;
  tampilkanHalaman(halamanAktif);
}

// ===================== 📄 TAMPILKAN HALAMAN =====================
function tampilkanHalaman(halaman) {
  const daftarPeserta = document.getElementById("daftarPeserta");
  const pagination = document.getElementById("pagination");

  if (!semuaPeserta || semuaPeserta.length === 0) {
    daftarPeserta.innerHTML = "<p>Belum ada peserta di season ini.</p>";
    pagination.innerHTML = "";
    return;
  }

  const mulai = (halaman - 1) * jumlahPerHalaman;
  const akhir = mulai + jumlahPerHalaman;
  const pesertaTampil = semuaPeserta.slice(mulai, akhir);

  let html = `
    <table class="tabel-peserta">
      <thead>
        <tr>
          <th>#</th>
          <th>Nama</th>
          <th>Asal</th>
          <th>Kategori</th>
          <th>Poin</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
  `;

  pesertaTampil.forEach((p, i) => {
    html += `
      <tr>
        <td>${mulai + i + 1}</td>
        <td>${p.nama}</td>
        <td>${p.asal}</td>
        <td>${p.kategori}</td>
        <td>${p.poin}</td>
        <td>
          <button class="btn-edit" onclick="editPeserta(${mulai + i})">✏️</button>
          <button class="btn-hapus" onclick="hapusPeserta(${mulai + i})">🗑️</button>
        </td>
      </tr>
    `;
  });

  html += "</tbody></table>";
  daftarPeserta.innerHTML = html;

  buatPagination();
}

// ===================== 🔢 PAGINATION =====================
function buatPagination() {
  const pagination = document.getElementById("pagination");
  const totalHalaman = Math.ceil(semuaPeserta.length / jumlahPerHalaman);
  let html = "";

  for (let i = 1; i <= totalHalaman; i++) {
    html += `
      <button class="page-btn ${i === halamanAktif ? "aktif" : ""}"
              onclick="pindahHalaman(${i})">${i}</button>
    `;
  }
  pagination.innerHTML = html;
}

function pindahHalaman(halaman) {
  halamanAktif = halaman;
  tampilkanHalaman(halamanAktif);
}

// ===================== ✏️ EDIT PESERTA =====================
function editPeserta(index) {
  const peserta = semuaPeserta[index];
  const namaBaru = prompt("Edit nama peserta:", peserta.nama);
  if (namaBaru === null) return; // batal
  const poinBaru = prompt("Edit poin:", peserta.poin);
  if (poinBaru === null) return;

  peserta.nama = namaBaru.trim() || peserta.nama;
  peserta.poin = parseInt(poinBaru) || peserta.poin;

  alert("✅ Data peserta diperbarui!");
  tampilkanHalaman(halamanAktif);
}

// ===================== ❌ HAPUS PESERTA =====================
function hapusPeserta(index) {
  if (!confirm("Yakin ingin menghapus peserta ini?")) return;
  semuaPeserta.splice(index, 1);
  alert("🗑️ Peserta berhasil dihapus!");
  tampilkanHalaman(halamanAktif);
}

// ===================== ➕ TAMBAH PESERTA BARU =====================
function tambahPeserta() {
  const nama = prompt("Masukkan nama peserta baru:");
  if (!nama) return;
  const asal = prompt("Masukkan asal peserta:");
  if (!asal) return;
  const kategori = prompt("Masukkan kategori:");
  if (!kategori) return;
  const poin = parseInt(prompt("Masukkan poin awal:")) || 0;

  semuaPeserta.push({ nama, asal, kategori, poin });
  alert("✅ Peserta baru ditambahkan!");
  tampilkanHalaman(halamanAktif);
}

// ===================== 💾 EKSPOR KE CSV =====================
function eksporCSV() {
  if (semuaPeserta.length === 0) {
    alert("Tidak ada data untuk diekspor.");
    return;
  }

  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Nama,Asal,Kategori,Poin\n";
  semuaPeserta.forEach((p) => {
    csvContent += `${p.nama},${p.asal},${p.kategori},${p.poin}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `data_peserta_${seasonAktif}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ===================== 📊 URUTKAN PESERTA BERDASARKAN POIN =====================
function urutkanPeserta() {
  semuaPeserta.sort((a, b) => b.poin - a.poin);
  tampilkanHalaman(halamanAktif);
}

// ===================== 🧮 HITUNG TOTAL POIN =====================
function hitungTotalPoin() {
  if (!semuaPeserta || semuaPeserta.length === 0) return 0;
  return semuaPeserta.reduce((total, p) => total + (parseInt(p.poin) || 0), 0);
}

// ===================== 🧭 INISIALISASI =====================
console.log("✅ admin2.js berhasil dimuat");

// =========================================================
// ✨ Akhir dari admin2.js
// =========================================================