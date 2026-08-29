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
  file anywhere in the repo, confirmed by direct file check. 11 of 15
  repos in this ecosystem have one; the other 4 (including this one) don't:
  `shani-docs`, `shani-install-media`, `shani-website`, `shani-wiki` — not
  a unique outlier, one of a real cluster. Needs
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
- **`robots.txt` and `sitemap.xml` added — but NOT YET DEPLOYED (real, current production gap).** Both files now exist at repo root (`Allow: /` + `Sitemap:` reference; single-URL sitemap, correct for a true one-page site) — but `git status` shows both as untracked, never committed, and a live fetch of `https://shani.dev/robots.txt` and `/sitemap.xml` both return GitHub Pages' own 404 page as of this check. **Traffic/indexing impact is zero until these are committed and pushed** — don't report this as "done" to anyone relying on the live site without flagging that it isn't live yet.
- **No SRI on the Font Awesome CDN link — FIXED.** `index.html:62` had no `integrity=`. Now has a real `sha384-` hash computed by fetching the exact pinned URL. Also fixed one unrelated bare-`&` HTML defect found while re-validating with html5lib (`index.html:61`'s Google Fonts URL) — re-parsed after both fixes: 0 errors.
- **CSP added, but same not-yet-deployed caveat applies.** `index.html` now has a real `<meta http-equiv="Content-Security-Policy">` (`default-src 'self'` plus explicit allowances for the fonts/Font-Awesome CDN and `downloads.shani.dev`) — but per `git diff HEAD`, this is only in the uncommitted working tree, not in any commit, so the live site currently ships with zero CSP. GitHub Pages still can't add one via response headers (per `CNAME`/`README.md:53`), so the meta tag remains the only mechanism available here once this is actually deployed.
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

Brand CSS and related JS are **copy-pasted** across this repo and its
siblings (`shani-blog`, `shani-docs`, `shani-wiki`) — there is no shared
package. A bug fix in a shared-shaped file here likely exists in the other
three copies too — check before considering it complete. Also: this
repo's version string must match the top-level `RELEASES.md` — a release
bump that updates one without the other is a real, silent drift.

## Where things are documented

`README.md` explains the site's structure and its CNAME/Pages setup.
