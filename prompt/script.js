const app = document.getElementById("app");

prompts.forEach(group => {
  // Judul
  const h1 = document.createElement("h1");
  h1.textContent = group.judul;
  app.appendChild(h1);

  group.sections.forEach(section => {
    // Subjudul
    const h2 = document.createElement("h2");
    h2.textContent = section.subjudul;
    app.appendChild(h2);

    section.scenes.forEach(scene => {
      const sceneDiv = document.createElement("div");
      sceneDiv.className = "scene";

      // Scene title
      const title = document.createElement("h3");
      title.textContent = scene.title;

      // Display text (bukan prompt!)
      const display = document.createElement("p");
      display.textContent = scene.display;

      // Copy button (SALIN PROMPT ASLI)
      const btn = document.createElement("button");
      btn.textContent = "Salin Prompt";

      btn.onclick = () => {
        navigator.clipboard.writeText(scene.prompt.trim());
        btn.textContent = "✅ Disalin";
        setTimeout(() => btn.textContent = "Salin Prompt", 1200);
      };

      sceneDiv.appendChild(title);
      sceneDiv.appendChild(display);
      sceneDiv.appendChild(btn);

      app.appendChild(sceneDiv);
    });
  });
});