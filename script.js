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
  const width = randomBetween(68, 90).toFixed(0);
  const span = pick([2, 2, 2, 3, 3, 3, 4]);

  button.type = "button";
  button.className = "art-card";
  button.style.setProperty("--rotate", `${rotation}deg`);
  button.style.setProperty("--shift", `${shift}px`);
  button.style.setProperty("--mobile-shift", `${mobileShift}px`);
  button.style.setProperty("--pull", `${pull}px`);
  button.style.setProperty("--mobile-pull", `${mobilePull}px`);
  button.style.setProperty("--width", `${width}%`);
  button.style.setProperty("--span", span);
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
