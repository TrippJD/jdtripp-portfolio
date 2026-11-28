import { launch } from "@/content/site";
import { gsap } from "@/lib/gsap";
import { Astro, Ground, HIDDEN, P, rng, round, useSvgId } from "../art";
import { START, turn, type Scene, type Timeline } from "./types";

// Graph paper, wood and pencil.
const PAPER = "#f6f1e4";
const PAPER_SHADE = "#e3d9c3";
const CREASE = "#bfb397";
const RULE = "#9fc0ea";
const GRID = "#d9e5f4";
const WOOD = "#c98b58";
const WOOD_DARK = "#a8703f";
const LEAD_LINE = "#3157d5"; // the pencil's line

// The rocket drawing: centred on the board, a little larger than the real rocket.
const RX = 930;
const RY = 440;
const K = 1.05;

// The lead stands left of the board, holding the giant pencil in their right hand.
const LEAD = { x: 410, y: 800, s: 1.35 };
const ARM_DRAW = -100; // right arm points the pencil at the board
const ARM_UP = -170; // ...or holds it upright while throwing
const PENCIL_TIP = 146; // the pencil tip's distance down the arm, in the arm's own units

/** Where the pencil tip is when the lead stands still, drawing-arm out. */
const TIP_REST = (() => {
  const a = (ARM_DRAW * Math.PI) / 180;
  return {
    x: LEAD.x + LEAD.s * (28 - Math.sin(a) * PENCIL_TIP),
    y: LEAD.y + LEAD.s * (-56 + Math.cos(a) * PENCIL_TIP),
  };
})();

// The crumpled draft: thrown from the left hand at the top of the swing, into the bin.
const ARM_THROW = 125;
const BALL_REACH = 40; // the held draft sits this far down the arm
const RELEASE = (() => {
  const a = (ARM_THROW * Math.PI) / 180;
  return {
    x: LEAD.x + LEAD.s * (-28 - Math.sin(a) * BALL_REACH),
    y: LEAD.y + LEAD.s * (-56 + Math.cos(a) * BALL_REACH),
  };
})();
const BIN = { x: 228, y: 800, s: 1.4 };
const LANDING = { x: BIN.x + 4, y: BIN.y - 100 };

// Pencil strokes, in the order they're drawn, in the rocket's own units.
const STROKES = [
  "M0,-190 C30,-180 52,-155 66.5,-120 C81,-85 88,-40 88,10 C88,80 72,118 62,130 L-62,130 C-72,118 -88,80 -88,10 C-88,-40 -81,-85 -66.5,-120 C-52,-155 -30,-180 0,-190 Z",
  "M-66.5,-120 Q0,-102 66.5,-120",
  "M0,-86 A46,46 0 1 1 0,6 A46,46 0 1 1 0,-86",
  "M0,21 A13,13 0 1 1 0,47 A13,13 0 1 1 0,21",
  "M-87,58 Q0,76 87,58",
  "M-84,84 Q0,102 84,84",
  "M-80,30 C-122,40 -140,96 -132,150 C-112,142 -92,132 -70,124",
  "M80,30 C122,40 140,96 132,150 C112,142 92,132 70,124",
  "M-44,130 L-52,152 Q0,162 52,152 L44,130",
  "M0,-190 L0,-199 A7,7 0 1 1 -0.1,-199",
];

// Annotations: a leader line, then the words at its end.
const LABELS = [
  {
    d: `M${RX - 34},${RY - 70} L${RX - 120},${RY - 140} H${RX - 236}`,
    x: RX - 236,
    y: RY - 150,
    key: "crew",
  },
  {
    d: `M${RX + 20},${RY + 36} L${RX + 120},${RY + 10} H${RX + 238}`,
    x: RX + 130,
    y: RY,
    key: "snacks",
  },
  {
    d: `M${RX - 125},${RY + 120} L${RX - 205},${RY + 190} H${RX - 300}`,
    x: RX - 300,
    y: RY + 180,
    key: "fins",
  },
] as const;

