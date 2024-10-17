import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";

export const createLights = (scene) => {
  const sunLight = new BABYLON.PointLight(
    "sunLight",
    BABYLON.Vector3.Zero(),
    scene,
  );
  sunLight.intensity = 1;
  sunLight.range = 1000;
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

  return { sunLight, ambientLight };
};
