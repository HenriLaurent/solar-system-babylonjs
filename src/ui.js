import {
  sunText,
  marsText,
  earthText,
  moonText,
  mercuryText,
  venusText,
  jupiterText,
  ioText,
  ganymedeText,
  europaText,
  callistoText,
  saturnText,
  uranusText,
  titaniaText,
  mirandaText,
  arielText,
  umbrielText,
} from "./utils/text";
export const createUI = (scene, initialFocus) => {
  const uiContainer = document.createElement("div");
  uiContainer.id = "uiContainer";

  const title = document.createElement("h2");
  title.style.fontFamily = "Orbitron";
  title.style.fontWeight = 400;
  title.style.marginTop = "0";
  uiContainer.appendChild(title);

  const textContainer = document.createElement("div");
  textContainer.style.height = "100%";
  textContainer.style.overflow = "auto";
  textContainer.style.fontFamily = "Exo";
  textContainer.style.fontWeight = 300;
  textContainer.style.marginBottom = "20px";
  textContainer.style.paddingRight = "10px";
  uiContainer.appendChild(textContainer);

  document.body.appendChild(uiContainer);

  uiContainer.addEventListener(
    "wheel",
    (event) => {
      event.stopPropagation();
    },
    { passive: false },
  );

  const updateContent = (focus) => {
    const focusToText = {
      sun: sunText,
      earth: earthText,
      mars: marsText,
      moon: moonText,
      mercury: mercuryText,
      venus: venusText,
      venusatmosphere: venusText,
      jupiter: jupiterText,
      io: ioText,
      europa: europaText,
      ganymede: ganymedeText,
      callisto: callistoText,
      saturn: saturnText,
      uranus: uranusText,
      titania: titaniaText,
      miranda: mirandaText,
      ariel: arielText,
      umbriel: umbrielText,
      // Ajoutez d'autres objets ici
    };
    textContainer.innerHTML =
      focusToText[focus]?.description || "Information not available";
    title.textContent =
      focusToText[focus]?.title || "Information not available";
  };

  // Set initial content
  updateContent(initialFocus);

  const cleanup = () => {
    document.body.removeChild(uiContainer);
  };

  return { cleanup, updateContent };
};
