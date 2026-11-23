"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Temporary demo: pins the section and lights up the statement word by word
 * as you scroll. Proves GSAP, SplitText, ScrollTrigger and Lenis work together.
 */
export function PinnedStatement() {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        SplitText.create("[data-statement]", {
          type: "words",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.words, {
              opacity: 0.12,
              stagger: 0.15,
              ease: "none",
              scrollTrigger: {
                trigger: section.current,
                start: "top top",
                end: "+=150%",
                pin: true,
                scrub: true,
              },
            }),
        });
      });
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      className="flex min-h-svh flex-col items-center justify-center px-6 text-center"
    >
      <p className="mb-6 eyebrow">[ Pinned scroll demo ]</p>
      <p
        data-statement
        className="max-w-5xl text-5xl leading-[1.05] font-bold tracking-tight text-balance md:text-7xl"
      >
        I build the whole thing, from the first pixel to the last{" "}
        <span className="text-signal">database row.</span>
      </p>
    </section>
  );
}
