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
  assets/
    css/                # Stylesheets
      style.css
    js/
      script.js         # Interactivity (version display, mobile nav, counters)
  README.md
```

## Editing Content

- Feature descriptions, download links, and comparison data live in `index.html`.
- Styling changes go in `assets/css/`.
- Interactive behaviour (mobile nav, counters, version display) lives in `assets/js/script.js`.

## Deployment

Pushed to the `main` branch; deployed automatically via GitHub Pages at `shani.dev`.

To deploy manually:

1. Ensure all changes are committed and pushed to `main`.
2. Verify the site renders correctly by serving it locally first.
3. Push to `main` — GitHub Pages will rebuild and deploy automatically.


