# Sezione Disponibilità — Ordinamento per priorità + filtri

**Data:** 2026-06-10
**Pagina:** `/disponibilita` (`AvailabilityPage.tsx`)

## Problema

La pagina `/disponibilita` mostra una griglia statica di 8 appartamenti visibili (B5 è
nascosto). Dopo una ricerca per date ogni card riceve un badge (Disponibile / Non
disponibile / Da verificare), ma:

1. **Nessuna priorità.** L'ordine della griglia non cambia mai: chi cerca delle date non
   vede salire in cima gli appartamenti disponibili.
2. **Nessun filtro.** Gli appartamenti sono quasi identici (tutti 2 persone, 1 bagno).
   Gli unici criteri che li distinguono già nel codice sono il piano e la posizione del
   bagno, ma l'utente non può filtrarli.

## Obiettivo

Dare priorità ai risultati disponibili e introdurre filtri minimi, senza toccare
l'impianto visivo (già di livello, vedi `DESIGN.md` e `AUDIT_SITO.md`) e senza
sacrificare le performance della pagina.

## Ambito

- Le modifiche vivono **solo su `/disponibilita`**.
- La sezione "Appartamenti" della homepage (`RoomsSection.tsx`) resta **invariata**.
- La logica di ordinamento e filtri è **stato locale** di `AvailabilityPage.tsx`. Il
  contesto disponibilità (`availability-context.tsx`: `statuses`, date, `runSearch`) non
  viene modificato.
- Nessun dato inventato: si riusano solo `getApartmentFloor` e `getBathroomLocation`
  già presenti in `data/apartments.ts`.

## Dati disponibili (esistenti, da non inventare)

- `getApartmentFloor(apt)` → `"ground"` (id `a*`) | `"first"` (id `b*`) | `null`.
- `getBathroomLocation(apt)` → `"ensuite"` (`a1, a2, b1, b2`) | `"corridor"` (gli altri).
- `statuses[apt.id]` → `"available" | "unavailable" | "unknown" | "loading" | null`.

## Comportamento

### 1. Ordinamento (priorità)

Dopo una ricerca per date, la lista visibile viene riordinata in gruppi, **mantenendo
l'ordine originale all'interno di ogni gruppo** (ordinamento stabile):

1. `available` — badge presente, cliccabili
2. `unknown` — iCal incerto, cliccabili (beneficio del dubbio)
3. `unavailable` — attenuati e **non cliccabili**

Regole:

- **Prima della ricerca** (nessuna data inserita, `hasSearched === false`): ordine
  originale A1…B4, nessun riordino.
- Durante il caricamento (`loading`) non si riordina; il riordino avviene quando arrivano
  gli stati finali.
- Il riordino è **istantaneo**, senza animazione di reflow. Le `key` React restano
  l'`apartment.id`, quindi le card non si ri-montano e l'animazione CSS `apr-fade`
  (one-shot al mount) **non** si ri-triggera durante riordino/filtro.

### 2. Card non disponibili → disabilitate

In `RoomCard.tsx`, quando `status === "unavailable"`:

- Il `<button>` diventa `disabled` (no `onOpen`), con `cursor-not-allowed`.
- Trattamento visivo: `opacity-50`, foto in `grayscale`, nessun hover-lift
  (`hover:-translate-y-0.5` disattivato).
- Il badge "Non disponibile" resta visibile.
- `status` `available` e `unknown` (e lo stato neutro pre-ricerca) restano pienamente
  interattivi e invariati.

### 3. Filtri (segmented control)

Due assi indipendenti, resi appena sotto i bottoni di ricerca, dentro il blocco centrato
`max-w-3xl` esistente:

```
Bagno:  [ Tutti ][ In camera ][ Fuori ]      Piano:  [ Tutti ][ Terra ][ Primo ]
```

- Ogni asse è un **segmented control a 3 stati**, default `"Tutti"` (nessun filtro).
  - Bagno: `all` | `ensuite` | `corridor` (mappa su `getBathroomLocation`).
  - Piano: `all` | `ground` | `first` (mappa su `getApartmentFloor`).
- I due assi sono combinati in **AND**.
- Un appartamento escluso da un filtro **viene rimosso** dalla griglia (non attenuato).
- Filtri e ordinamento sono **indipendenti**: i filtri funzionano anche senza date
  selezionate. Quando entrambi sono attivi: prima si filtra, poi si ordina ciò che resta.
