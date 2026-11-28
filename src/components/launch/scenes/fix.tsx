import { launch } from "@/content/site";
import { gsap } from "@/lib/gsap";
import {
  Astro,
  Bug,
  Burst,
  HIDDEN,
  Magnifier,
  Mug,
  P,
  Pad,
  Ground,
  Puff,
  Rocket,
  SquashedBug,
  Toast,
  Wrench,
} from "../art";
import { POP, START, turn, type Scene, type Timeline } from "./types";

const RX = 760;
const S = 1.1;
const RY = 796 - 160 * S;
// The bug lands on the far (right-hand) fin.
const BUG = { x: RX + 106 * S, y: RY + 96 * S };
const TESTER = { x: 548, y: 810 };
const BUILDER = { x: 1012, y: 810 };
// Where the builder starts: over by the pad on a coffee break.
const COFFEE_BREAK = 328;
// Where the tester's lens sits while she inspects (arm at -100°), for the glass that goes flying.
const LENS = { x: 663, y: 733 };

/**
 * 03 · Find it. Fix it. Three beats in one scene:
 * A, the tester inspects the wrong side while a bug buzzes in and lands on a fin;
 * B, she spots it and jumps, and the builder sprints over;
 * C, BONK. The key frame (and the still) is the end of beat C.
 */
