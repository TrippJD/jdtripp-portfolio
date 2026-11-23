"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { LocalClock } from "./local-clock";
import { Starfield } from "./starfield";

const readouts = [
  { label: "Lat", value: site.location.lat },
  { label: "Lon", value: site.location.lon },
  { label: "Alt", value: site.location.altitude },
] as const;

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Reduced motion: just show everything.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-intro]", { autoAlpha: 1 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set("[data-intro]", { autoAlpha: 1 });

        // Launch sequence on load.
        const split = SplitText.create("[data-name]", { type: "chars", mask: "chars" });
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from("[data-starfield]", { autoAlpha: 0, duration: 2, ease: "power1.out" }, 0)
          .from("[data-eyebrow]", { autoAlpha: 0, y: 12, duration: 0.8 }, 0.1)
          .from(split.chars, { yPercent: 110, duration: 1.2, stagger: 0.045 }, 0.2)
          .from("[data-fade]", { autoAlpha: 0, y: 24, duration: 1, stagger: 0.1 }, 0.7)
          .from("[data-readout]", { autoAlpha: 0, x: 16, duration: 0.8, stagger: 0.08 }, 0.9);

        // Leaving the hero: the name lifts off and fades as you scroll.
        gsap
          .timeline({
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          })
          .to("[data-name]", { yPercent: -35, ease: "none" }, 0)
          .to("[data-exit]", { autoAlpha: 0, y: -40, ease: "none" }, 0);
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden"
    >
      <noscript>
        <style>{"[data-intro]{visibility:visible!important}"}</style>
      </noscript>

      {/* Background: stars, a faint instrument grid, and a glow from below. */}
      <div data-starfield className="absolute inset-0 -z-10">
        <Starfield className="size-full" />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-line)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)] bg-[size:72px_72px] opacity-40"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-[radial-gradient(ellipse_at_bottom,rgba(61,123,255,0.18),transparent_70%)]"
      />
      {/* Fade the background out so the hero blends into the next section. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-b from-transparent to-space"
      />

      <div
        data-intro
        className="invisible mx-auto grid w-full max-w-7xl gap-12 px-6 pt-32 pb-12 md:pb-16 lg:grid-cols-[1fr_auto] lg:items-end"
      >
        <div>
          <div data-exit>
            <p data-eyebrow className="eyebrow">
              [ Flight log 001 · {site.location.city} ]
            </p>
          </div>

          <h1 className="mt-6 text-[clamp(4.5rem,17vw,15rem)] leading-[0.85] font-bold tracking-tighter">
            <span data-name className="block">
              {site.name.first}
            </span>
            <span data-name className="block text-signal">
              {site.name.last}
            </span>
          </h1>

          <div data-exit className="mt-8 max-w-xl">
            <p data-fade className="text-xl font-medium md:text-2xl">
              {site.role}
              <span
                aria-hidden="true"
                className="ml-2 inline-block size-2.5 rounded-full bg-flare align-middle motion-safe:animate-pulse"
              />
            </p>
            <p data-fade className="mt-3 text-lg leading-relaxed text-haze">
              {site.summary}
            </p>
            <div data-fade className="mt-8 flex flex-wrap gap-3">
              <a
                href="#experience"
                className="rounded-full bg-signal px-6 py-3 font-medium text-space transition-colors hover:bg-paper"
              >
                View the flight log
              </a>
              <a
                href="#contact"
                className="rounded-full border border-line px-6 py-3 font-medium transition-colors hover:border-paper"
              >
                Get in touch
              </a>
            </div>
          </div>
        </div>

        <dl
          data-exit
          className="hidden min-w-56 space-y-3 border-l border-line pl-6 font-mono text-xs tracking-[0.15em] uppercase lg:block"
        >
          {readouts.map((item) => (
            <div key={item.label} data-readout className="flex justify-between gap-6">
              <dt className="text-haze">{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
          <div data-readout className="flex justify-between gap-6">
            <dt className="text-haze">Local</dt>
            <dd>
              <LocalClock timeZone={site.location.timeZone} />
            </dd>
          </div>
          <div data-readout className="flex justify-between gap-6 border-t border-line pt-3">
            <dt className="text-haze">Now</dt>
            <dd className="text-signal">
              {site.current.title} @ {site.current.company}
            </dd>
          </div>
        </dl>
      </div>

      <div
        data-exit
        aria-hidden="true"
        className="mx-auto flex w-full max-w-7xl items-center gap-4 px-6 pb-8 font-mono text-xs tracking-[0.2em] text-haze uppercase"
      >
        <span className="relative block h-10 w-px overflow-hidden bg-line">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-signal motion-safe:animate-scroll-cue" />
        </span>
        Scroll to launch
      </div>
    </section>
  );
}
