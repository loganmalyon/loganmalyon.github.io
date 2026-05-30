const artworkCount = 44;
const artworks = Array.from(
  { length: artworkCount },
  (_, index) => `artwork/artwork-${String(index + 1).padStart(2, "0")}.webp`,
);

const gallery = document.querySelector("[data-gallery]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const frameStyles = [
  "frame-painted",
  "frame-painted",
  "frame-wood",
  "frame-gold",
  "frame-thin",
  "frame-tape",
  "frame-gallery",
];
const frameColors = [
  "#153d4f",
  "#385a3c",
  "#842e39",
  "#a25b30",
  "#43315b",
  "#1f1f1d",
  "#cf5f8b",
  "#efb84f",
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

function createArtworkButton(src, index) {
  const button = document.createElement("button");
  const image = document.createElement("img");
  const rotation = randomBetween(-6.5, 6.5).toFixed(2);
  const shift = randomBetween(-28, 28).toFixed(0);
  const mobileShift = randomBetween(-12, 12).toFixed(0);
  const pull = randomBetween(-8, 24).toFixed(0);
  const mobilePull = randomBetween(-16, 12).toFixed(0);
  const width = randomBetween(58, 82).toFixed(0);
  const span = pick([2, 2, 2, 3, 3]);
  const frameStyle = pick(frameStyles);
  const frameWidth = randomBetween(5, frameStyle === "frame-gold" ? 18 : 12).toFixed(0);
  const frameColor = pick(frameColors);
  const frameAccent = pick(frameColors.filter((color) => color !== frameColor));
  const frameOffset = `-${Math.max(4, Math.round(Number(frameWidth) * 0.7))}px`;
  const frameTilt = randomBetween(-2.2, 2.2).toFixed(2);
  const tapeColor = pick(["#efcf70", "#f4b2be", "#b9d7a8", "#9cc6d9", "#f2a65f"]);

  button.type = "button";
  button.className = `art-card ${frameStyle}`;
  button.style.setProperty("--rotate", `${rotation}deg`);
  button.style.setProperty("--shift", `${shift}px`);
  button.style.setProperty("--mobile-shift", `${mobileShift}px`);
  button.style.setProperty("--pull", `${pull}px`);
  button.style.setProperty("--mobile-pull", `${mobilePull}px`);
  button.style.setProperty("--width", `${width}%`);
  button.style.setProperty("--span", span);
  button.style.setProperty("--frame-width", `${frameWidth}px`);
  button.style.setProperty("--frame-color", frameColor);
  button.style.setProperty("--frame-accent", frameAccent);
  button.style.setProperty("--frame-offset", frameOffset);
  button.style.setProperty("--frame-tilt", `${frameTilt}deg`);
  button.style.setProperty("--tape-color", tapeColor);
  button.style.setProperty("--z", String(Math.floor(randomBetween(1, 20))));
  button.setAttribute("aria-label", `Open artwork ${index + 1}`);

  image.src = src;
  image.alt = `Artwork ${index + 1}`;
  image.decoding = "async";
  image.loading = index < 8 ? "eager" : "lazy";
  image.addEventListener("error", () => button.remove(), { once: true });

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
