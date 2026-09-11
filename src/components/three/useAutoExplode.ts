"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ProgressRef } from "./ClipperModel";

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function explodeAmount(p: number) {
  const open = smoothstep(0.24, 0.5, p);
  const close = 1 - smoothstep(0.85, 1.0, p);
  return Math.min(open, close);
}

/**
 * Generic fallback explode for a real, unlabelled .glb: pushes each
 * top-level child radially away from the model's bounding-box center.
 * Used when /public/models/panasonic-clipper.glb is present but its
 * meshes weren't authored with the hand-tuned part names from parts.ts.
 */
export function useAutoExplode(root: THREE.Object3D | null, progressRef: ProgressRef, distance = 1.3) {
  const parts = useRef<{ obj: THREE.Object3D; base: THREE.Vector3; dir: THREE.Vector3 }[]>([]);

  useEffect(() => {
    if (!root) return;
    const box = new THREE.Box3().setFromObject(root);
    const center = box.getCenter(new THREE.Vector3());

    parts.current = root.children.map((child) => {
      const childBox = new THREE.Box3().setFromObject(child);
      const childCenter = childBox.getCenter(new THREE.Vector3());
      const dir = childCenter.clone().sub(center);
      if (dir.lengthSq() < 1e-6) {
        dir.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
      }
      dir.normalize();
      return { obj: child, base: child.position.clone(), dir };
    });
  }, [root]);

  useFrame(() => {
    const amount = explodeAmount(progressRef.current?.value ?? 0);
    parts.current.forEach((p) => {
      p.obj.position.copy(p.base).addScaledVector(p.dir, amount * distance);
    });
  });
}
