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
      countdown: "Reykjavík final in",
      dayOne: "day",
      dayMany: "days"
    },
    nav: {
      team: "The four",
      board: "The board",
      run: "The run",
      final: "Reykjavík",
      learned: "What we learned",
      about: "How we work",
      contact: "Contact"
    },
    final: {
      heading: "The final",
      sub: "Four days of qualifying are behind us. This is what is left.",
      days: "Days",
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
      venue: "Nordic AI Meet · Reykjavík, Iceland · 14–15 October 2026 · against the national champions of Sweden, Norway, Finland and Iceland."
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
        log: "Rebuilt the official simulator to be bit-exact and 8.5× faster, then ran an evolutionary search over thousands of candidate controllers against it, pushing the score from 308 to a graded 1815."
      },
      jakub: {
        task: "Medical Appointment",
        log: "Built a pipeline that transcribes the recording with word-level timestamps matched to the annotators' own coordinates, then answers through a 27B model and picks each evidence span as the medoid of three independently trained producers."
      },
      javier: {
        task: "Drone Flyby",
        log: "Took the perception task: five detection passes per frame, a fixed six-quadrant camera sweep, ground motion refitted online mid-flight, and every one of the 249 frames answered on an unseen flight."
      },
      franek: {
        task: "All three tasks",
        log: "Built the alternative controller that turned the run around in one long session, then moved across the other two tasks — working with Javier on the drone model and with Jakub on the medical one."
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
      survivalSub: "Alexandru's task — 4th in Denmark, 12 points. A colony policy with an evolutionary search over candidate controllers, and a bit-exact local simulator so the search could be trusted.",
      droneSub: "Javier's task — 6th in Denmark, 8 points. Five detection passes per frame, a fixed six-quadrant camera sweep, ground motion refitted online, and all 249 frames answered.",
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
      d1: "Validation mean",
      d1n: "Mean over 7 validation runs. Per-class box geometry, a sixth pass, Level-2 zoom and per-class thresholds were all tried here and rejected — they fit the validation flight, not the task.",
      d2: "Graded evaluation",
      d2n: "An unseen flight. Every frame answered, and half the score gone. This gap is the whole lesson.",
      m1: "Earlier solution",
      m1n: "The previous build, validated at 0.802. Kept on its own branch rather than overwritten.",
      m2: "Graded build, validated",
      m2n: "The same build validated four times and returned 0.8307887829198248 every time, byte-identically. Reproducibility measured, not assumed.",
      evaluated: "Final evaluated score",
      survivalEvalNote: "Three games run back to back and averaged: 1319.9, 1298.2, 1599.0. Lower than the validation — a peak is not a result.",
      medicalEvalNote: "Graded at 0.8222490889515863 with zero errors reported by the grader.",
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
      },
      "6": {
        title: "Perception was not the problem",
        text: "We gave the colony perfect knowledge of every tree, fruit and predator. It still went extinct. Perception was never the limit — the decision logic was, and that is much harder to fix."
      }
    },
    /* the boot sequence: commands are literal (config), these status lines are not */
    boot: {
      l1: "four students",
      s1: "loaded",
      l2: "three tasks",
      s2: "loaded",
      l3: "one final",
      s3: "pending",
      ready: "ready"
    },
    contact: {
      heading: "Get in touch",
      sub: "We are four first-year students representing the University of Southern Denmark at the Nordic final in Reykjavík on 14–15 October, against the national champions of Sweden, Norway, Finland and Iceland. If you would like to support the trip, ask what we built, or just say hello — write to us.",
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
      countdown: "Finalen i Reykjavík om",
      dayOne: "dag",
      dayMany: "dage"
    },
    nav: {
      team: "De fire",
      board: "Ranglisten",
      run: "Forløbet",
      final: "Reykjavík",
      learned: "Hvad vi lærte",
      about: "Sådan arbejder vi",
      contact: "Kontakt"
    },
    final: {
      heading: "Finalen",
      sub: "Fire dages kvalifikation ligger bag os. Det her er, hvad der er tilbage.",
      days: "Dage",
      hours: "Timer",
      minutes: "Minutter",
      seconds: "Sekunder",
      venue: "Nordic AI Meet · Reykjavík, Island · 14.–15. oktober 2026 · mod nationalmestrene fra Sverige, Norge, Finland og Island."
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
        log: "Genopbyggede den officielle simulator, så den er bittede-identisk og 8.5× hurtigere, og kørte derefter en evolutionær søgning gennem tusindvis af kandidatcontrollere imod den — fra 308 til en bedømt 1815."
      },
      jakub: {
        task: "Medical Appointment",
        log: "Byggede en pipeline, der transskriberer optagelsen med ordtidsstempler matchet mod annotatørernes egne koordinater, svarer gennem en 27B-model og vælger hver evidensspan som medoiden af tre uafhængigt trænede producenter."
      },
      javier: {
        task: "Drone Flyby",
        log: "Tog perceptionsopgaven: fem detektionspas pr. frame, en fast sekskvadrant-kamerasweep, grundbevægelse efterjusteret online undervejs, og alle 249 frames besvaret på en flyvning han aldrig havde set."
      },
      franek: {
        task: "Alle tre opgaver",
        log: "Byggede den alternative controller, der vendte forløbet, i én lang session, og gik derefter på tværs af de to andre opgaver — sammen med Javier om drone-modellen og med Jakub om medical-modellen."
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
      survivalSub: "Alexandrus opgave — nr. 4 i Danmark, 12 point. En kolonipolitik med en evolutionær søgning gennem kandidatcontrollere og en bittede-identisk lokal simulator, så søgningen kunne betros.",
      droneSub: "Javiers opgave — nr. 6 i Danmark, 8 point. Fem detektionspas pr. frame, en fast sekskvadrant-kamerasweep, grundbevægelse efterjusteret undervejs, og alle 249 frames besvaret.",
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
      d1: "Valideringsgennemsnit",
      d1n: "Gennemsnit over 7 valideringskørsler. Per-klasse box-geometri, et sjette pas, Level-2 zoom og per-klasse tærskler blev alle prøvet her og afvist — de passede på valideringsflyvningen, ikke på opgaven.",
      d2: "Bedømt evaluering",
      d2n: "En uset flyvning. Hver frame besvaret, og halvdelen af scoren væk. Det gab er hele lektionen.",
      m1: "Tidligere løsning",
      m1n: "Den forrige build, valideret til 0.802. Bevaret på sin egen branch i stedet for overskrevet.",
      m2: "Bedømt build, valideret",
      m2n: "Samme build valideret fire gange og returnerede 0.8307887829198248 hver gang, bittede-identisk. Reproducerbarhed målt, ikke antaget.",
      evaluated: "Endelig bedømt score",
      survivalEvalNote: "Tre spil kørt lige efter hinanden og gennemsnittet: 1319.9, 1298.2, 1599.0. Lavere end valideringen — en top er ikke et resultat.",
      medicalEvalNote: "Bedømt til 0.8222490889515863 uden fejl rapporteret af bedømmeren.",
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
      },
      "6": {
        title: "Perceptionen var ikke problemet",
        text: "Vi gav kolonien perfekt viden om hvert træ, hver frugt og hvert rovdyr. Den uddøde alligevel. Perceptionen var aldrig grænsen — beslutningslogikken var, og den er meget sværere at rette."
      }
    },
    boot: {
      l1: "fire studerende",
      s1: "indlæst",
      l2: "tre opgaver",
      s2: "indlæst",
      l3: "én finale",
      s3: "afventer",
      ready: "klar"
    },
    contact: {
      heading: "Kontakt os",
      sub: "Vi er fire førsteårsstuderende, der repræsenterer Syddansk Universitet ved den nordiske finale i Reykjavík den 14.–15. oktober mod nationalmestrene fra Sverige, Norge, Finland og Island. Vil du støtte rejsen, spørge om hvad vi byggede, eller bare sige hej — så skriv til os.",
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
