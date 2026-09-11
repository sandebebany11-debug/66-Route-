"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import ClipperModel, { type ProgressRef } from "./ClipperModel";
import { GLBClipper } from "./GLBClipper";
import { ModelErrorBoundary } from "./ModelErrorBoundary";

type Props = {
  progressRef: ProgressRef;
  hasCustomModel: boolean;
  quality: "full" | "lite";
};

export default function ClipperScene({ progressRef, hasCustomModel, quality }: Props) {
  const [lowPower, setLowPower] = useState(quality === "lite");

  return (
    <Canvas
      camera={{ position: [0, 0.1, 7.8], fov: 30 }}
      dpr={lowPower ? [1, 1.25] : [1, 2]}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
      className="!absolute inset-0"
    >
      <PerformanceMonitor onDecline={() => setLowPower(true)} />
      <color attach="background" args={["#0a0a09"]} />
      <ambientLight intensity={0.22} />
      <directionalLight position={[3, 4, 5]} intensity={1.5} color="#fff3df" />
      <spotLight position={[-4, -2, -3]} angle={0.6} intensity={2} color="#c9a668" penumbra={1} />

      <Environment resolution={lowPower ? 128 : 256}>
        <Lightformer form="rect" intensity={4} color="#fff8ec" position={[0, 3, 2]} scale={[4, 2, 1]} />
        <Lightformer
          form="rect"
          intensity={2.5}
          color="#c9a668"
          position={[-3, 1, 2]}
          rotation={[0, Math.PI / 4, 0]}
          scale={[2, 3, 1]}
        />
        <Lightformer form="ring" intensity={2} color="#ffffff" position={[0, 0, -5]} scale={6} />
      </Environment>

      <Suspense fallback={null}>
        {hasCustomModel ? (
          <ModelErrorBoundary fallback={<ClipperModel progressRef={progressRef} />}>
            <GLBClipper progressRef={progressRef} />
          </ModelErrorBoundary>
        ) : (
          <ClipperModel progressRef={progressRef} />
        )}
      </Suspense>

      {!lowPower && (
        <EffectComposer multisampling={0}>
          <Bloom luminanceThreshold={0.65} intensity={0.35} mipmapBlur radius={0.5} />
          <Vignette eskil={false} offset={0.25} darkness={0.55} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
