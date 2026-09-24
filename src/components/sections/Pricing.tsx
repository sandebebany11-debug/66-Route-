"use client";

import { useState } from "react";
import { pricing } from "@/data/content";
import MagneticButton from "@/components/ui/MagneticButton";

export default function Pricing() {
  const [active, setActive] = useState(pricing[0].id);
  const category = pricing.find((c) => c.id === active) ?? pricing[0];

  return (
    <section id="preise" className="relative bg-ink py-28 md:py-40">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-14 text-center">
          <span className="text-[11px] uppercase tracking-[0.35em] text-champagne-light/80">
            Preise
          </span>
          <h2 className="mt-3 font-display text-4xl font-light text-paper sm:text-5xl">
            Klar. Fair. <span className="italic text-champagne-light">Transparent.</span>
          </h2>
        </div>

        <div className="no-scrollbar mb-12 flex snap-x gap-2 overflow-x-auto pb-2">
          {pricing.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`shrink-0 snap-start rounded-full border px-5 py-2 text-xs uppercase tracking-[0.15em] transition-colors ${
                c.id === active
                  ? "border-champagne bg-champagne text-ink"
                  : "border-line text-paper/60 hover:border-champagne/50 hover:text-paper"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {category.groups.map((group) => (
            <div key={group.title} className="border border-line p-8">
              <h3 className="font-display text-xl text-paper">{group.title}</h3>
              <ul className="mt-5 space-y-3">
                {group.rows.map((row) => (
                  <li
                    key={row.label}
                    className="flex items-baseline justify-between gap-4 text-sm text-paper/75"
                  >
                    <span>{row.label}</span>
                    <span className="flex-1 border-b border-dotted border-line translate-y-[-3px]" />
                    <span className="font-medium text-champagne-light">{row.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 text-center">
          <p className="text-xs text-paper/45">
            Alle Preise verstehen sich als Richtwerte je nach Haarlänge und Aufwand.
          </p>
          <MagneticButton href="#kontakt" cursorLabel="BOOK">
            Termin vereinbaren
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
