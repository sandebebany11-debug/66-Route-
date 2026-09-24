"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether an <img> failed to load. A same-tick 404 (e.g. a local
 * placeholder path) can resolve before React hydrates and attaches the
 * onError listener, so we also check `complete`/`naturalWidth` on mount.
 */
export function useImageFallback() {
  const [broken, setBroken] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setBroken(true);
    }
  }, []);

  return { ref, broken, onError: () => setBroken(true) };
}
