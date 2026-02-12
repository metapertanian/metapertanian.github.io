// pro.js  
// Penyimpanan data arus kas per tahun

window.kasData = {  
  "2026": {  
    periode: "Feb 2026 - Des 2026",  
    bendahara: "Pulung Riswanto",  
    transaksi: [  
{
date: "2026-02-09",
type: "expense",
amount: 20000,
description: "Bensin"
},
{
date: "2026-02-06",
type: "expense",
amount: 5000,
description: "Infak Jumat"
},
{
date: "2026-02-06",
type: "expense",
amount: 10000,
description: "Gula Kopi"
},
{
date: "2026-02-09",
type: "income",
amount: 250000,
description: "Nyemprot"
},
{
date: "2026-02-09",
type: "expense",
amount: 59000,
description: "Susu Etawa"
},
{
date: "2026-02-11",
type: "expense",
amount: 10000,
description: "Gula Kopi"
},
{
date: "2026-02-11",
type: "expense",
amount: 5000,
description: "Kuaci"
},
{
date: "2026-02-08",
type: "income",
amount: 45000,
description: "Obat Rumput"
},
{
date: "2026-02-07",
type: "expense",
amount: 40000,
description: "Investasi RISMA",
note: "Beli tali salaran Bell"
},
{
date: "2026-02-06",
type: "income",
amount: 70000,
description: "Nanem Jagung"
},
{
date: "2026-02-06",
type: "expense",
amount: 20000,
description: "Investasi RISMA",
note: "Beli tali rafia"
},
{
date: "2026-02-05",
type: "expense",
amount: 5000,
description: "Kuaci"
},
{
date: "2026-02-05",
type: "expense",
amount: 100000,
description: "Bayar Utang"
},
{
date: "2026-02-04",
type: "income",
amount: 225000,
description: "Ngecor"
},
{
date: "2026-02-03",
type: "income",
amount: 60000,
description: "Mba Mar"
},
{
date: "2026-02-03",
type: "expense",
amount: 4000,
description: "Kuaci"
},
{
date: "2026-02-03",
type: "income",
amount: 100000,
description: "Susu Etawa"
},
{
date: "2026-02-03",
type: "expense",
amount: 18000,
description: "Bensin"
},
{
date: "2026-02-01",
description: "Saldo Awal",
type: "income",
amount: 88000
},
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