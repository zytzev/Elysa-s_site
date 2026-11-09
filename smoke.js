#!/usr/bin/env node
/* Render smoke test for elysasecret.com — dev only, not shipped.
 *
 * There is no browser on this machine and no test framework, so this provides
 * the minimum DOM needed to execute the real boot() path: the real
 * SITE_CONFIG, the real i18n dictionaries, the real renderers. It will not
 * catch layout or CSS problems — those need a real browser. It DOES catch the
 * failure that matters most on a static site: a renderer throwing (or a
 * data-fill resolving to undefined) and leaving a section silently blank.
 *
 * All the pages are read as one: one stub per data-fill or data-slot across
 * index.html, the detail pages and chrome.js, so every renderer runs.
 *
 * Run: node smoke.js
 */
"use strict";

var fs = require("fs");
var path = require("path");
var vm = require("vm");

var ROOT = __dirname;
/* the site lives in public/; only that folder is deployed */
var SITE = path.join(ROOT, "public");
var failures = [];
var checked = 0;

function fail(msg) { failures.push(msg); }
function pass() { checked++; }

/* ---------------------------------------------------------------- DOM stub */
function makeEl(attrs) {
  var classes = [];
  var el = {
    _html: "",
    _text: "",
    _attrs: attrs || {},
    hidden: false,
    elements: {},
    style: { setProperty: function () {}, removeProperty: function () {} },
    classList: {
      add: function (c) { if (classes.indexOf(c) === -1) classes.push(c); },
      remove: function (c) { classes = classes.filter(function (x) { return x !== c; }); },
      contains: function (c) { return classes.indexOf(c) !== -1; },
      toggle: function (c, force) {
        var on = force === undefined ? !el.classList.contains(c) : !!force;
        if (on) el.classList.add(c); else el.classList.remove(c);
        return on;
      }
    },
    getAttribute: function (k) { return k in el._attrs ? el._attrs[k] : null; },
    setAttribute: function (k, v) { el._attrs[k] = String(v); },
    removeAttribute: function (k) { delete el._attrs[k]; },
    addEventListener: function () {},
    removeEventListener: function () {},
    closest: function () { return null; },
    appendChild: function () {},
    reset: function () {},
    querySelector: function () { return null; },
    querySelectorAll: function () { return []; }
  };
  Object.defineProperty(el, "innerHTML", {
    get: function () { return el._html; },
    set: function (v) { el._html = String(v); }
  });
  Object.defineProperty(el, "textContent", {
    get: function () { return el._text; },
    set: function (v) { el._text = String(v); }
  });
  return el;
}

var html = ["index.html", "nordic-ai-cup.html", "hyperbloom.html", "edth.html", "chrome.js"]
  .map(function (f) { return fs.readFileSync(path.join(SITE, f), "utf8"); })
  .join("\n");

/* one stub element per declared data-fill and data-slot, exactly as the page
   declares them — so a typo'd slot is a real miss, not a silent pass */
var fills = {};
(html.match(/data-fill="([^"]+)"/g) || []).forEach(function (m) {
  var key = m.replace(/data-fill="|"/g, "");
  if (!fills[key]) fills[key] = makeEl({ "data-fill": key });
});
var slots = {};
var slotList = [];
(html.match(/data-slot="([^"]+)"/g) || []).forEach(function (m) {
  var name = m.replace(/data-slot="|"/g, "");
  if (!slots[name]) { slots[name] = makeEl({ "data-slot": name }); slotList.push(name); }
});

/* The contact form carries BOTH data-slot="contact-form" and
   data-fill="contact.fields" on one tag, so in a real DOM they are the same
   element. The stub must model that, or the form looks empty. */
slots["contact-form"] = fills["contact.fields"];

var fillEls = Object.keys(fills).map(function (k) { return fills[k]; });
var slotEls = slotList.map(function (k) { return slots[k]; });
var langEls = [makeEl({ "data-lang": "en" }), makeEl({ "data-lang": "da" })];
var metaEl = makeEl({ name: "description" });
var mainEl = makeEl({ id: "main" });
var byId = {
  "run-svg-title": makeEl({ id: "run-svg-title" }),
  "run-svg-desc": makeEl({ id: "run-svg-desc" })
};

