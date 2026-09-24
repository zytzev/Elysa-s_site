# Elysa's Secret Team Site — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `elysasecret.com` — a single-page, dark, terminal-themed team site for Elysa's Secret, four first-year SDU students who won 1st place in Denmark at the Nordic AI Cup 2026.

**Architecture:** Static HTML + CSS + vanilla JS, no build step, adapted from `~/Life/Projects/WebDev/Sites-template/` (static version). Data lives in an inline `window.SITE_CONFIG` block; all prose lives in a separate `window.I18N` dictionary in two languages; a template-machinery `script.js` renders both; a separate `motion.js` owns every animated behaviour so reduced-motion handling lives in one place. A dependency-free `check.js` enforces the spec's honesty rules on every run.

**Tech Stack:** HTML5, CSS custom properties, vanilla ES5-style JS (matching the template's style), inline SVG. No frameworks, no bundler, no animation library, no test framework.

**Spec:** `docs/superpowers/specs/2026-09-24-elysasecret-team-site-design.md`

## Global Constraints

Copied verbatim from the spec. Every task's requirements implicitly include this section.

- **Dark theme only.** No light mode, no theme toggle. Single `:root` token set.
- **No build step, no framework, no animation library.** Plain `<script>` tags, no `type="module"`, so the site works when opened as a local file.
- **No photographs.** The design must never render an empty image frame.
- **No `testimonials` section, no `pricing` section, no invented quotes, no invented figures.**
- **Never spell the team name "Secrete".** It is **Elysa's Secret**. `check.js` fails the build on the wrong spelling.
- **Two boards must never be conflated.** Denmark national total is **45.00**; Nordic combined total is **35.97**. Every point column is labelled with the board it belongs to.
- **Every number traces to §2 of the spec.** `check.js` enforces an allowlist.
- **EN + DA**, EN default. Both dictionaries must have identical key sets. Danish is gated on a native-speaker proofread and must never block the English launch.
- **All motion honours `prefers-reduced-motion: reduce`.** No animation carries information alone.
- **WCAG AA contrast**, checked rather than assumed. Visible keyboard focus everywhere.
- **`hello@elysasecret.com`** is the only published contact address. Never one member's personal address.
- Do not read or copy from the template's source project (`crazy-motors`).

---

## File Structure

```
~/Life/Projects/TEAM/
├── index.html      # SITE_CONFIG (data only) + section shells + status rail
├── i18n.js         # window.I18N = { en: {...}, da: {...} } — ALL prose, both languages
├── styles.css      # :root tokens, section styles, motion CSS
├── script.js       # config read, i18n, renderers, section order, nav, language toggle, form
├── motion.js       # countdown, boot typing, scroll-drawn curve, counters, reduced-motion
├── check.js        # dependency-free integrity + honesty checker (node check.js)
├── README.md       # deploy notes, form endpoint, Danish proofread gate
└── docs/superpowers/{specs,plans}/
```

**Why the data/prose split:** scores, names and dates are language-neutral and belong in `SITE_CONFIG`; every human-readable sentence belongs in `I18N`. This means the Danish proofreader reviews exactly one file, and it makes EN/DA key parity mechanically checkable rather than a matter of discipline.

**Why `motion.js` is separate:** six animated behaviours all need the same `prefers-reduced-motion` guard. Scattering them through `script.js` is how one of them ends up unguarded.

---

## Task 1: Skeleton, data config, and the honesty checker

**Files:**
- Create: `check.js`, `index.html`, `i18n.js`, `styles.css`, `script.js`, `README.md`, `.gitignore`

**Interfaces:**
- Consumes: nothing (first task)
- Produces: `window.SITE_CONFIG` shape, `window.I18N` shape, `window.__t(key, lang)` translation helper contract, `check.js` exit code 0/1

- [ ] **Step 1: Initialise the repository**

```bash
cd ~/Life/Projects/TEAM
git init
printf 'node_modules/\n.DS_Store\n' > .gitignore
```

- [ ] **Step 2: Write the failing checker**

Create `check.js`. It loads `index.html` and `i18n.js` in a sandbox the way a browser would, then asserts the spec's invariants.

```js
#!/usr/bin/env node
/* Integrity + honesty checker for elysasecret.com.
   The site has no test framework, so this asserts the invariants the spec
   requires before anything may ship. Run: node check.js
   Exit 0 = pass, exit 1 = fail. */
"use strict";

var fs = require("fs");
var path = require("path");
var vm = require("vm");

var ROOT = __dirname;
var failures = [];
var passed = 0;

function fail(name, detail) {
  failures.push(name + (detail ? "  →  " + detail : ""));
}
function ok() {
  passed++;
}
function read(file) {
  var p = path.join(ROOT, file);
  if (!fs.existsSync(p)) {
    fail("file exists: " + file);
    return null;
  }
  return fs.readFileSync(p, "utf8");
}

/* ---- load config + dictionaries the way the browser does ---------------- */
function loadGlobals() {
  var ctx = { window: {} };
  vm.createContext(ctx);
  var html = read("index.html");
  if (html) {
    var blocks = html.match(/<script>([\s\S]*?)<\/script>/g) || [];
    blocks.forEach(function (b) {
      vm.runInContext(b.replace(/^<script>/, "").replace(/<\/script>$/, ""), ctx);
    });
  }
  var i18n = read("i18n.js");
  if (i18n) vm.runInContext(i18n, ctx);
  return ctx.window;
}

var w = loadGlobals();
var config = w.SITE_CONFIG;
var i18n = w.I18N;

if (!config) fail("SITE_CONFIG present in index.html");
else ok();
if (!i18n) fail("I18N present in i18n.js");
else ok();

/* ---- 1. no bracketed placeholders remain -------------------------------- */
if (config) {
  var ALLOWED_BRACKETS = ["[YEAR]"]; // footer legal token, replaced at render time
  var offenders = [];
  (function walk(node, trail) {
    if (typeof node === "string") {
      var m = node.match(/\[[A-Za-z][^\]]*\]/g) || [];
      m.forEach(function (hit) {
        if (ALLOWED_BRACKETS.indexOf(hit) === -1) offenders.push(trail + " = " + node);
      });
      return;
    }
    if (node && typeof node === "object") {
      Object.keys(node).forEach(function (k) {
        walk(node[k], trail ? trail + "." + k : k);
      });
    }
  })(config, "");
  if (offenders.length) fail("no [bracketed] placeholders in SITE_CONFIG", offenders.join("; "));
  else ok();
}

/* ---- 2. EN and DA key parity -------------------------------------------- */
function flatten(obj, prefix, out) {
  out = out || {};
  Object.keys(obj || {}).forEach(function (k) {
    var v = obj[k];
    var key = prefix ? prefix + "." + k : k;
    if (v && typeof v === "object" && !Array.isArray(v)) flatten(v, key, out);
    else out[key] = v;
  });
  return out;
}
if (i18n && i18n.en && i18n.da) {
  var en = flatten(i18n.en, "");
  var da = flatten(i18n.da, "");
  var missingDa = Object.keys(en).filter(function (k) { return !(k in da); });
  var missingEn = Object.keys(da).filter(function (k) { return !(k in en); });
  if (missingDa.length || missingEn.length) {
    fail("EN/DA key parity", "missing in da: " + missingDa.join(", ") +
      " | missing in en: " + missingEn.join(", "));
  } else ok();
} else if (i18n) {
  fail("I18N has both en and da dictionaries");
}

/* ---- 3. every key referenced by SITE_CONFIG exists in both dictionaries -- */
function collectKeys(node, trail, out) {
  out = out || [];
  if (!node || typeof node !== "object") return out;
  if (typeof node === "string" && trail && /(?:^|\.)(key|labelKey|subKey|titleKey|textKey|logKey|taskKey|noteKey|tagKey)$/.test(trail)) {
    out.push(node);
  }
  Object.keys(node).forEach(function (k) {
    collectKeys(node[k], trail ? trail + "." + k : k, out);
  });
  return out;
}
if (config && i18n && i18n.en && i18n.da) {
  var enFlat = flatten(i18n.en, "");
  var daFlat = flatten(i18n.da, "");
  var referenced = collectKeys(config, "").filter(function (k) { return k.indexOf(".") !== -1; });
  var unresolved = referenced.filter(function (k) { return !(k in enFlat) || !(k in daFlat); });
  if (unresolved.length) fail("every SITE_CONFIG key resolves in both languages", unresolved.join(", "));
  else ok();
}

/* ---- 4. number allowlist — every figure traces to spec §2 ---------------- */
var ALLOWED_NUMBERS = [
  "45.00", "35.97", "36.51", "0.54",
  "12.00", "10.00", "8.00", "0.97", "25.00",
  "1405.256", "0.263", "0.822",
  "344.26", "600", "1128", "1100", "778", "1280", "1576", "1812", "1447",
  "1", "2", "3", "4", "5", "6", "7",
  "2026"
];
function numericFields(node, trail, out) {
  out = out || [];
  if (typeof node === "string" && trail && /(?:^|\.)(value|raw|points|total|place)$/.test(trail)) out.push(node);
  if (node && typeof node === "object") {
    Object.keys(node).forEach(function (k) { numericFields(node[k], trail ? trail + "." + k : k, out); });
  }
  return out;
}
if (config) {
  var bad = numericFields(config, "").filter(function (v) { return ALLOWED_NUMBERS.indexOf(v) === -1; });
  if (bad.length) fail("every figure traces to spec §2", bad.join(", "));
  else ok();
}

/* ---- 5. sections[] only names shells that exist -------------------------- */
var html = read("index.html") || "";
var shellIds = (html.match(/data-section="([a-z-]+)"/g) || []).map(function (s) {
  return s.replace(/data-section="|"/g, "");
});
if (config && config.sections) {
  var ghost = config.sections.filter(function (s) { return shellIds.indexOf(s) === -1; });
  if (ghost.length) fail("sections[] only lists shells present in index.html", ghost.join(", "));
  else ok();
}

/* ---- 6. nav links point at active sections ------------------------------ */
if (config && config.nav && config.sections) {
  var badNav = (config.nav.links || []).filter(function (l) {
    return config.sections.indexOf(String(l.href).replace("#", "")) === -1;
  });
  if (badNav.length) fail("nav links match active sections", badNav.map(function (l) { return l.href; }).join(", "));
  else ok();
}

/* ---- 7. forbidden words ------------------------------------------------- */
var banned = [
  { word: /Secrete/i, why: "team name is Elysa's Secret (spec §2)" },
  { word: /\[Your |\[Feature|\[Item |\[Eyebrow/i, why: "template placeholder text" },
  { word: /crazy-motors/i, why: "template source project leak" }
];
banned.forEach(function (b) {
  var sources = { "index.html": html, "i18n.js": read("i18n.js") || "", "styles.css": read("styles.css") || "" };
  var hits = Object.keys(sources).filter(function (f) { return b.word.test(sources[f]); });
  if (hits.length) fail("no forbidden string (" + b.why + ")", hits.join(", "));
  else ok();
});

/* ---- 8. required files exist ------------------------------------------- */
["index.html", "i18n.js", "styles.css", "script.js", "motion.js", "README.md"].forEach(function (f) {
  if (fs.existsSync(path.join(ROOT, f))) ok();
  else fail("required file present: " + f);
});

/* ---- report ------------------------------------------------------------- */
console.log("\n  elysasecret.com — integrity check\n");
if (failures.length) {
  console.log("  FAILED  " + failures.length + "  (passed " + passed + ")\n");
  failures.forEach(function (f) { console.log("    ✗ " + f); });
  console.log("");
  process.exit(1);
}
console.log("  ✓ all " + passed + " checks passed\n");
process.exit(0);
```

- [ ] **Step 3: Run the checker to verify it fails**

Run: `node check.js`
Expected: FAIL — `file exists: index.html`, `required file present: i18n.js`, and friends. Non-zero exit.

- [ ] **Step 4: Create `index.html`** — config block, shells, status rail

The config holds **data only**. Every user-visible sentence is a key resolved through `I18N`.

```html
<!doctype html>
<!-- Elysa's Secret — Nordic AI Cup 2026. Content lives in SITE_CONFIG (data)
     and i18n.js (all prose, EN + DA). Never hard-code copy in this file. -->
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Elysa's Secret</title>
    <meta name="description" content="Nordic AI Cup 2026 — 1st place, Denmark. Four first-year students from the University of Southern Denmark." />
    <meta name="color-scheme" content="dark" />
    <link rel="stylesheet" href="styles.css" />
  </head>

  <body>
    <script>
      window.SITE_CONFIG = {
        sections: ["hero", "team", "board", "run", "about", "learned", "contact"],

        brand: { name: "Elysa's Secret", logo: "" },

        /* score is 1 on purpose — it is the one "unflattering" number the
           spec requires to stay visible (Drone Flyby, 0.97 points) */
        statusRail: {
          items: [
            { key: "rail.dkLabel", value: "45.00", tone: "good" },
            { key: "rail.dkPlace", value: "1st", tone: "good" },
            { key: "rail.nordicLabel", value: "35.97", tone: "plain" },
            { key: "rail.nordicPlace", value: "2nd", tone: "plain" },
            { key: "rail.gapLabel", value: "-0.54", tone: "warn" }
          ],
          countdownTo: "2026-10-14T09:00:00Z",
          countdownKey: "rail.countdown"
        },

        nav: {
          links: [
            { key: "nav.team", href: "#team" },
            { key: "nav.board", href: "#board" },
            { key: "nav.run", href: "#run" },
            { key: "nav.learned", href: "#learned" },
            { key: "nav.about", href: "#about" }
          ],
          cta: { key: "nav.contact", href: "#contact" }
        },

        hero: {
          command: "elysa --status",
          stats: [
            { key: "hero.place", value: "1st", subKey: "hero.placeSub" },
            { key: "hero.points", value: "45.00", subKey: "hero.pointsSub" },
            { key: "hero.final", value: "35.97", subKey: "hero.finalSub" }
          ],
          ctas: [
            { key: "hero.ctaPrimary", href: "#run", variant: "primary" },
            { key: "hero.ctaSecondary", href: "#contact", variant: "secondary" }
          ]
        },

        team: {
          members: [
            {
              name: "Alexandru Zaitzev", monogram: "AZ",
              taskKey: "team.alex.task", logKey: "team.alex.log",
              raw: "1405.256", points: "10.00", pointsBoard: "nordic"
            },
            {
              name: "Jakub Furmaniuk", monogram: "JF",
              taskKey: "team.jakub.task", logKey: "team.jakub.log",
              raw: "0.822", points: "25.00", pointsBoard: "both", badgeKey: "team.jakub.badge"
            },
            {
              name: "Javier Arévalo Hernández", monogram: "JA",
              taskKey: "team.javier.task", logKey: "team.javier.log",
              raw: "0.263", points: "0.97", pointsBoard: "nordic"
            },
            {
              name: "Franciszek Kossut", monogram: "FK",
              taskKey: "team.franek.task", logKey: "team.franek.log",
              raw: "778", points: "1280", pointsBoard: "nordic"
            }
          ]
        },

        /* Two boards, never conflated. Each row: cells are
           [survival, drone, medical], each { raw, points }. */
        board: {
          tabs: [
            { id: "dk", key: "board.tabDk", active: true },
            { id: "nordic", key: "board.tabNordic", active: false }
          ],
          columns: [
            { key: "board.colSurvival" },
            { key: "board.colDrone" },
            { key: "board.colMedical" }
          ],
          boards: {
            dk: {
              captionKey: "board.captionDk",
              rows: [
                { place: "1", name: "Elysa's Secret", orgKey: "board.orgSdu", highlight: true,
                  cells: [{ raw: "1405.256", points: "12.00" }, { raw: "0.263", points: "8.00" }, { raw: "0.822", points: "25.00" }], total: "45.00" },
                { place: "2", name: "Ålle", orgKey: "board.orgDtu",
                  cells: [{ raw: "968.559", points: "2.00" }, { raw: "0.379", points: "25.00" }, { raw: "0.790", points: "12.00" }], total: "39.00" },
                { place: "3", name: "Powered by Smørrebrød", orgKey: "board.orgDtu",
                  cells: [{ raw: "43061.384", points: "18.00" }, { raw: "0.314", points: "15.00" }, { raw: "0.781", points: "6.00" }], total: "39.00" },
                { place: "4", name: "Backprop Boys", orgKey: "board.orgDtu",
                  cells: [{ raw: "48236.876", points: "25.00" }, { raw: "0.307", points: "12.00" }, { raw: "0.749", points: "0.92" }], total: "37.92" },
                { place: "5", name: "CarlN", orgKey: "board.orgDtu",
                  cells: [{ raw: "1958.138", points: "15.00" }, { raw: "0.156", points: "1.00" }, { raw: "0.803", points: "18.00" }], total: "34.00" },
                { place: "6", name: "Elemental hero", orgKey: "board.orgAalborg",
                  cells: [{ raw: "1024.117", points: "6.00" }, { raw: "0.302", points: "10.00" }, { raw: "0.798", points: "15.00" }], total: "31.00" },
                { place: "7", name: "Lisan al-Gaibs", orgKey: "board.orgDtu",
                  cells: [{ raw: "821.498", points: "0.88" }, { raw: "0.360", points: "18.00" }, { raw: "0.771", points: "2.00" }], total: "20.88" }
              ]
            },
            nordic: {
              captionKey: "board.captionNordic",
              rows: [
                { place: "1", name: "Ifftikhar Amiri", orgKey: "board.orgNmbu",
                  cells: [{ raw: "800.203", points: "0.51" }, { raw: "0.396", points: "18.00" }, { raw: "0.808", points: "18.00" }], total: "36.51" },
                { place: "2", name: "Elysa's Secret", orgKey: "board.orgSdu", highlight: true,
                  cells: [{ raw: "1405.256", points: "10.00" }, { raw: "0.263", points: "0.97" }, { raw: "0.822", points: "25.00" }], total: "35.97" },
                { place: "3", name: "cosearch", orgKey: "board.orgNtnu",
                  cells: [{ raw: "766.052", points: "0.44" }, { raw: "0.666", points: "25.00" }, { raw: "0.797", points: "6.00" }], total: "31.44" },
                { place: "4", name: "CarlN", orgKey: "board.orgDtu",
                  cells: [{ raw: "1958.138", points: "15.00" }, { raw: "0.156", points: "0.83" }, { raw: "0.803", points: "15.00" }], total: "30.83" },
                { place: "5", name: "Backprop Boys", orgKey: "board.orgDtu",
                  cells: [{ raw: "48236.876", points: "25.00" }, { raw: "0.307", points: "4.00" }, { raw: "0.749", points: "0.69" }], total: "29.69" },
                { place: "6", name: "Powered by Smørrebrød", orgKey: "board.orgDtu",
                  cells: [{ raw: "43061.384", points: "18.00" }, { raw: "0.314", points: "6.00" }, { raw: "0.781", points: "0.92" }], total: "24.92" },
                { place: "7", name: "Ålle", orgKey: "board.orgDtu",
                  cells: [{ raw: "968.559", points: "0.79" }, { raw: "0.379", points: "15.00" }, { raw: "0.790", points: "4.00" }], total: "19.79" }
              ]
            }
          },
          gapNote: { leader: "Ifftikhar Amiri", value: "0.54", key: "board.gap" }
        },

        /* The curve. `kind` is load-bearing: it is what keeps the chart from
           implying these were all the same measurement. */
        run: {
          points: [
            { value: 344.26, kind: "local",      labelKey: "run.p1", noteKey: "run.p1note" },
            { value: 600,    kind: "local",      labelKey: "run.p2", noteKey: null, approx: true },
            { value: 1128,   kind: "local",      labelKey: "run.p3", noteKey: "run.p3note", approx: true },
            { value: 778,    kind: "validation", labelKey: "run.p4", noteKey: "run.p4note" },
            { value: 1280,   kind: "validation", labelKey: "run.p5", noteKey: "run.p5note" },
            { value: 1576,   kind: "validation", labelKey: "run.p6", noteKey: null },
            { value: 1812,   kind: "validation", labelKey: "run.p7", noteKey: "run.p7note" }
          ],
          evaluated: { value: "1405.256", key: "run.evaluated", noteKey: "run.evaluatedNote" },
          median: { value: "1447", key: "run.median" }
        },

        about: {
          loop: [
            { key: "about.loop.idea" }, { key: "about.loop.implement" },
            { key: "about.loop.run" }, { key: "about.loop.wait" },
            { key: "about.loop.score" }, { key: "about.loop.analyze" },
            { key: "about.loop.change" }
          ]
        },

        learned: {
          cards: [
            { icon: "gear", titleKey: "learned.1.title", textKey: "learned.1.text" },
            { icon: "chart", titleKey: "learned.2.title", textKey: "learned.2.text" },
            { icon: "check", titleKey: "learned.3.title", textKey: "learned.3.text" },
            { icon: "shield", titleKey: "learned.4.title", textKey: "learned.4.text" },
            { icon: "zap", titleKey: "learned.5.title", textKey: "learned.5.text" }
          ]
        },

        contact: {
          email: "hello@elysasecret.com",
          fields: ["name", "email", "message", "consent"],
          endpoint: "",
          doors: [
            { titleKey: "doors.sponsor.title", textKey: "doors.sponsor.text", mailSubject: "Sponsorship" },
            { titleKey: "doors.roster.title", textKey: "doors.roster.text", mailSubject: "Joining" }
          ]
        },

        footer: { socials: [] }   /* empty until the team supplies handles */
      };
    </script>

    <!-- ============================================================
         SLOT: status rail — pinned, always visible, real state
         ============================================================ -->
    <div class="rail" data-slot="rail" data-fill="rail.items">
      <div class="rail__inner container">
        <span class="rail__items"></span>
        <span class="rail__right">
          <span class="rail__countdown" data-slot="countdown"></span>
          <span class="lang" role="group" aria-label="Language">
            <button type="button" class="lang__btn" data-lang="en" aria-pressed="true">EN</button>
            <button type="button" class="lang__btn" data-lang="da" aria-pressed="false">DA</button>
          </span>
        </span>
      </div>
    </div>

    <a class="skip-link" href="#main">Skip to content</a>

    <header class="site-header" data-slot="header">
      <div class="container site-header__inner">
        <a class="site-header__brand" href="#top" data-close-menu>
          <span class="site-header__logo" data-fill="brand.logo"></span>
          <span class="site-header__name" data-fill="brand.name"></span>
        </a>
        <nav class="site-header__nav" aria-label="Main navigation" data-fill="nav.links"></nav>
        <span class="site-header__cta" data-fill="nav.cta"></span>
        <button class="site-header__toggle" type="button" data-slot="nav-toggle" aria-label="Toggle menu" aria-expanded="false">
          <span class="site-header__toggle-bar"></span>
          <span class="site-header__toggle-bar"></span>
          <span class="site-header__toggle-bar"></span>
        </button>
      </div>
    </header>

    <main id="main">
      <!-- SLOT: hero — the boot sequence -->
      <section id="hero" class="section section--hero" data-section="hero">
        <div class="container hero__inner">
          <p class="hero__prompt"><span class="hero__sigil" aria-hidden="true">$</span> <span data-slot="typed" data-fill="hero.command"></span><span class="caret" aria-hidden="true"></span></p>
          <h1 class="hero__headline" data-fill="hero.headline"></h1>
          <p class="hero__sub" data-fill="hero.sub"></p>
          <dl class="hero__stats" data-fill="hero.stats"></dl>
          <div class="hero__ctas" data-fill="hero.ctas"></div>
        </div>
      </section>

      <!-- SLOT: team — four panes, no photographs -->
      <section id="team" class="section section--team" data-section="team">
        <div class="container">
          <div class="section__heading">
            <h2 class="section__title" data-fill="team.heading"></h2>
            <p class="section__sub" data-fill="team.sub"></p>
          </div>
          <div class="team__grid" data-fill="team.members"></div>
        </div>
      </section>

      <!-- SLOT: board — two leaderboards, tabbed -->
      <section id="board" class="section section--board" data-section="board">
        <div class="container">
          <div class="section__heading">
            <h2 class="section__title" data-fill="board.heading"></h2>
            <p class="section__sub" data-fill="board.sub"></p>
          </div>
          <div class="board__tabs" role="tablist" data-slot="board-tabs"></div>
          <div class="board__table" data-slot="board-table"></div>
          <p class="board__gap" data-slot="board-gap"></p>
        </div>
      </section>

      <!-- SLOT: run — the animated score curve -->
      <section id="run" class="section section--run" data-section="run">
        <div class="container">
          <div class="section__heading">
            <h2 class="section__title" data-fill="run.heading"></h2>
            <p class="section__sub" data-fill="run.sub"></p>
          </div>
          <figure class="run__figure">
            <svg class="run__svg" data-slot="run-svg" viewBox="0 0 800 360" role="img" aria-labelledby="run-svg-title run-svg-desc" preserveAspectRatio="xMidYMid meet">
              <title id="run-svg-title"></title>
              <desc id="run-svg-desc"></desc>
            </svg>
            <ol class="run__legend" data-slot="run-legend"></ol>
            <figcaption class="run__caption" data-slot="run-caption"></figcaption>
          </figure>
          <div class="run__closing" data-slot="run-closing"></div>
        </div>
      </section>

      <!-- SLOT: about — how we work -->
      <section id="about" class="section section--about" data-section="about">
        <div class="container">
          <div class="section__heading">
            <h2 class="section__title" data-fill="about.heading"></h2>
          </div>
          <ol class="loop" data-fill="about.loop"></ol>
          <div class="about__text" data-fill="about.text"></div>
        </div>
      </section>

      <!-- SLOT: learned — five principles -->
      <section id="learned" class="section section--learned" data-section="learned">
        <div class="container">
          <div class="section__heading">
            <h2 class="section__title" data-fill="learned.heading"></h2>
            <p class="section__sub" data-fill="learned.sub"></p>
          </div>
          <div class="features__grid" data-fill="learned.cards"></div>
        </div>
      </section>

      <!-- SLOT: contact — two doors + form -->
      <section id="contact" class="section section--contact" data-section="contact">
        <div class="container">
          <div class="section__heading">
            <h2 class="section__title" data-fill="contact.heading"></h2>
          </div>
          <div class="doors" data-fill="contact.doors"></div>
          <div class="contact__inner">
            <div class="contact__info" data-fill="contact.info"></div>
            <form class="contact__form" data-slot="contact-form" data-fill="contact.fields" novalidate>
              <!-- fields injected by script.js from config.contact.fields -->
            </form>
          </div>
        </div>
      </section>
    </main>

    <footer class="site-footer" data-slot="footer">
      <div class="container">
        <div class="footer__grid">
          <div class="footer__brand">
            <a class="footer__logo" href="#top">
              <span class="site-header__logo" data-fill="brand.logo"></span>
              <span class="site-header__name" data-fill="brand.name"></span>
            </a>
            <p class="footer__tagline" data-fill="footer.tagline"></p>
          </div>
          <div class="footer__socials" data-fill="footer.socials"></div>
        </div>
        <div class="footer__bottom">
          <p data-fill="footer.legal"></p>
        </div>
      </div>
    </footer>

    <script src="i18n.js"></script>
    <script src="script.js"></script>
    <script src="motion.js"></script>
  </body>
</html>
```

- [ ] **Step 5: Create `i18n.js`** with the complete English dictionary

English is fully locked here. Danish mirrors the identical key set (Step 6).

```js
/* Every user-visible sentence on elysasecret.com, in both languages.
   Danish must mirror the English key set exactly — check.js enforces it.
   Never put a score, name or date in this file; those live in SITE_CONFIG. */
window.I18N = {
  en: {
    rail: {
      dkLabel: "DK",
      dkPlace: "1st",
      nordicLabel: "NORDIC",
      nordicPlace: "2nd",
      gapLabel: "gap to NO",
      countdown: "Reykjavík final in"
    },
    nav: {
      team: "The four",
      board: "The board",
      run: "The run",
      learned: "What we learned",
      about: "How we work",
      contact: "Contact"
    },
    hero: {
      headline: "First place. Denmark.",
      sub: "Four first-year students, seven days of preparation, and a simulator that turned out not to be deterministic. Nordic AI Cup 2026 — now on to Reykjavík.",
      place: "National result",
      placeSub: "Nordic AI Cup 2026",
      points: "Danish total",
      pointsSub: "Survival Simulator · Drone Flyby · Medical Appointment",
      final: "Nordic combined",
      finalSub: "0.54 points off the lead",
      ctaPrimary: "See how it ran",
      ctaSecondary: "Get in touch"
    },
    team: {
      heading: "The four",
      sub: "Four first-year bachelor students at the University of Southern Denmark. None of us had competed in an ML competition before.",
      "alex.task": "Survival Simulator",
      "alex.log": "Evolutionary heuristic search over thousands of candidates.",
      "jakub.task": "Medical Appointment",
      "jakub.log": "The highest Medical Appointment score in the entire Nordic field.",
      "jakub.badge": "Best Medical Appointment in the Nordics",
      "javier.task": "Drone Flyby",
      "javier.log": "Our weakest task. Stated, not hidden — the place was never the point.",
      "franek.task": "Support / unblocker",
      "franek.log": "Built an alternative controller in one long session. It went 778 → 1280 and turned the run around."
    },
    board: {
      heading: "The board",
      sub: "Three tasks, scored within their own competition — which is why the same task is worth different points on the two boards.",
      tabDk: "Denmark",
      tabNordic: "Nordic",
      colSurvival: "Survival Simulator",
      colDrone: "Drone Flyby",
      colMedical: "Medical Appointment",
      captionDk: "Danish national round — each country scored as its own competition.",
      captionNordic: "Nordic combined — every team from every national round, ranked together.",
      gap: "Second in the Nordics, 0.54 points behind Ifftikhar Amiri of Norway.",
      orgSdu: "University of Southern Denmark",
      orgDtu: "Technical University of Denmark",
      orgAalborg: "Aalborg University",
      orgNmbu: "Norwegian University of Life Sciences",
      orgNtnu: "NTNU",
      rank: "Rank",
      team: "Team",
      total: "Total",
      raw: "raw"
    },
    run: {
      heading: "The run",
      sub: "Four days, thousands of simulations, and a score that refused to move for three of them.",
      p1: "First heuristic controller",
      p1note: "Survival Simulator, first local score.",
      p2: "Heuristics improved",
      p3: "Plateau",
      p3note: "Three days stuck here. Evolutionary search, thousands of simulations, no progress.",
      p4: "A teammate's controller",
      p4note: "Built from scratch in one long session. First validation, through a Cloudflare tunnel.",
      p5: "Moved to a VPS",
      p5note: "Relocated next to the grader. The network path had been part of the budget all along.",
      p6: "Next validation",
      p7: "Highest validation",
      p7note: "The number everyone remembers. It is not the number that counted.",
      evaluated: "Final evaluated score",
      evaluatedNote: "What actually counted. A validation peak is not a result — and reproducibility, not luck, is what carried it there.",
      median: "Median validation attempt",
      local: "Local",
      validation: "Validation",
      svgTitle: "Score progression across the Nordic AI Cup, from 344 to 1812",
      svgDesc: "A line chart of the team's controller score over four days. It rises from 344 to about 1128, dips to 778 when a teammate's controller is first tested, then climbs to 1812.",
      legend: "Each point is labelled with what it measured — local simulation or validation run."
    },
    about: {
      heading: "How we work",
      text: "We worked out of one room. House music, snacks everywhere, four laptops, experiments running continuously, and someone always saying \"let me try\". Several nights we stopped around 5 AM. The loop never changed: idea, implement, run, wait, check the score, analyse, change something, run it again. What mattered was not that everyone worked hard — it was that everyone was still working hard at the same time. When one of us was stuck, another could attack the problem from a completely different direction.",
      "loop.idea": "Idea",
      "loop.implement": "Implement",
      "loop.run": "Run",
      "loop.wait": "Wait",
      "loop.score": "Check score",
      "loop.analyze": "Analyse",
      "loop.change": "Change something"
    },
    learned: {
      heading: "What we learned",
      sub: "Five things the four days actually taught us.",
      "1.title": "Optimise the actual bottleneck",
      "1.text": "Our instinct was to improve the model. The first real bottleneck was the network path and a cumulative 600-second budget that counted the round trip. The system around the model mattered more than the model.",
      "2.title": "A high validation score is not a good controller",
      "2.text": "On a simulator that is not deterministic, a controller can post an unusually strong run without being robust. The question that matters is whether the result can be reproduced.",
      "3.title": "Determinism is the experiment",
      "3.text": "Same seed, same behaviour. Without that, evolutionary search optimises simulation noise — candidates look better or worse for reasons that have nothing to do with them.",
      "4.title": "Evaluation parity",
      "4.text": "Local, validation and evaluation must behave alike. Differences in seeds, timing, ordering or network latency distort everything you optimise against.",
      "5.title": "The simplest mechanism that works",
      "5.text": "We added a recurrent network to correct the heuristic. Thousands of simulations bought roughly five percent. The plain heuristic stayed competitive."
    },
    doors: {
      sponsor: {
        title: "For sponsors and SDU",
        text: "We are four first-year students representing the University of Southern Denmark at the Nordic final in Reykjavík on 14–15 October, against the national champions of Sweden, Norway, Finland and Iceland. We are looking for support with travel and compute — and we are happy to explain exactly what we built and how we measured it."
      },
      roster: {
        title: "For next season's roster",
        text: "We are not looking for the most experienced people. We are looking for people who stay on a problem past the point where it stops being fun. If that is you, write to us and tell us what you are working on."
      },
      mailSubject: "Subject"
    },
    contact: {
      heading: "Get in touch",
      email: "Email",
      name: "Your name",
      namePlaceholder: "First and last name",
      emailField: "Email",
      emailPlaceholder: "you@example.com",
      message: "Message",
      messagePlaceholder: "What would you like to ask us?",
      consent: "I agree that Elysa's Secret may use this information to respond.",
      submit: "Send",
      sending: "Sending…",
      sent: "Thank you — your message was sent.",
      simulated: "Thank you — your message was recorded. (No endpoint configured yet.)",
      error: "Something went wrong. Please try again, or email us directly."
    },
    footer: {
      tagline: "Nordic AI Cup 2026 — 1st place, Denmark. University of Southern Denmark.",
      legal: "[YEAR] Elysa's Secret. University of Southern Denmark."
    }
  },

  /* Danish mirrors the exact same key set. Authored at implementation time,
     then reviewed by a native Danish speaker at SDU before the DA launch. */
  da: {}
};
```

- [ ] **Step 6: Write the Danish dictionary**

Replace `da: {}` with a full Danish translation mirroring every key in `en`. `check.js` fails until every key is present — use it as the worklist.

Rules for the Danish text:
- Keep the team name, task names, university names, place names and all numbers as-is.
- Translate sentences, not words. `"Four days, thousands of simulations"` should read like Danish, not like English in Danish clothes.
- Where the English is deliberately blunt (*"Our weakest task"*), keep the Danish equally blunt. Do not soften it.
- Mark the file with a `/* DA: proofread pending — see README */` comment at the top until a native speaker signs off.

- [ ] **Step 7: Create `motion.js`** (skeleton) so `check.js` finds the file

```js
/* All animated behaviour for elysasecret.com lives here, so that the
   prefers-reduced-motion guard is applied in exactly one place. */
(function () {
  "use strict";

  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.SiteMotion = {
    reduced: REDUCED,
    /* filled in by later tasks */
    startCountdown: function () {},
    startCurve: function () {},
    typeCommand: function () {}
  };
})();
```

- [ ] **Step 8: Create `README.md`**

```markdown
# elysasecret.com

Team site for Elysa's Secret — Nordic AI Cup 2026, 1st place (Denmark).

## Files
- `index.html` — structure + `SITE_CONFIG` (all data: scores, names, dates)
- `i18n.js` — all prose, English and Danish
- `styles.css` — tokens and layout
- `script.js` — rendering, language toggle, nav, form
- `motion.js` — every animated behaviour, reduced-motion aware
- `check.js` — integrity and honesty checks

## Before every commit
    node check.js

## Before launch
- [ ] `check.js` passes
- [ ] Danish proofread by a native speaker (see below)
- [ ] Contact form endpoint set in `SITE_CONFIG.contact.endpoint`
- [ ] `hello@elysasecret.com` created via Cloudflare Email Routing
- [ ] All four members confirmed their name may be published

## Danish
`i18n.js` ships `da: {}` as a stub. Fill it, then have a Danish speaker at SDU
review the whole file. Until that happens the site runs English-only and the
DA button can be hidden by removing the `[data-lang="da"]` button in `index.html`.

## Deploy — Cloudflare Pages
1. Push this repository to GitHub.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → connect the repo.
3. Build command: *(none)*. Output directory: `/`.
4. Custom domain: `elysasecret.com`.

No VPS. There is no server process and no state to run.
```

- [ ] **Step 9: Create `styles.css` with the dark tokens**

```css
:root {
  --canvas:      #0B0C0E;
  --surface:     #121417;
  --surface-2:   #171A1E;
  --ink:         #E8EAED;
  --ink-muted:   #9BA1AA;
  --line:        #23272C;

  --accent:      #5CE1A0;   /* phosphor green — successes, the team's own numbers */
  --warn:        #F2B455;   /* amber — reserved for unflattering numbers */
  --dk:          #C8102E;   /* Danish red — used exactly once */

  --font-mono: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  --font-body: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;

  --page: 72rem;
  --section: 6rem;
  --radius: 2px;
}
```

- [ ] **Step 10: Create `script.js`** (skeleton) so `check.js` finds it

```js
(function () {
  "use strict";
  window.SITE_CONFIG = window.SITE_CONFIG || {};
})();
```

- [ ] **Step 11: Run the checker to verify it passes**

Run: `node check.js`
Expected: `✓ all N checks passed`. If EN/DA parity fails, finish Step 6.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: project skeleton, data config, i18n, integrity checker"
```

---

## Task 2: Translation machinery, status rail, live countdown

**Files:**
- Modify: `index.html` (rail markup already present), `script.js`, `motion.js`, `styles.css`

**Interfaces:**
- Consumes: `window.SITE_CONFIG`, `window.I18N`, `window.SiteMotion.reduced`
- Produces: `t(key)` inside `script.js`; `renderAll(root)`; `mountRail()`; `window.SiteMotion.startCountdown(el, isoString, label)`

- [ ] **Step 1: Add the i18n layer to `script.js`**

Replace the skeleton with the template's machinery plus translation. Keep the template's `esc`, `at`, `icon`/`ICONS`, `renderAll`, `orderSections`, `wireNav` and `attachFormHandler` **verbatim** from `/Users/zaitzev/Life/Projects/WebDev/Sites-template/script.js` (they are correct and proven); the changes below are additions.

```js
(function () {
  "use strict";

  var config = window.SITE_CONFIG || {};
  var dict = window.I18N || { en: {}, da: {} };
  var LANG_KEY = "elysasecret.lang";

  /* Language: stored preference wins, then browser language, then English. */
  function readStoredLang() {
    try {
      var v = window.localStorage.getItem(LANG_KEY);
      return v === "en" || v === "da" ? v : null;
    } catch (e) {
      return null; /* private mode, blocked storage — fall through */
    }
  }
  function storeLang(v) {
    try { window.localStorage.setItem(LANG_KEY, v); } catch (e) { /* non-fatal */ }
  }
  function detectLang() {
    var stored = readStoredLang();
    if (stored) return stored;
    return String(navigator.language || "").toLowerCase().indexOf("da") === 0 ? "da" : "en";
  }

  var lang = detectLang();

  /* t() resolves a dotted key in the active language and falls back to
     English, so a missing Danish string can never render as a blank. */
  function t(key) {
    if (!key) return "";
    var parts = key.split(".");
    function dig(root) {
      return parts.reduce(function (node, p) {
        return node == null ? undefined : node[p];
      }, root);
    }
    var value = dig(dict[lang]);
    if (value === undefined) value = dig(dict.en);
    return value === undefined ? "" : value;
  }

  /* Every data-fill key that names a translation rather than a raw value.
     Any element whose data-fill ends in one of these is filled with t(). */
  var TEXT_KEYS = /(?:^|\.)(heading|sub|text|tagline|legal|title|badge|note|caption|label|command)$/;
```

Then `renderAll` gains one branch before its default:

```js
  function renderAll(root) {
    var nodes = root.querySelectorAll("[data-fill]");
    Array.prototype.forEach.call(nodes, function (el) {
      var key = el.getAttribute("data-fill");
      if (RENDERERS[key]) {
        RENDERERS[key](el, config);
      } else if (TEXT_KEYS.test(key)) {
        el.textContent = t(key);
      } else {
        el.textContent = at(config, key) ?? "";
      }
    });
  }
```

- [ ] **Step 2: Add the rail renderer**

```js
    "rail.items": function (el, c) {
      var rail = c.statusRail || {};
      el.innerHTML = (rail.items || [])
        .map(function (item) {
          return (
            '<span class="rail__item rail__item--' + esc(item.tone || "plain") + '">' +
            '<span class="rail__key">' + esc(t(item.key)) + "</span>" +
            '<span class="rail__value">' + esc(item.value) + "</span>" +
            "</span>"
          );
        })
        .join("");
    },
```

- [ ] **Step 3: Translate the three template renderers that read a label**

The template hard-codes `link.label` / `cta.label`. This site's config stores a **key** instead, because nav labels are prose. Replace those three renderers:

```js
    "nav.links": function (el, c) {
      el.innerHTML = (c.nav.links || [])
        .map(function (link) {
          return '<a href="' + esc(link.href) + '" data-close-menu>' + esc(t(link.key)) + "</a>";
        })
        .join("");
    },

    "nav.cta": function (el, c) {
      var cta = c.nav.cta;
      el.innerHTML = cta
        ? '<a class="btn btn--primary" href="' + esc(cta.href) + '">' + esc(t(cta.key)) + "</a>"
        : "";
    },

    "hero.ctas": function (el, c) {
      el.innerHTML = (c.hero.ctas || [])
        .map(function (cta) {
          var variant = cta.variant === "secondary" ? "btn--secondary" : "btn--primary";
          return '<a class="btn ' + variant + '" href="' + esc(cta.href) + '">' + esc(t(cta.key)) + "</a>";
        })
        .join("");
    },
```

`brand.logo` keeps the template's version unchanged — it reads `brand.name` and `brand.logo`, both of which stay literal in config.

- [ ] **Step 4: Add the countdown to `motion.js`**

```js
  window.SiteMotion.startCountdown = function (el, iso, label) {
    if (!el) return;
    var target = new Date(iso).getTime();
    if (isNaN(target)) { el.textContent = ""; return; }

    function days() {
      return Math.max(0, Math.ceil((target - Date.now()) / 86400000));
    }
    function paint() {
      var d = days();
      el.textContent = label + " " + d + (d === 1 ? " day" : " days");
    }
    paint();
    if (REDUCED) return;              /* static value, no ticking */
    window.setInterval(paint, 60000); /* once a minute is plenty */
  };
```

- [ ] **Step 5: Wire the rail in the boot sequence**

At the end of `boot()` in `script.js`:

```js
    var railItems = document.querySelector('[data-slot="rail"] .rail__items');
    if (railItems) RENDERERS["rail.items"](railItems, config);

    var countdownEl = document.querySelector('[data-slot="countdown"]');
    if (countdownEl && window.SiteMotion) {
      window.SiteMotion.startCountdown(
        countdownEl,
        config.statusRail.countdownTo,
        t(config.statusRail.countdownKey)
      );
    }
```

- [ ] **Step 6: Style the rail**

```css
.rail {
  position: sticky;
  top: 0;
  z-index: 60;
  background: var(--canvas);
  border-bottom: 1px solid var(--line);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.04em;
}
.rail__inner { display: flex; align-items: center; justify-content: space-between; gap: 1rem; min-height: 2.5rem; flex-wrap: wrap; }
.rail__items { display: flex; gap: 1.25rem; flex-wrap: wrap; }
.rail__item { display: inline-flex; gap: 0.4rem; align-items: baseline; }
.rail__key { color: var(--ink-muted); }
.rail__value { font-variant-numeric: tabular-nums; }
.rail__item--good .rail__value { color: var(--accent); }
.rail__item--warn .rail__value { color: var(--warn); }
.rail__right { display: flex; align-items: center; gap: 1rem; }
.rail__countdown { color: var(--ink-muted); }
.lang__btn {
  font: inherit; color: var(--ink-muted); background: none;
  border: 1px solid var(--line); border-radius: var(--radius);
  padding: 0.15rem 0.45rem; cursor: pointer;
}
.lang__btn[aria-pressed="true"] { color: var(--canvas); background: var(--accent); border-color: var(--accent); }
.lang__btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
```

- [ ] **Step 7: Verify**

Run: `node check.js` — expect pass.
Serve and open: `python3 -m http.server 8000` then visit `http://localhost:8000`.
Expected: dark page, pinned rail reading `DK 45.00 · 1st · NORDIC 35.97 · 2nd · gap to NO -0.54`, amber on `-0.54`, green on the two Danish values, and `Reykjavík final in N days` with today = 2026-09-24 → **20 days**.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: i18n layer, pinned status rail with live countdown"
```

---

## Task 3: Boot hero

**Files:** Modify `script.js`, `motion.js`, `styles.css`

**Interfaces:**
- Produces: `window.SiteMotion.typeCommand(el, text, done)`; renderer `"hero.stats"`

- [ ] **Step 1: Add the typing motion**

```js
  window.SiteMotion.typeCommand = function (el, text, done) {
    if (!el) { if (done) done(); return; }
    if (REDUCED) { el.textContent = text; if (done) done(); return; }

    var i = 0;
    el.textContent = "";
    (function tick() {
      el.textContent = text.slice(0, ++i);
      if (i < text.length) window.setTimeout(tick, 45);
      else if (done) done();
    })();
  };
```

- [ ] **Step 2: Add the hero stats renderer**

```js
    "hero.stats": function (el, c) {
      el.innerHTML = (c.hero.stats || [])
        .map(function (stat) {
          return (
            '<div class="hero__stat">' +
            '<dt class="hero__stat-label">' + esc(t(stat.key)) + "</dt>" +
            '<dd class="hero__stat-value">' + esc(stat.value) + "</dd>" +
            '<dd class="hero__stat-sub">' + esc(t(stat.subKey)) + "</dd>" +
            "</div>"
          );
        })
        .join("");
    },
```

- [ ] **Step 3: Reveal the headline after the command finishes**

In `boot()`, replace the plain render of the hero with a gated reveal. The headline, sub, stats and CTAs must render regardless of motion preference — the typing only delays them when motion is allowed.

```js
    var typedEl = document.querySelector('[data-slot="typed"]');
    var heroBits = document.querySelectorAll(".hero__headline, .hero__sub, .hero__stats, .hero__ctas");
    Array.prototype.forEach.call(heroBits, function (el) { el.classList.add("hero__reveal"); });

    function revealHero() {
      Array.prototype.forEach.call(heroBits, function (el) { el.classList.add("is-in"); });
    }

    if (typedEl && window.SiteMotion) {
      window.SiteMotion.typeCommand(typedEl, t("hero.command") || config.hero.command, revealHero);
    } else revealHero();
```

Note: `config.hero.command` is the literal command string and is **not** translated, so it uses `at()`, not `t()`. Pass `config.hero.command` directly:

```js
      window.SiteMotion.typeCommand(typedEl, config.hero.command, revealHero);
```

- [ ] **Step 4: Style the hero**

```css
.section--hero { padding-block: clamp(3.5rem, 12vh, 8rem) var(--section); }
.hero__prompt { font-family: var(--font-mono); color: var(--ink-muted); margin-bottom: 1.75rem; font-size: 0.9rem; }
.hero__sigil { color: var(--accent); }
.caret { display: inline-block; width: 0.6ch; height: 1.05em; background: var(--accent); vertical-align: -0.15em; margin-left: 0.15ch; }
@media (prefers-reduced-motion: no-preference) {
  .caret { animation: caret-blink 1.05s steps(1) infinite; }
}
@keyframes caret-blink { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } }
.hero__headline { font-size: clamp(2.4rem, 8vw, 5rem); line-height: 1.02; letter-spacing: -0.03em; margin-bottom: 1.25rem; }
.hero__sub { font-size: clamp(1rem, 2.2vw, 1.2rem); color: var(--ink-muted); max-width: 46ch; margin-bottom: 2.5rem; }
.hero__stats { display: flex; flex-wrap: wrap; gap: 2.5rem; margin-bottom: 2.5rem; }
.hero__stat-label { font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-muted); }
.hero__stat-value { font-family: var(--font-mono); font-size: clamp(1.6rem, 4vw, 2.4rem); color: var(--accent); font-variant-numeric: tabular-nums; margin: 0.2rem 0; }
.hero__stat-sub { font-size: 0.82rem; color: var(--ink-muted); }
.hero__reveal { opacity: 0; transform: translateY(0.6rem); transition: opacity 0.5s ease, transform 0.5s ease; }
.hero__reveal.is-in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .hero__reveal { opacity: 1; transform: none; } }
```

- [ ] **Step 5: Verify**

Reload. Expected: `$ elysa --status` types out, the caret blinks, then headline/stats/CTAs fade up. With reduced motion enabled at the OS level: typed text appears instantly, caret does not blink, everything visible immediately.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: boot hero with typed command"
```

