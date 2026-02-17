window.onload = function () {

  let persen = 0;

  const loadingText = document.getElementById("loadingPercent");
  const loadingPopup = document.getElementById("loadingPopup");

  if (!loadingText || !loadingPopup) {
    console.log("Element loading tidak ditemukan");
    return;
  }

  const interval = setInterval(function () {

    persen += 5;
    loadingText.innerText = persen;

    if (persen >= 100) {
      clearInterval(interval);
      loadingPopup.style.display = "none";
    }

  }, 150);

};