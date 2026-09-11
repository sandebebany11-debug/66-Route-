import * as THREE from "three";

export type Vec3 = [number, number, number];

export type PartConfig = {
  key: string;
  assembled: Vec3;
  explode: Vec3;
  explodeRotation: Vec3;
  material: "body" | "cover" | "accent" | "blade" | "detail";
  label?: string;
  render: () => React.ReactElement;
};

// All dimensions are in abstract "clipper units" (~1 unit = 4cm), modelling a
// premium professional hair clipper: handle, removable back cover, internal
// precision motor, taper lever, speed dial, neck collar, detachable blade
// housing, comb guard, cutting blades and mounting screws.
export const partLayout: {
  key: string;
  assembled: Vec3;
  explode: Vec3;
  explodeRotation: Vec3;
  material: PartConfig["material"];
  label?: string;
}[] = [
  {
    key: "handle",
    assembled: [0, -0.55, 0],
    explode: [0, -0.2, 0],
    explodeRotation: [0, 0, 0],
    material: "body",
  },
  {
    key: "backCover",
    assembled: [0, 0.05, -0.06],
    explode: [0, 0.15, -1.05],
    explodeRotation: [0.15, 0, 0],
    material: "cover",
  },
  {
    key: "motorCore",
    assembled: [0, -0.2, 0.02],
    explode: [0, 0.45, 0.1],
    explodeRotation: [0, 0.8, 0],
    material: "accent",
    label: "PRÄZISIONSMOTOR",
  },
  {
    key: "speedDial",
    assembled: [0.31, 0.18, 0.06],
    explode: [1.15, 0.05, 0.15],
    explodeRotation: [0, 0, 1.2],
    material: "detail",
    label: "FEINJUSTIERUNG",
  },
  {
    key: "taperLever",
    assembled: [-0.31, -0.12, 0.19],
    explode: [-1.15, -0.15, 0.25],
    explodeRotation: [0, 0, -0.8],
    material: "detail",
  },
  {
    key: "neckCollar",
    assembled: [0, 0.74, 0],
    explode: [0, 0.28, 0],
    explodeRotation: [0, 0.4, 0],
    material: "body",
  },
  {
    key: "bladeHousing",
    assembled: [0, 1.02, 0.14],
    explode: [0, 0.4, 0.85],
    explodeRotation: [0.25, 0, 0],
    material: "body",
    label: "SCHERKOPF",
  },
  {
    key: "combGuard",
    assembled: [0, 1.06, 0.44],
    explode: [0, 0.62, 1.55],
    explodeRotation: [0.4, 0, 0],
    material: "detail",
  },
  {
    key: "bladeUpper",
    assembled: [0.02, 1.2, 0.3],
    explode: [0.32, 0.72, 1.0],
    explodeRotation: [0.1, 0.3, 0.1],
    material: "blade",
  },
  {
    key: "bladeLower",
    assembled: [-0.02, 1.13, 0.31],
    explode: [-0.32, 0.65, 0.9],
    explodeRotation: [-0.1, -0.2, -0.1],
    material: "blade",
  },
  {
    key: "screwA",
    assembled: [0.24, 0.55, 0.19],
    explode: [1.35, 0.55, 0.5],
    explodeRotation: [2, 2, 0],
    material: "detail",
  },
  {
    key: "screwB",
    assembled: [-0.24, 0.55, 0.19],
    explode: [-1.35, 0.55, 0.5],
    explodeRotation: [2, -2, 0],
    material: "detail",
  },
  {
    key: "screwC",
    assembled: [0.2, -0.95, 0.16],
    explode: [1.15, -1.1, 0.75],
    explodeRotation: [1.5, 1, 0.5],
    material: "detail",
  },
  {
    key: "endCap",
    assembled: [0, -1.28, 0],
    explode: [0, -0.85, 0],
    explodeRotation: [0.3, 0, 0],
    material: "body",
  },
];

export function vec(v: Vec3) {
  return new THREE.Vector3(v[0], v[1], v[2]);
}
