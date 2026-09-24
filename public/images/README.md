# Photos

The site works today with elegant placeholder plates (initials for the team,
labeled abstract panels for the salon/product shots) via `ImagePlate` /
`TeamPortrait` — nothing is broken without real photos. Drop real photos in
at the exact paths below and they take over automatically, no code changes.

## Team (`src/data/content.ts`)

```
public/images/team/simyan.jpg
public/images/team/graziella.jpg
public/images/team/vanessa.jpg
public/images/team/chiara.jpg
public/images/team/rosel.jpg
public/images/team/sarkar.jpg
```

Portrait orientation, ideally shot consistently (same background/lighting)
since they sit in one editorial grid (`Team.tsx`). Aspect ratio used on the
page is 3:4 (portrait) — a tighter head-and-shoulders crop works best.

## Salon (`Salon.tsx`)

```
public/images/salon/interior-wide.jpg     (16:8 — wide interior shot)
public/images/salon/details.jpg           (3:4 — materials/details)
public/images/salon/products.jpg          (1:1 — product shelf)
public/images/salon/mirror-station.jpg    (16:9 — a styling station)
```

## Kevin Murphy (`KevinMurphy.tsx`)

```
public/images/kevin-murphy/products.jpg   (4:5 — product shot)
```

## Notes

- JPG/WebP both fine (the `<img>` tags don't care); keep files reasonably
  compressed (a few hundred KB each) since several load on one page.
- If a path 404s, the page shows the styled fallback instead of a broken
  image icon — safe to add photos incrementally.
