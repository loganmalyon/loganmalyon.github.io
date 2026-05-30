from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage


SOURCE_DIR = Path("images")
OUTPUT_DIR = Path("artwork")
OUTPUT_SIZE = 1800


def estimate_paper_color(pixels):
    height, width, _ = pixels.shape
    strip = max(12, min(height, width) // 32)
    edge_pixels = np.concatenate(
        [
            pixels[:strip].reshape(-1, 3),
            pixels[-strip:].reshape(-1, 3),
            pixels[:, :strip].reshape(-1, 3),
            pixels[:, -strip:].reshape(-1, 3),
        ],
        axis=0,
    )
    return np.median(edge_pixels, axis=0)


def alpha_removed_paper(image):
    rgb = image.convert("RGB")
    pixels = np.array(rgb).astype(np.float32)
    paper = estimate_paper_color(pixels)
    color_distance = np.linalg.norm(pixels - paper, axis=2)
    brightness = pixels.mean(axis=2)
    saturation = pixels.max(axis=2) - pixels.min(axis=2)

    alpha = np.maximum((color_distance - 13) * 9.5, (saturation - 13) * 8.5)
    alpha = np.maximum(alpha, (238 - brightness) * 6.5)
    alpha = np.clip(alpha, 0, 255).astype(np.uint8)

    alpha_image = Image.fromarray(alpha, "L").filter(ImageFilter.GaussianBlur(0.35))
    rgba = rgb.convert("RGBA")
    rgba.putalpha(alpha_image)
    return rgba


def crop_box_for(image):
    alpha = np.array(image.getchannel("A"))
    mask = alpha > 16
    mask = ndimage.binary_closing(mask, structure=np.ones((5, 5)))
    labels, count = ndimage.label(mask)
    keep = np.zeros(mask.shape, dtype=bool)
    min_area = max(220, int(mask.size * 0.00008))

    for label in range(1, count + 1):
        rows, cols = np.where(labels == label)
        if rows.size == 0:
            continue

        height = rows.max() - rows.min() + 1
        width = cols.max() - cols.min() + 1
        if rows.size >= min_area and height >= 7 and width >= 7:
            keep[labels == label] = True

    if not keep.any():
        keep = mask

    rows, cols = np.where(keep)
    if rows.size == 0 or cols.size == 0:
        return (0, 0, image.width, image.height)

    pad = max(16, int(min(image.width, image.height) * 0.015))
    left = max(0, int(cols.min()) - pad)
    top = max(0, int(rows.min()) - pad)
    right = min(image.width, int(cols.max()) + pad)
    bottom = min(image.height, int(rows.max()) + pad)

    return (left, top, right, bottom)


def save_cropped(source, target):
    image = Image.open(source).convert("RGB")
    transparent = alpha_removed_paper(image)
    cropped = transparent.crop(crop_box_for(transparent))
    cropped.thumbnail((OUTPUT_SIZE, OUTPUT_SIZE), Image.Resampling.LANCZOS)
    cropped.save(target, "WEBP", quality=86, method=2)
    return image.size, cropped.size


def main():
    OUTPUT_DIR.mkdir(exist_ok=True)

    for old_file in OUTPUT_DIR.glob("artwork-*.*"):
        old_file.unlink()

    sources = sorted(SOURCE_DIR.glob("*.jpeg"))
    for index, source in enumerate(sources, start=1):
        target = OUTPUT_DIR / f"artwork-{index:02}.webp"
        original_size, cropped_size = save_cropped(source, target)
        print(f"{target} {original_size} -> {cropped_size}")


if __name__ == "__main__":
    main()
