import { launch } from "@/content/site";
import { gsap } from "@/lib/gsap";
import { Ground, Inset, P, Pad, PORT, Puff, Rocket, Tower, type CrewFace } from "../art";
import { POP, START, turn, type Scene } from "./types";

// Shared with the liftoff, which starts from exactly this spot.
export const PAD_ROCKET = { x: 820, scale: 1.2, y: 806 - 160 * 1.2 };
export const SQUISHED: CrewFace[] = [
  ["builder", "wide", "o"],
  ["tester", "wide", "wavy"],
  ["lead", "determined", "grin"],
];

const PUFFS: [number, number, number, number][] = [
  [-130, 812, 1.1, 0.55],
  [130, 812, 1.2, 0.55],
  [-240, 826, 0.8, 0.4],
  [250, 826, 0.9, 0.4],
];

function Shake({ x, dir }: { x: number; dir: 1 | -1 }) {
  const y = PAD_ROCKET.y - 110;
  return (
    <path
      d={`M${x},${y} q${dir * 14},22 0,44 M${x + dir * 18},${y + 20} q${dir * 10},14 0,28`}
      stroke={P.paper}
      strokeOpacity={0.6}
      strokeWidth={3.5}
      fill="none"
      strokeLinecap="round"
    />
  );
}

/** 05 · 3 · 2 · 1. The rocket shakes and all three crew squish into the porthole. */
export const countdown: Scene = {
  id: "countdown",
  seed: 55,
  Art() {
    const { art } = launch;
    const { x, y, scale } = PAD_ROCKET;
    return (
      <g>
        <Ground y={820} />
        <Pad cx={x} y={820} />
        <Tower x={1040} top={260} bottom={820} />
        <g data-tower-arm transform="rotate(0 1040 420)">
          <line
            x1={1040}
            y1={420}
            x2={960}
            y2={356}
            stroke={P.steel}
            strokeWidth={8}
            strokeLinecap="round"
          />
        </g>
        <path
          data-swing
          d="M990,296 A90,90 0 0 0 930,346"
          stroke={P.teal}
          strokeWidth={3}
          fill="none"
          strokeDasharray="6 6"
        />
        <g data-shake>
          <g transform={`translate(${x} ${y}) scale(${scale})`}>
            <Rocket flame={[0.5, 0.18]} crew={{ squished: SQUISHED }} />
          </g>
        </g>
        <g data-shake-lines>
          <Shake x={x - 130} dir={-1} />
          <Shake x={x + 130} dir={1} />
        </g>
        {PUFFS.map(([dx, py, s, opacity]) => (
          <g key={dx} transform={`translate(${x + dx} ${py})`}>
            <g data-puff>
              <g transform={`scale(${s})`}>
                <Puff opacity={opacity} />
              </g>
            </g>
          </g>
        ))}
        <g data-inset>
          <Inset
            cx={1350}
            cy={340}
            r={118}
            faces={SQUISHED}
            from={[x + 28, y + (PORT.y - 12) * scale]}
          />
        </g>
        <text
          data-t-minus
          x={120}
          y={300}
          className="font-mono"
          fontSize={22}
          letterSpacing={5}
          fill={P.teal}
        >
          {art.tMinus}
        </text>
        <text
          data-digit
          x={110}
          y={590}
          className="font-sans"
          fontWeight={700}
          fontSize={300}
          fill={P.sun}
        >
          3
        </text>
        <text
          data-digit
          x={330}
          y={590}
          className="font-sans"
          fontWeight={700}
          fontSize={170}
          fill={P.pink}
          fillOpacity={0.8}
        >
          2
        </text>
        <text
          data-digit
          x={460}
          y={590}
          className="font-sans"
          fontWeight={700}
          fontSize={100}
          fill={P.teal}
          fillOpacity={0.75}
        >
          1
        </text>
      </g>
    );
  },
  animate(q) {
    const [three, two, one] = q("[data-digit]");
    const digit = {
      scale: 0.2,
      autoAlpha: 0,
      transformOrigin: "50% 80%",
      duration: 0.1,
      ease: "back.out(2)",
    };
    return gsap
      .timeline({ defaults: { ease: "none" } })
      .from(q("[data-t-minus]"), { autoAlpha: 0, duration: 0.08 }, 0)
      .from(three, digit, 0.05)
      .from(two, digit, 0.3)
      .from(one, digit, 0.55)
      .to(q("[data-shake]"), { x: 4, duration: 0.025, repeat: 31, yoyo: true }, 0.1)
      .from(q("[data-shake-lines]"), { autoAlpha: 0, duration: 0.08 }, 0.1)
      .from(
        q("[data-puff]"),
        { scale: 0.2, autoAlpha: 0, transformOrigin: "50% 100%", stagger: 0.08, duration: 0.3 },
        0.2,
      )
      .from(q("[data-inset]"), { ...POP, duration: 0.1 }, 0.38)
      .fromTo(
        q("[data-tower-arm]"),
        { ...turn(39, 1040, 420) },
        { ...turn(0, 1040, 420), duration: 0.25, ease: "power2.inOut", ...START },
        0.5,
      )
      .from(q("[data-swing]"), { autoAlpha: 0, duration: 0.08 }, 0.5)
      .from(q("[data-flame]"), { scaleY: 0, transformOrigin: "50% 0%", duration: 0.12 }, 0.62)
      .to({}, { duration: 0.2 });
  },
};
