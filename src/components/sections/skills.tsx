"use client";

import { useRef } from "react";
import { skills } from "@/content/site";
import { gsap, PLAY_ONCE, useGSAP } from "@/lib/gsap";
import { TechMarquee } from "./tech-marquee";
import { Brackets } from "@/components/brackets";

/**
 * Section 6: big skill rows. On devices with a mouse, each row's details stay
 * folded until you hover or focus it; on touch screens they're always open.
 */
export function Skills() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-skill]", {
          autoAlpha: 0,
          y: 40,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-skill-list]",
            start: "top 80%",
            toggleActions: PLAY_ONCE,
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="skills" aria-labelledby="skills-heading" className="py-32 md:py-40">
      <div className="mx-auto max-w-7xl px-6">
        <p className="eyebrow">
          <Brackets>{skills.eyebrow}</Brackets>
        </p>
        <h2 id="skills-heading" className="mt-6 text-3xl font-bold tracking-tight md:text-5xl">
          {skills.heading}
        </h2>

        <ul data-skill-list className="mt-16 border-b border-line">
          {skills.items.map((skill, index) => (
            <li
              key={skill.title}
              data-skill
              tabIndex={0}
              className="group relative border-t border-line py-8 outline-none focus-visible:bg-space-2 md:py-10"
            >
              {/* Accent line that sweeps across the top border on hover. */}
              <span
                aria-hidden="true"
                className="absolute -top-px left-0 h-px w-full origin-left scale-x-0 bg-signal transition-transform duration-700 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />

              <div className="grid gap-4 md:grid-cols-[4rem_1fr_auto] md:items-baseline">
                <span className="font-mono text-xs text-haze">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-4xl font-bold tracking-tight transition-[color,translate] duration-500 group-hover:translate-x-3 group-hover:text-signal group-focus-visible:text-signal md:text-6xl lg:text-7xl">
                  {skill.title}
                </h3>
                <span
                  aria-hidden="true"
                  className="hidden text-3xl text-haze transition-[color,rotate] duration-500 group-hover:rotate-45 group-hover:text-signal md:block"
                >
                  ↗
                </span>
              </div>

              {/* Folded on pointer devices until hover/focus; always open on touch. */}
              <div className="grid transition-[grid-template-rows] duration-500 ease-out [@media(hover:hover)]:grid-rows-[0fr] [@media(hover:hover)]:group-focus-within:grid-rows-[1fr] [@media(hover:hover)]:group-hover:grid-rows-[1fr]">
                <div className="overflow-hidden md:pl-20">
                  <p className="max-w-2xl pt-4 text-lg leading-relaxed text-haze">
                    {skill.description}
                  </p>
                  <ul className="flex flex-wrap gap-2 pt-5">
                    {skill.tech.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-full border border-line px-3 py-1 font-mono text-[0.7rem] tracking-wider text-paper uppercase"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <TechMarquee items={skills.marquee} />
    </section>
  );
}
