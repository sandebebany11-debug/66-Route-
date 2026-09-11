"use client";

import { useImageFallback } from "@/lib/useImageFallback";

type Props = {
  src: string;
  alt: string;
  className?: string;
  cursorLabel?: string;
};

/** Image slot with a tasteful abstract fallback until the real photo is dropped into /public/images. */
export default function ImagePlate({ src, alt, className = "", cursorLabel = "VIEW" }: Props) {
  const { ref, broken, onError } = useImageFallback();

  return (
    <div
      data-cursor={cursorLabel}
      className={`relative overflow-hidden bg-graphite ${className}`}
    >
      {!broken ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={ref}
          src={src}
          alt={alt}
          onError={onError}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="relative flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,var(--color-graphite),var(--color-ink-soft)_60%,var(--color-ink))]">
          <div className="absolute inset-6 border border-champagne/20" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-champagne/40">
            {alt}
          </span>
        </div>
      )}
    </div>
  );
}
