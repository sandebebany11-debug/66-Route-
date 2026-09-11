# Art of Hair by Simyan

Premium redesign of the salon website for Art of Hair by Simyan
(Leverkusen-Lützenkirchen) — Next.js (App Router) + TypeScript + Tailwind
CSS v4, with a scroll-driven 3D "exploded view" of a Panasonic-style hair
clipper (React Three Fiber + GSAP ScrollTrigger) as the signature moment.

## Develop

```bash
npm install
npm run dev
```

## Structure

- `src/components/sections/` — page sections (Hero, MachineExperience,
  Services, Team, Salon, KevinMurphy, Pricing, Booking)
- `src/components/three/` — the 3D clipper scene and its exploded-view
  animation (procedural by default; see `public/models/README.md` for how
  to drop in a real `.glb`)
- `src/data/content.ts` — team, pricing, services and contact info (see the
  file header for which prices are confirmed vs. provisional)
- `public/images/README.md` — exact paths for real team/salon photos

## Notes

- Pricing beyond the "Haarschnitt" and "Cut & Go" Damen groups is
  provisional placeholder data — replace with the salon's real price list
  in `src/data/content.ts`.
- `/impressum` and `/datenschutz` are basic legal-page templates; review
  before publishing.
