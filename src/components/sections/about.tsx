"use client";

import Image from "next/image";
import { useRef } from "react";
import { about } from "@/content/site";
import { gsap, PLAY_ONCE, useGSAP } from "@/lib/gsap";

/** Section 7: about me, with the photo presented as a crew ID badge. */
export function About() {
  const root = useRef<HTMLElement>(null);
  const badge = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-about-fade]", {
          autoAlpha: 0,
          y: 32,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 70%", toggleActions: PLAY_ONCE },
        });

        // The badge tilts toward the mouse a little, like a card in your hand.
        const card = badge.current!;
        const tiltX = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3.out" });
        const tiltY = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3.out" });
        gsap.set(card, { transformPerspective: 900 });

        const onMove = (event: PointerEvent) => {
          if (event.pointerType !== "mouse") return;
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          tiltY(x * 12);
          tiltX(-y * 12);
        };
        const onLeave = () => {
          tiltX(0);
          tiltY(0);
        };
        card.addEventListener("pointermove", onMove);
        card.addEventListener("pointerleave", onLeave);
        return () => {
          card.removeEventListener("pointermove", onMove);
          card.removeEventListener("pointerleave", onLeave);
        };
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="about"
      aria-labelledby="about-heading"
      className="border-t border-line py-32 md:py-40"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-24">
        {/* Crew ID badge */}
        <div data-about-fade className="mx-auto w-full max-w-sm lg:mx-0 lg:w-80">
          <div
            ref={badge}
            className="overflow-hidden rounded-2xl border border-line bg-space-2 shadow-[0_30px_80px_-30px_rgba(61,123,255,0.35)]"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-3 font-mono text-[0.7rem] tracking-[0.2em] uppercase">
              <span className="text-signal">Crew ID</span>
              <span className="flex items-center gap-2 text-haze">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-flare" />
                No. 001
              </span>
            </div>

            {/* Transparent cutout on a blue glow, with a faint instrument grid
                behind it and viewfinder brackets on top. */}
            <div className="relative bg-[radial-gradient(circle_at_50%_72%,rgba(61,123,255,0.5),transparent_62%)]">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-line)_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black,transparent)] bg-[size:24px_24px] opacity-60"
              />
              <Image
                src={about.photo.src}
                alt={about.photo.alt}
                width={800}
                height={1000}
                sizes="(min-width: 1024px) 320px, 384px"
                className="relative block h-auto w-full"
              />
              <span
                aria-hidden="true"
                className="absolute top-4 left-4 size-5 border-t border-l border-signal"
              />
              <span
                aria-hidden="true"
                className="absolute top-4 right-4 size-5 border-t border-r border-signal"
              />
              <span
                aria-hidden="true"
                className="absolute bottom-4 left-4 size-5 border-b border-l border-signal"
              />
              <span
                aria-hidden="true"
                className="absolute right-4 bottom-4 size-5 border-r border-b border-signal"
              />
            </div>

            <dl className="space-y-2 border-t border-line px-5 py-5 font-mono text-[0.7rem] tracking-[0.15em] uppercase">
              {about.badge.map((field) => (
                <div key={field.label} className="flex justify-between gap-4">
                  <dt className="text-haze">{field.label}</dt>
                  <dd className="text-right">{field.value}</dd>
                </div>
              ))}
            </dl>

            {/* Decorative barcode strip. */}
            <div
              aria-hidden="true"
              className="h-10 border-t border-line bg-[repeating-linear-gradient(90deg,var(--color-paper)_0_2px,transparent_2px_5px,var(--color-paper)_5px_6px,transparent_6px_10px)] [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] opacity-20"
            />
          </div>
        </div>

        <div>
          <p data-about-fade className="eyebrow">
            [ {about.eyebrow} ]
          </p>
          <h2
            id="about-heading"
            data-about-fade
            className="mt-6 text-3xl font-bold tracking-tight text-balance md:text-5xl"
          >
            {about.heading}
          </h2>
          <div className="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed text-haze">
            {about.paragraphs.map((paragraph, index) =>
              // The last paragraph is the call to action: brighter, and linked to Contact.
              index === about.paragraphs.length - 1 ? (
                <p key={paragraph} data-about-fade className="pt-2 font-medium text-paper">
                  <a
                    href="#contact"
                    className="group inline-flex flex-wrap items-baseline gap-x-2 transition-colors hover:text-signal"
                  >
                    {paragraph}
                    <span
                      aria-hidden="true"
                      className="text-signal transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </a>
                </p>
              ) : (
                <p key={paragraph} data-about-fade>
                  {paragraph}
                </p>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
