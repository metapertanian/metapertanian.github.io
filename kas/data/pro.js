// pro.js  
// Penyimpanan data arus kas per tahun

window.kasData = {  
  "2026": {  
    periode: "Feb 2026 - Des 2026",  
    bendahara: "Pulung Riswanto",  
    transaksi: [  
{
date: "2026-02-01",
description: "Gula Aren",
type: "expense",
amount: 6000
},
{
date: "2026-02-01",
description: "Gula Kopi",
type: "expense",
amount: 10000
},
{
date: "2026-02-01",
description: "Saldo Awal",
type: "income",
amount: 86000
},
]
}
};  

// ================= Fungsi =================  

// Ambil semua transaksi dari periode tertentu  
function getTransactionsByPeriod(period) {  
  return window.kasData[period]?.transaksi || [];  
}  

// Ambil semua periode  
function getAllPeriods() {  
  return Object.keys(window.kasData).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));  
}  

// Ambil periode terbaru  
function getLatestPeriod() {  
  const periods = getAllPeriods();  
  return periods[periods.length - 1] || null;  
}  

// Ambil semua transaksi dari seluruh periode  
function getAllTransactions() {  
  return Object.values(window.kasData).flatMap(p => p.transaksi || []);  
}  

// Ekspor ke window  
if (typeof window !== "undefined") {  
  window.kas = {  
    getTransactionsByPeriod,  
    getAllPeriods,  
    getLatestPeriod,  
    getAllTransactions,  
    raw: window.kasData  
  };  
}