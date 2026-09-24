# Elysa's Secret — Team Site Design Spec

**Date:** 2026-09-24
**Domain:** elysasecret.com
**Status:** Approved (design), ready for implementation plan
**Deadline driver:** Nordic AI Cup final, Reykjavík, 14–15 October 2026

---

## Revision 3 — the published address

`hello@elysasecret.com` (Revision 1's plan, which assumed Cloudflare Email
Routing) was never created. The team publishes **`elysassecret@gmail.com`**
instead — note the spelling: two `s` in the middle, which does **not** match the
domain `elysasecret.com`. It is the address in `SITE_CONFIG.contact.email`, so
`check.js` allows it and flags any other.

The contact form still delivers to whichever inbox the Web3Forms access key was
issued to. That is independent of the address displayed on the site; if they
should match, the key needs reissuing to the same inbox.

---

## Revision 2 — 2026-09-24, after the team's review and the repository

The team reviewed the first build and corrected it. Where this revision
conflicts with the sections below, **this revision wins.**

### Content corrections

1. **No scores on the member panes.** Revision 1 showed each member's raw score
   and points, and described Javier's Drone Flyby as "our weakest task. Stated,
   not hidden." The team rejected this, correctly: a public page is the wrong
   place to rank four teammates, and telling a sponsor that a named person's
   work was the weakest tells them nothing. Member panes now say only what each
   person did. The numbers live on the board and in the run, where they are the
   competition's numbers rather than a person's.
2. **Franciszek's contribution is cross-task.** Revision 1 tied him to the
   Survival Simulator controller alone. He also worked with Javier on the Drone
   Flyby model and with Jakub on Medical Appointment. His pane says so.
3. **The run is per task, with tabs.** One graph per task — Survival Simulator,
   Drone Flyby, Medical Appointment — each with its own progression, its own
   Danish rank, and its own closing result. Tabs render only when more than one
   task exists.
4. **The contact section has one door, not two.** The "next season's roster"
   door is removed: this is a team that intends to last, and is not recruiting
   through the site. The sponsor paragraph is kept as the section's intro copy,
   so the sponsor purpose survives without a second door.
5. **Socials:** Instagram, LinkedIn and TikTok are configured with empty hrefs.
   The renderer skips empty hrefs, so nothing renders until real URLs are added
   — a dead `<a href="">` never ships.
6. **Boot sequence.** Revision 1 typed one command and then faded the hero in.
   The team asked for something longer and less generic. The hero now runs a
   boot log: three commands typed in turn, a status readout ending on
   `one final ... pending`, then the headline resolving out of random glyphs and
   the numeric stats counting up. No fade.
7. **The mascot arrives, travels, and can be dragged.** It appears centred and
   large, flies to the bottom-right corner on an arc with squash-and-stretch and
   a fractal-noise displacement filter (organic shape dilation, not a slide),
   then breathes. It is draggable; it squints and grumbles while held and
   giggles when released. This is a deliberate reversal of Revision 1's
   `pointer-events: none` — dragging was requested, so it now takes pointer
   events, bounded by being small, cornered, and `aria-hidden`.

### Data corrections — sourced from the team's repository

Revision 1's numbers came from a verbal account. The team then supplied
`github.com/emermelada/nordic-ai-cup`, which is authoritative and disagrees in
places. **All figures now come from the repository.**

| Source | Figure |
|---|---|
| `SUBMISSIONS.md` | Per-task Danish ranks: Medical Appointment 1st (25 pts), Survival Simulator 4th (12 pts), Drone Flyby 6th (8 pts). Total 45, 1st in Denmark |
| `survival-v2/RESULTS.md` | The controller progression: 308 → 437 → 570 → 709 → 1014 → 1239 → 1484 local, then 1815 graded validation |
| `survival-v2/EVALUATED.md` | Graded evaluation 1405.2561882564453; three games 1319.9 / 1298.2 / 1599.0 |
| `drone-flyby/SERVED_CONFIG.md` | Validation mean 0.5841 over 7 runs; evaluation 0.2630; all 249 frames answered |
| `medical-appointment/REPRODUCE.md` | Earlier build validated 0.802; graded build validated 0.8307887829198248 four times identically; evaluated 0.8222490889515863 |

**Unresolved discrepancy:** Revision 1 recorded a highest validation of **1812**
and a median validation of **1447**, both from the verbal account. The repository
states a graded validation of **1815** and gives no median. The site uses
**1815** and **omits the median** until the team confirms which is right. The
1447 figure is not published anywhere on the site.

**Framing consequence:** the honest story is not one heroic curve. It is three
tasks where one was the best in the Nordics and two were mid-field, and where the
drone task's validation-to-evaluation gap (0.5841 → 0.2630) is the single most
instructive number the team produced. That gap is now a headline point rather
than something to smooth over.

