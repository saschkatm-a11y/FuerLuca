# Für Zoey 💗

Eine persönliche, interaktive Geschenk-Website für Zoey im Repository `FuerLuca`. Vier aufeinander aufbauende Szenen verbinden eine animierte Begrüßung, viele Komplimente, eine kleine Liebesgeschichte und eine besondere Abschlussbotschaft. Das Projekt ist responsiv, tastaturbedienbar und direkt für GitHub Pages vorbereitet.

> **Screenshot-Platzhalter:** Hier kann später ein Screenshot der fertigen Startansicht ergänzt werden. Vor dem Veröffentlichen prüfen, ob darauf keine privaten Informationen zu sehen sind.

## Funktionen

- animierte Herz-Ladeanzeige und Geschenkenthüllung
- mindestens 25 Komplimente ohne direkte Wiederholung
- Meilensteine und ein robuster, optional gespeicherter Fortschritt
- interaktive Geschichte in fünf Kapiteln
- zwei Sekunden lang zu haltender Herz-Button für Maus, Touch und Tastatur
- versteckte Herzen, Sterne, Nachrichten und begrenzte Partikeleffekte
- optionale, niemals automatisch startende Musik
- responsive Darstellung von kleinen Smartphones bis zu großen Desktop-Bildschirmen
- Unterstützung für `prefers-reduced-motion`
- automatisches Deployment mit GitHub Actions

## Technologien

- React 19
- TypeScript
- Vite
- Framer Motion
- Lucide React
- modernes, global strukturiertes CSS
- ESLint mit TypeScript- und React-Regeln
- GitHub Actions und GitHub Pages

## Voraussetzungen

- Node.js `20.19` oder neuer; empfohlen ist die aktuelle Node.js-LTS-Version
- npm
- Git, falls das Projekt geklont oder veröffentlicht werden soll

## Lokal installieren

Ersetze `DEIN-BENUTZERNAME` durch den GitHub-Benutzernamen, unter dem das Repository liegt:

```bash
git clone https://github.com/DEIN-BENUTZERNAME/FuerLuca.git
cd FuerLuca
npm install
npm run dev
```

Vite zeigt anschließend die lokale Adresse an, normalerweise `http://localhost:5173/`.

## Verfügbare Befehle

```bash
npm run dev
```

Startet den Entwicklungsserver mit Hot Reload.

```bash
npm run build
```

Prüft das Projekt mit TypeScript und erzeugt den optimierten Produktions-Build unter `dist/`.

```bash
npm run preview
```

Zeigt den zuvor erzeugten Produktions-Build lokal an.

```bash
npm run typecheck
npm run lint
```

Führt die TypeScript-Prüfung beziehungsweise den Linter aus.

## GitHub-Pages-Deployment

Der Workflow unter `.github/workflows/deploy.yml` startet bei jedem Push auf `main`. Er installiert die exakt in `package-lock.json` festgehaltenen Pakete mit `npm ci`, baut die Website, lädt `dist/` als Pages-Artefakt hoch und veröffentlicht es.

Einmalige Einrichtung auf GitHub:

1. Erstelle das Repository mit dem Namen **`FuerLuca`**.
2. Pushe das Projekt auf den Branch `main`.
3. Öffne im Repository **Settings → Pages**.
4. Wähle unter **Build and deployment** als Quelle **GitHub Actions**.
5. Führe bei Bedarf einen neuen Push auf `main` aus.
6. Prüfe den Lauf im Tab **Actions**.
7. Nach erfolgreichem Deployment ist die Projektseite üblicherweise unter `https://DEIN-BENUTZERNAME.github.io/FuerLuca/` erreichbar.

Der Workflow kann außerdem im Actions-Tab manuell gestartet werden.

## Repository-Name und Basispfad anpassen

Der erwartete Repository-Slug ist **`FuerLuca`**. Für GitHub Actions wird der Basispfad beim Build automatisch aus dem tatsächlichen Repository-Namen erzeugt:

```yaml
VITE_BASE_PATH: "/${{ github.event.repository.name }}/"
```

Die lokale und manuelle Fallback-Konfiguration steht in `vite.config.ts`:

```ts
const DEFAULT_PAGES_BASE = '/FuerLuca/';
```

Wenn du das Repository umbenennst, ändere diesen Fallback ebenfalls. Alternativ kann für einen manuellen Build ein eigener Basispfad gesetzt werden:

