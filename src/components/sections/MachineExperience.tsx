"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMediaQuery } from "@/lib/useMediaQuery";

const beats = [
  { at: [0, 0.14], eyebrow: "ART OF HAIR BY SIMYAN", title: "PRECISION", copy: "Jeder Schnitt beginnt mit Präzision." },
  { at: [0.16, 0.32], eyebrow: "DAS HANDWERK", title: "CRAFT", copy: "Technik trifft klassisches Friseurhandwerk." },
  { at: [0.38, 0.7], eyebrow: "IM DETAIL", title: "EVERY DETAIL MATTERS", copy: "Motor, Klinge, Kamm — jedes Bauteil hat einen Zweck." },
  { at: [0.8, 0.96], eyebrow: "DAS ERGEBNIS", title: "YOUR STYLE", copy: "Perfektion entsteht im Detail." },
] as const;

// [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd] as fractions of scroll progress.
const layers = [
  { src: "/images/machine/assembled.jpg", window: [-0.02, 0, 0.14, 0.22] },
  { src: "/images/machine/angle.jpg", window: [0.14, 0.22, 0.34, 0.42] },
  { src: "/images/machine/exploded.jpg", window: [0.34, 0.42, 0.8, 0.88] },
  { src: "/images/machine/assembled.jpg", window: [0.8, 0.88, 1, 1.02] },
] as const;

const details = [
  { src: "/images/machine/detail-blade.jpg", label: "KLINGE", pos: "left-[8%] top-[18%] md:left-[12%]" },
  { src: "/images/machine/detail-dial.jpg", label: "FEINJUSTIERUNG", pos: "right-[8%] top-[14%] md:right-[14%]" },
  { src: "/images/machine/detail-leds.jpg", label: "STATUSANZEIGE", pos: "left-[10%] bottom-[24%] md:left-[16%]" },
  { src: "/images/machine/detail-port.jpg", label: "LADEANSCHLUSS", pos: "right-[9%] bottom-[20%] md:right-[15%]" },
] as const;

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export default function MachineExperience() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const detailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const beatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);
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
        const p = self.progress;

        layers.forEach((layer, i) => {
          const el = layerRefs.current[i];
          if (!el) return;
          const [inStart, inEnd, outStart, outEnd] = layer.window;
          const visible = smoothstep(inStart, inEnd, p) * (1 - smoothstep(outStart, outEnd, p));
          el.style.opacity = String(visible);
        });

        const detailWindow: [number, number, number, number] = [0.42, 0.55, 0.76, 0.85];
        details.forEach((_, i) => {
          const el = detailRefs.current[i];
          if (!el) return;
          const stagger = i * 0.02;
          const visible =
            smoothstep(detailWindow[0] + stagger, detailWindow[1] + stagger, p) *
            (1 - smoothstep(detailWindow[2], detailWindow[3], p));
          el.style.opacity = String(visible);
          el.style.transform = `translateY(${(1 - visible) * 14}px)`;
        });

        beats.forEach((beat, i) => {
          const el = beatRefs.current[i];
          if (!el) return;
          const [start, end] = beat.at;
          const fadeIn = smoothstep(start, start + 0.06, p);
          const fadeOut = 1 - smoothstep(end - 0.06, end, p);
          const visible = Math.min(fadeIn, fadeOut);
          el.style.opacity = String(visible);
          el.style.transform = `translateY(${(1 - visible) * 24}px)`;
        });
      },
    });

    const onMove = (e: PointerEvent) => {
      const stage = stageRef.current;
      if (!stage) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      gsap.to(stage, { x: x * 10, y: y * 6, duration: 0.8, ease: "power2.out" });
    };
    window.addEventListener("pointermove", onMove);

    return () => {
      trigger.kill();
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  if (reduced) {
    return (
      <section id="signature" className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-ink px-6 text-center">
        <div className="relative h-[70vh] w-full max-w-md">
          <Image
            src="/images/machine/assembled.jpg"
            alt="Panasonic Präzisionsschneider"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 480px"
          />
        </div>
        <span className="mb-3 text-[10px] uppercase tracking-[0.35em] text-champagne-light/80">
          ART OF HAIR BY SIMYAN
        </span>
        <h2 className="font-display text-4xl font-light text-paper sm:text-6xl">PRECISION MEETS STYLE</h2>
        <p className="mt-4 max-w-md text-sm text-paper/60">Perfektion entsteht im Detail.</p>
      </section>
    );
  }

  return (
    <section
      id="signature"
      ref={wrapperRef}
      className="relative"
      style={{ height: mobile ? "260vh" : "380vh" }}
      aria-label="Der Präzisionsschneider — animierte Bildsequenz"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-ink">
        <div ref={stageRef} className="absolute inset-x-0 top-0 bottom-[26%]">
          {layers.map((layer, i) => (
            <div
              key={i}
              ref={(el) => {
                layerRefs.current[i] = el;
              }}
              className="ken-burns absolute inset-0 opacity-0"
              style={{
                maskImage: "radial-gradient(ellipse 60% 65% at 50% 46%, black 55%, transparent 92%)",
                WebkitMaskImage: "radial-gradient(ellipse 60% 65% at 50% 46%, black 55%, transparent 92%)",
              }}
            >
              <Image
                src={layer.src}
                alt="Panasonic Präzisionsschneider"
                fill
                priority={i === 0}
                className="object-contain"
                sizes="100vw"
              />
            </div>
          ))}

          {details.map((detail, i) => (
            <div
              key={detail.label}
              ref={(el) => {
                detailRefs.current[i] = el;
              }}
              className={`pointer-events-none absolute h-24 w-24 opacity-0 sm:h-32 sm:w-32 md:h-36 md:w-36 ${detail.pos}`}
            >
              <div className="relative h-full w-full overflow-hidden rounded-full border border-champagne/50 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                <Image src={detail.src} alt={detail.label} fill className="object-cover" sizes="160px" />
              </div>
              <span className="mt-2 block text-center text-[9px] uppercase tracking-[0.2em] text-champagne-light/90">
                {detail.label}
              </span>
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-center px-6 pb-10 md:pb-14">
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
