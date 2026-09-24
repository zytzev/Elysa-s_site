/* Every user-visible sentence on elysasecret.com, in both languages.
   Danish must mirror the English key set exactly — check.js enforces it.
   Never put a score, name or date in this file; those live in SITE_CONFIG.
   DA: proofread pending — see README.md before launching the Danish version. */
window.I18N = {
  en: {
    rail: {
      dkLabel: "DK",
      dkPlace: "1st",
      nordicLabel: "NORDIC",
      nordicPlace: "2nd",
      gapLabel: "gap to NO",
      countdown: "Reykjavík final in"
    },
    nav: {
      team: "The four",
      board: "The board",
      run: "The run",
      learned: "What we learned",
      about: "How we work",
      contact: "Contact"
    },
    hero: {
      headline: "First place. Denmark.",
      sub: "Four first-year students, seven days of preparation, and a simulator that turned out not to be deterministic. Nordic AI Cup 2026 — now on to Reykjavík.",
      place: "National result",
      placeSub: "Nordic AI Cup 2026",
      points: "Danish total",
      pointsSub: "Survival Simulator · Drone Flyby · Medical Appointment",
      final: "Nordic combined",
      finalSub: "0.54 points off the lead",
      ctaPrimary: "See how it ran",
      ctaSecondary: "Get in touch"
    },
    team: {
      heading: "The four",
      sub: "Four first-year bachelor students at the University of Southern Denmark. None of us had competed in an ML competition before.",
      alex: {
        task: "Survival Simulator",
        log: "Evolutionary heuristic search across thousands of candidate controllers."
      },
      jakub: {
        task: "Medical Appointment",
        log: "The highest Medical Appointment score in the entire Nordic field.",
        badge: "Best Medical Appointment in the Nordics"
      },
      javier: {
        task: "Drone Flyby",
        log: "Our weakest task. Stated, not hidden — the place was never the point."
      },
      franek: {
        task: "Support / unblocker",
        log: "Built an alternative controller in one long session. It went 778 → 1280 and turned the run around."
      },
      metric: {
        raw: "Raw score",
        points: "Points",
        nordicPoints: "Nordic points",
        first: "First validation",
        then: "After the move"
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
      sub: "Four days, thousands of simulations, and a score that refused to move for three of them.",
      p1: "First heuristic controller",
      p1note: "Survival Simulator, first local score.",
      p2: "Heuristics improved",
      p3: "Plateau",
      p3note: "Three days stuck here. Evolutionary search, thousands of simulations, no progress.",
      p4: "A teammate's controller",
      p4note: "Built from scratch in one long session. First validation, through a Cloudflare tunnel.",
      p5: "Moved to a VPS",
      p5note: "Relocated next to the grader. The network path had been part of the budget all along.",
      p6: "Next validation",
      p7: "Highest validation",
      p7note: "The number everyone remembers. It is not the number that counted.",
      evaluated: "Final evaluated score",
      evaluatedNote: "What actually counted. A validation peak is not a result — and reproducibility, not luck, is what carried it there.",
      median: "Median validation attempt",
      local: "Local",
      validation: "Validation",
      svgTitle: "Score progression across the Nordic AI Cup, from 344 to 1812",
      svgDesc: "A line chart of the team's controller score over four days. It rises from 344 to about 1128, dips to 778 when a teammate's controller is first tested, then climbs to 1812.",
      legend: "Each point is labelled with what it measured — a local simulation or a validation run."
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
      sub: "Five things the four days actually taught us.",
      "1": {
        title: "Optimise the actual bottleneck",
        text: "Our instinct was to improve the model. The first real bottleneck was the network path and a cumulative 600-second budget that counted the round trip. The system around the model mattered more than the model."
      },
      "2": {
        title: "A high validation score is not a good controller",
        text: "On a simulator that is not deterministic, a controller can post an unusually strong run without being robust. The question that matters is whether the result can be reproduced."
      },
      "3": {
        title: "Determinism is the experiment",
        text: "Same seed, same behaviour. Without that, evolutionary search optimises simulation noise — candidates look better or worse for reasons that have nothing to do with them."
      },
      "4": {
        title: "Evaluation parity",
        text: "Local, validation and evaluation must behave alike. Differences in seeds, timing, ordering or network latency distort everything you optimise against."
      },
      "5": {
        title: "The simplest mechanism that works",
        text: "We added a recurrent network to correct the heuristic. Thousands of simulations bought roughly five percent. The plain heuristic stayed competitive."
      }
    },
    doors: {
      sponsor: {
        title: "For sponsors and SDU",
        text: "We are four first-year students representing the University of Southern Denmark at the Nordic final in Reykjavík on 14–15 October, against the national champions of Sweden, Norway, Finland and Iceland. We are looking for support with travel and compute — and we are happy to explain exactly what we built and how we measured it."
      },
      roster: {
        title: "For next season's roster",
        text: "We are not looking for the most experienced people. We are looking for people who stay on a problem past the point where it stops being fun. If that is you, write to us and tell us what you are working on."
      },
      mailSubject: "Subject"
    },
    contact: {
      heading: "Get in touch",
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
      sending: "Sending…",
      sent: "Thank you — your message was sent.",
      simulated: "Thank you — your message was recorded. (No form endpoint is configured yet, so nothing was emailed.)",
      error: "Something went wrong. Please try again, or email us directly."
    },
    footer: {
      tagline: "Nordic AI Cup 2026 — 1st place, Denmark. University of Southern Denmark.",
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
      countdown: "Finalen i Reykjavík om"
    },
    nav: {
      team: "De fire",
      board: "Ranglisten",
      run: "Forløbet",
      learned: "Hvad vi lærte",
      about: "Sådan arbejder vi",
      contact: "Kontakt"
    },
    hero: {
      headline: "Førstepladsen. Danmark.",
      sub: "Fire førsteårsstuderende, syv dages forberedelse og en simulator, der viste sig ikke at være deterministisk. Nordic AI Cup 2026 — nu videre til Reykjavík.",
      place: "Nationalt resultat",
      placeSub: "Nordic AI Cup 2026",
      points: "Dansk total",
      pointsSub: "Survival Simulator · Drone Flyby · Medical Appointment",
      final: "Nordisk samlet",
      finalSub: "0.54 point fra førstepladsen",
      ctaPrimary: "Se forløbet",
      ctaSecondary: "Kontakt os"
    },
    team: {
      heading: "De fire",
      sub: "Fire førsteårsstuderende på Syddansk Universitet. Ingen af os havde deltaget i en ML-konkurrence før.",
      alex: {
        task: "Survival Simulator",
        log: "Evolutionær heuristisk søgning gennem tusindvis af kandidatcontrollere."
      },
      jakub: {
        task: "Medical Appointment",
        log: "Den højeste Medical Appointment-score i hele det nordiske felt.",
        badge: "Bedste Medical Appointment i Norden"
      },
      javier: {
        task: "Drone Flyby",
        log: "Vores svageste opgave. Nævnt, ikke skjult — placeringen var aldrig pointen."
      },
      franek: {
        task: "Støtte / opblokering",
        log: "Byggede en alternativ controller i én lang session. Den gik 778 → 1280 og vendte forløbet."
      },
      metric: {
        raw: "Rå score",
        points: "Point",
        nordicPoints: "Nordiske point",
        first: "Første validering",
        then: "Efter flytningen"
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
      sub: "Fire dage, tusindvis af simuleringer og en score, der nægtede at flytte sig i tre af dem.",
      p1: "Første heuristiske controller",
      p1note: "Survival Simulator, første lokale score.",
      p2: "Heuristikker forbedret",
      p3: "Plateau",
      p3note: "Tre dage fast her. Evolutionær søgning, tusindvis af simuleringer, ingen fremgang.",
      p4: "En holdkammerats controller",
      p4note: "Bygget fra bunden i én lang session. Første validering, gennem en Cloudflare-tunnel.",
      p5: "Flyttet til en VPS",
      p5note: "Flyttet hen ved siden af bedømmeren. Netværksvejen havde været en del af budgettet hele tiden.",
      p6: "Næste validering",
      p7: "Højeste validering",
      p7note: "Tallet alle husker. Det er ikke tallet, der talte.",
      evaluated: "Endelig bedømt score",
      evaluatedNote: "Det, der faktisk talte. En valideringstop er ikke et resultat — og reproducerbarhed, ikke held, bar den dertil.",
      median: "Median af valideringsforsøg",
      local: "Lokal",
      validation: "Validering",
      svgTitle: "Scoreudvikling gennem Nordic AI Cup, fra 344 til 1812",
      svgDesc: "Et linjediagram over holdets controllerscore gennem fire dage. Den stiger fra 344 til omkring 1128, falder til 778, da en holdkammerats controller først testes, og stiger derefter til 1812.",
      legend: "Hvert punkt er mærket med, hvad det målte — en lokal simulering eller en valideringskørsel."
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
      sub: "Fem ting de fire dage faktisk lærte os.",
      "1": {
        title: "Optimér den faktiske flaskehals",
        text: "Vores instinkt var at forbedre modellen. Den første reelle flaskehals var netværksvejen og et kumulativt 600-sekunders budget, der talte rundturen med. Systemet omkring modellen betød mere end modellen."
      },
      "2": {
        title: "En høj valideringsscore er ikke en god controller",
        text: "På en simulator, der ikke er deterministisk, kan en controller levere en usædvanligt stærk kørsel uden at være robust. Spørgsmålet, der betyder noget, er, om resultatet kan genskabes."
      },
      "3": {
        title: "Determinisme er eksperimentet",
        text: "Samme seed, samme adfærd. Uden det optimerer evolutionær søgning simuleringstøj — kandidater ser bedre eller dårligere ud af grunde, der intet har med dem at gøre."
      },
      "4": {
        title: "Paritet mellem miljøer",
        text: "Lokal, validering og bedømmelse skal opføre sig ens. Forskelle i seeds, timing, rækkefølge eller netværkslatens forvrænger alt, hvad man optimerer imod."
      },
      "5": {
        title: "Den enkleste mekanisme, der virker",
        text: "Vi tilføjede et rekurrent netværk for at korrigere heuristikken. Tusindvis af simuleringer gav cirka fem procent. Den rene heuristik forblev konkurrencedygtig."
      }
    },
    doors: {
      sponsor: {
        title: "For sponsorer og SDU",
        text: "Vi er fire førsteårsstuderende, der repræsenterer Syddansk Universitet ved den nordiske finale i Reykjavík den 14.–15. oktober mod nationalmestrene fra Sverige, Norge, Finland og Island. Vi søger støtte til rejse og regnekraft — og vi forklarer gerne præcis, hvad vi byggede, og hvordan vi målte det."
      },
      roster: {
        title: "Til næste sæsons hold",
        text: "Vi leder ikke efter de mest erfarne. Vi leder efter dem, der bliver på et problem, efter det holder op med at være sjovt. Er det dig, så skriv til os og fortæl, hvad du arbejder på."
      },
      mailSubject: "Emne"
    },
    contact: {
      heading: "Kontakt os",
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
      sending: "Sender…",
      sent: "Tak — din besked er sendt.",
      simulated: "Tak — din besked blev registreret. (Der er endnu ikke konfigureret et endpoint, så der er ikke sendt en e-mail.)",
      error: "Noget gik galt. Prøv igen, eller send os en e-mail."
    },
    footer: {
      tagline: "Nordic AI Cup 2026 — 1. plads, Danmark. Syddansk Universitet.",
      legal: "[YEAR] Elysa's Secret. Syddansk Universitet."
    }
  }
};
