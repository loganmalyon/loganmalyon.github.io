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

The gallery uses the JPEGs in `images/`. If more artwork is added later, update the image list in `script.js`.
