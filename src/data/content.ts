// Real business content for Art of Hair by Simyan, transcribed from the
// existing site and the brief. Prices marked with `confirmed: false` are
// provisional placeholders (only the Damen "Haarschnitt" and "Cut & Go"
// groups were supplied as exact figures) — replace with the salon's real
// price list before this goes live.

export const salon = {
  name: "Art of Hair by Simyan",
  owner: "Simyan Chicho",
  city: "Leverkusen",
  district: "Lützenkirchen",
  address: {
    street: "Lützenkirchener Str. 411",
    zip: "51381",
    city: "Leverkusen",
  },
  phone: "02171 83045",
  phoneHref: "+49217183045",
  email: "artofhair.bysimyan@gmail.com",
  instagram: "@artofhair_bysimyan",
  instagramUrl: "https://www.instagram.com/artofhair_bysimyan",
  hours: [
    { days: "Dienstag – Freitag", time: "9:00 – 18:00 Uhr" },
    { days: "Samstag", time: "9:00 – 14:00 Uhr" },
    { days: "Sonntag & Montag", time: "geschlossen" },
  ],
};

export type TeamMember = {
  name: string;
  role: string;
  bio?: string;
  image: string;
};

export const team: TeamMember[] = [
  {
    name: "Simyan Chicho",
    role: "Inhaber & Friseurmeister",
    bio: "Meisterbrief, über ein Jahrzehnt Erfahrung und der Blick fürs Detail, der jeden Schnitt bei Art of Hair prägt.",
    image: "/images/team/simyan.jpg",
  },
  {
    name: "Graziella",
    role: "Top-Stylistin",
    bio: "Farbe, Struktur, Balayage — Graziella verbindet Technik mit einem sicheren Gespür für Nuancen.",
    image: "/images/team/graziella.jpg",
  },
  {
    name: "Vanessa",
    role: "Top-Stylistin",
    bio: "Präzision im Schnitt, Ruhe in der Beratung — Vanessa holt aus jeder Haarstruktur das Beste heraus.",
    image: "/images/team/vanessa.jpg",
  },
  {
    name: "Chiara",
    role: "Top-Stylistin",
    bio: "Moderne Schnitte und Coloration mit einem feinen Sinn für Trends und Persönlichkeit.",
    image: "/images/team/chiara.jpg",
  },
  {
    name: "Rosel",
    role: "Auszubildende, 3. Lehrjahr",
    bio: "Kurz vor dem Abschluss ihrer Ausbildung — mit wachsendem Können und viel Sorgfalt.",
    image: "/images/team/rosel.jpg",
  },
  {
    name: "Sarkar",
    role: "Auszubildender, 2. Lehrjahr",
    bio: "Lernt das Handwerk von Grund auf — Präzision, Schritt für Schritt.",
    image: "/images/team/sarkar.jpg",
  },
];

export type PriceRow = { label: string; price: string };
export type PriceGroup = { title: string; rows: PriceRow[]; confirmed: boolean };
export type PriceCategory = { id: string; label: string; groups: PriceGroup[] };

