# elysasecret.com

Team site for **Elysa's Secret** — Nordic AI Cup 2026
Four first-year bachelor students at the University of Southern Denmark.

Static site. No build step, no framework, no dependencies.

## Files

**Only `public/` is deployed.** Everything else at the root is tooling and
documentation and never reaches the live site.

```
public/            ← this folder is the website
├── index.html     structure + SITE_CONFIG — all data: scores, names, dates
├── i18n.js        all prose, English and Danish
├── styles.css     tokens, layout, motion CSS
├── script.js      rendering, sections, board tabs, language toggle, form
└── motion.js      every animated behaviour, reduced-motion aware

check.js           integrity and honesty checks
smoke.js           render smoke test
shot.js            headless-Chrome screenshots
docs/              the design spec and implementation plan (NOT published)
shots/             screenshots (NOT published, gitignored)
```