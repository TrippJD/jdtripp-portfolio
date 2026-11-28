"use client";

import { useRef } from "react";
import { launch } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { Brackets } from "@/components/brackets";
import { Sky } from "@/components/launch/art";
import { scenes } from "@/components/launch/scenes";

// Three ways to show the story:
//  · STAGE (tablet and up, motion allowed): the section pins and every scene plays in one
//    frame, one after another, with the scroll as the playhead.
//  · STRIP (phones, motion allowed): the frames stack, and each plays as it scrolls past.
//  · Reduced motion or no JavaScript: the frames stack as stills, each at its key moment.
const STAGE = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";
const STRIP = "(max-width: 767px) and (prefers-reduced-motion: no-preference)";

const FADE = 0.12; // crossfade between scenes, in timeline seconds
const HOLD = 0.2; // pause on each finished scene before the next one fades in
const SCROLL_PER_SCENE = 90; // % of the viewport height

const sceneNumber = (index: number) => String(index + 1).padStart(2, "0");

/** Section 3: "Launch day", shipping software told as a rocket launch. */
export function Launch() {
  const root = useRef<HTMLElement>(null);
  const progressBar = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-scene]");
      const mm = gsap.matchMedia();

      mm.add(STAGE, () => {
        const master = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: `+=${items.length * SCROLL_PER_SCENE}%`,
            pin: true,
            scrub: 0.6,
            onUpdate: (self) => gsap.set(progressBar.current, { scaleX: self.progress }),
          },
        });
        // Hide every scene but the first up front, so each fade-in has a known starting point.
        gsap.set(items.slice(1), { autoAlpha: 0 });
        items.forEach((item, i) => {
          const at = master.duration();
          if (i > 0) {
            // Every frame has an opaque sky, so the next scene can simply fade in on top.
            master.to(item, { autoAlpha: 1, duration: FADE }, at);
            master.set(items[i - 1], { autoAlpha: 0 }, at + FADE);
          }
          master.add(scenes[i].animate(gsap.utils.selector(item)), at);
          master.to({}, { duration: HOLD });
        });
      });

      mm.add(STRIP, () => {
        items.forEach((item, i) => {
          ScrollTrigger.create({
            trigger: item,
            start: "top 85%",
            end: "bottom 40%",
            scrub: 0.6,
            animation: scenes[i].animate(gsap.utils.selector(item)),
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="launch"
      aria-labelledby="launch-heading"
      className="relative py-24 md:motion-safe:h-svh md:motion-safe:overflow-hidden md:motion-safe:py-0"
    >
      {/* Without JavaScript the stage can't play, so fall back to the stack of stills. */}
      <noscript>
        <style>
          {
            "#launch{height:auto!important;padding:6rem 0!important}#launch [data-scene]{position:static!important;visibility:visible!important}#launch [data-stage-only]{display:none!important}"
          }
        </style>
      </noscript>

      <div className="mx-auto max-w-6xl px-6 md:motion-safe:pointer-events-none md:motion-safe:absolute md:motion-safe:inset-x-0 md:motion-safe:top-24 md:motion-safe:z-10 md:motion-safe:max-w-none md:motion-safe:px-8">
        <h2 id="launch-heading" className="eyebrow">
          <Brackets>{launch.eyebrow}</Brackets>
          <span className="sr-only">: {launch.heading}</span>
        </h2>
      </div>

      <ol className="mx-auto mt-10 max-w-6xl space-y-16 px-6 md:motion-safe:relative md:motion-safe:mt-0 md:motion-safe:h-full md:motion-safe:max-w-none md:motion-safe:space-y-0 md:motion-safe:px-0">
        {scenes.map((scene, i) => {
          const copy = launch.scenes[i];
          return (
            <li
              key={scene.id}
              data-scene
              className={`md:motion-safe:absolute md:motion-safe:inset-0 ${i > 0 ? "md:motion-safe:invisible" : ""}`}
            >
              <figure className="md:motion-safe:h-full">
                <figcaption className="font-mono text-xs tracking-[0.2em] text-haze uppercase md:motion-safe:absolute md:motion-safe:top-32 md:motion-safe:left-8 md:motion-safe:z-10">
                  <span className="text-paper">{sceneNumber(i)}</span> /{" "}
                  {sceneNumber(scenes.length - 1)}
                  <span className="ml-3 text-signal">{copy.label}</span>
                </figcaption>
                <svg
                  viewBox="0 0 1600 900"
                  role="img"
                  aria-label={copy.description}
                  className="mt-4 block h-auto w-full md:motion-safe:mt-0 md:motion-safe:h-full"
                >
                  <Sky seed={scene.seed} streak={scene.streak} count={scene.streak ? 110 : 80} />
                  <scene.Art />
                </svg>
              </figure>
            </li>
          );
        })}
      </ol>

      {/* Fade the stage's bottom edge into the page, as the hero does. */}
      <div
        data-stage-only
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-28 bg-linear-to-t from-space to-transparent md:motion-safe:block"
      />

      {/* Progress through the story, only on the pinned stage. */}
      <span
        data-stage-only
        aria-hidden="true"
        className="absolute inset-x-8 bottom-8 hidden h-px bg-line md:motion-safe:block"
      >
        <span
          ref={progressBar}
          style={{ transform: "scaleX(0)" }}
          className="block h-full origin-left bg-signal"
        />
      </span>
    </section>
  );
}