---

## Task 4: The four

**Files:** Modify `script.js`, `styles.css`

**Interfaces:**
- Produces: renderer `"team.members"`

- [ ] **Step 1: Add the renderer**

```js
    "team.members": function (el, c) {
      el.innerHTML = (c.team.members || [])
        .map(function (m) {
          var boardNote =
            m.pointsBoard === "both" ? t("board.tabDk") + " + " + t("board.tabNordic")
            : m.pointsBoard === "nordic" ? t("board.tabNordic")
            : t("board.tabDk");
          return (
            '<article class="member">' +
            '<p class="member__prompt"><span class="member__sigil" aria-hidden="true">$</span> whoami</p>' +
            '<div class="member__head">' +
            '<span class="member__monogram" aria-hidden="true">' + esc(m.monogram) + "</span>" +
            '<div>' +
            '<h3 class="member__name">' + esc(m.name) + "</h3>" +
            '<p class="member__task">' + esc(t(m.taskKey)) + "</p>" +
            "</div>" +
            "</div>" +
            (m.badgeKey ? '<p class="member__badge">' + esc(t(m.badgeKey)) + "</p>" : "") +
            '<dl class="member__score">' +
            '<div><dt>' + esc(t("run.local")) + "</dt><dd>" + esc(m.raw) + "</dd></div>" +
            '<div><dt>' + esc(boardNote) + "</dt><dd>" + esc(m.points) + "</dd></div>" +
            "</dl>" +
            '<p class="member__log">' + esc(t(m.logKey)) + "</p>" +
            "</article>"
          );
        })
        .join("");
    },
```

