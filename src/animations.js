import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";

export const setupAnimations = (scene) => {
  let isPaused = false;

  const ORBIT_COLOR = new BABYLON.Color3(1, 1, 1); // Blanc

  const createOrbitTrail = (centerMesh, radius, inclinationAngle, isMoon = false) => {
    const points = [];
    for (let i = 0; i <= 360; i++) {
      const angle = (i * Math.PI) / 180;
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      points.push(new BABYLON.Vector3(x, 0, z));
    }

    const orbitTrail = BABYLON.MeshBuilder.CreateLines("orbitTrail", {
      points: points,
      updatable: false
    }, scene);

    orbitTrail.color = ORBIT_COLOR;
    orbitTrail.alpha = isMoon ? 0 : 0.2; // Les orbites des lunes sont initialement invisibles

    const rotationMatrix = BABYLON.Matrix.RotationAxis(
      BABYLON.Axis.X,
      BABYLON.Tools.ToRadians(inclinationAngle)
    );

    if (isMoon) {
      orbitTrail.parent = centerMesh; // Attacher l'orbite de la lune à la planète
      orbitTrail.position = BABYLON.Vector3.Zero(); // L'orbite est centrée sur la planète
    } else {
      orbitTrail.position = centerMesh.position.clone();
    }

    orbitTrail.rotationQuaternion = BABYLON.Quaternion.FromRotationMatrix(rotationMatrix);

    orbitTrail.renderingGroupId = 1;

    return orbitTrail;
  };

  const createInclinedCircularAnimation = (
    targetMesh,
    centerMesh,
    radius,
    speed,
    inclinationAngle,
    startAngle,
    isMoon = false
  ) => {
    let angle = startAngle;
    const rotationMatrix = BABYLON.Matrix.RotationAxis(
      BABYLON.Axis.X,
      BABYLON.Tools.ToRadians(inclinationAngle),
    );

    const orbitTrail = createOrbitTrail(centerMesh, radius, inclinationAngle, isMoon);

    const initialPosition = new BABYLON.Vector3(
      radius * Math.cos(startAngle),
      0,
      radius * Math.sin(startAngle),
    );
    const rotatedInitialPosition = BABYLON.Vector3.TransformCoordinates(
      initialPosition,
      rotationMatrix,
    );

    if (isMoon) {
      targetMesh.position = rotatedInitialPosition;
      targetMesh.parent = centerMesh;
    } else {
      targetMesh.position = centerMesh.position.add(rotatedInitialPosition);
    }

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
        if (isMoon) {
          targetMesh.position = rotatedPosition;
        } else {
          targetMesh.position = centerMesh.position.add(rotatedPosition);
        }
      }
    });

    return { orbitTrail, targetMesh, isMoon };
  };

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

  const createSynchronizedMoonRotation = (moon, earth, orbitSpeed) => {
    scene.onBeforeRenderObservable.add(() => {
      if (!isPaused) {
        // La vitesse de rotation est l'opposé de la vitesse orbitale
        const rotationAngle =
          (-orbitSpeed * scene.getEngine().getDeltaTime()) / 1000;

        // Rotation de la Lune autour de son axe Y local
        moon.rotate(BABYLON.Axis.Y, rotationAngle, BABYLON.Space.LOCAL);
      }
    });
  };

  const togglePause = () => {
    isPaused = !isPaused;
  };

  return {
    createInclinedCircularAnimation,
    createSelfRotationAnimation,
    createSynchronizedMoonRotation,
    togglePause,
  };
};
