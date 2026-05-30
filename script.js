const imageGroups = [
  ["17.07.51", 4],
  ["17.07.55", 11],
  ["17.07.56", 14],
  ["17.07.57", 11],
];

const artworks = imageGroups.flatMap(([time, count]) => {
  const base = `images/WhatsApp Image 2026-05-30 at ${time}`;
  return [
    `${base}.jpeg`,
    ...Array.from({ length: count }, (_, index) => `${base} (${index + 1}).jpeg`),
  ];
});

const gallery = document.querySelector("[data-gallery]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const frameColors = [
  "#263e42",
  "#735f55",
  "#a74f45",
  "#c29549",
  "#5f7965",
  "#514761",
  "#2f5f75",
  "#8a6e32",
  "#963f62",
];

function shuffle(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function pick(values) {
  return values[Math.floor(Math.random() * values.length)];
}

function makeFrameRadius() {
  const corners = Array.from({ length: 8 }, () => randomBetween(3, 12).toFixed(0));
  return `${corners[0]}px ${corners[1]}px ${corners[2]}px ${corners[3]}px / ${corners[4]}px ${corners[5]}px ${corners[6]}px ${corners[7]}px`;
}

function createArtworkButton(src, index) {
  const button = document.createElement("button");
  const image = document.createElement("img");
  const rotation = randomBetween(-6.5, 6.5).toFixed(2);
  const shift = randomBetween(-28, 28).toFixed(0);
  const mobileShift = randomBetween(-12, 12).toFixed(0);
  const pull = randomBetween(-8, 24).toFixed(0);
  const mobilePull = randomBetween(-16, 12).toFixed(0);
  const width = randomBetween(68, 90).toFixed(0);
  const span = pick([2, 2, 2, 3, 3, 3, 4]);
  const frameWidth = randomBetween(4, 10).toFixed(0);
  const frameColor = pick(frameColors);
  const frameRadiusBase = `${randomBetween(2, 7).toFixed(0)}px`;
  const frameOffset = `-${Math.max(2, Math.round(Number(frameWidth) * 0.55))}px`;
  const frameWobble = randomBetween(-1.1, 1.1).toFixed(2);

  button.type = "button";
  button.className = "art-card";
  button.style.setProperty("--rotate", `${rotation}deg`);
  button.style.setProperty("--shift", `${shift}px`);
  button.style.setProperty("--mobile-shift", `${mobileShift}px`);
  button.style.setProperty("--pull", `${pull}px`);
  button.style.setProperty("--mobile-pull", `${mobilePull}px`);
  button.style.setProperty("--width", `${width}%`);
  button.style.setProperty("--span", span);
  button.style.setProperty("--frame-width", `${frameWidth}px`);
  button.style.setProperty("--frame-color", frameColor);
  button.style.setProperty("--frame-line", "rgba(25, 39, 43, 0.22)");
  button.style.setProperty("--frame-radius", makeFrameRadius());
  button.style.setProperty("--frame-radius-base", frameRadiusBase);
  button.style.setProperty("--frame-offset", frameOffset);
  button.style.setProperty("--frame-wobble", `${frameWobble}deg`);
  button.style.setProperty("--z", String(Math.floor(randomBetween(1, 20))));
  button.setAttribute("aria-label", `Open artwork ${index + 1}`);

  image.src = src;
  image.alt = `Artwork ${index + 1}`;
  image.decoding = "async";
  image.loading = index < 8 ? "eager" : "lazy";

  button.append(image);
  button.addEventListener("click", () => openLightbox(src, image.alt));

  return button;
}

function openLightbox(src, alt) {
  lightboxImage.src = src;
  lightboxImage.alt = alt;
  lightbox.showModal();
}

function closeLightbox() {
  lightbox.close();
}

shuffle(artworks).forEach((src, index) => {
  gallery.append(createArtworkButton(src, index));
});

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  const box = lightboxImage.getBoundingClientRect();
  const isInsideImage =
    event.clientX >= box.left &&
    event.clientX <= box.right &&
    event.clientY >= box.top &&
    event.clientY <= box.bottom;
  const isCloseButton = event.target.closest("[data-lightbox-close]");

  if (!isInsideImage && !isCloseButton) {
    closeLightbox();
  }
});

lightbox.addEventListener("close", () => {
  lightboxImage.removeAttribute("src");
  lightboxImage.alt = "";
});
