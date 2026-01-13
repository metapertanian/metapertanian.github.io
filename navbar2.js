// navbar2.js
// Navbar universal BERTUNAS / RISMA FARM / BANK RISMA

function renderNavbar(active = "") {
  const nav = document.createElement("div");
  nav.className = "navbar";

  nav.innerHTML = `
    <div class="navbar-inner">
      <div class="brand">🌱 BERTUNAS</div>

      <div class="nav-links">
        <a href="/index.html" class="${active === 'bertunas' ? 'active' : ''}">
          BERTUNAS
        </a>

        <a href="/rismafarm.html" class="${active === 'rismafarm' ? 'active' : ''}">
          RISMA FARM
        </a>

        <a href="/bankrisma.html" class="${active === 'bank' ? 'active' : ''}">
          BANK RISMA
        </a>

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
      </div>
    </div>
  `;

  document.body.prepend(nav);
}