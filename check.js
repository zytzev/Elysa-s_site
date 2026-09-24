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
      vm.runInContext(
        b.replace(/^<script>/, "").replace(/<\/script>$/, ""),
        ctx
      );
    });
  }
  var i18n = read("i18n.js");
  if (i18n) vm.runInContext(i18n, ctx);
  return ctx.window;
}

var w = loadGlobals();
var config = w.SITE_CONFIG;
var i18n = w.I18N;

if (config) ok();
else fail("SITE_CONFIG present in index.html");
if (i18n) ok();
else fail("I18N present in i18n.js");

/* ---- helpers ------------------------------------------------------------ */
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

/* ---- 1. no bracketed placeholders remain -------------------------------- */
if (config) {
  var ALLOWED_BRACKETS = ["[YEAR]"]; /* footer legal token, replaced at render */
  var offenders = [];
  (function walk(node, trail) {
    if (typeof node === "string") {
      var hits = node.match(/\[[A-Za-z][^\]]*\]/g) || [];
      hits.forEach(function (hit) {
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
var enFlat, daFlat;
if (i18n && i18n.en && i18n.da) {
  enFlat = flatten(i18n.en, "");
  daFlat = flatten(i18n.da, "");
  var missingDa = Object.keys(enFlat).filter(function (k) { return !(k in daFlat); });
  var missingEn = Object.keys(daFlat).filter(function (k) { return !(k in enFlat); });
  if (missingDa.length || missingEn.length) {
    fail("EN/DA key parity",
      "missing in da: " + (missingDa.join(", ") || "none") +
      " | missing in en: " + (missingEn.join(", ") || "none"));
  } else ok();
} else if (i18n) {
  fail("I18N has both en and da dictionaries");
}

/* ---- 3. every key referenced by SITE_CONFIG resolves in both languages ---
   Resolved with the SAME dotted-path walk t() uses in script.js — NOT against
   a flattened map. Flattening would accept an i18n entry written as a flat
   dotted key ("alex.task"), which t() cannot reach, so every one of those
   strings would render blank at runtime while this check stayed green. */
function collectKeys(node, trail, out) {
  out = out || [];
  /* strings FIRST — a `typeof node !== "object"` guard ahead of this line
     returns early for every string and silences the whole check, which is
     how this function spent its first version collecting nothing at all. */
  if (typeof node === "string") {
    /* any `somethingKey` property, plus a plain `.key` — a new key-suffixed
       field must not be able to slip past validation just because it is not
       in a hand-maintained list */
    if (/Key$/.test(trail || "") || /(?:^|\.)key$/.test(trail || "")) {
      out.push(node);
    }
    return out;
  }
  if (!node || typeof node !== "object") return out;
  Object.keys(node).forEach(function (k) {
    collectKeys(node[k], trail ? trail + "." + k : k, out);
  });
  return out;
}
function dig(root, key) {
  return String(key).split(".").reduce(function (node, part) {
    return node == null ? undefined : node[part];
  }, root);
}
if (config && i18n && i18n.en && i18n.da) {
  var referenced = collectKeys(config, "");
  var unresolved = referenced.filter(function (k) {
    return typeof dig(i18n.en, k) !== "string" || typeof dig(i18n.da, k) !== "string";
  });
  if (unresolved.length) fail("every SITE_CONFIG key resolves in both languages", unresolved.join(", "));
  else ok();
}

/* ---- 4. the team's own figures trace to spec §2 --------------------------
   Scoped deliberately to the paths that carry the team's CLAIMS about itself
   (rail, hero, members, the curve, and the highlighted board row). The rest of
   the leaderboard is other teams' data, transcribed from the screenshots; a
   hand-maintained allowlist for it would be noise that hides real errors. */
var ALLOWED_NUMBERS = [
  "1st", "2nd", "45.00", "36.51", "35.97", "-0.54", "0.54",
  "12.00", "10.00", "8.00", "25.00", "0.97",
  "1405.256", "0.263", "0.822",
  "344.26", "600", "1128", "778", "1280", "1576", "1812", "1447",
  /* taken from the team's own repository (survival-v2/RESULTS.md,
     drone-flyby/SERVED_CONFIG.md, medical-appointment/REPRODUCE.md and
     SUBMISSIONS.md) rather than from the earlier verbal account */
  "308", "437", "570", "709", "1014", "1239", "1484", "1815",
  "0.5841", "0.263", "0.2630", "0.802", "0.8308", "0.8222",
  /* the team's rank on the highlighted row of each board: 1 in Denmark,
     2 in the Nordic combined. Listed as the real placements rather than a
     blanket 1-7, so a wrong rank on the team's own row still fails. */
  "1", "2"
];
function numericFields(node, trail, out) {
  out = out || [];
  if ((typeof node === "string" || typeof node === "number") &&
      /(?:^|\.)(value|raw|points|total|place)$/.test(trail || "")) {
    out.push(String(node));
  }
  if (node && typeof node === "object") {
    Object.keys(node).forEach(function (k) {
      numericFields(node[k], trail ? trail + "." + k : k, out);
    });
  }
  return out;
}
if (config) {
  var claimRoots = [
    ["statusRail", config.statusRail],
    ["hero.stats", config.hero && config.hero.stats],
    ["team.members", config.team && config.team.members],
    ["run", config.run]
  ];
  /* the team's own row on each board */
  Object.keys((config.board && config.board.boards) || {}).forEach(function (id) {
    var rows = config.board.boards[id].rows || [];
    rows.forEach(function (r, i) {
      if (r.highlight) claimRoots.push(["board." + id + ".row" + i, r]);
    });
  });

  var claimed = [];
  claimRoots.forEach(function (pair) {
    numericFields(pair[1], pair[0], claimed);
  });
  var bad = claimed.filter(function (v) { return ALLOWED_NUMBERS.indexOf(v) === -1; });
  if (bad.length) fail("every figure the team claims traces to spec §2", bad.join(", "));
  else ok();
}

/* ---- 5. sections[] only names shells that exist -------------------------- */
var html = read("index.html") || "";
var shellIds = (html.match(/data-section="[a-z-]+"/g) || []).map(function (s) {
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
  if (badNav.length) fail("nav links match active sections",
    badNav.map(function (l) { return l.href; }).join(", "));
  else ok();
}

/* ---- 7. forbidden strings ----------------------------------------------- */
var sources = {
  "index.html": html,
  "i18n.js": read("i18n.js") || "",
  "styles.css": read("styles.css") || "",
  "script.js": read("script.js") || "",
  "motion.js": read("motion.js") || ""
};
var banned = [
  { re: /Secrete/i, why: "team name is Elysa's Secret (spec §2)" },
  { re: /\[Your |\[Feature|\[Item |\[Eyebrow|\[Short tagline/i, why: "template placeholder text" },
  { re: /crazy-motors/i, why: "template source project leak" },
  { re: /hi@example\.com|\+00 000 000 000/, why: "template contact placeholder" }
];
banned.forEach(function (b) {
  var hits = Object.keys(sources).filter(function (f) { return b.re.test(sources[f]); });
  if (hits.length) fail("no forbidden string (" + b.why + ")", hits.join(", "));
  else ok();
});

/* ---- 8. the only published address is the team address ------------------ */
if (config && config.contact) {
  /* input placeholders are illustrative, not published addresses */
  var PLACEHOLDER_DOMAINS = ["@example.com", "@eksempel.dk", "@example.org"];
  var mailRe = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;
  var found = (Object.keys(sources).map(function (f) { return sources[f]; }).join("\n").match(mailRe) || [])
    .filter(function (a) { return a !== config.contact.email; })
    .filter(function (a) {
      return !PLACEHOLDER_DOMAINS.some(function (d) { return a.indexOf(d) !== -1; });
    });
  if (found.length) fail("only " + config.contact.email + " is published", found.join(", "));
  else ok();
}

/* ---- 9. required files exist ------------------------------------------- */
["index.html", "i18n.js", "styles.css", "script.js", "motion.js", "README.md"].forEach(function (f) {
  if (fs.existsSync(path.join(ROOT, f))) ok();
  else fail("required file present: " + f);
});

/* ---- 10. every data-fill in index.html can actually be filled -----------
   The three-file contract: each [data-fill] must be a renderer, a translated
   key, or a resolvable config path. A typo here renders as an empty element
   and is invisible until someone reads the page. */
var scriptSrc = sources["script.js"];
var rendererKeys = (scriptSrc.match(/\n\s*"([A-Za-z0-9._-]+)":\s*function/g) || [])
  .map(function (m) { return m.match(/"([^"]+)"/)[1]; });

/* mirrors TEXT_KEYS in script.js — keep the two in step, or a real
   data-fill silently stops resolving */
var TEXT_KEYS_RE = /(?:^|\.)(headline|heading|sub|text|tagline|legal|title|badge|note|caption|label)$/;
function at(obj, key) {
  return String(key).split(".").reduce(function (node, part) {
    return node == null ? undefined : node[part];
  }, obj);
}

if (config && enFlat) {
  var fillKeys = (html.match(/data-fill="([^"]+)"/g) || [])
    .map(function (s) { return s.replace(/data-fill="|"/g, ""); });

  /* returns true for keys that CANNOT be filled */
  var unrenderable = fillKeys.filter(function (k) {
    if (rendererKeys.indexOf(k) !== -1) return false;                /* renderer */
    if (TEXT_KEYS_RE.test(k)) return !(k in enFlat && k in daFlat);  /* translation */
    var v = at(config, k);                                           /* config value */
    return !(typeof v === "string" || typeof v === "number");
  });

  if (unrenderable.length) {
    fail("every data-fill has a renderer, a translation, or a config value",
      unrenderable.join(", "));
  } else ok();
}

/* ---- 11. every data-slot selector points at a real element ------------- */
var slotAttrs = (html.match(/data-slot="([^"]+)"/g) || [])
  .map(function (s) { return s.replace(/data-slot="|"/g, ""); });
/* slots created at runtime by a renderer, so absent from index.html */
var DYNAMIC_SLOTS = ["form-status"];

var queriedSlots = [];
["script.js", "motion.js"].forEach(function (f) {
  (sources[f].match(/\[data-slot="([^"]+)"\]/g) || []).forEach(function (m) {
    queriedSlots.push(m.replace(/\[data-slot="|"\]/g, ""));
  });
});
var ghostSlots = queriedSlots.filter(function (s) {
  return slotAttrs.indexOf(s) === -1 && DYNAMIC_SLOTS.indexOf(s) === -1;
});
if (ghostSlots.length) {
  fail("every [data-slot] selector matches an element in index.html",
    ghostSlots.join(", "));
} else ok();

/* ---- report ------------------------------------------------------------- */
console.log("\n  elysasecret.com — integrity check\n");
if (failures.length) {
  console.log("  FAILED  " + failures.length + "  (passed " + passed + ")\n");
  failures.forEach(function (f) { console.log("    x " + f); });
  console.log("");
  process.exit(1);
}
console.log("  ok — all " + passed + " checks passed\n");
process.exit(0);