/** A crumpled ball of graph paper: faceted outline, a shaded fold, creases and ruled lines. */
function Crumpled({ r, seed }: { r: number; seed: number }) {
  const clip = useSvgId("paper");
  const rand = rng(seed);
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2 + rand() * 0.3;
    const rr = r * (0.8 + rand() * 0.32);
    return [round(Math.cos(a) * rr), round(Math.sin(a) * rr)] as const;
  });
  const poly = pts.map(([x, y]) => `${x},${y}`).join(" ");
  const at = (i: number) => `${pts[i][0]},${pts[i][1]}`;
  const mid = (fx: number, fy: number) => `${round(r * fx)},${round(r * fy)}`;
  return (
    <g>
      <clipPath id={clip}>
        <polygon points={poly} />
      </clipPath>
      <polygon points={poly} fill={PAPER} />
      <g clipPath={`url(#${clip})`}>
        <polygon points={`${at(2)} ${at(3)} ${at(4)} ${mid(0.1, 0.2)}`} fill={PAPER_SHADE} />
        <polygon points={`${at(6)} ${at(7)} ${mid(-0.2, -0.1)}`} fill={PAPER_SHADE} opacity={0.7} />
        <path
          d={`M${-r},${round(-r * 0.3)} L${r},${round(-r * 0.45)} M${-r},${round(r * 0.2)} L${r},${round(r * 0.05)}`}
          stroke={RULE}
          strokeWidth={1.4}
        />
        <path
          d={`M${at(0)} L${mid(0.2, -0.1)} L${at(5)} M${at(7)} L${mid(-0.15, 0.25)} L${at(3)}`}
          stroke={CREASE}
          strokeWidth={1.6}
          fill="none"
          strokeLinejoin="round"
        />
      </g>
      <polygon points={poly} fill="none" stroke={P.ink} strokeWidth={2.6} strokeLinejoin="round" />
    </g>
  );
}

/** The giant pencil, held in the hand: eraser at the grip, tip PENCIL_TIP down the arm. */
function Pencil() {
  return (
    <g>
      <rect
        x={-9}
        y={4}
        width={18}
        height={14}
        rx={4}
        fill={P.mint}
        stroke={P.ink}
        strokeWidth={2.4}
      />
      <rect x={-9} y={16} width={18} height={9} fill={P.metal} stroke={P.ink} strokeWidth={2.4} />
      <rect x={-9} y={24} width={18} height={100} fill={P.pink} stroke={P.ink} strokeWidth={2.4} />
      <line x1={0} y1={28} x2={0} y2={120} stroke="#fff" strokeOpacity={0.45} strokeWidth={3} />
      <path
        d={`M-9,124 L9,124 L0,${PENCIL_TIP} Z`}
        fill="#f5d3a8"
        stroke={P.ink}
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
      <path
        d={`M-3.2,${PENCIL_TIP - 7.5} L3.2,${PENCIL_TIP - 7.5} L0,${PENCIL_TIP} Z`}
        fill={P.ink}
      />
    </g>
  );
}

