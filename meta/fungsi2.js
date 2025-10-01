// =================== fungsi2.js (rev. urutan) ===================

// Helper ambil tanggal dari objek transaksi (tahan beberapa kemungkinan nama)
function _getTxDateStr(tx) {
  return tx.date || tx.tanggal || tx.tanggalStr || "";
}

// =================== Modal Gambar ===================
function showImageModal(src) {
  const existing = document.getElementById("imageModal");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "imageModal";
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "rgba(0,0,0,0.8)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = 10000;

  const img = document.createElement("img");
  img.src = src;
  img.style.maxWidth = "90vw";
  img.style.maxHeight = "90vh";
  img.style.borderRadius = "8px";
  img.style.boxShadow = "0 0 20px rgba(0,0,0,0.5)";

  overlay.addEventListener("click", () => overlay.remove());
  img.addEventListener("click", () => overlay.remove());

  overlay.appendChild(img);
  document.body.appendChild(overlay);
}

// =================== Popup Transaksi ===================
function showTransactionPopup(tx, anchorElement) {
  const existing = document.getElementById("datePopup");
  if (existing) existing.remove();

  const popup = document.createElement("div");
  popup.id = "datePopup";
  popup.className = "date-popup history-item";

  const header = document.createElement("div");
  header.className = "popup-header";
  header.innerHTML = `
    <strong>Detail Transaksi</strong>
    <span class="close-btn" style="cursor:pointer;">❌</span>
  `;
  popup.appendChild(header);

  // foto
  let fotoHTML = "";
  if (tx.foto) {
    fotoHTML = `
      <div style="margin-top:10px;">
        <img src="${tx.foto}" alt="Bukti"
          style="max-width:100%; border-radius:6px; cursor:pointer;">
      </div>
    `;
  }

  // video
  let videoHTML = "";
  if (tx.video) {
    videoHTML = `
      <div style="margin-top:10px;">
        <a href="${tx.video}" target="_blank" 
           style="display:inline-flex;align-items:center;gap:6px;
                  padding:6px 10px;border-radius:6px;
                  background:rgba(255,255,255,0.1);color:#4cc9f0;
                  font-weight:500;text-decoration:none;">
          ▶️ Lihat Video Dokumentasi
        </a>
      </div>
    `;
  }

  const labelJenis = {
    "Modal": "Modal Usaha",
    "Biaya": "Biaya Perawatan",
    "Omzet": "Hasil Omzet",
    "Cicilan": "Pembayaran Cicilan",
    "Ongkos": "Ongkos Panen"
  };

  // isi popup (pakai properti `date` atau `tanggal`)
  const dateStr = _getTxDateStr(tx);
  const item = document.createElement("div");
  item.className = "popup-item";
  item.innerHTML = `
    <div style="font-size:0.8rem; color:#aaa; margin-bottom:4px;">
      ${typeof formatTanggalPanjang === "function" ? formatTanggalPanjang(dateStr) : dateStr}
    </div>
    <div style="font-size:1rem; font-weight:600; margin-bottom:6px; color:#fff;">
      ${tx.description || tx.keterangan || "-"}
    </div>
    <div class="note">${tx.note || tx.catatan || "-"}</div>
    <div class="h-details" style="flex-direction:column;gap:6px;margin-top:8px;">
      <div class="type ${(tx.subType || tx.tipe || "").toLowerCase()}">
        ${labelJenis[tx.subType || tx.tipe] || (tx.subType || tx.tipe || "-")}
      </div>
      <div><strong>Nominal:</strong> ${typeof formatRupiah === "function" ? formatRupiah(tx.amount || tx.nominal || 0) : (tx.amount || tx.nominal || 0)}</div>
      <div><strong>Sisa Saldo:</strong> ${typeof formatRupiah === "function" ? formatRupiah(tx.balanceAfter || tx.saldoAfter || 0) : (tx.balanceAfter || tx.saldoAfter || 0)}</div>
    </div>
    ${fotoHTML}
    ${videoHTML}
  `;
  popup.appendChild(item);

  if (tx.foto) {
    const img = item.querySelector("img");
    if (img) img.addEventListener("click", () => showImageModal(tx.foto));
  }

  const closeBtn = header.querySelector(".close-btn");
  if (closeBtn) closeBtn.addEventListener("click", () => popup.remove());

  document.body.appendChild(popup);

  // posisi popup
  const rect = anchorElement.getBoundingClientRect();
  const top = rect.bottom + window.scrollY + 6;
  let left = rect.left + window.scrollX;

  const popupRect = popup.getBoundingClientRect();
  if (left + popupRect.width > window.innerWidth - 10) {
    left = window.innerWidth - popupRect.width - 10;
  }

  popup.style.position = "absolute";
  popup.style.top = `${top}px`;
  popup.style.left = `${left}px`;
  popup.style.zIndex = 9999;
}

