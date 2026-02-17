import "./firebase.js";
import "./app.js";

// Loading animation 3 detik
let persen = 0;

window.addEventListener("DOMContentLoaded", () => {
  const loadingText = document.getElementById("loadingPercent");
  const loadingPopup = document.getElementById("loadingPopup");

  const interval = setInterval(() => {
    persen += 2;
    if (loadingText) loadingText.innerText = persen;

    if (persen >= 100) {
      clearInterval(interval);
      if (loadingPopup) loadingPopup.style.display = "none";
    }
  }, 60);
});