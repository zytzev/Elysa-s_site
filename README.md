# elysasecret.com

Team site for **Elysa's Secret** — Nordic AI Cup 2026, 1st place (Denmark).
Four first-year bachelor students at the University of Southern Denmark.

Static site. No build step, no framework, no dependencies.

## Files

| File | Responsibility |
| --- | --- |
| `index.html` | Structure + `SITE_CONFIG` — all **data**: scores, names, dates |
| `i18n.js` | All **prose**, English and Danish |
| `styles.css` | Tokens, layout, motion CSS |
| `script.js` | Rendering, section order, nav, board tabs, language toggle, form |
| `motion.js` | Every animated behaviour, reduced-motion aware |
| `check.js` | Integrity and honesty checks |
| `smoke.js` | Render smoke test (dev only — not part of the site) |

**Data and prose are deliberately separated.** A score lives in
`SITE_CONFIG`; a sentence lives in `i18n.js`. This means the Danish
proofreader reviews exactly one file, and EN/DA key parity is machine-checked
instead of relying on discipline.

## Before every commit

    node check.js && node smoke.js

**`check.js`** validates data and cross-file wiring. It fails on: bracketed
placeholders, EN/DA key drift, a config key that doesn't resolve in both
languages, any figure the team claims that isn't in the spec allowlist, nav
links pointing at sections that don't exist, the string "Secrete", leftover
template placeholder text, a `[data-fill]` with no renderer, a `[data-slot]`
selector matching nothing, and any published email address other than
`hello@elysasecret.com`.

**`smoke.js`** builds the minimum DOM needed to run the real `boot()` path —
real config, real dictionaries, real renderers — then asserts 57 things about
the produced markup. It exists because a renderer that throws or a `data-fill`
that resolves to `undefined` leaves a section *silently blank*, which no
data-level check can see.

It does **not** catch layout, CSS, or interaction problems. Those need a real
browser — open the page after any styling change.

Both are dev-only and are not served by the site.

## Local preview

    python3 -m http.server 8000     # http://localhost:8000

Opening `index.html` directly also works — no `type="module"`, so there is no
CORS restriction on `file://`.

## Danish

`i18n.js` ships both dictionaries complete, but the Danish has **not** been
reviewed by a native speaker yet. That review is a launch gate for the Danish
version only — the English site can ship without it.

To ship English-only, hide the DA button in `index.html`:

```html
<button type="button" class="lang__btn" data-lang="da" aria-pressed="false" hidden>DA</button>
```

`script.js` also hides it automatically if the `da` dictionary is ever empty.

Numbers keep the decimal point in Danish rather than the Danish comma, to match
the leaderboard tables and the status rail exactly. Consistency with the
displayed data won over locale convention — flag it if you disagree.

## Motion

Six behaviours, all behind `@media (prefers-reduced-motion: no-preference)`:
caret blink, command typing, hero reveal, countdown tick, curve draw, mascot
bob and blink. With reduced motion the page is complete and static — the score
curve renders fully drawn, the countdown shows a fixed value, and no text is
withheld behind an animation.

The curve's hidden start state is opt-in via `.is-animated`. If `motion.js`
fails to load, the chart is complete rather than blank.

## Mascot

Fixed bottom-right, `pointer-events: none` and `aria-hidden` — decorative, so
it can never swallow a click meant for the page. Currently an inline SVG
rebuilt from the supplied artwork, driven by three tokens: `--mascot`,
`--mascot-line`, `--mascot-eye`.

To use the original raster instead, replace the `<svg>` inside `.mascot` in
`index.html` with:

```html
<img src="mascot.png" alt="" />
```

and drop the `.mascot__body` / `.mascot__eye` rules. Note that the blink
animation relies on the eyes being separate SVG elements, so a raster can bob
but cannot blink.

## Deploy — Cloudflare Pages

1. Push this repository to GitHub.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → connect the repo.
3. Build command: *(none)*. Output directory: `/`.
4. Custom domain: `elysasecret.com`.

No VPS. There is no server process and no state to keep — a VPS would mean
owning TLS renewal, OS patching and a single point of failure in exchange for
nothing.

## Contact form

A static page cannot send email, so `SITE_CONFIG.contact.endpoint` posts to a
form service. While it is `""` the form **simulates** success and says so in
plain language — it never claims an email was sent when nothing left the
browser.

To make it live: create a Formspree or Web3Forms endpoint and paste the URL
into `contact.endpoint`.

## Launch checklist (target: before 14 October 2026)

- [ ] `node check.js` passes
- [ ] Danish proofread by a native speaker at SDU
- [ ] `hello@elysasecret.com` live via Cloudflare Email Routing → all four inboxes
- [ ] Contact form endpoint set; test a real submission
- [ ] All four members confirmed their names may be published
- [ ] Socials added to `SITE_CONFIG.footer.socials` if wanted
- [ ] Cloudflare Pages connected; `elysasecret.com` resolving over HTTPS
- [ ] Checked on a phone and on a laptop