- [ ] **Step 2: Style it**

```css
.team__grid { display: grid; gap: 1px; background: var(--line); border: 1px solid var(--line); }
@media (min-width: 48em) { .team__grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 76em) { .team__grid { grid-template-columns: repeat(4, 1fr); } }
.member { background: var(--surface); padding: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; }
.member__prompt { font-family: var(--font-mono); font-size: 0.7rem; color: var(--ink-muted); }
.member__sigil { color: var(--accent); }
.member__head { display: flex; gap: 0.85rem; align-items: center; }
.member__monogram {
  font-family: var(--font-mono); font-size: 0.95rem; letter-spacing: 0.04em;
  color: var(--accent); border: 1px solid var(--line); border-radius: var(--radius);
  padding: 0.5rem 0.6rem; background: var(--canvas); flex: 0 0 auto;
}
.member__name { font-size: 1rem; line-height: 1.25; }
.member__task { font-family: var(--font-mono); font-size: 0.72rem; color: var(--ink-muted); }
.member__badge { font-family: var(--font-mono); font-size: 0.68rem; color: var(--accent); border-left: 2px solid var(--accent); padding-left: 0.5rem; }
.member__score { display: flex; gap: 1.25rem; border-top: 1px solid var(--line); padding-top: 0.75rem; }
.member__score dt { font-family: var(--font-mono); font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.07em; color: var(--ink-muted); }
.member__score dd { font-family: var(--font-mono); font-size: 0.95rem; font-variant-numeric: tabular-nums; }
.member__log { font-size: 0.84rem; color: var(--ink-muted); margin-top: auto; }
```

