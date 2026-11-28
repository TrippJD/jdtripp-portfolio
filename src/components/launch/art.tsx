// Drawing pieces for the "Launch day" story: the crew, the rocket and their props.
// Everything is drawn in one 1600×900 space with thick ink outlines and flat fills,
// in the site's night palette plus a few toy colours.
//
// Parts that animate carry a data attribute (data-arm, data-face, data-nose...) so each
// scene's timeline can find them. Rotations that need a fixed pivot (arms, the tower arm)
// are written as a `rotate()` transform attribute, which GSAP tweens as a string; that
// keeps the pivot exact without fighting SVG transform origins.

import { useId, type ReactNode } from "react";

export const P = {
  ink: "#0a0f1c",
  space2: "#111829",
  space3: "#1a2338",
  line: "#26304a",
  paper: "#e8ecf2",
  haze: "#8a94a8",
  signal: "#3d7bff",
  flare: "#ff7a2f",
  sun: "#ffc94d",
  pink: "#ff6b9a",
  mint: "#5fe3a1",
  lilac: "#a98bff",
  coral: "#ff6f61",
  teal: "#2fd0d8",
  cream: "#fbf7ef",
  suit: "#f3f5fb",
  blush: "#ff8fb1",
  glass: "#a9d4ff",
  window: "#1b2a4d",
  metal: "#b9c3d6",
  steel: "#7d8aa6",
  coffee: "#6b3f22",
} as const;

/** Hidden until a timeline reveals it (GSAP's autoAlpha reads both properties). */
export const HIDDEN = { opacity: 0, visibility: "hidden" } as const;

// Trig results can differ in the last digit between JavaScript engines, so round anything
// that reaches the markup; otherwise the server and browser could disagree on hydration.
export const round = (n: number) => Math.round(n * 10) / 10;

/** A stable id that is safe inside url(#…) references. */
export function useSvgId(prefix: string) {
  return prefix + useId().replace(/[^a-zA-Z0-9_-]/g, "");
}

const ink = (width = 3) => ({
  stroke: P.ink,
  strokeWidth: width,
  strokeLinejoin: "round" as const,
});
const pen = (width = 2.6) => ({
  stroke: P.ink,
  strokeWidth: width,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
});

// ---------- faces ----------

export type Who = "lead" | "builder" | "tester";
export type Eyes = "normal" | "happy" | "determined" | "wide" | "squint" | "wink";
export type Mouth = "smile" | "grin" | "o" | "tongue" | "wavy";
export type Expression = { eyes?: Eyes; mouth?: Mouth; sweat?: boolean };
/** One crew member's face as seen through a window: who, eyes, mouth. */
export type CrewFace = [Who, Eyes, Mouth];

const CREW: Record<Who, { skin: string; accent: string }> = {
  lead: { skin: "#f2c7a2", accent: P.signal },
  builder: { skin: "#f0c19a", accent: P.sun },
  tester: { skin: "#ffd9bd", accent: P.pink },
};

export function Drop({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0,0 q-5,8 0,11 q5,-3 0,-11z"
      fill="#8fd3ff"
      {...ink(1.6)}
    />
  );
}

function Dot({
  x,
  rx = 3.6,
  ry = 4.6,
  hl = 1.3,
}: {
  x: number;
  rx?: number;
  ry?: number;
  hl?: number;
}) {
  return (
    <>
      <ellipse cx={x} cy={-3} rx={rx} ry={ry} fill={P.ink} />
      <circle cx={x + rx * 0.36} cy={-3 - ry * 0.36} r={hl} fill="#fff" />
    </>
  );
}

function EyePair({ kind }: { kind: Eyes }) {
  switch (kind) {
    case "happy":
      return <path d="M-14,-1 q4,-6 8,0 M6,-1 q4,-6 8,0" {...pen()} />;
    case "determined":
      return <path d="M-14,-7 l7,4 l-7,4 M14,-7 l-7,4 l7,4" {...pen()} />;
    case "wide":
      return (
        <>
          <Dot x={-10} rx={4.6} ry={5.6} hl={1.8} />
          <Dot x={10} rx={4.6} ry={5.6} hl={1.8} />
        </>
      );
    case "squint":
      return (
        <>
          <Dot x={-10} />
          <path d="M6,-3 h8" {...pen()} />
        </>
      );
    case "wink":
      return (
        <>
          <Dot x={-10} />
          <path d="M6,-2 q4,-5 8,0" {...pen()} />
        </>
      );
    default:
      return (
        <>
          <Dot x={-10} />
          <Dot x={10} />
        </>
      );
  }
}

