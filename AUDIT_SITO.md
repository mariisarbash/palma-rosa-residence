Audit — Palma Rosa Residence

  Verdetto sintetico

  Il sito è tecnicamente eccellente e visivamente bello. Il design non è il problema: è curato, coerente e ben costruito. I veri limiti
  sono di prodotto e di conversione — cioè cosa il sito comunica e come trasforma un visitatore in un contatto, non come appare. In una
  frase: bel vestito, ma mancano alcune informazioni che chi cerca casa vuole sapere subito.

  ---
  1) Design

  a) È bello? — Sì, oggettivamente.

  - Sistema visivo solido e maturo. Palette neutra calda (sabbia/inchiostro/terracotta), tipografia di qualità (General Sans + Cormorant
  Garamond in corsivo per "Residence"), raggi morbidi rounded-3xl, spaziatura generosa. È il linguaggio dell'ospitalità contemporanea di
  fascia alta, non il template da portale immobiliare.
  - Hero forte: foto a tutto schermo + wordmark in basso a sinistra + doppio overlay calibrato per la leggibilità. È la scelta giusta:
  lasci parlare la fotografia reale dell'edificio.
  - Coerenza maniacale. Tre classi di bottoni (.btn-glass/.btn-solid/.btn-outline), eyebrow ovunque, animazioni discrete (motion/react,
  fade-in singolo). C'è un DESIGN.md che fa da fonte di verità: raro e prezioso.
  - Dettagli curati: modale mobile con bottom-sheet trascinabile, freeze dello scroll su iOS Safari, focus ring visibili,
  prefers-reduced-motion rispettato, touch target ≥44px, mappa POI con palette desaturata. Questo è lavoro da professionista.

  Giudizio estetico: 9/10. Non toccherei l'impianto visivo.

  b) È funzionale rispetto allo scopo? — Parzialmente. Qui ci sono i veri problemi.

  Lo scopo del sito è: visitatore → capisce cos'è → si fida → contatta via WhatsApp. Il design serve bene i primi due passi, ma inciampa
  su informazioni decisive per la conversione:

  Problema #1 — Manca il prezzo (ovunque).
  È la prima domanda di chiunque cerchi un alloggio. Oggi per saperlo devi scrivere su WhatsApp. Questo è il singolo attrito più grande
  del sito: filtri via le persone serie prima ancora che contattino, e fai sembrare il prezzo "trattabile/nascosto". Anche solo "a partire
  da €X/mese" o una fascia per tipologia aumenterebbe le conversioni in modo netto.

  Problema #2 — I 9 appartamenti sono indistinguibili.
  Ogni card dice la stessa identica cosa: 2 persone · bagno privato · divano letto. L'unico elemento differenziante è la foto, il piano
  (terra/primo) e la posizione del bagno (in camera/corridoio). Chi guarda non capisce perché scegliere A3 invece di B4. Mancano: metri 
  quadri, una frase descrittiva per appartamento, eventuale vista/luminosità/piano. Risultato: nove tessere quasi identiche generano
  paralisi, non scelta.

  Problema #3 — Modello di affitto non dichiarato.
  Affitto mensile o a notte? Soggiorno minimo? Cosa è incluso nel prezzo (utenze, pulizie, deposito)? Per chi (studenti Politecnico/Città
  Studi? professionisti? ricercatori?). Il DESIGN.md vieta giustamente claim non verificati, ma non dire nulla lascia il visitatore senza
  i criteri per decidere.

  Problema #4 — Canale di contatto unico (WhatsApp).
  WhatsApp è ottimo come CTA primaria, ma da desktop o per chi non lo usa è un vicolo cieco. Il telefono c'è solo nel footer; manca un
  form/email di fallback. Un solo canale = lead persi.

  Problema #5 — Zero riprova sociale in produzione.
  La sezione Recensioni è ben fatta ma nascosta in prod finché ci sono solo placeholder (hasRealReviews && PROD). Per un acquisto basato
  sulla fiducia, le recensioni reali valgono più di qualsiasi ritocco grafico. È la cosa a più alto impatto che puoi sbloccare.

  ---
  2) Sezioni, architettura, funzionamento

  Com'è fatto (architettura)

  - SPA React + Vite + Tailwind v4 + React Router, 2 route: / (landing narrativa) e /disponibilita (ricerca).
  - Separazione pulita: data/ (appartamenti, POI, recensioni) · components/ · lib/ (lingua, disponibilità) · pages/.
  - Disponibilità: funzione serverless Vercel api/ical.js fa da proxy ai calendari iCal di Spotahome, con cache, retry e fallback "Da
  verificare". B5 è nascosto e sempre disponibile.
  - Performance curata: WebP responsive con manifest, preload dell'hero, lazy-load della mappa Leaflet (~150KB), stagger CSS al posto di 9
  IntersectionObserver (INP da ~1.1s a ~120ms). Davvero ben fatto.

  Flusso: Hero → Gallery (palazzo) → Servizi → Appartamenti → Recensioni (nascoste) → Mappa → Footer. La modale appartamento apre galleria
  + metadati + servizi + posizione + CTA WhatsApp.

  Cosa manca / cosa migliorerei (per priorità)

  🔴 Alta priorità (impatto su conversione e visibilità)

  1. Prezzi — almeno fasce indicative. Il blocco più importante.
  2. Recensioni reali — sblocca la sezione già pronta. Copia 6-9 recensioni vere da Google/Airbnb/Booking (come già previsto in
  reviews.ts).
  3. Differenziare gli appartamenti — mq + una riga descrittiva ciascuno. Trasforma 9 cloni in 9 scelte.
  4. SEO debole. Oggi hai solo title + description + 2 tag og. Mancano: og:image (i link condivisi su WhatsApp/FB non hanno anteprima!),
  og:url, canonical, hreflang it/en, e soprattutto structured data JSON-LD (LodgingBusiness/Apartment con indirizzo, geo, servizi). Più
  sitemap.xml e robots.txt. Per un affitto locale a Milano, questo guida la scoperta organica.
  5. Secondo canale di contatto — un form semplice (o email visibile) oltre a WhatsApp.

  🟡 Media priorità

  6. Rendering SSG/prerender. L'HTML servito è un <div id="root"> vuoto: per un sito marketing, prerenderizzare le 2 route (es.
  vite-plugin-ssg) migliora SEO, anteprime social e first paint.
  7. Sezione FAQ — soggiorno minimo, cosa è incluso, come si prenota, check-in, deposito. Riduce gli attriti su WhatsApp e costruisce
  fiducia.
  8. Sezione "Chi siamo / contatti" breve — chi gestisce, tempi di risposta. Aumenta la fiducia.
  9. Analytics (Vercel Analytics o Plausible) — senza non sai cosa converte.

  🟢 Bassa priorità (rifiniture)

  10. Navigazione: scrollToSection quando non sei sulla home fa window.location.href = /#id → ricarica l'intera pagina invece di navigare
  lato client (AvailabilityPage.tsx → click su "Gallery" ricarica tutto). Da sistemare con navigate() + scroll.
  11. Ricerca date condivisibile: c'è già un <input hidden> "for shareable searches later" in AvailabilityPage.tsx — codice aspirazionale
  inutilizzato. Codificare le date nell'URL renderebbe le ricerche condivisibili/bookmarkabili.
  12. Chiavi iCal Spotahome hardcoded in api/ical.js e committate su git. Sono feed pubblici in sola lettura (rischio basso), ma
  starebbero meglio in env var.
  13. Web manifest / favicon completa mancanti (PWA-lite, icona su home screen).

  ---
  Riassunto in una riga
  
  Il design è già di livello professionale — non è lì che devi investire. Il ritorno più alto sta nel dare al visitatore le informazioni 
  per decidere e fidarsi (prezzi, recensioni reali, appartamenti differenziati, FAQ) e nel farti trovare (SEO + structured data +
  og:image). Sono interventi di contenuto e prodotto, non di grafica.