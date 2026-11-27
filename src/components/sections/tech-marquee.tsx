"use client";

import { useLenis } from "lenis/react";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Endless strip of tech names. It drifts on its own, speeds up while you
 * scroll, and runs backwards when you scroll up. Static for reduced motion.
 */
export function TechMarquee({ items }: { items: readonly string[] }) {
  const root = useRef<HTMLDivElement>(null);
  const loop = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The row holds the list twice, so sliding it by half loops seamlessly.
        const tween = gsap.to("[data-marquee-row]", {
          xPercent: -50,
          duration: 40,
          ease: "none",
          repeat: -1,
          // Played backwards (scrolling up), jump far ahead so it never runs out.
          onReverseComplete: () => {
            tween.totalTime(tween.rawTime() + tween.duration() * 100);
          },
        });
        loop.current = tween;
        return () => {
          loop.current = null;
        };
      });
    },
    { scope: root },
  );

  useLenis((lenis) => {
    const tween = loop.current;
    if (!tween) return;
    const direction = lenis.velocity < 0 ? -1 : 1;
    const speed = 1 + Math.min(Math.abs(lenis.velocity) * 0.25, 8);
    gsap.to(tween, { timeScale: speed * direction, duration: 0.3, overwrite: true });
    // Ease back to normal drift once scrolling stops.
    gsap.to(tween, { timeScale: direction, duration: 1.2, delay: 0.3, ease: "power2.out" });
  });

  const list = (copy: number) => (
    <ul
      aria-hidden={copy > 0 || undefined}
      className="flex shrink-0 items-center gap-10 pr-10 motion-reduce:flex-wrap motion-reduce:justify-center"
    >
      {items.map((item) => (
        <li key={item} className="flex items-center gap-10">
          <span className="text-3xl font-bold tracking-tight whitespace-nowrap text-haze md:text-5xl">
            {item}
          </span>
          <span aria-hidden="true" className="text-flare">
            ✦
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      ref={root}
      className="mt-24 overflow-hidden border-y border-line [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] py-8 motion-reduce:[mask-image:none]"
    >
      <h3 className="sr-only">Tools I work with</h3>
      <div data-marquee-row className="flex w-max motion-reduce:w-auto">
        {list(0)}
        <div className="contents motion-reduce:hidden">{list(1)}</div>
      </div>
    </div>
  );
}
