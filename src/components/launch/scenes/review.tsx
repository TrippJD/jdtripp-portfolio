import { launch } from "@/content/site";
import { gsap } from "@/lib/gsap";
import { Astro, Bubble, Ground, P } from "../art";
import { POP, type Scene } from "./types";

// The pull request's diff: marker, indent and line length. Drawn as bars, not code.
const DIFF: ["" | "+" | "−", number, number][] = [
  ["", 0, 300],
  ["+", 1, 360],
  ["+", 1, 250],
  ["−", 0, 280],
  ["", 1, 200],
  ["+", 2, 320],
  ["+", 2, 180],
  ["", 1, 240],
  ["", 0, 120],
];

/** 04 · The crew huddles over the pull request: one nitpick, one LGTM, one big stamp. */
export const review: Scene = {
  id: "review",
  seed: 44,
  Art() {
    const { art } = launch;
    const burst = [
      [-212, -66, -232, -84],
      [-216, 0, -242, 0],
      [-212, 66, -232, 84],
      [212, -66, 232, -84],
      [216, 0, 242, 0],
      [212, 66, 232, 84],
    ];
    return (
      <g>
        <Ground y={790} />
        <g data-card>
          <rect
            x={800}
            y={190}
            width={580}
            height={530}
            rx={18}
            fill={P.space2}
            stroke={P.line}
            strokeWidth={2}
          />
          <text x={840} y={240} className="font-mono" fontSize={16} letterSpacing={3} fill={P.haze}>
            {art.prNumber}
          </text>
          <text x={840} y={285} className="font-sans" fontWeight={700} fontSize={32} fill={P.paper}>
            {art.prTitle}
          </text>
          <line x1={800} y1={312} x2={1380} y2={312} stroke={P.line} strokeWidth={2} />
          {DIFF.map(([mark, indent, width], i) => {
            const y = 350 + i * 36;
            const color = mark === "+" ? P.mint : mark === "−" ? P.pink : P.haze;
            return (
              <g key={i} data-row>
                <text x={840} y={y + 6} className="font-mono" fontSize={20} fill={color}>
                  {mark}
                </text>
                <rect
                  x={872 + indent * 30}
                  y={y - 6}
                  width={width}
                  height={12}
                  rx={6}
                  fill={color}
                  fillOpacity={mark ? 0.9 : 0.3}
                />
              </g>
            );
          })}
        </g>
        {/* Animated parts never carry their own transform attribute: GSAP would read it as
            the starting point. They sit inside a group that does the positioning. */}
        <g data-member>
          <g transform="translate(300 790) scale(1.2)">
            <Astro who="builder" armR={-60} faces={{ picky: { eyes: "squint", mouth: "smile" } }} />
          </g>
        </g>
        <g data-member>
          <g transform="translate(450 790) scale(1.2)">
            <Astro
              who="lead"
              armR={-100}
              faces={{ waiting: { mouth: "smile" }, relieved: { eyes: "happy", mouth: "grin" } }}
            />
          </g>
        </g>
        <g data-member>
          <g transform="translate(600 790) scale(1.2)">
            <Astro who="tester" armR={-160} faces={{ happy: { eyes: "happy", mouth: "grin" } }} />
          </g>
        </g>
        <g data-nit>
          <Bubble x={232} y={430} w={270} text={art.nit} size={19} />
        </g>
        <g data-lgtm>
          <Bubble x={560} y={470} w={170} text={art.lgtm} size={26} />
        </g>
        <g transform="translate(1110 600) rotate(-12)">
          <g data-stamp>
            <rect
              x={-200}
              y={-58}
              width={400}
              height={116}
              rx={16}
              fill={P.ink}
              fillOpacity={0.8}
            />
            <rect
              x={-200}
              y={-58}
              width={400}
              height={116}
              rx={16}
              fill="none"
              stroke={P.flare}
              strokeWidth={7}
            />
            <rect
              x={-186}
              y={-44}
              width={372}
              height={88}
              rx={9}
              fill="none"
              stroke={P.flare}
              strokeWidth={2}
            />
            <text
              y={22}
              textAnchor="middle"
              className="font-sans"
              fontWeight={700}
              fontSize={64}
              letterSpacing={6}
              fill={P.flare}
            >
              {art.approved}
            </text>
            <g stroke={P.sun} strokeWidth={4} strokeLinecap="round">
              {burst.map(([x1, y1, x2, y2]) => (
                <line key={`${x1},${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} />
              ))}
            </g>
          </g>
        </g>
      </g>
    );
  },
  animate(q) {
    return (
      gsap
        .timeline({ defaults: { ease: "none" } })
        .from(
          q("[data-member]"),
          { autoAlpha: 0, y: 60, stagger: 0.08, duration: 0.18, ease: "power2.out" },
          0,
        )
        .from(q("[data-card]"), { autoAlpha: 0, x: 140, duration: 0.22, ease: "power2.out" }, 0.05)
        .from(
          q("[data-row]"),
          { scaleX: 0, transformOrigin: "0% 50%", stagger: 0.035, duration: 0.1 },
          0.22,
        )
        .from(q("[data-nit]"), { ...POP, duration: 0.09 }, 0.5)
        .from(q("[data-lgtm]"), { ...POP, duration: 0.09 }, 0.64)
        // The stamp slams down and the card jolts.
        .from(
          q("[data-stamp]"),
          {
            scale: 2.6,
            rotation: -20,
            autoAlpha: 0,
            transformOrigin: "50% 50%",
            duration: 0.09,
            ease: "power4.in",
          },
          0.78,
        )
        .to(q("[data-card]"), { x: 6, duration: 0.025, repeat: 3, yoyo: true }, 0.87)
        .set(q('[data-face="waiting"]'), { autoAlpha: 0 }, 0.87)
        .set(q('[data-face="relieved"]'), { autoAlpha: 1 }, 0.87)
        .to({}, { duration: 0.12 })
    );
  },
};