// =================== Pagination state (safe global) ===================
if (typeof window._mp_historyPage === "undefined") window._mp_historyPage = 1;
if (typeof window._mp_historyPerPage === "undefined") window._mp_historyPerPage = 5;

// =================== Render Tabel Ringkasan (Arus Keuangan) ===================
// Urutan: Tanggal terlama -> terbaru (ascending)
function renderSummaryTable() {
  // computeLedger harus tersedia (didefinisikan di fungsi1.js)
  if (typeof computeLedger !== "function") {
    console.warn("computeLedger() belum tersedia.");
    return;
  }

  // ambil ledger lalu pastikan terurut dari terlama -> terbaru
  const ledgerRaw = computeLedger().slice();
  ledgerRaw.sort((a, b) => new Date(_getTxDateStr(a)) - new Date(_getTxDateStr(b)));

  const tbody = document.querySelector("#summary-body");
  if (!tbody) return;
  tbody.innerHTML = "";

  ledgerRaw.forEach(row => {
    const tr = document.createElement("tr");

    const dateTd = document.createElement("td");
    dateTd.innerHTML = (typeof formatTanggalPendekHTML === "function")
      ? formatTanggalPendekHTML(_getTxDateStr(row))
      : (_getTxDateStr(row) || "-");

    const incomeTd = document.createElement("td");
    incomeTd.textContent = row.type === "income" ? ((row.amount || row.nominal) / 1000).toLocaleString("id-ID") : "-";
    if (row.type === "income") {
      incomeTd.classList.add("income");
      incomeTd.style.cursor = "pointer";
      incomeTd.style.textDecoration = "underline";
      incomeTd.addEventListener("click", () => showTransactionPopup(row, incomeTd));
    }

    const expenseTd = document.createElement("td");
    expenseTd.textContent = row.type === "expense" ? ((row.amount || row.nominal) / 1000).toLocaleString("id-ID") : "-";
    if (row.type === "expense") {
      expenseTd.classList.add("expense");
      expenseTd.style.cursor = "pointer";
      expenseTd.style.textDecoration = "underline";
      expenseTd.addEventListener("click", () => showTransactionPopup(row, expenseTd));
    }

    const balanceTd = document.createElement("td");
    balanceTd.textContent = ((row.balanceAfter || row.saldoAfter || 0) / 1000).toLocaleString("id-ID");

    tr.append(dateTd, incomeTd, expenseTd, balanceTd);
    tbody.appendChild(tr);
  });

  // totals (menggunakan fungsi summary() jika ada)
  const sums = (typeof summary === "function") ? summary() : {
    income: ledgerRaw.filter(t => t.type === "income").reduce((s,t)=>s+(t.amount||t.nominal||0),0),
    expense: ledgerRaw.filter(t => t.type === "expense").reduce((s,t)=>s+(t.amount||t.nominal||0),0)
  };
  const tfoot = document.querySelector("#summary-foot");
  if (!tfoot) return;
  tfoot.innerHTML = `
    <tr class="totals">
      <td><strong>Total</strong></td>
      <td class="income"><strong>${(sums.income / 1000).toLocaleString("id-ID")}</strong></td>
      <td class="expense"><strong>${(sums.expense / 1000).toLocaleString("id-ID")}</strong></td>
      <td><strong>${((sums.income - sums.expense) / 1000).toLocaleString("id-ID")}</strong></td>
    </tr>
  `;
}

