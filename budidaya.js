// Data budidaya
const budidayaData = [
  {
    foto: "jagung.jpg",
    tanggal: "2025-03-12",
    luas: "0.5 Ha",
    hasil: "3 Ton"
  },
  {
    foto: "timun.jpg",
    tanggal: "2025-05-01",
    luas: "0.25 Ha",
    hasil: "1.2 Ton"
  },
  {
    foto: "cabai.jpg",
    tanggal: "2025-08-20",
    luas: "0.3 Ha",
    hasil: "850 Kg"
  }
];

// Render ke halaman
const container = document.getElementById("budidaya-container");

budidayaData.forEach(item => {
  const year = new Date(item.tanggal).getFullYear();

  const card = document.createElement("div");
  card.className = "budidaya-card";

  card.innerHTML = `
    <div class="budidaya-photo">
      <img src="${item.foto}" alt="Budidaya ${year}">
      <span class="year">${year}</span>
    </div>
    <div class="budidaya-info">
      <p><strong>Tanggal:</strong> ${item.tanggal}</p>
      <p><strong>Luas Lahan:</strong> ${item.luas}</p>
      <p><strong>Hasil Panen:</strong> ${item.hasil}</p>
    </div>
  `;

  container.appendChild(card);
});
