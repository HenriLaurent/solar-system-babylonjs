import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";

export const createMaterials = (scene) => {

  // Pour chaque matériau de planète, ajoutez ces lignes :
  const configureMaterial = (material) => {
    material.needDepthPrePass = true;
    material.backFaceCulling = true;
    material.twoSidedLighting = false;
  };
  // Sun Material
  const sunMaterial = new BABYLON.StandardMaterial("sunMaterial", scene);
  sunMaterial.emissiveColor = new BABYLON.Color3(1, 0.7, 0.3);
  sunMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  sunMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

  // Earth Material
  const earthTexture = new BABYLON.Texture("/earth_day_texture.jpg");
  const earthTextureNight = new BABYLON.Texture("/earth_night_texture.jpg");
  const earthNormalTexture = new BABYLON.Texture(
    "/earth_normal_texture.jpg",
    scene,
  );
  const earthSpecularTexture = new BABYLON.Texture(
    "/earth_specular_texture.jpg",
    scene,
  );

  // Earth Shaders
  const earthMaterial = new BABYLON.ShaderMaterial(
    "earthMaterial",
    scene,
    {
      vertex: "custom",
      fragment: "custom",
    },
    {
      attributes: ["position", "normal", "uv"],
      uniforms: [
        "world",
        "worldView",
        "worldViewProjection",
        "view",
        "projection",
        "sunDirection",
        "cameraPosition",
      ],
      samplers: [
        "dayTexture",
        "nightTexture",
        "cloudsTexture",
        "specularMapTexture",
        "bumpTexture",
      ],
    },
  );

  BABYLON.Effect.ShadersStore["customVertexShader"] = `
    precision highp float;
    attribute vec3 position;
    attribute vec3 normal;
    attribute vec2 uv;
    uniform mat4 world;
    uniform mat4 worldViewProjection;
    uniform mat4 worldInverseTranspose;
    varying vec3 vPositionW;
    varying vec3 vNormalW;
    varying vec2 vUV;
    void main() {
        vec4 outPosition = worldViewProjection * vec4(position, 1.0);
        gl_Position = outPosition;
        vPositionW = vec3(world * vec4(position, 1.0));
        vNormalW = normalize(vec3(worldInverseTranspose * vec4(normal, 0.0)));
        vUV = vec2(1.0 - uv.x, 1.0 - uv.y); // Correction de l'inversion des textures
    }
  `;

  BABYLON.Effect.ShadersStore["customFragmentShader"] = `
precision highp float;
uniform sampler2D dayTexture;
uniform sampler2D nightTexture;
uniform sampler2D cloudsTexture;
uniform sampler2D specularMapTexture;
uniform sampler2D bumpTexture;
uniform vec3 sunDirectionW;
uniform vec3 cameraPositionW;
varying vec3 vPositionW;
varying vec3 vNormalW;
varying vec2 vUV;

void main() {
    vec3 viewDirectionW = normalize(cameraPositionW - vPositionW);
    vec3 normal = normalize(vNormalW);

    // Bump mapping
    vec3 bumpNormal = texture2D(bumpTexture, vUV).rgb * 2.0 - 1.0;
    normal = normalize(normal + bumpNormal * 0.1);

    float NdotL = dot(normal, sunDirectionW);
    float dayNightFactor = smoothstep(-0.1, 0.1, NdotL);

    vec3 dayColor = texture2D(dayTexture, vUV).rgb;
    vec3 nightColor = texture2D(nightTexture, vUV).rgb * 0.3;
    vec3 cloudsColor = texture2D(cloudsTexture, vUV).rgb;
    float specularIntensity = texture2D(specularMapTexture, vUV).r;

    // Mélange jour/nuit avec nuages
    vec3 baseColor = mix(nightColor, dayColor, dayNightFactor);
    baseColor = mix(baseColor, cloudsColor, cloudsColor.r * dayNightFactor);

    // Spécularité des océans
    vec3 reflectionDirection = reflect(-sunDirectionW, normal);
    float specularFactor = pow(max(0.0, dot(viewDirectionW, reflectionDirection)), 32.0);
    specularFactor *= specularIntensity * max(0.0, NdotL);

    // Effet d'atmosphère amélioré
    float fresnel = pow(1.0 - max(0.0, dot(normal, viewDirectionW)), 4.0); // Augmenté de 3.0 à 4.0
    vec3 atmosphereColor = vec3(0.3, 0.6, 1.0) * fresnel * max(0.4, dayNightFactor); // Augmenté de 0.2 à 0.4
    float atmosphereIntensity = 0.5; // Nouveau paramètre pour contrôler l'intensité globale de l'atmosphère

    // Couleur finale avec atmosphère plus prononcée
    vec3 finalColor = baseColor + specularFactor * 0.3 + atmosphereColor * atmosphereIntensity;

    // Ajustement final de la luminosité avec une transition plus douce
    finalColor = mix(nightColor, finalColor, smoothstep(-0.3, 0.3, NdotL)); // Élargi de -0.2, 0.2 à -0.3, 0.3

    // Ajout d'un léger halo atmosphérique au limbe de la planète
    float limb = pow(1.0 - max(0.0, dot(normal, viewDirectionW)), 8.0);
    finalColor += vec3(0.3, 0.6, 1.0) * limb * 0.3;

    gl_FragColor = vec4(finalColor, 1.0);
}
`;

  const cloudsTexture = new BABYLON.Texture("/earth_clouds_texture.jpg", scene);
  cloudsTexture.vScale = -1;
  cloudsTexture.uScale = -1;

  // Charger et assigner les textures
  earthMaterial.setTexture("dayTexture", earthTexture);
  earthMaterial.setTexture("nightTexture", earthTextureNight);
  earthMaterial.setTexture("cloudsTexture", cloudsTexture);
  earthMaterial.setTexture("specularMapTexture", earthSpecularTexture);
  earthMaterial.setTexture("bumpTexture", earthNormalTexture);

  // Moon Material
  const moonMaterial = new BABYLON.StandardMaterial("moonMaterial", scene);
  moonMaterial.diffuseTexture = new BABYLON.Texture("/moon_texture.jpg", scene);

  // Mercury Material
  const mercuryTexture = new BABYLON.Texture("/mercury_texture.jpg", scene);

  const mercuryMaterial = new BABYLON.StandardMaterial("mercuryMaterial", scene);
  mercuryMaterial.diffuseTexture = mercuryTexture;

  // Venus Material
  const venusTexture = new BABYLON.Texture("/venus_surface_texture.jpg", scene);
  venusTexture.vScale = -1;
  venusTexture.uScale = -1;

  const venusMaterial = new BABYLON.StandardMaterial("venusMaterial", scene);
  venusMaterial.diffuseTexture = venusTexture;

  const venusAtmosphereTexture = new BABYLON.Texture(
    "/venus_atmosphere_texture.jpg",
    scene,
  );
  venusAtmosphereTexture.vScale = -1;
  venusAtmosphereTexture.uScale = -1;

  const venusAtmosphereMaterial = new BABYLON.StandardMaterial(
    "venusAtmosphereMaterial",
    scene,
  );
  venusAtmosphereMaterial.diffuseTexture = venusAtmosphereTexture;
  venusAtmosphereMaterial.diffuseTexture.hasAlpha = true;
  venusAtmosphereMaterial.useAlphaFromDiffuseTexture = true;
  venusAtmosphereMaterial.alpha = 0.95; // Ajustez selon l'opacité désirée
  venusAtmosphereMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  venusAtmosphereMaterial.backFaceCulling = false;

  const jupiterTexture = new BABYLON.Texture("/jupiter_texture.jpg", scene);
  jupiterTexture.vScale = -1;
  jupiterTexture.uScale = -1;

  const jupiterMaterial = new BABYLON.StandardMaterial(
    "jupiterMaterial",
    scene,
  );
  jupiterMaterial.diffuseTexture = jupiterTexture;

  const ioTexture = new BABYLON.Texture("/io_texture.jpg", scene);
  ioTexture.vScale = -1;
  ioTexture.uScale = -1;

  const ioMaterial = new BABYLON.StandardMaterial("ioMaterial", scene);
  ioMaterial.diffuseTexture = ioTexture;

  const europaTexture = new BABYLON.Texture("/europa_texture.png", scene);
  europaTexture.vScale = -1;
  europaTexture.uScale = -1;

  const europaMaterial = new BABYLON.StandardMaterial("europaMaterial", scene);
  europaMaterial.diffuseTexture = europaTexture;

  const ganymedeTexture = new BABYLON.Texture("/ganymede_texture.png", scene);
  ganymedeTexture.vScale = -1;
  ganymedeTexture.uScale = -1;

  const ganymedeMaterial = new BABYLON.StandardMaterial(
    "ganymedeMaterial",
    scene,
  );
  ganymedeMaterial.diffuseTexture = ganymedeTexture;


  const callistoTexture = new BABYLON.Texture('/callisto_texture.png', scene);
  callistoTexture.vScale = -1;
  callistoTexture.uScale = -1;

  const callistoMaterial = new BABYLON.StandardMaterial("callistoMaterial", scene);
  callistoMaterial.diffuseTexture = callistoTexture;

  const saturnTexture = new BABYLON.Texture("/saturn_texture.jpg", scene);
  saturnTexture.vScale = -1;
  saturnTexture.uScale = -1;

  const saturnMaterial = new BABYLON.StandardMaterial("saturnMaterial", scene);
  saturnMaterial.diffuseTexture = saturnTexture;

  const uranusTexture = new BABYLON.Texture("/uranus_texture.jpg", scene);
  uranusTexture.vScale = -1;
  uranusTexture.uScale = -1;

  const uranusMaterial = new BABYLON.StandardMaterial("uranusMaterial", scene);
  uranusMaterial.diffuseTexture = uranusTexture;

  const titaniaTexture = new BABYLON.Texture('/titania_texture.jpg', scene);
  titaniaTexture.vScale = -1;
  titaniaTexture.uScale = -1;

  const titaniaMaterial = new BABYLON.StandardMaterial("titaniaMaterial", scene);
  titaniaMaterial.diffuseTexture = titaniaTexture;

  const mirandaTexture = new BABYLON.Texture('/miranda_texture.png', scene);
  mirandaTexture.vScale = -1;
  mirandaTexture.uScale = -1;

  const mirandaMaterial = new BABYLON.StandardMaterial("mirandaMaterial", scene);
  mirandaMaterial.diffuseTexture = mirandaTexture;

  const arielTexture = new BABYLON.Texture('/ariel_texture.jpg', scene);
  arielTexture.vScale = -1;
  arielTexture.uScale = -1;

  const arielMaterial = new BABYLON.StandardMaterial("arielMaterial", scene);
  arielMaterial.diffuseTexture = arielTexture;

  const umbrielTexture = new BABYLON.Texture('/umbriel_texture.png', scene);
  umbrielTexture.vScale = -1;
  umbrielTexture.uScale = -1;

  const umbrielMaterial = new BABYLON.StandardMaterial("umbrielMaterial", scene);
  umbrielMaterial.diffuseTexture = umbrielTexture;

  const neptuneTexture = new BABYLON.Texture('/neptune_texture.jpg', scene);
  neptuneTexture.vScale = -1;
  neptuneTexture.uScale = -1;

  const neptuneMaterial = new BABYLON.StandardMaterial("neptuneMaterial", scene);
  neptuneMaterial.diffuseTexture = neptuneTexture;

  const tritonTexture = new BABYLON.Texture('/triton_texture.png', scene);
  tritonTexture.vScale = -1;
  tritonTexture.uScale = -1;

  const tritonMaterial = new BABYLON.StandardMaterial("tritonMaterial", scene);
  tritonMaterial.diffuseTexture = tritonTexture;

  const marsMaterial = createMarsMaterial(scene);

  configureMaterial(earthMaterial);
  configureMaterial(moonMaterial);
  configureMaterial(marsMaterial);
  configureMaterial(mercuryMaterial);
  configureMaterial(venusMaterial);
  configureMaterial(jupiterMaterial);
  configureMaterial(ioMaterial);
  configureMaterial(ganymedeMaterial);
  configureMaterial(europaMaterial);
  configureMaterial(callistoMaterial);
  configureMaterial(saturnMaterial);
  configureMaterial(uranusMaterial);
  configureMaterial(titaniaMaterial);
  configureMaterial(mirandaMaterial);
  configureMaterial(arielMaterial);
  configureMaterial(umbrielMaterial);
  configureMaterial(neptuneMaterial);
  configureMaterial(tritonMaterial);

  return {
    earthMaterial,
    moonMaterial,
    sunMaterial,
    mercuryMaterial,
    venusMaterial,
    venusAtmosphereMaterial,
    marsMaterial,
    jupiterMaterial,
    saturnMaterial,
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
    tritonMaterial
  };
};

