import "./style.css";
import * as BABYLON from "@babylonjs/core";
import { createScene } from "./src/scene";

async function loadFont(fontName, url, options = {}) {
  const font = new FontFace(fontName, `url(${url})`, options);
  await font.load();
  document.fonts.add(font);
}

async function startApp() {
  try {
    await loadFont('Orbitron', '/fonts/Orbitron-Regular.ttf', { weight: '400' });
    await loadFont('Orbitron', '/fonts/Orbitron-Bold.ttf', { weight: '700' });

    // Charger différentes variations de la police 'Exo'
    await loadFont('Exo', '/fonts/Exo2-Light.ttf', { weight: '300' });
    await loadFont('Exo', '/fonts/Exo2-Regular.ttf', { weight: '400' });
    await loadFont('Exo', '/fonts/Exo2-Bold.ttf', { weight: '700' });
    console.log('Orbitron font loaded successfully');

    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas, true);
    const scene = createScene(canvas, engine);

    engine.runRenderLoop(() => {
      scene.render();
    });

    window.addEventListener('resize', () => {
      engine.resize();
    });
  } catch (error) {
    console.error('Error loading font:', error);
  }
}

startApp();
