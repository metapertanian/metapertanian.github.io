// mbamar.js  
// Penyimpanan data arus kas per tahun

window.kasData = {  
  "2026": {  
    periode: "Januari 2026 – Desember 2026",  
    bendahara: "Pulung Riswanto",  
    transaksi: [  

{
date: "2026-02-05",
type: "income",
amount: 1600000
},
{
date: "2026-02-05",
type: "expense",
amount: 500000,
description: "Ris"
},
{
date: "2026-02-05",
type: "expense",
amount: 60000,
description: "Pulung"
},
{
date: "2026-02-20",
type: "expense",
amount: 700000,
description: "Setoran"
},
{
date: "2026-02-05",
type: "expense",
amount: 200000,
description: "Bapak"
},
{
date: "2026-02-05",
type: "expense",
amount: 140000,
description: "Sasa"
},
{
date: "2026-01-05",
type: "income",
amount: 1000000,
note: "di pinjam wahyu 300 dibalikin 250, dikasih wahyu 100. sisa 150"
},
{
date: "2026-01-05",
type: "expense",
amount: 300000,
description: "Dipinjam Wahyu"
},
{
date: "2026-01-15",
type: "income",
amount: 250000,
description: "Dibalikin Wahyu"
},
{
date: "2026-01-21",
type: "expense",
amount: 700000,
description: "Setoran"
},
{
date: "2026-01-25",
type: "expense",
amount: 100000,
description: "Wahyu"
},
{
date: "2026-02-28",
type: "income",
amount: 500000,
description: "Ris Bayar"
},
{
date: "2026-03-01",
type: "expense",
amount: 500000,
description: "Wahyu"
}
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