# Modifiche mappa

Documento operativo per ripensare la sezione mappa / dintorni del sito Palma Rosa Residence.

## Obiettivo

La mappa non deve essere solo una lista di pin. Deve aiutare l'utente a capire, in pochi secondi, perche la posizione del residence e comoda rispetto a universita, metro, servizi quotidiani e luoghi utili.

Obiettivi principali:

- correggere coordinate e nomi dei luoghi;
- rendere la sezione piu utile su mobile;
- sostituire i filtri attuali con viste piu logiche;
- mostrare luoghi reali con nomi precisi;
- aggiungere link diretti a Google Maps per vedere il percorso da Palma Rosa Residence;
- mantenere un design elegante, coerente con il sito, senza usare foto dei luoghi.

## Decisione visuale

Non usare foto per i luoghi.

La soluzione preferita e usare card piu belle e informative:

- icona categoria;
- nome reale del luogo;
- zona o indirizzo sintetico;
- breve descrizione utile;
- badge di contesto, per esempio `M2`, `Universita`, `Spesa`, `Salute`;
- CTA chiara: `Apri percorso`;
- eventuali pulsanti secondari per modalita: `A piedi`, `Metro`, `Auto`.

Questo evita problemi di licenze, pesantezza visiva e immagini disomogenee. Le card devono sembrare parte del sistema editoriale del sito, non risultati generici copiati da una mappa.

## Problemi attuali

Nel file `src/app/data/poi.ts` alcuni punti sono dichiarati come stime iniziali. Questo crea tre problemi:

- pin non sempre precisi;
- nomi troppo generici, ad esempio `Supermercato`, `Bar - colazione`, `Pronto soccorso`;
- popup poco utili, perche non spiegano perche quel posto conta.

Nel componente `src/app/components/NearbyMap.tsx` i filtri attuali sono tecnici:

- Metro e treni;
- Universita;
- Supermercati;
- Farmacia;
- Bar / colazione;
- Pronto soccorso.

I colori sono buoni e possono restare, ma il sistema di filtro e scomodo: l'utente deve ragionare per categoria invece che per bisogno.

## Nuova logica consigliata

Sostituire i filtri con viste per scenario:

- `Studiare`: universita, campus, scuole utili;
- `Muoversi`: metro, stazioni, collegamenti principali;
- `Vita quotidiana`: supermercati, farmacie, bar, servizi;
- `Salute`: ospedali, pronto soccorso, farmacie;
- `Tutto`: tutti i luoghi rilevanti.

Le viste devono controllare sia i pin sulla mappa sia la lista di card.

## Layout consigliato

### Desktop

Layout a due colonne:

- sinistra: lista/card dei luoghi;
- destra: mappa sticky o comunque visibile mentre si scorrono le card.

Quando l'utente clicca una card:

- il pin corrispondente viene evidenziato;
- la mappa si centra su quel luogo;
- la card resta in stato attivo.

### Mobile

Su mobile la mappa interattiva da sola e scomoda. Struttura consigliata:

1. titolo e descrizione;
2. tab/scenario orizzontali;
3. card dei luoghi;
4. mappa compatta sotto, aggiornata in base alla vista selezionata.

La lista deve essere il centro dell'esperienza mobile. La mappa resta supporto visivo.

## Nuovo modello dati

Espandere il tipo `Poi` in `src/app/data/poi.ts`.

Campi consigliati:

```ts
type Poi = {
  id: string;
  category: PoiCategory;
  scenarios: PoiScenario[];
  name: string;
  area?: string;
  address?: string;
  description: {
    it: string;
    en: string;
  };
  lat: number;
  lng: number;
  googleMapsUrl: string;
  directionsDestination: string;
  recommendedTravelModes?: GoogleTravelMode[];
  priority: number;
  badges?: string[];
};
```

Possibili tipi aggiuntivi:

```ts
type PoiScenario = "study" | "transport" | "daily" | "health" | "all";
type GoogleTravelMode = "walking" | "transit" | "driving";
```

Note:

- `priority` serve per ordinare i luoghi piu importanti prima degli altri;
- `directionsDestination` puo essere un nome preciso, un indirizzo o coordinate;
- `googleMapsUrl` resta il link alla scheda del luogo;
- i link percorso vengono generati separatamente.

## Link Google Maps

Aggiungere una utility per generare link diretti da Palma Rosa Residence al luogo scelto.

Formato consigliato:

```text
https://www.google.com/maps/dir/?api=1&origin=Palma%20Rosa%20Residence%2C%20Via%20Privata%20Mario%20Bianco%2013%2F1%2C%20Milano&destination=<DESTINAZIONE>&travelmode=transit
```

