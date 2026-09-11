"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMediaQuery } from "@/lib/useMediaQuery";
import type { ProgressRef } from "@/components/three/ClipperModel";

const ClipperScene = dynamic(() => import("@/components/three/ClipperScene"), {
  ssr: false,
});

const beats = [
  { at: [0, 0.16], eyebrow: "ART OF HAIR BY SIMYAN", title: "PRECISION", copy: "Jeder Schnitt beginnt mit Präzision." },
  { at: [0.18, 0.34], eyebrow: "DAS HANDWERK", title: "CRAFT", copy: "Technik trifft klassisches Friseurhandwerk." },
  { at: [0.4, 0.62], eyebrow: "IM DETAIL", title: "EVERY DETAIL MATTERS", copy: "Motor, Klinge, Kamm — jedes Bauteil hat einen Zweck." },
  { at: [0.76, 0.94], eyebrow: "DAS ERGEBNIS", title: "YOUR STYLE", copy: "Perfektion entsteht im Detail." },
] as const;

export default function MachineExperience({ hasCustomModel }: { hasCustomModel: boolean }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const beatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef({ value: 0, hover: { x: 0, y: 0 } });
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const mobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (reduced) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      onUpdate: (self) => {
        progressRef.current.value = self.progress;
        beats.forEach((beat, i) => {
          const el = beatRefs.current[i];
          if (!el) return;
          const [start, end] = beat.at;
          const fadeIn = gsap.utils.mapRange(start, start + 0.06, 0, 1, self.progress);
          const fadeOut = gsap.utils.mapRange(end - 0.06, end, 1, 0, self.progress);
          const visible = Math.max(0, Math.min(1, Math.min(fadeIn, fadeOut)));
          el.style.opacity = String(visible);
          el.style.transform = `translateY(${(1 - visible) * 24}px)`;
        });
      },
    });

    const onMove = (e: PointerEvent) => {
      progressRef.current.hover.x = (e.clientX / window.innerWidth) * 2 - 1;
      progressRef.current.hover.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);

    return () => {
      trigger.kill();
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced, mobile]);

  if (reduced) {
    return (
      <StaticFallback hasCustomModel={hasCustomModel} progressRef={progressRef} />
    );
  }

  return (
    <section
      id="signature"
      ref={wrapperRef}
      className="relative"
      style={{ height: mobile ? "260vh" : "420vh" }}
      aria-label="Die Panasonic Präzisionsmaschine — animierte Explosionsansicht"
    >
      <div ref={stickyRef} className="sticky top-0 h-screen w-full overflow-hidden bg-ink">
        <ClipperScene
          progressRef={progressRef as ProgressRef}
          hasCustomModel={hasCustomModel}
          quality={mobile ? "lite" : "full"}
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-center px-6 pb-20 md:pb-24">
          {beats.map((beat, i) => (
            <div
              key={beat.title}
              ref={(el) => {
                beatRefs.current[i] = el;
              }}
              className="absolute flex max-w-xl flex-col items-center text-center opacity-0"
            >
              <span className="mb-3 text-[10px] uppercase tracking-[0.35em] text-champagne-light/80">
                {beat.eyebrow}
              </span>
              <h2 className="font-display text-4xl font-light tracking-tight text-paper sm:text-5xl md:text-6xl">
                {beat.title}
              </h2>
              <p className="mt-4 text-sm text-paper/60 sm:text-base">{beat.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StaticFallback({
  hasCustomModel,
  progressRef,
}: {
  hasCustomModel: boolean;
  progressRef: React.MutableRefObject<{ value: number; hover: { x: number; y: number } }>;
}) {
  return (
    <section id="signature" className="relative h-screen w-full overflow-hidden bg-ink">
      <ClipperScene
        progressRef={progressRef as ProgressRef}
        hasCustomModel={hasCustomModel}
        quality="lite"
      />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 text-[10px] uppercase tracking-[0.35em] text-champagne-light/80">
          ART OF HAIR BY SIMYAN
        </span>
        <h2 className="font-display text-5xl font-light text-paper sm:text-7xl">PRECISION MEETS STYLE</h2>
        <p className="mt-5 max-w-md text-sm text-paper/60">Perfektion entsteht im Detail.</p>
      </div>
    </section>
  );
}
