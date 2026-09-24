# elysasecret.com

Team site for **Elysa's Secret** — Nordic AI Cup 2026, 1st place (Denmark).
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

`check.js` fails the build if anything unexpected appears in `public/`. That is
deliberate: `public/` is what a stranger can fetch, so a stray file there is
published — and this project's spec and plan contain private working notes that
have no business being on the live site.

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

    cd public && python3 -m http.server 8000     # http://localhost:8000

Opening `public/index.html` directly also works — no `type="module"`, so there
is no CORS restriction on `file://`.

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
3. Build command: *(none)*. **Output directory: `public`** — not `/`. Setting
   it to `/` would publish the tooling, the screenshots and the design spec,
   including the private notes in `docs/`.
4. Custom domain: `elysasecret.com`.

No VPS. There is no server process and no state to keep — a VPS would mean
owning TLS renewal, OS patching and a single point of failure in exchange for
nothing.

After the first deploy, load `https://elysasecret.com/check.js` once. It must
return 404. If it returns source, the output directory is wrong.

## Contact form — wired, one live test left

The form is connected to **Web3Forms** and the access key is already in
`public/index.html`. Submitting it should deliver to whichever inbox that key
was issued to.

**It uses a native form POST, not `fetch`, and that is not a style choice.**
Web3Forms' free plan rejects the CORS preflight that a JSON `fetch` forces —
verified: `OPTIONS` returns 403 with no `Access-Control-Allow-Origin` — and it
rejects server-side POSTs outright with *"This method is not allowed. Use our
API in client side... (Pro plan is required)"*. A plain form POST is a
navigation, so CORS never applies and it works. Do not "improve" this into an
AJAX call; it will break.

`shot.js` verifies the submission without sending anything: it intercepts the
POST, inspects the payload, and aborts it.

### Before you rely on it

1. **Restrict the key to `elysasecret.com`** in the Web3Forms dashboard. The key
   is public by design — it ships in the page source and cannot read anything —
   but an unrestricted key can be used to send mail through your quota.
2. Submit the form once from the live site and confirm the email arrives.
3. `thanks.html` is where the service sends people back. The `redirect` field
   **follows the origin the site is served from**, so it is correct on a
   `pages.dev` preview, on `elysasecret.com` and on localhost with no edit.
   Leave `contact.thanksUrl` empty unless you want to override it — setting it
   to a domain that is not live yet hangs the browser on *"Connecting to …"*
   after a successful submission. `shot.js` asserts the redirect matches the
   served origin. The page is **English only**: the redirect carries no
   language, and the form service does not pass one through.

**If the key is ever emptied**, the form stops rather than posting a request the
service would reject, and says plainly that nothing was sent.

**Switching provider** means changing `endpoint` and the payload field names in
the `contact.fields` renderer — the hidden inputs *are* the payload.

## Launch checklist (target: before 14 October 2026)

- [x] `node check.js && node smoke.js && node shot.js` all pass
- [x] Danish reviewed and approved by the team
- [x] Contact form wired to Web3Forms
- [ ] **Restrict the Web3Forms key to `elysasecret.com`** in their dashboard
- [ ] `hello@elysasecret.com` live via Cloudflare Email Routing → all four inboxes
- [ ] Submit the form once from the live site; confirm the email arrives
- [ ] All four members confirmed their names may be published
- [ ] Instagram and TikTok URLs added to `SITE_CONFIG.footer.socials`
- [ ] Cloudflare Pages connected; **output directory `public`**; domain resolving
- [ ] `https://elysasecret.com/check.js` returns **404**
- [ ] Checked on a phone and on a laptop
