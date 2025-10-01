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
    "Cicilan": "Pembayaran Cicilan"
  };

  // isi
  const item = document.createElement("div");
  item.className = "popup-item";
  item.innerHTML = `
    <div style="font-size:0.8rem; color:#aaa; margin-bottom:4px;">
      ${formatTanggalPanjang(tx.date)}
    </div>
    <div style="font-size:1rem; font-weight:600; margin-bottom:6px; color:#fff;">
      ${tx.description}
    </div>
    <div class="note">${tx.note || "-"}</div>
    <div class="h-details" style="flex-direction:column;gap:6px;margin-top:8px;">
      <div class="type ${tx.type}">
        ${labelJenis[tx.subType] || tx.subType}
      </div>
      <div><strong>Nominal:</strong> ${formatRupiah(tx.amount)}</div>
      <div><strong>Sisa Saldo:</strong> ${formatRupiah(tx.balanceAfter)}</div>
    </div>
    ${fotoHTML}
    ${videoHTML}
  `;
  popup.appendChild(item);

  if (tx.foto) {
    const img = item.querySelector("img");
    img.addEventListener("click", () => showImageModal(tx.foto));
  }

  const closeBtn = header.querySelector(".close-btn");
  if (closeBtn) closeBtn.addEventListener("click", () => popup.remove());

  document.body.appendChild(popup);

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

// =================== Riwayat Transaksi ===================
let historyPage = 1;
const historyPerPage = 5;

function renderHistoryList(page = 1, doScroll = false) {
  const historyContainer = document.querySelector("#history");
  if (!historyContainer) return;
  historyContainer.innerHTML = "";

  const ledger = computeLedger().slice().reverse();
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

  historyPage = page;
  const start = (page - 1) * historyPerPage;
  const end = start + historyPerPage;
  const items = ledger.slice(start, end);

  items.forEach(tx => {
    const wrapper = document.createElement("div");
    wrapper.className = "history-item";

    const header = document.createElement("div");
    header.style.fontSize = "0.8rem";
    header.style.color = "#aaa";
    header.style.marginBottom = "4px";
    header.textContent = formatTanggalPanjang(tx.date);

    const title = document.createElement("div");
    title.style.fontSize = "1rem";
    title.style.fontWeight = "600";
    title.style.marginBottom = "6px";
    title.style.color = "#fff";
    title.textContent = tx.description;

    const noteDiv = document.createElement("div");
    noteDiv.className = "note";
    noteDiv.textContent = tx.note || "-";

    const labelJenis = {
      "Modal": "Modal Usaha",
      "Biaya": "Biaya Perawatan",
      "Omzet": "Hasil Omzet",
      "Cicilan": "Pembayaran Cicilan"
    };

    const detail = document.createElement("div");
    detail.className = "h-details";
    detail.style.flexDirection = "column";
    detail.style.gap = "6px";
    detail.style.marginTop = "8px";
    detail.innerHTML = `
      <div class="type ${tx.type}">
        ${labelJenis[tx.subType] || tx.subType}
      </div>
      <div><strong>Nominal:</strong> ${formatRupiah(tx.amount)}</div>
      <div><strong>Sisa Saldo:</strong> ${formatRupiah(tx.balanceAfter)}</div>
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

  // pagination
  const paginationContainer = document.getElementById("history-pagination");
  if (paginationContainer) paginationContainer.innerHTML = "";
  else {
    const div = document.createElement("div");
    div.id = "history-pagination";
    div.className = "pagination";
    historyContainer.after(div);
  }
  const totalPages = Math.ceil(ledger.length / historyPerPage);
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
    renderSummaryTable();
    renderHistoryList(1, false);

    const saldo = summary().net;
    const saldoEl = document.getElementById("saldoNow");
    saldoEl.textContent = formatRupiah(saldo);
    if (saldo < 0) saldoEl.classList.add("negative");
    else saldoEl.classList.remove("negative");

    const allTransactions = getRawTransactions();
    if (allTransactions.length > 0) {
      const latest = allTransactions
        .slice()
        .sort((a, b) => toDate(b.tanggal) - toDate(a.tanggal))[0];
      document.getElementById("last-updated").innerText =
        "Terakhir diperbarui: " + formatTanggalPanjang(latest.tanggal);
    } else {
      document.getElementById("last-updated").innerText = "Terakhir diperbarui: -";
    }

    const periodeInfo = document.getElementById("periode-info");
    if (periodeInfo) {
      periodeInfo.textContent = `${window.kasData[currentPeriode]?.awal || ""} → ${window.kasData[currentPeriode]?.akhir || ""}`;
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
      renderSummaryTable();
      renderHistoryList();

      const saldo = summary().net;
      const saldoEl = document.getElementById("saldoNow");
      saldoEl.textContent = formatRupiah(saldo);
      if (saldo < 0) saldoEl.classList.add("negative");

      const allTransactions = getRawTransactions();
      if (allTransactions.length > 0) {
        const latest = allTransactions
          .slice()
          .sort((a, b) => toDate(b.tanggal) - toDate(a.tanggal))[0];
        document.getElementById("last-updated").innerText =
          "Terakhir diperbarui: " + formatTanggalPanjang(latest.tanggal);
      } else {
        document.getElementById("last-updated").innerText = "Terakhir diperbarui: -";
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