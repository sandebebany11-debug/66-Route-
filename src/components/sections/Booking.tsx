"use client";

import { useState } from "react";
import { salon } from "@/data/content";
import MagneticButton from "@/components/ui/MagneticButton";

const categories = ["Damen", "Herren", "Kinder", "Farbe", "Balayage", "Bart", "Sonstiges"];

export default function Booking() {
  const [selected, setSelected] = useState<string>("Damen");

  const subject = encodeURIComponent(`Terminanfrage – ${selected}`);
  const body = encodeURIComponent(
    `Hallo Art of Hair by Simyan,\n\nich möchte gerne einen Termin für „${selected}“ anfragen.\n\nMein Wunschtermin: \nMeine Telefonnummer: \n\nViele Grüße`
  );
  const mailtoHref = `mailto:${salon.email}?subject=${subject}&body=${body}`;

  return (
    <section id="kontakt" className="relative bg-paper py-28 text-ink md:py-36">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <span className="text-[11px] uppercase tracking-[0.35em] text-champagne-dark">
          Termin anfragen
        </span>
        <h2 className="mt-3 font-display text-4xl font-light sm:text-5xl">
          Worum geht es?
        </h2>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelected(cat)}
              className={`rounded-full border px-5 py-2 text-xs uppercase tracking-[0.15em] transition-colors ${
                selected === cat
                  ? "border-ink bg-ink text-paper"
                  : "border-ink/20 text-ink/60 hover:border-ink/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <MagneticButton
            href={`tel:${salon.phoneHref}`}
            cursorLabel="CALL"
            className="!border-ink !text-ink"
          >
            {salon.phone} anrufen
          </MagneticButton>
          <a
            href={mailtoHref}
            data-cursor="MAIL"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-ink/70 underline decoration-champagne-dark decoration-1 underline-offset-4 transition-colors hover:text-ink"
          >
            oder per E-Mail anfragen
          </a>
        </div>
      </div>
    </section>
  );
}