- [ ] **Step 3: Verify**

Reload and scroll to The four. Expected: four panes; Jakub carries the badge *Best Medical Appointment in the Nordics*; Javier's log reads *"Our weakest task. Stated, not hidden — the place was never the point."*; Franciszek's log mentions 778 → 1280. No image elements render anywhere.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: the four — member panes with contributions as data"
```

---

## Task 5: The board

**Files:** Modify `script.js`, `styles.css`

**Interfaces:**
- Produces: `mountBoard()`; renderers `"board.tabs"` (manual), `renderBoard(id)`

- [ ] **Step 1: Add the board renderer and tab wiring**

```js
    "board.tabs": function (el, c) {
      el.innerHTML = (c.board.tabs || [])
        .map(function (tab) {
          return (
            '<button type="button" role="tab" class="board__tab" data-board="' + esc(tab.id) + '"' +
            ' aria-selected="' + (tab.active ? "true" : "false") + '"' +
            ' aria-controls="board-table">' + esc(t(tab.key)) + "</button>"
          );
        })
        .join("");
    },

  function renderBoard(id) {
    var table = document.querySelector('[data-slot="board-table"]');
    var board = (config.board.boards || {})[id];
    if (!table || !board) return;

    var cols = config.board.columns || [];
    var head =
      "<tr>" +
      '<th scope="col" class="board__rank">' + esc(t("board.rank")) + "</th>" +
      '<th scope="col">' + esc(t("board.team")) + "</th>" +
      cols.map(function (col) {
        return '<th scope="col" class="board__score">' + esc(t(col.key)) + "</th>";
      }).join("") +
      '<th scope="col" class="board__score">' + esc(t("board.total")) + "</th>" +
      "</tr>";

    var body = board.rows
      .map(function (row) {
        var cls = "board__row" + (row.highlight ? " board__row--us" : "");
        return (
          '<tr class="' + cls + '">' +
          '<td class="board__rank">' + esc(row.place) + "</td>" +
          "<th scope=\"row\" class=\"board__team\"><span>" + esc(row.name) + "</span>" +
          "<small>" + esc(t(row.orgKey)) + "</small></th>" +
          row.cells
            .map(function (cell) {
              return (
                '<td class="board__score">' +
                '<span class="board__points">' + esc(cell.points) + "</span>" +
                '<small class="board__raw">' + esc(t("board.raw")) + " " + esc(cell.raw) + "</small>" +
                "</td>"
              );
            })
            .join("") +
          '<td class="board__score board__total">' + esc(row.total) + "</td>" +
          "</tr>"
        );
      })
      .join("");

    table.innerHTML =
      '<p class="board__caption">' + esc(t(board.captionKey)) + "</p>" +
      '<div class="board__scroll"><table class="board__table-el"><thead>' + head +
      "</thead><tbody>" + body + "</tbody></table></div>";
  }

  function mountBoard() {
    var tabsEl = document.querySelector('[data-slot="board-tabs"]');
    if (!tabsEl) return;
    RENDERERS["board.tabs"](tabsEl, config);

    var active = "dk";
    tabsEl.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-board]");
      if (!btn) return;
      active = btn.getAttribute("data-board");
      Array.prototype.forEach.call(tabsEl.querySelectorAll("[data-board]"), function (b) {
        b.setAttribute("aria-selected", String(b === btn));
      });
      renderBoard(active);
    });
    renderBoard(active);

    var gapEl = document.querySelector('[data-slot="board-gap"]');
    if (gapEl && config.board.gapNote) {
      gapEl.textContent = t(config.board.gapNote.key);
      gapEl.classList.add("board__gap--visible");
    }
  }
