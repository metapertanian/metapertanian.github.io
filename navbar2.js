// navbar2.js
// Navbar universal BERTUNAS
// Mode: "public" | "admin"

function renderNavbar(active = "", mode = "public") {
  const nav = document.createElement("div");
  nav.className = "navbar";

  let linksPublic = `
    <a href="/index.html" class="${active === 'bertunas' ? 'active' : ''}">
      BERTUNAS
    </a>
    <a href="/rismafarm.html" class="${active === 'rismafarm' ? 'active' : ''}">
      RISMA FARM
    </a>
    <a href="/bankrisma.html" class="${active === 'bank' ? 'active' : ''}">
      BANK RISMA
    </a>
  `;

  let linksAdmin = `
    <a href="/input-musim.html" class="${active === 'musim' ? 'active' : ''}">
      Input Musim
    </a>
    <a href="/input-data.html" class="${active === 'input' ? 'active' : ''}">
      Input Data
    </a>
    <a href="/tariktunai.html" class="${active === 'tarik' ? 'active' : ''}">
      Tarik Tunai
    </a>
    <a href="/laporan.html" class="${active === 'laporan' ? 'active' : ''}">
      Laporan
    </a>
  `;

  nav.innerHTML = `
    <div class="navbar-inner">
      <div class="brand">🌱 BERTUNAS</div>
      <div class="nav-links">
        ${linksPublic}
        ${mode === "admin" ? linksAdmin : ""}
      </div>
    </div>
  `;

  document.body.prepend(nav);
}