function MouthShape({ kind, y = 9 }: { kind: Mouth; y?: number }) {
  switch (kind) {
    case "grin":
      return (
        <>
          <path d={`M-8,${y - 2} Q0,${y + 10} 8,${y - 2} Z`} fill={P.ink} {...ink(1.5)} />
          <path
            d={`M-4,${y + 4} Q0,${y + 7.5} 4,${y + 4} Q0,${y + 2} -4,${y + 4} Z`}
            fill={P.blush}
          />
        </>
      );
    case "o":
      return <ellipse cx={0} cy={y + 1} rx={3.4} ry={4.4} fill={P.ink} />;
    case "tongue":
      return (
        <>
          <path d={`M2,${y + 1.5} q2,7 6.5,1.5 z`} fill={P.blush} {...ink(1.6)} />
          <path d={`M-6,${y - 1} Q0,${y + 4} 6,${y - 1}`} {...pen()} />
        </>
      );
    case "wavy":
      return (
        <path
          d={`M-7,${y + 1} q1.75,-3 3.5,0 q1.75,3 3.5,0 q1.75,-3 3.5,0 q1.75,3 3.5,0`}
          {...pen(2.2)}
        />
      );
    default:
      return <path d={`M-6,${y - 1} Q0,${y + 5} 6,${y - 1}`} {...pen()} />;
  }
}

function Freckles() {
  return (
    <g fill="#9a5a34" fillOpacity={0.55}>
      <circle cx={-19} cy={1} r={1.2} />
      <circle cx={-15} cy={3} r={1.2} />
      <circle cx={-18} cy={5} r={1} />
      <circle cx={19} cy={1} r={1.2} />
      <circle cx={15} cy={3} r={1.2} />
      <circle cx={18} cy={5} r={1} />
    </g>
  );
}

/** A face centred on (0, 0), radius 27. */
export function Face({
  who,
  eyes = "normal",
  mouth = "smile",
  sweat = false,
}: { who: Who } & Expression) {
  const { skin } = CREW[who];
  return (
    <>
      {who === "tester" && <circle cx={6} cy={-30} r={10} fill="#c9573a" {...ink(2)} />}
      <circle r={27} fill={skin} {...ink(2.4)} />
      {who === "lead" && (
        <path
          d="M-27,2 Q-31,-30 -4,-32 Q26,-34 28,-4 Q24,-18 14,-19 Q4,-12 -6,-19 Q-16,-14 -22,-6 Q-25,-2 -27,2 Z"
          fill="#6b4228"
          {...ink(2)}
        />
      )}
      {who === "builder" && (
        <>
          <path
            d="M-27,-8 L-26,-28 L-16,-24 L-11,-39 L-2,-28 L6,-40 L12,-26 L23,-32 L27,-8 Q0,-22 -27,-8 Z"
            fill="#2b1d16"
            {...ink(2)}
          />
          <path
            d="M-27.5,-13 Q0,-24 27.5,-13 L27.5,-7 Q0,-18 -27.5,-7 Z"
            fill={P.mint}
            {...ink(2)}
          />
          <Freckles />
        </>
      )}
      {who === "tester" && (
        <path
          d="M-27,3 Q-29,-31 0,-31 Q29,-31 27,3 Q25,-13 12,-18 Q-4,-9 -27,3 Z"
          fill="#c9573a"
          {...ink(2)}
        />
      )}
      <ellipse cx={-17} cy={5} rx={5} ry={3} fill={P.blush} fillOpacity={0.7} />
      <ellipse cx={17} cy={5} rx={5} ry={3} fill={P.blush} fillOpacity={0.7} />
      <EyePair kind={eyes} />
      <MouthShape kind={mouth} />
      {sweat && <Drop x={24} y={-20} s={1.1} />}
    </>
  );
}

// ---------- astronauts ----------

type AstroProps = {
  who: Who;
  /** Arm angles in degrees: 0 hangs straight down; negative swings the right arm out and up. */
  armL?: number;
  armR?: number;
  flip?: boolean;
  /** Named expressions; the first (or `show`) is visible, the rest wait for a timeline. */
  faces?: Record<string, Expression>;
  show?: string;
  /** Drawn in the hand: the arm's local space, with the glove at (0, 26). */
  leftProp?: ReactNode;
  rightProp?: ReactNode;
};

