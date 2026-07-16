# Optionale Musik

In diesem Ordner kann eine eigene Audiodatei für die Website abgelegt werden.

## Dateiname

Die Datei muss exakt so heißen:

```text
love-song.mp3
```

Der vollständige Projektpfad lautet damit:

```text
public/assets/love-song.mp3
```

Die Website sucht die Musik über den von Vite bereitgestellten Basispfad. Dadurch funktioniert sie lokal und unter der Custom Domain `zoey.saschaskaskaden.de`. Fehlt die Datei, bleibt die Website vollständig nutzbar und die Musiksteuerung wird nicht störend angeboten.

## Wichtige Hinweise

- Musik startet nie automatisch. Zoey muss sie bewusst einschalten.
- Verwende eine MP3-Datei, für die du die nötigen Rechte besitzt, zum Beispiel eine eigene Aufnahme.
- Lade keine urheberrechtlich geschützte Musik ohne Erlaubnis in das öffentliche Repository hoch.
- Halte die Datei möglichst klein, damit die Seite auf mobilen Verbindungen schnell lädt.
- GitHub Pages ist öffentlich: Wer die URL kennt, kann auch die Audiodatei abrufen.

Nach dem Hinzufügen genügt ein neuer Commit und Push auf `main`; der Pages-Workflow veröffentlicht die Datei zusammen mit der Website.
