import * as BABYLON from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";
import "@babylonjs/loaders";
import { createUI } from "./ui";
import { createAdvancedCamera } from "./camera";
import { createLights } from "./lighting";
import {
  createMaterials,
  createSaturnRings,
  createUranusRings,
} from "./materials";
import { createParticleSystems } from "./particles";
import { setupAnimations } from "./animations";

export const createScene = (canvas, engine) => {
  const scene = new BABYLON.Scene(engine);
  const { cleanup: uiCleanup, updateContent: updateUIContent } = createUI(
    scene,
    "sun",
  );

  const onFocusChange = (focusedObjectName) => {
    updateUIContent(focusedObjectName);
  };

  // Configuration de la caméra
  // const camera = createCamera(scene, canvas);
  // Configuration des lumières
  const { sunLight, ambientLight } = createLights(scene);

  // Configuration des matériaux
  const {
    earthMaterial,
    moonMaterial,
    jupiterMaterial,
    saturnMaterial,
    sunMaterial,
    marsMaterial,
    mercuryMaterial,
    venusMaterial,
    venusAtmosphereMaterial,
    ioMaterial,
    europaMaterial,
    ganymedeMaterial,
    callistoMaterial,
    uranusMaterial,
    titaniaMaterial,
    mirandaMaterial,
    arielMaterial,
    umbrielMaterial,
    neptuneMaterial,
    tritonMaterial,
  } = createMaterials(scene);
  const stars = BABYLON.MeshBuilder.CreateBox("stars", { size: 0.01 }, scene);
  const sun = BABYLON.MeshBuilder.CreateSphere(
    "sun",
    { diameter: 2.01, segments: 128 },
    scene,
  );
  const mercury = BABYLON.MeshBuilder.CreateSphere(
    "mercury",
    { diameter: 0.01, segments: 128 },
    scene,
  );
  const venus = BABYLON.MeshBuilder.CreateSphere(
    "venus",
    { diameter: 0.01, segments: 128 },
    scene,
  );
  const venusAtmosphere = BABYLON.MeshBuilder.CreateSphere(
    "venusAtmosphere",
    { diameter: 0.0101, segments: 128 },
    scene,
  );
  const earthContainer = new BABYLON.TransformNode("earthContainer");
  const earth = BABYLON.MeshBuilder.CreateSphere(
    "earth",
    { diameter: 0.01, segments: 128 },
    scene,
  );
  const mars = BABYLON.MeshBuilder.CreateSphere(
    "mars",
    { diameter: 0.01, segments: 128 },
    scene,
  );
  const jupiter = BABYLON.MeshBuilder.CreateSphere(
    "jupiter",
    { diameter: 0.01, segments: 128 },
    scene,
  );
  const saturn = BABYLON.MeshBuilder.CreateSphere(
    "saturn",
    { diameter: 0.01, segments: 128 },
    scene,
  );
  const uranus = BABYLON.MeshBuilder.CreateSphere(
    "uranus",
    { diameter: 0.01, segments: 128 },
    scene,
  );
  const neptune = BABYLON.MeshBuilder.CreateSphere(
    "neptune",
    { diameter: 0.01, segments: 128 },
    scene,
  );
  const moon = BABYLON.MeshBuilder.CreateSphere(
    "moon",
    { diameter: 0.01, segments: 128 },
    scene,
  );
  const io = BABYLON.MeshBuilder.CreateSphere(
    "io",
    { diameter: 0.01, segments: 128 },
    scene,
  );
  const europa = BABYLON.MeshBuilder.CreateSphere(
    "europa",
    { diameter: 0.01, segments: 128 },
    scene,
  );
  const ganymede = BABYLON.MeshBuilder.CreateSphere(
    "ganymede",
    { diameter: 0.01, segments: 128 },
    scene,
  );
  const callisto = BABYLON.MeshBuilder.CreateSphere(
    "callisto",
    { diameter: 0.01, segments: 128 },
    scene,
  );
  const titania = BABYLON.MeshBuilder.CreateSphere(
    "titania",
    { diameter: 0.01, segments: 128 },
    scene,
  );
  const miranda = BABYLON.MeshBuilder.CreateSphere(
    "miranda",
    { diameter: 0.01, segments: 128 },
    scene,
  );
  const ariel = BABYLON.MeshBuilder.CreateSphere(
    "ariel",
    { diameter: 0.01, segments: 128 },
    scene,
  );
  const umbriel = BABYLON.MeshBuilder.CreateSphere(
    "umbriel",
    { diameter: 0.01, segments: 128 },
    scene,
  );
  const triton = BABYLON.MeshBuilder.CreateSphere(
    "triton",
    { diameter: 0.01, segments: 128 },
    scene,
  );

  const saturnRings = createSaturnRings(scene, saturn);
  const uranusRings = createUranusRings(scene, uranus);

  venusAtmosphere.parent = venus;

  const clickableObjects = [
    sun,
    earth,
    moon,
    mercury,
    mars,
    venus,
    venusAtmosphere,
    jupiter,
    io,
    ganymede,
    callisto,
    europa,
    saturn,
    uranus,
    titania,
    miranda,
    ariel,
    umbriel,
    neptune,
    triton,
  ];
  clickableObjects.forEach((object) => {
    object.actionManager = new BABYLON.ActionManager(scene);

    object.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPointerOverTrigger,
        function (ev) {
          scene.hoverCursor = "pointer";
        },
      ),
    );

    object.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPointerOutTrigger,
        function (ev) {
          scene.hoverCursor = "default";
        },
      ),
    );
  });

  const { camera, focusOnObject } = createAdvancedCamera(
    scene,
    canvas,
    sun,
    clickableObjects,
    onFocusChange,
  );
  camera.minZ = 0.1; // Réduit la distance minimale de rendu
  camera.maxZ = 10000; // Augmente la distance maximale de rendu

  const createPlanetLabel = (mesh, name) => {
    const label = BABYLON.MeshBuilder.CreatePlane(
      "label_" + name,
      { width: 2, height: 0.5 },
      scene,
    );
    label.parent = mesh;

    // Positionner le label au-dessus de la planète
    const radius = mesh.getBoundingInfo().boundingSphere.radius;
    label.position.y = radius + 0.5;

    // Faire en sorte que le label soit toujours face à la caméra
    label.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;

    const texture = GUI.AdvancedDynamicTexture.CreateForMesh(label, 512, 128);
    const text = new GUI.TextBlock();
    text.text = name;
    text.color = "white";
    text.fontSize = 90;
    label.textBlock = text;
    text.fontFamily = "Orbitron, Arial, sans-serif";
    text.fontWeight = 700;
    texture.addControl(text);

    // Rendre le label cliquable
    label.isPickable = true;

    return label;
  };
  // setupEarthCameraLock(scene, camera, earth, sun);

  // Créer une skybox
  const skybox = BABYLON.MeshBuilder.CreateBox(
    "skyBox",
    { size: 5000.0 },
    scene,
  );

  // Créer un matériau pour la skybox
  const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.disableLighting = true;

  // Utiliser la même texture que celle qui fonctionne sur le plan
  skyboxMaterial.reflectionTexture = new BABYLON.Texture(
    "/stars_texture.jpg",
    scene,
  );
  skyboxMaterial.reflectionTexture.coordinatesMode =
    BABYLON.Texture.FIXED_EQUIRECTANGULAR_MODE;

  // Autres propriétés du matériau pour s'assurer que la skybox est bien visible
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

  // Appliquer le matériau à la skybox
  skybox.material = skyboxMaterial;

  skybox.infiniteDistance = true;

  earth.parent = earthContainer;
  earthContainer.rotation.x = BABYLON.Tools.ToRadians(23.5);

  // const cloudsSphere = BABYLON.MeshBuilder.CreateSphere("clouds", { diameter: 0.755, segments: 64, }, scene);
  // cloudsSphere.parent = earth;

  // Application des matériaux
  sun.material = sunMaterial;
  earth.material = earthMaterial;
  moon.material = moonMaterial;
  // cloudsSphere.material = cloudsMaterial;
  mars.material = marsMaterial;
  mercury.material = mercuryMaterial;
  venus.material = venusMaterial;
  venusAtmosphere.material = venusAtmosphereMaterial;
  jupiter.material = jupiterMaterial;
  io.material = ioMaterial;
  europa.material = europaMaterial;
  ganymede.material = ganymedeMaterial;
  callisto.material = callistoMaterial;
  saturn.material = saturnMaterial;
  uranus.material = uranusMaterial;
  titania.material = titaniaMaterial;
  miranda.material = mirandaMaterial;
  ariel.material = arielMaterial;
  umbriel.material = umbrielMaterial;
  neptune.material = neptuneMaterial;
  triton.material = tritonMaterial;

  const labels = [
    { mesh: sun, label: createPlanetLabel(sun, "Sun"), isMoon: false },
    { mesh: earth, label: createPlanetLabel(earth, "Earth"), isMoon: false },
    {
      mesh: moon,
      label: createPlanetLabel(moon, "Moon"),
      isMoon: true,
      parent: earth,
    },
    { mesh: mars, label: createPlanetLabel(mars, "Mars"), isMoon: false },
    {
      mesh: mercury,
      label: createPlanetLabel(mercury, "Mercury"),
      isMoon: false,
    },
    { mesh: venus, label: createPlanetLabel(venus, "Venus"), isMoon: false },
    {
      mesh: jupiter,
      label: createPlanetLabel(jupiter, "Jupiter"),
      isMoon: false,
    },
    {
      mesh: io,
      label: createPlanetLabel(io, "Io"),
      isMoon: true,
      parent: jupiter,
    },
    {
      mesh: europa,
      label: createPlanetLabel(europa, "Europa"),
      isMoon: true,
      parent: jupiter,
    },
    {
      mesh: ganymede,
      label: createPlanetLabel(ganymede, "Ganymede"),
      isMoon: true,
      parent: jupiter,
    },
    {
      mesh: callisto,
      label: createPlanetLabel(callisto, "Callisto"),
      isMoon: true,
      parent: jupiter,
    },
    { mesh: saturn, label: createPlanetLabel(saturn, "Saturn"), isMoon: false },
    { mesh: uranus, label: createPlanetLabel(uranus, "Uranus"), isMoon: false },
    {
      mesh: titania,
      label: createPlanetLabel(titania, "Titania"),
      isMoon: true,
      parent: uranus,
    },
    {
      mesh: miranda,
      label: createPlanetLabel(miranda, "Miranda"),
      isMoon: true,
      parent: uranus,
    },
    {
      mesh: ariel,
      label: createPlanetLabel(ariel, "Ariel"),
      isMoon: true,
      parent: uranus,
    },
    {
      mesh: umbriel,
      label: createPlanetLabel(umbriel, "Umbriel"),
      isMoon: true,
      parent: uranus,
    },
    {
      mesh: neptune,
      label: createPlanetLabel(neptune, "Neptune"),
      isMoon: false,
    },
    {
      mesh: triton,
      label: createPlanetLabel(triton, "Triton"),
      isMoon: true,
      parent: neptune,
    },
  ];

  const updateLabels = () => {
    labels.forEach(({ mesh, label, isMoon, parent }) => {
      const distance = BABYLON.Vector3.Distance(
        scene.activeCamera.position,
        mesh.getAbsolutePosition(),
      );
      let opacity = 1;

      if (isMoon) {
        const distanceToParent = BABYLON.Vector3.Distance(
          scene.activeCamera.position,
          parent.getAbsolutePosition(),
        );
        const fadeStartDistance = 25; // Distance à laquelle le label de la lune commence à apparaître
        const fadeEndDistance = 10; // Distance à laquelle le label de la lune est complètement visible

        if (distanceToParent > fadeStartDistance) {
          opacity = 0;
        } else if (distanceToParent > fadeEndDistance) {
          opacity =
            (fadeStartDistance - distanceToParent) /
            (fadeStartDistance - fadeEndDistance);
        }

        // Trouver l'animation d'orbite correspondante et ajuster son opacité
        const orbitAnimation = orbitAnimations.find(
          (oa) => oa.targetMesh === mesh,
        );
        if (orbitAnimation && orbitAnimation.orbitTrail) {
          orbitAnimation.orbitTrail.alpha = opacity * 0.2; // 0.2 est l'opacité maximale des orbites
        }
      } else {
        // Logique existante pour les planètes
        const fadeStartDistance = 10;
        const fadeEndDistance = 5;

        if (distance < fadeStartDistance) {
          opacity =
            (distance - fadeEndDistance) /
            (fadeStartDistance - fadeEndDistance);
        }
      }

      opacity = Math.max(0, Math.min(1, opacity));

      // Ajuster la taille du label
      const scaleFactor = Math.max(distance / 25, 1);
      label.scaling.setAll(scaleFactor);

      // Appliquer l'opacité au texte du label
      if (label.textBlock) {
        label.textBlock.alpha = opacity;
      }

      // Rendre le label visible ou invisible
      label.setEnabled(opacity > 0);
    });
  };

  // Configuration de l'ordre de rendu
  scene.setRenderingAutoClearDepthStencil(0, false);
  scene.setRenderingAutoClearDepthStencil(1, false);
  scene.setRenderingAutoClearDepthStencil(2, false);
  scene.setRenderingAutoClearDepthStencil(3, false);

  // Configuration des systèmes de particules
  const { surfaceParticles, flareParticles, coronaParticles, starsParticles } =
    createParticleSystems(scene, sun, stars);

  skybox.renderingGroupId = 0;
  starsParticles.renderingGroupId = 0;
  coronaParticles.renderingGroupId = 1;
  flareParticles.renderingGroupId = 2;
  surfaceParticles.renderingGroupId = 3;

  sun.renderingGroupId = 3;
  earth.renderingGroupId = 2;
  // cloudsSphere.renderingGroupId = 3;
  moon.renderingGroupId = 2;
  mars.renderingGroupId = 2;
  mercury.renderingGroupId = 2;
  jupiter.renderingGroupId = 2;
  io.renderingGroupId = 2;
  europa.renderingGroupId = 2;
  ganymede.renderingGroupId = 2;
  callisto.renderingGroupId = 2;
  venus.renderingGroupId = 2;
  venusAtmosphere.renderingGroupId = 2;
  saturn.renderingGroupId = 2;
  saturnRings.renderingGroupId = 2;
  uranus.renderingGroupId = 2;
  uranusRings.renderingGroupId = 2;
  titania.renderingGroupId = 2;
  miranda.renderingGroupId = 2;
  ariel.renderingGroupId = 2;
  umbriel.renderingGroupId = 2;
  neptune.renderingGroupId = 2;
  triton.renderingGroupId = 2;

  // Configuration des animations
  const {
    createInclinedCircularAnimation,
    createSelfRotationAnimation,
    createSynchronizedMoonRotation,
    togglePause,
  } = setupAnimations(scene);

  createSynchronizedMoonRotation(moon, earthContainer, 0.2);

  // Configuration des animations orbitales
  const orbitAnimations = [
    createInclinedCircularAnimation(
      mercury,
      sun,
      10,
      0.0001,
      0,
      (5 * Math.PI) / 3,
      false,
    ),
    createInclinedCircularAnimation(
      venus,
      sun,
      20,
      0.0001,
      3.39,
      (2 * Math.PI) / 3,
      false,
    ),
    createInclinedCircularAnimation(
      earthContainer,
      sun,
      30,
      0.0001,
      0,
      (7 * Math.PI) / 6,
      false,
    ),
    createInclinedCircularAnimation(
      mars,
      sun,
      45,
      0.0001,
      0,
      (4 * Math.PI) / 3,
      false,
    ),
    createInclinedCircularAnimation(
      jupiter,
      sun,
      151,
      0.0001,
      0,
      (3 * Math.PI) / 2,
      false,
    ),
    createInclinedCircularAnimation(
      saturn,
      sun,
      290,
      0.0001,
      0,
      (7 * Math.PI) / 6,
      false,
    ),
    createInclinedCircularAnimation(
      uranus,
      sun,
      586,
      0.0001,
      0,
      (4 * Math.PI) / 3,
      false,
    ),
    createInclinedCircularAnimation(
      neptune,
      sun,
      894,
      0.0001,
      0,
      (5 * Math.PI) / 4,
      false,
    ),

    createInclinedCircularAnimation(
      moon,
      earthContainer,
      5,
      0.2,
      5,
      Math.PI,
      true,
    ),
    createInclinedCircularAnimation(io, jupiter, 0.4, 0.04, 10, Math.PI, true),
    createInclinedCircularAnimation(
      europa,
      jupiter,
      0.7,
      0.02,
      10,
      Math.PI / 2,
      true,
    ),
    createInclinedCircularAnimation(
      ganymede,
      jupiter,
      0.9,
      0.02,
      10,
      -Math.PI / 2,
      true,
    ),
    createInclinedCircularAnimation(
      callisto,
      jupiter,
      1.2,
      0.018,
      8,
      Math.PI / 4,
      true,
    ),
    createInclinedCircularAnimation(
      titania,
      uranus,
      3.4,
      0.18,
      8,
      Math.PI / 4,
      true,
    ),
    createInclinedCircularAnimation(
      miranda,
      uranus,
      1.2,
      0.3,
      8,
      Math.PI / 4,
      true,
    ),
    createInclinedCircularAnimation(
      ariel,
      uranus,
      1.9,
      0.21,
      8,
      Math.PI / 4,
      true,
    ),
    createInclinedCircularAnimation(
      umbriel,
      uranus,
      2.5,
      0.19,
      8,
      Math.PI / 4,
      true,
    ),
    createInclinedCircularAnimation(
      triton,
      neptune,
      2.5,
      0.19,
      8,
      Math.PI / 4,
      true,
    ),
  ];

  createSelfRotationAnimation(
    earthContainer,
    new BABYLON.Vector3(0, 1, 0),
    0.001,
    0,
  );
  createSelfRotationAnimation(sun, new BABYLON.Vector3(0, 1, 0), 0.001, 7.25);
  createSelfRotationAnimation(mars, new BABYLON.Vector3(0, 1, 0), 0.001, 0);
  createSelfRotationAnimation(
    mercury,
    new BABYLON.Vector3(0, 1, 0),
    0.001,
    0.034,
  );
  createSelfRotationAnimation(
    venus,
    new BABYLON.Vector3(0, 1, 0),
    0.001,
    177.3,
  );
  createSelfRotationAnimation(jupiter, new BABYLON.Vector3(0, 1, 0), 0.001, 0);
  createSelfRotationAnimation(saturn, new BABYLON.Vector3(0, 1, 0), 0.001, 0);
  createSelfRotationAnimation(uranus, new BABYLON.Vector3(0, 1, 0), 0.001, 0);
  createSelfRotationAnimation(neptune, new BABYLON.Vector3(0, 1, 0), 0.001, 0);

  // Démarrage des systèmes de particules
  surfaceParticles.start();
  flareParticles.start();
  coronaParticles.start();
  // starsParticles.start();

  scene.registerBeforeRender(() => {
    venusAtmosphere.rotation.y += 0.0001 * scene.getEngine().getDeltaTime();

    // Calculer la direction du soleil dans l'espace monde
    const sunWorldPosition = sun.getAbsolutePosition();
    const earthWorldPosition = earth.getAbsolutePosition();
    const sunDirectionW = BABYLON.Vector3.Normalize(
      sunWorldPosition.subtract(earthWorldPosition),
    );

    // Passer la direction du soleil au shader dans l'espace monde
    earthMaterial.setVector3("sunDirectionW", sunDirectionW);
    earthMaterial.setVector3("cameraPositionW", scene.activeCamera.position);

    // Mettre à jour la matrice world inverse transpose pour le calcul correct des normales
    const worldInverseTranspose = BABYLON.Matrix.Transpose(
      earth.getWorldMatrix().clone().invert(),
    );
    earthMaterial.setMatrix("worldInverseTranspose", worldInverseTranspose);

    const marsWorldPosition = mars.getAbsolutePosition();
    const sunDirectionWForMars = BABYLON.Vector3.Normalize(
      sunWorldPosition.subtract(marsWorldPosition),
    );

    // Mise à jour des paramètres du shader de Mars
    marsMaterial.setVector3("sunDirectionW", sunDirectionWForMars);
    marsMaterial.setVector3("cameraPositionW", scene.activeCamera.position);
  });

  sunLight.parent = sun;

  // Ajouter le nettoyage de l'UI à la disposition de la scène
  scene.onDisposeObservable.add(() => {
    uiCleanup();
  });

  // Ajout d'un gestionnaire d'événements pour la touche espace
  scene.onKeyboardObservable.add((kbInfo) => {
    if (
      kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN &&
      kbInfo.event.key === " "
    ) {
      togglePause();
    }
  });

  scene.onBeforeRenderObservable.add(updateLabels);

  // Gérer les interactions avec les labels
  scene.onPointerObservable.add((pointerInfo) => {
    switch (pointerInfo.type) {
      case BABYLON.PointerEventTypes.POINTERDOWN:
        if (pointerInfo.pickInfo.hit) {
          const pickedMesh = pointerInfo.pickInfo.pickedMesh;
          const labelInfo = labels.find((l) => l.label === pickedMesh);
          if (labelInfo) {
            const orbitAnimation = orbitAnimations.find(
              (oa) => oa.targetMesh === labelInfo.mesh,
            );
            focusOnObject(
              labelInfo.mesh,
              orbitAnimation ? orbitAnimation.orbitTrail : null,
            );
          }
        }
        break;
      case BABYLON.PointerEventTypes.POINTERMOVE:
        if (pointerInfo.pickInfo.hit) {
          const pickedMesh = pointerInfo.pickInfo.pickedMesh;
          if (
            labels.includes(pickedMesh) ||
            clickableObjects.includes(pickedMesh)
          ) {
            canvas.style.cursor = "pointer";
          } else {
            canvas.style.cursor = "default";
          }
        } else {
          canvas.style.cursor = "default";
        }
        break;
    }
  });

  return scene;
};