/** A chibi astronaut with its feet at (0, 0), about 160 tall. */
export function Astro({
  who,
  armL = 15,
  armR = -15,
  flip = false,
  faces = { base: {} },
  show,
  leftProp,
  rightProp,
}: AstroProps) {
  const { accent } = CREW[who];
  const names = Object.keys(faces);
  const visible = show ?? names[0];
  const arm = (side: -1 | 1, rot: number, prop?: ReactNode) => (
    <g transform={`translate(${side * 28} -56)`}>
      <g data-arm={side < 0 ? "l" : "r"} transform={`rotate(${rot})`}>
        {prop}
        <rect x={-6} y={-2} width={12} height={28} rx={6} fill={P.suit} {...ink()} />
        <circle cy={26} r={7.5} fill={accent} {...ink()} />
      </g>
    </g>
  );
  return (
    <g transform={flip ? "scale(-1 1)" : undefined}>
      <rect x={-31} y={-64} width={62} height={38} rx={13} fill="#c5cee0" {...ink()} />
      <rect x={-17} y={-26} width={14} height={26} rx={7} fill={P.suit} {...ink()} />
      <rect x={3} y={-26} width={14} height={26} rx={7} fill={P.suit} {...ink()} />
      <rect x={-19} y={-11} width={17} height={11} rx={5.5} fill={accent} {...ink()} />
      <rect x={2} y={-11} width={17} height={11} rx={5.5} fill={accent} {...ink()} />
      <rect x={-25} y={-66} width={50} height={48} rx={21} fill={P.suit} {...ink()} />
      <rect x={-11} y={-50} width={22} height={13} rx={4} fill={accent} {...ink(2)} />
      <circle cx={-5} cy={-43.5} r={2.2} fill="#fff" />
      <circle cx={1.5} cy={-43.5} r={2.2} fill={P.mint} />
      <circle cx={7} cy={-43.5} r={1.6} fill={P.coral} />
      {arm(-1, armL, leftProp)}
      {arm(1, armR, rightProp)}
      <rect x={-24} y={-70} width={48} height={10} rx={5} fill={accent} {...ink()} />
      <line x1={16} y1={-137} x2={23} y2={-153} {...pen(3)} />
      <circle cx={24} cy={-157} r={6.5} fill={accent} {...ink(2.6)} />
      <circle cy={-100} r={40} fill={P.glass} fillOpacity={0.22} />
      <g transform={`translate(0 -96)${flip ? " scale(-1 1)" : ""}`}>
        {names.map((name) => (
          <g key={name} data-face={name} style={name === visible ? undefined : HIDDEN}>
            <Face who={who} {...faces[name]} />
          </g>
        ))}
      </g>
      <circle cy={-100} r={40} fill="none" {...ink(3.4)} />
      <path
        d="M-27,-114 A30,30 0 0 1 -8,-131"
        stroke="#fff"
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
        opacity={0.75}
      />
      <circle cx={-31} cy={-101} r={2.8} fill="#fff" opacity={0.7} />
    </g>
  );
}

// ---------- the rocket ----------

/** The porthole's centre height and radii, in the rocket's own units. */
export const PORT = { y: -40, ring: 46, glass: 35 };

function PortholeFaces({ faces }: { faces: CrewFace[] }) {
  const spots: [number, number, number][] =
    faces.length === 1
      ? [[0, PORT.y + 6, 0.8]]
      : faces.length === 2
        ? [
            [-15, PORT.y + 6, 0.66],
            [15, PORT.y + 6, 0.66],
          ]
        : [
            [-20, PORT.y + 8, 0.62],
            [20, PORT.y + 8, 0.62],
            [0, PORT.y + 2, 0.68],
          ];
  return (
    <>
      {faces.map(([who, eyes, mouth], i) => (
        <g key={i} transform={`translate(${spots[i][0]} ${spots[i][1]}) scale(${spots[i][2]})`}>
          <Face who={who} eyes={eyes} mouth={mouth} />
        </g>
      ))}
    </>
  );
}

export function Flame({ sx = 1, sy = 1 }: { sx?: number; sy?: number }) {
  return (
    <g transform={`translate(0 150) scale(${sx} ${sy})`}>
      <g data-flame>
        <path
          d="M-42,0 C-52,46 -28,84 -18,118 C-12,104 -6,110 0,150 C6,110 12,104 18,118 C28,84 52,46 42,0 Z"
          fill={P.flare}
          {...ink()}
        />
        <path d="M-27,0 C-33,38 -14,70 0,104 C14,70 33,38 27,0 Z" fill={P.sun} />
        <path d="M-12,0 C-15,22 -6,42 0,60 C6,42 15,22 12,0 Z" fill="#fff4d6" />
      </g>
    </g>
  );
}

