/* ============================================================================
   elysasecret.com — behaviour
   ============================================================================
   Reads window.SITE_CONFIG (data) and window.I18N (prose), fills every
   [data-fill] node, orders sections from config.sections, wires nav, the
   board tabs, the language toggle and the contact form.

   Data and prose are deliberately separate: config holds scores, names and
   dates, i18n.js holds every sentence. Danish-proofreading therefore touches
   exactly one file.
   ============================================================================ */
(function () {
  "use strict";

  var config = window.SITE_CONFIG || {};
  var dict = window.I18N || { en: {}, da: {} };
  var LANG_KEY = "elysasecret.lang";

  /* ------------------------------------------------------------- language --- */
  function readStoredLang() {
    try {
      var v = window.localStorage.getItem(LANG_KEY);
      return v === "en" || v === "da" ? v : null;
    } catch (e) {
      return null; /* private mode / blocked storage — fall through to detection */
    }
  }
  function storeLang(v) {
    try { window.localStorage.setItem(LANG_KEY, v); } catch (e) { /* non-fatal */ }
  }
  function daAvailable() {
    return !!(dict.da && Object.keys(dict.da).length);
  }
  function detectLang() {
    var stored = readStoredLang();
    if (stored && (stored === "en" || daAvailable())) return stored;
    if (daAvailable() && String(navigator.language || "").toLowerCase().indexOf("da") === 0) return "da";
    return "en";
  }

  var lang = detectLang();

  /* t() resolves a dotted key in the active language and falls back to English,
     so a missing Danish string can never render as a blank. */
  function t(key) {
    if (!key) return "";
    var parts = key.split(".");
    function dig(root) {
      return parts.reduce(function (node, p) {
        return node == null ? undefined : node[p];
      }, root);
    }
    var value = dig(dict[lang]);
    if (value === undefined) value = dig(dict.en);
    return value === undefined ? "" : value;
  }

  /* data-fill keys that name a translation rather than a raw config value.
     NOTE: `command` is deliberately absent — config.hero.command is a literal
     shell command, identical in both languages. */
  var TEXT_KEYS = /(?:^|\.)(headline|heading|sub|text|tagline|legal|title|badge|note|caption|label|days|hours|minutes|seconds|venue)$/;

  /* ---------------------------------------------------------------- icons --- */
  var ICONS = {
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>',
    zap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M7 16v-5"/><path d="M12 16V8"/><path d="M17 16v-3"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
    github: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>'
  };
  function icon(name) { return ICONS[name] || ICONS.star; }

  /* -------------------------------------------------------------- helpers --- */
  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
  function at(obj, key) {
    if (!key) return "";
    return key.split(".").reduce(function (node, part) {
      return node == null ? undefined : node[part];
    }, obj);
  }
  function logoHtml(brand) {
    var logo = brand.logo || "";
    if (/^(https?:|\/)/.test(logo)) {
      return '<img src="' + esc(logo) + '" alt="' + esc(brand.name + " logo") + '" />';
    }
    var letter = (brand.name || "?").trim().charAt(0).toUpperCase() || "?";
    return esc(letter);
  }

  /* ------------------------------------------------------------ renderers --- */
  var RENDERERS = {
    "brand.logo": function (el, c) { el.innerHTML = logoHtml(c.brand || {}); },

    "nav.links": function (el, c) {
      el.innerHTML = (c.nav.links || [])
        .map(function (link) {
          return '<a href="' + esc(link.href) + '" data-close-menu>' + esc(t(link.key)) + "</a>";
        })
        .join("");
    },

    "nav.cta": function (el, c) {
      var cta = c.nav.cta;
      el.innerHTML = cta
        ? '<a class="btn btn--primary" href="' + esc(cta.href) + '">' + esc(t(cta.key)) + "</a>"
        : "";
    },

    "rail.items": function (el, c) {
      var rail = c.statusRail || {};
      el.innerHTML = (rail.items || [])
        .map(function (item) {
          /* the place ("1st" / "1.") is translated, so it is a placeKey, not a
             second value — rendering it as its own item printed it twice */
          var place = item.placeKey ? " · " + t(item.placeKey) : "";
          return (
            '<span class="rail__item rail__item--' + esc(item.tone || "plain") + '">' +
            '<span class="rail__key">' + esc(t(item.key)) + "</span>" +
            '<span class="rail__value">' + esc(item.value) + esc(place) + "</span>" +
            "</span>"
          );
        })
        .join("");
    },

    "hero.stats": function (el, c) {
      el.innerHTML = (c.hero.stats || [])
        .map(function (stat) {
          return (
            '<div class="hero__stat">' +
            '<dt class="hero__stat-label">' + esc(t(stat.key)) + "</dt>" +
            '<dd class="hero__stat-value">' + esc(stat.value) + "</dd>" +
            '<dd class="hero__stat-sub">' + esc(t(stat.subKey)) + "</dd>" +
            "</div>"
          );
        })
        .join("");
    },

    "hero.ctas": function (el, c) {
      el.innerHTML = (c.hero.ctas || [])
        .map(function (cta) {
          var variant = cta.variant === "secondary" ? "btn--secondary" : "btn--primary";
          return '<a class="btn ' + variant + '" href="' + esc(cta.href) + '">' + esc(t(cta.key)) + "</a>";
        })
        .join("");
    },

    /* No scores here on purpose. Ranking four teammates against each other on
       a public page is not candour, it is just unkind — the numbers belong on
       the board and the run, where they are the competition's, not a
       person's. Each pane says what that person did. */
    "team.members": function (el, c) {
      el.innerHTML = (c.team.members || [])
        .map(function (m) {
          return (
            '<article class="member">' +
            '<p class="member__prompt"><span class="member__sigil" aria-hidden="true">$</span> whoami</p>' +
            '<div class="member__head">' +
            '<span class="member__monogram" aria-hidden="true">' + esc(m.monogram) + "</span>" +
            "<div>" +
            '<h3 class="member__name">' + esc(m.name) + "</h3>" +
            '<p class="member__task">' + esc(t(m.taskKey)) + "</p>" +
            "</div>" +
            "</div>" +
            '<p class="member__log">' + esc(t(m.logKey)) + "</p>" +
            /* LinkedIn is per person, not one team link — each of the four
               points at their own profile */
            (m.linkedin
              ? '<a class="member__link" href="' + esc(m.linkedin) + '" target="_blank" rel="noopener">LinkedIn<span aria-hidden="true"> ↗</span></a>'
              : "") +
            "</article>"
          );
        })
        .join("");
    },

    "board.tabs": function (el, c) {
      var tabs = c.board.tabs || [];
      /* respect the currently selected board, so re-rendering on a language
         switch doesn't silently reset the view to the first tab */
      var activeId = boardId || (tabs[0] || {}).id;
      el.innerHTML = tabs
        .map(function (tab) {
          return (
            '<button type="button" role="tab" class="board__tab" data-board="' + esc(tab.id) + '"' +
            ' aria-selected="' + (tab.id === activeId ? "true" : "false") + '"' +
            ' aria-controls="board-table">' + esc(t(tab.key)) + "</button>"
          );
        })
        .join("");
    },

    "about.loop": function (el, c) {
      el.innerHTML = (c.about.loop || [])
        .map(function (step) {
          return '<li class="loop__step">' + esc(t(step.key)) + "</li>";
        })
        .join("");
    },

    "learned.cards": function (el, c) {
      el.innerHTML = (c.learned.cards || [])
        .map(function (card) {
          return (
            '<article class="feature-card">' +
            '<div class="feature-card__icon">' + icon(card.icon) + "</div>" +
            '<h3 class="feature-card__title">' + esc(t(card.titleKey)) + "</h3>" +
            '<p class="feature-card__text">' + esc(t(card.textKey)) + "</p>" +
            "</article>"
          );
        })
        .join("");
    },

    "contact.info": function (el, c) {
      /* no icon: it indented the address so it no longer lined up with the
         section heading, which made the whole block look off-centre */
      el.innerHTML =
        "<div class=\"contact__info-item\">" +
        "<strong>" + esc(t("contact.email")) + "</strong>" +
        '<a href="mailto:' + esc(c.contact.email) + '">' + esc(c.contact.email) + "</a>" +
        "</div>";
    },

    "contact.fields": function (el, c) {
      var fields = c.contact.fields || [];
      var contact = c.contact || {};
      var html = "";

      /* Native POST: the service's own fields travel as form inputs rather
         than as a JSON body. `redirect` is what sends the visitor back. */
      if (contact.accessKey) {
        html += '<input type="hidden" name="access_key" value="' + esc(contact.accessKey) + '" />';
      }
      if (contact.subject) {
        html += '<input type="hidden" name="subject" value="' + esc(contact.subject) + '" />';
      }
      if (contact.thanksUrl) {
        html += '<input type="hidden" name="redirect" value="' + esc(contact.thanksUrl) + '" />';
      }

      if (fields.indexOf("name") !== -1) {
        html += '<label class="field"><span>' + esc(t("contact.name")) + "</span>" +
          '<input name="name" type="text" required autocomplete="name" placeholder="' +
          esc(t("contact.namePlaceholder")) + '" /></label>';
      }
      if (fields.indexOf("phone") !== -1) {
        html += '<label class="field"><span>' + esc(t("contact.phone")) + "</span>" +
          '<input name="phone" type="tel" inputmode="tel" autocomplete="tel" /></label>';
      }
      if (fields.indexOf("email") !== -1) {
        html += '<label class="field"><span>' + esc(t("contact.emailField")) + "</span>" +
          '<input name="email" type="email" autocomplete="email" placeholder="' +
          esc(t("contact.emailPlaceholder")) + '" /></label>';
      }
      if (fields.indexOf("message") !== -1) {
        html += '<label class="field"><span>' + esc(t("contact.message")) + "</span>" +
          '<textarea name="message" rows="5" required placeholder="' +
          esc(t("contact.messagePlaceholder")) + '"></textarea></label>';
      }
      if (fields.indexOf("consent") !== -1) {
        html += '<label class="field field--consent">' +
          '<input name="consent" type="checkbox" required />' +
          "<span>" + esc(t("contact.consent")) + "</span></label>";
      }
      /* Honeypot: the form service rejects any submission where this is
         checked. Hidden by positioning rather than display:none, because some
         bots skip fields that are not rendered. */
      html += '<input type="checkbox" name="botcheck" class="honeypot" tabindex="-1" autocomplete="off" aria-hidden="true" />';
      html += '<button class="btn btn--primary" type="submit">' + esc(t("contact.submit")) + "</button>";
      html += '<p class="form-status" data-slot="form-status" hidden></p>';

      el.innerHTML = html;

      /* point the form at the service — the browser performs a real POST, so
         no fetch and no CORS preflight is involved */
      if (contact.endpoint) {
        el.setAttribute("action", contact.endpoint);
        el.setAttribute("method", "POST");
      }

      /* wire exactly once — the handler reads the current config at submit
         time, so it survives re-rendering on a language switch. */
      if (!el.getAttribute("data-wired")) {
        el.setAttribute("data-wired", "1");
        attachFormHandler(el, c);
      }
    },

    /* Empty hrefs are skipped rather than shipped as dead links — add a URL in
       config and the icon appears on the next load. */
    "footer.socials": function (el, c) {
      el.innerHTML = (c.footer.socials || [])
        .filter(function (social) { return social && social.href; })
        .map(function (social) {
          return '<a href="' + esc(social.href) + '" rel="me noopener" target="_blank" aria-label="' +
            esc(social.name) + '">' + icon(social.icon) + "</a>";
        })
        .join("");
    },

    /* [YEAR] is a token in the translation, not a placeholder — it is replaced
       with the current year here rather than being written into i18n.js, which
       would go stale every January. */
    "footer.legal": function (el) {
      el.textContent = t("footer.legal").replace("[YEAR]", String(new Date().getFullYear()));
    }
  };

  /* --------------------------------------------------------------- render --- */
  function renderAll(root) {
    var nodes = root.querySelectorAll("[data-fill]");
    Array.prototype.forEach.call(nodes, function (el) {
      var key = el.getAttribute("data-fill");
      if (RENDERERS[key]) {
        RENDERERS[key](el, config);
      } else if (TEXT_KEYS.test(key)) {
        el.textContent = t(key);
      } else {
        var v = at(config, key);
        el.textContent = v == null ? "" : v;
      }
    });
  }

  function orderSections() {
    var main = document.getElementById("main");
    if (!main) return;
    var order = (config.sections || []).slice();
    var byName = {};
    Array.prototype.forEach.call(main.querySelectorAll("[data-section]"), function (section) {
      byName[section.getAttribute("data-section")] = section;
    });
    order.forEach(function (name) {
      var section = byName[name];
      if (section) {
        section.hidden = false;
        main.appendChild(section);
      }
    });
    Object.keys(byName).forEach(function (name) {
      if (order.indexOf(name) === -1) byName[name].hidden = true;
    });
  }

  /* ---------------------------------------------------------------- board --- */
  function renderBoard(id) {
    var mount = document.querySelector('[data-slot="board-table"]');
    var board = (config.board.boards || {})[id];
    if (!mount || !board) return;

    var cols = config.board.columns || [];
    var head =
      "<tr>" +
      '<th scope="col" class="board__rank">' + esc(t("board.rank")) + "</th>" +
      '<th scope="col">' + esc(t("board.team")) + "</th>" +
      cols.map(function (col) {
        return '<th scope="col" class="board__score">' + esc(t(col.key)) + "</th>";
      }).join("") +
      '<th scope="col" class="board__score">' + esc(t("board.total")) + "</th>" +
      "</tr>";

    var body = board.rows
      .map(function (row) {
        var cls = "board__row" + (row.highlight ? " board__row--us" : "");
        return (
          '<tr class="' + cls + '">' +
          '<td class="board__rank">' + esc(row.place) + "</td>" +
          '<th scope="row" class="board__team"><span>' + esc(row.name) + "</span>" +
          "<small>" + esc(t(row.orgKey)) + "</small></th>" +
          row.cells
            .map(function (cell) {
              return (
                '<td class="board__score">' +
                '<span class="board__points">' + esc(cell.points) + "</span>" +
                '<small class="board__raw">' + esc(t("board.raw")) + " " + esc(cell.raw) + "</small>" +
                "</td>"
              );
            })
            .join("") +
          '<td class="board__score board__total">' + esc(row.total) + "</td>" +
          "</tr>"
        );
      })
      .join("");

    mount.innerHTML =
      '<p class="board__caption">' + esc(t(board.captionKey)) + "</p>" +
      '<div class="board__scroll"><table class="board__table-el" id="board-table"><thead>' +
      head + "</thead><tbody>" + body + "</tbody></table></div>";
  }

  var boardId = null;

  function mountBoard() {
    var tabsEl = document.querySelector('[data-slot="board-tabs"]');
    if (!tabsEl) return;
    RENDERERS["board.tabs"](tabsEl, config);

    if (boardId === null) boardId = ((config.board.tabs || [])[0] || {}).id || "dk";

    if (!tabsEl.getAttribute("data-wired")) {
      tabsEl.setAttribute("data-wired", "1");
      tabsEl.addEventListener("click", function (event) {
        var btn = event.target.closest("[data-board]");
        if (!btn) return;
        boardId = btn.getAttribute("data-board");
        Array.prototype.forEach.call(tabsEl.querySelectorAll("[data-board]"), function (b) {
          b.setAttribute("aria-selected", String(b === btn));
        });
        renderBoard(boardId);
      });
    }
    renderBoard(boardId);

    var gapEl = document.querySelector('[data-slot="board-gap"]');
    if (gapEl && config.board.gapNote) {
      gapEl.textContent = t(config.board.gapNote.key);
      gapEl.hidden = false;
    }
  }

  /* ------------------------------------------------------------------ run ---
     One graph per task. Tabs render only when there is more than one task, so
     a single graph never sits under a lone pointless tab. Adding a task is a
     config entry — this code needs no change. */
  var runTaskId = null;

  function mountRun() {
    var tasks = (config.run && config.run.tasks) || [];
    if (!tasks.length) return;
    if (runTaskId === null) runTaskId = tasks[0].id;

    var task = tasks.filter(function (x) { return x.id === runTaskId; })[0] || tasks[0];

    var tabsEl = document.querySelector('[data-slot="run-tabs"]');
    if (tabsEl) {
      if (tasks.length > 1) {
        tabsEl.hidden = false;
        tabsEl.innerHTML = tasks
          .map(function (x) {
            return (
              '<button type="button" role="tab" class="board__tab" data-run-task="' + esc(x.id) + '"' +
              ' aria-selected="' + (x.id === runTaskId ? "true" : "false") + '"' +
              ' aria-controls="run-svg">' + esc(t(x.tabKey)) + "</button>"
            );
          })
          .join("");
        if (!tabsEl.getAttribute("data-wired")) {
          tabsEl.setAttribute("data-wired", "1");
          tabsEl.addEventListener("click", function (event) {
            var btn = event.target.closest("[data-run-task]");
            if (!btn) return;
            runTaskId = btn.getAttribute("data-run-task");
            Array.prototype.forEach.call(tabsEl.querySelectorAll("[data-run-task]"), function (b) {
              b.setAttribute("aria-selected", String(b === btn));
            });
            mountRun();
          });
        }
      } else {
        tabsEl.hidden = true;
        tabsEl.innerHTML = "";
      }
    }

    var sub = document.querySelector('[data-slot="run-task-sub"]');
    if (sub) sub.textContent = task.subKey ? t(task.subKey) : "";

    var svg = document.querySelector('[data-slot="run-svg"]');
    if (!svg || !window.SiteMotion) return;

    var titleEl = document.getElementById("run-svg-title");
    var descEl = document.getElementById("run-svg-desc");
    if (titleEl) titleEl.textContent = t("run.svgTitle");
    if (descEl) descEl.textContent = task.subKey ? t(task.subKey) : t("run.svgDesc");

    /* switching tasks must restart the draw, so clear the previous state and
       the observer marker before handing the svg to startCurve again */
    svg.classList.remove("is-complete", "is-animated");
    svg.removeAttribute("data-observed");

    window.SiteMotion.startCurve(svg, task.points, {
      t: t,
      legend: document.querySelector('[data-slot="run-legend"]'),
      onReady: function (el) {
        if (!el.getAttribute("data-observed")) {
          el.setAttribute("data-observed", "1");
          window.SiteMotion.drawOnScroll(el);
        }
      }
    });

    var caption = document.querySelector('[data-slot="run-caption"]');
    if (caption) caption.textContent = t("run.legend");

    var closing = document.querySelector('[data-slot="run-closing"]');
    if (closing) {
      if (task.evaluated) {
        closing.innerHTML =
          '<p class="run__closing-label">' + esc(t(task.evaluated.key)) + "</p>" +
          '<p class="run__closing-value">' + esc(task.evaluated.value) + "</p>" +
          '<p class="run__closing-note">' + esc(t(task.evaluated.noteKey)) + "</p>" +
          (task.median
            ? '<p class="run__closing-median">' + esc(t(task.median.key)) +
              " <span>" + esc(task.median.value) + "</span></p>"
            : "");
      } else {
        closing.innerHTML = "";
      }
    }
  }

  /* ---------------------------------------------------------------- rail --- */
  function mountRail() {
    var items = document.querySelector('[data-slot="rail"] [data-fill="rail.items"]');
    if (items) RENDERERS["rail.items"](items, config);
  }

  function mountRailCountdown() {
    var el = document.querySelector('[data-slot="countdown"]');
    if (!el || !window.SiteMotion) return;
    window.SiteMotion.startCountdown(
      el,
      config.statusRail.countdownTo,
      t(config.statusRail.countdownKey),
      { one: t(config.statusRail.dayOneKey), many: t(config.statusRail.dayManyKey) }
    );
  }

  /* ---------------------------------------------------------------- final ---
     The clock is revealed only after the command above it has typed out, and
     only when the section is actually reached — otherwise the whole sequence
     plays off-screen and the visitor arrives at a countdown that has already
     finished arriving.

     The hidden state is applied inline here rather than in CSS, so with JS
     disabled the clock is simply visible instead of never appearing. */
  var finalDone = false;

  function mountFinal() {
    var cfg = config.final || {};
    var typed = document.querySelector('[data-slot="final-typed"]');
    var caret = document.querySelector('[data-slot="final-caret"]');
    var clock = document.querySelector('[data-slot="final-clock"]');
    var els = {
      d: document.querySelector('[data-slot="final-d"]'),
      h: document.querySelector('[data-slot="final-h"]'),
      m: document.querySelector('[data-slot="final-m"]'),
      s: document.querySelector('[data-slot="final-s"]')
    };
    if (!els.d || !window.SiteMotion) return;

    function show() {
      if (clock) { clock.style.opacity = ""; clock.style.transform = ""; }
      if (caret) caret.hidden = true;
      window.SiteMotion.startClock(cfg.countdownTo, els);
    }

    function run() {
      if (typed) typed.textContent = "";
      if (caret) caret.hidden = false;
      if (clock) { clock.style.opacity = "0"; clock.style.transform = "translateY(8px)"; }
      window.SiteMotion.typeCommand(typed, cfg.command || "", function () {
        if (caret) caret.hidden = true;
        if (clock) {
          window.requestAnimationFrame(function () {
            clock.style.opacity = "";
            clock.style.transform = "";
          });
        }
        window.SiteMotion.startClock(cfg.countdownTo, els);
      });
    }

    if (finalDone) { show(); return; }
    finalDone = true;

    if (window.SiteMotion.reduced) { if (typed) typed.textContent = cfg.command || ""; show(); return; }

    var section = document.getElementById("final");
    if (section && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            io.disconnect();
            run();
          });
        },
        { threshold: 0.2 }
      );
      io.observe(section);
      /* if it never intersects (odd viewport, observer quirk) the clock must
         still start rather than sit at "--" forever */
      window.setTimeout(function () {
        if (els.d && els.d.textContent === "--") { io.disconnect(); run(); }
      }, 9000);
    } else {
      run();
    }
  }

  /* ----------------------------------------------------------------- boot ---
     The terminal owns the viewport until it finishes. On completion the page
     is revealed FIRST and the terminal then slides up and out of the way —
     so the lift actually uncovers something rather than moving over a page
     that is still hidden. */
  var bootDone = false;

  function mountBoot() {
    var root = document.documentElement;
    var overlay = document.querySelector('[data-slot="boot"]');
    var headline = document.querySelector('[data-slot="headline"]');
    var statValues = document.querySelectorAll(".hero__stat-value");
    var log = document.querySelector('[data-slot="boot-log"]');
    var readyEl = document.querySelector('[data-slot="boot-ready"]');
    var cfg = config.boot || {};
    var reduced = !!(window.SiteMotion && window.SiteMotion.reduced);

    function unveil() {
      /* reveal the page, decode the hero (it is on screen already), then let
         the terminal slide away over it */
      root.classList.add("is-ready");
      var hero = document.querySelector('[data-section="hero"]');
      if (hero) hero.classList.add("is-unlocked");
      if (window.SiteMotion) {
        window.SiteMotion.scramble(headline, t("hero.headline"));
        window.SiteMotion.countUp(statValues);
        window.SiteMotion.mascotPlace();
        window.SiteMotion.revealSections(document);
        /* the mascot only starts talking once the page is actually on screen */
        window.SiteMotion.startMascotEvents();
      }
      root.classList.remove("is-booting");

      if (!overlay || reduced) {
        if (overlay) overlay.classList.remove("boot--shown");
        return;
      }
      overlay.classList.add("boot--lifting");
      window.setTimeout(function () {
        overlay.classList.remove("boot--shown", "boot--lifting");
      }, 780);
    }

    if (bootDone) { unveil(); return; }
    bootDone = true;

    /* no terminal available (no JS motion, or reduced motion): the page is
       simply shown, and nothing is ever hidden in the first place */
    if (!log || !window.SiteMotion || reduced) { unveil(); return; }

    if (overlay) overlay.classList.add("boot--shown");

    window.SiteMotion.bootSequence({
      log: log,
      readyEl: readyEl,
      commands: cfg.commands || [],
      steps: (cfg.steps || []).map(function (s) {
        return { label: t(s.labelKey), status: t(s.statusKey) };
      }),
      readyLabel: t(cfg.readyKey),
      done: unveil
    });
  }

  /* ----------------------------------------------------------------- nav --- */
  function wireNav() {
    var header = document.querySelector('[data-slot="header"]');
    var toggle = document.querySelector('[data-slot="nav-toggle"]');
    if (!header || !toggle) return;

    function closeMenu() {
      header.classList.remove("site-header--open");
      toggle.setAttribute("aria-expanded", "false");
    }
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("site-header--open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-close-menu]"), function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  /* ----------------------------------------------------------------- form ---
     The browser performs a real POST to the form service — see the comment on
     contact.endpoint in index.html for why a fetch cannot work here.

     This handler therefore does almost nothing: it only steps in when the form
     is NOT configured, because with no access key the native POST would land
     on the service and show the visitor a raw error page. In that case it stops
     the submission and says plainly that nothing was sent. */
  function attachFormHandler(form, c) {
    form.addEventListener("submit", function (event) {
      var contact = c.contact || {};
      if (contact.accessKey && contact.endpoint) return;   /* let it POST */

      event.preventDefault();
      var status = form.querySelector('[data-slot="form-status"]');
      if (!status) return;
      status.hidden = false;
      status.className = "form-status form-status--error";
      status.textContent = t("contact.notConnected");
    });
  }

  /* ------------------------------------------------------------ language --- */
  function applyStaticText() {
    document.documentElement.setAttribute("lang", lang);
    document.title = config.brand.name || "Elysa's Secret";
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", t("footer.tagline"));
  }

  function setLang(next) {
    if (next !== "en" && next !== "da") return;
    if (next === "da" && !daAvailable()) return;
    lang = next;
    storeLang(next);
    applyStaticText();

    Array.prototype.forEach.call(document.querySelectorAll("[data-lang]"), function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-lang") === next));
    });

    /* every renderer reads t() at call time, so a re-render is the whole swap.
       The board, curve and countdown are mounted explicitly because they build
       markup that is not [data-fill]-driven. */
    renderAll(document);
    mountBoard();
    mountRun();
    mountFinal();
    mountRail();
    mountRailCountdown();
  }

  function wireLang() {
    var daBtn = document.querySelector('[data-lang="da"]');
    if (daBtn && !daAvailable()) daBtn.hidden = true;

    Array.prototype.forEach.call(document.querySelectorAll("[data-lang]"), function (btn) {
      btn.addEventListener("click", function () {
        setLang(btn.getAttribute("data-lang"));
      });
    });
  }

  /* ----------------------------------------------------------------- boot --- */
  function boot() {
    applyStaticText();
    renderAll(document);
    orderSections();
    wireNav();
    wireLang();
    mountRail();
    mountRailCountdown();
    mountBoard();
    mountRun();
    mountFinal();
    /* mascot must be placed and drag-wired before mountBoot's reveal places it */
    if (window.SiteMotion) window.SiteMotion.initMascot();
    mountBoot();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
