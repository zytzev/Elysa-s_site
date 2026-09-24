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
 * Run: node smoke.js
 */
"use strict";

var fs = require("fs");
var path = require("path");
var vm = require("vm");

var ROOT = __dirname;
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
    style: {},
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

var html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

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
  var src = fs.readFileSync(path.join(ROOT, file), "utf8");
  vm.runInContext(src, ctx, { filename: file });
}

var configScript = html.match(/<script>([\s\S]*?)<\/script>/g)[0]
  .replace(/^<script>/, "").replace(/<\/script>$/, "");

try {
  vm.runInContext(configScript, ctx, { filename: "index.html:config" });
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
  expect("rail items", fills["rail.items"].innerHTML, "45.00");
  expect("rail gap is amber", fills["rail.items"].innerHTML, "rail__item--warn");
  expect("rail negative gap", fills["rail.items"].innerHTML, "-0.54");

  expectEq("hero headline", fills["hero.headline"].textContent, "First place. Denmark.");
  expect("hero sub is prose", fills["hero.sub"].textContent, "simulator");
  expect("hero stats", fills["hero.stats"].innerHTML, "National result");
  expect("hero stats carry 45.00", fills["hero.stats"].innerHTML, "45.00");

  /* the boot log + mascot are new surfaces; they must exist and be wired */
  expect("boot log slot exists", slots["boot-log"] ? "yes" : "", "yes");
  expect("boot ready slot exists", slots["boot-ready"] ? "yes" : "", "yes");
  expect("mascot element exists", slots["mascot"] ? "yes" : "", "yes");
  expect("mascot displacement filter wired", slots["mascot-displace"] ? "yes" : "", "yes");
  expect("mascot gets positioned inline", slots["mascot"].style.transform || "", "translate");

  expect("team heading", fills["team.heading"].textContent, "The four");
  var team = fills["team.members"].innerHTML;
  ["Alexandru Zaitzev", "Jakub Furmaniuk", "Javier Arévalo Hernández",
   "Franciszek Kossut", "Across all three tasks"].forEach(function (s) {
    expect("team members include " + s, team, s);
  });
  /* the fairness rule: a member pane must never carry a score, and must never
     describe a teammate's task as a weakness */
  ["0.822", "1405.256", "0.263", "778", "1280", "weakest", "weak"].forEach(function (bad) {
    if (team.indexOf(bad) === -1) pass();
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
  expect("curve svg drawn", slots["run-svg"].innerHTML, "run__line");
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
  expect("learned simplest mechanism", learned, "simplest mechanism that works");

  expect("contact intro", fills["contact.sub"].textContent, "Nordic final");
  expect("contact info", fills["contact.info"].innerHTML, "hello@elysasecret.com");
  expect("form fields rendered", slots["contact-form"].innerHTML, "name=\"message\"");
  expect("form submit label", slots["contact-form"].innerHTML, ">Send<");
  /* socials ship with empty hrefs, so nothing should render yet — and there
     must be no dead <a href=""> in the footer */
  expectEq("socials render nothing until URLs exist", fills["footer.socials"].innerHTML, "");

  /* the run section: three tasks now, so the tab strip must appear */
  expect("run task sub rendered", slots["run-task-sub"].textContent, "Alexandru");
  expectEq("run tabs visible with multiple tasks", slots["run-tabs"].hidden, false);
  expect("run tabs list all three tasks", slots["run-tabs"].innerHTML, "Medical Appointment");
  expect("first tab selected by default", slots["run-tabs"].innerHTML, "\"true\"");

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