### Additions

- `smoke.js` — render smoke test. Builds the minimum DOM needed to run the real
  `boot()` path and asserts 69 things about the produced markup. It exists
  because a renderer that throws leaves a section *silently blank*, which no
  data-level check can see.
- `shot.js` — drives headless Chrome, captures per-viewport and per-section
  screenshots, and asserts the score curve actually completes when scrolled into
  view (if its observer never fires, the centrepiece renders invisible).
- `check.js` grew three checks: every `[data-fill]` must be renderable, every
  `[data-slot]` selector must match an element, and translation-key resolution
  now mirrors `t()`'s nested walk exactly rather than a flattened map.
- Contrast ratios are now measured from the token values, not asserted.

---

## 1. Purpose

A single-page team site for **Elysa's Secret**, four first-year bachelor students at the
University of Southern Denmark who won **1st place — Denmark** in the Nordic AI Cup 2026 and
qualified for the Nordic final in Reykjavík.

Three goals, in priority order:

1. **Trophy case + team identity** — a home for the win that treats the four members as people.
2. **Sponsor / university pitch** — credible enough for SDU or a partner to read before funding
   travel to Iceland.
3. **Recruitment for next season** — make strong AI students want to join.

Explicit non-goal: a technical writeup hub. Not in scope.

### Audience

- SDU faculty / department, potential sponsors, Danish tech community
- Students who might join the roster next season
- The Nordic AI Cup community and other competing teams

---

## 2. Locked facts

Every number on the site comes from the team's own account or from the public leaderboard
screenshots supplied by the team. **No figure may be invented, rounded up, or implied.**

### Identity

| Field | Value |
|---|---|
| Team name | **Elysa's Secret** (leaderboard spelling; matches the domain. An early draft spelled it "Secrete" — a typo, not to be used) |
| Institution | University of Southern Denmark |
| Country | Denmark |
| Members | Alexandru Zaitzev, Jakub Furmaniuk, Javier Arévalo Hernández, Franciszek Kossut |
| Composition | Four first-year bachelor students; no prior ML competition experience |

### Results

**Danish national round — 1st place, 45.00 points**

| Task | Owner | Raw score | National points |
|---|---|---|---|
| Survival Simulator | Alexandru Zaitzev | 1405.256 | 12.00 |
| Drone Flyby | Javier Arévalo Hernández | 0.263 | 8.00 |
| Medical Appointment | Jakub Furmaniuk | 0.822 | 25.00 |

**Nordic combined leaderboard — 2nd place, 35.97 points**

| Task | Nordic points |
|---|---|
| Survival Simulator | 10.00 |
| Drone Flyby | 0.97 |
| Medical Appointment | 25.00 |

Leader: **Ifftikhar Amiri** (Norway, Norwegian University of Life Sciences) — **36.51**.
**Gap: 0.54 points.**

> **Accuracy requirement.** The national and Nordic point columns differ for the same task
> (Survival Simulator: 12.00 nationally vs 10.00 Nordic) because each competition is scored
> within its own group. The site must label which board each figure belongs to and must never
> present the two as one number.

- Jakub Furmaniuk's **0.822** on Medical Appointment is the **highest Medical Appointment score
  in the entire Nordic field** (verified against all seven rows of the Nordic leaderboard).
- Team name and institution appear on the public leaderboard, so both boards are independently
  checkable. The site states the Nordic 2nd place; concealing it would be trivially detectable
  and would make the Reykjavík final meaningless.

### The run (score progression)

| Stage | Value | What it actually was |
|---|---|---|
| First heuristic controller | 344.26 | First local score |
| Early iteration | ~600 | Improved heuristics |
| Plateau | ~1100 (average ~1128) | Three days stuck; evolutionary heuristic search |
| Teammate's controller | 778 | First validation, via Cloudflare tunnel |
| Same controller, moved | 1280 | Moved to a VPS colocated with the grader |
| Later validation | 1576 | |
| Highest validation | **1812** | |
| Median validation attempt | 1447 | |
| Final evaluated | **1405.256** | What actually counted |

The curve mixes local scores and validation runs. **Each point must be labelled with which it
was** — this is the honest reading and it is also the story's point: a validation peak is not a
result.

### Circumstances

- ~7 days of preparation before the competition
- ~4 days of competition, frequently working until ~05:00
- Cumulative **600-second request constraint**; round-trip network overhead counted against it
- Task assigned to Alexandru: **Survival Simulator** (the team received a one-day-early preview)
- Franciszek Kossut acted as the unblocker and built an alternative controller in a
  ~13-hour AI-assisted session — the turning point from 778 to 1280
- Tools used: Python, Docker, FastAPI, a VPS colocated with the grader, evolutionary heuristic
  selection, an RNN correction layer (~+5%, not decisive), and AI coding assistants

