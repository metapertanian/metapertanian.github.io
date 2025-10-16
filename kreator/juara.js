// ===============================
// 🏆 Data Penilaian Peserta
// ===============================

const dataPeserta =   {
"Season 1": {
    awal: "25 Oktober 2025",
    akhir: "28 Desember 2025",
    Sponsor: "",
    transaksi: [
  {
    "nama": "nadia",
    "linkVideo": "https://www.tiktok.com/@nadia123",
    "like": 30,
    "komen": 5,
    "share": 1,
    "ideKonsepTipe": "Humoris",
    "ideKonsepNilai": 87,
    "editing": 70,
    "karakter": 68,
    "nuansaLokal": 80,
    "dampakPositif": 75
  },
  {
    "nama": "tama",
    "linkVideo": "https://www.tiktok.com/@tama_risma",
    "like": 40,
    "komen": 10,
    "share": 2,
    "ideKonsepTipe": "Inspiratif",
    "ideKonsepNilai": 90,
    "editing": 85,
    "karakter": 80,
    "nuansaLokal": 75,
    "dampakPositif": 88
  },
  {
    "nama": "putri",
    "linkVideo": "https://www.tiktok.com/@putri_risma",
    "like": 25,
    "komen": 7,
    "share": 1,
    "ideKonsepTipe": "Edukatif",
    "ideKonsepNilai": 80,
    "editing": 72,
    "karakter": 70,
    "nuansaLokal": 85,
    "dampakPositif": 78
  }
]
}
};

// ===============================
// 🔢 Fungsi Hitung Nilai Total
// ===============================
//
// Nilai kreatifitas maksimal 300 (dari 0–100 input):
//   ideKonsep = nilai * 1.5  (150)
//   editing   = nilai * 1.0  (100)
//   karakter  = nilai * 0.5  (50)
//
// Nilai lokal maksimal 200 (dari 0–100 input):
//   nuansaLokal   = nilai * 1.0  (100)
//   dampakPositif = nilai * 1.0  (100)
//
// Viral (like, komen, share) tetap dihitung ringan.
//

function hitungTotal(p) {
  const viral = (p.like * 1.0) + (p.komen * 1.5) + (p.share * 1.5);

  // Kreativitas (maks 300)
  const nilaiKreatif = (p.ideKonsepNilai * 1.5) + (p.editing * 1.0) + (p.karakter * 0.5);

  // Lokal (maks 200)
  const nilaiLokal = (p.nuansaLokal * 1.0) + (p.dampakPositif * 1.0);

  // Total akhir
  const total = Math.round(nilaiKreatif + nilaiLokal + viral);

  return {
    total,
    nilaiKreatif,
    nilaiLokal,
    viral
  };
}

// ===============================
// 🏅 Proses dan Urutkan Juara
// ===============================

const hasilRanking = dataPeserta.map(p => {
  const nilai = hitungTotal(p);
  return {
    ...p,
    ...nilai
  };
}).sort((a, b) => b.total - a.total);

// ===============================
// 💬 Tampilkan di Konsol
// ===============================

console.log("🏆 Hasil Penilaian Peserta:");
hasilRanking.forEach((p, i) => {
  console.log(`${i + 1}. ${p.nama.toUpperCase()}`);
  console.log(`   💡 Kreatifitas: ${p.nilaiKreatif.toFixed(1)}`);
  console.log(`   🌾 Lokal: ${p.nilaiLokal.toFixed(1)}`);
  console.log(`   🚀 Viral: ${p.viral.toFixed(1)}`);
  console.log(`   🔢 Total: ${p.total}`);
  console.log(`   🔗 Video: ${p.linkVideo}`);
  console.log("------------------------------");
});