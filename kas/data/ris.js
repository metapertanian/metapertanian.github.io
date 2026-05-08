// kas-ris.js  
// Penyimpanan data arus kas per tahun

window.kasData = {  

  "2026": {  
    periode: "Januari 2026 – Desember 2026",  
    bendahara: "Pulung Riswanto",  
    transaksi: [  
{
date: "2026-05-07",
type: "expense",
amount: 1000000,
description: "Kulkas"
},
{
date: "2026-04-30",
type: "income",
amount: 1000000
},
{
date: "2026-03-31",
type: "expense",
amount: 800000,
description: "Bayar Pulung"
},
{
date: "2026-03-31",
type: "expense",
amount: 200000,
description: "Mama"
},
{
date: "2026-03-31",
type: "income",
amount: 1000000,
description: "Infak Jumat"
},
{
date: "2026-02-28",
type: "income",
amount: 1000000,
description: "Nabung"
},
{
date: "2026-02-28",
type: "expense",
amount: 500000,
description: "Mbamar"
},
{
date: "2026-02-28",
type: "expense",
amount: 500000,
description: "Mama"
},
]
},
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