### Subject-matter decisions confirmed by the team

- **Javier's Drone Flyby row is shown plainly.** 0.97 points, near the back of the field. The
  team's position: "we don't care about the place, only about becoming better." A site where
  every row is a triumph reads as marketing; one unflattering number is what makes the rest
  credible.
- **Franciszek's contribution is stated proportionately, not erased.** One annotation on the
  score curve and one line in his pane. No dedicated section, no hero mention. Rationale: the
  778 → 1280 turn is unexplained without it, and an unexplained turning point undermines the
  1812 with it.

---

## 3. Language

**English + Danish**, EN default, toggle in the status rail.

- All user-facing strings live in one dictionary in the site config. No hard-coded copy in
  markup.
- Toggle swaps without page reload and persists the choice (`localStorage`, wrapped in
  `try/catch`; the page must render correctly when storage is unavailable).
- `<html lang>` updates on swap.
- Danish copy is authored by Claude; **a native Danish speaker at SDU must proofread before
  launch.** This is a launch blocker, not a nice-to-have.
- English only is the fallback if the Danish proofread does not happen before 14 October.

---

## 4. Design direction

**Concept: "the run," rendered as a live system.**

The site presents the competition as a system the team ran. Terminal as *design language*, not
costume — monospace rails, a persistent status line, data rendered as if streamed. No
skeuomorphic CRT effects, no fake scanlines, no green-on-black cliché.

### Status rail

A thin bar pinned to the top, present at every scroll position, always showing real state:

```
DK 45.00 · 1st   NORDIC 35.97 · 2nd   gap -0.54   Reykjavík T-20d   [en] [da]
```

The countdown ticks. This rail is the site's signature element.

### Sections

**0 · Boot** *(hero)* — near-empty page, a caret. `$ elysa --status` types itself; output
resolves into the headline: **1st · Denmark**, 45.00 points, Nordic AI Cup 2026, live countdown
to 14–15 October. Runs once, ~1.4s, skippable, disabled under reduced-motion.

**1 · The four** *(custom shell)* — four panes, no photographs. Each pane: `$ whoami`, a monogram
block, name, task owned, contribution as data, and a one-line log on hover/focus.

| Person | Task | Line |
|---|---|---|
| Alexandru Zaitzev | Survival Simulator | raw 1405.256 → 10.00 Nordic points |
| Jakub Furmaniuk | Medical Appointment | raw 0.822 → 25.00 points on both boards — highest in the Nordic field |
| Javier Arévalo Hernández | Drone Flyby | raw 0.263 → 0.97 Nordic points |
| Franciszek Kossut | Support / unblocker | alternative controller, 778 → 1280 |

**2 · The board** *(custom shell)* — the three tasks against the field, from the supplied
leaderboards. The team's row highlighted; raw and points shown separately per board; the Nordic
2nd place and the 0.54 gap stated. Primary sponsor-credibility section.

**3 · The run** *(custom shell — centerpiece)* — scroll-driven SVG plot of the progression in
§2. Annotations land on scroll: *"three days stuck here"* at the plateau, *"teammate's
controller"* at 778, *"moved to a VPS in the grader's datacenter"* at 1280. Closes on the
honest note: evaluated 1405.256.

**4 · How we work** *(about)* — the loop as a pipeline:
idea → implement → run → wait → score → analyze → change → ↻.
Then the room in plain prose: house music, snacks, four laptops, 05:00. Human warmth; needs no
photographs.

**5 · What we learned** *(features)* — five cards:
1. Optimise the actual bottleneck — the first one was the network path, not the model
2. A high validation score is not automatically a good controller
3. Determinism: seed reproducibility is what makes experiments meaningful
4. Evaluation parity: local, validation and evaluation must behave alike
5. Use the simplest mechanism that actually solves the problem (the RNN added ~5%; the
   heuristic remained competitive)

**6 · Two doors** *(CTA + contact)* — split call to action. *For sponsors & SDU*: what backing
does. *For next season's roster*: who we look for. One email address.

**7 · Footer** — countdown, links, `[YEAR]`.

### Not shipping

The template's `testimonials` and `pricing` sections are **dropped**. No invented quotes, no
invented prices, no placeholder people.

### Theme tokens

Dark single theme. No light mode, no theme toggle — deliberate scope reduction.

```
--canvas:      #0B0C0E
--surface:     #121417
--ink:         #E8EAED
--ink-muted:   #9BA1AA
--line:        #23272C
--accent:      #5CE1A0   /* phosphor green — primary accent, successes */
--warn:        #F2B455   /* amber — reserved for unflattering numbers (gap -0.54, 0.97 pts) */
--dk:          #C8102E   /* Danish red — used exactly once, DK flag chip */
```