var documentStub = {
  readyState: "complete",
  title: "",
  documentElement: makeEl({}),
  querySelectorAll: function (sel) {
    if (sel === "[data-fill]") return fillEls;
    if (sel === "[data-lang]") return langEls;
    if (sel === "[data-section]") return [];
    if (sel === "[data-close-menu]") return [];
    return [];
  },
  querySelector: function (sel) {
    var m = sel.match(/\[data-slot="([^"]+)"\]/);
    if (m) return slots[m[1]] || null;
    var l = sel.match(/\[data-lang="([^"]+)"\]/);
    if (l) return langEls.filter(function (e) { return e.getAttribute("data-lang") === l[1]; })[0] || null;
    if (sel.indexOf("meta[name=\"description\"]") !== -1) return metaEl;
    return null;
  },
  getElementById: function (id) { return byId[id] || (id === "main" ? mainEl : null); },
  createElement: function () { return makeEl({}); },
  addEventListener: function () {}
};

var windowStub = {
  /* reduced motion ON: the simplest, most deterministic path — instant typing,
     no timers, curve completes immediately, mascot placed without travelling.
     The animated paths need a real browser; shot.js covers those. */
  matchMedia: function () { return { matches: true, addEventListener: function () {} }; },
  addEventListener: function () {},
  removeEventListener: function () {},
  innerWidth: 1440,
  innerHeight: 900,
  /* a real browser window carries these; motion.js reaches through window.*,
     so the stub has to provide them or it tests something that cannot exist */
  document: documentStub,
  setTimeout: function (fn) { fn(); return 0; },
  clearTimeout: function () {},
  setInterval: function () { return 0; },
  clearInterval: function () {},
  requestAnimationFrame: function (fn) { fn(0); return 0; },
  cancelAnimationFrame: function () {}
};

var ctx = {
  window: windowStub,
  document: documentStub,
  navigator: { language: "en-US" },
  console: console,
  setTimeout: function (fn) { fn(); return 0; },
  clearInterval: function () {},
  setInterval: function () { return 0; },
  requestAnimationFrame: function (fn) { fn(); return 0; }
};
vm.createContext(ctx);

/* ------------------------------------------------------- load the real code */
function run(file) {
  var src = fs.readFileSync(path.join(SITE, file), "utf8");
  vm.runInContext(src, ctx, { filename: file });
}

try {
  run("config.js");
  run("i18n.js");
  run("motion.js");
  run("script.js"); /* its boot() runs immediately: readyState is "complete" */
  pass();
} catch (e) {
  fail("boot() threw: " + e.message + "\n      " + (e.stack || "").split("\n")[1]);
}

/* ---------------------------------------------------------------- assertions */
function expect(label, actual, needle) {
  var hay = String(actual == null ? "" : actual);
  if (hay.indexOf(needle) !== -1) pass();
  else fail(label + ": expected to contain " + JSON.stringify(needle) +
    "\n      got: " + JSON.stringify(hay.slice(0, 160)));
}
function expectEq(label, actual, want) {
  if (String(actual) === String(want)) pass();
  else fail(label + ": expected " + JSON.stringify(want) + ", got " + JSON.stringify(actual));
}

