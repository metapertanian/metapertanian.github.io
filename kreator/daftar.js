// =========================================================
// ⚙️ SETTINGAN UTAMA
// =========================================================
const KODE_BENAR = "kaummendangmending"; // ubah di sini
const STATUS_PENDAFTARAN = true; // true = buka, false = tutup
const NOMOR_ADMIN = "6288971344131"; // nomor WA admin

// =========================================================
// 🧭 Ambil Parameter URL
// =========================================================
const params = new URLSearchParams(window.location.search);
const nama = params.get("nama") || "Kreator Hebat";
const grup = params.get("grup") || "";
const kode = params.get("kode");

document.getElementById("grup").value = grup;

// =========================================================
// 👋 Sambutan Berdasarkan Waktu
// =========================================================
const jam = new Date().getHours();
let waktu = "pagi";
if (jam >= 10 && jam <= 15) waktu = "siang";
else if (jam >= 16 && jam <= 18) waktu = "sore";
else if (jam >= 19 || jam <= 2) waktu = "malam";

document.getElementById("sambutan").innerHTML = `
  <div class="sambutan-text">
    Selamat ${waktu}, <b>${nama}</b> 👋
  </div>
`;

// =========================================================
// 🟢 STATUS PENDAFTARAN
// =========================================================
const statusBox = document.getElementById("statusBox");
const formBox = document.getElementById("formBox");

if (!STATUS_PENDAFTARAN) {
  statusBox.innerHTML = `
    <div class="notif warning">
      ⚠️ Pendaftaran belum dibuka atau sudah ditutup.<br>
      Silakan cek kembali nanti!
    </div>`;
  formBox.style.display = "none";
}

// =========================================================
// ✅ Validasi Kode
// =========================================================
if (kode !== KODE_BENAR || !kode) {
  formBox.style.display = "none";
  statusBox.innerHTML = `
    <div class="notif warning">
      ⚠️ Sudah masuk grup?<br>
      Silakan ketik <b>daftar</b> di grup lomba yang sudah disediakan oleh panitia.<br><br>
      <a href="https://chat.whatsapp.com/" target="_blank" class="wa-btn">💬 Kirim ke Grup</a>
      <a href="https://wa.me/${NOMOR_ADMIN}?text=Halo%20admin%2C%20saya%20ingin%20mendaftar%20lomba%20konten." target="_blank" class="wa-btn">📞 Hubungi Panitia</a>
    </div>
  `;
} else if (STATUS_PENDAFTARAN) {
  // ✅ Munculkan notifikasi pop-up elegan
  const popup = document.createElement("div");
  popup.innerHTML = `
    <div id="popupOverlay" style="
      position:fixed;
      inset:0;
      background:rgba(0,0,0,0.55);
      display:flex;
      justify-content:center;
      align-items:center;
      z-index:1000;">
      <div style="
        background:var(--card-bg);
        padding:28px 22px;
        border-radius:16px;
        box-shadow:0 8px 30px rgba(0,0,0,0.3);
        max-width:400px;
        text-align:center;
        animation:fadeIn 0.4s ease;">
        <h3 style="margin:0 0 10px;color:var(--highlight)">Kode Verifikasi Benar ✅</h3>
        <p style="line-height:1.6;color:var(--text-main)">
          Silakan isi data di bawah ini dan kirim.<br>
          Jangan lupa untuk mengirim video karyamu ke panitia.
        </p>
        <button id="closePopup" style="
          margin-top:14px;
          padding:10px 18px;
          border:none;
          border-radius:8px;
          background:var(--accent);
          color:#fff;
          font-weight:600;
          cursor:pointer;
          transition:background .2s;">
          Lanjutkan
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(popup);
  document.getElementById("closePopup").onclick = () => {
    document.getElementById("popupOverlay").remove();
  };

  // tetap tampilkan statusBox untuk aksesibilitas
  statusBox.innerHTML = `
    <div class="notif success" style="display:none;">
      Silakan isi data di bawah ini dan kirim.<br>
      Jangan lupa untuk mengirim video karyamu ke panitia.
    </div>
  `;
}

// =========================================================
// 📩 Kirim ke WhatsApp
// =========================================================
function kirimWA() {
  if (kode !== KODE_BENAR) {
    alert("⚠️ Kode tidak valid. Silakan hubungi panitia terlebih dahulu.");
    return;
  }

  const tiktok = document.getElementById('tiktok').value.trim();
  const caption = document.getElementById('caption').value.trim();
  const telepon = document.getElementById('telepon').value.trim();
  const hp = document.getElementById('hp').value.trim();
  const grupVal = document.getElementById('grup').value.trim();

  if (!tiktok || !caption || !telepon || !hp) {
    alert("⚠️ Harap isi semua kolom yang wajib sebelum mengirim!");
    return;
  }

  const pesan = `*Pendaftaran Lomba Konten Kreator*%0A
👤 Akun TikTok: ${tiktok}%
👥 Grup: ${grupVal || '-'}%0A0A
📝 Caption: ${caption}%0A
📞 Nomor Telepon: ${telepon}%0A
📱 Merek HP: ${hp}%0A
%0ASaya akan segera mengirim videonya.`;

  window.open(`https://wa.me/${NOMOR_ADMIN}?text=${pesan}`, "_blank");
}

// =========================================================
// 📅 Info Season Terbaru dari juara.js
// =========================================================
window.addEventListener("load", () => {
  try {
    const seasonKeys = Object.keys(dataJuara);
    if (seasonKeys.length === 0) return;

    const lastKey = seasonKeys[seasonKeys.length - 1];
    const lastSeason = dataJuara[lastKey];

    if (lastSeason) {
      document.getElementById("infoSeason").innerHTML = `
        <div class="season-box">
          <b>${lastKey}</b><br>
          <b>Tema:</b> ${lastSeason.tema || "-"}<br>
          📆${lastSeason.periode || "-"}
        </div>
      `;
    }
  } catch (e) {
    console.warn("⚠️ Gagal memuat info season:", e);
  }
});

// =========================================================
// 🔘 Navbar Toggle (slide dari kiri)
// =========================================================
function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("active");
  if (menu.classList.contains("active")) {
    menu.style.left = "0";
    menu.style.right = "auto";
  } else {
    menu.style.left = "-100%";
  }
}