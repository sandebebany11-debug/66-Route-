"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

type Props = {
  children: string;
  as?: "div" | "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  splitBy?: "words" | "chars";
  start?: string;
};

export default function RevealText({
  children,
  as: Tag = "div",
  className = "",
  splitBy = "words",
  start = "top 85%",
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll("[data-reveal-piece]");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          stagger: splitBy === "chars" ? 0.015 : 0.06,
          ease: "power4.out",
          scrollTrigger: {
            trigger: el,
            start,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [splitBy, start]);

  const pieces = splitBy === "chars" ? children.split("") : children.split(" ");

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        ref.current = node;
      }}
      className={className}
    >
      {pieces.map((piece, i) => (
        <span key={i} className="inline-block overflow-hidden align-top">
          <span data-reveal-piece className="inline-block will-change-transform">
            {piece === " " ? " " : piece}
            {splitBy === "words" && i < pieces.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
