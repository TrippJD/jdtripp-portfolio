// Site-wide content. Edit text here rather than inside components.

export const site = {
  name: { first: "Josh", last: "Tripp" },
  role: "Senior full-stack developer and team lead",
  summary:
    "Ten years of building web apps end to end, from React front ends to Node.js APIs and the databases behind them.",
  current: { title: "Team lead", company: "Troomi" },
  location: {
    city: "Provo, UT",
    lat: "40.2338° N",
    lon: "111.6585° W",
    altitude: "4,551 ft",
    timeZone: "America/Denver",
  },
  links: {
    github: "https://github.com/TrippJD",
    linkedin: "https://www.linkedin.com/in/jdtripp",
  },
} as const;

// Pinned statement after the hero. Segments marked accent are highlighted.
export const statement = {
  eyebrow: "Mission",
  segments: [
    {
      text: "I build the whole thing. The interface people touch, the API behind it, the data underneath, and",
    },
    { text: "the team that ships it.", accent: true },
  ],
  footnote: ["Front end", "Back end", "Data", "Leadership"],
} as const;

// Stats strip. Values are taken from the resume.
export const stats = {
  eyebrow: "Telemetry",
  heading: "Ten years of flight data.",
  items: [
    {
      value: "10",
      suffix: "+",
      label: "Years building for the web",
      detail: "From freelance sites to leading a dev team",
    },
    {
      value: "25",
      suffix: "%",
      label: "Faster load times",
      detail: "Average speed-up across sites at Accolade",
    },
    {
      value: "33",
      suffix: "%",
      label: "Fewer app dependencies",
      detail: "Trimmed over six months at Accolade",
    },
    {
      value: "2022",
      label: "Most Valued Employee",
      detail: "Awarded at Modere for performance and delivery",
    },
  ],
} as const;

export const navLinks = [
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;