const createMarsMaterial = (scene) => {
  const marsTexture = new BABYLON.Texture("/mars_texture.jpg", scene);
  marsTexture.vScale = -1;
  marsTexture.uScale = -1;

  const marsMaterial = new BABYLON.ShaderMaterial(
    "marsMaterial",
    scene,
    {
      vertex: "marsAtmosphere",
      fragment: "marsAtmosphere",
    },
    {
      attributes: ["position", "normal", "uv"],
      uniforms: [
        "world",
        "worldView",
        "worldViewProjection",
        "view",
        "projection",
        "sunDirectionW",
        "cameraPositionW",
      ],
      samplers: ["textureSampler"],
    },
  );

  BABYLON.Effect.ShadersStore["marsAtmosphereVertexShader"] = `
      precision highp float;
      attribute vec3 position;
      attribute vec3 normal;
      attribute vec2 uv;
      uniform mat4 world;
      uniform mat4 worldViewProjection;
      varying vec3 vPositionW;
      varying vec3 vNormalW;
      varying vec2 vUV;
      void main() {
          vec4 outPosition = worldViewProjection * vec4(position, 1.0);
          gl_Position = outPosition;
          vPositionW = vec3(world * vec4(position, 1.0));
          vNormalW = normalize(vec3(world * vec4(normal, 0.0)));
          vUV = vec2(1.0 - uv.x, 1.0 - uv.y);
      }
  `;

  BABYLON.Effect.ShadersStore["marsAtmosphereFragmentShader"] = `
      precision highp float;
      uniform sampler2D textureSampler;
      uniform vec3 sunDirectionW;
      uniform vec3 cameraPositionW;
      varying vec3 vPositionW;
      varying vec3 vNormalW;
      varying vec2 vUV;

      void main() {
          vec3 viewDirectionW = normalize(cameraPositionW - vPositionW);
          vec3 normal = normalize(vNormalW);

          float NdotL = dot(normal, sunDirectionW);
          float dayNightFactor = smoothstep(-0.2, 0.2, NdotL);

          vec3 marsColor = texture2D(textureSampler, vUV).rgb;
          vec3 nightColor = marsColor * 0.1;  // Couleur de nuit plus sombre

          // Mélange jour/nuit
          vec3 baseColor = mix(nightColor, marsColor, dayNightFactor);

          // Effet d'atmosphère
          float fresnel = pow(1.0 - max(0.0, dot(normal, viewDirectionW)), 4.0);
          vec3 atmosphereColor = vec3(0.5, 0.2, 0.1);  // Couleur rougeâtre pour Mars
          float atmosphereIntensity = 0.3;  // Intensité réduite pour Mars
          vec3 atmosphereEffect = atmosphereColor * fresnel * max(0.2, dayNightFactor) * atmosphereIntensity;

          // Couleur finale avec atmosphère
          vec3 finalColor = baseColor + atmosphereEffect;

          // Ajout d'un léger halo atmosphérique au limbe de la planète
          float limb = pow(1.0 - max(0.0, dot(normal, viewDirectionW)), 8.0);
          finalColor += atmosphereColor * limb * 0.2;

          // Ajustement final de la luminosité
          finalColor *= 1.2;

          gl_FragColor = vec4(finalColor, 1.0);
      }
  `;

  marsMaterial.setTexture("textureSampler", marsTexture);

  return marsMaterial;
};

