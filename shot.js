#!/usr/bin/env node
/* Render the site in a real browser and capture screenshots — dev only.
 * This is the check that neither check.js nor smoke.js can do: actual layout,
 * actual CSS, actual console output.
 *
 * Run: node shot.js
 * Writes PNGs to ./shots/ and prints console errors, page errors and any
 * horizontal overflow it finds.
 */
"use strict";

var fs = require("fs");
var path = require("path");
var puppeteer = require("puppeteer");

var ROOT = __dirname;
var OUT = path.join(ROOT, "shots");
/* the site lives in public/; only that folder is deployed */
var URL = "file://" + path.join(ROOT, "public", "index.html");

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT);

var problems = [];

async function capture(browser, name, opts) {
  var page = await browser.newPage();
  var logs = [];
  page.on("console", function (m) {
    if (m.type() === "error" || m.type() === "warning") logs.push(m.type() + ": " + m.text());
  });
  page.on("pageerror", function (e) { logs.push("pageerror: " + e.message); });
  page.on("requestfailed", function (r) {
    logs.push("requestfailed: " + r.url().slice(0, 90) + " (" + (r.failure() || {}).errorText + ")");
  });

  await page.setViewport({ width: opts.width, height: opts.height, deviceScaleFactor: 1 });
  if (opts.reducedMotion) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  if (opts.lang) {
    await page.evaluateOnNewDocument(function (l) {
      try { window.localStorage.setItem("elysasecret.lang", l); } catch (e) {}
    }, opts.lang);
  }

  await page.goto(URL, { waitUntil: "networkidle0", timeout: 30000 });
  /* the boot sequence runs ~3s (three commands typed, three status lines) and
     then the headline scrambles and the mascot flies in — wait it out, or
     every screenshot catches the page mid-load */
  await new Promise(function (r) { setTimeout(r, opts.settle || 5200); });

  var metrics = await page.evaluate(function () {
    function txt(sel) {
      var el = document.querySelector(sel);
      return el ? (el.textContent || "").replace(/\s+/g, " ").trim() : null;
    }
    var sections = [];
    document.querySelectorAll("[data-section]").forEach(function (s) {
      sections.push(s.getAttribute("data-section") + (s.hidden ? " (hidden)" : ""));
    });
    return {
      htmlLang: document.documentElement.getAttribute("lang"),
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      overflowX: document.documentElement.scrollWidth - window.innerWidth,
      rail: txt(".rail__items"),
      countdown: txt(".rail__countdown"),
      headline: txt(".hero__headline"),
      prompt: txt(".hero__prompt"),
      teamPanels: document.querySelectorAll(".member").length,
      boardRows: document.querySelectorAll(".board__row").length,
      curvePath: !!document.querySelector(".run__line"),
      curveLen: (document.querySelector(".run__line") || {}).getTotalLength
        ? Math.round(document.querySelector(".run__line").getTotalLength()) : null,
      curveComplete: !!document.querySelector(".run__svg.is-complete"),
      legendItems: document.querySelectorAll(".run__legend-item").length,
      /* read the expectation from the page's own config rather than a magic
         number that has to be edited every time a task gains a point */
      expectedPoints: (function () {
        var t = (window.SITE_CONFIG.run.tasks || [])[0] || {};
        return (t.points || []).length;
      })(),
      mascotVisible: (function () {
        var m = document.querySelector(".mascot");
        if (!m) return false;
        var r = m.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      })(),
      mascotBox: (function () {
        var m = document.querySelector(".mascot");
        if (!m) return null;
        var r = m.getBoundingClientRect();
        return { w: Math.round(r.width), h: Math.round(r.height), right: Math.round(window.innerWidth - r.right), bottom: Math.round(window.innerHeight - r.bottom) };
      })(),
      mascotCornerOk: (function () {
        var m = document.querySelector(".mascot");
        if (!m) return false;
        var r = m.getBoundingClientRect();
        /* must have actually travelled to the bottom-right, not still be
           sitting in the middle where the entrance starts */
        var nearRight = window.innerWidth - r.right < 40;
        var nearBottom = window.innerHeight - r.bottom < 40;
        return nearRight && nearBottom;
      })(),
      bootLines: document.querySelectorAll(".boot__line").length,
      bootOverlayShown: (function () {
        var b = document.querySelector(".boot");
        if (!b) return false;
        return getComputedStyle(b).display !== "none";
      })(),
      pageHiddenWhileBooting: document.documentElement.classList.contains("is-booting"),
      heroUnlocked: !!(document.querySelector("#hero") || {}).classList &&
        document.querySelector("#hero").classList.contains("is-unlocked"),
      unlockedSections: document.querySelectorAll(".section.is-unlocked").length,
      headlineText: (document.querySelector(".hero__headline") || {}).textContent || "",
      statValues: Array.prototype.map.call(document.querySelectorAll(".hero__stat-value"), function (e) { return e.textContent; }),
      doors: document.querySelectorAll(".door").length,
      formFields: document.querySelectorAll(".contact__form .field").length,
      footerLegal: txt(".footer__bottom p"),
      sections: sections
    };
  });

  await page.screenshot({ path: path.join(OUT, name + "-fold.png") });
  await page.screenshot({ path: path.join(OUT, name + "-full.png"), fullPage: true });
  await page.close();

  console.log("\n  === " + name + " (" + opts.width + "x" + opts.height +
    (opts.reducedMotion ? ", reduced-motion" : "") + (opts.lang ? ", lang=" + opts.lang : "") + ") ===");
  console.log("  lang=" + metrics.htmlLang + "  overflowX=" + metrics.overflowX + "px" +
    "  sections=" + metrics.sections.join(","));
  console.log("  rail: " + JSON.stringify(metrics.rail));
  console.log("  countdown: " + JSON.stringify(metrics.countdown));
  console.log("  h1: " + JSON.stringify(metrics.headline));
  console.log("  prompt: " + JSON.stringify(metrics.prompt));
  console.log("  members=" + metrics.teamPanels + "  boardRows=" + metrics.boardRows +
    "  legendItems=" + metrics.legendItems + "  doors=" + metrics.doors + "  formFields=" + metrics.formFields);
  console.log("  curve: path=" + metrics.curvePath + " len=" + metrics.curveLen +
    " complete=" + metrics.curveComplete);
  console.log("  mascot: visible=" + metrics.mascotVisible + " box=" + JSON.stringify(metrics.mascotBox) +
    " reachedCorner=" + metrics.mascotCornerOk);
  console.log("  boot: lines=" + metrics.bootLines + " overlayShown=" + metrics.bootOverlayShown +
    " pageHidden=" + metrics.pageHiddenWhileBooting + " heroUnlocked=" + metrics.heroUnlocked +
    " unlockedSections=" + metrics.unlockedSections);
  console.log("  headline=" + JSON.stringify(metrics.headlineText) + " stats=" + JSON.stringify(metrics.statValues));
  console.log("  footer: " + JSON.stringify(metrics.footerLegal));
  if (logs.length) {
    console.log("  CONSOLE:");
    logs.forEach(function (l) { console.log("    ! " + l); });
  } else {
    console.log("  console: clean");
  }

  if (metrics.overflowX > 1) problems.push(name + ": horizontal overflow of " + metrics.overflowX + "px");
  if (!metrics.headline) problems.push(name + ": hero headline is EMPTY");
  /* the boot must actually finish and reveal the page — a stuck overlay or an
     unlocked-never hero would leave the site looking broken for everyone */
  if (opts.expectBooting) {
    if (!metrics.bootOverlayShown) problems.push(name + ": expected the boot terminal to be covering the page");
  } else {
    if (metrics.pageHiddenWhileBooting) problems.push(name + ": page still hidden after boot should have finished");
    if (metrics.bootOverlayShown) problems.push(name + ": boot terminal still covering the page after boot");
    if (!metrics.heroUnlocked) problems.push(name + ": hero was never unlocked");
  }
  if (metrics.teamPanels !== 4) problems.push(name + ": expected 4 member panes, got " + metrics.teamPanels);
  if (metrics.boardRows !== 7) problems.push(name + ": expected 7 board rows, got " + metrics.boardRows);
  if (metrics.legendItems !== metrics.expectedPoints) problems.push(name + ": expected " + metrics.expectedPoints + " legend items, got " + metrics.legendItems);
  if (!metrics.curvePath) problems.push(name + ": score curve did not render");
  if (logs.some(function (l) { return l.indexOf("pageerror") === 0; })) problems.push(name + ": page error thrown");

  return metrics;
}