Modalita utili:

- `walking` per luoghi vicini;
- `transit` per universita e stazioni;
- `driving` solo se serve davvero.

CTA consigliate:

- `Apri percorso`;
- `Percorso in metro`;
- `A piedi`;
- `Apri luogo`.

Evitare di pubblicare tempi di percorrenza statici finche non sono verificati. Google Maps li calcola in tempo reale.

## Luoghi da verificare e inserire

### Residence

- Palma Rosa Residence

### Trasporti

- M2 Udine
- M2 Piola
- M2 / FS Lambrate
- Stazione Milano Lambrate

### Universita

Da valutare e verificare prima di pubblicare:

- Politecnico di Milano, Campus Leonardo;
- Politecnico di Milano, Campus Bovisa;
- Universita degli Studi di Milano, Citta Studi;
- Universita degli Studi di Milano, sede centrale;
- Universita degli Studi di Milano-Bicocca;
- Universita Bocconi;
- Universita Cattolica del Sacro Cuore;
- IULM;
- Universita Vita-Salute San Raffaele;
- NABA;
- IED Milano;
- Domus Academy.

Non e necessario mostrare tutte queste universita come pin principali se la mappa diventa troppo affollata. Si puo mostrare una lista piu ampia e tenere sulla mappa solo i luoghi selezionati dalla vista `Studiare`.

### Vita quotidiana

Sostituire i nomi generici con nomi reali:

- supermercati vicini;
- farmacia sotto casa o piu vicina;
- bar utili per colazione;
- eventuali lavanderie o servizi ricorrenti se rilevanti.

### Salute

- pronto soccorso piu rilevante;
- ospedali vicini;
- farmacia.

## Modifiche componenti

### `src/app/data/poi.ts`

Interventi:

- correggere coordinate;
- rinominare i luoghi generici;
- aggiungere scenari;
- aggiungere destinazione Google Maps;
- aggiungere priorita e badge;
- separare meglio categorie e viste.

### `src/app/components/NearbyMap.tsx`

Interventi:

- sostituire i filtri con tab/scenario;
- aggiungere lista di card;
- evidenziare il POI selezionato;
- centrare la mappa sul POI selezionato;
- generare CTA percorso;
- mantenere i colori attuali per categorie/pin;
- migliorare popup, rendendoli secondari rispetto alle card.

### `src/app/lib`

Possibile nuovo file:

- `src/app/lib/maps.ts`

Responsabilita:

- generare URL Google Maps;
- codificare origin/destination;
- gestire `travelmode`.

### `src/app/lib/language.tsx`

Aggiungere traduzioni per:

- nomi viste: `Studiare`, `Muoversi`, `Vita quotidiana`, `Salute`, `Tutto`;
- CTA: `Apri percorso`, `Percorso in metro`, `A piedi`, `Apri luogo`;
- testi sezione aggiornati.

## Copy consigliata

Titolo:

```text
Collegamenti e luoghi utili
```

Oppure:

```text
Milano a portata di mappa
```

Descrizione:

```text
Universita, metro e servizi quotidiani raggiungibili da Palma Rosa Residence. Apri il percorso su Google Maps per vedere tempi e mezzi aggiornati.
```

Per la vista universita:

```text
Campus e universita raggiungibili dal residence, con percorso diretto su Google Maps.
```

## Priorita di implementazione

### Fase 1

- Correggere dati e coordinate.
- Eliminare nomi generici.
- Aggiungere link diretti ai percorsi Google Maps.
- Sostituire i filtri con viste scenario.
- Aggiungere card senza foto.

### Fase 2

- Evidenziare pin/card selezionati.
- Centrare automaticamente la mappa sul luogo scelto.
- Migliorare layout desktop a due colonne.
- Migliorare layout mobile con lista prioritaria.

### Fase 3

- Ampliare dataset universita.
- Aggiungere ulteriori luoghi quotidiani verificati.
- Valutare distanze o tempi solo se verificati manualmente.

## Criteri di accettazione

- Ogni luogo pubblicato ha nome reale e coordinate corrette.
- Nessun luogo importante usa nomi generici come `Supermercato`.
- Ogni card ha almeno una CTA utile verso Google Maps.
- Su mobile la lista e comoda da usare senza interagire per forza con la mappa.
- I colori dei pin restano coerenti con quelli attuali.
- La sezione comunica chiaramente il valore della posizione del residence.
- Non vengono pubblicati tempi di percorrenza non verificati.

