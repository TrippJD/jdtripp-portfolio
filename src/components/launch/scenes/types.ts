import type { ReactNode } from "react";
import type { gsap } from "@/lib/gsap";

/** Finds elements inside one scene, like gsap.utils.selector(sceneElement). */
export type Select = (selector: string) => Element[];

export type Timeline = ReturnType<typeof gsap.timeline>;

/**
 * One scene of the launch story. `Art` draws its key frame, which is also the still shown
 * when motion is reduced. `animate` builds the scene's timeline: it may start from other
 * states, but it reads as one beat of the story, and it never needs to know whether it is
 * played inside the pinned stage or scrubbed on its own.
 */
export type Scene = {
  id: string;
  /** Seed for the scene's stars, so each frame's sky differs but never changes. */
  seed: number;
  /** Stretch the stars into speed lines (the liftoff). */
  streak?: number;
  Art: () => ReactNode;
  animate: (q: Select) => Timeline;
};

/** Rotation for an arm or other pivoting part, tweened as a transform attribute. */
export const turn = (degrees: number, cx?: number, cy?: number) => ({
  attr: { transform: cx === undefined ? `rotate(${degrees})` : `rotate(${degrees} ${cx} ${cy})` },
});

/** Set a scene's starting state the moment its timeline is built. */
export const START = { immediateRender: true } as const;

/** Grow from nothing, centred: for stamps, signs and speech bubbles. */
export const POP = {
  scale: 0,
  autoAlpha: 0,
  transformOrigin: "50% 50%",
  ease: "back.out(2)",
} as const;
