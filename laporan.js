// laporan.js // LAPORAN PER MUSIM – RISMA FARM // Semua laporan WAJIB berdasarkan 1 musim (tidak digabung)

// ====== UTIL ====== function rupiah(n) { return Number(n || 0).toLocaleString('id-ID'); }

function pilihLahan(key) { if (key === 'risma') return rismaFarm; if (key === 'umi') return umi; if (key === 'umi2') return umi2; return null; }

// ====== INIT DROPDOWN MUSIM ====== window.addEventListener('DOMContentLoaded', () => { const lahanSelect = document.getElementById('lahan'); lahanSelect.addEventListener('change', isiMusim); isiMusim(); });

function isiMusim() { const lahanKey = document.getElementById('lahan').value; const lahan = pilihLahan(lahanKey); const musimSelect = document.getElementById('musim');

musimSelect.innerHTML = ''; if (!lahan || !lahan.musim) return;

Object.entries(lahan.musim).forEach(([key, m]) => { const opt = document.createElement('option'); opt.value = key; opt.textContent = m.label; musimSelect.appendChild(opt); }); }

// ====== GENERATE LAPORAN ====== function generateLaporan() { const jenis = document.getElementById('jenis').value; const lahanKey = document.getElementById('lahan').value; const musimKey = document.getElementById('musim').value;

const lahan = pilihLahan(lahanKey); if (!lahan || !lahan.musim || !lahan.musim[musimKey]) { alert('Data musim tidak ditemukan'); return; }

const musim = lahan.musim[musimKey]; let teks = *LAPORAN ${musim.label.toUpperCase()}*\n${lahan.nama || ''}\n\n;

if (jenis === 'modal') { teks += 'MODAL\n'; Object.entries(musim.modal || {}).forEach(([k, v]) => { teks += - ${k}: ${rupiah(v)}\n; }); }

if (jenis === 'biaya') { teks += 'BIAYA\n'; (musim.biaya || []).forEach(b => { teks += 📆 ${b.tanggal} | ${b.keterangan} | ${rupiah(b.jumlah)}\n; }); }

if (jenis === 'panen') { teks += 'PHP – PENCATATAN HASIL PANEN\n\n'; (musim.panen || []).forEach(p => { const surplus = (p.nilai || 0) - (p.biayaPanen || 0); teks += 📆 ${p.tanggal}\n${p.komoditas}\n⚖️ ${p.qty} ${p.satuan || 'kg'}\n💰 Omzet: ${rupiah(p.nilai)}\n🚜 Biaya Panen: ${rupiah(p.biayaPanen)}\n📊 *Surplus Panen: ${rupiah(surplus)}*\n\n; }); teks += 'Catatan: Surplus panen belum dikurangi biaya produksi lain.'; }

if (jenis === 'full') { const totalModal = Object.values(musim.modal || {}).reduce((a, b) => a + b, 0); const totalBiaya = (musim.biaya || []).reduce((a, b) => a + b.jumlah, 0); const totalPanen = (musim.panen || []).reduce((a, b) => a + b.nilai, 0); const laba = totalPanen - totalBiaya;

teks += `*RINGKASAN*\n`;
teks += `Modal: ${rupiah(totalModal)}\n`;
teks += `Biaya: ${rupiah(totalBiaya)}\n`;
teks += `Omzet: ${rupiah(totalPanen)}\n`;
teks += `Laba Bersih: *${rupiah(laba)}*\n\n`;

if (musim.skema && musim.skema.tipe === 'laba_bersih') {
  teks += '*PEMBAGIAN LABA*\n';
  Object.entries(musim.skema.pembagian || {}).forEach(([k, v]) => {
    teks += `- ${k}: ${rupiah(laba * v / 100)} (${v}%)\n`;
  });
}

}

document.getElementById('output').textContent = teks; }

function salin() { const teks = document.getElementById('output').textContent; if (!teks) return; navigator.clipboard.writeText(teks).then(() => alert('Laporan disalin')); }