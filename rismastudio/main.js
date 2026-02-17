document.addEventListener("DOMContentLoaded", function () {

  let persen = 0;

  const loadingText = document.getElementById("loadingPercent");
  const loadingScreen = document.getElementById("loadingScreen");
  const mainContent = document.getElementById("mainContent");

  const interval = setInterval(function () {

    persen += 5;

    if (loadingText) {
      loadingText.innerText = persen;
    }

    if (persen >= 100) {
      clearInterval(interval);

      // Tutup loading
      if (loadingScreen) {
        loadingScreen.style.display = "none";
      }

      // Tampilkan konten utama
      if (mainContent) {
        mainContent.style.display = "block";
      }

      // Load navbar (jangan bikin error kalau gagal)
      fetch("navbar.html")
        .then(r => r.text())
        .then(d => {
          const nav = document.getElementById("navbar");
          if (nav) nav.innerHTML = d;
        })
        .catch(err => console.log("Navbar gagal load:", err));
    }

  }, 80);

});