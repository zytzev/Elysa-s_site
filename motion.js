/* ============================================================================
   elysasecret.com — motion
   ============================================================================
   Every animated behaviour lives here, so the prefers-reduced-motion guard is
   applied in exactly one place rather than being re-derived (and eventually
   forgotten) in each caller.

   Design rule: the static end state is the DEFAULT. Animation is layered on
   top. If this file fails to run, or the visitor prefers reduced motion, the
   page still shows complete, correct content — never a half-drawn chart, a
   scrambled headline that never resolves, or a mascot stuck mid-flight.
   ============================================================================ */
(function () {
  "use strict";

  var REDUCED = !!(
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  /* local copy — script.js's esc() is closure-private, and coupling motion to
     it would make this file unloadable on its own. */
  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  var raf = window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : function (fn) { return window.setTimeout(function () { fn(Date.now()); }, 16); };

  /* ============================================================ countdown === */
  function startCountdown(el, iso, label, units) {
    if (!el) return;
    /* A language switch re-mounts the countdown. Clear the previous timer
       first, or every swap leaves another interval ticking behind it. */
    if (el.__countdownTimer) {
      window.clearInterval(el.__countdownTimer);
      el.__countdownTimer = null;
    }

    /* The unit words are translated, not hard-coded — "20 days" is wrong in
       Danish, where it must read "20 dage". */
    var u = units || { one: "day", many: "days" };

    var target = new Date(iso).getTime();
    if (isNaN(target)) { el.textContent = ""; return; }

    function days() {
      return Math.max(0, Math.ceil((target - Date.now()) / 86400000));
    }
    function paint() {
      var d = days();
      el.textContent = (label ? label + " " : "") + d + " " + (d === 1 ? u.one : u.many);
    }
    paint();
    if (REDUCED) return;
    el.__countdownTimer = window.setInterval(paint, 60000);
  }

  /* ============================================================ typewriter === */
  function typeCommand(el, text, done) {
    if (!el) { if (done) done(); return; }
    text = text || "";
    if (REDUCED) { el.textContent = text; if (done) done(); return; }

    var i = 0;
    el.textContent = "";
    (function tick() {
      el.textContent = text.slice(0, ++i);
      if (i < text.length) window.setTimeout(tick, 34);
      else if (done) done();
    })();
  }

  /* ============================================================== scramble ===
     Resolves text out of random glyphs. This is the reveal used instead of a
     fade: it is native to the terminal idea, and it reads as the page
     *computing* its headline rather than cross-fading it in. */
  var GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789/\\<>*#%$";

  function scramble(el, finalText, done) {
    if (!el) { if (done) done(); return; }
    finalText = finalText == null ? el.textContent : String(finalText);
    if (REDUCED || !finalText) { el.textContent = finalText; if (done) done(); return; }

    var total = Math.max(20, finalText.length + 10);
    var frame = 0;
    (function tick() {
      var out = "";
      for (var i = 0; i < finalText.length; i++) {
        var ch = finalText.charAt(i);
        /* later characters resolve later, so the line settles left to right */
        var resolveAt = (i / finalText.length) * total * 0.72 + total * 0.12;
        if (ch === " ") out += " ";
        else if (frame >= resolveAt) out += ch;
        else out += GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
      }
      el.textContent = out;
      if (frame++ < total) raf(tick);
      else { el.textContent = finalText; if (done) done(); }
    })();
  }

  /* ============================================================== count up ===
     Only touches values that are actually numeric. "1st" and "2nd" are left
     alone rather than being run through a fake number animation. */
  function countUp(els, dur) {
    Array.prototype.forEach.call(els || [], function (el) {
      var raw = String(el.textContent || "").trim();
      if (!/^\d+(\.\d+)?$/.test(raw)) return;
      if (REDUCED) return;
      var decimals = (raw.split(".")[1] || "").length;
      var target = parseFloat(raw);
      var start = null;
      dur = dur || 1150;
      raf(function step(ts) {
        if (start === null) start = ts;
        var p = Math.min(1, (ts - start) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals);
        if (p < 1) raf(step);
        else el.textContent = raw;
      });
    });
  }

  /* ========================================================== boot sequence ===
     Several commands, typed in turn, then a short status readout, then the
     reveal. Under reduced motion none of this runs and the page is simply
     there — the whole sequence is theatre, so skipping it costs nothing. */
  function bootSequence(opts) {
    var log = opts.log;
    if (!log) { if (opts.done) opts.done(); return; }
    if (REDUCED) { if (opts.done) opts.done(); return; }

    var cmds = opts.commands || [];
    var steps = opts.steps || [];

    function line(html, cls) {
      var li = window.document.createElement("li");
      li.className = "boot__line" + (cls ? " " + cls : "");
      li.innerHTML = html;
      log.appendChild(li);
      return li;
    }

    function runCommands(i, then) {
      if (i >= cmds.length) { then(); return; }
      var li = line('<span class="boot__sigil">$</span> <span class="boot__cmd"></span><span class="caret"></span>');
      var cmd = li.querySelector(".boot__cmd");
      var caret = li.querySelector(".caret");
      typeCommand(cmd, cmds[i], function () {
        if (caret) caret.remove();
        window.setTimeout(function () { runCommands(i + 1, then); }, 140);
      });
    }

    function runSteps(s, then) {
      if (s >= steps.length) { then(); return; }
      line(
        '<span class="boot__key">' + esc(steps[s].label) + "</span>" +
        '<span class="boot__dots" aria-hidden="true"></span>' +
        '<span class="boot__status">' + esc(steps[s].status) + "</span>"
      );
      window.setTimeout(function () { runSteps(s + 1, then); }, 250);
    }

    runCommands(0, function () {
      runSteps(0, function () {
        if (opts.readyEl && opts.readyLabel) opts.readyEl.textContent = opts.readyLabel;
        window.setTimeout(function () { if (opts.done) opts.done(); }, 340);
      });
    });
  }

  /* ================================================================= curve === */
  var W = 800;
  var H = 360;
  var PAD = { t: 30, r: 26, b: 44, l: 64 };

  function buildCurve(pts) {
    var values = pts.map(function (p) { return p.value; });
    var max = Math.max.apply(null, values);
    var min = Math.min.apply(null, values);
    var lo = Math.floor(min / 200) * 200;
    var hi = Math.ceil(max / 200) * 200;
    if (hi === lo) hi = lo + 200;

    function x(i) { return PAD.l + (i * (W - PAD.l - PAD.r)) / (pts.length - 1); }
    function y(v) { return H - PAD.b - ((v - lo) / (hi - lo)) * (H - PAD.t - PAD.b); }

    var d = pts
      .map(function (p, i) { return (i ? "L" : "M") + x(i).toFixed(1) + " " + y(p.value).toFixed(1); })
      .join(" ");

    var grid = "";
    for (var v = lo; v <= hi; v += 200) {
      var gy = y(v).toFixed(1);
      grid +=
        '<line class="run__gridline" x1="' + PAD.l + '" x2="' + (W - PAD.r) +
        '" y1="' + gy + '" y2="' + gy + '"/>' +
        '<text class="run__axis" x="' + (PAD.l - 10) + '" y="' + gy +
        '" text-anchor="end" dominant-baseline="middle">' + v + "</text>";
    }
    return { x: x, y: y, d: d, grid: grid };
  }

  function startCurve(svg, pts, opts) {
    if (!svg || !pts || !pts.length) return;
    opts = opts || {};
    var c = buildCurve(pts);

    var marks = "";
    pts.forEach(function (p, i) {
      var px = c.x(i).toFixed(1);
      var py = c.y(p.value).toFixed(1);
      var cls = p.kind === "evaluated" ? "run__dot--evaluated"
        : p.kind === "validation" ? "run__dot--validation"
        : "run__dot--local";
      /* Edge labels anchor inward, or the first value sits on top of the
         y-axis tick at the same height. */
      var anchor = i === 0 ? "start" : i === pts.length - 1 ? "end" : "middle";
      var lx = c.x(i) + (i === 0 ? 8 : i === pts.length - 1 ? -8 : 0);
      marks +=
        '<circle class="run__dot ' + cls + '" cx="' + px + '" cy="' + py + '" r="4"/>' +
        '<text class="run__value" x="' + lx.toFixed(1) + '" y="' + (c.y(p.value) - 13).toFixed(1) +
        '" text-anchor="' + anchor + '">' + (p.approx ? "~" : "") + p.value + "</text>";
    });

    svg.innerHTML =
      c.grid +
      '<path class="run__line" d="' + c.d + '"/>' +
      '<g class="run__marks">' + marks + "</g>";

    /* The legend carries every value as plain text, so the whole story is
       available without seeing the chart at all. */
    if (opts.legend && opts.t) {
      opts.legend.innerHTML = pts
        .map(function (p) {
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

    if (REDUCED) { svg.classList.add("is-complete"); return; }
    svg.classList.add("is-animated");
    if (opts.onReady) opts.onReady(svg);
  }

  function drawOnScroll(svg) {
    if (!svg) return;
    if (REDUCED) { svg.classList.add("is-complete"); return; }
    if (!("IntersectionObserver" in window)) { svg.classList.add("is-complete"); return; }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          raf(function () { svg.classList.add("is-complete"); });
          observer.disconnect();
        });
      },
      { threshold: 0.35 }
    );
    observer.observe(svg);
  }

  /* ================================================================ mascot ===
     Positioned entirely by transform: translate(x, y) scale(sx, sy). That one
     mechanism covers the entrance, the idle, dragging, and the return home —
     so there is no fighting between CSS `right/bottom` and animation.

     Organic feel comes from two places:
       - non-uniform scale (squash and stretch) as it moves and lands
       - a fractal-noise displacement filter whose scale rises while it is
         travelling and falls to a slow idle breath once it settles
     ======================================================================== */
  var SIZE = 128;              /* fallback only — the live size is measured */
  var MARGIN = 18;
  var pos = { x: 0, y: 0 };
  var drag = null;
  var settled = false;
  var mascotEl = null;
  var dispEl = null;
  var wobbleRAF = null;

  /* Measured with offsetWidth/Height, which — unlike getBoundingClientRect —
     ignore the transform, so the corner stays correct while the mascot is
     mid-flight or carrying a drag scale. */
  function size() {
    if (!mascotEl) return { w: SIZE, h: SIZE * 0.883 };
    return {
      w: mascotEl.offsetWidth || SIZE,
      h: mascotEl.offsetHeight || SIZE * 0.883
    };
  }

  function corner() {
    var s = size();
    return {
      x: window.innerWidth - s.w - MARGIN,
      y: window.innerHeight - s.h - MARGIN
    };
  }

  function clampPos(p) {
    var s = size();
    return {
      x: Math.max(4, Math.min(window.innerWidth - s.w - 4, p.x)),
      y: Math.max(4, Math.min(window.innerHeight - s.h - 4, p.y))
    };
  }

  function apply(p, sx, sy, rot) {
    pos = p;
    if (!mascotEl) return;
    mascotEl.style.transform =
      "translate(" + p.x.toFixed(1) + "px," + p.y.toFixed(1) + "px)" +
      " scale(" + (sx == null ? 1 : sx) + "," + (sy == null ? 1 : sy) + ")" +
      " rotate(" + (rot || 0) + "deg)";
  }

  /* slow idle breath once it has arrived */
  function startBreath() {
    if (REDUCED || !dispEl) return;
    var t0 = Date.now();
    (function loop() {
      var t = (Date.now() - t0) / 1000;
      var breath = 0.9 + Math.sin(t * 1.15) * 0.5;
      dispEl.setAttribute("scale", breath.toFixed(2));
      wobbleRAF = raf(loop);
    })();
  }

  function stopBreath() {
    if (wobbleRAF) { window.cancelAnimationFrame(wobbleRAF); wobbleRAF = null; }
  }

  function enter() {
    if (!mascotEl) return;
    var to = corner();

    if (REDUCED) {
      apply(to);
      mascotEl.classList.add("mascot--settled");
      settled = true;
      return;
    }

    var s = size();
    var from = {
      x: window.innerWidth / 2 - s.w / 2,
      y: window.innerHeight * 0.42 - s.h / 2
    };
    var fromScale = Math.min(2.9, Math.max(1.8, window.innerWidth / 460));

    mascotEl.classList.add("mascot--travelling");
    apply(from, fromScale, fromScale, -9);

    /* the displacement scale peaks mid-flight and decays on landing — this is
       the "shape dilation" that makes the shape feel liquid rather than rigid */
    var start = Date.now();
    var dur = 2300;
    (function fly() {
      var p = Math.min(1, (Date.now() - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      var x = from.x + (to.x - from.x) * eased;
      var y = from.y + (to.y - from.y) * eased;
      /* an arc, so it does not travel in a straight line */
      y -= Math.sin(p * Math.PI) * (window.innerHeight * 0.16);
      /* squash going out, stretch at speed, squash on landing */
      var stretch = 1 + Math.sin(p * Math.PI) * 0.22 - (p > 0.86 ? (p - 0.86) * 1.6 : 0);
      var sx = 1 / stretch;
      var sy = stretch;
      var scale = fromScale + (1 - fromScale) * eased;
      var rot = -9 + p * 15;
      apply({ x: x, y: y }, sx * scale, sy * scale, rot);

      if (dispEl) dispEl.setAttribute("scale", (7 * (1 - p) * (1 - p) + 0.9).toFixed(2));

      if (p < 1) raf(fly);
      else {
        apply(to, 1, 1, 0);
        mascotEl.classList.remove("mascot--travelling");
        mascotEl.classList.add("mascot--settled");
        settled = true;
        startBreath();
      }
    })();
  }

  function goHome() {
    if (!mascotEl) return;
    var to = corner();
    if (REDUCED) { apply(to); return; }
    var from = { x: pos.x, y: pos.y };
    var start = Date.now();
    var dur = 620;
    mascotEl.classList.add("mascot--travelling");
    (function back() {
      var p = Math.min(1, (Date.now() - start) / dur);
      var eased = 1 - Math.pow(1 - p, 2.2);
      /* overshoot slightly, then settle */
      var over = Math.sin(p * Math.PI) * 10;
      var x = from.x + (to.x - from.x) * eased;
      var y = from.y + (to.y - from.y) * eased - over;
      var squash = 1 + Math.sin(p * Math.PI) * 0.14;
      apply({ x: x, y: y }, squash, 1 / squash, 0);
      if (p < 1) raf(back);
      else {
        apply(to, 1, 1, 0);
        mascotEl.classList.remove("mascot--travelling");
        startBreath();
      }
    })();
  }

  function wireDrag(el) {
    el.addEventListener("pointerdown", function (e) {
      if (drag) return;
      stopBreath();
      el.setPointerCapture(e.pointerId);
      drag = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
      el.classList.remove("mascot--giggle");
      el.classList.add("mascot--held", "mascot--annoyed");
      e.preventDefault();
    });

    el.addEventListener("pointermove", function (e) {
      if (!drag) return;
      apply(clampPos({ x: e.clientX - drag.dx, y: e.clientY - drag.dy }), 1.04, 0.96, 0);
    });

    function release(e) {
      if (!drag) return;
      drag = null;
      el.classList.remove("mascot--held", "mascot--annoyed");
      /* the longer it was held, the more it complains on landing */
      el.classList.add("mascot--giggle");
      window.setTimeout(function () { el.classList.remove("mascot--giggle"); }, 950);
      goHome();
    }
    el.addEventListener("pointerup", release);
    el.addEventListener("pointercancel", release);
  }

  function initMascot() {
    mascotEl = window.document.querySelector("[data-slot=\"mascot\"]");
    if (!mascotEl) return;
    dispEl = window.document.querySelector("[data-slot=\"mascot-displace\"]");
    apply(corner());
    wireDrag(mascotEl);

    window.addEventListener("resize", function () {
      if (drag) return;
      if (settled) apply(corner());
    });
  }

  function mascotEnter() {
    if (!mascotEl) return;
    enter();
  }

  window.SiteMotion = {
    reduced: REDUCED,
    startCountdown: startCountdown,
    typeCommand: typeCommand,
    scramble: scramble,
    countUp: countUp,
    bootSequence: bootSequence,
    startCurve: startCurve,
    drawOnScroll: drawOnScroll,
    initMascot: initMascot,
    mascotEnter: mascotEnter
  };
})();
