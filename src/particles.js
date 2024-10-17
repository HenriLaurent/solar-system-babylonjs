import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";

export const createParticleSystems = (scene, sun, stars) => {
  // Configuration des émetteurs de particules
  const sunEmitter = new BABYLON.SphereParticleEmitter();
  sunEmitter.radius = 1;
  sunEmitter.radiusRange = 0;

  const starsEmitter = new BABYLON.SphereParticleEmitter();
  starsEmitter.radius = 210;
  starsEmitter.radiusRange = 0;

  // Surface Particles
  const surfaceParticles = new BABYLON.ParticleSystem(
    "surfaceParticles",
    1600,
    scene,
  );
  surfaceParticles.particleTexture = new BABYLON.Texture(
    "https://raw.githubusercontent.com/PatrickRyanMS/BabylonJStextures/master/ParticleSystems/Sun/T_SunSurface.png",
    scene,
  );
  surfaceParticles.preWarmStepOffset = 10;
  surfaceParticles.preWarmCycles = 100;
  surfaceParticles.minInitialRotation = -2 * Math.PI;
  surfaceParticles.maxInitialRotation = 2 * Math.PI;
  surfaceParticles.emitter = sun;
  surfaceParticles.particleEmitterType = sunEmitter;
  surfaceParticles.gravity = new BABYLON.Vector3(0, 0, 0);
  surfaceParticles.addColorGradient(
    0,
    new BABYLON.Color4(0.8509, 0.4784, 0.1019, 0.0),
  );
  surfaceParticles.addColorGradient(
    0.4,
    new BABYLON.Color4(0.6259, 0.3056, 0.0619, 0.5),
  );
  surfaceParticles.addColorGradient(
    0.5,
    new BABYLON.Color4(0.6039, 0.2887, 0.0579, 0.5),
  );
  surfaceParticles.addColorGradient(
    1.0,
    new BABYLON.Color4(0.3207, 0.0713, 0.0075, 0.0),
  );
  surfaceParticles.minSize = 0.4;
  surfaceParticles.maxSize = 0.7;
  surfaceParticles.minLifeTime = 8.0;
  surfaceParticles.maxLifeTime = 8.0;
  surfaceParticles.emitRate = 200;
  surfaceParticles.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
  surfaceParticles.minAngularSpeed = -0.4;
  surfaceParticles.maxAngularSpeed = 0.4;
  surfaceParticles.minEmitPower = 0;
  surfaceParticles.maxEmitPower = 0;
  surfaceParticles.updateSpeed = 0.005;
  surfaceParticles.isBillboardBased = false;

  // Flare Particles
  const flareParticles = new BABYLON.ParticleSystem(
    "flareParticles",
    20,
    scene,
  );
  flareParticles.particleTexture = new BABYLON.Texture(
    "https://raw.githubusercontent.com/PatrickRyanMS/BabylonJStextures/master/ParticleSystems/Sun/T_SunFlare.png",
    scene,
  );
  flareParticles.preWarmStepOffset = 10;
  flareParticles.preWarmCycles = 100;
  flareParticles.minInitialRotation = -2 * Math.PI;
  flareParticles.maxInitialRotation = 2 * Math.PI;
  flareParticles.emitter = sun;
  flareParticles.particleEmitterType = sunEmitter;
  flareParticles.gravity = new BABYLON.Vector3(0, 0, 0);
  flareParticles.addColorGradient(
    0,
    new BABYLON.Color4(1, 0.9612, 0.5141, 0.0),
  );
  flareParticles.addColorGradient(
    0.25,
    new BABYLON.Color4(0.9058, 0.7152, 0.3825, 1.0),
  );
  flareParticles.addColorGradient(
    1.0,
    new BABYLON.Color4(0.632, 0.0, 0.0, 0.0),
  );
  flareParticles.minScaleX = 0.5;
  flareParticles.minScaleY = 0.5;
  flareParticles.maxScaleX = 1.0;
  flareParticles.maxScaleY = 1.0;
  flareParticles.minLifeTime = 10.0;
  flareParticles.maxLifeTime = 10.0;
  flareParticles.emitRate = 1;
  flareParticles.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
  flareParticles.minEmitPower = 0.001;
  flareParticles.maxEmitPower = 0.01;
  flareParticles.minAngularSpeed = 0;
  flareParticles.maxAngularSpeed = 0;
  flareParticles.addSizeGradient(0, 0);
  flareParticles.addSizeGradient(1, 1);
  flareParticles.isBillboardBased = true;

  // Corona Particles
  const coronaParticles = new BABYLON.ParticleSystem(
    "coronaParticles",
    600,
    scene,
  );
  coronaParticles.particleTexture = new BABYLON.Texture(
    "https://raw.githubusercontent.com/PatrickRyanMS/BabylonJStextures/master/ParticleSystems/Sun/T_Star.png",
    scene,
  );
  coronaParticles.preWarmStepOffset = 10;
  coronaParticles.preWarmCycles = 100;
  coronaParticles.minInitialRotation = -2 * Math.PI;
  coronaParticles.maxInitialRotation = 2 * Math.PI;
  coronaParticles.emitter = sun;
  coronaParticles.particleEmitterType = sunEmitter;
  coronaParticles.gravity = new BABYLON.Vector3(0, 0, 0);
  coronaParticles.addColorGradient(
    0,
    new BABYLON.Color4(0.8509, 0.4784, 0.1019, 0.0),
  );
  coronaParticles.addColorGradient(
    0.5,
    new BABYLON.Color4(0.6039, 0.2887, 0.0579, 0.12),
  );
  coronaParticles.addColorGradient(
    1.0,
    new BABYLON.Color4(0.3207, 0.0713, 0.0075, 0.0),
  );
  coronaParticles.minScaleX = 0.5;
  coronaParticles.minScaleY = 0.75;
  coronaParticles.maxScaleX = 1.2;
  coronaParticles.maxScaleY = 3.0;
  coronaParticles.minLifeTime = 2.0;
  coronaParticles.maxLifeTime = 2.0;
  coronaParticles.emitRate = 300;
  coronaParticles.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
  coronaParticles.minEmitPower = 0;
  coronaParticles.maxEmitPower = 0;
  coronaParticles.minAngularSpeed = 0;
  coronaParticles.maxAngularSpeed = 0;
  coronaParticles.isBillboardBased = true;

  // Stars Particles
  const starsParticles = new BABYLON.ParticleSystem(
    "starsParticles",
    3000,
    scene,
  );
  starsParticles.particleTexture = new BABYLON.Texture(
    "https://raw.githubusercontent.com/PatrickRyanMS/BabylonJStextures/master/ParticleSystems/Sun/T_Star.png",
    scene,
  );
  starsParticles.preWarmStepOffset = 10;
  starsParticles.preWarmCycles = 100;
  starsParticles.minInitialRotation = -2 * Math.PI;
  starsParticles.maxInitialRotation = 2 * Math.PI;
  starsParticles.emitter = stars;
  starsParticles.particleEmitterType = starsEmitter;
  starsParticles.gravity = new BABYLON.Vector3(0, 0, 0);
  starsParticles.color1 = new BABYLON.Color4(0.898, 0.737, 0.718, 1.0);
  starsParticles.color2 = new BABYLON.Color4(0.584, 0.831, 0.894, 1.0);
  starsParticles.minSize = 1.8;
  starsParticles.maxSize = 2.4;
  starsParticles.minLifeTime = 999999;
  starsParticles.maxLifeTime = 999999;
  starsParticles.manualEmitCount = 500;
  starsParticles.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
  starsParticles.minAngularSpeed = 0;
  starsParticles.maxAngularSpeed = 0;
  starsParticles.minEmitPower = 0;
  starsParticles.maxEmitPower = 0;
  starsParticles.isBillboardBased = true;

  return { surfaceParticles, flareParticles, coronaParticles, starsParticles };
};
