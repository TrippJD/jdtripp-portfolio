"use client";

import { useLenis } from "lenis/react";
import { useEffect, useRef } from "react";

/**
 * A small instrument panel with real readings from the page: scroll
 * velocity, how far down the page you are, and the frame rate. Values are
 * written straight to the DOM so updating them never re-renders React.
 */
export function LiveTelemetry() {
  const panel = useRef<HTMLDivElement>(null);
  const velocity = useRef<HTMLElement>(null);
  const velocityBar = useRef<HTMLElement>(null);
  const progress = useRef<HTMLElement>(null);
  const fps = useRef<HTMLElement>(null);

  useLenis((lenis) => {
    if (velocity.current) velocity.current.textContent = lenis.velocity.toFixed(1);
    if (velocityBar.current) {
      const amount = Math.min(Math.abs(lenis.velocity) / 40, 1);
      velocityBar.current.style.transform = `scaleX(${amount})`;
    }
  });

  useEffect(() => {
    // Scroll progress works with or without smooth scrolling.
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current && max > 0) {
        progress.current.textContent = ((window.scrollY / max) * 100).toFixed(1);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Frame rate, measured only while the panel is on screen.
    let frames = 0;
    let since = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      frames += 1;
      if (now - since >= 500) {
        if (fps.current)
          fps.current.textContent = String(Math.round((frames * 1000) / (now - since)));
        frames = 0;
        since = now;
      }
      raf = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) {
        frames = 0;
        since = performance.now();
        raf = requestAnimationFrame(tick);
      }
    });
    if (panel.current) observer.observe(panel.current);

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const row = "flex items-baseline justify-between gap-6 border-t border-line py-3";

  return (
    <div
      ref={panel}
      className="rounded-2xl border border-line bg-space-2/80 p-6 font-mono text-xs tracking-[0.15em] uppercase backdrop-blur"
    >
      <div className="flex items-center justify-between pb-4">
        <span className="text-signal">Live telemetry</span>
        <span className="flex items-center gap-2 text-haze">
          <span
            className="size-2 rounded-full bg-flare motion-safe:animate-pulse"
            aria-hidden="true"
          />
          Recording
        </span>
      </div>

      <div className={row}>
        <span className="text-haze">Scroll velocity</span>
        <span>
          <span ref={velocity} className="text-base text-paper tabular-nums">
            0.0
          </span>{" "}
          px/f
        </span>
      </div>
      <span className="mb-3 block h-px bg-line" aria-hidden="true">
        <span
          ref={velocityBar}
          className="block h-full origin-left bg-signal"
          style={{ transform: "scaleX(0)" }}
        />
      </span>

      <div className={row}>
        <span className="text-haze">Page progress</span>
        <span>
          <span ref={progress} className="text-base text-paper tabular-nums">
            0.0
          </span>{" "}
          %
        </span>
      </div>

      <div className={row}>
        <span className="text-haze">Frame rate</span>
        <span>
          <span ref={fps} className="text-base text-paper tabular-nums">
            --
          </span>{" "}
          fps
        </span>
      </div>

      <p className="border-t border-line pt-4 leading-relaxed tracking-normal text-haze normal-case">
        Real readings from this page. Scroll fast and watch them move.
      </p>
    </div>
  );
}
