import { auth, provider, db, signInWithPopup, onAuthStateChanged, signOut } from "./firebase.js";
import { collection, addDoc, getDocs, query, orderBy } 
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

let currentUser = null;

window.saveData = async function(type, content) {
  if (!currentUser) return alert("Login dulu");

  await addDoc(collection(db, "users", currentUser.uid, type), {
    content: content,
    created: new Date()
  });

  alert("Tersimpan!");
}

window.loadData = async function(type, elementId) {
  if (!currentUser) return;

  const q = query(collection(db, "users", currentUser.uid, type), orderBy("created", "desc"));
  const snapshot = await getDocs(q);

  let html = "";
  snapshot.forEach(doc => {
    html += `<div style="border:1px solid #444;padding:10px;margin:5px 0;">
      ${doc.data().content}
    </div>`;
  });

  document.getElementById(elementId).innerHTML = html;
};

onAuthStateChanged(auth, (user) => {
  const userArea = document.getElementById("userArea");

  if (user) {
    currentUser = user;
    userArea.innerHTML = `
      <img src="${user.photoURL}" width="30" style="border-radius:50%">
      ${user.displayName}
      <button onclick="logout()">Logout</button>
    `;
    document.getElementById("welcomePopup").style.display = "flex";
  } else {
    userArea.innerHTML = `<button onclick="login()">Login Google</button>`;
  }

  document.getElementById("loadingPopup").style.display = "none";
});

window.login = async function() {
  await signInWithPopup(auth, provider);
}

window.logout = async function() {
  await signOut(auth);
}

window.closeWelcome = function() {
  document.getElementById("welcomePopup").style.display = "none";
}