export const createSaturnRings = (scene, saturn) => {
  const saturnBoundingBox = saturn.getBoundingInfo().boundingBox;
  const saturnDiameter = saturnBoundingBox.maximum.subtract(saturnBoundingBox.minimum).length();

  console.log("Calculated Saturn diameter:", saturnDiameter);

  if (isNaN(saturnDiameter) || saturnDiameter <= 0) {
    console.error("Invalid Saturn diameter. Using default value.");
    saturnDiameter = 1;
  }

  const ringRadius = saturnDiameter * 1.4;
  console.log("Ring radius:", ringRadius);

  const ringMesh = BABYLON.MeshBuilder.CreateDisc("saturnRings", {
    radius: ringRadius,
    tessellation: 128,
    sideOrientation: BABYLON.Mesh.DOUBLESIDE
  }, scene);

  ringMesh.parent = saturn;
  ringMesh.rotation.x = Math.PI / 2;

  const ringMaterial = new BABYLON.ShaderMaterial(
    "ringMaterial",
    scene,
    {
      vertex: "saturnRings",
      fragment: "saturnRings",
    },
    {
      attributes: ["position", "normal", "uv"],
      uniforms: ["world", "worldView", "worldViewProjection", "view", "projection", "invertDiffusion"],
      samplers: ["ringTexture"]
    }
  );

  // Définir la valeur de invertDiffusion (0.0 ou 1.0)
  ringMaterial.setFloat("invertDiffusion", 1.0); // ou 1.0 pour inverser
  ringMaterial.specularColor = new BABYLON.Color3(0, 0, 0);  // Réduit les reflets spéculaires
  ringMaterial.emissiveColor = new BABYLON.Color3(0, 0, 0);  // Évite qu’ils soient trop brillants
  ringMaterial.alpha = 0.8;  // Si tu veux ajuster la transparence

  BABYLON.Effect.ShadersStore["saturnRingsVertexShader"] = `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 worldViewProjection;
        varying vec2 vUV;
        void main(void) {
            gl_Position = worldViewProjection * vec4(position, 1.0);
            vUV = uv;
        }
    `;

  BABYLON.Effect.ShadersStore["saturnRingsFragmentShader"] = `
    precision highp float;
  varying vec2 vUV;
  uniform sampler2D ringTexture;
  uniform float invertDiffusion;
  uniform vec3 ringColor; // Nouvelle uniforme pour la couleur des anneaux
  const float PI = 3.14159265359;

  void main(void) {
      vec2 centeredUV = vUV - vec2(0.5, 0.5);
      float angle = atan(centeredUV.y, centeredUV.x);
      float normalizedAngle = (angle + PI) / (2.0 * PI);
      
      float distFromCenter = length(centeredUV) * 2.0;
      
      float innerRadius = 0.25;
      float outerRadius = 0.55;
      float ringWidth = outerRadius - innerRadius;
      
      float normalizedRadius = (distFromCenter - innerRadius) / ringWidth;
      
      vec2 newUV;
      if (invertDiffusion > 0.5) {
          newUV = vec2(normalizedRadius, 1.0 - normalizedAngle);
      } else {
          newUV = vec2(1.0 - normalizedRadius, normalizedAngle);
      }
      
      float edgeSmoothing = 0.02;
      float alpha = smoothstep(0.0, edgeSmoothing, normalizedRadius) * 
                    smoothstep(1.0, 1.0 - edgeSmoothing, normalizedRadius);
      
      if(normalizedRadius < 0.0 || normalizedRadius > 1.0) {
          discard;
      }
      
      vec4 texColor = texture2D(ringTexture, newUV);
      
      // Appliquer la couleur grise et ajuster la luminosité
      vec3 finalColor = mix(texColor.rgb, ringColor, 0.7);
      finalColor *= 0.8; // Réduire légèrement la luminosité globale
      
      // Ajuster l'opacité
      float finalAlpha = texColor.a * alpha * 0.8; // Réduire légèrement l'opacité
      
      gl_FragColor = vec4(finalColor, finalAlpha);
  }
  `;


  const ringTexture = new BABYLON.Texture("/saturn_ring_texture.png", scene);
  ringMaterial.setTexture("ringTexture", ringTexture);
  ringMaterial.backFaceCulling = false;
  ringMaterial.alphaMode = BABYLON.Engine.ALPHA_COMBINE;

  ringMesh.material = ringMaterial;

  console.log("Saturn position:", saturn.position);
  console.log("Rings position:", ringMesh.getAbsolutePosition());

  return ringMesh;
};

