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
      silahkan ketik <b>daftar</b> di grup lomba yang sudah disediakan oleh panitia terlebih dahulu.<br><br>
      <a href="https://wa.me/?text=daftar" target="_blank" class="wa-btn">💬 Kirim ke Grup</a>
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
        <h3 style="margin:0 0 10px;color:var(--highlight)">Hai ${nama}👋</h3>
        <p style="line-height:1.6;color:var(--text-main)">
          silahkan isi data dulu dan klik <b>Kirim ke WA</b>.<br>
          nanti kamu akan diarahkan ke WA panitia.<br>
          setalah itu baru kirim videomu.
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
      silahkan isi data dulu dan klik <b>Kirim ke WA</b>.<br>
      nanti kamu akan diarahkan ke WA panitia.<br>
      setalah itu baru kirim videomu.
    </div>
  `;
}

// =========================================================
// 📩 Kirim ke WhatsApp
// =========================================================
function kirimWA() {
  if (kode !== KODE_BENAR) {
    alert("⚠️ Kode tidak valid. Silahkan hubungi panitia terlebih dahulu.");
    return;
  }

  const tiktok = document.getElementById('tiktok').value.trim();
  const caption = document.getElementById('caption').value.trim();
  const provider = document.getElementById('provider').value.trim();
  const hp = document.getElementById('hp').value.trim();
  const grupVal = document.getElementById('grup').value.trim();

  if (!tiktok || !caption || !provider || !hp) {
    alert("⚠️ Harap isi semua kolom yang wajib sebelum mengirim!");
    return;
  }

  const pesan = `*Pendaftaran Lomba Konten Kreator*%0A
👤 Akun TikTok: ${tiktok}%0A
👥 Grup: ${grupVal || '-'}%0A
📝 Caption: ${caption}%0A
📞 Kartu Perdana: ${provider}%0A
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

    // Ambil yang paling atas (paling baru)
    const latestKey = seasonKeys[0];
    const latestSeason = dataJuara[latestKey];

    if (latestSeason) {
      document.getElementById("infoSeason").innerHTML = `
        <div class="season-box">
          <b>${latestKey}</b><br>
          🎬 ${latestSeason.tema}<br>
          <small style="display:block;margin-top:4px;color:var(--text-sub)">
            ${latestSeason.deskripsi || ""}
          </small>
          <div style="margin-top:6px;font-size:0.85em;opacity:0.8;">
            📆 ${latestSeason.periode || "-"}
          </div>
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