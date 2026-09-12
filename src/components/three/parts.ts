import * as THREE from "three";

export type Vec3 = [number, number, number];

export type PartConfig = {
  key: string;
  assembled: Vec3;
  explode: Vec3;
  explodeRotation: Vec3;
  material: "accent" | "blade" | "chrome" | "rubber" | "button" | "ledGreen" | "ledRed";
  label?: string;
  render: () => React.ReactElement;
};

// All dimensions are in abstract "clipper units" (~1 unit = 4cm), modelling a
// premium professional hair clipper in the classic silver-top/black-body
// design: chrome blade housing and comb, gold-tipped blade, black rubberized
// grip with an oval control pad and status LEDs, internal precision motor,
// removable back cover, and mounting screws.
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
    material: "rubber",
  },
  {
    key: "backCover",
    assembled: [0, 0.05, -0.06],
    explode: [0, 0.15, -1.05],
    explodeRotation: [0.15, 0, 0],
    material: "rubber",
  },
  {
    key: "controlButton",
    assembled: [0, 0.05, 0.2],
    explode: [0, 0.55, 0.55],
    explodeRotation: [0.6, 0, 0],
    material: "button",
  },
  {
    key: "indicatorGreen",
    assembled: [0, -0.18, 0.2],
    explode: [-0.4, -0.5, 0.5],
    explodeRotation: [0, 1, 0],
    material: "ledGreen",
  },
  {
    key: "indicatorRed",
    assembled: [0, -0.28, 0.2],
    explode: [0.4, -0.6, 0.5],
    explodeRotation: [0, -1, 0],
    material: "ledRed",
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
    material: "chrome",
    label: "FEINJUSTIERUNG",
  },
  {
    key: "taperLever",
    assembled: [-0.31, -0.12, 0.19],
    explode: [-1.15, -0.15, 0.25],
    explodeRotation: [0, 0, -0.8],
    material: "chrome",
  },
  {
    key: "neckCollar",
    assembled: [0, 0.74, 0],
    explode: [0, 0.28, 0],
    explodeRotation: [0, 0.4, 0],
    material: "chrome",
  },
  {
    key: "bladeHousing",
    assembled: [0, 1.02, 0.14],
    explode: [0, 0.4, 0.85],
    explodeRotation: [0.25, 0, 0],
    material: "chrome",
    label: "SCHERKOPF",
  },
  {
    key: "combGuard",
    assembled: [0, 1.06, 0.44],
    explode: [0, 0.62, 1.55],
    explodeRotation: [0.4, 0, 0],
    material: "chrome",
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
    material: "accent",
  },
  {
    key: "screwB",
    assembled: [-0.24, 0.55, 0.19],
    explode: [-1.35, 0.55, 0.5],
    explodeRotation: [2, -2, 0],
    material: "accent",
  },
  {
    key: "screwC",
    assembled: [0.2, -0.95, 0.16],
    explode: [1.15, -1.1, 0.75],
    explodeRotation: [1.5, 1, 0.5],
    material: "accent",
  },
  {
    key: "endCap",
    assembled: [0, -1.28, 0],
    explode: [0, -0.85, 0],
    explodeRotation: [0.3, 0, 0],
    material: "chrome",
  },
];

export function vec(v: Vec3) {
  return new THREE.Vector3(v[0], v[1], v[2]);
}
