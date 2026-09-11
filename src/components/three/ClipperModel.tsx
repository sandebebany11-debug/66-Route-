"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { partLayout, vec, type Vec3 } from "./parts";

export type ProgressRef = React.RefObject<{ value: number; hover: { x: number; y: number } }>;

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Explode amount 0..1 across the scroll timeline (open -> hold -> reassemble). */
function explodeAmount(p: number) {
  const open = smoothstep(0.24, 0.5, p);
  const close = 1 - smoothstep(0.85, 1.0, p);
  return Math.min(open, close);
}

type PartRecord = {
  group: THREE.Group;
  assembled: THREE.Vector3;
  explode: THREE.Vector3;
  rot: THREE.Vector3;
  seed: number;
};

export default function ClipperModel({ progressRef }: { progressRef: ProgressRef }) {
  const partsRef = useRef<Record<string, PartRecord>>({});
  const rootRef = useRef<THREE.Group>(null);
  const labelWrapRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const materials = useMemo(() => {
    const body = new THREE.MeshPhysicalMaterial({
      color: "#141311",
      metalness: 0.55,
      roughness: 0.32,
      clearcoat: 0.6,
      clearcoatRoughness: 0.25,
      envMapIntensity: 1.1,
    });
    const cover = new THREE.MeshPhysicalMaterial({
      color: "#1d1b17",
      metalness: 0.6,
      roughness: 0.4,
      clearcoat: 0.4,
      envMapIntensity: 1,
    });
    const accent = new THREE.MeshPhysicalMaterial({
      color: "#c9a668",
      metalness: 1,
      roughness: 0.22,
      envMapIntensity: 1.4,
    });
    const blade = new THREE.MeshPhysicalMaterial({
      color: "#dcdcd6",
      metalness: 1,
      roughness: 0.1,
      envMapIntensity: 1.6,
    });
    const detail = new THREE.MeshPhysicalMaterial({
      color: "#3a372f",
      metalness: 0.7,
      roughness: 0.35,
      envMapIntensity: 1,
    });
    return { body, cover, accent, blade, detail };
  }, []);

  useFrame((state, delta) => {
    const target = progressRef.current?.value ?? 0;
    const root = rootRef.current;
    if (root) {
      const eased = explodeAmount(target);
      root.rotation.y = THREE.MathUtils.damp(
        root.rotation.y,
        target * Math.PI * 0.7 + (progressRef.current?.hover.x ?? 0) * 0.25,
        4,
        delta
      );
      root.rotation.x = THREE.MathUtils.damp(
        root.rotation.x,
        (progressRef.current?.hover.y ?? 0) * -0.15,
        4,
        delta
      );
      root.position.y = THREE.MathUtils.damp(root.position.y, -0.35 + eased * 0.05, 4, delta);
    }

    const amount = explodeAmount(target);
    const floaty = smoothstep(0.5, 0.7, target) * (1 - smoothstep(0.85, 0.95, target));
    const t = state.clock.getElapsedTime();

    Object.values(partsRef.current).forEach((p) => {
      const wobble = floaty * Math.sin(t * 1.4 + p.seed) * 0.03;
      p.group.position.x = p.assembled.x + p.explode.x * amount;
      p.group.position.y = p.assembled.y + p.explode.y * amount + wobble;
      p.group.position.z = p.assembled.z + p.explode.z * amount;
      p.group.rotation.x = p.rot.x * amount;
      p.group.rotation.y = p.rot.y * amount;
      p.group.rotation.z = p.rot.z * amount;
    });

    Object.entries(labelWrapRefs.current).forEach(([, el]) => {
      if (!el) return;
      const visible = smoothstep(0.42, 0.58, target) * (1 - smoothstep(0.82, 0.95, target));
      el.style.opacity = String(visible);
      el.style.transform = `translateY(${(1 - visible) * 6}px)`;
    });
  });

  const register = (key: string, assembled: Vec3, explode: Vec3, rot: Vec3, seed: number) => (el: THREE.Group | null) => {
    if (el) {
      partsRef.current[key] = {
        group: el,
        assembled: vec(assembled),
        explode: vec(explode),
        rot: vec(rot),
        seed,
      };
    }
  };

  const geometryFor = (key: string) => {
    switch (key) {
      case "handle":
        return (
          <RoundedBox args={[0.62, 1.3, 0.42]} radius={0.09} smoothness={4} material={materials.body} />
        );
      case "backCover":
        return (
          <RoundedBox args={[0.5, 0.86, 0.16]} radius={0.06} smoothness={4} material={materials.cover} />
        );
      case "motorCore":
        return (
          <mesh material={materials.accent} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.13, 0.26, 24]} />
          </mesh>
        );
      case "speedDial":
        return (
          <mesh material={materials.detail} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.12, 20]} />
          </mesh>
        );
      case "taperLever":
        return <RoundedBox args={[0.08, 0.24, 0.05]} radius={0.02} material={materials.detail} />;
      case "neckCollar":
        return (
          <mesh material={materials.body}>
            <cylinderGeometry args={[0.24, 0.29, 0.22, 28]} />
          </mesh>
        );
      case "bladeHousing":
        return (
          <RoundedBox args={[0.58, 0.34, 0.5]} radius={0.07} smoothness={4} material={materials.body} />
        );
      case "combGuard":
        return (
          <group>
            <RoundedBox args={[0.56, 0.1, 0.08]} radius={0.02} material={materials.detail} position={[0, 0.14, -0.02]} />
            {Array.from({ length: 9 }).map((_, i) => (
              <mesh key={i} material={materials.detail} position={[-0.24 + i * 0.06, -0.02, 0.08]}>
                <boxGeometry args={[0.03, 0.28, 0.16]} />
              </mesh>
            ))}
          </group>
        );
      case "bladeUpper":
        return <RoundedBox args={[0.5, 0.045, 0.3]} radius={0.01} material={materials.blade} />;
      case "bladeLower":
        return <RoundedBox args={[0.52, 0.045, 0.32]} radius={0.01} material={materials.blade} />;
      case "screwA":
      case "screwB":
      case "screwC":
        return (
          <mesh material={materials.accent} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.06, 12]} />
          </mesh>
        );
      case "endCap":
        return (
          <mesh material={materials.body}>
            <cylinderGeometry args={[0.31, 0.28, 0.14, 28]} />
          </mesh>
        );
      default:
        return null;
    }
  };

  return (
    <group ref={rootRef} position={[0, -0.35, 0]}>
      {partLayout.map((p, i) => (
        <group
          key={p.key}
          position={p.assembled}
          ref={register(p.key, p.assembled, p.explode, p.explodeRotation, i * 1.7)}
        >
          {geometryFor(p.key)}
          {p.label && (
            <Html center distanceFactor={8} style={{ pointerEvents: "none" }}>
              <div
                ref={(el) => {
                  labelWrapRefs.current[p.key] = el;
                }}
                style={{ opacity: 0 }}
                className="whitespace-nowrap rounded-full border border-champagne/40 bg-ink/70 px-3 py-1 text-[9px] uppercase tracking-[0.22em] text-champagne-light backdrop-blur-sm"
              >
                {p.label}
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
}
