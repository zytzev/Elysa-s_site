/* Every user-visible sentence on elysasecret.com, in both languages.
   Danish must mirror the English key set exactly — check.js enforces it.
   Scores, names and dates that check.js verifies live in config.js.
   DA: proofread pending — see README.md before launching the Danish version. */
window.I18N = {
  en: {
    rail: {
      dkLabel: "DK",
      dkPlace: "1st",
      nordicLabel: "NORDIC",
      nordicPlace: "2nd",
      gapLabel: "gap to NO",
      edthLabel: "EDTH",
      edthPlace: "live",
      ringLabel: "HYPERBLOOM",
      ringPlace: "1st",
      cupLabel: "NORDIC",
      cupPlace: "1st DK"
    },
    nav: {
      hackathons: "Hackathons",
      team: "The team",
      cup: "Nordic AI Cup",
      ring: "HyperBloom",
      contributors: "Who contributed",
      board: "The board",
      run: "The run",
      learned: "What we learned",
      about: "How we work",
      contact: "Contact"
    },
    page: {
      back: { label: "All hackathons" }
    },
    home: {
      meta: "Elysa's Secret, a hackathon team from the University of Southern Denmark. 1st in Denmark at the Nordic AI Cup 2026 and 1st place at HyperBloom October 2026."
    },
    hero: {
      headline: "Four students. Two wins.",
      sub: "We are Elysa's Secret, a hackathon team from the University of Southern Denmark. We build fast, measure everything and show our work.",
      hackathons: "Hackathons",
      hackathonsSub: "Nordic AI Cup · HyperBloom · EDTH",
      wins: "Wins",
      winsSub: "Nordic AI Cup Denmark · HyperBloom October",
      live: "In progress",
      liveSub: "EDTH Copenhagen",
      ctaPrimary: "See our hackathons",
      ctaSecondary: "Get in touch"
    },
    hackathons: {
      heading: "Our hackathons",
      sub: "Where we have competed and how it went. Finished hackathons have their own page with the full story.",
      whenLabel: "When",
      formatLabel: "Format",
      resultLabel: "Result",
      statusLive: "In progress",
      statusFirst: "1st place",
      statusDenmark: "1st in Denmark",
      linkMore: "Full story",
      linkDemo: "Live demo",
      linkEvent: "Event page",
      edth: {
        text: "We are at the European Defense Tech Hackathon in Copenhagen right now. The story goes up here once the event is over.",
        format: "Defense tech, on site in Copenhagen",
        result: "Not in yet"
      },
      hyperbloom: {
        text: "We built Make-a-Ring, a ring studio where you draw one tile, watch it wrap around a 3D ring and download a print-ready file.",
        format: "UI/UX and web design, online",
        result: "1st of 239 projects, 738 participants"
      },
      cup: {
        text: "Three AI tasks scored together: a survival simulator, object detection from a drone, and questions about recorded medical conversations.",
        format: "AI competition, three tasks",
        result: "1st in Denmark, 2nd in the Nordics"
      }
    },
    cup: {
      contributors: {
        heading: "Who contributed",
        sub: "All four of us worked on this one. None of us had competed in an ML competition before."
      },
      pageTitle: "Nordic AI Cup 2026",
      meta: "Elysa's Secret at the Nordic AI Cup 2026: 1st in Denmark and 2nd in the Nordics, with the leaderboards, the score progressions and what we learned.",
      headline: "First place. Denmark.",
      sub: "Four students, seven days of preparation, and a simulator that turned out not to be deterministic. Nordic AI Cup 2026.",
      place: "National result",
      placeSub: "Nordic AI Cup 2026",
      points: "Danish total",
      pointsSub: "Survival Simulator · Drone Flyby · Medical Appointment",
      final: "Nordic combined",
      finalSub: "0.54 points off the lead",
      ctaPrimary: "See how it ran",
      ctaSecondary: "Get in touch"
    },
    ring: {
      pageTitle: "HyperBloom October 2026",
      meta: "Make-a-Ring won 1st place at HyperBloom October 2026 out of 239 projects: a ring studio in the browser with print-ready STL and OBJ files.",
      headline: "First place. Make-a-Ring.",
      sub: "After the Nordic AI Cup, two of us entered HyperBloom October, a UI/UX and web design hackathon, under the team name. We built a ring studio for people who aren't jewellers.",
      place: "Result",
      placeSub: "HyperBloom October 2026",
      projects: "Submitted projects",
      projectsSub: "On Devpost",
      participants: "Participants",
      participantsSub: "Online, October 2026",
      ctaPrimary: "Try the live demo",
      ctaSecondary: "Source on GitHub",
      what: {
        heading: "What it does",
        sub: "Scroll through patterns like a character creator, or draw one tile of your own and watch it wrap around the band. Try the ring on a hand at its real size, then download a print-ready STL or OBJ file, all in the browser."
      },
      shots: {
        studioAlt: "The Make-a-Ring studio: a 3D ring in the middle with pattern choices around it.",
        studioCaption: "The studio. Up and down change the middle pattern, left and right the sides.",
        tryOnAlt: "A ring shown on a 3D hand in the try-on screen.",
        tryOnCaption: "Try it on a 3D hand, or on a photo of your own hand.",
        reviewAlt: "A drawing sheet of the ring with a READY TO PRINT stamp.",
        reviewCaption: "Check the design and download the print files."
      },
      how: {
        heading: "How we built it",
        sub: "No build step and no backend: Preact and three.js in the browser, hosted as a static site on Deployxa."
      },
      cards: {
        "1": {
          title: "A real ring, not a picture",
          text: "Each pattern is a tile of strokes, drawn into a heightmap of the unrolled band. The band is revolved and displaced by that heightmap, and the same mesh is shown on screen and exported."
        },
        "2": {
          title: "Smooth while you browse",
          text: "The mesh is built in a Web Worker, so rotation never stalls. The studio pre-builds the neighbouring rings, so the 3D ring and the 2D pattern change in the same frame."
        },
        "3": {
          title: "Checked against the material",
          text: "Wall thickness, smallest detail and engraving depth are checked live against real limits for each material, and every warning has a one-click fix."
        },
        "4": {
          title: "A seamless wrap",
          text: "A tile only wraps cleanly when a whole number of tiles fits around the band, so the repeat count and line weight are worked out from the real circumference in millimetres."
        },
        "5": {
          title: "True scale on a hand",
          text: "The try-on uses an open-source 3D hand, with ring positions measured from the mesh. You can also use a photo of your own hand, which never leaves your device."
        },
        "6": {
          title: "Accessibility we measured",
          text: "The whole flow works by keyboard and pattern changes are announced to screen readers. axe-core reports 0 WCAG 2.2 AA violations on every screen, in all four colour themes."
        }
      },
      links: {
        demo: "Live demo",
        repo: "Source on GitHub",
        project: "Project on Devpost",
        event: "The hackathon"
      },
      contributors: {
        heading: "Who contributed",
        sub: "Two of the four built Make-a-Ring, entered under the team name.",
        franek: {
          role: "Studio and pattern tools",
          text: "Started the ring designer, then built the pattern editor and its symmetry tools, the 50 patterns, engraving, saved designs and the blueprint size drawing."
        },
        javier: {
          role: "Rendering, export and try-on",
          text: "Moved ring building into a Web Worker, made the layout work on every device, added the real STL and OBJ downloads, built the 3D hand try-on and got axe down to 0 violations."
        }
      }
    },
    team: {
      heading: "The team",
      sub: "Four students at the University of Southern Denmark, and what each of us has entered so far.",
      countries: {
        md: "Moldova",
        pl: "Poland",
        es: "Spain"
      },
      alex: {
        task: "Survival Simulator",
        log: "Survival Simulator is his task: he read the reward straight out of the simulator source, ran the evolutionary search over candidate controllers, and chased determinism until a seed meant the same run."
      },
      jakub: {
        task: "Medical Appointment",
        log: "Built a pipeline that transcribes the recording with word-level timestamps matched to the annotators' own coordinates, then answers through a 27B model and picks each evidence span as the medoid of three independently trained producers."
      },
      javier: {
        task: "Drone Flyby",
        log: "Took the perception task: five detection passes per frame, a camera sweep alternating quadrant and whole-frame views, ground motion refitted mid-flight, and all 249 frames answered on an unseen flight. The box-convention theory was Franciszek's."
      },
      franek: {
        task: "All three tasks",
        log: "His alternative controller was the breakthrough on Survival Simulator, taking it from 1250 to 1815. He then worked closely with Javier on the drone model and with Jakub on the medical one."
      }
    },
    board: {
      heading: "The board",
      sub: "Three tasks, each scored within its own competition — which is why the same task is worth different points on the two boards.",
      tabDk: "Denmark",
      tabNordic: "Nordic",
      colSurvival: "Survival Simulator",
      colDrone: "Drone Flyby",
      colMedical: "Medical Appointment",
      captionDk: "Danish national round — each country is scored as its own competition.",
      captionNordic: "Nordic combined — every team from every national round, ranked together.",
      gap: "Second in the Nordics, 0.54 points behind Ifftikhar Amiri of Norway.",
      orgSdu: "University of Southern Denmark",
      orgDtu: "Technical University of Denmark",
      orgAalborg: "Aalborg University",
      orgNmbu: "Norwegian University of Life Sciences",
      orgNtnu: "NTNU",
      rank: "Rank",
      team: "Team",
      total: "Total",
      raw: "raw"
    },
    run: {
      heading: "The run",
      sub: "Three tasks, three different problems, and three different scores. What they share is that every number below was measured, and the ones that only fit the validation data were thrown away.",
      tabSurvival: "Survival Simulator",
      tabDrone: "Drone Flyby",
      tabMedical: "Medical Appointment",
      survivalSub: "Alexandru's task — 4th in Denmark, 12 points. A colony policy with an evolutionary search over candidate controllers, a bit-exact local simulator so the search could be trusted, and a stray-payload guard in the served build. Franciszek's alternative controller was the breakthrough here.",
      droneSub: "Javier's task — 6th in Denmark, 8 points. Four attempts at a better single detector all failed. What worked was combining models that fail on different classes, and matching the grader's own box convention.",
      medicalSub: "Jakub's task — 1st in Denmark, 25 points. Word timestamps matched to the annotators' own coordinates, a 27B answer pass over the numbered transcript, and evidence spans chosen as the medoid of three independent producers.",
      s1: "First smoke test",
      s1n: "The first recorded score. Pose tracking was broken — the controller was acting on stale observations.",
      s2: "Rot-check fix",
      s2n: "Fruit of unknown age was being skipped entirely. One fix, +94.",
      s3: "Need-based fruit value",
      s3n: "Threat gating: stop valuing fruit a predator will reach before you do.",
      s4: "Ripe-only eating, ranked breeding",
      s4n: "Only eat ripe fruit; breed from a fitness ranking rather than whatever survived.",
      s5: "Sprint reserve, spaced camps",
      s5n: "Speed-weighted fitness and a sprint reserve. Kill chains came from adjacent campers, so campers stopped standing next to each other.",
      s6: "Occupancy from claims",
      s6n: "Camp occupancy counted from claims instead of positions. Switches per agent-minute fell from 9–14 to 3.6.",
      s7: "Local mean, 40 seeds",
      s7n: "The reliable local number — and the one the search was trusted on.",
      s8: "Graded validation",
      s8n: "Higher than anything measured locally, which is its own warning, not a win.",
      d1: "Synthetic frames",
      d1n: "Objects pasted onto 25 backgrounds. Barely detectable at all.",
      d2: "Real object cut-outs",
      d2n: "Real object images on real aerial backgrounds.",
      d3: "Two models, not one",
      d3n: "Four attempts at a better single detector had failed. Pairing two that fail on different classes was the first real gain.",
      d4: "Separate resolutions",
      d4n: "Each model run at its own inference resolution, rather than one setting for both.",
      d5: "Box growth toward the convention",
      d5n: "Reported boxes were tight; growing them toward the official convention was worth +0.157 in a single change. The theory behind it was later measured dead — the gain was real, the explanation was wrong.",
      d6: "Box growth and track threshold",
      d6n: "One flat box-growth factor of 1.3, and a lower threshold for starting a new track.",
      d7: "Camera sweep, five passes",
      d7n: "Alternating quadrant views with whole-frame views, and five inference passes. Mean over 7 runs; the best single run reached 0.6071.",
      d8: "The unseen flight",
      d8n: "Only about 45% of the validation score carried over. Roughly 60% of our training backgrounds had been cut from that flight — the likely cause, and one we never got to retest.",
      m1: "First working checkpoint",
      m1n: "Transcribe the recording, have a local model answer and quote its evidence, then map those quotes back to timestamps.",
      m2: "Evidence gets its own pass",
      m2n: "Stop trusting the answer model's first quote; select the evidence separately from answering the question.",
      m3: "Moved to a rented GPU",
      m3n: "The 24 GB Mac's memory and latency had become the limit, not the model.",
      m4: "Matched the annotators' timing",
      m4n: "The reference timestamps matched a particular small Whisper setup, not the more accurate recogniser we had preferred. Matching the annotators' own system was the single biggest insight of this task.",
      m5: "Sound-alike medical names",
      m5n: "Drug names that sound alike were being confused with each other. Handling them explicitly was worth +0.0074.",
      m6: "A second look at rejected answers",
      m6n: "Missing a true statement loses both the answer and the evidence credit, so questions we had rejected were re-examined. This became the first locked build.",
      m7: "Three-model evidence vote",
      m7n: "Three independently produced spans — the language model's own quote, a trained extractor, and a span ranker — with the one agreeing most with the other two chosen. Validated four times, byte-identically.",
      evaluated: "Final evaluated score",
      survivalEvalNote: "Three games run back to back and averaged: 1319.9, 1298.2, 1599.0. Lower than the validation — a peak is not a result.",
      medicalEvalNote: "Graded on a different hidden set: 0.0085 below the best validation. That is the uncertainty you expect from a handful of unseen conversations, not a broken deployment.",
      local: "Local mean",
      validation: "Validation",
      evaluatedKind: "Evaluated",
      svgTitle: "Score progression for each of the three tasks",
      svgDesc: "Per-task line charts. Survival Simulator climbs from 308 to a graded validation of 1815. Drone Flyby falls from a validation mean of 0.5841 to a graded 0.2630. Medical Appointment moves from 0.802 to a graded 0.8222.",
      legend: "A selection of the steps recorded in the team's repository. Each point is labelled with what it measured — a local simulator mean, an official validation run, or the graded evaluation."
    },
    about: {
      heading: "How we work",
      text: "We worked out of one room. House music, snacks everywhere, four laptops, experiments running continuously, and someone always saying “let me try”. Several nights we stopped around 5 AM. The loop never changed: idea, implement, run, wait, check the score, analyse, change something, run it again. What mattered was not that everyone worked hard — it was that everyone was still working hard at the same time. When one of us was stuck, another could attack the problem from a completely different direction.",
      loop: {
        idea: "Idea",
        implement: "Implement",
        run: "Run",
        wait: "Wait",
        score: "Check score",
        analyze: "Analyse",
        change: "Change something"
      }
    },
    learned: {
      heading: "What we learned",
      sub: "Six things the four days actually taught us.",
      "1": {
        title: "Optimise the actual bottleneck",
        text: "Our instinct was to improve the model. On Survival the real bottleneck was the network path and a 600-second budget that counted the round trip. On Drone Flyby the same code scored 0.53, 0.45 and 0.19 on three different rented servers. The system around the model mattered more than the model."
      },
      "2": {
        title: "A high validation score is not a good controller",
        text: "One Drone Flyby setting looked 0.08 better offline and scored 0.032 worse on the real grader. Our validation mean was 0.5841; the unseen flight returned 0.2630. The question is not how good a number looks, but whether it transfers."
      },
      "3": {
        title: "Determinism is the experiment",
        text: "Same seed, same behaviour. Without that, evolutionary search optimises simulation noise — candidates look better or worse for reasons that have nothing to do with them."
      },
      "4": {
        title: "Evaluation parity",
        text: "What we measured was not always what we ran — a container was serving stale code while looking perfectly healthy. After that we checked what was actually loaded, and only counted runs that answered all 249 frames. Differences in seeds, timing, ordering or latency distort everything you optimise against."
      },
      "5": {
        title: "Combine models that fail differently",
        text: "Four attempts at a better single detector failed on Drone Flyby; pairing two that fail on different classes was the first real gain. On Medical, the winning third model was not the strongest on its own — its different mistakes were what made the vote work."
      },
      "6": {
        title: "Perception was not the problem",
        text: "We gave the colony perfect knowledge of every tree, fruit and predator. It still went extinct. Perception was never the limit — the decision logic was, and that is much harder to fix."
      }
    },
    /* the boot sequence: commands are literal (config), these status lines are
       not. l3 is true while EDTH runs; change it when the result is in. */
    boot: {
      l1: "four students",
      s1: "loaded",
      l2: "two wins",
      s2: "loaded",
      l3: "one hackathon",
      s3: "pending",
      ready: "ready"
    },
    contact: {
      heading: "Get in touch",
      sub: "We are four students at the University of Southern Denmark. If you would like to ask what we built, work with us, or just say hello — write to us.",
      email: "Email",
      phone: "Phone",
      name: "Your name",
      namePlaceholder: "First and last name",
      emailField: "Email",
      emailPlaceholder: "you@example.com",
      message: "Message",
      messagePlaceholder: "What would you like to ask us?",
      consent: "I agree that Elysa's Secret may use this information to respond.",
      submit: "Send",
      notConnected: "The contact form is not connected yet, so nothing was sent. Please email us directly in the meantime."
    },
    footer: {
      tagline: "A hackathon team from the University of Southern Denmark.",
      legal: "[YEAR] Elysa's Secret. University of Southern Denmark."
    }
  },

  /* Danish mirrors the exact same key set. Numbers keep the decimal point
     rather than the Danish comma, to match the leaderboard tables and the
     status rail exactly — consistency with the displayed data wins. */
  da: {
    rail: {
      dkLabel: "DK",
      dkPlace: "1.",
      nordicLabel: "NORDISK",
      nordicPlace: "2.",
      gapLabel: "afstand til NO",
      edthLabel: "EDTH",
      edthPlace: "live",
      ringLabel: "HYPERBLOOM",
      ringPlace: "1.",
      cupLabel: "NORDIC",
      cupPlace: "1. DK"
    },
    nav: {
      hackathons: "Hackathons",
      team: "Holdet",
      cup: "Nordic AI Cup",
      ring: "HyperBloom",
      contributors: "Hvem bidrog",
      board: "Ranglisten",
      run: "Forløbet",
      learned: "Hvad vi lærte",
      about: "Sådan arbejder vi",
      contact: "Kontakt"
    },
    page: {
      back: { label: "Alle hackathons" }
    },
    home: {
      meta: "Elysa's Secret, et hackathon-hold fra Syddansk Universitet. 1. plads i Danmark ved Nordic AI Cup 2026 og 1. plads ved HyperBloom October 2026."
    },
    hero: {
      headline: "Fire studerende. To sejre.",
      sub: "Vi er Elysa's Secret, et hackathon-hold fra Syddansk Universitet. Vi bygger hurtigt, måler alt og viser vores arbejde.",
      hackathons: "Hackathons",
      hackathonsSub: "Nordic AI Cup · HyperBloom · EDTH",
      wins: "Sejre",
      winsSub: "Nordic AI Cup Danmark · HyperBloom October",
      live: "I gang",
      liveSub: "EDTH Copenhagen",
      ctaPrimary: "Se vores hackathons",
      ctaSecondary: "Kontakt os"
    },
    hackathons: {
      heading: "Vores hackathons",
      sub: "Her har vi deltaget, og sådan gik det. Afsluttede hackathons har deres egen side med hele historien.",
      whenLabel: "Hvornår",
      formatLabel: "Format",
      resultLabel: "Resultat",
      statusLive: "I gang",
      statusFirst: "1. plads",
      statusDenmark: "1. plads i Danmark",
      linkMore: "Hele historien",
      linkDemo: "Live demo",
      linkEvent: "Eventets side",
      edth: {
        text: "Vi er til European Defense Tech Hackathon i København lige nu. Historien kommer her, når eventet er slut.",
        format: "Forsvarsteknologi, fysisk i København",
        result: "Ikke klart endnu"
      },
      hyperbloom: {
        text: "Vi byggede Make-a-Ring, et ringstudie, hvor du tegner én flise, ser den gå rundt om en 3D-ring og downloader en printklar fil.",
        format: "UI/UX og webdesign, online",
        result: "1. ud af 239 projekter, 738 deltagere"
      },
      cup: {
        text: "Tre AI-opgaver bedømt samlet: en overlevelsessimulator, objektgenkendelse fra en drone og spørgsmål om optagede lægesamtaler.",
        format: "AI-konkurrence, tre opgaver",
        result: "1. plads i Danmark, 2. plads i Norden"
      }
    },
    cup: {
      contributors: {
        heading: "Hvem bidrog",
        sub: "Vi arbejdede alle fire på den her. Ingen af os havde deltaget i en ML-konkurrence før."
      },
      pageTitle: "Nordic AI Cup 2026",
      meta: "Elysa's Secret ved Nordic AI Cup 2026: 1. plads i Danmark og 2. plads i Norden, med ranglisterne, scoreforløbene og hvad vi lærte.",
      headline: "Førstepladsen. Danmark.",
      sub: "Fire studerende, syv dages forberedelse og en simulator, der viste sig ikke at være deterministisk. Nordic AI Cup 2026.",
      place: "Nationalt resultat",
      placeSub: "Nordic AI Cup 2026",
      points: "Dansk total",
      pointsSub: "Survival Simulator · Drone Flyby · Medical Appointment",
      final: "Nordisk samlet",
      finalSub: "0.54 point fra førstepladsen",
      ctaPrimary: "Se forløbet",
      ctaSecondary: "Kontakt os"
    },
    ring: {
      pageTitle: "HyperBloom October 2026",
      meta: "Make-a-Ring vandt 1. plads ved HyperBloom October 2026 ud af 239 projekter: et ringstudie i browseren med printklare STL- og OBJ-filer.",
      headline: "Førstepladsen. Make-a-Ring.",
      sub: "Efter Nordic AI Cup deltog to af os i HyperBloom October, et hackathon om UI/UX og webdesign, under holdets navn. Vi byggede et ringstudie for folk, der ikke er guldsmede.",
      place: "Resultat",
      placeSub: "HyperBloom October 2026",
      projects: "Indsendte projekter",
      projectsSub: "På Devpost",
      participants: "Deltagere",
      participantsSub: "Online, oktober 2026",
      ctaPrimary: "Prøv live demoen",
      ctaSecondary: "Kildekode på GitHub",
      what: {
        heading: "Det kan den",
        sub: "Bladr gennem mønstre som i en figurskaber, eller tegn din egen flise og se den gå hele vejen rundt om ringen. Prøv ringen på en hånd i sin rigtige størrelse, og download derefter en printklar STL- eller OBJ-fil, alt sammen i browseren."
      },
      shots: {
        studioAlt: "Make-a-Ring-studiet: en 3D-ring i midten med mønstervalg omkring den.",
        studioCaption: "Studiet. Op og ned skifter det midterste mønster, venstre og højre siderne.",
        tryOnAlt: "En ring vist på en 3D-hånd på prøveskærmen.",
        tryOnCaption: "Prøv den på en 3D-hånd eller på et foto af din egen hånd.",
        reviewAlt: "En tegning af ringen med et READY TO PRINT-stempel.",
        reviewCaption: "Tjek designet, og download printfilerne."
      },
      how: {
        heading: "Sådan byggede vi den",
        sub: "Intet build-trin og ingen backend: Preact og three.js i browseren, hostet som et statisk site på Deployxa."
      },
      cards: {
        "1": {
          title: "En rigtig ring, ikke et billede",
          text: "Hvert mønster er en flise af streger, der tegnes ind i et heightmap af det udrullede bånd. Båndet drejes og forskydes af dette heightmap, og det samme mesh vises på skærmen og eksporteres."
        },
        "2": {
          title: "Flydende, mens du browser",
          text: "Meshet bygges i en Web Worker, så rotationen aldrig går i stå. Studiet bygger nabo-ringene på forhånd, så 3D-ringen og 2D-mønsteret skifter i samme frame."
        },
        "3": {
          title: "Tjekket mod materialet",
          text: "Vægtykkelse, mindste detalje og gravurdybde tjekkes løbende mod rigtige grænser for hvert materiale, og hver advarsel har en rettelse med ét klik."
        },
        "4": {
          title: "En sømløs omkreds",
          text: "En flise går kun pænt rundt, når et helt antal fliser passer om båndet, så antallet af gentagelser og stregtykkelsen beregnes ud fra den rigtige omkreds i millimeter."
        },
        "5": {
          title: "Rigtig størrelse på en hånd",
          text: "Prøverummet bruger en open source 3D-hånd, hvor ringens placering er målt på meshet. Du kan også bruge et foto af din egen hånd, som aldrig forlader din enhed."
        },
        "6": {
          title: "Tilgængelighed, vi har målt",
          text: "Hele forløbet virker med tastatur, og mønsterskift annonceres til skærmlæsere. axe-core rapporterer 0 WCAG 2.2 AA-fejl på alle skærme i alle fire farvetemaer."
        }
      },
      links: {
        demo: "Live demo",
        repo: "Kildekode på GitHub",
        project: "Projektet på Devpost",
        event: "Hackathonet"
      },
      contributors: {
        heading: "Hvem bidrog",
        sub: "To af de fire byggede Make-a-Ring, tilmeldt under holdets navn.",
        franek: {
          role: "Studie og mønsterværktøjer",
          text: "Startede ringdesigneren og byggede derefter mønstereditoren med dens symmetriværktøjer, de 50 mønstre, gravering, gemte designs og måltegningen."
        },
        javier: {
          role: "Rendering, eksport og prøvning",
          text: "Flyttede ringbygningen over i en Web Worker, fik layoutet til at virke på alle enheder, tilføjede rigtige STL- og OBJ-downloads, byggede 3D-prøvningen på en hånd og fik axe ned på 0 fejl."
        }
      }
    },
    team: {
      heading: "Holdet",
      sub: "Fire studerende på Syddansk Universitet, og hvad vi hver især har deltaget i indtil nu.",
      countries: {
        md: "Moldova",
        pl: "Polen",
        es: "Spanien"
      },
      alex: {
        task: "Survival Simulator",
        log: "Survival Simulator er hans opgave: han læste reward-funktionen direkte ud af simulatorkilden, kørte den evolutionære søgning gennem kandidatcontrollere og jagtede determinisme, indtil et seed betød samme kørsel."
      },
      jakub: {
        task: "Medical Appointment",
        log: "Byggede en pipeline, der transskriberer optagelsen med ordtidsstempler matchet mod annotatørernes egne koordinater, svarer gennem en 27B-model og vælger hver evidensspan som medoiden af tre uafhængigt trænede producenter."
      },
      javier: {
        task: "Drone Flyby",
        log: "Tog perceptionsopgaven: fem detektionspas pr. frame, en kamerasweep der skifter mellem kvadrant- og helbilledvisninger, grundbevægelse efterjusteret undervejs, og alle 249 frames besvaret på en uset flyvning. Box-konventionsteorien var Franciszeks."
      },
      franek: {
        task: "Alle tre opgaver",
        log: "Hans alternative controller var gennembruddet på Survival Simulator og tog den fra 1250 til 1815. Derefter arbejdede han tæt sammen med Javier om drone-modellen og med Jakub om medical-modellen."
      }
    },
    board: {
      heading: "Ranglisten",
      sub: "Tre opgaver, hver bedømt inden for sin egen konkurrence — derfor er samme opgave forskelligt værd på de to ranglister.",
      tabDk: "Danmark",
      tabNordic: "Nordisk",
      colSurvival: "Survival Simulator",
      colDrone: "Drone Flyby",
      colMedical: "Medical Appointment",
      captionDk: "Den danske landsdelskonkurrence — hvert land bedømmes som sin egen konkurrence.",
      captionNordic: "Nordisk samlet — alle hold fra alle nationale runder, rangeret sammen.",
      gap: "Nummer to i Norden, 0.54 point efter Ifftikhar Amiri fra Norge.",
      orgSdu: "Syddansk Universitet",
      orgDtu: "Danmarks Tekniske Universitet",
      orgAalborg: "Aalborg Universitet",
      orgNmbu: "Norges miljø- og biovitenskapelige universitet",
      orgNtnu: "NTNU",
      rank: "Plads",
      team: "Hold",
      total: "I alt",
      raw: "rå"
    },
    run: {
      heading: "Forløbet",
      sub: "Tre opgaver, tre forskellige problemer og tre forskellige scorer. Det fælles er, at hvert tal nedenfor blev målt — og at det, der kun passede på valideringsdataene, blev smidt væk.",
      tabSurvival: "Survival Simulator",
      tabDrone: "Drone Flyby",
      tabMedical: "Medical Appointment",
      survivalSub: "Alexandrus opgave — nr. 4 i Danmark, 12 point. En kolonipolitik med en evolutionær søgning gennem kandidatcontrollere, en bittede-identisk lokal simulator, så søgningen kunne betros, og et stray-payload-guard i den udrullede build. Franciszeks alternative controller var gennembruddet her.",
      droneSub: "Javiers opgave — nr. 6 i Danmark, 8 point. Fire forsøg på en bedre enkeltdetektor mislykkedes alle. Det, der virkede, var at kombinere modeller, der fejler på forskellige klasser, og at matche bedømmerens egen box-konvention.",
      medicalSub: "Jakubs opgave — nr. 1 i Danmark, 25 point. Ordtidsstempler matchet mod annotatørernes egne koordinater, et 27B-svarpas over den nummererede transskription og evidensspans valgt som medoiden af tre uafhængige producenter.",
      s1: "Første smoke-test",
      s1n: "Den første målte score. Pose-tracking var i stykker — controlleren handlede på forældede observationer.",
      s2: "Rot-check-rettelse",
      s2n: "Frugt med ukendt alder blev sprunget helt over. Én rettelse, +94.",
      s3: "Behovsbaseret frugtværdi",
      s3n: "Trusselsgating: hold op med at værdsætte frugt, et rovdyr når før dig.",
      s4: "Kun moden frugt, rangeret avl",
      s4n: "Spis kun moden frugt; avl efter en fitnessrangering i stedet for hvad der tilfældigt overlevede.",
      s5: "Sprintreserve, spredte lejre",
      s5n: "Hastighedsvægtet fitness og en sprintreserve. Dræberkæder kom fra naboer i lejren, så lejrmedlemmer holdt op med at stå ved siden af hinanden.",
      s6: "Belægning fra krav",
      s6n: "Lejrbelægning talt fra krav i stedet for positioner. Skift pr. agent-minut faldt fra 9–14 til 3.6.",
      s7: "Lokalt gennemsnit, 40 seeds",
      s7n: "Det pålidelige lokale tal — og det, søgningen blev betroet ud fra.",
      s8: "Bedømt validering",
      s8n: "Højere end noget, der blev målt lokalt, hvilket er en advarsel i sig selv, ikke en sejr.",
      d1: "Syntetiske frames",
      d1n: "Objekter klistret ind på 25 baggrunde. Næsten ikke til at se.",
      d2: "Virkelige objekt-udklip",
      d2n: "Virkelige objektbilleder på virkelige luftbaggrunde.",
      d3: "To modeller, ikke én",
      d3n: "Fire forsøg på en bedre enkeltdetektor var mislykkedes. At parre to, der fejler på forskellige klasser, gav den første rigtige fremgang.",
      d4: "Hver sin opløsning",
      d4n: "Hver model kørt i sin egen inferensopløsning i stedet for én indstilling for begge.",
      d5: "Box-vækst mod konventionen",
      d5n: "De rapporterede boxes var stramme; at vokse dem mod den officielle konvention var værd +0.157 i én enkelt ændring. Franciszeks teori bag blev senere målt død — gevinsten var reel, forklaringen var forkert.",
      d6: "Box-vækst og track-tærskel",
      d6n: "Én flad box-vækstfaktor på 1.3 og en lavere tærskel for at starte et nyt track.",
      d7: "Kamerasweep, fem pas",
      d7n: "Skiftende kvadrantvisninger og helbilledvisninger, og fem inferenspas. Gennemsnit over 7 kørsler; den bedste enkeltkørsel nåede 0.6071.",
      d8: "Den usete flyvning",
      d8n: "Kun omkring 45% af valideringsscoren fulgte med over. Cirka 60% af vores træningsbaggrunde var klippet fra netop den flyvning — den sandsynlige årsag, og en vi aldrig fik testet igen.",
      m1: "Første fungerende checkpoint",
      m1n: "Transskribér optagelsen, lad en lokal model svare og citere sin evidens, og map citaterne tilbage til tidsstempler.",
      m2: "Evidensen får sit eget pas",
      m2n: "Hold op med at stole på svar-modellens første citat; vælg evidensen separat fra at besvare spørgsmålet.",
      m3: "Flyttet til en lejet GPU",
      m3n: "Mac'ens 24 GB hukommelse og latens var blevet grænsen, ikke modellen.",
      m4: "Matchede annotatørernes timing",
      m4n: "Referencetidsstemplerne matchede en bestemt lille Whisper-opsætning, ikke den mere præcise genkender vi selv foretrak. At matche annotatørernes eget system var den største enkeltindsigt i denne opgave.",
      m5: "Medicinske navne der lyder ens",
      m5n: "Lægemiddelnavne, der lyder ens, blev forvekslet med hinanden. At håndtere dem eksplicit var værd +0.0074.",
      m6: "Et andet blik på afviste svar",
      m6n: "At overse et sandt udsagn koster både svaret og evidenspoint, så spørgsmål vi havde afvist, blev gennemgået igen. Det blev den første låste build.",
      m7: "Evidensafstemning med tre modeller",
      m7n: "Tre uafhængigt producerede spans — sprogmodellens eget citat, en trænet ekstraktor og en span-ranker — hvor den, der var mest enig med de to andre, blev valgt. Valideret fire gange, bittede-identisk.",
      evaluated: "Endelig bedømt score",
      survivalEvalNote: "Tre spil kørt lige efter hinanden og gennemsnittet: 1319.9, 1298.2, 1599.0. Lavere end valideringen — en top er ikke et resultat.",
      medicalEvalNote: "Bedømt på et andet skjult sæt: 0.0085 under den bedste validering. Det er den usikkerhed, man må forvente fra en håndfuld usete samtaler — ikke en ødelagt udrulning.",
      local: "Lokalt gennemsnit",
      validation: "Validering",
      evaluatedKind: "Bedømt",
      svgTitle: "Scoreudvikling for hver af de tre opgaver",
      svgDesc: "Linjediagrammer pr. opgave. Survival Simulator stiger fra 308 til en bedømt validering på 1815. Drone Flyby falder fra et valideringsgennemsnit på 0.5841 til bedømt 0.2630. Medical Appointment går fra 0.802 til bedømt 0.8222.",
      legend: "Et udvalg af de trin, der er registreret i holdets repository. Hvert punkt er mærket med, hvad det målte — et lokalt simuleringsgennemsnit, en officiel valideringskørsel eller den bedømte evaluering."
    },
    about: {
      heading: "Sådan arbejder vi",
      text: "Vi arbejdede i ét værelse. Housemusik, snacks overalt, fire laptops, eksperimenter der kørte hele tiden, og altid en der sagde »lad mig prøve«. Flere nætter stoppede vi omkring kl. 5. Løkken ændrede sig aldrig: idé, implementer, kør, vent, tjek scoren, analyser, ændr noget, kør igen. Det vigtige var ikke, at alle arbejdede hårdt — det var, at alle stadig arbejdede hårdt på samme tid. Når en af os sad fast, kunne en anden angribe problemet fra en helt anden vinkel.",
      loop: {
        idea: "Idé",
        implement: "Implementer",
        run: "Kør",
        wait: "Vent",
        score: "Tjek score",
        analyze: "Analyser",
        change: "Ændr noget"
      }
    },
    learned: {
      heading: "Hvad vi lærte",
      sub: "Seks ting de fire dage faktisk lærte os.",
      "1": {
        title: "Optimér den faktiske flaskehals",
        text: "Vores instinkt var at forbedre modellen. På Survival var den reelle flaskehals netværksvejen og et 600-sekunders budget, der talte rundturen med. På Drone Flyby gav samme kode 0.53, 0.45 og 0.19 på tre forskellige lejede servere. Systemet omkring modellen betød mere end modellen."
      },
      "2": {
        title: "En høj valideringsscore er ikke en god controller",
        text: "Én Drone Flyby-indstilling så 0.08 bedre ud offline og scorede 0.032 dårligere hos den rigtige bedømmer. Vores valideringsgennemsnit var 0.5841; den usete flyvning gav 0.2630. Spørgsmålet er ikke, hvor godt et tal ser ud, men om det overfører."
      },
      "3": {
        title: "Determinisme er eksperimentet",
        text: "Samme seed, samme adfærd. Uden det optimerer evolutionær søgning simuleringstøj — kandidater ser bedre eller dårligere ud af grunde, der intet har med dem at gøre."
      },
      "4": {
        title: "Paritet mellem miljøer",
        text: "Det, vi målte, var ikke altid det, vi kørte — en container serverede gammel kode, mens den så helt sund ud. Derefter tjekkede vi, hvad der faktisk var indlæst, og talte kun kørsler med alle 249 frames besvaret. Forskelle i seeds, timing, rækkefølge eller latens forvrænger alt, hvad man optimerer imod."
      },
      "5": {
        title: "Kombinér modeller, der fejler forskelligt",
        text: "Fire forsøg på en bedre enkeltdetektor mislykkedes på Drone Flyby; at parre to, der fejler på forskellige klasser, gav den første rigtige fremgang. På Medical var den vindende tredje model ikke den stærkeste alene — dens anderledes fejl var det, der fik afstemningen til at virke."
      },
      "6": {
        title: "Perceptionen var ikke problemet",
        text: "Vi gav kolonien perfekt viden om hvert træ, hver frugt og hvert rovdyr. Den uddøde alligevel. Perceptionen var aldrig grænsen — beslutningslogikken var, og den er meget sværere at rette."
      }
    },
    boot: {
      l1: "fire studerende",
      s1: "indlæst",
      l2: "to sejre",
      s2: "indlæst",
      l3: "ét hackathon",
      s3: "afventer",
      ready: "klar"
    },
    contact: {
      heading: "Kontakt os",
      sub: "Vi er fire studerende på Syddansk Universitet. Vil du spørge om, hvad vi byggede, arbejde sammen med os, eller bare sige hej — så skriv til os.",
      email: "E-mail",
      phone: "Telefon",
      name: "Dit navn",
      namePlaceholder: "Fornavn og efternavn",
      emailField: "E-mail",
      emailPlaceholder: "dig@eksempel.dk",
      message: "Besked",
      messagePlaceholder: "Hvad vil du gerne spørge os om?",
      consent: "Jeg accepterer, at Elysa's Secret må bruge disse oplysninger til at svare mig.",
      submit: "Send",
      notConnected: "Kontaktformularen er endnu ikke sat op, så der blev ikke sendt noget. Skriv til os på mail i mellemtiden."
    },
    footer: {
      tagline: "Et hackathon-hold fra Syddansk Universitet.",
      legal: "[YEAR] Elysa's Secret. Syddansk Universitet."
    }
  }
};