export const fix: Scene = {
  id: "fix",
  seed: 33,
  Art() {
    const { art } = launch;
    return (
      <g>
        <Ground y={810} />
        <Pad cx={RX} y={810} />
        <g transform={`translate(${RX} ${RY}) scale(${S})`}>
          <Rocket
            crew={{
              calm: [["lead", "normal", "smile"]],
              shocked: [["lead", "wide", "o"]],
              cheering: [["lead", "happy", "grin"]],
            }}
            show="cheering"
          />
        </g>

        {/* The bug: squashed in the key frame, alive while the timeline plays. */}
        <g transform={`translate(${BUG.x - 6} ${BUG.y + 10})`}>
          <g data-squashed>
            <g transform="scale(1.6)">
              <SquashedBug />
            </g>
          </g>
        </g>
        <path
          data-flight
          style={HIDDEN}
          d="M1460,170 C1360,130 1290,250 1350,280 C1410,310 1400,210 1300,240 C1210,268 1140,360 1090,420"
          stroke={P.paper}
          strokeOpacity={0.55}
          strokeWidth={2.5}
          strokeDasharray="3 9"
          strokeLinecap="round"
          fill="none"
        />
        <text
          data-buzz
          style={HIDDEN}
          x={1100}
          y={410}
          className="font-sans"
          fontWeight={700}
          fontSize={26}
          fill={P.mint}
        >
          {art.buzz}
        </text>
        <g transform={`translate(${BUG.x} ${BUG.y})`}>
          <g data-bug style={HIDDEN}>
            <g transform="scale(1.3)">
              <Bug wings />
            </g>
          </g>
        </g>

        {/* The tester. Her magnifying glass is in her hand while she inspects. */}
        <ellipse
          data-shadow
          style={HIDDEN}
          cx={TESTER.x}
          cy={812}
          rx={38}
          ry={7}
          fill={P.ink}
          fillOpacity={0.55}
        />
        <g transform={`translate(${TESTER.x} ${TESTER.y})`}>
          <g data-tester>
            <g transform="scale(1.1)">
              <Astro
                who="tester"
                armL={150}
                armR={-150}
                faces={{
                  cheering: { eyes: "happy", mouth: "grin" },
                  inspecting: { eyes: "squint", mouth: "smile" },
                  startled: { eyes: "wide", mouth: "o", sweat: true },
                }}
                rightProp={
                  <g data-held-glass style={HIDDEN} transform="translate(0 78) rotate(-135)">
                    <Magnifier r={26} />
                  </g>
                }
              />
            </g>
            <g data-alarm style={HIDDEN}>
              <path
                d="M-70,-200 l-18,-10 M-76,-160 l-22,0 M70,-200 l18,-10 M76,-160 l22,0"
                stroke={P.paper}
                strokeOpacity={0.7}
                strokeWidth={3.5}
                strokeLinecap="round"
              />
              <text
                x={56}
                y={-190}
                className="font-sans"
                fontWeight={700}
                fontSize={72}
                fill={P.coral}
              >
                !
              </text>
              <text
                x={84}
                y={-205}
                className="font-sans"
                fontWeight={700}
                fontSize={48}
                fill={P.sun}
              >
                !
              </text>
            </g>
          </g>
        </g>
        <g transform={`translate(${LENS.x} ${LENS.y})`}>
          <g data-fly-glass style={HIDDEN}>
            <g data-fly-glass-spin transform="rotate(125)">
              <Magnifier r={29} />
            </g>
          </g>
        </g>

        {/* The builder, with a coffee break to abandon and a wrench to swing. */}
        <g transform="translate(1335 800)">
          <g data-mug>
            <g data-mug-spin transform="rotate(95)">
              <Mug steam />
            </g>
          </g>
        </g>
        <ellipse data-puddle cx={1360} cy={808} rx={26} ry={5} fill={P.coffee} fillOpacity={0.8} />
        <text
          data-coffee
          style={HIDDEN}
          x={BUILDER.x + COFFEE_BREAK}
          y={600}
          textAnchor="middle"
          className="font-mono"
          fontSize={18}
          fill={P.haze}
        >
          {art.coffee}
        </text>
        <g transform={`translate(${BUILDER.x} ${BUILDER.y})`}>
          <g data-builder>
            <g data-speed style={HIDDEN}>
              <path
                d="M60,-160 H150 M72,-120 H182 M60,-80 H140 M76,-40 H162"
                stroke={P.paper}
                strokeOpacity={0.5}
                strokeWidth={3.5}
                strokeLinecap="round"
              />
              <g transform="translate(50 -4) scale(0.45)">
                <Puff opacity={0.5} />
              </g>
            </g>
            <g data-lean transform="rotate(0)">
              <g transform="scale(1.1)">
                <Astro
                  who="builder"
                  flip
                  armR={-102}
                  faces={{
                    bonk: { eyes: "determined", mouth: "grin" },
                    coffee: { eyes: "happy", mouth: "smile" },
                  }}
                  rightProp={
                    <g data-wrench>
                      <Wrench from={22} to={97} />
                    </g>
                  }
                />
              </g>
            </g>
          </g>
        </g>

        <path
          data-swing
          d={`M${BUILDER.x - 20},${BUILDER.y - 175} A130,130 0 0 0 ${BUG.x + 30},${BUG.y - 60}`}
          stroke={P.paper}
          strokeOpacity={0.5}
          strokeWidth={3}
          strokeDasharray="6 8"
          fill="none"
        />
        <g transform={`translate(${BUG.x + 14} ${BUG.y - 140})`}>
          <g data-bonk>
            <Burst r={50} text={art.bonk} />
          </g>
        </g>
        <g transform="translate(1040 200)">
          <g data-toast>
            <Toast text={art.squashed} />
          </g>
        </g>
      </g>
    );
  },
  animate(q) {
    const tester = (part: string) => q(`[data-tester] ${part}`);
    const builder = (part: string) => q(`[data-builder] ${part}`);
    const swap = (tl: Timeline, from: Element[], to: Element[], at: number) =>
      tl.set(from, { autoAlpha: 0 }, at).set(to, { autoAlpha: 1 }, at);

    const tl = gsap.timeline({ defaults: { ease: "none" } });

    // ---- Beat A, starting state: everyone in their places before the bug arrives.
    tl.set(q('[data-crew="cheering"]'), { autoAlpha: 0, ...START }, 0)
      .set(q('[data-crew="calm"]'), { autoAlpha: 1, ...START }, 0)
      .set(
        q("[data-squashed], [data-bonk], [data-swing], [data-toast], [data-puddle]"),
        { autoAlpha: 0, ...START },
        0,
      )
      .set(
        q("[data-bug], [data-flight], [data-buzz], [data-coffee]"),
        { autoAlpha: 1, ...START },
        0,
      )
      .set(q("[data-bug]"), { x: 583, y: -556, ...START }, 0)
      .set(tester('[data-face="cheering"]'), { autoAlpha: 0, ...START }, 0)
      .set(tester('[data-face="inspecting"], [data-held-glass]'), { autoAlpha: 1, ...START }, 0)
      .set(tester('[data-arm="l"]'), { ...turn(15), ...START }, 0)
      .set(tester('[data-arm="r"]'), { ...turn(-100), ...START }, 0)
      .set(q("[data-builder]"), { x: COFFEE_BREAK, ...START }, 0)
      .set(builder('[data-face="bonk"], [data-wrench]'), { autoAlpha: 0, ...START }, 0)
      .set(builder('[data-face="coffee"]'), { autoAlpha: 1, ...START }, 0)
      .set(builder('[data-arm="r"]'), { ...turn(-112), ...START }, 0)
      .set(q("[data-mug]"), { x: -51, y: -60, ...START }, 0)
      .set(q("[data-mug-spin]"), { ...turn(0), ...START }, 0);

    // ---- Beat A: inspecting the wrong side while the bug loops in and lands.
    tl.to(
      tester('[data-arm="r"]'),
      { ...turn(-90), duration: 0.09, repeat: 3, yoyo: true, ease: "sine.inOut" },
      0.05,
    )
      .to(q("[data-bug]"), { x: 183, y: -266, duration: 0.3, ease: "sine.inOut" }, 0.02)
      .to(q("[data-bug]"), { x: 0, y: 0, duration: 0.2, ease: "power2.in" }, 0.32)
      .to(
        q("[data-wings]"),
        { scaleY: 0.4, transformOrigin: "50% 50%", duration: 0.03, repeat: 15, yoyo: true },
        0.02,
      )
      .to(q("[data-flight], [data-buzz]"), { autoAlpha: 0, duration: 0.08 }, 0.44)
      .set(q("[data-wings]"), { autoAlpha: 0 }, 0.52);

    // ---- Beat B: she jumps, and the builder drops everything.
    const jump = 0.58;
    swap(
      tl,
      tester('[data-face="inspecting"], [data-held-glass]'),
      tester('[data-face="startled"], [data-alarm]'),
      jump,
    );
    swap(tl, q('[data-crew="calm"]'), q('[data-crew="shocked"]'), jump);
    tl.to(q("[data-tester]"), { y: -78, duration: 0.07, ease: "power2.out" }, jump)
      .to(q("[data-tester]"), { y: 0, duration: 0.1, ease: "power2.in" }, jump + 0.3)
      .to(tester('[data-arm="l"]'), { ...turn(165), duration: 0.05 }, jump)
      .to(tester('[data-arm="r"]'), { ...turn(-165), duration: 0.05 }, jump)
      .set(q("[data-shadow]"), { autoAlpha: 1 }, jump)
      .set(q("[data-shadow]"), { autoAlpha: 0 }, jump + 0.4)
      .from(
        tester("[data-alarm]"),
        { scale: 0, transformOrigin: "50% 100%", duration: 0.06, ease: "back.out(3)" },
        jump,
      )
      .set(q("[data-fly-glass]"), { autoAlpha: 1 }, jump)
      .to(q("[data-fly-glass]"), { x: -271, y: -213, duration: 0.25, ease: "power2.out" }, jump)
      .to(q("[data-fly-glass]"), { x: -240, y: 75, duration: 0.2, ease: "power2.in" }, jump + 0.25)
      .to(q("[data-fly-glass-spin]"), { ...turn(-235), duration: 0.45 }, jump);

    const run = jump + 0.04;
    swap(
      tl,
      builder('[data-face="coffee"]'),
      builder('[data-face="bonk"], [data-wrench], [data-speed]'),
      run,
    );
    tl.to(q("[data-coffee], [data-steam]"), { autoAlpha: 0, duration: 0.05 }, run)
      .to(builder('[data-arm="r"]'), { ...turn(-165), duration: 0.05 }, run)
      .to(q("[data-lean]"), { ...turn(-9), duration: 0.05 }, run)
      .to(q("[data-builder]"), { x: 0, duration: 0.5, ease: "power1.in" }, run)
      .to(q("[data-mug]"), { x: 65, y: -200, duration: 0.18, ease: "power2.out" }, run)
      .to(q("[data-mug]"), { x: 0, y: 0, duration: 0.2, ease: "power2.in" }, run + 0.18)
      .to(q("[data-mug-spin]"), { ...turn(95), duration: 0.38 }, run)
      .set(q("[data-puddle]"), { autoAlpha: 1 }, run + 0.38)
      .to(q("[data-lean]"), { ...turn(0), duration: 0.05 }, run + 0.5)
      .set(builder("[data-speed]"), { autoAlpha: 0 }, run + 0.5);

    // ---- Beat C: BONK.
    const strike = run + 0.52;
    const impact = strike + 0.06;
    tl.to(builder('[data-arm="r"]'), { ...turn(-102), duration: 0.06, ease: "power3.in" }, strike);
    swap(tl, q("[data-bug]"), q("[data-squashed]"), impact);
    swap(tl, q('[data-crew="shocked"]'), q('[data-crew="cheering"]'), impact);
    swap(
      tl,
      tester('[data-face="startled"], [data-alarm]'),
      tester('[data-face="cheering"]'),
      impact,
    );
    tl.from(
      q("[data-squashed]"),
      { scaleY: 2.4, transformOrigin: "50% 100%", duration: 0.05 },
      impact,
    )
      .fromTo(
        q("[data-bonk]"),
        { ...POP },
        { scale: 1, autoAlpha: 1, duration: 0.08, ease: "back.out(2)" },
        impact,
      )
      .to(q("[data-swing]"), { autoAlpha: 1, duration: 0.04 }, strike)
      .to(tester('[data-arm="l"]'), { ...turn(150), duration: 0.06 }, impact)
      .to(tester('[data-arm="r"]'), { ...turn(-150), duration: 0.06 }, impact)
      .to(q("[data-dizzy]"), { rotation: 360, transformOrigin: "50% 50%", duration: 0.4 }, impact)
      .fromTo(
        q("[data-toast]"),
        { autoAlpha: 0, y: -30 },
        { autoAlpha: 1, y: 0, duration: 0.1, ease: "power2.out" },
        impact + 0.1,
      )
      .to({}, { duration: 0.15 });

    return tl;
  },
};
