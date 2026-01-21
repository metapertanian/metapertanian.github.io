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