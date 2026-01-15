// navbar2.js
// Navbar universal BERTUNAS
// Mode: "public" | "admin"

function renderNavbar(active = "", mode = "public") {
  /* =========================
     NAVBAR FIXED
  ========================= */
  const navbar = document.createElement("div");
  navbar.className = "navbar";

  navbar.innerHTML = `
    <div class="brand">🌱 BERTUNAS</div>
    <button onclick="toggleMenu()">☰</button>
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
    <a href="/rismafarm.html" class="${active === 'rismafarm' ? 'active' : ''}">
      🌾 RISMA FARM
    </a>
    <a href="/bank-risma.html" class="${active === 'bank' ? 'active' : ''}">
      💰 BANK RISMA
    </a>
  `;

  let linksAdmin = `
    <a href="/input-musim.html" class="${active === 'musim' ? 'active' : ''}">
      🌱 Input Musim
    </a>
    <a href="/input-data.html" class="${active === 'input' ? 'active' : ''}">
      🧾 Input Data
    </a>
    <a href="/tariktunai.html" class="${active === 'tarik' ? 'active' : ''}">
      💸 Tarik Tunai
    </a>
    <a href="/laporan.html" class="${active === 'laporan' ? 'active' : ''}">
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