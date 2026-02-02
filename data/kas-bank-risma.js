/* =========================================================
   KAS BANK RISMA
   INPUT DATA MASUK / KELUAR
========================================================= */

function kasId(tanggal) {
  return `KAS-${tanggal}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

const KAS_BANK_RISMA = {

  /* =============================
     TAHUN 2026 (TERBARU DI ATAS)
  ============================= */
  2026: [

    
  ]

};



(function buildBankRisma() {
  let saldo = 0;
  const anggota = {};

  Object.values(KAS_BANK_RISMA).forEach(list => {
    list.forEach(tx => {
      const faktor = tx.tipe === "masuk" ? 1 : -1;

      Object.entries(tx.detail || {}).forEach(([nama, nilai]) => {
        const v = Number(nilai) * faktor;
        saldo += v;
        anggota[nama] = (anggota[nama] || 0) + v;
      });
    });
  });

  window.BANK_RISMA = {
    saldo,
    anggota
  };
})();
