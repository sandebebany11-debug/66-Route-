"use client";

import type { TeamMember } from "@/data/content";
import { useImageFallback } from "@/lib/useImageFallback";

export default function TeamPortrait({ member }: { member: TeamMember }) {
  const { ref, broken, onError } = useImageFallback();
  const initial = member.name.trim().charAt(0);

  return (
    <div
      data-cursor="MEET"
      className="group relative aspect-[3/4] w-full overflow-hidden bg-graphite"
    >
      {!broken ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={ref}
          src={member.image}
          alt={member.name}
          onError={onError}
          className="h-full w-full object-cover grayscale-[15%] transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center border border-line bg-gradient-to-br from-graphite via-ink-soft to-ink">
          <span className="font-display text-[7rem] font-light text-champagne/20 transition-colors duration-500 group-hover:text-champagne/35">
            {initial}
          </span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />

      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="font-display text-xl text-paper">{member.name}</h3>
        <p className="text-[11px] uppercase tracking-[0.18em] text-champagne-light/85">
          {member.role}
        </p>
        {member.bio && (
          <p className="mt-2 max-h-0 overflow-hidden text-xs leading-relaxed text-paper/70 opacity-0 transition-all duration-500 ease-out group-hover:mt-3 group-hover:max-h-24 group-hover:opacity-100">
            {member.bio}
          </p>
        )}
      </div>
    </div>
  );
}
