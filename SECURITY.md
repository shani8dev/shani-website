# Security Policy

## Trust Model

`shani-website` is the marketing landing page for Shanios (`shani.dev`). It is
a static HTML site with no authentication, no user data collection, and no
server-side processing.

- **No authentication, no user data.** The site serves public marketing content only.
- **Version string.** The current release version displayed in
  `assets/js/script.js` must match the root `RELEASES.md` — the two are the
  same source of truth.

## Key Security Mechanisms

| Mechanism | Implementation |
|-----------|----------------|
| Static content | No server-side processing; no user input handling |
| CDN integrity | SRI `integrity=` hashes on external CDN tags where configured |

## Known Limitations

- **No CI/CD.** The repo has no automated lint/test/build gating.
- **Version drift.** The version string in `assets/js/script.js` and the root
  `RELEASES.md` must be kept in sync manually — nothing checks automatically.

## Reporting a Vulnerability

If you discover a security vulnerability in any Shanios project, please report it
responsibly by opening a private security advisory on GitHub.

Please include:
- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will acknowledge receipt within 72 hours and provide a detailed response
within 7 days. Thank you for helping keep Shanios secure.
