// wa.js
const admin = {
  name: "Pulung Riswanto",
  img: "/risma/img/pulung.png",
  number: "6288971344131"
};

function toggleForm() {
  const form = document.getElementById("formPopup");
  const bantuan = document.getElementById("bantuanPopup");
  if (!form || !bantuan) return;

  if (form.style.display === "block") {
    form.style.display = "none";
    bantuan.style.display = "flex";
  } else {
    form.style.display = "block";
    bantuan.style.display = "none";
    updateProfile();
  }
}

function closeForm() {
  const form = document.getElementById("formPopup");
  const bantuan = document.getElementById("bantuanPopup");
  if (form) form.style.display = "none";
  if (bantuan) bantuan.style.display = "flex";
}

function updateProfile() {
  const adminNameEl = document.getElementById("adminName");
  const adminImgEl = document.getElementById("adminImg");
  const bantuanImgEl = document.getElementById("bantuanImg");

  if (adminNameEl) adminNameEl.textContent = admin.name;
  if (adminImgEl) adminImgEl.src = admin.img;
  if (bantuanImgEl) bantuanImgEl.src = admin.img;
}

function sendWA() {
  const msgEl = document.getElementById("message");
  if (!msgEl) return;

  const msg = msgEl.value.trim();
  if (msg === "") {
    alert("Silakan isi pesan terlebih dahulu.");
    return;
  }

  const url = `https://wa.me/${admin.number}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formPopup");
  const bantuan = document.getElementById("bantuanPopup");
  if (form) form.style.display = "none";
  if (bantuan) bantuan.style.display = "flex";

  updateProfile();
});