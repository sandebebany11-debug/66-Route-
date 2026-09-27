# Steakhaus-Restaurant ANGUS · Leverkusen

Premium-Website für das Steakhaus ANGUS – Konzept **„FIRE. MEAT. PASSION.“**
Statisches HTML/CSS/JS ohne Framework, ohne Build-Schritt und ohne externe Skripte.

## Starten

```bash
python3 -m http.server 8000   # dann http://localhost:8000 öffnen
```

Zum Veröffentlichen einfach den gesamten Ordner auf einen beliebigen Webspace (oder z. B. Netlify) hochladen.

## Aufbau (Scroll-Story)

Hook (Hero) → Trust → Story → Steak-Showcase → Feuer → Speisekarte → Food-Moment → Galerie → Bewertungen → Reservierung → Kontakt → Footer

| Datei | Inhalt |
| --- | --- |
| `index.html` | Seite inkl. SEO-Meta, Open Graph und Schema.org (`Restaurant` / `LocalBusiness`) |
| `assets/css/style.css` | Design-System (Farben, Typo), alle Sektionen, Responsive, `prefers-reduced-motion` |
| `assets/js/main.js` | Intro, Scroll-Szenen, Parallax, 3D-Maus-Tiefe, Zähler, Menü-Tabs, Rauch/Glut (Canvas), Cursor |
| `assets/fonts/` | Selbst gehostete Schriften (Archivo, Manrope, Cormorant) – keine Google-Fonts-Verbindung |
| `assets/img/` | Logo und echte Restaurantfotos (WebP) |
| `impressum.html`, `datenschutz.html` | **Platzhalter – müssen vom Betreiber ausgefüllt werden** |

## Vor dem Livegang – bitte erledigen

1. **Fotos:** Alle Bilder sind echte ANGUS-Fotos (farblich angeglichen, als WebP in 640/1024/Originalbreite).
   Für die großen Vollbild-Bereiche wären Originaldateien mit ≥ 2000 px Breite noch schärfer.
   Auf dem Gastraum-Foto mit Gästen wurde die rechte Tischgruppe weggeschnitten; bitte trotzdem prüfen,
   ob abgebildete Personen einverstanden sind. Beim Steak-Close-up (Hero) bitte sicherstellen, dass ihr die Bildrechte habt.
2. **Weitere Wunschfotos:** Rinderfilet, Churrasco, Lammfilet, Grill/Feuer, Desserts – dann kann der Steak-Showcase erweitert werden.
3. **Impressum und Datenschutz** vollständig ausfüllen.
4. **Speisekarte:** Es sind bewusst keine Preise, Zutaten oder Beschreibungen hinterlegt. Die Schaltfläche
   „Vollständige Speisekarte“ führt zur Quandoo-Seite des Restaurants.
5. **Bewertungen:** 4,8 / 2.318 Bewertungen und die drei Kundenstimmen stammen aus der Vorgabe. Zahlen
   regelmäßig aktualisieren (auch im JSON-LD `aggregateRating` in `index.html`).
6. **Domain:** `canonical`, `og:url`, `og:image` und JSON-LD verweisen auf `https://www.steakhausangus.de/` – ggf. anpassen.

Öffnungszeiten, Auszeichnungen und Herkunftsangaben wurden absichtlich nicht aufgenommen, weil sie
nicht bestätigt vorlagen.

## Reservierung

Die Seite hat ein eigenes Reservierungsformular (Bereich „Dein Tisch. Dein Abend. Dein Steak.“), aufgebaut wie bei Casa Ducale.
Alle „Tisch reservieren“-Buttons springen dorthin. Einstellungen stehen oben im Block `RESERVATION_CONFIG` in `assets/js/main.js`:

- `web3formsKey`: kostenloser Schlüssel von https://web3forms.com – Reservierungen kommen dann per E-Mail an.
  **Solange er leer ist, läuft das Formular im Demo-Modus und verschickt nichts.**
- `whatsappNumber`: z. B. `4917612345678` – dann erscheint zusätzlich „Per WhatsApp anfragen“.

Quandoo bleibt als Alternative verlinkt:

Alle „Tisch reservieren“-Buttons führen zu Quandoo:
https://www.quandoo.de/place/nours-angus-restaurant-steakhaus-58782
Wenn sich der Link ändert, alle Vorkommen in `index.html` ersetzen (Klasse `js-reserve`).