// =================== Riwayat Transaksi ===================
// Urutan: Tanggal terbaru -> terlama (descending)
function renderHistoryList(page = 1, doScroll = false) {
  const historyContainer = document.querySelector("#history");
  if (!historyContainer) return;
  historyContainer.innerHTML = "";

  if (typeof computeLedger !== "function") {
    console.warn("computeLedger() belum tersedia.");
    return;
  }

  // dapatkan ledger lalu urutkan descending (terbaru dulu)
  const ledger = computeLedger()
    .slice()
    .sort((a, b) => new Date(_getTxDateStr(b)) - new Date(_getTxDateStr(a)));

  if (ledger.length === 0) {
    const msg = document.createElement("div");
    msg.style.opacity = "0.9";
    msg.style.padding = "12px";
    msg.style.borderRadius = "8px";
    msg.style.background = "rgba(255,255,255,0.05)";
    msg.textContent = "Belum ada transaksi.";
    historyContainer.appendChild(msg);
    return;
  }

  // pagination (pakai state global yg aman)
  window._mp_historyPage = page;
  const start = (page - 1) * window._mp_historyPerPage;
  const end = start + window._mp_historyPerPage;
  const items = ledger.slice(start, end);

  items.forEach(tx => {
    const wrapper = document.createElement("div");
    wrapper.className = "history-item";

    const header = document.createElement("div");
    header.style.fontSize = "0.8rem";
    header.style.color = "#aaa";
    header.style.marginBottom = "4px";
    header.textContent = (typeof formatTanggalPanjang === "function") ? formatTanggalPanjang(_getTxDateStr(tx)) : _getTxDateStr(tx);

    const title = document.createElement("div");
    title.style.fontSize = "1rem";
    title.style.fontWeight = "600";
    title.style.marginBottom = "6px";
    title.style.color = "#fff";
    title.textContent = tx.description || tx.keterangan || "-";

    const noteDiv = document.createElement("div");
    noteDiv.className = "note";
    noteDiv.textContent = tx.note || tx.catatan || "-";

    const labelJenis = {
      "Modal": "Modal Usaha",
      "Biaya": "Biaya Perawatan",
      "Omzet": "Hasil Omzet",
      "Cicilan": "Pembayaran Cicilan",
      "Ongkos": "Ongkos Panen"
    };

    const subtype = (tx.subType || tx.tipe || "").toString();
    const detail = document.createElement("div");
    detail.className = "h-details";
    detail.style.flexDirection = "column";
    detail.style.gap = "6px";
    detail.style.marginTop = "8px";
    detail.innerHTML = `
      <div class="type ${subtype.toLowerCase()}">
        ${labelJenis[subtype] || subtype || "-"}
      </div>
      <div><strong>Nominal:</strong> ${typeof formatRupiah === "function" ? formatRupiah(tx.amount || tx.nominal || 0) : (tx.amount || tx.nominal || 0)}</div>
      <div><strong>Sisa Saldo:</strong> ${typeof formatRupiah === "function" ? formatRupiah(tx.balanceAfter || tx.saldoAfter || 0) : (tx.balanceAfter || tx.saldoAfter || 0)}</div>
    `;

    wrapper.append(header, title, noteDiv, detail);

    if (tx.foto) {
      const img = document.createElement("img");
      img.src = tx.foto;
      img.alt = "Bukti";
      img.style.maxWidth = "120px";
      img.style.marginTop = "8px";
      img.style.borderRadius = "6px";
      img.style.cursor = "pointer";
      img.addEventListener("click", () => showImageModal(tx.foto));
      wrapper.appendChild(img);
    }

    if (tx.video) {
      const videoLink = document.createElement("a");
      videoLink.href = tx.video;
      videoLink.target = "_blank";
      videoLink.innerHTML = "▶️ Lihat Video Dokumentasi";
      videoLink.style.display = "inline-flex";
      videoLink.style.alignItems = "center";
      videoLink.style.gap = "6px";
      videoLink.style.padding = "4px 8px";
      videoLink.style.borderRadius = "6px";
      videoLink.style.marginTop = "8px";
      videoLink.style.background = "rgba(255,255,255,0.08)";
      videoLink.style.color = "#4cc9f0";
      videoLink.style.fontWeight = "500";
      videoLink.style.textDecoration = "none";
      wrapper.appendChild(videoLink);
    }

    const sep = document.createElement("hr");
    sep.style.border = "none";
    sep.style.height = "1px";
    sep.style.background = "rgba(255,255,255,0.08)";
    sep.style.margin = "10px 0";

    wrapper.appendChild(sep);
    historyContainer.appendChild(wrapper);
  });

  // pagination controls
  const paginationContainer = document.getElementById("history-pagination");
  if (paginationContainer) paginationContainer.innerHTML = "";
  else {
    const div = document.createElement("div");
    div.id = "history-pagination";
    div.className = "pagination";
    historyContainer.after(div);
  }
  const totalPages = Math.ceil(ledger.length / window._mp_historyPerPage);
  const container = document.getElementById("history-pagination");

  if (totalPages > 1) {
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "« Baru";
    prevBtn.disabled = page === 1;
    prevBtn.onclick = () => renderHistoryList(page - 1, true);
    container.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement("button");
      pageBtn.textContent = i;
      if (i === page) pageBtn.classList.add("active");
      pageBtn.onclick = () => renderHistoryList(i, true);
      container.appendChild(pageBtn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Lama »";
    nextBtn.disabled = page === totalPages;
    nextBtn.onclick = () => renderHistoryList(page + 1, true);
    container.appendChild(nextBtn);
  }

  if (doScroll) {
    const topPos = historyContainer.getBoundingClientRect().top + window.scrollY - 20;
    window.scrollTo({ top: topPos, behavior: "smooth" });
  }
}

// =================== Filter Periode ===================
function renderPeriodeFilter(selectedPeriode, periodes) {
  const container = document.getElementById("periode-filter");
  if (!container) return;

  container.innerHTML = "";
  const label = document.createElement("label");
  label.textContent = "Pilih Periode Laporan: ";
  label.style.marginRight = "8px";

  const select = document.createElement("select");
  periodes.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p;
    opt.textContent = p;
    if (p === selectedPeriode) opt.selected = true;
    select.appendChild(opt);
  });

  select.onchange = () => {
    currentPeriode = select.value;
    // pastikan summary ditampilkan dari terlama -> terbaru
    renderSummaryTable();
    renderHistoryList(1, false);

    const saldo = (typeof summary === "function") ? summary().net : 0;
    const saldoEl = document.getElementById("saldoNow");
    if (saldoEl) {
      saldoEl.textContent = (typeof formatRupiah === "function") ? formatRupiah(saldo) : saldo;
      if (saldo < 0) saldoEl.classList.add("negative");
      else saldoEl.classList.remove("negative");
    }

    const allTransactions = getRawTransactions();
    if (allTransactions && allTransactions.length > 0) {
      const latest = allTransactions
        .slice()
        .sort((a, b) => new Date(_getTxDateStr(b)) - new Date(_getTxDateStr(a)))[0];
      const lastUpdatedEl = document.getElementById("last-updated");
      if (lastUpdatedEl) lastUpdatedEl.innerText = "Terakhir diperbarui: " + (typeof formatTanggalPanjang === "function" ? formatTanggalPanjang(_getTxDateStr(latest)) : _getTxDateStr(latest));
    } else {
      const lastUpdatedEl = document.getElementById("last-updated");
      if (lastUpdatedEl) lastUpdatedEl.innerText = "Terakhir diperbarui: -";
    }

    const periodeInfo = document.getElementById("periode-info");
    if (periodeInfo) {
      periodeInfo.textContent = `${window.kasData[selectedPeriode]?.awal || ""} → ${window.kasData[selectedPeriode]?.akhir || ""}`;
    }
  };

  container.append(label, select);

  let periodeInfo = document.getElementById("periode-info");
  if (!periodeInfo) {
    periodeInfo = document.createElement("div");
    periodeInfo.id = "periode-info";
    periodeInfo.style.marginTop = "6px";
    periodeInfo.style.fontSize = "0.9rem";
    periodeInfo.style.color = "#ccc";
    container.appendChild(periodeInfo);
  }
  periodeInfo.textContent = `${window.kasData[selectedPeriode]?.awal || ""} → ${window.kasData[selectedPeriode]?.akhir || ""}`;
}

