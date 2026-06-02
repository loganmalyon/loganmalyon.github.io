# Logan Artist Portfolio

Static GitHub Pages site for an artist portfolio.

## Local preview

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Publish to GitHub Pages

For the public site `https://loganmalyon.github.io/`, create a repository owned by
`loganmalyon` named exactly `loganmalyon.github.io`, then push this project to its
`main` branch.

In GitHub, open **Settings > Pages** and set **Build and deployment > Source** to
**Deploy from a branch**. Select branch `main` and folder `/ (root)`, then save.

The gallery uses generated cropped WebP files in `artwork/`. The original scans stay in `images/` and `linos/`.

If more scans are added later, regenerate the cropped gallery assets:

```bash
python3 tools/crop_artwork.py
```

Then update `artworkCount` in `script.js` if the number of images changed.
