/* All the site's data: scores, names, dates, links. Shared by every page.
   Prose lives in i18n.js, markup shared between pages in chrome.js. */
window.SITE_CONFIG = {
  brand: { name: "Elysa's Secret", logo: "" },

  /* The team's own claims. Every value here is checked against the spec's
     allowlist by check.js. `items` is the rail on the home page and the
     HyperBloom page, one entry per hackathon, newest first. `cupItems` is the
     rail on the Nordic AI Cup page. A `tone` of gold, silver or bronze means
     1st, 2nd or 3rd place, and live means still in progress, everywhere on
     the site: the rail, the cards, the stats and the board's ranks. */
  statusRail: {
    items: [
      { key: "rail.edthLabel", placeKey: "rail.edthPlace" },
      { key: "rail.ringLabel", placeKey: "rail.ringPlace", tone: "gold" },
      { key: "rail.cupLabel", placeKey: "rail.cupPlace", tone: "gold" }
    ],
    cupItems: [
      { key: "rail.dkLabel", value: "45.00", placeKey: "rail.dkPlace", tone: "gold" },
      { key: "rail.nordicLabel", value: "35.97", placeKey: "rail.nordicPlace", tone: "silver" },
      { key: "rail.gapLabel", value: "-0.54", tone: "warn" }
    ]
  },

  /* The same nav on every page. "./#team" is the home page's section from
     anywhere, and stays a same-page jump when you are already on it. */
  nav: {
    links: [
      { key: "nav.hackathons", href: "./#hackathons" },
      { key: "nav.team", href: "./#team" },
      { key: "nav.cup", href: "nordic-ai-cup.html" },
      { key: "nav.ring", href: "hyperbloom.html" },
      { key: "nav.edth", href: "edth.html" }
    ],
    cta: { key: "nav.contact", href: "./#contact" }
  },

  hero: {
    stats: [
      { key: "hero.hackathons", value: "3", subKey: "hero.hackathonsSub" },
      { key: "hero.wins", value: "2", subKey: "hero.winsSub", tone: "gold" }
    ],
    ctas: [
      { key: "hero.ctaPrimary", href: "#hackathons", variant: "primary" },
      { key: "hero.ctaSecondary", href: "#contact", variant: "secondary" }
    ]
  },

  /* Every hackathon we have entered, newest first, on the home page. Each card
     has the same shape, so none of them outweighs the others. To add one, add
     a card here and its strings under hackathons.* in i18n.js. A card with
     no `tone` is a hackathon that is over without a podium place. `url` is the
     event's own site; the card's name links to it. `bg` is a faint picture
     behind the card: kind "art" is a line drawing, "photo" a screenshot. */
  hackathons: {
    cards: [
      {
        id: "edth",
        command: "elysa --edth",
        name: "EDTH Copenhagen",
        url: "https://events.eurodefense.tech/copenhagen-2026",
        bg: { src: "images/card-boat.svg", kind: "art" },
        when: "6–8 Nov 2026",
        statusKey: "hackathons.statusDone",
        textKey: "hackathons.edth.text",
        formatKey: "hackathons.edth.format",
        resultKey: "hackathons.edth.result",
        links: [
          { key: "hackathons.linkMore", href: "edth.html" },
          { key: "hackathons.linkEvent", href: "https://events.eurodefense.tech/copenhagen-2026" }
        ]
      },
      {
        id: "hyperbloom",
        command: "elysa --hyperbloom",
        name: "HyperBloom October",
        url: "https://hyperbloom-october.devpost.com",
        bg: { src: "images/card-ring.webp", kind: "photo" },
        when: "1–19 Oct 2026",
        tone: "gold",
        statusKey: "hackathons.statusFirst",
        textKey: "hackathons.hyperbloom.text",
        formatKey: "hackathons.hyperbloom.format",
        resultKey: "hackathons.hyperbloom.result",
        links: [
          { key: "hackathons.linkMore", href: "hyperbloom.html" },
          { key: "hackathons.linkDemo", href: "https://make-a-ring.deployxa.online" }
        ]
      },
      {
        id: "cup",
        command: "elysa --cup",
        name: "Nordic AI Cup",
        url: "https://nordicaicup.com/",
        bg: { src: "images/card-drone.svg", kind: "art" },
        when: "Sep 2026",
        tone: "gold",
        statusKey: "hackathons.statusDenmark",
        textKey: "hackathons.cup.text",
        formatKey: "hackathons.cup.format",
        resultKey: "hackathons.cup.result",
        links: [
          { key: "hackathons.linkMore", href: "nordic-ai-cup.html" }
        ]
      }
    ]
  },

  /* The Nordic AI Cup page. The board, the run, about and learned below are
     that page's too. */
  cup: {
    stats: [
      { key: "cup.place", value: "1st", subKey: "cup.placeSub", tone: "gold" },
      { key: "cup.points", value: "45.00", subKey: "cup.pointsSub", tone: "gold" },
      { key: "cup.final", value: "35.97", subKey: "cup.finalSub", tone: "silver" }
    ],
    ctas: [
      { key: "cup.ctaPrimary", href: "#run", variant: "primary" },
      { key: "cup.ctaSecondary", href: "./#contact", variant: "secondary" }
    ],
    subnav: [
      { key: "nav.board", href: "#board" },
      { key: "nav.run", href: "#run" },
      { key: "nav.about", href: "#about" },
      { key: "nav.learned", href: "#learned" },
      { key: "nav.contributors", href: "#contributors" }
    ],
    /* who worked on it. `id` is a person in team.members, the role and text
       are what they did here. */
    contributors: [
      { id: "alex", roleKey: "team.alex.task", textKey: "team.alex.log" },
      { id: "jakub", roleKey: "team.jakub.task", textKey: "team.jakub.log" },
      { id: "javier", roleKey: "team.javier.task", textKey: "team.javier.log" },
      { id: "franek", roleKey: "team.franek.task", textKey: "team.franek.log" }
    ]
  },

  /* The HyperBloom page. Result checked on Devpost: 1st place, 239 projects,
     738 participants. Built by two of the four, entered under the team name. */
  ring: {
    stats: [
      { key: "ring.place", value: "1st", subKey: "ring.placeSub", tone: "gold" },
      { key: "ring.projects", value: "239", subKey: "ring.projectsSub" },
      { key: "ring.participants", value: "738", subKey: "ring.participantsSub" }
    ],
    ctas: [
      { key: "ring.ctaPrimary", href: "https://make-a-ring.deployxa.online", variant: "primary" },
      { key: "ring.ctaSecondary", href: "https://github.com/FearedLynx/make-a-ring", variant: "secondary" }
    ],
    shots: [
      { src: "images/ring-studio.png", altKey: "ring.shots.studioAlt", captionKey: "ring.shots.studioCaption" },
      { src: "images/ring-try-on.png", altKey: "ring.shots.tryOnAlt", captionKey: "ring.shots.tryOnCaption" },
      { src: "images/ring-review.png", altKey: "ring.shots.reviewAlt", captionKey: "ring.shots.reviewCaption" }
    ],
    cards: [
      { icon: "layers", titleKey: "ring.cards.1.title", textKey: "ring.cards.1.text" },
      { icon: "zap", titleKey: "ring.cards.2.title", textKey: "ring.cards.2.text" },
      { icon: "check", titleKey: "ring.cards.3.title", textKey: "ring.cards.3.text" },
      { icon: "gear", titleKey: "ring.cards.4.title", textKey: "ring.cards.4.text" },
      { icon: "eye", titleKey: "ring.cards.5.title", textKey: "ring.cards.5.text" },
      { icon: "shield", titleKey: "ring.cards.6.title", textKey: "ring.cards.6.text" }
    ],
    /* from the commit history of github.com/FearedLynx/make-a-ring */
    contributors: [
      { id: "franek", roleKey: "ring.contributors.franek.role", textKey: "ring.contributors.franek.text" },
      { id: "javier", roleKey: "ring.contributors.javier.role", textKey: "ring.contributors.javier.text" }
    ],
    links: [
      { key: "ring.links.demo", href: "https://make-a-ring.deployxa.online" },
      { key: "ring.links.repo", href: "https://github.com/FearedLynx/make-a-ring" },
      { key: "ring.links.project", href: "https://devpost.com/software/make-a-ring" },
      { key: "ring.links.event", href: "https://hyperbloom-october.devpost.com" }
    ]
  },

  /* The EDTH Copenhagen page: PHAROS, challenge 07. Figures from the team's
     repository (github.com/elysassecret/EDTH_07): 5 boat agents, 0 reserve
     violations over 30 seeded evaluator runs (eval/), 387 tests collected on
     main at 0a9780e, 91 merged pull requests. Only the top three were
     announced, so no place is claimed. EDTH was Simeone's first event with the team. */
  pharos: {
    stats: [
      { key: "pharos.boats", value: "5", subKey: "pharos.boatsSub" },
      { key: "pharos.reserve", value: "0", subKey: "pharos.reserveSub" },
      { key: "pharos.tests", value: "387", subKey: "pharos.testsSub" }
    ],
    ctas: [
      { key: "pharos.ctaPrimary", href: "#how", variant: "primary" },
      { key: "pharos.ctaSecondary", href: "./#contact", variant: "secondary" }
    ],
    shots: [
      { src: "images/pharos-console.png", altKey: "pharos.shots.consoleAlt", captionKey: "pharos.shots.consoleCaption" },
      { src: "images/pharos-drift.png", altKey: "pharos.shots.driftAlt", captionKey: "pharos.shots.driftCaption" },
      { src: "images/pharos-relay.png", altKey: "pharos.shots.relayAlt", captionKey: "pharos.shots.relayCaption" }
    ],
    cards: [
      { icon: "zap", titleKey: "pharos.cards.1.title", textKey: "pharos.cards.1.text" },
      { icon: "layers", titleKey: "pharos.cards.2.title", textKey: "pharos.cards.2.text" },
      { icon: "shield", titleKey: "pharos.cards.3.title", textKey: "pharos.cards.3.text" },
      { icon: "eye", titleKey: "pharos.cards.4.title", textKey: "pharos.cards.4.text" },
      { icon: "chart", titleKey: "pharos.cards.5.title", textKey: "pharos.cards.5.text" },
      { icon: "gear", titleKey: "pharos.cards.6.title", textKey: "pharos.cards.6.text" }
    ],
    /* by folder ownership and the commit history of the team repository */
    contributors: [
      { id: "javier", roleKey: "pharos.contributors.javier.role", textKey: "pharos.contributors.javier.text" },
      { id: "simeone", roleKey: "pharos.contributors.simeone.role", textKey: "pharos.contributors.simeone.text" },
      { id: "alex", roleKey: "pharos.contributors.alex.role", textKey: "pharos.contributors.alex.text" },
      { id: "franek", roleKey: "pharos.contributors.franek.role", textKey: "pharos.contributors.franek.text" }
    ],
    links: [
      { key: "pharos.links.event", href: "https://events.eurodefense.tech/copenhagen-2026" }
    ]
  },

  /* No scores on the member panes, on either page. `roles` is the short list
     on the home page; the task and log are that person's entry under "Who
     contributed" on the Nordic AI Cup page. A public site is the wrong place to
     rank four teammates against each other — each pane says what that
     person did, and the numbers live on the board and the run.
     `country` picks a flag from FLAGS in script.js; the country's name
     is translated (team.countries.*) and is the flag's accessible label. */
  team: {
    members: [
      { id: "alex", name: "Alexandru Zaitzev", country: "md", taskKey: "team.alex.task", logKey: "team.alex.log",
        roles: [{ event: "EDTH", text: "PHAROS" }, { event: "Nordic AI Cup", key: "team.alex.task" }],
        website: "https://zaitzev.com", linkedin: "https://www.linkedin.com/in/zaitzev/" },
      { id: "jakub", name: "Jakub Furmaniuk", country: "pl", taskKey: "team.jakub.task", logKey: "team.jakub.log",
        roles: [{ event: "Nordic AI Cup", key: "team.jakub.task" }],
        linkedin: "https://www.linkedin.com/in/jakub-furmaniuk/" },
      { id: "javier", name: "Javier Arévalo Hernández", country: "es", taskKey: "team.javier.task", logKey: "team.javier.log",
        roles: [{ event: "EDTH", text: "PHAROS" }, { event: "HyperBloom", text: "Make-a-Ring" }, { event: "Nordic AI Cup", key: "team.javier.task" }],
        website: "https://cv.javierarevalo.dev", linkedin: "https://www.linkedin.com/in/javier-arevalo-hernandez" },
      { id: "franek", name: "Franciszek Kossut", country: "pl", taskKey: "team.franek.task", logKey: "team.franek.log",
        roles: [{ event: "EDTH", text: "PHAROS" }, { event: "HyperBloom", text: "Make-a-Ring" }, { event: "Nordic AI Cup", key: "team.franek.task" }],
        website: "https://kossut.dev", linkedin: "https://www.linkedin.com/in/franciszek-kossut-1967633a8/" },
      { id: "simeone", name: "Simeone Gentile", country: "it",
        roles: [{ event: "EDTH", text: "PHAROS" }],
        linkedin: "https://www.linkedin.com/in/simeone-gentile" }
    ]
  },

  /* Two boards, never conflated. cells are [survival, drone, medical]. */
  board: {
    tabs: [
      { id: "dk", key: "board.tabDk" },
      { id: "nordic", key: "board.tabNordic" }
    ],
    columns: [
      { key: "board.colSurvival" },
      { key: "board.colDrone" },
      { key: "board.colMedical" }
    ],
    boards: {
      dk: {
        captionKey: "board.captionDk",
        rows: [
          { place: "1", name: "Elysa's Secret", orgKey: "board.orgSdu", highlight: true,
            cells: [{ raw: "1405.256", points: "12.00" }, { raw: "0.263", points: "8.00" }, { raw: "0.822", points: "25.00" }], total: "45.00" },
          { place: "2", name: "Ålle", orgKey: "board.orgDtu",
            cells: [{ raw: "968.559", points: "2.00" }, { raw: "0.379", points: "25.00" }, { raw: "0.790", points: "12.00" }], total: "39.00" },
          { place: "3", name: "Powered by Smørrebrød", orgKey: "board.orgDtu",
            cells: [{ raw: "43061.384", points: "18.00" }, { raw: "0.314", points: "15.00" }, { raw: "0.781", points: "6.00" }], total: "39.00" },
          { place: "4", name: "Backprop Boys", orgKey: "board.orgDtu",
            cells: [{ raw: "48236.876", points: "25.00" }, { raw: "0.307", points: "12.00" }, { raw: "0.749", points: "0.92" }], total: "37.92" },
          { place: "5", name: "CarlN", orgKey: "board.orgDtu",
            cells: [{ raw: "1958.138", points: "15.00" }, { raw: "0.156", points: "1.00" }, { raw: "0.803", points: "18.00" }], total: "34.00" },
          { place: "6", name: "Elemental hero", orgKey: "board.orgAalborg",
            cells: [{ raw: "1024.117", points: "6.00" }, { raw: "0.302", points: "10.00" }, { raw: "0.798", points: "15.00" }], total: "31.00" },
          { place: "7", name: "Lisan al-Gaibs", orgKey: "board.orgDtu",
            cells: [{ raw: "821.498", points: "0.88" }, { raw: "0.360", points: "18.00" }, { raw: "0.771", points: "2.00" }], total: "20.88" }
        ]
      },
      nordic: {
        captionKey: "board.captionNordic",
        rows: [
          { place: "1", name: "Ifftikhar Amiri", orgKey: "board.orgNmbu",
            cells: [{ raw: "800.203", points: "0.51" }, { raw: "0.396", points: "18.00" }, { raw: "0.808", points: "18.00" }], total: "36.51" },
          { place: "2", name: "Elysa's Secret", orgKey: "board.orgSdu", highlight: true,
            cells: [{ raw: "1405.256", points: "10.00" }, { raw: "0.263", points: "0.97" }, { raw: "0.822", points: "25.00" }], total: "35.97" },
          { place: "3", name: "cosearch", orgKey: "board.orgNtnu",
            cells: [{ raw: "766.052", points: "0.44" }, { raw: "0.666", points: "25.00" }, { raw: "0.797", points: "6.00" }], total: "31.44" },
          { place: "4", name: "CarlN", orgKey: "board.orgDtu",
            cells: [{ raw: "1958.138", points: "15.00" }, { raw: "0.156", points: "0.83" }, { raw: "0.803", points: "15.00" }], total: "30.83" },
          { place: "5", name: "Backprop Boys", orgKey: "board.orgDtu",
            cells: [{ raw: "48236.876", points: "25.00" }, { raw: "0.307", points: "4.00" }, { raw: "0.749", points: "0.69" }], total: "29.69" },
          { place: "6", name: "Powered by Smørrebrød", orgKey: "board.orgDtu",
            cells: [{ raw: "43061.384", points: "18.00" }, { raw: "0.314", points: "6.00" }, { raw: "0.781", points: "0.92" }], total: "24.92" },
          { place: "7", name: "Ålle", orgKey: "board.orgDtu",
            cells: [{ raw: "968.559", points: "0.79" }, { raw: "0.379", points: "15.00" }, { raw: "0.790", points: "4.00" }], total: "19.79" }
        ]
      }
    },
    gapNote: { leader: "Ifftikhar Amiri", value: "0.54", key: "board.gap" }
  },

  /* The run is per task. Every figure here comes from the team's own
     repository (survival-v2/RESULTS.md, drone-flyby/SERVED_CONFIG.md,
     medical-appointment/REPRODUCE.md, SUBMISSIONS.md) — not from the
     earlier verbal account, which disagreed on one validation number.

     `kind` distinguishes a local simulator mean from an official
     validation run from the graded evaluation. Never merge them: the
     whole point of this section is that they are different numbers. */
  run: {
    /* Who pushed a given point. Only points where the team has agreed the
       attribution carry an `author`; everything else stays unmarked rather
       than guessed. */
    authors: { franek: "Franciszek Kossut" },
    tasks: [
      {
        id: "survival",
        tabKey: "run.tabSurvival",
        subKey: "run.survivalSub",
        points: [
          { value: 308,  kind: "local",      labelKey: "run.s1", noteKey: "run.s1n" },
          { value: 437,  kind: "local",      labelKey: "run.s2", noteKey: "run.s2n" },
          { value: 570,  kind: "local",      labelKey: "run.s3", noteKey: "run.s3n" },
          { value: 709,  kind: "local",      labelKey: "run.s4", noteKey: "run.s4n" },
          { value: 1014, kind: "local",      labelKey: "run.s5", noteKey: "run.s5n" },
          /* the breakthrough: Franciszek's alternative controller, which
             took it from here to the graded result */
          { value: 1239, kind: "local",      labelKey: "run.s6", noteKey: "run.s6n", author: "franek" },
          { value: 1484, kind: "local",      labelKey: "run.s7", noteKey: "run.s7n", author: "franek" },
          { value: 1815, kind: "validation", labelKey: "run.s8", noteKey: "run.s8n", author: "franek" }
        ],
        evaluated: { value: "1405.256", key: "run.evaluated", noteKey: "run.survivalEvalNote" }
      },
      {
        id: "drone",
        tabKey: "run.tabDrone",
        subKey: "run.droneSub",
        /* Eight of the recorded steps, not all of them — the shape of the
           climb is the point, and 0.035 -> 0.5841 says it in eight.
           `kind` matters: everything but the last is a validation mean. */
        points: [
          { value: 0.035,  kind: "validation", labelKey: "run.d1", noteKey: "run.d1n" },
          { value: 0.132,  kind: "validation", labelKey: "run.d2", noteKey: "run.d2n" },
          { value: 0.2365, kind: "validation", labelKey: "run.d3", noteKey: "run.d3n" },
          { value: 0.3048, kind: "validation", labelKey: "run.d4", noteKey: "run.d4n" },
          { value: 0.4618, kind: "validation", labelKey: "run.d5", noteKey: "run.d5n" },
          { value: 0.5055, kind: "validation", labelKey: "run.d6", noteKey: "run.d6n", author: "franek" },
          { value: 0.5841, kind: "validation", labelKey: "run.d7", noteKey: "run.d7n", author: "franek" },
          { value: 0.2630, kind: "evaluated",  labelKey: "run.d8", noteKey: "run.d8n" }
        ],
        evaluated: null
      },
      {
        id: "medical",
        tabKey: "run.tabMedical",
        subKey: "run.medicalSub",
        /* Eight of the recorded steps. Evidence matching was 60% of this
           task's score, so most of these are about choosing the right
           passage rather than about answering better. */
        points: [
          { value: 0.732,   kind: "validation", labelKey: "run.m1", noteKey: "run.m1n" },
          { value: 0.75457, kind: "validation", labelKey: "run.m2", noteKey: "run.m2n" },
          { value: 0.79296, kind: "validation", labelKey: "run.m3", noteKey: "run.m3n" },
          { value: 0.80197, kind: "validation", labelKey: "run.m4", noteKey: "run.m4n" },
          { value: 0.80939, kind: "validation", labelKey: "run.m5", noteKey: "run.m5n" },
          { value: 0.81677, kind: "validation", labelKey: "run.m6", noteKey: "run.m6n" },
          { value: 0.83079, kind: "validation", labelKey: "run.m7", noteKey: "run.m7n" }
        ],
        evaluated: { value: "0.82225", key: "run.evaluated", noteKey: "run.medicalEvalNote" }
      }
    ]
  },

  /* Things we type at Claude. EXACTLY these four — nothing else gets
     added here. Deliberately not translated: they are jokes in English
     and survive only in their own wording. */
  mascot: {
    lines: [
      "Claude LOCK IN",
      "Claude use no tokens",
      "Claude make no mistakes",
      "Claude don't give up!"
    ]
  },

  boot: {
    commands: ["elysa --status", "elysa --whoami", "elysa --run"],
    steps: [
      { labelKey: "boot.l1", statusKey: "boot.s1" },
      { labelKey: "boot.l2", statusKey: "boot.s2" },
      { labelKey: "boot.l3", statusKey: "boot.s3" }
    ],
    readyKey: "boot.ready"
  },

  about: {
    loop: [
      { key: "about.loop.idea" }, { key: "about.loop.implement" },
      { key: "about.loop.run" }, { key: "about.loop.wait" },
      { key: "about.loop.score" }, { key: "about.loop.analyze" },
      { key: "about.loop.change" }
    ]
  },

  learned: {
    cards: [
      { icon: "gear", titleKey: "learned.1.title", textKey: "learned.1.text" },
      { icon: "chart", titleKey: "learned.2.title", textKey: "learned.2.text" },
      { icon: "check", titleKey: "learned.3.title", textKey: "learned.3.text" },
      { icon: "shield", titleKey: "learned.4.title", textKey: "learned.4.text" },
      { icon: "layers", titleKey: "learned.5.title", textKey: "learned.5.text" },
      { icon: "eye", titleKey: "learned.6.title", textKey: "learned.6.text" }
    ]
  },

  contact: {
    email: "elysassecret@gmail.com",
    fields: ["name", "email", "message", "consent"],
    /* Native form POST, not fetch. Web3Forms' free plan rejects the CORS
       preflight that a JSON fetch forces (403, no allow-origin header),
       so an AJAX submit can never work there. A plain form POST is a
       navigation, not a cross-origin request, so CORS does not apply.
       The access key ships in the page by design; it only names the
       destination inbox and cannot read anything. Restrict it to
       elysasecret.com in the Web3Forms dashboard. */
    endpoint: "https://api.web3forms.com/submit",
    accessKey: "9d4a0f49-f679-4ca7-89fb-eab27e777866",
    subject: "elysasecret.com — contact form",
    /* Where the service sends the visitor afterwards. Leave this EMPTY
       and the form uses its own origin — so the redirect is correct on a
       pages.dev test URL, on elysasecret.com, and on any localhost
       preview, with no edit in between. Set an absolute URL only to
       override that.

       This was hardcoded to https://elysasecret.com and hung the browser
       on "Connecting to elysasecret.com" before the domain existed. */
    thanksUrl: ""
  },

  /* LinkedIn is per-person, on the member panes — a single team-level
     LinkedIn would be ambiguous. These two are still placeholders:
     empty hrefs are skipped by the renderer rather than shipped dead. */
  footer: {
    socials: [
      { name: "Instagram", href: "", icon: "instagram" },
      { name: "TikTok", href: "", icon: "tiktok" }
    ]
  }
};