export const FIN_LEFT = "M-80,30 C-122,40 -140,96 -132,150 C-112,142 -92,132 -70,124 Z";

type RocketProps = {
  /** Named sets of faces in the porthole; the first (or `show`) is visible. */
  crew?: Record<string, CrewFace[]>;
  show?: string;
  /** How far the nose cone hangs above the body. 0 means attached. */
  noseLift?: number;
  /** Draw the left fin hidden, so a timeline can reveal it once it's fitted. */
  finLeftHidden?: boolean;
  /** Draw as a dashed blueprint sketch. */
  sketch?: boolean;
  flame?: [number, number];
  flag?: ReactNode;
};

/** The rocket around (0, 0): antenna ball near y -206, nozzle exit near y 157. */
export function Rocket({
  crew,
  show,
  noseLift = 0,
  finLeftHidden,
  sketch,
  flame,
  flag,
}: RocketProps) {
  const clip = useSvgId("porthole");
  const S = (fill: string) =>
    sketch
      ? {
          fill: "none",
          stroke: "#79a3ff",
          strokeWidth: 3,
          strokeDasharray: "14 9",
          strokeLinejoin: "round" as const,
        }
      : { fill, ...ink(3.4) };
  const crewNames = crew ? Object.keys(crew) : [];
  const visibleCrew = show ?? crewNames[0];
  const bolts = [0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
    const t = (a * Math.PI) / 180;
    return (
      <circle
        key={a}
        cx={round(Math.cos(t) * (PORT.ring - 5.5))}
        cy={round(PORT.y + Math.sin(t) * (PORT.ring - 5.5))}
        r={2.2}
        fill={P.ink}
        fillOpacity={0.35}
      />
    );
  });

  const nose = (
    <g transform={`translate(0 ${-noseLift})`}>
      <g data-nose>
        <line
          x1={0}
          y1={-190}
          x2={0}
          y2={-200}
          stroke={sketch ? "#79a3ff" : P.ink}
          strokeWidth={3.4}
        />
        <circle cy={-206} r={7.5} {...S(P.sun)} />
        {flag}
        <path
          d="M0,-190 C30,-180 52,-155 66.5,-120 Q0,-102 -66.5,-120 C-52,-155 -30,-180 0,-190 Z"
          {...S(P.coral)}
        />
        {!sketch && (
          <path
            d="M-32,-150 Q-24,-170 -8,-178"
            stroke="#fff"
            strokeWidth={5}
            strokeLinecap="round"
            fill="none"
            opacity={0.55}
          />
        )}
      </g>
    </g>
  );

  return (
    <g>
      {flame && <Flame sx={flame[0]} sy={flame[1]} />}
      <path
        data-fin-left
        d={FIN_LEFT}
        {...S(P.signal)}
        style={finLeftHidden ? HIDDEN : undefined}
      />
      <path d="M80,30 C122,40 140,96 132,150 C112,142 92,132 70,124 Z" {...S(P.signal)} />
      <path d="M-44,126 L-52,152 Q0,162 52,152 L44,126 Z" {...S("#9aa6bd")} />
      <path
        d="M0,-190 C30,-180 52,-155 66.5,-120 C81,-85 88,-40 88,10 C88,80 72,118 62,130 L-62,130 C-72,118 -88,80 -88,10 C-88,-40 -81,-85 -66.5,-120 C-52,-155 -30,-180 0,-190 Z"
        {...S(P.cream)}
      />
      {!sketch && (
        <>
          <path
            d="M66.5,-120 C81,-85 88,-40 88,10 C88,80 72,118 62,130 L48,130 C60,112 72,76 72,10 C72,-46 62,-92 50,-118 Z"
            fill={P.ink}
            fillOpacity={0.09}
          />
          <path
            d="M-62,-70 C-72,-30 -73,30 -64,78"
            stroke="#fff"
            strokeWidth={7}
            strokeLinecap="round"
            fill="none"
            opacity={0.6}
          />
        </>
      )}
      <path d="M-87,58 Q0,76 87,58 L84,84 Q0,102 -84,84 Z" {...S(P.sun)} />
      <rect x={-9} y={96} width={18} height={58} rx={9} {...S(P.signal)} />
      {noseLift > 0 && (
        <path d="M-66.5,-120 Q0,-102 66.5,-120 Q0,-134 -66.5,-120 Z" fill="#d9d3c6" {...ink()} />
      )}
      {noseLift === 0 && nose}
      <circle cy={PORT.y} r={PORT.ring} {...S(P.sun)} />
      {!sketch && bolts}
      <circle
        cy={PORT.y}
        r={PORT.glass}
        {...(sketch ? S("none") : { fill: P.window, ...ink(2.8) })}
      />
      {crew && !sketch && (
        <>
          <clipPath id={clip}>
            <circle cy={PORT.y} r={PORT.glass} />
          </clipPath>
          <g clipPath={`url(#${clip})`}>
            {crewNames.map((name) => (
              <g key={name} data-crew={name} style={name === visibleCrew ? undefined : HIDDEN}>
                <PortholeFaces faces={crew[name]} />
              </g>
            ))}
          </g>
        </>
      )}
      {!sketch && (
        <path
          d={`M${-PORT.glass * 0.62},${PORT.y - PORT.glass * 0.55} A${PORT.glass * 0.75},${PORT.glass * 0.75} 0 0 1 ${PORT.glass * 0.1},${PORT.y - PORT.glass * 0.8}`}
          stroke="#fff"
          strokeWidth={4.5}
          strokeLinecap="round"
          fill="none"
          opacity={0.75}
        />
      )}
      <circle cy={34} r={13} {...S(P.sun)} />
      <circle cy={34} r={7.5} {...(sketch ? S("none") : { fill: P.window, ...ink(2.2) })} />
      {noseLift > 0 && nose}
    </g>
  );
}

