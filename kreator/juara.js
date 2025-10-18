// ===============================
// 🏆 Data Juara Lomba Kreator
// ===============================

const dataJuara = {

  // ===============================
  // 🎬 SEASON 2
  // ===============================
  "Season 2": {
    awal: "10 Januari 2026",
    akhir: "20 Maret 2026",
    Sponsor: "Bank Desa Nusantara",
    Poin: "true",

    Hadiah: [
      { kategori: "Juara 1", hadiah: "Rp 200rb + Sertifikat" },
      { kategori: "Juara 2", hadiah: "Rp 150rb + Sertifikat" },
      { kategori: "Juara 3", hadiah: "Rp 100rb + Sertifikat" },
      { kategori: "Juara Humoris", hadiah: "Rp 50rb", filter: "Humoris" },
      { kategori: "Juara Hp Terbaik", hadiah: "Rp 50rb", filter: { field: "merkHP", value: "iPhone" } },
      { kategori: "Editing Terbaik", hadiah: "Rp 50rb", filter: { field: "editing", mode: "max" } },
      { kategori: "Dampak Positif Tertinggi", hadiah: "Rp 50rb", filter: { field: "dampakPositif", mode: "max" } }
    ],

    kreator: [
      { nama: "Mulyono", linkVideo: "https://www.tiktok.com/@mulyono_tb", like: 55, komen: 8, share: 4, ideKonsepTipe: "Motivasi", ideKonsepNilai: 90, editing: 82, karakter: 80, nuansaLokal: 88, dampakPositif: 85, merkHP: "Samsung" },
      { nama: "Riswadi", linkVideo: "https://www.tiktok.com/@riswadi_tb", like: 65, komen: 9, share: 5, ideKonsepTipe: "Inspiratif", ideKonsepNilai: 92, editing: 85, karakter: 84, nuansaLokal: 86, dampakPositif: 87, merkHP: "iPhone" },
      { nama: "Rifai", linkVideo: "https://www.tiktok.com/@rifai_risma", like: 40, komen: 7, share: 2, ideKonsepTipe: "Edukatif", ideKonsepNilai: 83, editing: 76, karakter: 78, nuansaLokal: 82, dampakPositif: 80, merkHP: "Oppo" },
      { nama: "Yuyun", linkVideo: "https://www.tiktok.com/@yuyun_risma", like: 48, komen: 6, share: 3, ideKonsepTipe: "Humoris", ideKonsepNilai: 86, editing: 74, karakter: 79, nuansaLokal: 84, dampakPositif: 83, merkHP: "Xiaomi" },
      { nama: "Anis", linkVideo: "https://www.tiktok.com/@anis_risma", like: 35, komen: 5, share: 1, ideKonsepTipe: "Motivasi", ideKonsepNilai: 81, editing: 72, karakter: 75, nuansaLokal: 82, dampakPositif: 79, merkHP: "Realme" },
      { nama: "Pulung", linkVideo: "https://www.tiktok.com/@pulung_tb", like: 70, komen: 10, share: 6, ideKonsepTipe: "Inspiratif", ideKonsepNilai: 95, editing: 88, karakter: 85, nuansaLokal: 90, dampakPositif: 89, merkHP: "iPhone" },
      { nama: "Faisol", linkVideo: "https://www.tiktok.com/@faisol_tb", like: 60, komen: 9, share: 4, ideKonsepTipe: "Motivasi Petani", ideKonsepNilai: 91, editing: 83, karakter: 82, nuansaLokal: 87, dampakPositif: 85, merkHP: "Vivo" },
      { nama: "Putri", linkVideo: "https://www.tiktok.com/@putri_tb", like: 38, komen: 7, share: 2, ideKonsepTipe: "Edukatif", ideKonsepNilai: 84, editing: 74, karakter: 76, nuansaLokal: 83, dampakPositif: 80, merkHP: "Oppo" },
      { nama: "Nadia", linkVideo: "https://www.tiktok.com/@nadia_tb", like: 32, komen: 5, share: 1, ideKonsepTipe: "Humoris", ideKonsepNilai: 79, editing: 70, karakter: 72, nuansaLokal: 80, dampakPositif: 78, merkHP: "Samsung" },
      { nama: "Tama", linkVideo: "https://www.tiktok.com/@tama_tb", like: 45, komen: 8, share: 3, ideKonsepTipe: "Inspiratif", ideKonsepNilai: 88, editing: 78, karakter: 79, nuansaLokal: 85, dampakPositif: 82, merkHP: "iPhone" }
    ]
  },

  // ===============================
  // 🎥 SEASON 1
  // ===============================
  "Season 1": {
    awal: "25 Oktober 2025",
    akhir: "28 Desember 2025",
    Sponsor: "Toko Tani Makmur",
    Poin: "true",

    Hadiah: [
      { kategori: "Juara 1", hadiah: "Rp 150rb + Sertifikat" },
      { kategori: "Juara 2", hadiah: "Rp 100rb + Sertifikat" },
      { kategori: "Juara 3", hadiah: "Rp 75rb + Sertifikat" },
      { kategori: "Ide Terbaik", hadiah: "Rp 50rb", filter: { field: "ideKonsepNilai", mode: "max" } },
      { kategori: "Humoris", hadiah: "Rp 50rb", filter: "Humoris" }
    ],

    kreator: [
      { nama: "Nadia", linkVideo: "https://www.tiktok.com/@nadia123", like: 30, komen: 5, share: 1, ideKonsepTipe: "Humoris", ideKonsepNilai: 87, editing: 70, karakter: 68, nuansaLokal: 80, dampakPositif: 75, merkHP: "Xiaomi" },
      { nama: "Tama", linkVideo: "https://www.tiktok.com/@tama_risma", like: 40, komen: 10, share: 2, ideKonsepTipe: "Inspiratif", ideKonsepNilai: 90, editing: 85, karakter: 80, nuansaLokal: 75, dampakPositif: 88, merkHP: "iPhone" },
      { nama: "Putri", linkVideo: "https://www.tiktok.com/@putri_risma", like: 25, komen: 7, share: 1, ideKonsepTipe: "Edukatif", ideKonsepNilai: 80, editing: 72, karakter: 70, nuansaLokal: 85, dampakPositif: 78, merkHP: "Oppo" },
      { nama: "Faisol", linkVideo: "https://www.tiktok.com/@faisol_agri", like: 50, komen: 8, share: 3, ideKonsepTipe: "Motivasi", ideKonsepNilai: 88, editing: 80, karakter: 82, nuansaLokal: 90, dampakPositif: 84, merkHP: "Samsung" },
      { nama: "Sasa", linkVideo: "https://www.tiktok.com/@sasa_risma", like: 45, komen: 6, share: 2, ideKonsepTipe: "Komedi Edukatif", ideKonsepNilai: 85, editing: 75, karakter: 79, nuansaLokal: 82, dampakPositif: 81, merkHP: "Vivo" },
      { nama: "Rifky", linkVideo: "https://www.tiktok.com/@rifky_tb", like: 60, komen: 9, share: 4, ideKonsepTipe: "Motivasi Petani", ideKonsepNilai: 91, editing: 83, karakter: 85, nuansaLokal: 88, dampakPositif: 89, merkHP: "iPhone" },
      { nama: "Nabila", linkVideo: "https://www.tiktok.com/@nabila_risma", like: 38, komen: 4, share: 1, ideKonsepTipe: "Humoris", ideKonsepNilai: 79, editing: 70, karakter: 75, nuansaLokal: 80, dampakPositif: 76, merkHP: "Oppo" },
      { nama: "Risma", linkVideo: "https://www.tiktok.com/@risma_tb", like: 35, komen: 6, share: 2, ideKonsepTipe: "Inspiratif", ideKonsepNilai: 84, editing: 73, karakter: 77, nuansaLokal: 83, dampakPositif: 82, merkHP: "Samsung" },
      { nama: "Wahyu", linkVideo: "https://www.tiktok.com/@wahyu_tb", like: 42, komen: 5, share: 3, ideKonsepTipe: "Motivasi", ideKonsepNilai: 86, editing: 76, karakter: 80, nuansaLokal: 85, dampakPositif: 83, merkHP: "Realme" },
      { nama: "Syifa", linkVideo: "https://www.tiktok.com/@syifa_risma", like: 33, komen: 7, share: 1, ideKonsepTipe: "Edukatif", ideKonsepNilai: 82, editing: 71, karakter: 74, nuansaLokal: 84, dampakPositif: 80, merkHP: "Xiaomi" }
    ]
  }
};