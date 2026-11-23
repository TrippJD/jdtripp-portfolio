"use client";

import { useRef } from "react";
import { statement } from "@/content/site";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Section 2: the section pins while the statement lights up word by word
 * as you scroll, then the footnote tags slide in.
 */
export function Statement() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        SplitText.create("[data-statement]", {
          type: "words",
          autoSplit: true,
          onSplit: (self) =>
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: root.current,
                  start: "top top",
                  end: "+=160%",
                  pin: true,
                  scrub: true,
                },
              })
              .from(self.words, { opacity: 0.12, stagger: 0.12, ease: "none" })
              .from(
                "[data-footnote]",
                { autoAlpha: 0, y: 16, stagger: 0.15, ease: "none" },
                ">-0.2",
              )
              .to({}, { duration: 0.4 }), // hold the finished statement briefly before unpinning
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="statement-heading"
      className="flex min-h-svh flex-col justify-center px-6"
    >
      <div className="mx-auto w-full max-w-6xl">
        <p className="eyebrow">[ {statement.eyebrow} ]</p>
        <h2
          id="statement-heading"
          data-statement
          className="mt-8 text-4xl leading-[1.08] font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {statement.segments.map((segment) =>
            "accent" in segment ? (
              <span key={segment.text} className="text-signal">
                {segment.text}
              </span>
            ) : (
              <span key={segment.text}>{segment.text} </span>
            ),
          )}
        </h2>
        <ul className="mt-12 flex flex-wrap gap-3">
          {statement.footnote.map((tag) => (
            <li
              key={tag}
              data-footnote
              className="rounded-full border border-line px-4 py-2 font-mono text-xs tracking-[0.15em] text-haze uppercase"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
