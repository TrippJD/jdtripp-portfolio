import { launch } from "@/content/site";
import { gsap } from "@/lib/gsap";
import { Astro, P, Rocket } from "../art";
import { Earth } from "../earth";
import type { Scene } from "./types";

const ROCKET = { x: 1210, y: 360 };

function Flag() {
  return (
    <g data-flag>
      <line x1={0} y1={-212} x2={0} y2={-250} stroke={P.ink} strokeWidth={3} />
      <path
        d="M0,-250 L48,-240 L0,-226 Z"
        fill={P.pink}
        stroke={P.ink}
        strokeWidth={2.6}
        strokeLinejoin="round"
      />
      <text x={58} y={-228} className="font-sans" fontWeight={700} fontSize={34} fill={P.pink}>
        {launch.art.version}
      </text>
    </g>
  );
}

/** 07 · In orbit with a v1.0 flag; the lead waves from a tether as Earth's lights come on. */
export const orbit: Scene = {
  id: "orbit",
  seed: 77,
  Art() {
    const { x, y } = ROCKET;
    return (
      <g>
        <g data-earth>
          <Earth />
        </g>
        <ellipse
          data-orbit
          cx={800}
          cy={470}
          rx={620}
          ry={170}
          transform="rotate(-6 800 470)"
          fill="none"
          stroke={P.lilac}
          strokeOpacity={0.6}
          strokeWidth={2.5}
          strokeDasharray="10 12"
        />
        {[60, 95, 130].map((r, i) => (
          <path
            key={r}
            data-signal
            d={`M${x + 0.45 * r},${y + 120 + 0.89 * r} A${r},${r} 0 0 1 ${x - 0.45 * r},${y + 120 + 0.89 * r}`}
            stroke={P.teal}
            strokeWidth={3.5}
            fill="none"
            strokeLinecap="round"
            opacity={0.85 - i * 0.25}
          />
        ))}
        <path
          data-tether
          d={`M${x - 70},${y - 10} C${x - 130},${y + 60} ${x - 200},${y - 120} ${x - 262},${y - 110}`}
          stroke={P.paper}
          strokeOpacity={0.8}
          strokeWidth={3}
          fill="none"
        />
        <g data-rocket>
          <g transform={`translate(${x} ${y}) rotate(18) scale(0.7)`}>
            <Rocket
              flame={[0.5, 0.4]}
              flag={<Flag />}
              crew={{
                aboard: [
                  ["tester", "happy", "smile"],
                  ["builder", "wink", "smile"],
                ],
              }}
            />
          </g>
        </g>
        <g data-floater>
          <g
            transform={`rotate(-18 ${x - 290} ${y - 70}) translate(${x - 290} ${y - 10}) scale(0.85)`}
          >
            <Astro
              who="lead"
              armR={-155}
              armL={40}
              faces={{ waving: { eyes: "happy", mouth: "grin" } }}
            />
          </g>
          <path
            data-yay
            d={`M${x - 236},${y - 128} l10,-10 M${x - 222},${y - 108} l14,-3 M${x - 252},${y - 140} l4,-14`}
            stroke={P.sun}
            strokeWidth={3.5}
            strokeLinecap="round"
          />
        </g>
      </g>
    );
  },
  animate(q) {
    return (
      gsap
        .timeline({ defaults: { ease: "none" } })
        .from(q("[data-earth]"), { y: 380, duration: 0.5, ease: "power2.out" }, 0)
        .from(q("[data-rocket]"), { x: -1100, y: 280, duration: 0.5, ease: "power2.out" }, 0.05)
        .from(q("[data-orbit]"), { autoAlpha: 0, duration: 0.2 }, 0.3)
        // City lights come on one by one: people using what shipped.
        .from(
          q("[data-light]"),
          { autoAlpha: 0, duration: 0.04, stagger: { each: 0.003, from: "random" } },
          0.45,
        )
        .from(
          q("[data-flag]"),
          { scale: 0, transformOrigin: "0% 100%", duration: 0.1, ease: "back.out(3)" },
          0.5,
        )
        .from(q("[data-tether]"), { autoAlpha: 0, duration: 0.08 }, 0.56)
        .from(
          q("[data-floater]"),
          { autoAlpha: 0, x: 220, y: 60, duration: 0.2, ease: "power2.out" },
          0.56,
        )
        .to(
          q('[data-floater] [data-arm="r"]'),
          { attr: { transform: "rotate(-130)" }, duration: 0.06, repeat: 5, yoyo: true },
          0.76,
        )
        .from(q("[data-signal]"), { autoAlpha: 0, stagger: 0.05, duration: 0.06 }, 0.7)
        .from(q("[data-yay]"), { autoAlpha: 0, duration: 0.06 }, 0.8)
        .to({}, { duration: 0.15 })
    );
  },
};