// ---------- the bug ----------

/** A small bug with big eyes, centred on (0, 0). */
export function Bug({ wings }: { wings?: boolean }) {
  return (
    <g>
      {wings && (
        <g data-wings>
          <g fill="#fff" fillOpacity={0.6} {...ink(1.8)}>
            <ellipse cx={-17} cy={-4} rx={15} ry={7.5} transform="rotate(-28 -17 -4)" />
            <ellipse cx={17} cy={-4} rx={15} ry={7.5} transform="rotate(28 17 -4)" />
          </g>
          <path d="M-36,-18 l-6,-4 M-38,-8 l-8,0 M36,-18 l6,-4 M38,-8 l8,0" {...pen(2.2)} />
        </g>
      )}
      <g {...pen(2.6)}>
        <path d="M-9,-2 L-19,-9 M-11,5 L-21,6 M-9,11 L-17,18 M9,-2 L19,-9 M11,5 L21,6 M9,11 L17,18" />
        <path d="M-5,-24 Q-9,-34 -15,-35 M5,-24 Q9,-34 15,-35" />
      </g>
      <circle cx={-16} cy={-36} r={3.2} fill={P.pink} {...ink(1.8)} />
      <circle cx={16} cy={-36} r={3.2} fill={P.pink} {...ink(1.8)} />
      <ellipse cy={6} rx={14} ry={15} fill={P.mint} {...ink(2.8)} />
      <line x1={0} y1={-8} x2={0} y2={21} stroke={P.ink} strokeWidth={2} />
      <circle cx={-6} cy={6} r={2.6} fill={P.ink} />
      <circle cx={7} cy={12} r={2.4} fill={P.ink} />
      <circle cx={-5} cy={15} r={2} fill={P.ink} />
      <circle cy={-15} r={11} fill="#9bf0c4" {...ink(2.8)} />
      <circle cx={-4.5} cy={-16} r={4.4} fill="#fff" {...ink(1.6)} />
      <circle cx={4.5} cy={-16} r={4.4} fill="#fff" {...ink(1.6)} />
      <circle cx={-3.8} cy={-15} r={2} fill={P.ink} />
      <circle cx={5.2} cy={-15} r={2} fill={P.ink} />
      <path d="M-3,-9 q3,2.5 6,0" {...pen(1.8)} />
      <Drop x={13} y={-30} s={0.9} />
    </g>
  );
}

function Twinkle({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <path
      d={`M${x},${y - r} Q${x},${y} ${x + r},${y} Q${x},${y} ${x},${y + r} Q${x},${y} ${x - r},${y} Q${x},${y} ${x},${y - r} Z`}
      fill={P.sun}
      {...ink(1.6)}
    />
  );
}