```

Call `mountBoard();` from `boot()`.

- [ ] **Step 2: Style it**

```css
.board__tabs { display: flex; gap: 0.5rem; margin-bottom: 1.25rem; }
.board__tab {
  font-family: var(--font-mono); font-size: 0.78rem; cursor: pointer;
  background: var(--surface); color: var(--ink-muted);
  border: 1px solid var(--line); border-radius: 999px; padding: 0.4rem 1rem;
}
.board__tab[aria-selected="true"] { background: var(--ink); color: var(--canvas); border-color: var(--ink); }
.board__tab:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.board__caption { font-size: 0.78rem; color: var(--ink-muted); margin-bottom: 0.85rem; font-family: var(--font-mono); }
.board__scroll { overflow-x: auto; border: 1px solid var(--line); }
.board__table-el { width: 100%; border-collapse: collapse; font-size: 0.85rem; min-width: 44rem; }
.board__table-el th, .board__table-el td { padding: 0.7rem 0.9rem; text-align: left; border-bottom: 1px solid var(--line); }
.board__table-el thead th { font-family: var(--font-mono); font-size: 0.64rem; text-transform: uppercase; letter-spacing: 0.07em; color: var(--ink-muted); font-weight: 500; }
.board__row--us { background: var(--surface-2); }
.board__row--us .board__total { color: var(--accent); }
.board__rank { font-family: var(--font-mono); color: var(--ink-muted); width: 3rem; }
.board__team span { display: block; }
.board__team small { color: var(--ink-muted); font-size: 0.72rem; }
.board__score { font-family: var(--font-mono); font-variant-numeric: tabular-nums; text-align: right; }
.board__points { display: block; }
.board__raw { display: block; color: var(--ink-muted); font-size: 0.68rem; }
.board__total { font-size: 1.05rem; }
.board__gap { margin-top: 1rem; font-family: var(--font-mono); font-size: 0.8rem; color: var(--warn); }
```

- [ ] **Step 3: Verify**

Reload, scroll to The board. Expected: two tabs, Denmark active; seven rows, the team's row shaded with a green total of `45.00`; each score cell shows points with the raw value beneath. Clicking **Nordic** shows the other board: the team is row 2 with `35.97`, Ifftikhar Amiri row 1 with `36.51`. The amber gap line reads *"Second in the Nordics, 0.54 points behind Ifftikhar Amiri of Norway."*

Confirm the two totals are visibly different (45.00 vs 35.97) and each table carries its own caption. That difference is the point.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: the board — tabbed Danish and Nordic leaderboards"
```

