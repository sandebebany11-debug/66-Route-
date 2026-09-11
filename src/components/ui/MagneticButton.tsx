"use client";

import { useRef } from "react";
import type { MouseEvent, ReactNode } from "react";
import { gsap } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  cursorLabel?: string;
};

export default function MagneticButton({
  children,
  href,
  onClick,
  className = "",
  cursorLabel,
}: Props) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null);

  const handleMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    gsap.to(el, {
      x: relX * 0.35,
      y: relY * 0.35,
      duration: 0.5,
      ease: "power3.out",
    });
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
  };

  const base =
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border border-champagne/60 px-7 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-paper transition-colors duration-300 hover:border-champagne";

  const content = (
    <>
      <span className="absolute inset-0 -z-10 origin-left scale-x-0 bg-champagne transition-transform duration-500 ease-out group-hover:scale-x-100" />
      <span className="transition-colors duration-300 group-hover:text-ink">
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        data-cursor={cursorLabel}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className={`${base} ${className}`}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      onClick={onClick}
      data-cursor={cursorLabel}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`${base} ${className}`}
    >
      {content}
    </button>
  );
}
