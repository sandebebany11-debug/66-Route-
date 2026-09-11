"use client";

import RevealText from "@/components/ui/RevealText";
import MagneticButton from "@/components/ui/MagneticButton";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-ink px-6 text-center"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-champagne/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--color-ink)_78%)]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink to-transparent" />
      </div>

      <span className="mb-8 text-[11px] uppercase tracking-[0.4em] text-champagne-light/90">
        Art of Hair by Simyan
      </span>

      <RevealText
        as="h1"
        className="font-display text-6xl font-light leading-[0.95] tracking-tight text-paper sm:text-8xl md:text-[8.5rem]"
      >
        Precision
      </RevealText>
      <RevealText
        as="h1"
        className="font-display text-6xl italic font-light leading-[0.95] tracking-tight text-champagne-light sm:text-8xl md:text-[8.5rem]"
      >
        meets style.
      </RevealText>

      <p className="mt-8 max-w-md text-sm uppercase tracking-[0.2em] text-paper/60 sm:text-base">
        Friseurmeister. Präzision. Persönlichkeit.
      </p>

      <div className="mt-12">
        <MagneticButton href="#kontakt" cursorLabel="BOOK">
          Termin vereinbaren
        </MagneticButton>
      </div>

      <div className="absolute inset-x-0 bottom-9 flex flex-col items-center gap-3 text-paper/40">
        <span className="text-[10px] uppercase tracking-[0.3em]">Scrollen</span>
        <div className="h-12 w-px animate-pulse bg-gradient-to-b from-champagne to-transparent" />
      </div>
    </section>
  );
}
