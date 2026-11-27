"use client";

import { useRef } from "react";
import { build } from "@/content/site";
import { gsap, PLAY_ONCE, useGSAP } from "@/lib/gsap";
import { LiveTelemetry } from "./live-telemetry";
import { Brackets } from "@/components/brackets";

/** Section 6: how this site was built, with live readings from the page. */
export function BuildNotes() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-feature]").forEach((card) => {
          gsap.from(card, {
            autoAlpha: 0,
            y: 40,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%", toggleActions: PLAY_ONCE },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="build"
      aria-labelledby="build-heading"
      className="border-t border-line py-32 md:py-40"
    >
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* Left column stays in view while the feature cards scroll past. */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">
            <Brackets>{build.eyebrow}</Brackets>
          </p>
          <h2 id="build-heading" className="mt-6 text-3xl font-bold tracking-tight md:text-5xl">
            {build.heading}
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-haze">{build.intro}</p>

          <div className="mt-10">
            <LiveTelemetry />
          </div>

          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Built with">
            {build.stack.map((item) => (
              <li
                key={item}
                className="rounded-full border border-line px-3 py-1 font-mono text-[0.7rem] tracking-wider text-paper uppercase"
              >
                {item}
              </li>
            ))}
          </ul>

          <a
            href={build.repo}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 font-medium transition-colors hover:border-signal hover:text-signal"
          >
            View the source on GitHub
            <span aria-hidden="true">↗</span>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>

        <ol className="grid gap-6 sm:grid-cols-2">
          {build.features.map((feature, index) => (
            <li
              key={feature.title}
              data-feature
              className="group flex flex-col rounded-2xl border border-line bg-space-2/60 p-7 transition-colors hover:border-signal/60"
            >
              <span className="font-mono text-xs tracking-[0.15em] text-signal uppercase">
                Sys {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-2xl font-bold tracking-tight">{feature.title}</h3>
              <p className="mt-3 leading-relaxed text-haze">{feature.body}</p>
              <span className="mt-auto pt-6 font-mono text-[0.7rem] tracking-wider text-haze uppercase transition-colors group-hover:text-paper">
                {feature.tag}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
