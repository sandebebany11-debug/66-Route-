"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const enabled = useMediaQuery("(hover: hover) and (pointer: fine)");

  useEffect(() => {
    if (!enabled) return;

    const pos = { x: 0, y: 0 };
    const dot = dotRef.current;
    if (!dot) return;

    const move = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;

      const target = e.target as HTMLElement;
      const cursorEl = target.closest<HTMLElement>("[data-cursor]");
      setLabel(cursorEl?.dataset.cursor ?? "");
    };

    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden md:flex h-14 w-14 items-center justify-center rounded-full border border-champagne/70 bg-ink/40 text-[10px] uppercase tracking-[0.2em] text-champagne-light backdrop-blur-sm transition-[width,height,opacity] duration-200 ease-out"
      style={{
        width: label ? "5.5rem" : "0.5rem",
        height: label ? "5.5rem" : "0.5rem",
        opacity: label ? 1 : 0.6,
        borderWidth: label ? 1 : 0,
        background: label ? undefined : "var(--color-champagne)",
      }}
    >
      {label}
    </div>
  );
}
