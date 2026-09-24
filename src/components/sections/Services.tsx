"use client";

import { useEffect, useRef, useState } from "react";
import { services } from "@/data/content";
import { ScrollTrigger } from "@/lib/gsap";
import MagneticButton from "@/components/ui/MagneticButton";

export default function Services() {
  const [active, setActive] = useState(0);
  const wordRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const triggers = wordRefs.current.map((el, i) => {
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => self.isActive && setActive(i),
      });
    });
    return () => triggers.forEach((t) => t?.kill());
  }, []);

  return (
    <section id="services" className="relative bg-ink py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 flex items-end justify-between gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.35em] text-champagne-light/80">
              Leistungen
            </span>
            <h2 className="mt-3 font-display text-4xl font-light text-paper sm:text-5xl">
              Sechs Disziplinen,
              <br />
              <span className="italic text-champagne-light">ein Anspruch.</span>
            </h2>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col">
            {services.map((s, i) => (
              <button
                key={s.word}
                ref={(el) => {
                  wordRefs.current[i] = el;
                }}
                onMouseEnter={() => setActive(i)}
                onClick={() =>
                  document.getElementById("preise")?.scrollIntoView({ behavior: "smooth" })
                }
                data-cursor="VIEW"
                className={`group flex items-baseline justify-between border-t border-line py-6 text-left transition-colors last:border-b ${
                  i === active ? "text-paper" : "text-paper/35"
                }`}
              >
                <span className="font-display text-4xl font-light tracking-tight sm:text-6xl">
                  {s.word}
                </span>
                <span
                  className={`text-xs uppercase tracking-[0.2em] transition-opacity ${
                    i === active ? "opacity-100 text-champagne-light" : "opacity-0"
                  }`}
                >
                  {s.title}
                </span>
              </button>
            ))}
          </div>

          <div className="relative hidden md:block">
            <div className="sticky top-32 flex h-[26rem] flex-col justify-between rounded-[2px] border border-line p-10">
              <span className="font-display text-8xl italic text-champagne/25">
                {String(active + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-3xl font-light text-paper">
                  {services[active].title}
                </h3>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/60">
                  {services[active].description}
                </p>
                <div className="mt-8">
                  <MagneticButton href="#preise" cursorLabel="VIEW" className="!px-6 !py-2.5 text-[10px]">
                    Preise ansehen
                  </MagneticButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
