import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";

export const createAdvancedCamera = (scene, canvas, sun, clickableObjects, onFocusChange) => {
  let currentTarget = sun;
  let currentOrbitTrail = null;
  let isTransitioning = false;
  const BASE_PLANET_SIZE = 0.01;
  const FOCUSED_PLANET_SIZE = 0.1;
  const ZOOM_THRESHOLD = 10;
  const SCALING_START_DISTANCE = 50;

  let lastLogTime = 0;
  const logInterval = 500;

  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    -Math.PI / 2,
    Math.PI / 2,
    50,
    sun.position,
    scene
  );
  camera.attachControl(canvas, true);
  camera.panningSensibility = 0;
  camera.lowerRadiusLimit = 0.001;
  camera.upperRadiusLimit = 2000;
  camera.lowerBetaLimit = 0.01;
  camera.upperBetaLimit = Math.PI - 0.1;
  camera.wheelPrecision = 20;
  camera.angularSensibilityX = 500;
  camera.angularSensibilityY = 500;
  camera.keysUp = camera.keysDown = camera.keysLeft = camera.keysRight = [];

  camera.minZ = 0.1;
  camera.maxZ = 10000;

  const focusOnObject = (targetMesh, orbitTrail) => {
    if (isTransitioning || targetMesh === currentTarget) return;

    isTransitioning = true;
    currentTarget = targetMesh;

    if (currentTarget !== sun) {
      resetObjectScale(currentTarget);
    }

    // Réinitialiser l'opacité de l'ancien orbitTrail
    if (currentOrbitTrail) {
      currentOrbitTrail.alpha = 0.2;
    }

    currentOrbitTrail = orbitTrail;

    const startPosition = camera.position.clone();
    const startTarget = camera.target.clone();
    const endPosition = targetMesh.getAbsolutePosition();
    const startScale = targetMesh.scaling.x;

    let alpha = 0;
    const transitionObserver = scene.onBeforeRenderObservable.add(() => {
      alpha += 0.02;
      if (alpha >= 1) {
        finalizeTransition(targetMesh, endPosition);
        scene.onBeforeRenderObservable.remove(transitionObserver);
        return;
      }

      const currentPosition = BABYLON.Vector3.Lerp(startPosition, endPosition.add(new BABYLON.Vector3(0, 0, ZOOM_THRESHOLD)), easeInOutCubic(alpha));
      const currentTarget = BABYLON.Vector3.Lerp(startTarget, endPosition, easeInOutCubic(alpha));
      camera.setPosition(currentPosition);
      camera.setTarget(currentTarget);

      if (camera.radius <= SCALING_START_DISTANCE && targetMesh !== sun) {
        const scaleRatio = calculateScaleRatio(camera.radius);
        targetMesh.scaling = new BABYLON.Vector3(scaleRatio, scaleRatio, scaleRatio).scale(startScale);
      }

      adjustWheelPrecision();
    });
    onFocusChange(targetMesh.name.toLowerCase());
  };

  const adjustOrbitTrailOpacity = () => {
    if (currentOrbitTrail && currentTarget !== sun) {
      const distance = BABYLON.Vector3.Distance(camera.position, currentTarget.position);
      const fadeStartDistance = 20; // Commencer à faire disparaître à cette distance
      const fadeEndDistance = 5;   // Complètement invisible à cette distance

      if (distance < fadeStartDistance) {
        const opacity = (distance - fadeEndDistance) / (fadeStartDistance - fadeEndDistance);
        currentOrbitTrail.alpha = Math.max(0, Math.min(0.2, opacity * 0.2)); // 0.2 est l'opacité maximale
      } else {
        currentOrbitTrail.alpha = 0.2;
      }
    }
  };

  const finalizeTransition = (targetMesh, endPosition) => {
    camera.setTarget(endPosition);
    currentTarget = targetMesh;
    adjustCameraForTarget(targetMesh);
    isTransitioning = false;
  };

  const adjustWheelPrecision = () => {
    let targetPosition;
    if (currentTarget.parent && currentTarget.parent !== scene) {
      // Si l'objet a un parent (comme une lune), utiliser la position absolue
      targetPosition = currentTarget.getAbsolutePosition();
    } else {
      // Sinon, utiliser la position normale
      targetPosition = currentTarget.position;
    }

    const distance = BABYLON.Vector3.Distance(camera.position, targetPosition);

    if (distance <= 10) {
      camera.wheelPrecision = 50;
    } else if (distance <= 50) {
      camera.wheelPrecision = 10;
    } else {
      camera.wheelPrecision = 1;
    }

  };

  const adjustCameraForTarget = (targetMesh) => {
    if (targetMesh === sun) {
      camera.lowerRadiusLimit = 5;
      camera.upperRadiusLimit = 2000;
      camera.radius = 50;
    } else {
      camera.lowerRadiusLimit = 0.2;
      camera.upperRadiusLimit = 2000;
      camera.radius = 0.2;
    }
    adjustWheelPrecision();
  };

  const easeInOutCubic = (t) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const exponentialEaseIn = (t) => {
    return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
  };

  const resetObjectScale = (obj) => {
    if (obj !== sun) {
      console.log('reset scale 2', obj)
      obj.scaling = new BABYLON.Vector3(1, 1, 1);
    }
  };

  const calculateScaleRatio = (radius) => {
    if (radius >= SCALING_START_DISTANCE) return 1;
    if (radius <= ZOOM_THRESHOLD) return FOCUSED_PLANET_SIZE / BASE_PLANET_SIZE;

    const t = (SCALING_START_DISTANCE - radius) / (SCALING_START_DISTANCE - ZOOM_THRESHOLD);
    const easedT = exponentialEaseIn(t);
    return 1 + (FOCUSED_PLANET_SIZE / BASE_PLANET_SIZE - 1) * easedT;
  };

  scene.onPointerObservable.add((pointerInfo) => {
    if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERPICK) {
      const mesh = pointerInfo.pickInfo.pickedMesh;
      if (mesh && clickableObjects.includes(mesh)) {
        focusOnObject(mesh);
      }
    }
  });

  scene.onKeyboardObservable.add((kbInfo) => {
    if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN && kbInfo.event.key === "Escape") {
      if (currentTarget !== sun) {
        resetPlanetScales();
        focusOnObject(sun);
      }
    }
  });

  const resetPlanetScales = () => {
    clickableObjects.forEach(obj => {
      if (obj !== sun) {
        console.log('reset scale')
        resetObjectScale(obj);
      }
    });
  };

  scene.onBeforeRenderObservable.add(() => {
    if (!isTransitioning && currentTarget !== sun) {
      const scaleRatio = calculateScaleRatio(camera.radius);
      currentTarget.scaling = new BABYLON.Vector3(scaleRatio, scaleRatio, scaleRatio);
    }
    if (!isTransitioning) {
      adjustWheelPrecision();
    }
    adjustOrbitTrailOpacity();
  });

  return { camera, focusOnObject };
};