const RISMA_FARM = {
  nama: "RISMA FARM",

  musim: {
    
1: {
  label: "Musim Tanam Ke-1",
  lokasi: "Lahan RISMA di masjid",
  komoditas: ["Timun","Cabai"],

  modal: {RISMA : "380000" },
  biaya: [
{
  tanggal: "2026-01-15",
  keterangan: "Telek Ayam",
  jumlah: 90000
},
{
  tanggal: "2026-01-15",
  keterangan: "Benih Timun",
  jumlah: 90000
},
{
  tanggal: "2025-12-24",
  keterangan: "Benih Cabai",
  jumlah: 80000,
  bukti: "img/pulung.png"
},
],
  panen: [
{
  tanggal: "2026-01-17",
  komoditas: "Timun",
  qty: 280,
  satuan: "kg",
  nilai: 780000,
  biayaPanen: 150000
},
{
  tanggal: "2026-01-15",
  komoditas: "Timun",
  qty: 120,
  satuan: "kg",
  nilai: 450000,
  biayaPanen: 60000,
  bonusPanen: {
    total: 60000,
    anggota: ["Pulung","Faisol","Putri","Nadia","Anis","Tama"]
  }
},
{
  tanggal: "2026-01-12",
  komoditas: "Timun",
  qty: 100,
  satuan: "kg",
  nilai: 400000,
  biayaPanen: 50000,
  bonusPanen: {
    total: 40000,
    anggota: ["Pulung","Faisol","Putri","Nadia"]
  }
},
{
  tanggal: "2026-01-10",
  komoditas: "Cabai",
  qty: 10,
  satuan: "kg",
  nilai: 500000,
  biayaPanen: 50000,
  bonusPanen: {
    total: 50000,
    anggota: ["Pulung","Faisol","Putri","Nadia"]
  }
},
{
  tanggal: "2026-01-16",
  komoditas: "Cabai",
  qty: 12,
  satuan: "kg",
  nilai: 600000,
  biayaPanen: 100000,
  bonusPanen: {
    total: 50000,
    anggota: ["Pulung","Tama","Putri","Nadia"]
  }
},
],

  skema: {
      tipe: "laba_bersih",
      pembagian: {
        pelaksana: 50,
        risma: 30,
        manajemen: 20
      }
  }
},

  }
};