- Stile coerente coi bottoni del sito (pill/segmented, `rounded-full`). Requisiti:
  - touch target ≥ 44px;
  - `aria-pressed` sull'opzione attiva di ogni gruppo;
  - ogni gruppo ha un'etichetta accessibile (`Bagno`, `Piano`);
  - navigabile da tastiera con focus ring visibile (riusa gli stili esistenti);
  - su mobile i due gruppi vanno a capo (`flex-wrap`).

### 4. Contatori e stati vuoti

- **Header griglia:** oggi `apartmentsCount` mostra "{count} appartamenti". Quando un
  filtro è attivo mostra invece `apartmentsCountFiltered` → "{shown} di {total}"
  (es. "4 di 8"). Senza filtri attivi resta il testo originale.
- **Riga risultati post-ricerca:** la frase esistente (`availabilityResult` /
  `availabilityNoResult` / `availabilityCheckFailed`) resta, ma il conteggio dei
  disponibili è calcolato **sul sottoinsieme filtrato**.
- **Nessun risultato dai filtri** (lista filtrata vuota): al posto della griglia, un
  messaggio gentile `noFilterResults` ("Nessun appartamento con questi criteri.") più un
  bottone `clearFilters` ("Azzera filtri"). Mai una griglia vuota e muta.

### 5. Card: mostrare il criterio filtrato

Perché il filtro bagno sia comprensibile, la card deve dichiarare quale bagno ha.

- Oggi `RoomCard` mostra: `{persone} · Bagno privato · [Divano letto]`.
- Diventa: `{persone} · Bagno in camera` **oppure** `· Bagno fuori`, seguito da
  `· Divano letto` (solo desktop, come ora).
- Si riusano le chiavi i18n già presenti `privateEnsuiteBathroom` /
  `privateCorridorBathroom`, scegliendo in base a `getBathroomLocation`.
- Il piano è già mostrato come etichetta in alto a destra: invariato.

## Nuove chiavi i18n (`language.tsx`, it + en)

| Chiave | it | en |
|---|---|---|
| `filterBathroom` | Bagno | Bathroom |
| `filterFloor` | Piano | Floor |
| `filterAll` | Tutti | All |
| `bathroomEnsuiteShort` | In camera | En-suite |
| `bathroomCorridorShort` | Fuori | Outside |
| `floorGroundShort` | Terra | Ground |
| `floorFirstShort` | Primo | First |
| `noFilterResults` | Nessun appartamento con questi criteri. | No apartments match these filters. |
| `clearFilters` | Azzera filtri | Clear filters |
| `apartmentsCountFiltered` | {shown} di {total} | {shown} of {total} |

(Le etichette "Terra/Primo" possono riusare `groundFloor`/`firstFloor` se preferito; le
versioni short sono per il segmented control compatto.)

## Componenti / file toccati

- **`AvailabilityPage.tsx`** — stato locale dei filtri (`bathroomFilter`, `floorFilter`);
  derivazione `useMemo` della lista filtrata+ordinata da `visibleApartments` + `statuses`
  + filtri; rendering del segmented control; header con conteggio dinamico; stato vuoto.
- **`RoomCard.tsx`** — stato `disabled` per `unavailable` (più trattamento visivo);
  label bagno in camera/fuori.
- **`language.tsx`** — nuove chiavi it/en.
- **Nuovo componente `SegmentedControl` (o `FilterControls`)** — piccolo componente
  riutilizzabile per i due assi, così `AvailabilityPage` resta leggibile. Props:
  `label`, `options: {value, label}[]`, `value`, `onChange`. Nessuna dipendenza esterna.

## Note di accessibilità e performance

- Contrasto, focus ring, touch target e `prefers-reduced-motion`: già rispettati dal
  progetto; i nuovi controlli ne ereditano gli stili.
- Nessuna nuova libreria. Nessun nuovo IntersectionObserver. L'ordinamento è una pura
  derivazione in render (`useMemo`), il riordino DOM è gestito da React con `key` stabili.
- `RoomCard` è già `memo`-izzato su `(id, status, onOpen)`; l'aggiunta del trattamento
  disabled non cambia la firma del confronto.

## Fuori scope (non in questo intervento)

- Prezzi, recensioni reali, SEO/structured data, secondo canale di contatto, ricerche
  condivisibili via URL (tutti tracciati in `AUDIT_SITO.md`, separati da questo lavoro).
- Filtri sulla homepage.
- Animazioni di reflow della griglia.