Type: **IBM Plex Mono** for structure, labels and numbers; **Inter** for anything read at
length. Google Fonts with system fallbacks (`ui-monospace, SFMono-Regular, Menlo` /
`system-ui, -apple-system`). Self-host later if load performance matters.

### Motion

Typed boot line, scroll-drawn curve, number counters, live countdown, caret blink.

- All motion disabled under `prefers-reduced-motion: reduce` — curve renders complete and
  static, no typing, countdown shows a fixed value.
- **No animation carries information alone.** Every animated value is also present as text.
- Budget: no animation library. IntersectionObserver + requestAnimationFrame + inline SVG.

---

## 5. Technical approach

**Stack:** the `site-from-template` **static** version — `index.html` + `styles.css` +
`script.js`, no build step. A single page three weeks before the Iceland final does not justify
a Next.js toolchain. The Next.js version of the template is deliberately not used.

**Template workflow:** read `TEMPLATE_USAGE.md`, fill the config, extend section shells only
where this spec demands structure. Never read or copy from the template's source project.

**Files:**

```
~/Life/Projects/TEAM/
├── index.html          # config block + section shells (incl. new: board, run, rail)
├── styles.css          # tokens, section styles, motion
├── script.js           # renderers, i18n, motion, form
└── docs/superpowers/specs/2026-09-24-elysasecret-team-site-design.md
```

**Config additions beyond the template contract:**

- `i18n` — `{ en: {...}, da: {...} }` dictionary plus active language and toggle state
- `statusRail` — the derived values shown in the pinned rail
- Two new sections with shells + renderers: `board`, `run`

**Contact form:** a static page has no server and cannot send mail itself, so something must
receive the POST. Wire `contact.endpoint` to a **form service** (Formspree or Web3Forms, free
tier) which delivers submissions to the team inbox. No server, no code, five minutes of setup.
Third-party tradeoff accepted: the form service sees submissions. Cloudflare Pages Function
(via Resend or similar) remains the documented first-party upgrade path if that changes.

**Team address:** `hello@elysasecret.com`, forwarded to all four personal inboxes via
**Cloudflare Email Routing** (free, no mailbox to manage). The site never publishes one
member's personal address — the contact survives any individual graduating.

**Hosting:** **Cloudflare Pages**, custom domain `elysasecret.com` (already registered at
Cloudflare — DNS and TLS are handled by Pages). Deploys from git, so the project becomes a git
repository. A VPS is explicitly rejected: no server process or state exists to justify owning
TLS renewal, OS patching and a single point of failure.

**Accessibility:** WCAG AA contrast on the dark theme (the terminal aesthetic is a real risk
here and is checked, not assumed), visible keyboard focus, semantic landmarks, the language
toggle and nav operable by keyboard, `prefers-reduced-motion` honoured.

**Performance:** no frameworks, no animation library, fonts loaded with `display=swap` and
system fallbacks. Target: fast on a phone on conference wifi in Reykjavík.

---

## 6. Open items

| # | Item | Owner | Blocks |
|---|---|---|---|
| 1 | Danish proofread by a native speaker | Team (SDU) | Danish launch; EN can ship without it |
| 2 | `hello@elysasecret.com` set up via Cloudflare Email Routing | Team | Contact section |
| 3 | Form service (Formspree / Web3Forms) account + endpoint URL | Team | Form submission |
| 4 | Optional public handles / socials for the four members | Team | Footer socials (omitted until provided) |
| 5 | Confirm all four names are cleared for public display | Team | The four section |

None of these block the build — each has a working fallback (EN-only, email-only contact, no
socials) so the site can ship and be completed incrementally.

---

## 7. Verification checklist

- [ ] No `[bracketed]` placeholder remains in config or copy, in either language
- [ ] `sections[]` lists only sections that exist; nav links match active sections
- [ ] No testimonials, no pricing, no invented quotes or figures anywhere
- [ ] Every number on the page traces to §2 of this spec
- [ ] National (45.00) and Nordic (35.97) point columns are labelled and never conflated
- [ ] The 0.54-point gap and Javier's 0.97 are present, not softened
- [ ] EN/DA toggle swaps all copy without reload, persists, updates `<html lang>`
- [ ] Page renders correctly with `localStorage` unavailable
- [ ] `prefers-reduced-motion: reduce` — curve static and complete, no typing, no tick
- [ ] Keyboard: status rail, nav, language toggle and form all reachable with visible focus
- [ ] Contact form delivers a real email to the team address
- [ ] Contrast checked against WCAG AA, not eyeballed
- [ ] No project-specific strings or assets from the template's source project appear anywhere
- [ ] Loads and reads correctly at 360px width
- [ ] Domain resolves over HTTPS at `elysasecret.com`
