import { gsap } from "@/lib/gsap";
import { Inset, P, PORT, Puff, Rocket, type CrewFace } from "../art";
import { PAD_ROCKET } from "./countdown";
import { POP, START, type Scene } from "./types";

const RY = 320; // the rocket's height in the key frame, well clear of the pad
const CHEERING: CrewFace[] = [
  ["builder", "happy", "grin"],
  ["tester", "happy", "grin"],
  ["lead", "determined", "grin"],
];
const PUFFS: [number, number, number, number][] = [
  [540, 880, 1.6, 0.55],
  [760, 872, 2, 0.55],
  [980, 885, 1.7, 0.55],
  [1160, 895, 1.3, 0.4],
  [400, 895, 1.2, 0.4],
];

/** 06 · Liftoff. The rocket climbs on a big flame and the stars streak past. */
export const ship: Scene = {
  id: "ship",
  seed: 66,
  streak: 150,
  Art() {
    const { x, scale } = PAD_ROCKET;
    return (
      <g>
        <defs>
          <radialGradient id="launch-flame-glow">
            <stop offset="0" stopColor={P.sun} stopOpacity={0.55} />
            <stop offset=".5" stopColor={P.flare} stopOpacity={0.25} />
            <stop offset="1" stopColor={P.flare} stopOpacity={0} />
          </radialGradient>
        </defs>
        {PUFFS.map(([px, py, s, opacity]) => (
          <g key={px} transform={`translate(${px} ${py})`}>
            <g data-puff>
              <g transform={`scale(${s})`}>
                <Puff opacity={opacity} />
              </g>
            </g>
          </g>
        ))}
        <g data-rocket>
          <ellipse
            cx={x}
            cy={RY + 157 * scale + 200}
            rx={170}
            ry={260}
            fill="url(#launch-flame-glow)"
          />
          <g transform={`translate(${x} ${RY}) scale(${scale})`}>
            <Rocket flame={[1.1, 1.7]} crew={{ cheering: CHEERING }} />
          </g>
          <path
            data-whoosh
            d={`M${x - 150},${RY - 60} l-24,-14 M${x - 160},${RY} l-28,0 M${x + 150},${RY - 60} l24,-14 M${x + 160},${RY} l28,0`}
            stroke={P.sun}
            strokeWidth={4}
            strokeLinecap="round"
          />
        </g>
        <g data-inset>
          <Inset
            cx={330}
            cy={430}
            r={118}
            faces={CHEERING}
            from={[x - 28, RY + (PORT.y - 12) * scale]}
          />
        </g>
      </g>
    );
  },
  animate(q) {
    const fromPad = PAD_ROCKET.y - RY;
    return (
      gsap
        .timeline({ defaults: { ease: "none" } })
        // Start exactly where the countdown left the rocket: on the pad, flame low.
        .set(q("[data-rocket]"), { y: fromPad, ...START }, 0)
        .fromTo(
          q("[data-flame]"),
          { scaleX: 0.45, scaleY: 0.1, transformOrigin: "50% 0%" },
          { scaleX: 1, scaleY: 1, duration: 0.2, ...START },
          0,
        )
        .from(
          q("[data-puff]"),
          { scale: 0.3, transformOrigin: "50% 100%", stagger: 0.04, duration: 0.3 },
          0,
        )
        .from(q("[data-stars]"), { autoAlpha: 0, y: -160, duration: 0.6 }, 0.1)
        .to(q("[data-rocket]"), { y: 0, duration: 0.5, ease: "power2.in" }, 0.1)
        .from(q("[data-whoosh]"), { autoAlpha: 0, duration: 0.06 }, 0.5)
        .fromTo(
          q("[data-inset]"),
          { ...POP },
          { scale: 1, autoAlpha: 1, duration: 0.1, ease: "back.out(2)" },
          0.58,
        )
        // Then it keeps going, up and out, before the orbit.
        .to(q("[data-inset]"), { autoAlpha: 0, duration: 0.06 }, 0.86)
        .to(q("[data-rocket]"), { y: -760, duration: 0.24, ease: "power2.in" }, 0.88)
        .to(q("[data-stars]"), { y: 120, duration: 0.24, ease: "power2.in" }, 0.88)
    );
  },
};
