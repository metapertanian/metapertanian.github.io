/* ======================================================
   DATA RISMA FARM
====================================================== */
const RISMA_FARM = {
  nama: "RISMA FARM",

  musim: {
    1: {
      label: "Musim Tanam Ke-1",
      lokasi: "Lahan RISMA di masjid",
      komoditas: ["Timun", "Cabai"],

      modal: {
        RISMA: 380000
      },

      biaya: [
        {
          tanggal: "2026-01-15",
          keterangan: "Telek Ayam",
          jumlah: 90000,
          bukti:
            "https://blogger.googleusercontent.com/img/a/AVvXsEjFjPc13W_6OSf5aiQei1q_R5NltDrqrnevYpz-R8MxYRAteP5_oUwVCZM9xYcpdsi4A0j_LxvzsAD81UGxIHtoHWD3Pd6JoN9RpEn0gnPXzUj4XDNb4Giy01pwzZz4HO0vVjcxKkjS995DAyue6DLKn9RqilYuq3VPUDSdGNfZwhnbidA9rFpB5IICkyCt"
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
        }
      ],

      panen: [
        {
          tanggal: "2026-01-17",
          komoditas: "Timun",
          qty: 280,
          satuan: "kg",
          nilai: 780000,
          biayaPanen: 150000,
          bukti:
            "https://res.cloudinary.com/deojvpzhv/image/upload/v1769016005/beli-ampli-masjid-2000watt-4channel_orqpqr.jpg"
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
            anggota: ["Pulung", "Faisol", "Putri", "Nadia", "Anis", "Tama"]
          },
          bukti:
            "https://drive.google.com/file/d/1kPQiJQegwaSKOWPPL2tdIHqvYfyf2gHa/view?usp=drivesdk"
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
            anggota: ["Pulung", "Faisol", "Putri", "Nadia"]
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
            anggota: ["Pulung", "Faisol", "Putri", "Nadia"]
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

/* ======================================================
   HELPER & LOGIKA INTI (REUSABLE)
====================================================== */

/** Total modal awal (tanpa manajemen) */
function getTotalModalAwal(musim) {
  return Object.values(musim.modal || {}).reduce(
    (a, b) => a + Number(b || 0),
    0
  );
}

/** Total biaya produksi */
function getTotalBiaya(musim) {
  return (musim.biaya || []).reduce(
    (a, b) => a + Number(b.jumlah || 0),
    0
  );
}

/** Total omzet panen */
function getTotalOmzet(musim) {
  return (musim.panen || []).reduce(
    (a, b) => a + Number(b.nilai || 0),
    0
  );
}

/** Total biaya panen */
function getTotalBiayaPanen(musim) {
  return (musim.panen || []).reduce(
    (a, b) => a + Number(b.biayaPanen || 0),
    0
  );
}

/**
 * Modal final:
 * - Jika biaya > modal awal
 * - otomatis tambahkan "Manajemen"
 */
function getModalFinal(musim) {
  const modalAwal = getTotalModalAwal(musim);
  const totalBiaya = getTotalBiaya(musim);

  const modalFinal = { ...musim.modal };

  if (totalBiaya > modalAwal) {
    modalFinal.Manajemen = totalBiaya - modalAwal;
  }

  return modalFinal;
}

/** Total modal final (sudah termasuk manajemen jika ada) */
function getTotalModalFinal(musim) {
  return Object.values(getModalFinal(musim)).reduce(
    (a, b) => a + Number(b || 0),
    0
  );
}

/** Laba bersih */
function getLabaBersih(musim) {
  return (
    getTotalOmzet(musim) -
    getTotalBiaya(musim) -
    getTotalBiayaPanen(musim)
  );
}

/** Bagi hasil berdasarkan skema */
function getBagiHasil(musim) {
  const laba = getLabaBersih(musim);
  const hasil = {};

  Object.entries(musim.skema?.pembagian || {}).forEach(([k, p]) => {
    hasil[k] = Math.round((laba * p) / 100);
  });

  return hasil;
}