function Easel() {
  return (
    <g>
      <defs>
        <pattern id="launch-graph-paper" width={32} height={32} patternUnits="userSpaceOnUse">
          <path d="M32 0H0V32" fill="none" stroke={GRID} strokeWidth={1.5} />
        </pattern>
      </defs>
      {/* Legs behind the board */}
      <g stroke={P.ink} strokeWidth={3} strokeLinejoin="round">
        <path d="M640,690 L612,802 L630,802 L660,690 Z" fill={WOOD_DARK} />
        <path d="M1220,690 L1248,802 L1230,802 L1200,690 Z" fill={WOOD_DARK} />
        <rect x={920} y={108} width={20} height={30} rx={4} fill={WOOD} />
      </g>
      <rect
        x={590}
        y={130}
        width={680}
        height={592}
        rx={10}
        fill={WOOD}
        stroke={P.ink}
        strokeWidth={3}
      />
      <rect x={606} y={146} width={648} height={560} fill={PAPER} />
      <rect x={606} y={146} width={648} height={560} fill="url(#launch-graph-paper)" />
      <rect
        x={606}
        y={146}
        width={648}
        height={560}
        fill="none"
        stroke={P.ink}
        strokeOpacity={0.25}
        strokeWidth={2}
      />
      <rect
        x={610}
        y={140}
        width={56}
        height={20}
        rx={2}
        fill={P.pink}
        fillOpacity={0.75}
        transform="rotate(-12 638 150)"
      />
      <rect
        x={1194}
        y={140}
        width={56}
        height={20}
        rx={2}
        fill={P.mint}
        fillOpacity={0.75}
        transform="rotate(10 1222 150)"
      />
      <rect
        x={598}
        y={714}
        width={664}
        height={18}
        rx={4}
        fill={WOOD_DARK}
        stroke={P.ink}
        strokeWidth={3}
      />
    </g>
  );
}

function Wastebasket() {
  return (
    <g>
      {/* Drafts already in the bin, poking over the rim */}
      <g transform="translate(-20 -84)">
        <Crumpled r={17} seed={3} />
      </g>
      <g transform="translate(18 -88)">
        <Crumpled r={16} seed={8} />
      </g>
      <path
        d="M-46,-74 L46,-74 L37,0 L-37,0 Z"
        fill="#56658a"
        stroke={P.ink}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <g stroke={P.ink} strokeOpacity={0.35} strokeWidth={2}>
        {[-24, -8, 8, 24].map((x) => (
          <line key={x} x1={x * 1.1} y1={-68} x2={x * 0.85} y2={-6} />
        ))}
      </g>
      <rect
        x={-50}
        y={-82}
        width={100}
        height={11}
        rx={5}
        fill="#8b98b6"
        stroke={P.ink}
        strokeWidth={3}
      />
    </g>
  );
}

/**
 * 01 · Sketch it. The lead lobs a crumpled draft over their shoulder into the bin, then
 * floats up with a giant pencil and draws the rocket, line by line.
 */
