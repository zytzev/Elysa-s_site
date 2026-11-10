/* The markup every page shares: top bar, footer and mascot. One copy here, so
   a change to the header is one edit rather than one per page. Must load after
   <main> and before script.js, which fills all of this in. */
(function () {
  "use strict";
  var main = document.getElementById("main");
  if (!main) return;
  var isHome = document.documentElement.getAttribute("data-page") === "home";
  /* on a detail page the logo goes home; at home it goes to the top */
  var brandHref = isHome ? "#top" : "./";

  main.insertAdjacentHTML("beforebegin", `
<a class="skip-link" href="#main">Skip to content</a>

<!-- ============================================================
     SLOT: status rail — pinned, always visible, real state
     ============================================================ -->
<!-- rail + header share one sticky container: the rail wraps on narrow
     screens, so sticking them independently would let them overlap -->
<div class="topbar">
<div class="rail" data-slot="rail">
  <div class="rail__inner container">
    <span class="rail__items" data-fill="rail.items"></span>
    <span class="rail__right">
      <span class="lang" role="group" aria-label="Language">
        <button type="button" class="lang__btn" data-lang="en" aria-pressed="true">EN</button>
        <button type="button" class="lang__btn" data-lang="da" aria-pressed="false">DA</button>
      </span>
    </span>
  </div>
</div>

<header class="site-header" data-slot="header">
  <div class="container site-header__inner">
    <a class="site-header__brand" href="${brandHref}" data-close-menu>
      <span class="site-header__name" data-fill="brand.name"></span>
    </a>
    <nav class="site-header__nav" aria-label="Main navigation" data-fill="nav.links"></nav>
    <span class="site-header__cta" data-fill="nav.cta"></span>
    <button class="site-header__toggle" type="button" data-slot="nav-toggle" aria-label="Toggle menu" aria-expanded="false">
      <span class="site-header__toggle-bar"></span>
      <span class="site-header__toggle-bar"></span>
      <span class="site-header__toggle-bar"></span>
    </button>
  </div>
</header>
</div>
`);

  main.insertAdjacentHTML("afterend", `
<!-- ============================================================
     SLOT: footer
     ============================================================ -->
<footer class="site-footer" data-slot="footer">
  <div class="container">
    <div class="footer__grid">
      <div class="footer__brand">
        <a class="footer__logo" href="${brandHref}">
          <span class="site-header__logo" data-fill="brand.logo"></span>
          <span class="site-header__name" data-fill="brand.name"></span>
        </a>
        <p class="footer__tagline" data-fill="footer.tagline"></p>
      </div>
      <div class="footer__socials" data-fill="footer.socials"></div>
    </div>
    <div class="footer__bottom">
      <p data-fill="footer.legal"></p>
    </div>
  </div>
</footer>

<!-- ============================================================
     MASCOT — arrives centre-screen after the boot sequence, then travels
     to the bottom-right corner under its own steam. Draggable, with
     expressions. Decorative: aria-hidden, and the drag affordance is
     mouse/touch only, so keyboard users are never blocked by it.
     ============================================================ -->
<div class="mascot" data-slot="mascot" aria-hidden="true">
  <svg class="mascot__svg" viewBox="-8 -8 136 122" focusable="false">
    <defs>
      <!-- fractal noise displacement: this is what gives the body its
           organic, breathing surface instead of a flat vector shape.
           scale is driven from JS so it can be switched off for
           reduced-motion users. -->
      <filter id="mascot-goo" x="-40%" y="-40%" width="180%" height="180%">
        <feTurbulence type="fractalNoise" baseFrequency="0.015 0.022" numOctaves="2" seed="7" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" data-slot="mascot-displace"
          scale="0" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
    <g class="mascot__inner" filter="url(#mascot-goo)">
      <path class="mascot__body" d="M32 10 H88 Q94 10 94 16 V32 H104 Q110 32 110 38 V52 Q110 58 104 58 H94 V72 H93 V93 Q93 96 90 96 H85 Q82 96 82 93 V72 H75 V93 Q75 96 72 96 H67 Q64 96 64 93 V72 H57 V93 Q57 96 54 96 H49 Q46 96 46 93 V72 H39 V93 Q39 96 36 96 H31 Q28 96 28 93 V72 H26 V58 H16 Q10 58 10 52 V38 Q10 32 16 32 H26 V16 Q26 10 32 10 Z" />

      <!-- one arm, shown only for the wave and salute states. A single
           element (not a group): transform-box: fill-box did not apply to
           a <g> in Chrome, which left the arm stuck at rest. The bounding
           box starts exactly at the shoulder, so the pivot can be 0% 50%. -->
      <rect class="mascot__arm" x="106" y="38" width="30" height="16" rx="8" />

      <!-- beret, shown only for the salute -->
      <g class="mascot__beret">
        <path class="mascot__beret-crown" d="M28 16 q4 -16 32 -16 q28 0 34 14 q3 8 -6 10 q-28 5 -56 1 q-9 -2 -4 -9 z" />
        <path class="mascot__beret-band" d="M24 15 q34 9 66 0 q5 6 -3 9 q-30 7 -60 0 q-7 -3 -3 -9 z" />
        <path class="mascot__beret-badge" d="M78 1 l2.2 4.6 5 .6 -3.7 3.4 1 5 -4.5 -2.5 -4.5 2.5 1 -5 -3.7 -3.4 5 -.6 z" />
      </g>

      <!-- paint order matters: the bloodshot eyes are drawn FIRST so the
           chevron pupils land on top of them in the locked-in state. Put
           them last and the red simply covers the pupils. -->
      <g class="mascot__eyes">
        <g class="mascot__eyes-angry">
          <circle class="mascot__iris" cx="49" cy="42" r="10" />
          <circle class="mascot__iris" cx="71" cy="42" r="10" />
          <path class="mascot__brow" d="M35 26 L57 35" />
          <path class="mascot__brow" d="M85 26 L63 35" />
        </g>
        <g class="mascot__eyes-default">
          <path class="mascot__eye" d="M43 34 L56 41 L43 48 Z" />
          <path class="mascot__eye" d="M77 34 L64 41 L77 48 Z" />
        </g>
        <g class="mascot__eyes-uwu">
          <path class="mascot__uwu" d="M38 46 q8 -11 16 0" />
          <path class="mascot__uwu" d="M66 46 q8 -11 16 0" />
        </g>
      </g>
    </g>
  </svg>
</div>
<!-- separate from the mascot so the drag's scale/rotation never distorts
     the text; JS keeps its bottom-right corner pinned above the mascot -->
<p class="mascot__speech" data-slot="mascot-speech" aria-hidden="true"></p>
`);
})();