```bash
VITE_BASE_PATH=/anderer-repository-name/ npm run build
```

Unter PowerShell lautet derselbe Vorgang:

```powershell
$env:VITE_BASE_PATH = "/anderer-repository-name/"
npm run build
```

Bei einer eigenen Domain ohne Unterordner muss der Build-Basispfad `/` sein. Setze dafür im Workflow `VITE_BASE_PATH: "/"`.

## Persönliche Texte anpassen

### Komplimente

Die Komplimente liegen in `src/data/compliments.ts`. Dort können Texte ergänzt, entfernt oder umformuliert werden. Behalte eindeutige Einträge bei, damit die Wiederholungslogik sinnvoll bleibt.

### Geschichte

Die fünf Kapitel liegen in `src/data/story.ts`. Titel, Text und Symbolzuordnung lassen sich dort ändern. Die Navigation richtet sich automatisch nach der Anzahl der vorhandenen Kapitel.

### Weitere Nachrichten

Einzelne Begrüßungs-, Meilenstein- und Abschlussnachrichten befinden sich in den zugehörigen Komponenten unter `src/components/` beziehungsweise in `src/App.tsx`.

## Eigene Musik hinzufügen

Das Repository enthält absichtlich keine Musikdatei. Lege optional eine eigene oder rechtmäßig lizenzierte Datei hier ab:

```text
public/assets/love-song.mp3
```

Weitere Hinweise stehen in `public/assets/README.md`. Ohne diese Datei läuft die gesamte Website weiter; die Musiksteuerung wird ausgeblendet oder deaktiviert. Musik startet niemals automatisch.

## Projektstruktur

```text
FuerLuca/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   ├── assets/
│   │   └── README.md
│   └── favicon.svg
├── src/
│   ├── components/       # Szenen, Buttons, Partikel und kleine UI-Bausteine
│   ├── data/             # Komplimente und Story-Kapitel
│   ├── hooks/            # wiederverwendbare Zustands- und Browserlogik
│   ├── styles/           # globale Gestaltung und responsive Regeln
│   ├── App.tsx           # Ablauf und gemeinsamer Zustand der Liebesreise
│   ├── main.tsx          # React-Einstiegspunkt
│   └── vite-env.d.ts
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

`dist/` und `node_modules/` werden lokal erzeugt und nicht eingecheckt.

## Barrierefreiheit

Die Website verwendet semantische Bereiche, echte Buttons, sichtbare Fokuszustände, verständliche Beschriftungen und ausreichend große Touch-Flächen. Alle wesentlichen Aktionen sind per Tastatur erreichbar. Dekorative Effekte werden für Screenreader verborgen, und bei aktivierter Einstellung **Bewegung reduzieren** werden intensive oder dauerhaft laufende Animationen abgeschaltet.

Nach inhaltlichen oder gestalterischen Änderungen sollten Tastaturnavigation, Kontrast, Screenreader-Beschriftungen sowie die Darstellung bei 320, 375, 768, 1024 und 1440 Pixel Breite erneut geprüft werden.

## Neues Repository initialisieren

Falls dieses Verzeichnis noch kein Git-Repository ist:

```bash
git init
git add .
git commit -m "Create Zoey love website"
git branch -M main
git remote add origin https://github.com/DEIN-BENUTZERNAME/FuerLuca.git
git push -u origin main
```

## Datenschutz und öffentliche Inhalte

GitHub Pages ist öffentlich. Auch wenn die URL nur gezielt geteilt wird, ist die Seite kein geschützter privater Speicherort. Veröffentliche deshalb keine Adressen, Telefonnummern, Zugangsdaten, intimen Fotos oder andere sensible Daten. Die Meta-Angabe `noindex, nofollow` bittet Suchmaschinen, die Seite nicht aufzunehmen, ist aber kein Zugriffsschutz.

## Lizenz und Rechte

Dieses Projekt enthält keine separate Open-Source-Lizenz. Ohne ausdrückliche Lizenz bleiben die Rechte bei der erstellenden Person. Verwende nur Texte, Bilder und Musik, die dir gehören oder für deren Veröffentlichung du eine gültige Erlaubnis besitzt. Lade insbesondere keine urheberrechtlich geschützte Musik und keine privaten Daten in das öffentliche Repository hoch.
