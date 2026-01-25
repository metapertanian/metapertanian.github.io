// navbar.js
// Navbar universal BERTUNAS
// Mode: "public" | "admin"

function renderNavbar(active = "", mode = "public") {
  /* =========================
     NAVBAR FIXED
  ========================= */
  const navbar = document.createElement("div");
  navbar.className = "navbar";

  navbar.innerHTML = `
    <div class="brand">
      <img src="/img/bertunas.png" alt="BERTUNAS" class="brand-logo">
      <span class="brand-text">BERTUNAS</span>
    </div>
    <button class="nav-toggle" onclick="toggleMenu()">☰</button>
  `;

  /* =========================
     MENU DROPDOWN
  ========================= */
  const menu = document.createElement("div");
  menu.className = "nav-menu";
  menu.id = "navMenu";

  let linksPublic = `
    <a href="/index.html" class="${active === 'bertunas' ? 'active' : ''}">
      🏠 BERTUNAS
    </a>
    <a href="/rismafarm" class="${active === 'rismafarm' ? 'active' : ''}">
      🌱 RISMA FARM
    </a>
    <a href="/bank-risma" class="${active === 'bank' ? 'active' : ''}">
      🏦 BANK RISMA
    </a>
  `;

  let linksAdmin = `
    <a href="/input-musim" class="${active === 'musim' ? 'active' : ''}">
      🌱 Input Musim
    </a>
    <a href="/input-data" class="${active === 'input' ? 'active' : ''}">
      🧾 Input Data
    </a>
    <a href="/input-bank" class="${active === 'kas' ? 'active' : ''}">
      💸 Input Bank
    </a>
    <a href="/laporan" class="${active === 'laporan' ? 'active' : ''}">
      📊 Laporan
    </a>
  `;

  menu.innerHTML = `
    ${linksPublic}
    ${mode === "admin" ? linksAdmin : ""}
  `;

  /* =========================
     INJECT KE BODY
  ========================= */
  document.body.prepend(menu);
  document.body.prepend(navbar);

  /* =========================
     CLOSE MENU WHEN CLICK OUTSIDE
  ========================= */
  document.addEventListener("click", e => {
    if (
      !e.target.closest(".navbar") &&
      !e.target.closest(".nav-menu")
    ) {
      menu.classList.remove("active");
    }
  });
}

/* =========================
   TOGGLE MENU
========================= */
function toggleMenu() {
  const menu = document.getElementById("navMenu");
  if (menu) menu.classList.toggle("active");
}


/* ======================================================
   FOOTER BERTUNAS
====================================================== */
function renderFooter() {
  const year = new Date().getFullYear();

  const footer = document.createElement("footer");
  footer.className = "site-footer";

  footer.innerHTML = `
    <div class="footer-inner">
      <span>©${year} <strong>Pulung Riswanto</strong></span>
    </div>
  `;

  document.body.appendChild(footer);
}