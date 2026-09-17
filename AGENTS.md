# Agent instructions — shani-website

This file applies to any AI coding assistant working in this repository
(Claude Code, opencode, Kilo Code, Cursor, Aider, or similar). Read this
before editing, and follow the verification steps before calling any change
done.

## What this repo is

The marketing site for Shanios (`shani.dev`) — plain HTML/CSS, no build
step, no admin panel or paywall (unlike `shani-blog`/`shani-docs`). Lower
attack surface, but still real, publicly-served content.

## Rule: open it and actually check

Don't consider a change to markup/CSS/JS done because it reads correctly —
serve the repo locally (`python3 -m http.server 8000` from the repo root)
and load the actual page in a browser, checking the **console for
errors**. If you add or touch a CDN `<script>`/`<link>` tag,
confirm any `integrity=` (SRI) hash matches the pinned file's real content
(`openssl dgst -sha384 -binary <file> | openssl base64 -A`) — a mismatched
hash silently blocks the resource with no visible error unless you check
the console.

If you touch the version string referenced in `assets/js/script.js`,
confirm it still matches the top-level `RELEASES.md` — the two are meant
to stay in lockstep and nothing currently checks that automatically.

## Audit-verified known issues (confirmed present)

- **`ads.txt` deleted — verified safe, but undocumented until now.**
  Contained a real Google AdSense publisher declaration
  (`google.com, pub-8268043375450773, DIRECT, f08c47fec0942fa0`). Verified
  via `grep -rn "adsbygoogle\|googlesyndication\|AdSense"` across every
  `.html`/`.js` file in the repo: zero matches — no page anywhere actually
  loads an AdSense script or ad unit, so this was a standalone,
  never-wired-up file. Safe to remove, but if ads are ever added back
  using that same publisher ID, `ads.txt` needs to be restored with it.
- **Empty footer `<li>` bullets — FIXED.** `index.html`'s "Resources"
  footer group had two blank lines where a "Contact Founder"
  (`t.me/shrinivasvkumbhar`) and an "Email" link used to be — the Email
  link was moved to the "Platform" group above it, but the Telegram link
  was dropped with no replacement and the empty `<li>` whitespace was left
  behind. The Telegram contact link itself is not lost from the page — it
  still appears prominently in the FAQ and the Enterprise CTA button — so
  this was just leftover dead markup from trimming a redundant footer copy,
  not a lost contact method. Removed the two blank lines.
- **No LICENSE file (Low, needs a maintainer decision).** No `LICENSE`/`COPYING`
  file anywhere in the repo, confirmed by direct file check. The ecosystem
  cluster currently lacking one (audit-verified 2026-09-17): `shani-chronoa`,
  `shani-docs`, `shani-wiki`, `shani-website` — `shani-install-media` gained a
  GPL-3.0 LICENSE on 2026-09-16 and `shani-settings` on 2026-09-17, both
  closed. Not a unique outlier, one of a real cluster. Needs
  the maintainer to pick what license this content is under, not
  something to guess and add.
- **Version string lockstep — corrected, a prior entry named a file that
  doesn't exist.** The old note here said this must match a root
  `RELEASES.md` — verified via `find`/`git log --all` that no such file
  exists anywhere in this repo or its history; likely a stray/hallucinated
  reference from an earlier pass, not a real cross-check. The actual
  lockstep is `assets/js/script.js`'s `VERSION = '2026.05.18'` against the
  same literal string hardcoded in several places in `index.html`
  (JSON-LD `softwareVersion`/`datePublished`, both download-section
  version labels, and every `.iso`/`.sha256`/`.asc` filename in the
  verify/flash shell command examples) — currently all consistent at
  `2026.05.18`, confirmed via grep across the whole file. If you bump the
  release, grep for `2026.05.18` (or whatever the current value is) and
  update every occurrence, not just `script.js`'s `VERSION` constant.