/* Per-section shots, and a scroll test that proves the score curve's
   IntersectionObserver actually fires — if it never does, .run__line stays at
   stroke-dashoffset 2200 and the centrepiece renders INVISIBLE. */
async function captureSections(browser) {
  var page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 30000 });
  await new Promise(function (r) { setTimeout(r, 2200); });

  /* derived from the page, not hard-coded — a new section should not need this
     file edited to get a screenshot */
  var names = await page.evaluate(function () {
    return Array.prototype.map.call(
      document.querySelectorAll("[data-section]"),
      function (s) { return s.getAttribute("data-section"); }
    );
  });
  for (var i = 0; i < names.length; i++) {
    var el = await page.$("#" + names[i]);
    if (!el) { problems.push("missing section #" + names[i]); continue; }
    /* scroll it in and WAIT: the score curve draws over 1.6s once its observer
       fires, so screenshotting immediately catches a partly-drawn line and
       looks like a broken chart */
    await page.evaluate(function (id) {
      var s = document.getElementById(id);
      if (s) s.scrollIntoView({ block: "start" });
    }, names[i]);
    await new Promise(function (r) { setTimeout(r, 2200); });
    await el.screenshot({ path: path.join(OUT, "section-" + names[i] + ".png") });
  }

  await page.evaluate(function () {
    document.querySelector("#run").scrollIntoView({ block: "center" });
  });
  await new Promise(function (r) { setTimeout(r, 2800); });

  var after = await page.evaluate(function () {
    var svg = document.querySelector(".run__svg");
    var line = document.querySelector(".run__line");
    var cs = line ? getComputedStyle(line) : null;
    return {
      complete: !!(svg && svg.classList.contains("is-complete")),
      dashoffset: cs ? cs.strokeDashoffset : null,
      marksVisible: (function () {
        var m = document.querySelector(".run__marks");
        return m ? getComputedStyle(m).opacity : null;
      })()
    };
  });
  console.log("\n  === score curve, after scrolling into view ===");
  console.log("  is-complete=" + after.complete + "  stroke-dashoffset=" + after.dashoffset +
    "  marks-opacity=" + after.marksVisible);
  if (!after.complete) problems.push("curve did not complete when scrolled into view (it would render invisible)");
  if (after.dashoffset !== null && parseFloat(after.dashoffset) > 1 && after.complete) {
    problems.push("curve marked complete but stroke-dashoffset is still " + after.dashoffset);
  }

  await page.screenshot({ path: path.join(OUT, "run-inview.png") });

  /* one capture per run tab. The tabs are re-rendered on every switch, so an
     element handle taken up front is detached after the first click — query by
     id each time instead. */
  var runIds = await page.evaluate(function () {
    return ((window.SITE_CONFIG.run || {}).tasks || []).map(function (t) { return t.id; });
  });
  for (var ti = 0; ti < runIds.length; ti++) {
    await page.evaluate(function (id) {
      var b = document.querySelector('[data-run-task="' + id + '"]');
      if (b) b.click();
    }, runIds[ti]);
    await new Promise(function (r) { setTimeout(r, 2400); });
    var sec = await page.$("#run");
    if (sec) await sec.screenshot({ path: path.join(OUT, "run-" + runIds[ti] + ".png") });
  }
  var mascot = await page.$(".mascot");
  if (mascot) {
    await mascot.screenshot({ path: path.join(OUT, "mascot.png") });
    /* enlarged, so its proportions can actually be checked against the artwork */
    await page.evaluate(function () {
      var m = document.querySelector(".mascot");
      if (m) m.style.width = "340px";
    });
    await new Promise(function (r) { setTimeout(r, 300); });
    await mascot.screenshot({ path: path.join(OUT, "mascot-large.png") });
    await page.evaluate(function () {
      var m = document.querySelector(".mascot");
      if (m) m.style.width = "";
    });
  }

  /* Force each event state and capture it. Waiting for the random 30s timer
     four times would make this a two-minute screenshot run, and it would not be
     reproducible. */
  var STATES = ["wave", "uwu", "salute", "locked"];
  for (var si = 0; si < STATES.length; si++) {
    await page.evaluate(function (st) {
      var m = document.querySelector(".mascot");
      if (!m) return;
      m.style.width = "300px";
      m.className = "mascot mascot--settled mascot--busy mascot--" + st;
    }, STATES[si]);
    await new Promise(function (r) { setTimeout(r, 700); });
    var one = await page.$(".mascot");
    if (one) await one.screenshot({ path: path.join(OUT, "mascot-" + STATES[si] + ".png") });
  }

  await page.close();
}

(async function () {
  var browser = await puppeteer.launch({ headless: "new", args: ["--allow-file-access-from-files"] });
  try {
    await capture(browser, "desktop", { width: 1440, height: 900 });
    await capture(browser, "boot", { width: 1440, height: 900, settle: 1150, expectBooting: true });
    await capture(browser, "desktop-reduced", { width: 1440, height: 900, reducedMotion: true });
    await capture(browser, "mobile", { width: 390, height: 844 });
    await capture(browser, "danish", { width: 1440, height: 900, lang: "da" });
    await captureSections(browser);
  } finally {
    await browser.close();
  }

  console.log("\n  ------------------------------------------------");
  if (problems.length) {
    console.log("  PROBLEMS:");
    problems.forEach(function (p) { console.log("    x " + p); });
    process.exit(1);
  }
  console.log("  no structural problems found");
  console.log("  screenshots in ./shots/\n");
})();