/** The same bug after one swing of a wrench: a pancake with dizzy stars. */
export function SquashedBug() {
  return (
    <g>
      <path d="M-14,2 L-24,-4 M-8,4 L-14,12 M6,4 L12,12 M14,2 L26,-2 M-22,0 L-32,2" {...pen(2.6)} />
      <ellipse rx={22} ry={6.5} fill={P.mint} {...ink(2.6)} />
      <circle cx={-5} r={1.8} fill={P.ink} />
      <circle cx={6} cy={1} r={1.8} fill={P.ink} />
      <ellipse cx={-24} cy={-2} rx={9} ry={5.5} fill="#9bf0c4" {...ink(2.4)} />
      <path
        d="M-29,-5 l3.5,3.5 M-25.5,-5 l-3.5,3.5 M-23,-5 l3.5,3.5 M-19.5,-5 l-3.5,3.5"
        {...pen(1.6)}
      />
      <g data-dizzy>
        <ellipse
          cx={-2}
          cy={-24}
          rx={26}
          ry={7}
          fill="none"
          stroke={P.sun}
          strokeOpacity={0.7}
          strokeWidth={1.6}
          strokeDasharray="3 4"
        />
        <Twinkle x={-24} y={-26} r={6} />
        <Twinkle x={4} y={-32} r={7} />
        <Twinkle x={22} y={-21} r={5} />
      </g>
    </g>
  );
}

// ---------- props ----------

/** A magnifying glass with its lens at (0, 0) and the handle running down-right. */
export function Magnifier({ r = 30 }: { r?: number }) {
  return (
    <g>
      <line
        x1={r * 0.7}
        y1={r * 0.7}
        x2={r * 1.9}
        y2={r * 1.9}
        stroke={P.ink}
        strokeWidth={15}
        strokeLinecap="round"
      />
      <line
        x1={r * 0.7}
        y1={r * 0.7}
        x2={r * 1.9}
        y2={r * 1.9}
        stroke={P.coral}
        strokeWidth={8.5}
        strokeLinecap="round"
      />
      <circle r={r} fill={P.teal} fillOpacity={0.16} stroke={P.ink} strokeWidth={8} />
      <circle r={r} fill="none" stroke={P.sun} strokeWidth={4.5} />
      <path
        d={`M${-r * 0.6},${-r * 0.5} A${r * 0.78},${r * 0.78} 0 0 1 ${-r * 0.1},${-r * 0.78}`}
        stroke="#fff"
        strokeWidth={4}
        strokeLinecap="round"
        fill="none"
        opacity={0.7}
      />
    </g>
  );
}

/** A wrench lying along +y from (0, from) to its head at (0, to): for holding in a hand. */
export function Wrench({ from = 22, to = 80 }: { from?: number; to?: number }) {
  return (
    <g>
      <rect
        x={-5.5}
        y={from}
        width={11}
        height={to - from - 6}
        rx={5.5}
        fill={P.metal}
        {...ink(2.6)}
      />
      <path
        transform={`translate(0 ${to}) rotate(90)`}
        d="M9,-7 A15,15 0 1 0 9,7 L3,4.5 L3,-4.5 Z"
        fill={P.metal}
        {...ink(2.6)}
      />
    </g>
  );
}

export function Mug({ steam }: { steam?: boolean }) {
  return (
    <g>
      {steam && (
        <path
          data-steam
          d="M-4,-18 q-5,-8 0,-14 q5,-6 0,-12 M5,-18 q-5,-8 0,-14"
          stroke={P.paper}
          strokeOpacity={0.6}
          strokeWidth={2.4}
          fill="none"
          strokeLinecap="round"
        />
      )}
      <path d="M9,-6 q9,0 9,6 q0,6 -9,6" stroke={P.ink} strokeWidth={3.2} fill="none" />
      <rect x={-10} y={-13} width={20} height={24} rx={4} fill={P.coral} {...ink(2.6)} />
      <ellipse cy={-12} rx={8} ry={2.6} fill={P.coffee} />
    </g>
  );
}

/** A comic-book burst with a word in it, centred on (0, 0). */
export function Burst({ r, text, rot = -8 }: { r: number; text: string; rot?: number }) {
  const points = Array.from({ length: 24 }, (_, i) => {
    const a = (i * Math.PI) / 12;
    const rr = i % 2 ? r * 0.66 : r;
    return `${(Math.cos(a) * rr * 1.25).toFixed(1)},${(Math.sin(a) * rr).toFixed(1)}`;
  }).join(" ");
  return (
    <g transform={`rotate(${rot})`}>
      <polygon points={points} fill={P.sun} {...ink(3.2)} />
      <text
        y={11}
        textAnchor="middle"
        className="font-sans"
        fontWeight={700}
        fontSize={32}
        fill={P.ink}
      >
        {text}
      </text>
    </g>
  );
}

