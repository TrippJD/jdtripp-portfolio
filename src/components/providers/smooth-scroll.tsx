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
  const lenis = useLenis(ScrollTrigger.update);

  // Pinned sections change the page height when ScrollTrigger recalculates.
  // Re-measure Lenis then too, so anchor links never stop at a stale limit.
  // Deferred a frame: resizing mid-refresh fires a scroll update while
  // ScrollTrigger is still building its triggers, which crashes it.
  useEffect(() => {
    if (!lenis) return;
    let frame = 0;
    const onRefresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => lenis.resize());
    };
    ScrollTrigger.addEventListener("refresh", onRefresh);
    return () => {
      cancelAnimationFrame(frame);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
    };
  }, [lenis]);

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

  // Arriving on a link like /#about: the browser jumps before the pinned
  // sections add their height, so it lands too early. Once fonts are in and
  // the scroll animations have measured the page, jump to the target again.
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.length < 2) return;

    let cancelled = false;
    document.fonts.ready.then(() =>
      requestAnimationFrame(() => {
        if (cancelled) return;
        ScrollTrigger.refresh();
        const target = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (!target) return;
        const lenis = lenisRef.current?.lenis;
        if (lenis) {
          lenis.resize();
          lenis.scrollTo(target, { immediate: true, force: true });
        } else {
          target.scrollIntoView();
        }
      }),
    );
    return () => {
      cancelled = true;
    };
  }, []);

  if (reducedMotion) return children;

  return (
    <ReactLenis root options={{ autoRaf: false, anchors: true }} ref={lenisRef}>
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
