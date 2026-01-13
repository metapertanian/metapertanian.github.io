// navbar2.js // Navbar khusus halaman kerja (Input & Laporan)

document.addEventListener("DOMContentLoaded", () => { const nav = document.createElement("nav"); nav.className = "navbar";

nav.innerHTML = ` <div class="nav-brand">🧾 RISMA FARM</div>

<div class="nav-links">
  <a href="/input-musim.html">Input Musim</a>
  <a href="/input-data.html">Input Data</a>
  <a href="/laporan.html">Laporan</a>
</div>

<div class="nav-links">
  <a href="/index.html">BERTUNAS</a>
  <a href="/rismafarm.html">RISMA FARM</a>
  <a href="/bank-risma.html">BANK RISMA</a>
</div>

`;

document.body.prepend(nav);

// active state const links = nav.querySelectorAll("a"); links.forEach(link => { if (location.pathname === link.getAttribute("href")) { link.classList.add("active"); } }); });