if (!failures.length) {
  /* the home rail has every hackathon; the cup's numbers stay on the cup page */
  ["NORDIC", "HYPERBLOOM", "EDTH"].forEach(function (s) {
    expect("rail names " + s, fills["rail.items"].innerHTML, s);
  });
  expect("rail says EDTH was pitched", fills["rail.items"].innerHTML, "pitched");
  var cupRail = JSON.stringify(ctx.window.SITE_CONFIG.statusRail.cupItems);
  expect("cup rail carries the Danish total", cupRail, "45.00");
  expect("cup rail carries the gap", cupRail, "-0.54");

  expectEq("hero headline", fills["hero.headline"].textContent, "Four students. Two wins.");
  expect("hero is about the team", fills["hero.sub"].textContent, "University of Southern Denmark");
  expect("hero stats", fills["hero.stats"].innerHTML, "Hackathons");
  if (fills["hero.stats"].innerHTML.indexOf("45.00") === -1) pass();
  else fail("the home hero must not lead with one event's score");

  expectEq("cup headline", fills["cup.headline"].textContent, "First place. Denmark.");
  expect("cup sub is prose", fills["cup.sub"].textContent, "simulator");
  expect("cup stats", fills["cup.stats"].innerHTML, "National result");
  expect("cup stats carry 45.00", fills["cup.stats"].innerHTML, "45.00");
  expect("cup jump links", fills["cup.subnav"].innerHTML, "#board");

  /* all the hackathons on the home page, each in the same shape */
  var cards = fills["hackathons.cards"].innerHTML;
  ["EDTH Copenhagen", "HyperBloom October", "Nordic AI Cup"].forEach(function (s) {
    expect("hackathon card " + s, cards, s);
  });
  expectEq("one card per hackathon", (cards.match(/class="project hackathon[ "]/g) || []).length, 3);
  expectEq("every card shows a result", (cards.match(/<dt>Result<\/dt>/g) || []).length, 3);
  expect("card links to the cup page", cards, "nordic-ai-cup.html");
  expect("card links to the HyperBloom page", cards, "hyperbloom.html");
  expect("card links to the EDTH page", cards, "edth.html");
  expectEq("nothing is still in progress", cards.indexOf("project__status--live"), -1);
  expectEq("two gold cards", (cards.match(/project__status--gold/g) || []).length, 2);
  expect("cup card shows both results", cards, "2nd in the Nordics");

  /* the boot log + mascot are new surfaces; they must exist and be wired */
  expect("boot log slot exists", slots["boot-log"] ? "yes" : "", "yes");
  expect("boot ready slot exists", slots["boot-ready"] ? "yes" : "", "yes");
  expect("mascot element exists", slots["mascot"] ? "yes" : "", "yes");
  expect("mascot displacement filter wired", slots["mascot-displace"] ? "yes" : "", "yes");
  expect("mascot gets positioned inline", slots["mascot"].style.transform || "", "translate");

  expect("team heading", fills["team.heading"].textContent, "The team");
  expect("cup contributors heading", fills["cup.contributors.heading"].textContent, "Who contributed");
  var roster = fills["team.roster"].innerHTML;
  ["Alexandru Zaitzev", "Jakub Furmaniuk", "Javier Arévalo Hernández",
   "Franciszek Kossut", "Make-a-Ring", "Nordic AI Cup"].forEach(function (s) {
    expect("roster includes " + s, roster, s);
  });
  expectEq("roster has all four LinkedIn links", (roster.match(/member__link/g) || []).length, 4);
  var team = fills["cup.contributors.list"].innerHTML;
  ["Alexandru Zaitzev", "Jakub Furmaniuk", "Javier Arévalo Hernández",
   "Franciszek Kossut", "All three tasks"].forEach(function (s) {
    expect("team members include " + s, team, s);
  });
  /* each member links to their OWN LinkedIn — one team-level link would be
     ambiguous, and a missing one would leave a person unlinked */
  var linkCount = (team.match(/member__link/g) || []).length;
  if (linkCount === 4) pass();
  else fail("expected a LinkedIn link on each of the 4 member panes, got " + linkCount);
  ["linkedin.com/in/zaitzev", "linkedin.com/in/jakub-furmaniuk",
   "linkedin.com/in/javier-arevalo-hernandez"].forEach(function (u) {
    expect("member linkedin " + u, team, u);
  });
  /* a flag per pane, each labelled with its country: one Moldovan, two Polish, one Spanish */
  var flagCount = (roster.match(/class="member__flag"/g) || []).length;
  if (flagCount === 4) pass();
  else fail("expected a flag on each of the 4 member panes, got " + flagCount);
  expectEq("one Moldova flag", (roster.match(/aria-label="Moldova"/g) || []).length, 1);
  expectEq("two Poland flags", (roster.match(/aria-label="Poland"/g) || []).length, 2);
  expectEq("one Spain flag", (roster.match(/aria-label="Spain"/g) || []).length, 1);

  /* the fairness rule: a member pane must never carry a score, and must never
     describe a teammate's task as a weakness */
  ["0.822", "1405.256", "0.263", "778", "1280", "weakest", "weak"].forEach(function (bad) {
    if ((team + roster).indexOf(bad) === -1) pass();
    else fail("member panes must not contain " + JSON.stringify(bad));
  });

  expect("board sub explains the two scales", fills["board.sub"].textContent, "own competition");
  var board = slots["board-table"].innerHTML;
  expect("board has our row", board, "Elysa&#39;s Secret");
  expect("board danish total", board, "45.00");
  expect("board shows raw", board, "1405.256");
  expect("board highlighted row class", board, "board__row--us");
  expect("board gap note", slots["board-gap"].textContent, "0.54");

  var legend = slots["run-legend"].innerHTML;
  ["308", "437", "570", "709", "1014", "1239", "1484", "1815"].forEach(function (n) {
    expect("survival legend has " + n, legend, n);
  });
  expect("curve svg drawn", slots["run-svg"].innerHTML, "run__seg");
  /* the authorship marking: only the agreed stretch carries it */
  expect("survival marks 3 points as franek's", slots["run-svg"].innerHTML, "run__by-franek");
  /* a filler cell exists only to close the box on an odd step count */
  var stepCount = (ctx.window.SITE_CONFIG.run.tasks[0].points || []).length;
  var fillerCount = (slots["run-legend"].innerHTML.match(/run__legend-item--filler/g) || []).length;
  if (fillerCount === (stepCount % 2 === 0 ? 0 : 1)) pass();
  else fail("legend filler count wrong: " + fillerCount + " filler(s) for " + stepCount + " steps");
  expect("curve svg axes", slots["run-svg"].innerHTML, "run__axis");
  expect("curve is complete under reduced motion",
    slots["run-svg"].classList.contains("is-complete") ? "is-complete" : "", "is-complete");
  expect("curve a11y title", byId["run-svg-title"].textContent, "Score progression");
  expect("run closing is the evaluated score", slots["run-closing"].innerHTML, "1405.256");
  expect("run closing names the three games", slots["run-closing"].innerHTML, "1319.9");

  expect("about loop", fills["about.loop"].innerHTML, "Change something");
  expect("about prose", fills["about.text"].textContent, "5 AM");

  var learned = fills["learned.cards"].innerHTML;
  expect("learned determinism card", learned, "Determinism is the experiment");
  expect("learned combine-models card", learned, "Combine models that fail differently");

  expect("contact intro", fills["contact.sub"].textContent, "University of Southern Denmark");
  expect("contact info", fills["contact.info"].innerHTML, "elysassecret@gmail.com");
  expect("form fields rendered", slots["contact-form"].innerHTML, "name=\"message\"");
  expect("form submit label", slots["contact-form"].innerHTML, ">Send<");
  /* the spam honeypot must ship, and must not be a rendered checkbox */
  expect("form has a honeypot", slots["contact-form"].innerHTML, "name=\"botcheck\"");
  expect("honeypot is off-screen", slots["contact-form"].innerHTML, "class=\"honeypot\"");
  /* the form's live/not-live contract is data, so check it as data */
  var ct = ctx.window.SITE_CONFIG.contact || {};
  if (typeof ct.endpoint === "string" && typeof ct.accessKey === "string" && ct.subject) pass();
  else fail("contact config must carry endpoint, accessKey and subject");
  /* socials ship with empty hrefs, so nothing should render yet — and there
     must be no dead <a href=""> in the footer */
  expectEq("socials render nothing until URLs exist", fills["footer.socials"].innerHTML, "");

  /* the run section: three tasks now, so the tab strip must appear */
  expect("run task sub rendered", slots["run-task-sub"].textContent, "Denmark");
  expectEq("run tabs visible with multiple tasks", slots["run-tabs"].hidden, false);
  expect("run tabs list all three tasks", slots["run-tabs"].innerHTML, "Medical Appointment");
  expect("first tab selected by default", slots["run-tabs"].innerHTML, "\"true\"");

  /* the HyperBloom page */
  expectEq("ring headline", fills["ring.headline"].textContent, "First place. Make-a-Ring.");
  expect("ring stats projects", fills["ring.stats"].innerHTML, "239");
  expect("ring stats participants", fills["ring.stats"].innerHTML, "738");
  expect("ring cta opens the demo in a new tab", fills["ring.ctas"].innerHTML, "target=\"_blank\"");
  expectEq("three screenshots", (fills["ring.shots"].innerHTML.match(/<img /g) || []).length, 3);
  if (fills["ring.shots"].innerHTML.indexOf('alt=""') === -1) pass();
  else fail("every screenshot needs alt text");
  expectEq("six build cards", (fills["ring.cards"].innerHTML.match(/feature-card__title/g) || []).length, 6);
  var ringPeople = fills["ring.contributors.list"].innerHTML;
  expect("ring contributors heading", fills["ring.contributors.heading"].textContent, "Who contributed");
  expect("ring contributor", ringPeople, "Franciszek Kossut");
  expect("ring contributor", ringPeople, "Javier Arévalo Hernández");
  expectEq("only the two builders are credited", (ringPeople.match(/thread__item/g) || []).length, 2);
  expectEq("each builder links to LinkedIn", (ringPeople.match(/member__link/g) || []).length, 2);
  ["make-a-ring.deployxa.online", "github.com/FearedLynx/make-a-ring",
   "devpost.com/software/make-a-ring", "hyperbloom-october.devpost.com"]
    .forEach(function (u) { expect("ring link " + u, fills["ring.links"].innerHTML, u); });
  expect("back link", fills["page.back.label"].textContent, "All hackathons");

  /* the EDTH page */
  expectEq("pharos headline", fills["pharos.headline"].textContent, "PHAROS. Autonomous USV's coordination.");
  expect("pharos stats tests", fills["pharos.stats"].innerHTML, "387");
  expectEq("three pharos screenshots", (fills["pharos.shots"].innerHTML.match(/<img /g) || []).length, 3);
  if (fills["pharos.shots"].innerHTML.indexOf('alt=""') === -1) pass();
  else fail("every PHAROS screenshot needs alt text");
  expectEq("six pharos cards", (fills["pharos.cards"].innerHTML.match(/feature-card__title/g) || []).length, 6);
  var pharosPeople = fills["pharos.contributors.list"].innerHTML;
  expectEq("four pharos builders", (pharosPeople.match(/thread__item/g) || []).length, 4);
  expect("the guest is credited", pharosPeople, "Simeone");
  expect("the guest links to GitHub", pharosPeople, "github.com/SimeDev42");
  ["suspicious", "hostile", "won "].forEach(function (bad) {
    if (pharosPeople.indexOf(bad) === -1 && fills["pharos.cards"].innerHTML.indexOf(bad) === -1) pass();
    else fail("the PHAROS page must not say " + JSON.stringify(bad));
  });

  /* the finals are over: nothing on the page may still point at them */
  var everything = fillEls.concat(slotEls)
    .map(function (e) { return e.innerHTML + e.textContent; }).join(" ") + html;
  ["Reykjav", "first-year", "førsteårs"].forEach(function (gone) {
    if (everything.indexOf(gone) === -1) pass();
    else fail("page still mentions " + JSON.stringify(gone));
  });

  /* the mascot's state-dependent parts must all ship in the markup */
  ["mascot__arm", "mascot__beret", "mascot__eyes-uwu", "mascot__eyes-angry",
   "mascot-speech", "mascot-displace"].forEach(function (needle) {
    expect("mascot markup has " + needle, html, needle);
  });
  expect("mascot speech is positioned inline", slots["mascot-speech"].style.transform || "", "translate");
  /* The mascot lines are EXACTLY the four the team specified. Asserted as an
     exact list rather than a count, because a ">= 4" check is what let four
     invented lines through the first time. */
  var EXPECTED_LINES = [
    "Claude LOCK IN",
    "Claude use no tokens",
    "Claude make no mistakes",
    "Claude don't give up!"
  ];
  var lines = (ctx.window.SITE_CONFIG.mascot || {}).lines || [];
  if (JSON.stringify(lines) === JSON.stringify(EXPECTED_LINES)) pass();
  else fail("mascot lines must be exactly the four agreed ones.\n      expected: " +
    JSON.stringify(EXPECTED_LINES) + "\n      got:      " + JSON.stringify(lines));

  expect("nav links", fills["nav.links"].innerHTML, "#team");
  expect("nav cta", fills["nav.cta"].innerHTML, "Contact");
  expect("footer tagline", fills["footer.tagline"].textContent, "University of Southern Denmark");
  expectEq("footer year token replaced",
    fills["footer.legal"].textContent,
    new Date().getFullYear() + " Elysa's Secret. University of Southern Denmark.");
  expect("brand name", fills["brand.name"].textContent, "Elysa's Secret");

  /* catch the classic silent failures */
  var allHtml = fillEls.concat(slotEls)
    .map(function (e) { return e.innerHTML + e.textContent; }).join(" ");
  ["undefined", "NaN", "[object Object]", "Secrete"].forEach(function (bad) {
    if (allHtml.indexOf(bad) === -1) pass();
    else fail("rendered output contains " + JSON.stringify(bad));
  });

  if (allHtml.indexOf("]") !== -1 && /\[[A-Z]{3,}\]/.test(allHtml)) {
    fail("rendered output still contains a bracketed token: " +
      allHtml.match(/\[[A-Z]{3,}\]/)[0]);
  } else pass();
}

/* -------------------------------------------------------------------- report */
console.log("\n  elysasecret.com — render smoke test\n");
if (failures.length) {
  console.log("  FAILED  " + failures.length + "  (passed " + checked + ")\n");
  failures.forEach(function (f) { console.log("    x " + f); });
  console.log("");
  process.exit(1);
}
console.log("  ok — " + checked + " render assertions passed\n");
process.exit(0);
