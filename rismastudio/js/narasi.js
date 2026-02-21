import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  where
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const db = window.db;

const pageSize = 5;
let lastVisible = null;
let currentPage = 1;

/* ================= GENERATE AI ================= */

window.generateAI = async function(){

  const input = document.getElementById("narasiInput").value;

  if(!input) return alert("Isi prompt dulu");

  try{

    const res = await fetch("https://rismastudio-api.vercel.app/api/gemini",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({prompt: input})
    });

    const data = await res.json();

    document.getElementById("narasiInput").value = data.result;

  }catch(err){
    alert("Gagal generate AI");
  }
}


/* ================= SIMPAN DATA ================= */

window.saveData = async function(){

  const text = document.getElementById("narasiInput").value;
  const uid = localStorage.getItem("RISMA_UID");

  if(!uid) return alert("Login dulu");
  if(!text) return alert("Tidak ada isi");

  await addDoc(collection(db,"narasi"),{
    text: text,
    uid: uid,
    createdAt: new Date()
  });

  document.getElementById("narasiInput").value = "";
  loadData(true);
}


/* ================= LOAD DATA ================= */

async function loadData(firstPage=true){

  const uid = localStorage.getItem("RISMA_UID");
  if(!uid) return;

  let q;

  if(firstPage){
    q = query(
      collection(db,"narasi"),
      where("uid","==",uid),
      orderBy("createdAt","desc"),
      limit(pageSize)
    );
    currentPage = 1;
  } else {
    q = query(
      collection(db,"narasi"),
      where("uid","==",uid),
      orderBy("createdAt","desc"),
      startAfter(lastVisible),
      limit(pageSize)
    );
    currentPage++;
  }

  const snap = await getDocs(q);

  const list = document.getElementById("dataList");

  if(firstPage){
    list.innerHTML = "";
  }

  snap.forEach(docSnap => {

    const data = docSnap.data();

    const div = document.createElement("div");
    div.className = "data-item";

    div.innerHTML = `
      <p>${data.text}</p>
      <button class="btn-copy" onclick="copyText(\`${data.text}\`)">Salin</button>
      <button class="btn-edit" onclick="editData('${docSnap.id}', \`${data.text}\`)">Edit</button>
      <button class="btn-danger" onclick="deleteData('${docSnap.id}')">Hapus</button>
    `;

    list.appendChild(div);

  });

  lastVisible = snap.docs[snap.docs.length - 1];

  renderPagination(snap.size);
}


/* ================= PAGINATION ================= */

function renderPagination(dataCount){

  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  if(dataCount === pageSize){
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.onclick = () => loadData(false);
    pagination.appendChild(nextBtn);
  }
}


/* ================= DELETE ================= */

window.deleteData = async function(id){

  await deleteDoc(doc(db,"narasi",id));
  loadData(true);
}


/* ================= EDIT ================= */

window.editData = async function(id,oldText){

  const newText = prompt("Edit narasi:", oldText);
  if(!newText) return;

  await updateDoc(doc(db,"narasi",id),{
    text:newText
  });

  loadData(true);
}


/* ================= COPY ================= */

window.copyText = function(text){
  navigator.clipboard.writeText(text);
  alert("Disalin!");
}


/* ================= AUTO LOAD ================= */

setTimeout(()=>{
  loadData(true);
},1000);