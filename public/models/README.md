# Panasonic clipper 3D model

The scroll-driven "signature moment" (`src/components/sections/MachineExperience.tsx`)
currently renders a hand-built procedural clipper (`src/components/three/ClipperModel.tsx`,
part layout in `parts.ts`) — no external model file is required for the site to work.

To swap in the real Panasonic clipper, drop a file here at exactly:

```
public/models/panasonic-clipper.glb
```

The app checks for this file on the server (`src/lib/model.ts`) and automatically
switches to it — no code change needed. If the file is missing, invalid, or fails
to parse, it falls back to the procedural model automatically
(`src/components/three/ModelErrorBoundary.tsx`), so the site never breaks.

## Spec for the .glb

- **Format:** glTF Binary (`.glb`), single file, embedded textures.
- **Scale:** modeled so the clipper is roughly 2.5–3 units tall at scale 1
  (matches the procedural model's proportions; camera/lighting are tuned to
  that scale in `ClipperScene.tsx`).
- **Origin:** centered roughly at the clipper's midpoint, upright along +Y,
  facing +Z (front of the clipper / blade end pointing toward the camera).
- **Materials:** PBR (metalness/roughness). Suggested look: near-black
  gunmetal body, brushed-steel blades, a warm champagne-gold accent for the
  motor/trim to match the site's palette (`--color-champagne` in `globals.css`).
- **Polycount:** keep it lean (a few tens of thousands of triangles) — this
  renders inside a full-page scroll animation on mobile too.
- **Parts:** the exploded-view animation works two ways:
  - **Best result:** author the clipper as separate top-level nodes/meshes
    (e.g. `handle`, `backCover`, `motorCore`, `bladeHousing`, `combGuard`,
    `bladeUpper`, `bladeLower`, screws, etc. — see `parts.ts` for the full
    procedural layout this mirrors) positioned at their assembled locations.
  - **Zero-effort fallback:** any `.glb` works even without matching names —
    `useAutoExplode.ts` automatically pushes each top-level child radially
    outward from the model's bounding-box center on scroll. Good results
    just need the model split into logical top-level parts (not one fused
    mesh), since a single fused mesh can't explode into pieces.

## Preview / QA checklist once you add the file

1. `npm run dev`, open the homepage, scroll through the "signature" section.
2. Confirm the assembled clipper reads clearly at scroll progress ~0.
3. Confirm parts separate cleanly (nothing clipping through camera near
   plane) around progress ~0.5–0.8, then reassemble by ~1.0.
4. Check mobile width (~390px) — the mobile pass uses a lighter render
   quality (`quality="lite"` in `ClipperScene.tsx`).
