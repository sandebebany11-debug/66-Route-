"use client";

import { useState } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useAutoExplode } from "./useAutoExplode";
import type { ProgressRef } from "./ClipperModel";

export const CLIPPER_MODEL_PATH = "/models/panasonic-clipper.glb";

/** Renders the real Panasonic clipper .glb once dropped into /public/models. */
export function GLBClipper({ progressRef }: { progressRef: ProgressRef }) {
  const { scene } = useGLTF(CLIPPER_MODEL_PATH);
  const [group, setGroup] = useState<THREE.Group | null>(null);
  useAutoExplode(group, progressRef);

  return <primitive ref={setGroup} object={scene} dispose={null} scale={1} position={[0, -0.1, 0]} />;
}
