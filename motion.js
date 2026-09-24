/* ============================================================================
   elysasecret.com — motion
   ============================================================================
   Every animated behaviour lives here, so the prefers-reduced-motion guard is
   applied in exactly one place rather than being re-derived (and eventually
   forgotten) in each caller.

   Design rule: the static end state is the DEFAULT. Animation is layered on
   top via the `is-animated` class. If this file fails to run, or the visitor
   prefers reduced motion, the page still shows complete, correct content —
   never a half-drawn chart or a blank headline.
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

  /* ============================================================ countdown ===
     Ticks once a minute, which is more than enough for a day counter. Under
     reduced motion the value is painted once and never updated. */
  function startCountdown(el, iso, label) {
    if (!el) return;
    /* A language switch re-mounts the countdown. Clear the previous timer
       first, or every swap leaves another interval ticking behind it. */
    if (el.__countdownTimer) {
      window.clearInterval(el.__countdownTimer);
      el.__countdownTimer = null;
    }

    var target = new Date(iso).getTime();
    if (isNaN(target)) { el.textContent = ""; return; }

    function days() {
      return Math.max(0, Math.ceil((target - Date.now()) / 86400000));
    }
    function paint() {
      var d = days();
      var suffix = d === 1 ? " day" : " days";
      el.textContent = (label ? label + " " : "") + d + suffix;
    }
    paint();
    if (REDUCED) return;
    el.__countdownTimer = window.setInterval(paint, 60000);
  }

  /* ============================================================ typewriter ===
     Types a command into an element, then calls done(). Under reduced motion
     the text is set instantly and done() fires immediately. */
  function typeCommand(el, text, done) {
    if (!el) { if (done) done(); return; }
    text = text || "";
    if (REDUCED) { el.textContent = text; if (done) done(); return; }

    var i = 0;
    el.textContent = "";
    (function tick() {
      el.textContent = text.slice(0, ++i);
      if (i < text.length) window.setTimeout(tick, 45);
      else if (done) done();
    })();
  }

  /* ================================================================= curve ===
     Hand-rolled SVG so there is no charting library and no build step. */
  var W = 800;
  var H = 360;
  var PAD = { t: 30, r: 26, b: 44, l: 56 };

  function buildCurve(pts) {
    var values = pts.map(function (p) { return p.value; });
    var max = Math.max.apply(null, values);
    var min = Math.min.apply(null, values);
    var lo = Math.floor(min / 200) * 200;
    var hi = Math.ceil(max / 200) * 200;
    if (hi === lo) hi = lo + 200;

    function x(i) {
      return PAD.l + (i * (W - PAD.l - PAD.r)) / (pts.length - 1);
    }
    function y(v) {
      return H - PAD.b - ((v - lo) / (hi - lo)) * (H - PAD.t - PAD.b);
    }

    var d = pts
      .map(function (p, i) {
        return (i ? "L" : "M") + x(i).toFixed(1) + " " + y(p.value).toFixed(1);
      })
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
      var cls = p.kind === "validation" ? "run__dot--validation" : "run__dot--local";
      marks +=
        '<circle class="run__dot ' + cls + '" cx="' + px + '" cy="' + py + '" r="4"/>' +
        '<text class="run__value" x="' + px + '" y="' + (c.y(p.value) - 13).toFixed(1) +
        '" text-anchor="middle">' + (p.approx ? "~" : "") + p.value + "</text>";
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
            (p.noteKey
              ? '<span class="run__legend-note">' + esc(opts.t(p.noteKey)) + "</span>"
              : "") +
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
    if (opts.onReady) opts.onReady(svg);
  }

  /* Adds is-complete once the chart is genuinely on screen. Falls back to
     immediately-complete if IntersectionObserver is unavailable. */
  function drawOnScroll(svg) {
    if (!svg) return;
    if (REDUCED) { svg.classList.add("is-complete"); return; }
    if (!("IntersectionObserver" in window)) { svg.classList.add("is-complete"); return; }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          /* one frame's gap so the transition has a start state to animate from */
          window.requestAnimationFrame(function () { svg.classList.add("is-complete"); });
          observer.disconnect();
        });
      },
      { threshold: 0.35 }
    );
    observer.observe(svg);
  }

  window.SiteMotion = {
    reduced: REDUCED,
    startCountdown: startCountdown,
    typeCommand: typeCommand,
    startCurve: startCurve,
    drawOnScroll: drawOnScroll
  };
})();
