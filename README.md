# Logan Artist Portfolio

Static GitHub Pages site for an artist portfolio.

## Local preview

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Publish to GitHub Pages

1. Create an empty GitHub repository.
2. Push this project to the repository's `main` branch.
3. In GitHub, open **Settings > Pages** and set **Build and deployment > Source** to **GitHub Actions**.
4. The included workflow deploys the site after each push to `main`.

The gallery uses generated transparent WebP files in `artwork/`. The original scans stay in `images/`.

If more scans are added later, regenerate the transparent gallery assets:

```bash
python3 tools/crop_artwork.py
```

Then update `artworkCount` in `script.js` if the number of images changed.
