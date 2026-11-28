import { gsap } from "@/lib/gsap";
import { Astro, FIN_LEFT, Ground, P, Pad, Rocket, Tower, Wrench } from "../art";
import { turn, type Scene } from "./types";

const RX = 790;
const S = 1.15;
const RY = 796 - 160 * S;
const LIFT = 110; // how far the nose cone hangs above the body, in rocket units
const CABLE_END = RY + (-206 - LIFT - 8) * S;
const BUILDER = { x: 958, y: 560 };
// The spare fin on the cart, and how far it slides to reach its slot on the rocket.
const FIN = { x: 590 + 103 * 1.1, y: 778 - 150 * 1.1 };
const FIN_SLIDE = { x: RX - FIN.x, y: RY - FIN.y };

/** 02 · The nose cone comes down on a crane while the lead races in with the last fin. */
export const build: Scene = {
  id: "build",
  seed: 22,
  Art() {
    return (
      <g>
        <Ground y={810} />
        <Pad cx={RX} y={810} />
        <Tower x={1000} top={190} bottom={810} />
        <line
          x1={1060}
          y1={196}
          x2={730}
          y2={196}
          stroke={P.steel}
          strokeWidth={8}
          strokeLinecap="round"
        />
        <rect
          x={RX - 18}
          y={188}
          width={36}
          height={18}
          rx={4}
          fill={P.sun}
          stroke={P.ink}
          strokeWidth={2.6}
        />
        <line
          data-cable
          x1={RX}
          y1={206}
          x2={RX}
          y2={CABLE_END}
          stroke={P.steel}
          strokeWidth={2.5}
        />
        <g transform={`translate(${RX} ${RY}) scale(${S})`}>
          <Rocket
            noseLift={LIFT}
            finLeftHidden
            crew={{ watching: [["tester", "wide", "o"]], relieved: [["tester", "happy", "grin"]] }}
          />
        </g>
        <path
          data-sway
          d={`M${RX - 92},${RY - 300 * S + 40} q-14,20 0,40 M${RX + 92},${RY - 300 * S + 40} q14,20 0,40`}
          stroke={P.paper}
          strokeOpacity={0.6}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />
        <text
          data-worry
          x={RX - 150}
          y={RY - 120 * S}
          className="font-sans"
          fontWeight={700}
          fontSize={48}
          fill={P.sun}
        >
          ?
        </text>
        <line x1={915} y1={BUILDER.y} x2={1060} y2={BUILDER.y} stroke={P.steel} strokeWidth={6} />
        <g data-builder transform={`translate(${BUILDER.x} ${BUILDER.y})`}>
          <Astro
            who="builder"
            flip
            armR={-90}
            faces={{ focus: { eyes: "squint", mouth: "tongue" } }}
            rightProp={<Wrench from={22} to={62} />}
          />
        </g>
        <path
          data-spark
          d={`M${RX + 92},${BUILDER.y - 92} l6,10 M${RX + 78},${BUILDER.y - 88} l10,8 M${RX + 104},${BUILDER.y - 96} l2,12`}
          stroke={P.sun}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <path
          data-arrow
          d="M600,600 C640,560 680,580 690,640"
          stroke={P.teal}
          strokeWidth={3}
          strokeDasharray="8 8"
          fill="none"
          markerEnd="url(#launch-arrow)"
        />
        <defs>
          <marker
            id="launch-arrow"
            viewBox="0 0 10 10"
            refX={8}
            refY={5}
            markerWidth={7}
            markerHeight={7}
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill={P.teal} />
          </marker>
        </defs>
        <g data-cart>
          <g data-cart-fin>
            <g transform={`translate(${FIN.x} ${FIN.y}) scale(1.1)`}>
              <path
                d={FIN_LEFT}
                fill={P.signal}
                stroke={P.ink}
                strokeWidth={3.4}
                strokeLinejoin="round"
              />
            </g>
          </g>
          <rect
            x={520}
            y={778}
            width={130}
            height={14}
            rx={5}
            fill={P.coral}
            stroke={P.ink}
            strokeWidth={2.6}
          />
          <circle cx={544} cy={800} r={10} fill={P.space3} stroke={P.ink} strokeWidth={3} />
          <circle cx={626} cy={800} r={10} fill={P.space3} stroke={P.ink} strokeWidth={3} />
          <line
            x1={524}
            y1={782}
            x2={537}
            y2={728}
            stroke={P.ink}
            strokeWidth={6}
            strokeLinecap="round"
          />
          <line
            x1={524}
            y1={782}
            x2={537}
            y2={728}
            stroke={P.metal}
            strokeWidth={3}
            strokeLinecap="round"
          />
          <g transform="translate(470 810) scale(1.15)">
            <Astro
              who="lead"
              armR={-88}
              faces={{ hustle: { eyes: "determined", mouth: "grin" } }}
            />
          </g>
          <path
            data-speed
            d="M350,700 H392 M338,730 H384 M354,760 H392"
            stroke={P.paper}
            strokeOpacity={0.45}
            strokeWidth={3}
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
        // The lead wheels the fin in from off stage.
        .from(q("[data-cart]"), { x: -620, duration: 0.4, ease: "power2.out" }, 0)
        .to(q("[data-speed]"), { autoAlpha: 0, duration: 0.08 }, 0.4)
        // The builder works the bolt the whole time.
        .to(
          q('[data-builder] [data-arm="r"]'),
          { ...turn(-70), duration: 0.07, repeat: 9, yoyo: true, ease: "sine.inOut" },
          0,
        )
        .to(q("[data-spark]"), { autoAlpha: 0.2, duration: 0.07, repeat: 9, yoyo: true }, 0)
        // Fin into its slot, then the nose cone drops on with a bounce.
        .to(q("[data-arrow]"), { autoAlpha: 0, duration: 0.06 }, 0.48)
        .to(
          q("[data-cart-fin]"),
          { x: FIN_SLIDE.x, y: FIN_SLIDE.y, duration: 0.16, ease: "power2.inOut" },
          0.48,
        )
        .set(q("[data-cart-fin]"), { autoAlpha: 0 }, 0.64)
        .set(q("[data-fin-left]"), { autoAlpha: 1 }, 0.64)
        .to(q("[data-sway], [data-worry]"), { autoAlpha: 0, duration: 0.06 }, 0.68)
        .to(q("[data-nose]"), { y: LIFT, duration: 0.22, ease: "bounce.out" }, 0.68)
        .to(
          q("[data-cable]"),
          { attr: { y2: CABLE_END + LIFT * S }, duration: 0.22, ease: "bounce.out" },
          0.68,
        )
        .set(q('[data-crew="watching"]'), { autoAlpha: 0 }, 0.86)
        .set(q('[data-crew="relieved"]'), { autoAlpha: 1 }, 0.86)
        .to({}, { duration: 0.12 })
    );
  },
};
