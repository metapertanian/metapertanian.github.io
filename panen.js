// panen.js
// Builder & validator data hasil panen RISMA FARM

function buildPanenData(input) {
  const {
    tanggal,
    komoditas,
    qty,
    satuan = "kg",
    nilai,
    biayaPanen = 0,
    bonusTotal = 0,
    anggota = []
  } = input;

  if (!tanggal || !komoditas || !qty || !nilai) {
    return "// ❌ Data panen belum lengkap";
  }

  let obj = `{
  tanggal: "${tanggal}",
  komoditas: "${komoditas}",
  qty: ${qty},
  satuan: "${satuan}",
  nilai: ${nilai}`;

  if (biayaPanen > 0) {
    obj += `,
  biayaPanen: ${biayaPanen}`;
  }

  if (bonusTotal > 0 && anggota.length > 0) {
    obj += `,
  bonusPanen: {
    total: ${bonusTotal},
    anggota: ${JSON.stringify(anggota)}
  }`;
  }

  obj += `
},`;

  return obj;
}

// helper format angka (untuk laporan)
function formatAngka(num) {
  return Number(num || 0).toLocaleString("id-ID");
}