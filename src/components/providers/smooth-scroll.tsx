"use client";

import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

/** Keeps ScrollTrigger's positions in step with Lenis's smoothed scroll. */
function ScrollTriggerSync() {
  useLenis(ScrollTrigger.update);
  return null;
}

/**
 * Smooth scrolling via Lenis, driven by GSAP's ticker so scroll and
 * animations share one frame loop. Turned off for visitors who ask
 * their OS for reduced motion.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reducedMotion = usePrefersReducedMotion();
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, [reducedMotion]);

  if (reducedMotion) return children;

  return (
    <ReactLenis root options={{ autoRaf: false, anchors: true }} ref={lenisRef}>
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
