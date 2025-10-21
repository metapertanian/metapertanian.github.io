// =========================================================
// 🧩 admin2.js — Menampilkan Data Juara
// =========================================================

// Pastikan variabel global tersedia
let tabelBody = document.getElementById("tabel-body");
let judulSeason = document.getElementById("judul-season");
let totalPeserta = document.getElementById("total-peserta");
let tombolExport = document.getElementById("btn-export");

// Fungsi utama menampilkan data season terpilih
function tampilkanDataSeason(namaSeason) {
  if (!dataJuara || !dataJuara[namaSeason]) {
    alert("Data season tidak ditemukan!");
    return;
  }

  const pesertaList = dataJuara[namaSeason];
  judulSeason.textContent = "📊 Data Peserta " + namaSeason.toUpperCase();
  tabelBody.innerHTML = "";

  // Urutkan berdasarkan total poin (poin utama + viral)
  pesertaList.sort((a, b) => {
    const totalA = (a.poinUtama || 0) + (a.poinViral || 0);
    const totalB = (b.poinUtama || 0) + (b.poinViral || 0);
    return totalB - totalA;
  });

  // Buat tabel
  pesertaList.forEach((p, i) => {
    const total = (p.poinUtama || 0) + (p.poinViral || 0);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${p.nama || "-"}</td>
      <td>${p.kategori || "-"}</td>
      <td>${p.poinUtama || 0}</td>
      <td>${p.poinViral || 0}</td>
      <td><b>${total}</b></td>
    `;
    tabelBody.appendChild(tr);
  });

  totalPeserta.textContent = pesertaList.length + " peserta";
}

// =========================================================
// 🎯 Ekspor ke CSV
// =========================================================
function exportCSV() {
  const rows = [["Peringkat", "Nama", "Kategori", "Poin Utama", "Poin Viral", "Total"]];
  const namaSeason = judulSeason.textContent.replace("📊 Data Peserta ", "");

  // Ambil data dari tabel
  const trs = tabelBody.querySelectorAll("tr");
  trs.forEach(tr => {
    const tds = tr.querySelectorAll("td");
    const row = [];
    tds.forEach(td => row.push(td.innerText));
    rows.push(row);
  });

  // Konversi ke CSV
  let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", namaSeason + "_hasil.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// =========================================================
// 🔗 Hubungkan tombol
// =========================================================
if (tombolExport) {
  tombolExport.addEventListener("click", exportCSV);
}

// =========================================================
// 📦 Auto-load jika sudah pilih season sebelumnya
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
  const savedSeason = localStorage.getItem("seasonAktif");
  if (savedSeason && dataJuara[savedSeason]) {
    tampilkanDataSeason(savedSeason);
  }
});