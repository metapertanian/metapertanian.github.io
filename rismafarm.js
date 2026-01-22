const RISMA_FARM = {
  nama: "RISMA FARM",

  musim: {
    1: {
      label: "Musim Tanam Ke-1",
      lokasi: "Lahan RISMA di masjid",
      komoditas: ["TIMUN", "CABAI"],

      modal: {
        RISMA: 380000
      },

      biaya: [
{
  tanggal: "2026-01-22",
  keterangan: "SI BIRU",
  jumlah: 35000
},
{
  tanggal: "2026-01-22",
  keterangan: "ANTRACOL",
  jumlah: 25000
},
{
  tanggal: "2026-01-22",
  keterangan: "AGUS",
  jumlah: 37000
},
{
  tanggal: "2026-01-22",
  keterangan: "ABACEL",
  jumlah: 30000
},
{
  tanggal: "2026-01-22",
  keterangan: "APPLAUD",
  jumlah: 9000
},
{
  tanggal: "2026-01-22",
  keterangan: "ULTRADAP",
  jumlah: 50000
},

{
  tanggal: "2026-01-21",
  keterangan: "AVIDOR",
  jumlah: 13000
},
{
  tanggal: "2026-01-21",
  keterangan: "BESROMIL",
  jumlah: 16000
},
{
  tanggal: "2026-01-21",
  keterangan: "REGENT",
  jumlah: 24000
},
{
  tanggal: "2026-01-20",
  keterangan: "KARATE BORONI",
  jumlah: 10000
},
{
  tanggal: "2026-01-20",
  keterangan: "PEREKAT",
  jumlah: 15500
},
        {
          tanggal: "2026-01-15",
          keterangan: "TELEK AYAM",
          jumlah: 90000,
          },
          {
          tanggal: "2026-01-15",
          keterangan: "BENIH TIMUN",
          jumlah: 90000
        },
        {
          tanggal: "2025-12-24",
          keterangan: "BENIH CABAI",
          jumlah: 80000
        }
      ],

      panen: [
        {
          tanggal: "2026-01-17",
          komoditas: "TIMUN",
          qty: 280,
          satuan: "kg",
          nilai: 780000,
          biayaPanen: 150000,
          bukti:
            "https://res.cloudinary.com/deojvpzhv/image/upload/v1769016005/beli-ampli-masjid-2000watt-4channel_orqpqr.jpg"
        },
        {
          tanggal: "2026-01-15",
          komoditas: "TIMUN",
          qty: 120,
          satuan: "kg",
          nilai: 450000,
          biayaPanen: 60000,
          bonusPanen: {
            total: 60000,
            anggota: ["Pulung", "Faisol", "Putri", "Nadia", "Anis", "Tama"]
          },
          bukti:
            "https://drive.google.com/file/d/1kPQiJQegwaSKOWPPL2tdIHqvYfyf2gHa/view?usp=drivesdk"
        },
        {
          tanggal: "2026-01-12",
          komoditas: "TIMUN",
          qty: 100,
          satuan: "kg",
          nilai: 400000,
          biayaPanen: 50000,
          bonusPanen: {
            total: 40000,
            anggota: ["Pulung", "Faisol", "Putri", "Nadia"]
          }
        },
        {
          tanggal: "2026-01-10",
          komoditas: "CABAI",
          qty: 10,
          satuan: "kg",
          nilai: 500000,
          biayaPanen: 50000,
          bonusPanen: {
            total: 50000,
            anggota: ["Pulung", "Faisol", "Putri", "Nadia"]
          }
        },
        {
          tanggal: "2026-01-16",
          komoditas: "CABAI",
          qty: 12,
          satuan: "kg",
          nilai: 600000,
          biayaPanen: 100000,
          bonusPanen: {
            total: 50000,
            anggota: ["Pulung", "Tama", "Putri", "Nadia"]
          }
        }
      ],

      skema: {
        tipe: "laba_bersih",
        pembagian: {
          pelaksana: 50,
          risma: 30,
          manajemen: 20
        }
      }
    }
  }
};

