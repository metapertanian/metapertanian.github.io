/* ================= TOGGLE MENU ================= */

window.toggleMenu = function(){
  const menu = document.getElementById("navMenu");
  menu.classList.toggle("active");
}


/* ================= AUTO POPUP LOGIN ================= */

import { onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

const auth = window.auth;

onAuthStateChanged(auth, (user)=>{

  const popup = document.getElementById("loginPopup");

  if(!user){
    if(popup) popup.style.display = "flex";
  }else{
    if(popup) popup.style.display = "none";
  }

});