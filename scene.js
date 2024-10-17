import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";

export const createScene = (canvas, engine) => {
  const scene = new BABYLON.Scene(engine);

  // Configuration de la caméra
  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    -Math.PI / 2,
    Math.PI / 2.5,
    30,
    new BABYLON.Vector3(0, 0, 0),
  );
  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = 1;
  camera.upperRadiusLimit = 200;

  const sunLight = new BABYLON.PointLight(
    "sunLight",
    BABYLON.Vector3.Zero(),
    scene,
  );
  sunLight.intensity = 1;
  sunLight.range = 1000; // Ajustez selon la taille de votre scène
  sunLight.diffuse = new BABYLON.Color3(1, 0.9, 0.7);
  sunLight.specular = new BABYLON.Color3(0.1, 0.1, 0.1);

  const ambientLight = new BABYLON.HemisphericLight(
    "ambientLight",
    new BABYLON.Vector3(0, 1, 0),
    scene,
  );
  ambientLight.intensity = 0.2;
  ambientLight.diffuse = new BABYLON.Color3(0.2, 0.2, 0.3);
  ambientLight.groundColor = new BABYLON.Color3(0.1, 0.1, 0.1);

  // Création de textures dynamiques pour les planètes
  const createPlanetTexture = (name, primaryColor, secondaryColor) => {
    const texture = new BABYLON.DynamicTexture(
      name,
      { width: 256, height: 256 },
      scene,
    );
    const ctx = texture.getContext();
    ctx.fillStyle = primaryColor;
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = secondaryColor;
    for (let i = 0; i < 256; i += 32) {
      ctx.fillRect(i, 0, 16, 256);
    }
    texture.update();
    return texture;
  };

  const earthTexture = new BABYLON.Texture("/earth_day_texture.jpg");
  earthTexture.vScale = -1;
  earthTexture.uScale = -1;

  const earthNormalTexture = new BABYLON.Texture(
    "/earth_normal_texture.jpg",
    scene,
  );
  earthNormalTexture.vScale = -1;
  earthNormalTexture.uScale = -1;

  const earthSpecularTexture = new BABYLON.Texture(
    "/earth_specular_texture.jpg",
    scene,
  );
  earthSpecularTexture.vScale = -1;
  earthSpecularTexture.uScale = -1;

  const moonTexture = new BABYLON.Texture("/moon_texture.jpg");

  const earthContainer = new BABYLON.TransformNode("earthContainer");
  const earthMaterial = new BABYLON.StandardMaterial("earthMaterial", scene);
  earthMaterial.diffuseTexture = earthTexture;
  earthMaterial.bumpTexture = earthNormalTexture;
  earthMaterial.bumpTexture.level = 0.8;
  earthMaterial.specularTexture = earthSpecularTexture;
  earthMaterial.specularPower = 16;
  earthMaterial.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);

  // Création des objets de base
  const stars = BABYLON.MeshBuilder.CreateBox("emitter", { size: 0.01 }, scene);
  const coreSphere = BABYLON.MeshBuilder.CreateSphere(
    "coreSphere",
    { diameter: 2.01, segments: 64 },
    scene,
  );
  const corePlanetAlpha = BABYLON.MeshBuilder.CreateSphere(
    "corePlanetAlpha",
    { diameter: 0.75, segments: 64 },
    scene,
  );
  corePlanetAlpha.parent = earthContainer;
  earthContainer.rotation.x = BABYLON.Tools.ToRadians(23.5);
  const coreMoonPlanetAlpha = BABYLON.MeshBuilder.CreateSphere(
    "coreMoonPlanetAlpha",
    { diameter: 0.19, segments: 64 },
    scene,
  );
  const corePlanetBeta = BABYLON.MeshBuilder.CreateSphere(
    "corePlanetBeta",
    { diameter: 1.12, segments: 64 },
    scene,
  );
  const coreMoon1PlaneteBeta = BABYLON.MeshBuilder.CreateSphere(
    "coreMoon1PlanetBeta",
    { diameter: 0.26, segments: 64 },
    scene,
  );
  const coreMoon2PlanetBeta = BABYLON.MeshBuilder.CreateSphere(
    "coreMoon2PlanetBeta",
    { diameter: 0.16, segments: 64 },
    scene,
  );

  const cloudsSphere = BABYLON.MeshBuilder.CreateSphere(
    "clouds",
    {
      diameter: 0.755,
      segments: 64,
    },
    scene,
  );
  cloudsSphere.parent = corePlanetAlpha;

  const cloudsMaterial = new BABYLON.StandardMaterial("cloudsMaterial", scene);
  cloudsMaterial.diffuseTexture = new BABYLON.Texture(
    "earth_clouds_texture.jpg",
    scene,
  );
  cloudsMaterial.diffuseTexture.hasAlpha = true;
  cloudsMaterial.useAlphaFromDiffuseTexture = true;
  cloudsMaterial.alphaMode = BABYLON.Engine.ALPHA_ADD;
  cloudsMaterial.backFaceCulling = false;
  cloudsMaterial.emissiveColor = new BABYLON.Color3(0.05, 0.05, 0.05);

  cloudsSphere.material = cloudsMaterial;

  // Création des systèmes de particules
  const surfaceParticles = new BABYLON.ParticleSystem(
    "surfaceParticles",
    1600,
    scene,
  );
  const flareParticles = new BABYLON.ParticleSystem(
    "flareParticles",
    20,
    scene,
  );
  const coronaParticles = new BABYLON.ParticleSystem(
    "coronaParticles",
    600,
    scene,
  );
  const starsParticles = new BABYLON.ParticleSystem(
    "starsParticles",
    3000,
    scene,
  );

  // Configuration des textures des particules
  surfaceParticles.particleTexture = new BABYLON.Texture(
    "https://raw.githubusercontent.com/PatrickRyanMS/BabylonJStextures/master/ParticleSystems/Sun/T_SunSurface.png",
    scene,
  );
  flareParticles.particleTexture = new BABYLON.Texture(
    "https://raw.githubusercontent.com/PatrickRyanMS/BabylonJStextures/master/ParticleSystems/Sun/T_SunFlare.png",
    scene,
  );
  coronaParticles.particleTexture = new BABYLON.Texture(
    "https://raw.githubusercontent.com/PatrickRyanMS/BabylonJStextures/master/ParticleSystems/Sun/T_Star.png",
    scene,
  );
  starsParticles.particleTexture = new BABYLON.Texture(
    "https://raw.githubusercontent.com/PatrickRyanMS/BabylonJStextures/master/ParticleSystems/Sun/T_Star.png",
    scene,
  );

  const sunMaterial = new BABYLON.StandardMaterial("sunMaterial", scene);
  sunMaterial.emissiveColor = new BABYLON.Color3(1, 0.7, 0.3);
  sunMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  sunMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

  const planetAlphaMaterial = new BABYLON.StandardMaterial(
    "planetAlphaMaterial",
    scene,
  );
  planetAlphaMaterial.diffuseTexture = createPlanetTexture(
    "textureAlpha",
    "blue",
    "lightblue",
  );
  planetAlphaMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

  const moonMaterial = new BABYLON.StandardMaterial("moonMaterial", scene);
  moonMaterial.diffuseTexture = moonTexture;
  moonMaterial.emissiveColor = new BABYLON.Color3(0.246, 0.241, 0.213);

  // Application des matériaux
  coreSphere.material = sunMaterial;
  corePlanetAlpha.material = earthMaterial;
  coreMoonPlanetAlpha.material = moonMaterial;
  cloudsSphere.material = cloudsMaterial;
  corePlanetBeta.material = planetAlphaMaterial;
  coreMoon1PlaneteBeta.material = moonMaterial;
  coreMoon2PlanetBeta.material = moonMaterial;

  // Configuration de l'ordre de rendu
  scene.setRenderingAutoClearDepthStencil(0, false);
  scene.setRenderingAutoClearDepthStencil(1, false);
  scene.setRenderingAutoClearDepthStencil(2, false);
  scene.setRenderingAutoClearDepthStencil(3, false);

  starsParticles.renderingGroupId = 0;
  coronaParticles.renderingGroupId = 1;
  flareParticles.renderingGroupId = 2;
  surfaceParticles.renderingGroupId = 3;
  coreSphere.renderingGroupId = 3;
  corePlanetAlpha.renderingGroupId = 2;
  cloudsSphere.renderingGroupId = 3;
  coreMoonPlanetAlpha.renderingGroupId = 2;
  corePlanetBeta.renderingGroupId = 2;
  coreMoon1PlaneteBeta.renderingGroupId = 2;
  coreMoon2PlanetBeta.renderingGroupId = 2;

  // Configuration des émetteurs de particules
  const sunEmitter = new BABYLON.SphereParticleEmitter();
  sunEmitter.radius = 1;
  sunEmitter.radiusRange = 0;

  const starsEmitter = new BABYLON.SphereParticleEmitter();
  starsEmitter.radius = 210;
  starsEmitter.radiusRange = 0;

  // Configuration des systèmes de particules
  [surfaceParticles, flareParticles, coronaParticles].forEach((particles) => {
    particles.preWarmStepOffset = 10;
    particles.preWarmCycles = 100;
    particles.minInitialRotation = -2 * Math.PI;
    particles.maxInitialRotation = 2 * Math.PI;
    particles.emitter = coreSphere;
    particles.particleEmitterType = sunEmitter;
    particles.gravity = new BABYLON.Vector3(0, 0, 0);
  });

  starsParticles.emitter = stars;
  starsParticles.particleEmitterType = starsEmitter;

  // Configuration spécifique pour chaque système de particules
  // surfaceParticles
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

  // flareParticles
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

  // coronaParticles
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

  // starsParticles
  starsParticles.color1 = new BABYLON.Color4(0.898, 0.737, 0.718, 1.0);
  starsParticles.color2 = new BABYLON.Color4(0.584, 0.831, 0.894, 1.0);
  starsParticles.minSize = 1.8;
  starsParticles.maxSize = 2.4;
  starsParticles.minLifeTime = 999999;
  starsParticles.maxLifeTime = 999999;
  starsParticles.manualEmitCount = 500;
  starsParticles.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
  starsParticles.gravity = new BABYLON.Vector3(0, 0, 0);
  starsParticles.minAngularSpeed = 0;
  starsParticles.maxAngularSpeed = 0;
  starsParticles.minEmitPower = 0;
  starsParticles.maxEmitPower = 0;
  starsParticles.isBillboardBased = true;

  // Fonction d'animation circulaire inclinée
  const createInclinedCircularAnimation = (
    targetMesh,
    centerMesh,
    radius,
    speed,
    inclinationAngle,
    startAngle,
  ) => {
    let angle = startAngle;
    const rotationMatrix = BABYLON.Matrix.RotationAxis(
      BABYLON.Axis.X,
      BABYLON.Tools.ToRadians(inclinationAngle),
    );

    // Positionner la planète à son point de départ
    const initialPosition = new BABYLON.Vector3(
      radius * Math.cos(startAngle),
      0,
      radius * Math.sin(startAngle),
    );
    const rotatedInitialPosition = BABYLON.Vector3.TransformCoordinates(
      initialPosition,
      rotationMatrix,
    );
    targetMesh.position = centerMesh.position.add(rotatedInitialPosition);

    scene.onBeforeRenderObservable.add(() => {
      if (!isPaused) {
        angle += (speed * scene.getEngine().getDeltaTime()) / 1000;
        const basePosition = new BABYLON.Vector3(
          radius * Math.cos(angle),
          0,
          radius * Math.sin(angle),
        );
        const rotatedPosition = BABYLON.Vector3.TransformCoordinates(
          basePosition,
          rotationMatrix,
        );
        targetMesh.position = centerMesh.position.add(rotatedPosition);
      }
    });
  };

  // Fonction de rotation sur soi-même
  const createSelfRotationAnimation = (
    mesh,
    rotationAxis,
    rotationSpeed,
    inclinationAngle,
  ) => {
    const inclinationRad = BABYLON.Tools.ToRadians(inclinationAngle);
    const inclinationMatrix = BABYLON.Matrix.RotationZ(inclinationRad);
    const inclinedAxis = BABYLON.Vector3.TransformNormal(
      rotationAxis,
      inclinationMatrix,
    );

    scene.onBeforeRenderObservable.add(() => {
      if (!isPaused) {
        mesh.rotate(
          inclinedAxis,
          (rotationSpeed * scene.getEngine().getDeltaTime()) / 1000,
          BABYLON.Space.WORLD,
        );
      }
    });
  };

  // Configuration des animations orbitales
  createInclinedCircularAnimation(earthContainer, coreSphere, 15, 0.025, 0, 0);
  createInclinedCircularAnimation(
    coreMoonPlanetAlpha,
    earthContainer,
    2.5,
    0.2,
    5,
    Math.PI,
  );
  createInclinedCircularAnimation(
    corePlanetBeta,
    coreSphere,
    32,
    0.025,
    -2,
    Math.PI / 2,
  );
  createInclinedCircularAnimation(
    coreMoon1PlaneteBeta,
    corePlanetBeta,
    3.1,
    0.2,
    -45,
    Math.PI,
  );
  createInclinedCircularAnimation(
    coreMoon2PlanetBeta,
    corePlanetBeta,
    1.6,
    0.25,
    25,
    Math.PI / 4,
  );

  // Configuration des rotations sur soi-même
  createSelfRotationAnimation(
    earthContainer,
    new BABYLON.Vector3(0, 1, 0),
    0.025,
    0,
  ); // Rotation de la planète Alpha
  createSelfRotationAnimation(
    corePlanetBeta,
    new BABYLON.Vector3(0, 1, 0),
    0.005,
    3,
  ); // Rotation de la planète Beta
  createSelfRotationAnimation(
    coreSphere,
    new BABYLON.Vector3(0, 1, 0),
    0.001,
    7.25,
  ); // Rotation du soleil

  // Démarrage des systèmes de particules
  surfaceParticles.start();
  flareParticles.start();
  coronaParticles.start();
  starsParticles.start();

  scene.registerBeforeRender(() => {
    cloudsSphere.rotation.y += 0.00001 * scene.getEngine().getDeltaTime();
  });

  sunLight.parent = coreSphere;

  // Variable pour suivre l'état de pause
  let isPaused = false;

  // Ajout d'un gestionnaire d'événements pour la touche espace
  scene.onKeyboardObservable.add((kbInfo) => {
    if (
      kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN &&
      kbInfo.event.key === " "
    ) {
      isPaused = !isPaused;
    }
  });

  return scene;
};