export const pricing: PriceCategory[] = [
  {
    id: "damen",
    label: "Damen",
    groups: [
      {
        title: "Haarschnitt",
        confirmed: true,
        rows: [
          { label: "Kurz", price: "43 €" },
          { label: "Mittel", price: "53 €" },
          { label: "Lang", price: "63 €" },
        ],
      },
      {
        title: "Cut & Go",
        confirmed: true,
        rows: [
          { label: "Kurz", price: "36 €" },
          { label: "Mittel", price: "38 €" },
          { label: "Lang", price: "40 €" },
        ],
      },
      {
        title: "Waschen, Föhnen, Styling",
        confirmed: false,
        rows: [
          { label: "Kurz", price: "ab 28 €" },
          { label: "Mittel", price: "ab 34 €" },
          { label: "Lang", price: "ab 42 €" },
        ],
      },
    ],
  },
  {
    id: "herren",
    label: "Herren",
    groups: [
      {
        title: "Haarschnitt",
        confirmed: false,
        rows: [
          { label: "Klassisch", price: "ab 28 €" },
          { label: "Maschine & Schere", price: "ab 32 €" },
          { label: "Bart trimmen", price: "ab 15 €" },
          { label: "Schnitt & Bart komplett", price: "ab 40 €" },
        ],
      },
    ],
  },
  {
    id: "kinder",
    label: "Kinder",
    groups: [
      {
        title: "Haarschnitt (bis 12 Jahre)",
        confirmed: false,
        rows: [{ label: "Kinderschnitt", price: "ab 20 €" }],
      },
    ],
  },
  {
    id: "coloration",
    label: "Coloration",
    groups: [
      {
        title: "Ansatzfarbe",
        confirmed: false,
        rows: [
          { label: "Kurz", price: "ab 45 €" },
          { label: "Mittel", price: "ab 55 €" },
          { label: "Lang", price: "ab 68 €" },
        ],
      },
      {
        title: "Komplettfarbe",
        confirmed: false,
        rows: [
          { label: "Kurz", price: "ab 55 €" },
          { label: "Mittel", price: "ab 68 €" },
          { label: "Lang", price: "ab 85 €" },
        ],
      },
      {
        title: "Glossing",
        confirmed: false,
        rows: [{ label: "Glanzbehandlung", price: "ab 30 €" }],
      },
    ],
  },
  {
    id: "straehnen",
    label: "Strähnen & Balayage",
    groups: [
      {
        title: "Strähnen",
        confirmed: false,
        rows: [
          { label: "Kurz", price: "ab 60 €" },
          { label: "Mittel", price: "ab 75 €" },
          { label: "Lang", price: "ab 95 €" },
        ],
      },
      {
        title: "Balayage",
        confirmed: false,
        rows: [
          { label: "Kurz", price: "ab 90 €" },
          { label: "Mittel", price: "ab 120 €" },
          { label: "Lang", price: "ab 150 €" },
        ],
      },
      {
        title: "Ombré",
        confirmed: false,
        rows: [
          { label: "Kurz", price: "ab 85 €" },
          { label: "Mittel", price: "ab 110 €" },
          { label: "Lang", price: "ab 140 €" },
        ],
      },
    ],
  },
  {
    id: "dauerwelle",
    label: "Dauerwelle",
    groups: [
      {
        title: "Dauerwelle inkl. Schnitt",
        confirmed: false,
        rows: [
          { label: "Kurz", price: "ab 75 €" },
          { label: "Mittel", price: "ab 95 €" },
          { label: "Lang", price: "ab 120 €" },
        ],
      },
    ],
  },
  {
    id: "verlaengerung",
    label: "Haarverlängerung & -verdichtung",
    groups: [
      {
        title: "Beratung & Behandlung",
        confirmed: false,
        rows: [{ label: "Auf Anfrage nach individueller Beratung", price: "auf Anfrage" }],
      },
    ],
  },
  {
    id: "pflege",
    label: "Haarpflege — Kevin Murphy",
    groups: [
      {
        title: "Pflegebehandlungen",
        confirmed: false,
        rows: [
          { label: "Intensivkur", price: "ab 15 €" },
          { label: "Kopfhautbehandlung", price: "ab 20 €" },
        ],
      },
    ],
  },
  {
    id: "kosmetik",
    label: "Kosmetik",
    groups: [
      {
        title: "Augenbrauen & Wimpern",
        confirmed: false,
        rows: [
          { label: "Augenbrauen zupfen", price: "ab 10 €" },
          { label: "Wimpern färben", price: "ab 15 €" },
          { label: "Augenbrauen färben", price: "ab 12 €" },
        ],
      },
    ],
  },
];

export const services = [
  {
    word: "CUT",
    title: "Schnitt",
    description:
      "Damen, Herren und Kinder — jeder Schnitt beginnt mit einer ehrlichen Beratung und endet mit einer Form, die zu Ihnen passt.",
  },
  {
    word: "COLOR",
    title: "Coloration",
    description:
      "Von der natürlichen Ansatzfarbe bis zur mutigen Komplettfarbe — präzise Rezepturen für ein Ergebnis, das hält.",
  },
  {
    word: "BALAYAGE",
    title: "Balayage & Strähnen",
    description:
      "Freihand gemalte Übergänge, Ombré und Strähnentechniken für gesunden, dreidimensionalen Glanz.",
  },
  {
    word: "STYLE",
    title: "Styling",
    description: "Waschen, Föhnen, Finish — für den Alltag oder den einen besonderen Abend.",
  },
  {
    word: "BEARD",
    title: "Bart",
    description: "Konturen, Trimm und Pflege — Präzisionsarbeit auch für Herren.",
  },
  {
    word: "CARE",
    title: "Pflege",
    description: "Kevin Murphy Pflegerituale und Kopfhautbehandlungen für Haar, das den Schnitt trägt.",
  },
];

export const nav = [
  { label: "Team", href: "#team" },
  { label: "Services", href: "#services" },
  { label: "Preise", href: "#preise" },
  { label: "Salon", href: "#salon" },
  { label: "Kontakt", href: "#kontakt" },
];

export const seoKeywords = [
  "Friseur Leverkusen",
  "Friseur Lützenkirchen",
  "Friseurmeister Leverkusen",
  "Damenfriseur Leverkusen",
  "Herrenfriseur Leverkusen",
  "Balayage Leverkusen",
];