- **CI status.** No CI workflows, no pre-commit hooks.
- **Heading hierarchy break — FIXED (superseding the stale note this replaces).** `index.html`'s Founder card now correctly uses `<h3>Founder</h3>` nested under the "About the Platform" `<h2>`, alongside its sibling `<h3>` cards — confirmed by direct read, not present as a bare `<h2>` anymore.
- **Unoptimized hero background image — FIXED.** `assets/images/saturn-x.png` (1.9MB, the single largest concrete Core Web Vitals/LCP lever in this repo — a CSS background, always loads on first paint, can't use `loading="lazy"`) converted to `assets/images/saturn-x.webp` via Pillow (`quality=82, method=6`): 1907KB → 543KB, 72% smaller. `assets/css/style.css:511`'s `.hero-section` background swapped to reference the `.webp` directly (no `<picture>`/`image-set()` fallback ladder — WebP has been supported by every evergreen browser including Safari since 2020, and a straight swap matches this repo's existing "no build step, keep it simple" convention). Verified by actually loading the page in a browser (not just checking file sizes): screenshot shows no visible compression artifacts, zero console errors, zero CSP/network failures. The original `.png` was kept in the repo (not deleted) in case it's needed as a design source; only the CSS reference changed.
- **Large screenshots without modern format — FIXED.** `assets/images/plasma-screenshot.jpg` (1.3MB) and `assets/images/gnome-screenshot.jpg` (already `loading="lazy"`, also used as `og:image`/`twitter:image`) converted to `.webp` the same way: plasma 1282KB → 174KB (86% smaller), gnome 175KB → 140KB. Both `<img>` tags (`index.html`, Download section) wrapped in `<picture>` with a `<source type="image/webp">` + the original `.jpg` as the `<img>` fallback — real progressive enhancement here (unlike the CSS background) since `<picture>`/`<source>` costs nothing extra to support non-WebP clients correctly. Verified live in a browser via `img.currentSrc`/`naturalWidth`/`complete` after scrolling each into view (both loaded the `.webp` at full 1920×1080 resolution, not just "file exists") and a visual screenshot at full quality. **`og:image`/`twitter:image` meta tags deliberately left pointing at the original `.jpg`, not swapped to `.webp`** — social-platform link-preview crawlers (Facebook, X/Twitter, LinkedIn) don't content-negotiate the way browsers do via `<picture>`, and WebP support among them is inconsistent even now; changing those specific tags risked breaking link previews for a save that doesn't matter at that file size.
- **No modern image formats anywhere — partially addressed.** The two largest offenders (saturn-x, plasma-screenshot) and gnome-screenshot are now WebP (see above). The small PWA/favicon icons (`android-chrome-*.png`, `apple-touch-icon.png`, `favicon-*.png`, all under 46KB) were left as PNG — favicon/manifest icons need broad format support across OS-level icon pickers and PWA install prompts that don't reliably accept WebP, and the file-size upside at these sizes is negligible next to that risk.
- **`robots.txt` and `sitemap.xml` — DEPLOYED (commit `1608af6`, 2026-08-29, supersedes the "NOT YET DEPLOYED" entry below).** Both files are committed and pushed (repo at 0 ahead/0 behind). Live fetch of `https://shani.dev/robots.txt` returns real content ("User-agent: * / Allow: / / Sitemap: https://shani.dev/sitemap.xml"), not GitHub Pages' 404 — verified this session. No longer a production gap.
- **No SRI on the Font Awesome CDN link — FIXED.** `index.html:62` had no `integrity=`. Now has a real `sha384-` hash computed by fetching the exact pinned URL. Also fixed one unrelated bare-`&` HTML defect found while re-validating with html5lib (`index.html:61`'s Google Fonts URL) — re-parsed after both fixes: 0 errors.
- **CSP — DEPLOYED (commit `1608af6`, 2026-08-29).** `index.html` has a real `<meta http-equiv="Content-Security-Policy">` (`default-src 'self'` plus explicit allowances for the fonts/Font-Awesome CDN and `downloads.shani.dev`), committed and pushed. Verified live this session: `curl https://shani.dev/` returns the CSP meta tag in served HTML. GitHub Pages can't add one via response headers (per `CNAME`/`README.md:53`), so the meta tag is the only mechanism — and it is now deployed.
- **SEO enhancement pass (per explicit "shani-website seo improvements also we need traffic as much as possible") added real structured-data signals — verified by parsing the actual generated JSON-LD and re-validating the whole file with html5lib, not just by reading the diff.**
  - **`FAQPage` JSON-LD added**, mechanically extracted from the page's existing 18 `<details class="faq-item">` entries (each a `<summary>` question + `.faq-body` answer — already clean semantic HTML, arguably better source material than `shani-docs`' markdown FAQ). Used BeautifulSoup to pull `get_text()` from each, which introduced its own whitespace artifacts (space before commas/periods, space inside parens, from adjacent inline tags like `<code>`/`<a>` in the source) — caught by spot-checking, not assumed clean; fixed with a whitespace-normalizing pass. **That first cleanup pass then introduced its own regression**, caught by a second, more careful check: collapsing "space before punctuation" also corrupted file-extension periods (`opens .docx` → `opens.docx`, `than .dmg` → `than.dmg`) since a period followed immediately by more non-space text is a file extension, not sentence-ending punctuation. Fixed the regex to only collapse when the punctuation is followed by whitespace or end-of-string; re-verified both cases render correctly (`opens .docx/.xlsx/.pptx`, `than .dmg files`) and re-scanned all 18 answers for the same signature — zero remaining. This repo has no build step (per "What this repo is" above), so the JSON-LD is a **one-time generated, hand-embedded block, not auto-regenerated** — a comment directly above it in `index.html` says so; if the FAQ section's questions/answers change, this JSON-LD needs manual re-sync (a one-off script, not currently checked into the repo, produced it — regenerate similarly if needed).
  - **`sameAs` added to the existing `SoftwareApplication.author` Person entity** (LinkedIn + personal GitHub) and **a new standalone `Organization` JSON-LD block added** (project GitHub org + Telegram community as `sameAs`) — neither existed before; both are real profile links already linked from the page itself (footer/founder-connect section), not invented.
  - Verified all of the above by actually parsing every `<script type="application/ld+json">` block in the file with Python's `json.loads()` (3 blocks: `SoftwareApplication`, `FAQPage` with 18 `mainEntity` entries, `Organization` — 0 parse errors) and re-running the full-file `html5lib` strict parse this repo's own rule requires (0 errors), not just visual inspection.

## If you have Superpowers / oh-my-opencode / ultrawork / similar available

If your environment provides Claude Code's **Superpowers** plugin, OpenCode's
**oh-my-opencode**, an **ultrawork**-style parallel execution mode, or an
equivalent skill/subagent framework — use it to drive a real or headless
browser check rather than reasoning about rendering/JS behavior from
source alone.

## Cross-repo impact — check before calling a fix complete

Brand CSS and related JS claims are the **opposite** here: this repo shares **no** `sw.js`, brand CSS, or nav/content-fetch JS with the other web repos (audit-verified 2026-09-17). This is a single-page marketing site; the "shared files across four web repos" concern does not apply — updates to those files in `shani-docs`/`shani-blog` do NOT need to be mirrored here. The only cross-repo sync surfaces are content-level conventions (robots.txt/sitemap patterns). Also: this
repo's version string must match the top-level `RELEASES.md` — a release
bump that updates one without the other is a real, silent drift.

## Where things are documented

`README.md` explains the site's structure and its CNAME/Pages setup.

## Garuda Cross-Reference Findings (added 2026-09-17)

Based on a full scan of the garuda clones mapped against shani — **29 repos** (not 34; several user-listed names don't exist — see `../garuda-catalog.md` §Discrepancies). See `../garuda-mapping-analysis.md`, `../deep-analysis.md`, `../shani-catalog.md`, and `../garuda-catalog.md` for full details. garuda-ng (Angular component library) is the most directly comparable reference for the shared-web-code problem this repo faces.

### 🟡 HIGH: CI/CD gap (shared across ALL repos)

1. **Shared CI templates** (estimated 2-3 days, affects ALL repos).
   - Garuda's `gitlab-ci-commons` provides reusable templates (commitizen, flake-check, pre-commit, tag-to-release). Each repo `include:`s from it.
   - Shani repos run on GitHub Actions (no `.gitlab-ci.yml` anywhere) — 8 repos (blog, builder, docs, fleet, insights, install-media, pkgbuilds, platform) carry hand-written `.github/workflows/*.yml` with duplicated patterns.
   - **Action**: Create `shani-ci-commons` (GitHub Actions reusable workflows / composite actions) with templates for lint, test, build, security scan. Each repo references them via `uses: shani8dev/shani-ci-commons/...` instead of copy-pasting.
   - **Affects**: All 15 shani repos.

### 🟡 HIGH: Dependency management gap

2. **Add automated dependency updates** (estimated 4 hours, affects ALL repos).
   - Garuda uses `renovate-runner` running hourly against all repos with `renovate.json` files.
   - Shani repos have no automated dependency updating.
   - **Action**: Set up Renovate (self-hosted or gitlab.com) with a fleet-wide config. Each repo adds a minimal `renovate.json`.

### 🟢 MEDIUM: Code quality

3. **Conventional commit enforcement** (estimated 2 hours, affects ALL repos).
   - Every garuda repo has a `[commitizen]` badge; `cz commit` is enforced.
   - Shani repos have no commit message standardization.

### 🟢 MEDIUM: Shared web components

4. **Shared web component library** (estimated 2-3 days, affects shani-docs/blog/website).
   - Garuda's `garuda-ng` is an Angular library shared across all web projects.
   - Shani web repos share CSS/JS by copy-paste. Note: `shani-website` and `shani-wiki` have NO `sw.js`, brand CSS, or nav/content-fetch JS — the shared-shaped files (brand-shani.css, sw.js, nav JS, generate-manifest.js) exist only in `shani-docs` and `shani-blog`. Do NOT copy shared files into website/wiki.
   - **Action**: Create a lightweight shared component library (CSS token file + a few React/Vue components). Or standardize on a CSS framework.

### 🟡 Website-specific

5. **robots.txt, sitemap.xml, and CSP — DEPLOYED (2026-09-17).** Superseded: commit `1608af6` (2026-08-29) committed and pushed all three (robots.txt + sitemap.xml + the CSP meta tag in `index.html`); verified live — `https://shani.dev/robots.txt` serves real content and `curl https://shani.dev/` returns the CSP meta tag. The earlier "not yet deployed" finding #5 is closed.

6. **Version string lockstep** — `assets/js/script.js`'s `VERSION` must match the version strings hardcoded in `index.html` (JSON-LD `softwareVersion`/`datePublished`, download section labels, ISO/SHA256/ASC filenames). Currently all consistent at `2026.05.18`. If you bump the release, grep for the version and update every occurrence, not just the `VERSION` constant.

### 🔍 Re-Scan Findings (2026-09-17)

Re-scanned against `garuda-catalog.md` (29 repos, not 34) and `shani-catalog.md` (16 repos). **Confirmed mapping: `garuda-ng`** — it EXISTS in `garuda-clones/` as an Angular component library (TypeScript, Angular 22, Nx monorepo, pnpm, published as npm `@garudalinux/core`, themed variants catppuccin/dr460nized/vo1ded, its own AnalogJS/Vite docs site, GitHub Actions CI+CD, `renovate.json`, Git-Cliff changelog, GPL-3.0-or-later, v2.0.0 released 2026-08-08). It is the only garuda web-facing repo and the direct reference for the shared-web-code problem. Per this repo's AGENTS.md correction: shani-website is a **single-page marketing site with no `sw.js`, no brand CSS, no nav JS** — the shared-shaped files exist only in `shani-docs`/`shani-blog`.

**New gaps from the garuda side:**
1. **No component library or theme system** — `garuda-ng` ships a full Angular component library with three themed variants (catppuccin, dr460nized, vo1ded); shani-website is one hand-written `style.css` with no reusable components or theming.
2. **No test infrastructure** — `garuda-ng` has Vitest unit tests + Playwright e2e; shani-website has no CI workflows, no pre-commit hooks, no automated checks (confirmed in `shani-catalog.md` §12).
3. **No dependency-update automation** — `garuda-ng` has `renovate.json` (and garuda runs `renovate-runner` hourly org-wide); shani-website has no `renovate.json` and no automated dependency updating.
4. **No changelog/contribution docs** — `garuda-ng` has Git-Cliff changelog, CONTRIBUTING.md, CODE_OF_CONDUCT.md; shani-website has no LICENSE (one of the 4-repo cluster), no CONTRIBUTING, no changelog.
5. **No deploy pipeline** — `garuda-ng` has GitHub Actions CD to Cloudflare Pages (`wrangler.toml`); shani-website has no CD pipeline, but its `robots.txt`/`sitemap.xml`/CSP are now committed and live (finding #5 above, closed 2026-09-17).

**Shani advantages:**
1. **Zero build step, zero runtime dependencies** — no Angular 22/Nx/pnpm/Optimus-UI/catppuccin supply chain to maintain or audit; `garuda-ng` pulls a large modern toolchain for the same "serve a site" outcome.
2. **SRI on CDN links + CSP meta tag** (CSP deployed, commit `1608af6` 2026-08-29) — client-side hardening `garuda-ng`'s docs site doesn't document.
3. **Single-page marketing surface** — smaller attack surface than a component library + docs site + npm package; nothing to publish or keep versioned.

**Qt GUI gap note:** not applicable — this is a static marketing site; garuda's 12 Qt GUI apps are unrelated to web properties.

### 📋 Implementation Roadmap (2026-09-17)

Implementation priorities are per `../IMPLEMENTATION-ROADMAP.md` (master roadmap for the whole shani ecosystem).

1. ~~**Commit `robots.txt` + `sitemap.xml` (P0, 5 min).**~~ **DONE — closed 2026-09-17.** Committed in `1608af6` (2026-08-29) and pushed; `https://shani.dev/robots.txt` and `/sitemap.xml` now serve real content (verified live fetch, not GitHub Pages' 404).

2. ~~**Deploy the CSP meta tag (P1).**~~ **DONE — closed 2026-09-17.** The `<meta http-equiv="Content-Security-Policy">` in `index.html` is committed (`1608af6`) and pushed — `curl https://shani.dev/` confirms the live site ships the CSP meta tag. GitHub Pages can't add response headers, so the meta tag is the only mechanism, and it is deployed.

3. **Add LICENSE (P3, 5 min).** Master-roadmap item #31, not #26 (web-shared-components is #27; #26 is shani-gui welcome content). Match `shani-blog` — the only web sibling with a LICENSE, and it is **MIT** (audit-verified 2026-09-17), not GPL-3.0 — unless the maintainer decides web repos should follow the OS-side GPL-3.0 standard instead; this repo is one of the 4-repo cluster missing it.

4. **CI workflow (P1).** Use `shani-ci-commons` templates (master-roadmap item #7) once they exist: verify HTML validity (html5lib strict parse), SRI hashes on CDN resources, and version lockstep between `assets/js/script.js`'s `VERSION` and the hardcoded strings in `index.html`.

5. **Conventional commits + minimal `renovate.json` (P1).** Ecosystem-wide commit convention (item #9) and Renovate config (item #8) — minimal for a static site with no build step and no runtime dependencies.
