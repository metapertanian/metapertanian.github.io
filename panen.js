// panen.js // Builder & validator data hasil panen RISMA FARM

function buildPanenData(input) { const { tanggal, komoditas, qty, satuan, nilai, biayaPanen, bonusTotal, anggota } = input;

if (!tanggal || !komoditas || !qty || !nilai) { return "// ❌ Data panen belum lengkap"; }

let obj = { tanggal: \"${tanggal}\", komoditas: \"${komoditas}\", qty: ${qty}, satuan: \"${satuan || 'kg'}\", nilai: ${nilai};

if (biayaPanen && biayaPanen > 0) { obj += ,\n  biayaPanen: ${biayaPanen}; }

if (bonusTotal && bonusTotal > 0 && anggota && anggota.length > 0) { obj += ,\n  bonusPanen: {\n    total: ${bonusTotal},\n    anggota: ${JSON.stringify(anggota)}\n  }; }

obj += \n},;

return obj; }

// helper format angka (opsional untuk laporan) function formatAngka(num) { return Number(num || 0).toLocaleString('id-ID'); }