// =================== Init ===================
document.addEventListener("DOMContentLoaded", () => {
  function initKas() {
    if (window.kasData && Object.keys(window.kasData).length > 0) {
      const periodes = Object.keys(window.kasData).sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true })
      );
      currentPeriode = periodes[periodes.length - 1];

      renderPeriodeFilter(currentPeriode, periodes);
      // pastikan ringkasan terurut terlama->terbaru
      renderSummaryTable();
      // riwayat: terbaru->terlama
      renderHistoryList();

      const saldo = (typeof summary === "function") ? summary().net : 0;
      const saldoEl = document.getElementById("saldoNow");
      if (saldoEl) {
        saldoEl.textContent = (typeof formatRupiah === "function") ? formatRupiah(saldo) : saldo;
        if (saldo < 0) saldoEl.classList.add("negative");
      }

      const allTransactions = getRawTransactions();
      if (allTransactions && allTransactions.length > 0) {
        const latest = allTransactions
          .slice()
          .sort((a, b) => new Date(_getTxDateStr(b)) - new Date(_getTxDateStr(a)))[0];
        const lastUpdatedEl = document.getElementById("last-updated");
        if (lastUpdatedEl) lastUpdatedEl.innerText = "Terakhir diperbarui: " + (typeof formatTanggalPanjang === "function" ? formatTanggalPanjang(_getTxDateStr(latest)) : _getTxDateStr(latest));
      } else {
        const lastUpdatedEl = document.getElementById("last-updated");
        if (lastUpdatedEl) lastUpdatedEl.innerText = "Terakhir diperbarui: -";
      }

      const periodeInfo = document.getElementById("periode-info");
      if (periodeInfo) {
        periodeInfo.textContent = `${window.kasData[currentPeriode]?.awal || ""} → ${window.kasData[currentPeriode]?.akhir || ""}`;
      }
    } else {
      console.warn("⚠️ Data kas belum tersedia saat init.");
    }
  }

  if (window.kasData) {
    initKas();
  } else {
    const checkKas = setInterval(() => {
      if (window.kasData && Object.keys(window.kasData).length > 0) {
        clearInterval(checkKas);
        initKas();
      }
    }, 500);
  }
});

