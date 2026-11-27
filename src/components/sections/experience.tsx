"use client";

import { useRef } from "react";
import { experience, type Leg } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { Brackets } from "@/components/brackets";

// Layout switch: on large screens (with motion allowed) the legs sit in one
// long row that scrolls sideways while the section is pinned. Everywhere else
// they stack vertically along a flight path on the left.
const WIDE = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

const totalLegs = experience.legs.length + 1; // + the "next leg" card

function legNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

/** Waypoint on the flight path. Turns solid blue once the route reaches it. */
function Waypoint({ current }: { current?: boolean }) {
  return (
    <span
      data-waypoint
      aria-hidden="true"
      className="absolute top-8 -left-[27px] grid size-3 place-items-center rounded-full border-2 border-signal bg-space transition-colors duration-500 lg:motion-safe:-top-12 lg:motion-safe:left-0 [&.is-active]:bg-signal"
    >
      {current && (
        <span className="absolute size-6 rounded-full border border-flare motion-safe:animate-ping" />
      )}
    </span>
  );
}

function LegCard({ leg, index }: { leg: Leg; index: number }) {
  return (
    <li data-leg className="relative lg:motion-safe:w-[32rem] lg:motion-safe:shrink-0">
      <Waypoint current={leg.current} />
      <article
        className={`flex h-full flex-col rounded-2xl border bg-space-2/80 p-7 backdrop-blur md:p-8 ${
          leg.current ? "border-signal/60" : "border-line"
        }`}
      >
        <header className="flex items-center justify-between gap-4 font-mono text-xs tracking-[0.15em] uppercase">
          <span className="text-signal">Leg {legNumber(index)}</span>
          <span className="flex items-center gap-3 text-haze">
            {leg.dates}
            {leg.current && (
              <span className="rounded-full bg-flare px-2 py-0.5 font-bold text-space">Now</span>
            )}
          </span>
        </header>

        <h3 className="mt-6 text-3xl font-bold tracking-tight md:text-4xl">
          {leg.url ? (
            <a
              href={leg.url}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-signal"
            >
              {leg.company}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            leg.company
          )}
        </h3>
        <p className="mt-2 text-lg font-medium text-signal">{leg.title}</p>
        <p className="mt-1 font-mono text-xs tracking-[0.15em] text-haze uppercase">
          {leg.location}
        </p>

        <ul className="mt-6 space-y-3 text-haze">
          {leg.highlights.map((item) => (
            <li key={item} className="flex gap-3 leading-relaxed">
              <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-signal" />
              {item}
            </li>
          ))}
        </ul>

        <ul className="mt-auto flex flex-wrap gap-2 pt-8">
          {leg.tech.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-line px-3 py-1 font-mono text-[0.7rem] tracking-wider text-haze uppercase"
            >
              {tag}
            </li>
          ))}
        </ul>
      </article>
    </li>
  );
}

/** Section 4: the career timeline, told as a flight route. */
export function Experience() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const legReadout = useRef<HTMLSpanElement>(null);
  const progressBar = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Wide screens: pin the section and scroll the legs sideways.
      mm.add(WIDE, () => {
        const trackEl = track.current!;
        const distance = () => trackEl.scrollWidth - document.documentElement.clientWidth;

        const horizontal = gsap.to(trackEl, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const leg = Math.min(totalLegs, Math.floor(self.progress * totalLegs) + 1);
              if (legReadout.current) legReadout.current.textContent = legNumber(leg - 1);
              gsap.set(progressBar.current, { scaleX: self.progress });
            },
          },
        });

        // Light up each waypoint as it crosses the middle of the screen.
        gsap.utils.toArray<HTMLElement>("[data-waypoint]").forEach((dot) => {
          ScrollTrigger.create({
            trigger: dot,
            containerAnimation: horizontal,
            start: "left 60%",
            toggleClass: "is-active",
          });
        });
      });

      // Narrow screens: plain vertical scroll; waypoints light as you pass them.
      mm.add(`not all and ${WIDE}`, () => {
        gsap.utils.toArray<HTMLElement>("[data-waypoint]").forEach((dot) => {
          ScrollTrigger.create({ trigger: dot, start: "top 65%", toggleClass: "is-active" });
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="experience"
      aria-labelledby="experience-heading"
      className="relative py-24 lg:motion-safe:flex lg:motion-safe:h-svh lg:motion-safe:flex-col lg:motion-safe:justify-center lg:motion-safe:overflow-hidden lg:motion-safe:py-0"
    >
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">
              <Brackets>{experience.eyebrow}</Brackets>
            </p>
            <h2
              id="experience-heading"
              className="mt-6 text-3xl font-bold tracking-tight md:text-5xl"
            >
              {experience.heading}
            </h2>
            <p className="mt-4 max-w-xl text-lg text-haze">{experience.intro}</p>
          </div>

          {/* Instrument readout, only shown with the sideways layout. */}
          <div
            aria-hidden="true"
            className="hidden w-56 font-mono text-xs tracking-[0.15em] text-haze uppercase lg:motion-safe:block"
          >
            <div className="flex justify-between">
              <span>Leg</span>
              <span>
                <span ref={legReadout} className="text-paper">
                  01
                </span>{" "}
                / {legNumber(totalLegs - 1)}
              </span>
            </div>
            <span className="mt-3 block h-px bg-line">
              <span
                ref={progressBar}
                style={{ transform: "scaleX(0)" }}
                className="block h-full origin-left bg-signal"
              />
            </span>
          </div>
        </div>
      </div>

      <ol
        ref={track}
        className="relative mx-auto mt-14 flex max-w-3xl flex-col gap-6 pr-6 pl-14 lg:motion-safe:mx-0 lg:motion-safe:mt-20 lg:motion-safe:w-max lg:motion-safe:max-w-none lg:motion-safe:flex-row lg:motion-safe:items-stretch lg:motion-safe:gap-8 lg:motion-safe:pr-[20vw] lg:motion-safe:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]"
      >
        {/* The flight path: vertical on the left when stacked, horizontal above the cards when wide. */}
        <span
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-[calc(3.5rem-22px)] w-px bg-linear-to-b from-line via-line to-transparent lg:motion-safe:top-[-2.6rem] lg:motion-safe:right-0 lg:motion-safe:bottom-auto lg:motion-safe:left-0 lg:motion-safe:h-px lg:motion-safe:w-auto lg:motion-safe:bg-linear-to-r"
        />

        {experience.legs.map((leg, index) => (
          <LegCard key={leg.company} leg={leg} index={index} />
        ))}

        {/* Final leg: an invitation instead of a job. */}
        <li data-leg className="relative lg:motion-safe:w-[26rem] lg:motion-safe:shrink-0">
          <Waypoint />
          <a
            href="#contact"
            className="group flex h-full min-h-64 flex-col justify-between rounded-2xl border border-dashed border-line p-7 transition-colors hover:border-signal md:p-8"
          >
            <span className="font-mono text-xs tracking-[0.15em] text-signal uppercase">
              Leg {legNumber(experience.legs.length)} · {experience.next.label}
            </span>
            <span>
              <span className="block text-4xl font-bold tracking-tight md:text-5xl">
                {experience.next.heading}
              </span>
              <span className="mt-4 inline-flex items-center gap-2 text-lg font-medium text-signal">
                {experience.next.cta}
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </span>
          </a>
        </li>
      </ol>
    </section>
  );
}
