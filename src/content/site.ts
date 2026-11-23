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

export const navLinks = [
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;
