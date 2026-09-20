# shani-website

Marketing site for Shanios — served at [shani.dev](https://shani.dev).

## Structure

- `index.html` — single-page landing with feature overview, download links, and comparison table
- `assets/css/` — stylesheets
- `assets/js/script.js` — interactive behaviour (version display, mobile nav, counters)
- `ads.txt` — removed (site contains no advertising)

## Prerequisites

- Any modern web browser (Chrome, Firefox, Safari, Edge)
- A local HTTP server for testing (Python 3, Node.js, or any static file server)

## Local Development

Open `index.html` in a browser directly for quick previews, or serve the directory
for accurate path resolution:

```bash
# Python 3
python -m http.server 8000

# Node.js (npx)
npx serve .
```

Then open `http://localhost:8000` in your browser.

## File Structure

```
shani-website/
  index.html            # Main landing page
  CNAME                 # shani.dev (custom domain for GitHub Pages)
  robots.txt            # Allows all crawlers; points to sitemap
  sitemap.xml           # Auto-maintained single-page sitemap
  SECURITY.md           # Security policy
  renovate.json         # Dependency update config
  README.md
  assets/
    css/
      style.css
    js/
      script.js         # Interactivity (version display, mobile nav, counters)
    images/
      saturn-x.png      # Hero background (webp conversion kept as design source)
      gnome-screenshot.jpg / .webp
      plasma-screenshot.jpg / .webp
      logo.svg / about.svg / features.svg / og-image.svg
      favicon-*.png / apple-touch-icon.png / favicon.ico
```

## Editing Content

- Feature descriptions, download links, and comparison data live in `index.html`.
- Styling changes go in `assets/css/`.
- Interactive behaviour (mobile nav, counters, version display) lives in `assets/js/script.js`.

## Conventions

- **Version lockstep:** `assets/js/script.js`'s `VERSION` must match the version
  strings hardcoded in `index.html` (JSON-LD `softwareVersion`/`datePublished`,
  download labels, ISO/SHA256/ASC filenames) and the "Signed ISOs" row in
  `../RELEASES.md`. Bump all at once — grep for the current version string,
  don't assume.
- **Images:** hero backgrounds and screenshots use `.webp`; favicons and PWA
  icons stay `.png` (broad OS-level format support). Social-crawler meta tags
  (`og:image`/`twitter:image`) deliberately keep `.jpg` — link-preview crawlers
  don't content-negotiate the way browsers do.
- **No ads:** the site contains no advertising. `ads.txt` was removed because
  nothing loads an AdSense script. Do not re-add `ads.txt` without also wiring
  an ad unit — the mismatch is silent.

## Deployment

Pushed to the `main` branch; deployed automatically via GitHub Pages at `shani.dev`.

To deploy manually:

1. Ensure all changes are committed and pushed to `main`.
2. Verify the site renders correctly by serving it locally first.
3. Push to `main` — GitHub Pages will rebuild and deploy automatically.