---

## Task 6: The run — the animated score curve

**Files:** Modify `script.js`, `motion.js`, `styles.css`

**Interfaces:**
- Consumes: `config.run.points`, `window.SiteMotion.reduced`
- Produces: `window.SiteMotion.startCurve(svgEl, points, opts)`

This is the centerpiece and the piece most likely to need a second pass. Build it so the static end state is the *default*, and animation is an enhancement layered on top — that way a failure in the motion code degrades to a correct chart rather than an empty box.

- [ ] **Step 1: Build the chart as static SVG first, with no animation**

In `motion.js`:

```js
  var W = 800, H = 360, PAD = { t: 28, r: 24, b: 44, l: 56 };

  function buildCurve(pts) {
    var values = pts.map(function (p) { return p.value; });
    var max = Math.max.apply(null, values);
    var min = Math.min.apply(null, values);
    var lo = Math.floor(min / 200) * 200;
    var hi = Math.ceil(max / 200) * 200;

    function x(i) { return PAD.l + (i * (W - PAD.l - PAD.r)) / (pts.length - 1); }
    function y(v) { return H - PAD.b - ((v - lo) / (hi - lo)) * (H - PAD.t - PAD.b); }

    var d = pts.map(function (p, i) {
      return (i ? "L" : "M") + x(i).toFixed(1) + " " + y(p.value).toFixed(1);
    }).join(" ");

    /* gridlines at every 200 */
    var grid = "";
    for (var v = lo; v <= hi; v += 200) {
      grid += '<line class="run__gridline" x1="' + PAD.l + '" x2="' + (W - PAD.r) +
        '" y1="' + y(v).toFixed(1) + '" y2="' + y(v).toFixed(1) + '"/>' +
        '<text class="run__axis" x="' + (PAD.l - 10) + '" y="' + (y(v) + 4).toFixed(1) +
        '" text-anchor="end">' + v + "</text>";
    }
    return { x: x, y: y, d: d, grid: grid, lo: lo, hi: hi };
  }
```

- [ ] **Step 2: Add markers, labels and the reduced-motion path**

```js
  window.SiteMotion.startCurve = function (svg, pts, opts) {
    if (!svg || !pts || !pts.length) return;
    var c = buildCurve(pts);
    opts = opts || {};

    var marks = "";
    pts.forEach(function (p, i) {
      var cls = p.kind === "validation" ? "run__dot--validation" : "run__dot--local";
      marks += '<circle class="run__dot ' + cls + '" cx="' + c.x(i).toFixed(1) +
        '" cy="' + c.y(p.value).toFixed(1) + '" r="4"/>';
      marks += '<text class="run__value" x="' + c.x(i).toFixed(1) + '" y="' +
        (c.y(p.value) - 12).toFixed(1) + '" text-anchor="middle">' +
        (p.approx ? "~" : "") + p.value + "</text>";
    });

    svg.innerHTML =
      c.grid +
      '<path class="run__line" d="' + c.d + '"/>' +
      '<g class="run__marks">' + marks + "</g>";

    /* Annotations are real text nodes in the DOM at all times — motion only
       changes their opacity. Nothing here is information-bearing alone. */
    var legend = opts.legend;
    if (legend) {
      legend.innerHTML = pts
        .map(function (p, i) {
          return (
            '<li class="run__legend-item run__legend-item--' + esc(p.kind) + '">' +
            '<span class="run__legend-dot" aria-hidden="true"></span>' +
            '<span class="run__legend-label">' + esc(opts.t(p.labelKey)) + "</span>" +
            '<span class="run__legend-value">' + (p.approx ? "~" : "") + p.value + "</span>" +
            (p.noteKey ? '<span class="run__legend-note">' + esc(opts.t(p.noteKey)) + "</span>" : "") +
            "</li>"
          );
        })
        .join("");
    }

    if (REDUCED) {
      svg.classList.add("is-complete");
      return;
    }
    svg.classList.add("is-animated");
    opts.onReady && opts.onReady(svg);
  };
```

- [ ] **Step 3: Drive the draw on scroll**

```js
  window.SiteMotion.drawOnScroll = function (svg) {
    if (!svg || REDUCED) return;
    if (!("IntersectionObserver" in window)) { svg.classList.add("is-complete"); return; }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        svg.classList.add("is-complete");
        observer.disconnect();
      });
    }, { threshold: 0.35 });
    observer.observe(svg);
  };
```

- [ ] **Step 4: Mount the curve in `script.js`'s `boot()`**

