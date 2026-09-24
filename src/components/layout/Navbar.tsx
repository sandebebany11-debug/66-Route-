"use client";

import { useEffect, useState } from "react";
import { nav } from "@/data/content";
import MagneticButton from "@/components/ui/MagneticButton";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex justify-center transition-all duration-500 ${
        scrolled ? "pt-3" : "pt-6"
      }`}
    >
      <div
        className={`flex w-[min(96%,1400px)] items-center justify-between rounded-full border transition-all duration-500 ${
          scrolled
            ? "border-line bg-ink/70 px-5 py-2.5 backdrop-blur-md"
            : "border-transparent px-2 py-2"
        }`}
      >
        <a
          href="#hero"
          data-cursor=""
          className="font-display text-sm tracking-[0.18em] text-paper md:text-base"
        >
          ART OF HAIR
        </a>

        <nav className="hidden items-center gap-9 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[11px] uppercase tracking-[0.2em] text-paper/70 transition-colors hover:text-champagne"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <MagneticButton href="#kontakt" cursorLabel="BOOK" className="!px-5 !py-2 text-[10px]">
            Termin buchen
          </MagneticButton>
        </div>

        <button
          aria-label="Menü öffnen"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`h-px w-5 bg-paper transition-transform duration-300 ${
              open ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-5 bg-paper transition-transform duration-300 ${
              open ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-ink/98 backdrop-blur-lg transition-opacity duration-400 md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {nav.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className="font-display text-3xl text-paper"
          >
            {item.label}
          </a>
        ))}
        <a
          href="#kontakt"
          onClick={() => setOpen(false)}
          className="mt-4 rounded-full border border-champagne px-8 py-3 text-xs uppercase tracking-[0.2em] text-champagne"
        >
          Termin buchen
        </a>
      </div>
    </header>
  );
}