export const createUranusRings = (scene, uranus) => {
  const uranusBoundingBox = uranus.getBoundingInfo().boundingBox;
  const uranusDiameter = uranusBoundingBox.maximum.subtract(uranusBoundingBox.minimum).length();

  console.log("Calculated Saturn diameter:", uranusDiameter);

  if (isNaN(uranusDiameter) || uranusDiameter <= 0) {
    console.error("Invalid uranus diameter. Using default value.");
    uranusDiameter = 1;
  }

  const ringRadius = uranusDiameter * 1.4;
  console.log("Ring radius:", ringRadius);

  const ringMesh = BABYLON.MeshBuilder.CreateDisc("uranusRings", {
    radius: ringRadius,
    tessellation: 128,
    sideOrientation: BABYLON.Mesh.DOUBLESIDE
  }, scene);

  ringMesh.parent = uranus;
  ringMesh.rotation.x = Math.PI / 2;

  const ringMaterial = new BABYLON.ShaderMaterial(
    "ringMaterial",
    scene,
    {
      vertex: "uranusRings",
      fragment: "uranusRings",
    },
    {
      attributes: ["position", "normal", "uv"],
      uniforms: ["world", "worldView", "worldViewProjection", "view", "projection", "invertDiffusion"],
      samplers: ["ringTexture"]
    }
  );

  // Définir la valeur de invertDiffusion (0.0 ou 1.0)
  ringMaterial.setFloat("invertDiffusion", 1.0); // ou 1.0 pour inverser
  ringMaterial.specularColor = new BABYLON.Color3(0, 0, 0);  // Réduit les reflets spéculaires
  ringMaterial.emissiveColor = new BABYLON.Color3(0, 0, 0);  // Évite qu’ils soient trop brillants
  ringMaterial.alpha = 0.8;  // Si tu veux ajuster la transparence

  BABYLON.Effect.ShadersStore["uranusRingsVertexShader"] = `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 worldViewProjection;
        varying vec2 vUV;
        void main(void) {
            gl_Position = worldViewProjection * vec4(position, 1.0);
            vUV = uv;
        }
    `;

  BABYLON.Effect.ShadersStore["uranusRingsFragmentShader"] = `
    precision highp float;
  varying vec2 vUV;
  uniform sampler2D ringTexture;
  uniform float invertDiffusion;
  uniform vec3 ringColor; // Nouvelle uniforme pour la couleur des anneaux
  const float PI = 3.14159265359;

  void main(void) {
      vec2 centeredUV = vUV - vec2(0.5, 0.5);
      float angle = atan(centeredUV.y, centeredUV.x);
      float normalizedAngle = (angle + PI) / (2.0 * PI);
      
      float distFromCenter = length(centeredUV) * 2.0;
      
      float innerRadius = 0.25;
      float outerRadius = 0.55;
      float ringWidth = outerRadius - innerRadius;
      
      float normalizedRadius = (distFromCenter - innerRadius) / ringWidth;
      
      vec2 newUV;
      if (invertDiffusion > 0.5) {
          newUV = vec2(normalizedRadius, 1.0 - normalizedAngle);
      } else {
          newUV = vec2(1.0 - normalizedRadius, normalizedAngle);
      }
      
      float edgeSmoothing = 0.02;
      float alpha = smoothstep(0.0, edgeSmoothing, normalizedRadius) * 
                    smoothstep(1.0, 1.0 - edgeSmoothing, normalizedRadius);
      
      if(normalizedRadius < 0.0 || normalizedRadius > 1.0) {
          discard;
      }
      
      vec4 texColor = texture2D(ringTexture, newUV);
      
      // Appliquer la couleur grise et ajuster la luminosité
      vec3 finalColor = mix(texColor.rgb, ringColor, 0.7);
      finalColor *= 0.8; // Réduire légèrement la luminosité globale
      
      // Ajuster l'opacité
      float finalAlpha = texColor.a * alpha * 0.8; // Réduire légèrement l'opacité
      
      gl_FragColor = vec4(finalColor, finalAlpha);
  }
  `;


  const ringTexture = new BABYLON.Texture("/uranus_ring_texture.png", scene);
  ringMaterial.setTexture("ringTexture", ringTexture);
  ringMaterial.backFaceCulling = false;
  ringMaterial.alphaMode = BABYLON.Engine.ALPHA_COMBINE;

  ringMesh.material = ringMaterial;

  console.log("uranus position:", uranus.position);
  console.log("Rings position:", ringMesh.getAbsolutePosition());

  return ringMesh;
};