```js
    var svg = document.querySelector('[data-slot="run-svg"]');
    if (svg && window.SiteMotion) {
      document.getElementById("run-svg-title").textContent = t("run.svgTitle");
      document.getElementById("run-svg-desc").textContent = t("run.svgDesc");

      window.SiteMotion.startCurve(svg, config.run.points, {
        t: t,
        legend: document.querySelector('[data-slot="run-legend"]'),
        onReady: function (el) { window.SiteMotion.drawOnScroll(el); }
      });

      var caption = document.querySelector('[data-slot="run-caption"]');
      if (caption) caption.textContent = t("run.legend");

      var closing = document.querySelector('[data-slot="run-closing"]');
      if (closing && config.run.evaluated) {
        closing.innerHTML =
          '<p class="run__closing-label">' + esc(t(config.run.evaluated.key)) + "</p>" +
          '<p class="run__closing-value">' + esc(config.run.evaluated.value) + "</p>" +
          '<p class="run__closing-note">' + esc(t(config.run.evaluated.noteKey)) + "</p>" +
          '<p class="run__closing-median">' + esc(t(config.run.median.key)) +
          " <span>" + esc(config.run.median.value) + "</span></p>";
      }
    }
```

- [ ] **Step 5: Style the curve**

```css
.run__figure { margin: 0 0 2rem; }
.run__svg { width: 100%; height: auto; display: block; }
.run__gridline { stroke: var(--line); stroke-width: 1; }
.run__axis { fill: var(--ink-muted); font-family: var(--font-mono); font-size: 11px; }
.run__line { fill: none; stroke: var(--accent); stroke-width: 2; stroke-linejoin: round; stroke-linecap: round; }
.run__dot--local { fill: var(--canvas); stroke: var(--ink-muted); stroke-width: 2; }
.run__dot--validation { fill: var(--accent); stroke: var(--canvas); stroke-width: 2; }
.run__value { fill: var(--ink); font-family: var(--font-mono); font-size: 12px; font-variant-numeric: tabular-nums; }
.run__legend { list-style: none; padding: 0; display: grid; gap: 1px; background: var(--line); border: 1px solid var(--line); }
@media (min-width: 48em) { .run__legend { grid-template-columns: repeat(2, 1fr); } }
.run__legend-item { background: var(--surface); padding: 0.7rem 0.9rem; display: grid; grid-template-columns: auto 1fr auto; gap: 0.5rem 0.7rem; align-items: baseline; font-size: 0.82rem; }
.run__legend-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.run__legend-item--local .run__legend-dot { background: var(--canvas); border: 2px solid var(--ink-muted); }
.run__legend-item--validation .run__legend-dot { background: var(--accent); }
.run__legend-value { font-family: var(--font-mono); font-variant-numeric: tabular-nums; }
.run__legend-note { grid-column: 2 / -1; color: var(--ink-muted); font-size: 0.76rem; }
.run__caption { font-size: 0.78rem; color: var(--ink-muted); margin-top: 0.85rem; font-family: var(--font-mono); }
.run__closing { border-top: 1px solid var(--line); padding-top: 1.5rem; }
.run__closing-label { font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--warn); }
.run__closing-value { font-family: var(--font-mono); font-size: clamp(1.8rem, 5vw, 2.8rem); color: var(--warn); font-variant-numeric: tabular-nums; }
.run__closing-note { max-width: 52ch; color: var(--ink-muted); font-size: 0.88rem; margin-top: 0.5rem; }
.run__closing-median { font-family: var(--font-mono); font-size: 0.78rem; color: var(--ink-muted); margin-top: 1rem; }

/* The line draws itself only when motion is allowed and the block is reached.
   Without `is-animated` the chart is simply complete and visible — the
   default state is correct, and motion is the enhancement. */
@media (prefers-reduced-motion: no-preference) {
  .run__line { stroke-dasharray: 2000; stroke-dashoffset: 2000; transition: stroke-dashoffset 1.6s ease-out; }
  .run__marks { opacity: 0; transition: opacity 0.6s ease 1.2s; }
  .run__svg.is-complete .run__line { stroke-dashoffset: 0; }
  .run__svg.is-complete .run__marks { opacity: 1; }
}
```

Confirm the curve geometry: the line must **dip** at index 3 (778) — rising through 344 → 600 → 1128, dropping to 778, then climbing to 1280 → 1576 → 1812. That dip is the honest shape of the weekend, not a rendering bug.

- [ ] **Step 6: Verify**

Reload, scroll to The run. Expected: the line draws left to right, dots and values fade in, the legend lists all seven points with notes on four of them, and the closing block shows `1405.256` in amber labelled *Final evaluated score*.
Then enable reduced motion at the OS level and reload: the chart is fully drawn with no transition, everything visible.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: the run — scroll-drawn score curve with honest annotations"
```

---

## Task 7: How we work, and What we learned

**Files:** Modify `script.js`, `styles.css`

**Interfaces:**
- Produces: renderers `"about.loop"`, `"learned.cards"`

- [ ] **Step 1: Add both renderers**

```js
    "about.loop": function (el, c) {
      el.innerHTML = (c.about.loop || [])
        .map(function (step) {
          return '<li class="loop__step">' + esc(t(step.key)) + "</li>";
        })
        .join("");
    },

    "learned.cards": function (el, c) {
      el.innerHTML = (c.learned.cards || [])
        .map(function (card) {
          return (
            '<article class="feature-card">' +
            '<div class="feature-card__icon">' + icon(card.icon) + "</div>" +
            '<h3 class="feature-card__title">' + esc(t(card.titleKey)) + "</h3>" +
            '<p class="feature-card__text">' + esc(t(card.textKey)) + "</p>" +
            "</article>"
          );
        })
        .join("");
    },
```

- [ ] **Step 2: Style the loop**

```css
.loop { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; margin-bottom: 2rem; font-family: var(--font-mono); font-size: 0.78rem; }
.loop__step { border: 1px solid var(--line); border-radius: var(--radius); padding: 0.35rem 0.7rem; color: var(--ink-muted); background: var(--surface); }
.loop__step:last-child { color: var(--accent); border-color: var(--accent); }
.loop__step:not(:last-child)::after { content: "→"; color: var(--line); margin-left: 0.9rem; }
.about__text { max-width: 62ch; color: var(--ink-muted); }
.about__text p + p { margin-top: 1rem; }
```

- [ ] **Step 3: Verify**

Reload. Expected: the loop renders as `Idea → Implement → Run → Wait → Check score → Analyse → Change something` with the final step in green, followed by the prose paragraph. "What we learned" shows five cards with the text from `learned.*`.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: how we work, what we learned"
```

---

## Task 8: Two doors, contact, footer

**Files:** Modify `script.js`, `styles.css`

**Interfaces:**
- Produces: renderers `"contact.doors"`, `"contact.info"`, `"contact.fields"`; reuses the template's `attachFormHandler`

- [ ] **Step 1: Add the doors and contact-info renderers**

```js
    "contact.doors": function (el, c) {
      el.innerHTML = (c.contact.doors || [])
        .map(function (door) {
          var href = "mailto:" + esc(c.contact.email) +
            "?subject=" + encodeURIComponent(door.mailSubject);
          return (
            '<article class="door">' +
            '<h3 class="door__title">' + esc(t(door.titleKey)) + "</h3>" +
            '<p class="door__text">' + esc(t(door.textKey)) + "</p>" +
            '<a class="btn btn--secondary door__cta" href="' + href + '">' +
            esc(c.contact.email) + "</a>" +
            "</article>"
          );
        })
        .join("");
    },

    "contact.info": function (el, c) {
      el.innerHTML =
        '<div class="contact__info-item">' + icon("mail") +
        "<span><strong>" + esc(t("contact.email")) + "</strong>" +
        '<a href="mailto:' + esc(c.contact.email) + '">' + esc(c.contact.email) + "</a></span></div>";
    },
```

- [ ] **Step 2: Adapt `contact.fields` to use translated labels**

Copy the template's `contact.fields` renderer and replace each literal label, placeholder and button string with `t(...)`:

| Was (template) | Becomes |
|---|---|
| `"Your name"` | `t("contact.name")` |
| `placeholder="First and last name"` | `placeholder="` + `t("contact.namePlaceholder")` + `"` |
| `"Email"` / `"you@example.com"` | `t("contact.emailField")` / `t("contact.emailPlaceholder")` |
| `"Message"` | `t("contact.message")` |
| `placeholder="How can we help?"` | `t("contact.messagePlaceholder")` |
| consent sentence | `t("contact.consent")` |
| `"Send message"` | `t("contact.submit")` |

The template's consent sentence uses `esc(brand)`; replace it with the translated string, which already names the team.

- [ ] **Step 3: Replace the form handler's literals with `t()`**

In `attachFormHandler`: `"Sending…"` → `t("contact.sending")`; the success messages → `t("contact.sent")` / `t("contact.simulated")`; the error message → `t("contact.error")`. Also swap the button's label back to `t("contact.submit")` in `done()`, not the hard-coded `"Send message"`.

Note: `contact.fields` is an empty string in config, so `"contact.fields"` renderer keeps `endpoint` handling. When `endpoint` is `""` the template simulates success — that is the desired pre-launch behaviour, and the message must say so plainly (`contact.simulated`), never claim a message was sent.

- [ ] **Step 4: Style doors and footer**

```css
.doors { display: grid; gap: 1px; background: var(--line); border: 1px solid var(--line); margin-bottom: 2.5rem; }
@media (min-width: 48em) { .doors { grid-template-columns: repeat(2, 1fr); } }
.door { background: var(--surface); padding: 1.75rem; display: flex; flex-direction: column; gap: 0.75rem; }
.door__title { font-size: 1.05rem; }
.door__text { color: var(--ink-muted); font-size: 0.88rem; }
.door__cta { align-self: flex-start; margin-top: auto; font-family: var(--font-mono); font-size: 0.78rem; }
.contact__inner { display: grid; gap: 2.5rem; }
@media (min-width: 64em) { .contact__inner { grid-template-columns: 1fr 1.2fr; } }
.contact__info-item { display: flex; gap: 0.7rem; align-items: flex-start; font-size: 0.9rem; }
.contact__info-item svg { width: 20px; height: 20px; color: var(--accent); flex: 0 0 auto; }
.contact__info-item strong { display: block; font-family: var(--font-mono); font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.07em; color: var(--ink-muted); font-weight: 500; }
.site-footer { border-top: 1px solid var(--line); padding-block: 2.5rem; margin-top: var(--section); }
.footer__grid { display: flex; flex-wrap: wrap; gap: 1.5rem; justify-content: space-between; align-items: center; }
.footer__tagline { color: var(--ink-muted); font-size: 0.82rem; max-width: 40ch; }
.footer__bottom { margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid var(--line); color: var(--ink-muted); font-size: 0.75rem; font-family: var(--font-mono); }
```

- [ ] **Step 5: Verify**

