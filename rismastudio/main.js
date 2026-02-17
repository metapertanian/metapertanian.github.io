// LOADING MURNI TANPA IMPORT APAPUN

window.addEventListener("load", function () {

  let persen = 0;
  const loadingText = document.getElementById("loadingPercent");
  const loadingPopup = document.getElementById("loadingPopup");

  const interval = setInterval(() => {

    persen += 2;

    if (loadingText) {
      loadingText.innerText = persen;
    }

    if (persen >= 100) {
      clearInterval(interval);
      if (loadingPopup) {
        loadingPopup.style.display = "none";
      }
    }

  }, 60);

});