export const sketch: Scene = {
  id: "sketch",
  seed: 11,
  Art() {
    const { art } = launch;
    const words = { crew: art.crew, snacks: art.snacks, fins: art.fins };
    return (
      <g>
        <Ground y={800} />
        <Easel />

        <g transform={`translate(${RX} ${RY}) scale(${K})`}>
          {STROKES.map((d) => (
            <path
              key={d}
              data-stroke
              d={d}
              fill="none"
              stroke={LEAD_LINE}
              strokeWidth={4.2 / K}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </g>
        {LABELS.map((label) => (
          <g key={label.key} data-label>
            <path
              data-leader
              d={label.d}
              fill="none"
              stroke={LEAD_LINE}
              strokeOpacity={0.7}
              strokeWidth={2.2}
              strokeLinecap="round"
            />
            <text
              data-label-text
              x={label.x}
              y={label.y}
              className="font-mono"
              fontSize={18}
              fill={LEAD_LINE}
            >
              {words[label.key]}
            </text>
          </g>
        ))}
        <text
          data-version
          x={1226}
          y={690}
          textAnchor="end"
          className="font-mono"
          fontSize={16}
          fill={LEAD_LINE}
          fillOpacity={0.6}
        >
          {art.draft}
        </text>
        <g transform="translate(1166 232) rotate(6)">
          <g data-sticky>
            <rect
              x={-80}
              y={-60}
              width={160}
              height={120}
              rx={5}
              fill={P.sun}
              stroke={P.ink}
              strokeWidth={3}
            />
            {art.todo.map((line, i) => (
              <text
                key={line}
                x={-62}
                y={[-16, 16, 40][i]}
                className="font-mono"
                fontSize={19}
                fill={P.ink}
              >
                {line}
              </text>
            ))}
          </g>
        </g>

        {/* Drafts that missed, the bin, and the one in flight (it ends up in the bin). */}
        <g transform="translate(334 782)">
          <Crumpled r={19} seed={5} />
        </g>
        <g transform="translate(128 784)">
          <Crumpled r={16} seed={13} />
        </g>
        <g transform={`translate(${LANDING.x} ${LANDING.y})`}>
          <g data-throw>
            <g data-throw-spin transform="rotate(0)">
              <Crumpled r={25} seed={21} />
            </g>
          </g>
        </g>
        <g transform={`translate(${BIN.x} ${BIN.y}) scale(${BIN.s})`}>
          <g data-bin>
            <Wastebasket />
          </g>
        </g>
        <path
          data-swish
          style={HIDDEN}
          d={`M${BIN.x - 62},${BIN.y - 150} l-14,-10 M${BIN.x + 62},${BIN.y - 150} l14,-10 M${BIN.x},${BIN.y - 170} l0,-16`}
          stroke={P.paper}
          strokeOpacity={0.7}
          strokeWidth={3}
          strokeLinecap="round"
        />

        <g data-floater>
          <g transform={`translate(${LEAD.x} ${LEAD.y}) scale(${LEAD.s})`}>
            <Astro
              who="lead"
              armR={ARM_DRAW}
              faces={{
                proud: { mouth: "grin" },
                meh: { eyes: "squint", mouth: "wavy" },
                focused: { eyes: "determined", mouth: "tongue" },
              }}
              leftProp={
                <g data-held-ball style={HIDDEN} transform={`translate(0 ${BALL_REACH})`}>
                  <Crumpled r={18.5} seed={21} />
                </g>
              }
              rightProp={<Pencil />}
            />
          </g>
        </g>
      </g>
    );
  },
  animate(q) {
    const tl = gsap.timeline({ defaults: { ease: "none" } });
    const lead = (part: string) => q(`[data-floater] ${part}`);
    const swap = (from: Element[], to: Element[], at: number) =>
      tl.set(from, { autoAlpha: 0 }, at).set(to, { autoAlpha: 1 }, at);

    // ---- Starting state: a blank sheet, a draft in hand, the pencil held upright.
    const strokes = q("[data-stroke]") as SVGPathElement[];
    const leaders = q("[data-leader]") as SVGPathElement[];
    const hide = (path: SVGPathElement) => {
      const length = path.getTotalLength();
      // A gap a little longer than the line, so not even a round cap shows before drawing.
      tl.set(
        path,
        { strokeDasharray: `${length} ${length + 12}`, strokeDashoffset: length + 3, ...START },
        0,
      );
      return length;
    };
    const lengths = strokes.map(hide);
    leaders.forEach(hide);
    tl.set(q("[data-label-text], [data-sticky], [data-version]"), { autoAlpha: 0, ...START }, 0)
      .set(lead('[data-face="proud"]'), { autoAlpha: 0, ...START }, 0)
      .set(lead('[data-face="meh"], [data-held-ball]'), { autoAlpha: 1, ...START }, 0)
      .set(
        q("[data-throw]"),
        { autoAlpha: 0, x: RELEASE.x - LANDING.x, y: RELEASE.y - LANDING.y, ...START },
        0,
      )
      .set(lead('[data-arm="r"]'), { ...turn(ARM_UP), ...START }, 0);

    // ---- The throw: wind back, swing up, let go at the top. Over the shoulder, into the bin.
    const release = 0.19;
    tl.to(lead('[data-arm="l"]'), { ...turn(-25), duration: 0.06, ease: "power1.out" }, 0.04).to(
      lead('[data-arm="l"]'),
      { ...turn(ARM_THROW), duration: 0.09, ease: "power2.in" },
      0.1,
    );
    swap(lead("[data-held-ball]"), q("[data-throw]"), release);
    tl.to(q("[data-throw]"), { x: 0, duration: 0.22 }, release)
      .to(
        q("[data-throw]"),
        { y: -150 - (LANDING.y - RELEASE.y) / 2, duration: 0.09, ease: "power2.out" },
        release,
      )
      .to(q("[data-throw]"), { y: 0, duration: 0.13, ease: "power2.in" }, release + 0.09)
      .to(q("[data-throw-spin]"), { ...turn(-420), duration: 0.22 }, release)
      .to(
        q("[data-bin]"),
        {
          keyframes: [
            { rotation: -7, transformOrigin: "50% 100%", duration: 0.03 },
            { rotation: 5, duration: 0.03 },
            { rotation: -2, duration: 0.03 },
            { rotation: 0, duration: 0.03 },
          ],
        },
        release + 0.22,
      )
      .to(
        q("[data-swish]"),
        { autoAlpha: 1, duration: 0.03, yoyo: true, repeat: 1, repeatDelay: 0.05 },
        release + 0.22,
      )
      .to(lead('[data-arm="l"]'), { ...turn(15), duration: 0.06 }, release + 0.06);

    // ---- The drawing: float up and trace each line, lifting the pencil between strokes.
    const drawStart = 0.42;
    const drawTime = 0.85;
    const hop = 0.035;
    swap(lead('[data-face="meh"]'), lead('[data-face="focused"]'), drawStart - 0.08);
    tl.to(lead('[data-arm="r"]'), { ...turn(ARM_DRAW), duration: 0.06 }, drawStart - 0.08);

    const floater = q("[data-floater]");
    const total = lengths.reduce((a, b) => a + b, 0);
    // The floater offset that puts the pencil tip on a point of the drawing.
    const tipAt = (path: SVGPathElement, at: number) => {
      const p = path.getPointAtLength(at);
      return { x: RX + K * p.x - TIP_REST.x, y: RY + K * p.y - TIP_REST.y };
    };
    let t = drawStart;
    strokes.forEach((path, i) => {
      const length = lengths[i];
      tl.to(
        floater,
        { ...tipAt(path, 0), duration: i === 0 ? 0.08 : hop, ease: "power1.inOut" },
        t,
      );
      t += i === 0 ? 0.08 : hop;
      const duration = (drawTime * length) / total;
      const steps = Math.max(4, Math.ceil(length / 24));
      tl.to(path, { strokeDashoffset: 0, duration }, t).to(
        floater,
        {
          keyframes: Array.from({ length: steps }, (_, k) => ({
            ...tipAt(path, (length * (k + 1)) / steps),
            duration: duration / steps,
            ease: "none",
          })),
        },
        t,
      );
      t += duration;
    });

    // ---- Back down, proud. The notes go on.
    tl.to(floater, { x: 0, y: 0, duration: 0.12, ease: "power2.inOut" }, t);
    swap(lead('[data-face="focused"]'), lead('[data-face="proud"]'), t + 0.1);
    leaders.forEach((path, i) => labelIn(tl, path, q("[data-label-text]")[i], t + 0.08 + i * 0.07));
    tl.to(q("[data-version]"), { autoAlpha: 1, duration: 0.05 }, t + 0.2)
      .fromTo(
        q("[data-sticky]"),
        { scale: 0, rotation: -30, autoAlpha: 0, transformOrigin: "50% 50%" },
        { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.1, ease: "back.out(2)" },
        t + 0.3,
      )
      .to({}, { duration: 0.12 });
    return tl;
  },
};

function labelIn(tl: Timeline, leader: SVGPathElement, text: Element, at: number) {
  tl.to(leader, { strokeDashoffset: 0, duration: 0.06 }, at).to(
    text,
    { autoAlpha: 1, duration: 0.05 },
    at + 0.05,
  );
}