Reload, scroll to contact. Expected: two door cards, each with a working `mailto:` to `hello@elysasecret.com` carrying a subject; the email shown in the info column; submitting the form (with `endpoint: ""`) shows *"Thank you — your message was recorded. (No endpoint configured yet.)"* — wording that does **not** claim an email was sent. Footer shows the team name, tagline and `2026 Elysa's Secret. University of Southern Denmark.`

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: two doors, contact, footer"
```

---

## Task 9: Language toggle

**Files:** Modify `script.js`

**Interfaces:**
- Consumes: `t()`, `renderAll()`, `orderSections()`, `mountBoard()`
- Produces: `setLang(next)`

- [ ] **Step 1: Explain the re-render requirement**

Every renderer reads `t()` at call time, so switching language is: set `lang`, update `<html lang>`, update `aria-pressed` on both buttons, then re-run every mount. The board's innerHTML and the curve's legend must be re-rendered explicitly because they are not `[data-fill]` nodes.

- [ ] **Step 2: Add `setLang`**

```js
  function setLang(next) {
    if (next !== "en" && next !== "da") return;
    lang = next;
    storeLang(next);
    document.documentElement.setAttribute("lang", next);

    Array.prototype.forEach.call(document.querySelectorAll("[data-lang]"), function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-lang") === next));
    });

    document.title = config.brand.name;
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", t("footer.tagline"));

    renderAll(document);   /* scalars and every [data-fill] renderer */
    mountBoard();          /* board table + tabs are not data-fill nodes */
    mountCurve();          /* curve legend, titles and closing block */
    mountRailCountdown();  /* label is translated, value is not */
  }

  function wireLang() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-lang]"), function (btn) {
      btn.addEventListener("click", function () {
        setLang(btn.getAttribute("data-lang"));
      });
    });
  }
```

Refactor the rail countdown, board and curve setup out of `boot()` into named functions (`mountRailCountdown`, `mountBoard`, `mountCurve`) so `setLang` can call them. `boot()` becomes:

```js
  function boot() {
    document.documentElement.setAttribute("lang", lang);
    document.title = config.brand.name;
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", t("footer.tagline"));

    renderAll(document);
    orderSections();
    wireNav();
    wireLang();
    mountRail();
    mountRailCountdown();
    mountBoard();
    mountCurve();
    mountHero();
  }
```

- [ ] **Step 3: Guard against a missing Danish dictionary**

If `da` is absent or empty (the stub state), the DA button must be hidden rather than present and broken:

```js
  function daAvailable() {
    return !!(dict.da && Object.keys(dict.da).length);
  }
  /* inside wireLang() */
    var daBtn = document.querySelector('[data-lang="da"]');
    if (daBtn && !daAvailable()) daBtn.hidden = true;
  /* and in detectLang(), never return "da" when !daAvailable() */
```

- [ ] **Step 4: Verify**

Expected: with `da: {}` the DA button is hidden and the site is English-only. After Task 6's dictionary is filled, both buttons appear; clicking DA switches all prose, `<html lang>` becomes `da`, the board captions and tabs switch, the curve legend switches, and the footer legal switches. Reload → the choice persists. Open in a private window → no crash, site renders in English.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: EN/DA language toggle with persistence"
```

---

## Task 10: Motion audit

**Files:** Modify `motion.js`, `styles.css`

- [ ] **Step 1: Audit every animated behaviour**

Enumerate and confirm each has a reduced-motion path:

| Behaviour | Where | Reduced-motion behaviour |
|---|---|---|
| Caret blink | CSS `@media (prefers-reduced-motion: no-preference)` | never animates |
| Command typing | `typeCommand` | text appears instantly |
| Hero reveal | CSS, plus `.is-in` | visible immediately |
| Countdown tick | `startCountdown` | painted once, no interval |
| Curve draw | CSS transition on `.run__line` | no transition, path complete |
| Markers fade | CSS on `.run__marks` | no transition, visible |
| Smooth scroll | `html { scroll-behavior: smooth }` | **must be disabled** |

- [ ] **Step 2: Disable smooth scroll under reduced motion**

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
}
```

- [ ] **Step 3: Verify with the OS setting actually on**

macOS: System Settings → Accessibility → Display → Reduce motion → on. Reload.
Expected: no typing animation, no blinking caret, chart fully drawn, countdown static, no smooth scroll — and **every value still readable**. Then turn it off and confirm the animations return.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "fix: honour prefers-reduced-motion in every animated behaviour"
```

---

## Task 11: Accessibility, responsive and copy audit

**Files:** Modify `styles.css`, `index.html` as needed

- [ ] **Step 1: Check contrast with a tool, not by eye**

Test these pairs against WCAG AA (4.5:1 body text, 3:1 large text and UI):
`--ink` on `--canvas`, `--ink-muted` on `--canvas`, `--ink-muted` on `--surface`, `--accent` on `--canvas`, `--accent` on `--surface`, `--warn` on `--canvas`, `--canvas` on `--accent` (the pressed language button).

The two most likely failures are `--ink-muted` (#9BA1AA) on `--surface` and `--accent` used for small text. If `--ink-muted` fails, lighten it to `#A8AEB7`; if `--accent` fails for small text, use it only at ≥18.66px bold or 24px, or darken the text and keep the accent for backgrounds and rules. Record the measured ratios in the commit message.

- [ ] **Step 2: Keyboard pass**

Tab through the whole page. Expected: visible focus on every interactive element; skip link works; rail language buttons reachable; board tabs operable with Tab + Enter; the table is readable by screen reader with `<th scope>` intact; form fields labelled; no focus traps.

- [ ] **Step 3: Screen-reader pass**

Check the curve. Expected: the `<title>` and `<desc>` announce the trend and the dip, and the legend list carries every value as text. A screen reader user must get the whole story without seeing the SVG.

- [ ] **Step 4: Responsive pass**

Check 360px, 768px, 1280px. Expected at 360px: the rail wraps without truncating; the board scrolls horizontally rather than squashing; member panes stack; the doors stack; no horizontal page scroll.

- [ ] **Step 5: Copy audit against the spec**

Read the rendered page top to bottom against spec §2. Confirm: no "Secrete"; no invented figure; 45.00 and 35.97 never conflated; `0.54` and `0.97` present; every name spelled **Alexandru Zaitzev**, **Jakub Furmaniuk**, **Javier Arévalo Hernández**, **Franciszek Kossut**; `hello@elysasecret.com` is the only published address.

- [ ] **Step 6: Run the checker**

Run: `node check.js`
Expected: pass.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "fix: contrast, keyboard and responsive pass; copy audit"
```

---

## Task 12: Deploy configuration

**Files:** Modify `README.md`

- [ ] **Step 1: Confirm the site works with no server**

Run: `python3 -m http.server 8000`, open `http://localhost:8000`, and also verify by opening `index.html` directly via `file://`.
Expected: identical rendering both ways. No `type="module"` scripts, so `file://` works — this is the check that proves that.

- [ ] **Step 2: Record the launch checklist in `README.md`**

Add, with the actual values where they are known:

```markdown
## Launch checklist (target: before 14 October 2026)
1. `node check.js` passes
2. Danish dictionary complete and proofread by a native speaker at SDU
3. `hello@elysasecret.com` live via Cloudflare Email Routing → all four inboxes
4. Contact form endpoint set in `SITE_CONFIG.contact.endpoint`; test a real submission
5. All four members confirmed their names may be published
6. Socials/handles added to `SITE_CONFIG.footer.socials` if the team wants them
7. Cloudflare Pages connected; custom domain `elysasecret.com` resolving over HTTPS
8. Open the live URL on a phone and on a laptop
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "docs: launch checklist for Cloudflare Pages deploy"
```

---

## Self-Review

**Spec coverage**

| Spec section | Task |
|---|---|
| §2 facts, numbers, names, spelling | 1 (config + checker), 4, 5, 6, 11 |
| §3 EN + DA, toggle, persistence, proofread gate | 1, 9, 10 |
| §4 status rail | 2 |
| §4 Boot hero | 3 |
| §4 The four | 4 |
| §4 The board | 5 |
| §4 The run | 6 |
| §4 How we work | 7 |
| §4 What we learned | 7 |
| §4 Two doors + footer | 8 |
| §4 Not shipping testimonials/pricing | 1 (sections[] omits them; checker step 5) |
| §4 tokens, type, dark only | 1 |
| §4 motion + reduced motion | 3, 6, 10 |
| §5 static stack, no build | 1, 12 |
| §5 files | 1 |
| §5 form service + team address | 8, 12 |
| §5 Cloudflare Pages | 12 |
| §5 accessibility | 11 |
| §5 performance (no framework, no font blocking) | 1, 11 |
| §6 open items | 9 (DA stub guard), 11, 12 |
| §7 verification checklist | 10, 11, 12 |

No gaps.

**Placeholder scan**

No `TBD`, no `TODO`, no "handle edge cases", no "similar to Task N". The one deliberately deferred artefact is the Danish dictionary, which is a *content* deliverable with a stated fallback (English-only, DA button hidden) and a mechanical completeness check — not a plan placeholder. The contact endpoint is likewise blank by design, with the behaviour of a blank endpoint specified.

**Type consistency**

- `t(key)` — defined Task 2, used in Tasks 4, 5, 6, 7, 8, 9. Signature stable.
- `RENDERERS` keys — `rail.items`, `hero.stats`, `team.members`, `board.tabs`, `about.loop`, `learned.cards`, `contact.doors`, `contact.info`, `contact.fields`. Each is defined once and referenced once.
- `window.SiteMotion` — `reduced` (Task 2), `startCountdown` (2), `typeCommand` (3), `startCurve`/`drawOnScroll` (6). All defined before first use.
- Config paths read by renderers all exist in Task 1's `SITE_CONFIG`: `statusRail.items`, `statusRail.countdownTo`, `statusRail.countdownKey`, `hero.stats`, `hero.command`, `team.members`, `board.tabs/columns/boards/gapNote`, `run.points/evaluated/median`, `about.loop`, `learned.cards`, `contact.doors/fields/email/endpoint`, `footer.*`.
- Two config keys were referenced by shells but missing from the Task 1 config; both are now resolved inline: `footer.socials` is declared as `[]` (the template's renderer already handles an empty array by rendering nothing), and `hero.headline` / `hero.sub` need no config entry at all because they resolve through `TEXT_KEYS` to `t("hero.headline")` / `t("hero.sub")`.
- The three template renderers that read `link.label` / `cta.label` are replaced in Task 2 Step 3 with `t(link.key)` / `t(cta.key)`, matching the key-based config. `brand.logo` is untouched because `brand.name` and `brand.logo` stay literal.
