# Art of Hair – Lützenkirchen

Professionelle Salon-Website mit **Online-Terminbuchung** und **Reservierungsliste** für das Team.

## Starten

```bash
ADMIN_PIN=deine-geheime-pin PORT=3000 npm start
```

- Website: <http://localhost:3000>
- Reservierungsliste: <http://localhost:3000/admin> (Login mit `ADMIN_PIN`, Standard `1234` – **unbedingt ändern**)

Es werden keine externen Pakete benötigt (nur Node.js ≥ 18). Reservierungen werden in `data/reservations.json` gespeichert.
Auf Replit: Repository importieren, `ADMIN_PIN` unter „Secrets“ setzen, Run-Befehl `npm start`.

## Funktionen

**Website** – Hero, Salon, Leistungen & Preise (Karte mit Kategorien), Team, Galerie, Kontakt mit Karte, Live-Anzeige „geöffnet/geschlossen“, mobil optimiert.

**Terminbuchung** – Leistung → Stylist:in (oder „egal“) → Kalender mit freien Uhrzeiten → Kontaktdaten. Doppelbuchungen werden auf dem Server verhindert; Öffnungszeiten und Behandlungsdauer werden berücksichtigt.

**Reservierungsliste** (`/admin`) – nach Tagen gruppiert, Filter (heute / 7 Tage / Datum / vergangen), Stylist:in, Status, Suche; Status ändern (offen, bestätigt, erledigt, storniert), löschen, CSV-Export (Excel), Drucken, automatische Aktualisierung alle 30 s.

## Anpassen

Alle Salon-Daten stehen in **`public/config.js`**:

- Adresse, Telefon, E-Mail, Instagram (**Platzhalter – bitte echte Daten eintragen**)
- Öffnungszeiten
- Team (Namen, Rollen)
- Leistungen, Dauer und Preise

Bilder: Die Fotos werden aktuell von Unsplash geladen. Für den Livegang eigene Salonfotos in `public/` ablegen und die `src`-Pfade in `public/index.html` bzw. `teamImgs` in `public/app.js` ersetzen.

Vor dem Livegang: Impressum und Datenschutzerklärung ergänzen (Pflicht in Deutschland).

## Ohne Server

Wird nur der Ordner `public/` statisch gehostet, läuft die Seite im Demo-Modus: Reservierungen landen dann nur im Browser des Besuchers. Für echte Buchungen den Node-Server verwenden.