/** A success notification with a tick. Top-left at (0, 0). */
export function Toast({ text }: { text: string }) {
  const w = text.length * 12.5 + 70;
  return (
    <g>
      <rect width={w} height={54} rx={27} fill={P.space2} stroke={P.mint} strokeWidth={2.5} />
      <circle cx={28} cy={27} r={14} fill={P.mint} />
      <path d="M21,27 l5,5 l9,-10" {...pen(3.2)} />
      <text x={52} y={34} className="font-mono" fontSize={20} fill={P.paper}>
        {text}
      </text>
    </g>
  );
}

/** A speech bubble with its top-left at (x, y) and a tail at the bottom. */
export function Bubble({
  x,
  y,
  w,
  text,
  size = 22,
  tail = "left",
}: {
  x: number;
  y: number;
  w: number;
  text: string;
  size?: number;
  tail?: "left" | "right";
}) {
  const h = size + 30;
  const tx = tail === "left" ? x + 30 : x + w - 30;
  const dir = tail === "left" ? -1 : 1;
  return (
    <g>
      <path
        d={`M${tx - 10},${y + h - 2} L${tx + dir * 12},${y + h + 22} L${tx + 14},${y + h - 2} Z`}
        fill="#fff"
        {...ink()}
      />
      <rect x={x} y={y} width={w} height={h} rx={18} fill="#fff" {...ink()} />
      <rect x={tx - 8} y={y + h - 6} width={20} height={5} fill="#fff" />
      <text
        x={x + w / 2}
        y={y + h / 2 + size * 0.36}
        textAnchor="middle"
        className="font-mono"
        fontSize={size}
        fill={P.ink}
      >
        {text}
      </text>
    </g>
  );
}

/** A soft cloud of smoke centred on (0, 0). */
export function Puff({ opacity = 0.55 }: { opacity?: number }) {
  const parts: [number, number, number, string][] = [
    [-30, 0, 26, "#ece8ff"],
    [0, -14, 32, "#f6f4ff"],
    [32, -2, 24, "#e4ddff"],
    [12, 10, 22, "#f2efff"],
    [-14, 12, 20, "#e8e2ff"],
  ];
  return (
    <g fillOpacity={opacity}>
      {parts.map(([x, y, r, fill]) => (
        <circle key={`${x},${y}`} cx={x} cy={y} r={r} fill={fill} />
      ))}
    </g>
  );
}

export function Ground({ y = 810 }: { y?: number }) {
  return (
    <>
      <rect y={y} width={1600} height={900 - y} fill="#0d1428" />
      <line x1={0} y1={y} x2={1600} y2={y} stroke={P.line} strokeWidth={2} />
    </>
  );
}

export function Pad({ cx, y }: { cx: number; y: number }) {
  return (
    <>
      <rect
        x={cx - 160}
        y={y - 14}
        width={320}
        height={16}
        rx={5}
        fill={P.space3}
        stroke={P.line}
        strokeWidth={2}
      />
      <g fill={P.sun} fillOpacity={0.8}>
        {[-120, -60, 0, 60, 120].map((d) => (
          <path key={d} d={`M${cx + d - 10},${y - 10} h16 l-6,8 h-16 Z`} />
        ))}
      </g>
    </>
  );
}

/** A lattice launch tower with its left rail at x. */
export function Tower({
  x,
  top,
  bottom,
  opacity = 0.85,
}: {
  x: number;
  top: number;
  bottom: number;
  opacity?: number;
}) {
  let d = `M${x},${bottom}`;
  for (let y = bottom, i = 0; y > top; y -= 60, i++)
    d += ` L${i % 2 ? x : x + 60},${Math.max(top, y - 60)}`;
  return (
    <>
      <g stroke={P.steel} fill="none" opacity={opacity}>
        <line x1={x} y1={top} x2={x} y2={bottom} strokeWidth={5} />
        <line x1={x + 60} y1={top} x2={x + 60} y2={bottom} strokeWidth={5} />
        <path d={d} strokeWidth={2.5} />
      </g>
      <circle cx={x + 60} cy={top - 8} r={7} fill={P.coral} {...ink(2.4)} />
    </>
  );
}

