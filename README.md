# elysasecret.com

Team site for **Elysa's Secret**, a hackathon team.
Four students at the University of Southern Denmark.

Static site. No build step, no framework, no dependencies.

## Files

**Only `public/` is deployed.** Everything else at the root is tooling and
documentation and never reaches the live site.

```
public/            ← this folder is the website
├── index.html          home: the team, every hackathon with its result, contact
├── nordic-ai-cup.html  Nordic AI Cup: the four, boards, the run, what we learned
├── hyperbloom.html     HyperBloom October: Make-a-Ring
├── config.js      all data: scores, names, dates, links
├── i18n.js        all prose, English and Danish
├── chrome.js      markup every page shares: top bar, footer, mascot
├── styles.css     tokens, layout, motion CSS
├── script.js      rendering, board tabs, language toggle, form
└── motion.js      every animated behaviour, reduced-motion aware

check.js           integrity and honesty checks
smoke.js           render smoke test
shot.js            headless-Chrome screenshots
docs/              the design spec and implementation plan (NOT published)
shots/             screenshots (NOT published, gitignored)
```

## Adding a hackathon

1. Add a card to `hackathons.cards` in `config.js`, newest first, and its strings
   under `hackathons.*` in both languages in `i18n.js`.
2. Add it to `statusRail.items`, and update the counts in `hero.stats` and the
   boot lines.
3. For a page of its own, copy `hyperbloom.html`, give it its own `data-page`,
   and add it to `nav.links` and to `PAGES` in `check.js` and `smoke.js`.

`node check.js` and `node smoke.js` should both pass before anything ships.