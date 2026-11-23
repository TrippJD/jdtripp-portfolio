"use client";

import { useRef, type CSSProperties } from "react";
import { stats } from "@/content/site";
import { gsap, useGSAP } from "@/lib/gsap";

// Each digit is a strip of 0-9 twice. Its resting position (--d) is the
// target digit in the second run, so animating --d up from 0 rolls the
// strip through one full turn before landing, like an instrument dial.
const STRIP = [...Array(20)].map((_, i) => i % 10);

function RollingNumber({ value }: { value: string }) {
  return (
    <span className="inline-flex" aria-hidden="true">
      {value.split("").map((char, i) => (
        <span key={i} className="inline-block h-[1em] overflow-hidden leading-none">
          <span
            data-strip
            data-target={Number(char) + 10}
            style={{ "--d": Number(char) + 10 } as CSSProperties}
            className="flex translate-y-[calc(var(--d)*-5%)] flex-col"
          >
            {STRIP.map((digit, j) => (
              <span key={j} className="block h-[1em]">
                {digit}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

/** Section 3: resume numbers that roll into place when they scroll into view. */
export function Stats() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-stat]");
        items.forEach((item, index) => {
          const tl = gsap.timeline({
            delay: index * 0.12,
            // Each stat starts when it scrolls in, so stacked stats on mobile roll on arrival.
            scrollTrigger: { trigger: item, start: "top 85%", once: true },
          });
          tl.from(item.querySelectorAll("[data-rule]"), {
            scaleX: 0,
            transformOrigin: "left",
            duration: 0.8,
            ease: "expo.out",
          })
            .fromTo(
              item.querySelectorAll<HTMLElement>("[data-strip]"),
              { "--d": 0 },
              {
                // Explicit end values: reading them back from the DOM is unreliable
                // when the effect re-runs (e.g. React strict mode in dev).
                "--d": (_: number, el: HTMLElement) => Number(el.dataset.target),
                duration: 1.8,
                stagger: 0.1,
                ease: "power3.out",
              },
              0,
            )
            .from(
              item.querySelectorAll("[data-fade]"),
              { autoAlpha: 0, y: 12, duration: 0.8, stagger: 0.08, ease: "power2.out" },
              0.3,
            );
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="stats-heading" className="px-6 py-32 md:py-40">
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow">[ {stats.eyebrow} ]</p>
        <h2 id="stats-heading" className="mt-6 text-3xl font-bold tracking-tight md:text-5xl">
          {stats.heading}
        </h2>

        <ul className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {stats.items.map((item, index) => (
            <li key={item.label} data-stat className="relative pt-6">
              <span data-rule className="absolute inset-x-0 top-0 h-px bg-line" />
              <span
                data-rule
                className="absolute top-0 left-0 h-px w-12 bg-signal"
                aria-hidden="true"
              />
              <p data-fade className="font-mono text-xs text-haze" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-4 flex items-start text-7xl font-bold tracking-tighter md:text-8xl">
                <span className="sr-only">
                  {item.value}
                  {"suffix" in item ? item.suffix : ""}
                </span>
                <RollingNumber value={item.value} />
                {"suffix" in item && (
                  <span aria-hidden="true" className="ml-1 text-[0.5em] text-signal">
                    {item.suffix}
                  </span>
                )}
              </p>
              <p data-fade className="mt-4 text-lg font-medium">
                {item.label}
              </p>
              <p data-fade className="mt-1 text-sm leading-relaxed text-haze">
                {item.detail}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
