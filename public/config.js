/*
 * Zentrale Salon-Daten – wird von Website UND Server verwendet.
 * Adresse, Telefon, Preise, Team und Öffnungszeiten hier anpassen.
 */
(function (root) {
  const SALON = {
    name: 'Art of Hair',
    ort: 'Lützenkirchen',
    // TODO: echte Straße / Hausnummer eintragen
    strasse: 'Musterstraße 1',
    plz: '51381',
    stadt: 'Leverkusen-Lützenkirchen',
    // TODO: echte Telefonnummer und E-Mail eintragen
    telefon: '+49 2171 000000',
    telefonAnzeige: '02171 / 00 00 00',
    email: 'info@artofhair-luetzenkirchen.de',
    instagram: 'https://www.instagram.com/',

    // Öffnungszeiten: 0 = Sonntag … 6 = Samstag. null = geschlossen.
    oeffnungszeiten: {
      0: null,
      1: null,
      2: ['09:00', '18:30'],
      3: ['09:00', '18:30'],
      4: ['09:00', '20:00'],
      5: ['09:00', '18:30'],
      6: ['08:00', '14:00'],
    },
    slotMinuten: 30,
    vorlaufTage: 60,

    // TODO: Namen und Rollen der Mitarbeiterinnen eintragen, weitere Personen einfach ergänzen
    team: [
      { id: 'simyan', name: 'Simyan', rolle: 'Friseur', initialen: 'S', bild: 'images/simyan.jpg' },
      { id: 'mitarbeiterin-1', name: 'Mitarbeiterin', rolle: 'Friseurin', initialen: 'M', bild: 'images/mitarbeiterin-1.jpg' },
      { id: 'mitarbeiterin-2', name: 'Mitarbeiterin', rolle: 'Friseurin', initialen: 'M', bild: 'images/mitarbeiterin-2.jpg' },
    ],

    kategorien: [
      { id: 'damen', titel: 'Damen' },
      { id: 'herren', titel: 'Herren' },
      { id: 'farbe', titel: 'Farbe & Glanz' },
      { id: 'styling', titel: 'Styling & Anlass' },
      { id: 'pflege', titel: 'Pflege' },
    ],

    leistungen: [
      { id: 'd-schnitt-kurz', kat: 'damen', name: 'Waschen, Schneiden, Föhnen – kurz', dauer: 45, preis: 'ab 42 €' },
      { id: 'd-schnitt-lang', kat: 'damen', name: 'Waschen, Schneiden, Föhnen – lang', dauer: 60, preis: 'ab 55 €' },
      { id: 'd-foehnen', kat: 'damen', name: 'Waschen & Föhnen', dauer: 30, preis: 'ab 28 €' },
      { id: 'd-pony', kat: 'damen', name: 'Ponyschnitt', dauer: 15, preis: '10 €' },

      { id: 'h-schnitt', kat: 'herren', name: 'Herrenschnitt inkl. Waschen & Styling', dauer: 30, preis: '29 €' },
      { id: 'h-maschine', kat: 'herren', name: 'Maschinenschnitt / Fade', dauer: 30, preis: '24 €' },
      { id: 'h-bart', kat: 'herren', name: 'Bartpflege & Konturen', dauer: 15, preis: '15 €' },
      { id: 'kinder', kat: 'herren', name: 'Kinderschnitt bis 12 Jahre', dauer: 30, preis: 'ab 18 €' },

      { id: 'f-ansatz', kat: 'farbe', name: 'Ansatzfarbe', dauer: 90, preis: 'ab 49 €' },
      { id: 'f-komplett', kat: 'farbe', name: 'Komplettfarbe', dauer: 120, preis: 'ab 69 €' },
      { id: 'f-straehnen', kat: 'farbe', name: 'Strähnen / Foliensträhnen', dauer: 150, preis: 'ab 89 €' },
      { id: 'f-balayage', kat: 'farbe', name: 'Balayage inkl. Toning', dauer: 180, preis: 'ab 139 €' },

      { id: 's-hochsteck', kat: 'styling', name: 'Hochsteckfrisur', dauer: 60, preis: 'ab 59 €' },
      { id: 's-braut', kat: 'styling', name: 'Brautstyling inkl. Probetermin', dauer: 120, preis: 'ab 189 €' },
      { id: 's-locken', kat: 'styling', name: 'Wellen & Locken-Styling', dauer: 45, preis: 'ab 35 €' },

      { id: 'p-olaplex', kat: 'pflege', name: 'Olaplex-Treatment', dauer: 30, preis: '35 €' },
      { id: 'p-keratin', kat: 'pflege', name: 'Keratin-Glättung', dauer: 150, preis: 'ab 179 €' },
      { id: 'p-kopfhaut', kat: 'pflege', name: 'Kopfhaut-Ritual mit Massage', dauer: 30, preis: '25 €' },
    ],
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = SALON;
  else root.SALON = SALON;
})(typeof self !== 'undefined' ? self : this);