/** A comic-style close-up of the porthole at (cx, cy), joined by a dashed line to (fx, fy). */
export function Inset({
  cx,
  cy,
  r,
  faces,
  from: [fx, fy],
}: {
  cx: number;
  cy: number;
  r: number;
  faces: CrewFace[];
  from: [number, number];
}) {
  const clip = useSvgId("inset");
  const spots: [number, number, number, number][] = [
    [-0.52, 0.14, 0.44, 12],
    [0.52, 0.14, 0.44, -12],
    [0, -0.02, 0.5, 0],
  ];
  const a = Math.atan2(fy - cy, fx - cx);
  const ex = round(cx + Math.cos(a) * (r + 16));
  const ey = round(cy + Math.sin(a) * (r + 16));
  return (
    <g>
      <line
        x1={fx}
        y1={fy}
        x2={ex}
        y2={ey}
        stroke={P.paper}
        strokeOpacity={0.7}
        strokeWidth={3}
        strokeDasharray="4 9"
        strokeLinecap="round"
      />
      <circle
        cx={fx}
        cy={fy}
        r={7}
        fill="none"
        stroke={P.paper}
        strokeOpacity={0.8}
        strokeWidth={3}
      />
      <g data-inset-disc>
        <circle cx={cx} cy={cy} r={r + 16} fill={P.sun} {...ink(4)} />
        <clipPath id={clip}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
        <circle cx={cx} cy={cy} r={r} fill={P.window} {...ink()} />
        <g clipPath={`url(#${clip})`}>
          {faces.map(([who, eyes, mouth], i) => {
            const [dx, dy, k, rot] = spots[i];
            return (
              <g
                key={i}
                transform={`translate(${cx + dx * r} ${cy + dy * r}) rotate(${rot}) scale(${(k * r) / 27})`}
              >
                <Face who={who} eyes={eyes} mouth={mouth} />
              </g>
            );
          })}
        </g>
        <path
          d={`M${cx - r * 0.62},${cy - r * 0.5} A${r * 0.8},${r * 0.8} 0 0 1 ${cx - r * 0.05},${cy - r * 0.8}`}
          stroke="#fff"
          strokeWidth={7}
          strokeLinecap="round"
          fill="none"
          opacity={0.6}
        />
      </g>
    </g>
  );
}

// ---------- sky ----------

/** Deterministic random numbers, so the stars are the same on the server and in the browser. */
export function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TINTS = [P.paper, P.paper, P.paper, P.sun, P.lilac, P.teal];
const NEBULA = [P.lilac, P.teal, P.pink, P.signal];

/**
 * The night sky behind a scene: an opaque ground the same colour as the page, a few soft
 * coloured glows, and stars. `streak` stretches the stars into speed lines for the liftoff.
 */
export function Sky({
  seed,
  count = 80,
  streak = 0,
}: {
  seed: number;
  count?: number;
  streak?: number;
}) {
  const glow = useSvgId("glow");
  const r = rng(seed);
  const n = rng(seed * 7 + 3);
  const glows = Array.from({ length: 3 }, (_, i) => ({
    x: 260 + n() * 1080,
    y: 160 + n() * 460,
    r: 180 + n() * 140,
    color: NEBULA[(seed + i) % NEBULA.length],
  }));
  const stars = Array.from({ length: count }, (_, i) => ({
    i,
    x: r() * 1600,
    y: r() * 900,
    o: 0.25 + r() * 0.7,
    rad: 0.9 + r() * 1.6,
    tint: TINTS[Math.floor(r() * TINTS.length)],
    len: 30 + r() * streak,
  }));
  return (
    <g>
      <defs>
        {NEBULA.map((color) => (
          <radialGradient key={color} id={`${glow}-${color.slice(1)}`}>
            <stop offset="0" stopColor={color} stopOpacity={0.16} />
            <stop offset="1" stopColor={color} stopOpacity={0} />
          </radialGradient>
        ))}
      </defs>
      <rect width={1600} height={900} fill={P.ink} />
      {glows.map((g, i) => (
        <circle key={i} cx={g.x} cy={g.y} r={g.r} fill={`url(#${glow}-${g.color.slice(1)})`} />
      ))}
      <g data-stars>
        {stars.map((s) =>
          streak ? (
            <g key={s.i}>
              <path
                d={`M${s.x.toFixed(1)},${s.y.toFixed(1)} L${(s.x + s.rad * 0.7).toFixed(1)},${(s.y + s.len).toFixed(1)} L${(s.x - s.rad * 0.7).toFixed(1)},${(s.y + s.len).toFixed(1)} Z`}
                fill={s.tint}
                fillOpacity={s.o * 0.55}
              />
              <circle cx={s.x} cy={s.y + s.len} r={s.rad * 0.9} fill={s.tint} fillOpacity={s.o} />
            </g>
          ) : (
            <circle key={s.i} cx={s.x} cy={s.y} r={s.rad} fill={s.tint} fillOpacity={s.o} />
          ),
        )}
      </g>
    </g>
  );
}
