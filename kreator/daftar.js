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
  statusBox.innerHTML = `
    <div class="notif success">
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
👤 Nama: ${nama}%0A
👥 Grup: ${grupVal || '-'}%0A
📱 Akun TikTok: ${tiktok}%0A
📝 Caption: ${caption}%0A
📞 Nomor Telepon: ${telepon}%0A
📸 Merek HP: ${hp}%0A
%0ASaya telah mengisi formulir pendaftaran.`;

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
          📅 <b>Season:</b> ${lastKey}<br>
          🎬 <b>Tema:</b> ${lastSeason.tema || "-"}<br>
          🕓 <b>Periode:</b> ${lastSeason.periode || "-"}
        </div>
      `;
    }
  } catch (e) {
    console.warn("⚠️ Gagal memuat info season:", e);
  }
});

// =========================================================
// 🔘 Navbar Toggle
// =========================================================
function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("active");
}