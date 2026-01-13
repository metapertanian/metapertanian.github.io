// laporan.js
// Generator laporan RISMA FARM (modal, biaya, panen, full)
// Output friendly untuk disalin & dibagikan (WA / arsip)

function format(n) {
  return Number(n || 0).toLocaleString("id-ID");
}

function getLahan(key) {
  if (key === "risma") return rismaFarm;
  if (key === "umi") return umi;
  if (key === "umi2") return umi2;
  return null;
}

function getSemuaLahan() {
  return [
    { key: "RISMA FARM", data: rismaFarm },
    { key: "UMI", data: umi },
    { key: "UMI 2", data: umi2 }
  ].filter(l => typeof l.data !== "undefined");
}

function generateLaporan() {
  const jenis = document.getElementById("jenis").value;
  const lahanKey = document.getElementById("lahan").value;
  let teks = "";

  const daftarLahan =
    lahanKey === "all"
      ? getSemuaLahan()
      : [{ key: lahanKey.toUpperCase(), data: getLahan(lahanKey) }];

  if (jenis === "modal") {
    teks += "*LAPORAN MODAL*\n\n";
    daftarLahan.forEach(l => {
      teks += `📍 ${l.key}\n`;
      Object.values(l.data.musim || {}).forEach(m => {
        if (m.modal) {
          teks += `- ${m.label}\n`;
          Object.entries(m.modal).forEach(([k, v]) => {
            teks += `  ${k}: ${format(v)}\n`;
          });
        }
      });
      teks += "\n";
    });
  }

  if (jenis === "biaya") {
    teks += "*LAPORAN BIAYA*\n\n";
    daftarLahan.forEach(l => {
      teks += `📍 ${l.key}\n`;
      Object.values(l.data.musim || {}).forEach(m => {
        (m.biaya || []).forEach(b => {
          teks += `📆 ${b.tanggal}\n`;
          teks += `${b.keterangan}\n`;
          teks += `💸 ${format(b.jumlah)}\n\n`;
        });
      });
    });
  }

  if (jenis === "panen") {
    teks += "*PHP* (Pencatatan Hasil Panen)\n\n";
    daftarLahan.forEach(l => {
      Object.values(l.data.musim || {}).forEach(m => {
        (m.panen || []).forEach(p => {
          const surplus = p.nilai - (p.biayaPanen || 0);
          teks += "—————\n\n";
          teks += `📆 ${p.tanggal}\n`;
          teks += `${emojiKomoditas(p.komoditas)} ${p.komoditas}\n`;
          teks += `⚖️ ${p.qty} ${p.satuan || "kg"}\n`;
          teks += `💰 Omzet: ${format(p.nilai)}\n`;
          teks += `🚜 Biaya Panen: ${format(p.biayaPanen || 0)}\n`;
          teks += `📊 *Surplus Panen: ${format(surplus)}*\n\n`;

          if (p.bonusPanen) {
            const perOrang = p.bonusPanen.total / p.bonusPanen.anggota.length;
            teks += `*Bonus Panen* : ${format(p.bonusPanen.total)}\n`;
            p.bonusPanen.anggota.forEach((a, i) => {
              teks += `${i + 1}. ${a} : ${format(perOrang)}\n`;
            });
            teks += "\n";
          }
        });
      });
    });
    teks += "*Catatan:*\nAngka di atas belum memperhitungkan biaya produksi lain.";
  }

  if (jenis === "full") {
    teks += "*LAPORAN PENUH*\n\n";
    daftarLahan.forEach(l => {
      teks += `📍 ${l.key}\n\n`;
      Object.values(l.data.musim || {}).forEach(m => {
        let totalBiaya = 0;
        let totalNilai = 0;

        (m.biaya || []).forEach(b => totalBiaya += b.jumlah);
        (m.panen || []).forEach(p => totalNilai += p.nilai);

        const labaBersih = totalNilai - totalBiaya;

        teks += `${m.label}\n`;
        teks += `💰 Total Panen: ${format(totalNilai)}\n`;
        teks += `💸 Total Biaya: ${format(totalBiaya)}\n`;
        teks += `📊 Surplus Panen: ${format(labaBersih)}\n\n`;

        if (m.skema && m.skema.tipe === "laba_bersih") {
          teks += "*Pembagian*\n";
          Object.entries(m.skema.pembagian).forEach(([k, v]) => {
            teks += `${k}: ${format(labaBersih * v / 100)}\n`;
          });
          teks += "\n";
        }
      });
    });
  }

  document.getElementById("output").textContent =
    teks || "// ❌ Tidak ada data";
}

function salin() {
  const teks = document.getElementById("output").textContent;
  if (!teks || teks.includes("❌")) return;
  navigator.clipboard.writeText(teks).then(() => alert("Laporan disalin"));
}

function emojiKomoditas(nama) {
  const map = {
    Cabai: "🌶️",
    Timun: "🥒",
    Jagung: "🌽",
    Terong: "🍆",
    Singkong: "🍠",
    Jagung Manis: "🌽"
  };
  return map[nama] || "🌾";
}