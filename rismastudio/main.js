let persen = 0;

const loadingText = document.getElementById("loadingPercent");
const loadingScreen = document.getElementById("loadingScreen");
const mainContent = document.getElementById("mainContent");

const interval = setInterval(function(){

  persen += 5;
  loadingText.innerText = persen;

  if(persen >= 100){
    clearInterval(interval);

    loadingScreen.style.display = "none";
    mainContent.style.display = "block";

    // Load Navbar setelah loading selesai
    fetch("navbar.html")
      .then(r=>r.text())
      .then(d=>document.getElementById("navbar").innerHTML=d);
  }

}, 100);