<script type="module">

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getFirestore } 
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC1wbXRXclBcMg9AXgV9iiPuj0M3HWgaHc",
  authDomain: "rismastudio.firebaseapp.com",
  projectId: "rismastudio",
  storageBucket: "rismastudio.firebasestorage.app",
  messagingSenderId: "960041733958",
  appId: "1:960041733958:web:53ebe755ff45885b905f47"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const provider = new GoogleAuthProvider();

window.loginGoogle = async function(){
  await signInWithPopup(auth, provider);
}

window.logoutGoogle = async function(){
  await signOut(auth);
}

onAuthStateChanged(auth, (user)=>{
  const area = document.getElementById("userArea");

  if(user){
    localStorage.setItem("RISMA_UID", user.uid);

    area.innerHTML = `
      <img src="${user.photoURL}" width="35" style="border-radius:50%;vertical-align:middle;">
      <span>${user.displayName}</span>
      <button onclick="logoutGoogle()">Logout</button>
    `;
  } else {
    area.innerHTML = `
      <button onclick="loginGoogle()">Sign in with Google</button>
    `;
  }
});

window.db = db;

</script>