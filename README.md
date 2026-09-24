# Art of Hair by Simyan

Premium redesign of the salon website for Art of Hair by Simyan
(Leverkusen-Lützenkirchen) — Next.js (App Router) + TypeScript + Tailwind
CSS v4, with a scroll-driven photo sequence of a real professional hair
clipper (GSAP ScrollTrigger + Lenis) as the signature moment.

## Develop

```bash
npm install
npm run dev
```

## Structure

- `src/components/sections/` — page sections (Hero, MachineExperience,
  Services, Team, Salon, KevinMurphy, Pricing, Booking)
- `src/components/sections/MachineExperience.tsx` — the scroll-driven
  signature moment: real clipper photos (`public/images/machine/`)
  crossfade from assembled → angled → exploded → reassembled as you scroll,
  with floating detail callouts (blade, dial, LEDs, charging port)
- `src/data/content.ts` — team, pricing, services and contact info (see the
  file header for which prices are confirmed vs. provisional)
- `public/images/README.md` — exact paths for real team/salon photos

## Notes

- Pricing beyond the "Haarschnitt" and "Cut & Go" Damen groups is
  provisional placeholder data — replace with the salon's real price list
  in `src/data/content.ts`.
- `/impressum` and `/datenschutz` are basic legal-page templates; review
  before publishing.
- `public/images/machine/*.jpg` are cropped from a product photo the client
  supplied showing the exact clipper model and its exploded components.
  **Confirm you have the rights to publish this photo** (own photography,
  licensed stock, or manufacturer permission) before the site goes live —
  it's visible product photography with a Panasonic wordmark in frame.
