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

  /* ========================================================= detailed clock ===
     Days / hours / minutes / seconds, ticking once a second. Reduced motion
     paints a single frame and stops: a ticking clock is exactly the kind of
     motion that setting exists to suppress. */
  var clockTimer = null;

  function startClock(iso, els) {
    if (!els || !els.d) return;
    var target = new Date(iso).getTime();
    if (isNaN(target)) return;

    function pad(n) {
      n = String(n);
      return n.length < 2 ? "0" + n : n;
    }
    function paint() {
      var s = Math.max(0, Math.floor((target - Date.now()) / 1000));
      els.d.textContent = pad(Math.floor(s / 86400));
      if (els.h) els.h.textContent = pad(Math.floor((s % 86400) / 3600));
      if (els.m) els.m.textContent = pad(Math.floor((s % 3600) / 60));
      if (els.s) els.s.textContent = pad(s % 60);
    }
    paint();
    if (clockTimer) { window.clearInterval(clockTimer); clockTimer = null; }
    if (REDUCED) return;
    clockTimer = window.setInterval(paint, 1000);
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
  var speechEl = null;
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

  /* One render path. Position, scale and rotation are separate pieces of state
     so a wall impact can drive the squash while a drag drives the position —
     otherwise the two overwrite each other's transform every frame. */
  var scaleState = { x: 1, y: 1 };
  var rotState = 0;

  function render() {
    if (!mascotEl) return;
    mascotEl.style.transform =
      "translate(" + pos.x.toFixed(1) + "px," + pos.y.toFixed(1) + "px)" +
      " scale(" + scaleState.x + "," + scaleState.y + ")" +
      " rotate(" + rotState + "deg)";
    /* the speech is a separate fixed element, kept pinned just above the
       mascot's top-right corner. It is NOT a child of the mascot: the drag
       scales and rotates that element, and a bubble inside it would shear. */
    if (speechEl) {
      var s = size();
      speechEl.style.transform =
        "translate(" + (pos.x + s.w).toFixed(1) + "px," + (pos.y - 8).toFixed(1) + "px)" +
        " translate(-100%, -100%)";
    }
  }

  function apply(p, sx, sy, rot) {
    pos = p;
    scaleState = { x: sx == null ? 1 : sx, y: sy == null ? 1 : sy };
    rotState = rot || 0;
    render();
  }

  /* slow idle breath once it has arrived */
  function startBreath() {
    if (REDUCED || !dispEl) return;
    /* guard: place() can be called more than once (init, then after the boot),
       and each call would otherwise leave another rAF loop running forever */
    if (wobbleRAF) return;
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

  /* No entrance flight. The mascot is simply there, in the corner, from the
     moment the page appears — the drag-and-return ("magnet") is what stays. */
  function place() {
    if (!mascotEl) return;
    apply(corner());
    mascotEl.classList.add("mascot--settled");
    settled = true;
    startBreath();
  }

  /* There is deliberately no wall-impact reaction. A mascot that squashes when
     you slam it into an edge was built and then cut: it read as a gag bolted
     onto the interface rather than part of it. */

  function goHome() {
    if (!mascotEl) return;
    var to = corner();
    if (REDUCED) { apply(to); return; }
    var from = { x: pos.x, y: pos.y };
    var start = Date.now();
    /* Low gravity, not a zip. It hangs and drifts back over ~1.5s with a
       decaying float and a lazy rotation, rather than snapping to the corner. */
    var dur = 1500;
    mascotEl.classList.add("mascot--travelling");
    (function back() {
      var p = Math.min(1, (Date.now() - start) / dur);
      var eased = 1 - Math.pow(1 - p, 1.7);                 /* gentle deceleration */
      var x = from.x + (to.x - from.x) * eased;
      var y = from.y + (to.y - from.y) * eased;
      var float = Math.sin(p * Math.PI * 1.7) * 22 * (1 - p); /* it lingers, then settles */
      var squash = 1 + Math.sin(p * Math.PI) * 0.07;
      var rot = Math.sin(p * Math.PI * 2.1) * 4 * (1 - p);
      apply({ x: x, y: y - float }, squash, 1 / squash, rot);
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
      setMascotState(null);              /* cancel whatever event was running */
      clearSpeech();
      el.setPointerCapture(e.pointerId);
      drag = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
      el.classList.remove("mascot--giggle");
      el.classList.add("mascot--held", "mascot--annoyed", "mascot--busy");
      e.preventDefault();
    });

    el.addEventListener("pointermove", function (e) {
      if (!drag) return;
      var clamped = clampPos({ x: e.clientX - drag.dx, y: e.clientY - drag.dy });
      /* leaning slightly while carried, so it reads as being held */
      apply(clamped, 1.03, 0.97, 0);
    });

    function release() {
      if (!drag) return;
      drag = null;
      el.classList.remove("mascot--held", "mascot--annoyed");
      el.classList.add("mascot--giggle");
      window.setTimeout(function () {
        el.classList.remove("mascot--giggle", "mascot--busy");
      }, 950);
      goHome();
    }
    el.addEventListener("pointerup", release);
    el.addEventListener("pointercancel", release);
  }

  /* ------------------------------------------------------- mascot events ---
     Every ~30s the mascot picks one of four states at random and types a line
     at Claude above its head. The state and the line are both re-drawn each
     time, and neither repeats back to back.

     The lines are jokes in English and are deliberately not translated: they
     only work in their own wording. */
  var EVENT_STATES = ["wave", "uwu", "salute", "locked"];
  var eventTimer = null;
  var lastState = null;
  var lastLine = null;

  function setMascotState(name) {
    if (!mascotEl) return;
    EVENT_STATES.forEach(function (s) { mascotEl.classList.remove("mascot--" + s); });
    /* one flag gates the idle breathe/blink, so every state has to do the same
       thing in the same place rather than each excluding the others by name */
    mascotEl.classList.toggle("mascot--busy", !!name);
    if (name) mascotEl.classList.add("mascot--" + name);
  }

  function speak(line) {
    if (!speechEl) return;
    if (REDUCED) { speechEl.textContent = line; speechEl.classList.add("is-on"); return; }
    speechEl.textContent = "";
    speechEl.classList.add("is-on");
    var i = 0;
    (function type() {
      speechEl.textContent = line.slice(0, ++i);
      if (i < line.length) window.setTimeout(type, 55);
    })();
  }

  function clearSpeech() {
    if (!speechEl) return;
    speechEl.classList.remove("is-on");
    window.setTimeout(function () { speechEl.textContent = ""; }, 320);
  }

  function pick(list, last) {
    if (!list.length) return null;
    if (list.length === 1) return list[0];
    var v = list[Math.floor(Math.random() * list.length)];
    if (v === last) v = list[(list.indexOf(v) + 1) % list.length];
    return v;
  }

  function runEvent() {
    if (!mascotEl || drag) return;             /* never interrupt a drag */
    var lines = (window.SITE_CONFIG && window.SITE_CONFIG.mascot &&
      window.SITE_CONFIG.mascot.lines) || [];
    if (!lines.length) return;

    lastState = pick(EVENT_STATES, lastState);
    lastLine = pick(lines, lastLine);

    setMascotState(lastState);
    speak(lastLine);
    window.setTimeout(clearSpeech, 5200);
    window.setTimeout(function () { setMascotState(null); }, 6100);
  }

  function startMascotEvents() {
    if (REDUCED || eventTimer || !mascotEl) return;
    /* the first one comes sooner than the steady beat, so the mechanic is
       discovered rather than missed */
    window.setTimeout(function () {
      runEvent();
      eventTimer = window.setInterval(runEvent, 30000);
    }, 13000);
  }

  function initMascot() {
    mascotEl = window.document.querySelector("[data-slot=\"mascot\"]");
    if (!mascotEl) return;
    dispEl = window.document.querySelector("[data-slot=\"mascot-displace\"]");
    speechEl = window.document.querySelector("[data-slot=\"mascot-speech\"]");
    apply(corner());
    render();                  /* also parks the speech above the corner */
    wireDrag(mascotEl);

    window.addEventListener("resize", function () {
      if (drag) return;
      if (settled) apply(corner());
    });
  }

  function mascotPlace() {
    if (!mascotEl) return;
    place();
  }

  /* --------------------------------------------------- section unlocking ---
     Each section decodes the first time it is reached: its title resolves out
     of random glyphs and its body rises in behind it. This is what makes the
     page feel like a terminal reading itself out rather than a document that
     was already there.

     Two safety nets, because an unlock that never fires means an invisible
     section: anything without an observer is unlocked outright, and a timer
     unlocks whatever is left regardless. */
  function revealSections(doc) {
    var sections = doc.querySelectorAll("[data-section]");
    if (!sections.length) return;

    function unlock(section, animate) {
      if (section.classList.contains("is-unlocked")) return;
      section.classList.add("is-unlocked");
      if (!animate || REDUCED) return;
      var title = section.querySelector(".section__title");
      if (title && title.textContent) scramble(title, title.textContent);
    }

    if (REDUCED || !("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(sections, function (s) { unlock(s, false); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          unlock(entry.target, true);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    Array.prototype.forEach.call(sections, function (s) { observer.observe(s); });

    window.setTimeout(function () {
      Array.prototype.forEach.call(sections, function (s) { unlock(s, false); });
    }, 4000);
  }

  window.SiteMotion = {
    reduced: REDUCED,
    startCountdown: startCountdown,
    startClock: startClock,
    typeCommand: typeCommand,
    scramble: scramble,
    countUp: countUp,
    bootSequence: bootSequence,
    startCurve: startCurve,
    drawOnScroll: drawOnScroll,
    initMascot: initMascot,
    mascotPlace: mascotPlace,
    startMascotEvents: startMascotEvents,
    revealSections: revealSections
  };
})();
