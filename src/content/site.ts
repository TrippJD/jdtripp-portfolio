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

// Experience timeline, oldest first so the route ends at the current role.
export type Leg = {
  company: string;
  title: string;
  location: string;
  dates: string;
  current?: boolean;
  url?: string;
  highlights: string[];
  tech: string[];
};

export const experience: {
  eyebrow: string;
  heading: string;
  intro: string;
  legs: Leg[];
  next: { label: string; heading: string; cta: string };
} = {
  eyebrow: "Flight log",
  heading: "Five stops, one trajectory.",
  intro: "Ten years from freelance sites to leading a dev team. Scroll to follow the route.",
  legs: [
    {
      company: "Freelance",
      title: "Web developer and graphic designer",
      location: "Lehi, UT",
      dates: "2016 – 2020",
      highlights: [
        "Designed and built custom websites and web apps for small and mid-sized businesses",
        "Set clients up with a CMS so they could manage their own content",
      ],
      tech: ["React", "Gatsby", "Responsive design", "Illustrator", "Photoshop"],
    },
    {
      company: "Accolade Bio-Clinical",
      title: "Web developer",
      location: "Arizona City, AZ",
      dates: "2016 – 2020",
      highlights: [
        "Built front- and back-end components in React, including data-tracking dashboards",
        "Cut load times by 25% on average and app dependencies by 33% in six months",
        "Kept components up to modern security, accessibility and SEO standards",
      ],
      tech: ["React", "JavaScript", "Dashboards", "Performance"],
    },
    {
      company: "Software Technology Group",
      title: "Front-end developer",
      location: "Salt Lake City, UT",
      dates: "2020 – 2021",
      highlights: [
        "Built front-end features for Modere's e-commerce sites in React",
        "Created reusable components wired to design tokens for a consistent UI",
        "Added unit and end-to-end tests, and caching that sped up load times",
      ],
      tech: ["React", "Design tokens", "Testing", "Caching"],
    },
    {
      company: "Modere",
      title: "Senior software developer",
      location: "Springville, UT",
      dates: "2021 – 2025",
      url: "https://www.modere.com",
      highlights: [
        "Led a six-month rollout of a new headless CMS for the e-commerce site as primary developer",
        "Built responsive sites and apps with TypeScript, React and Angular",
        "Named Most Valued Employee in 2022",
      ],
      tech: ["TypeScript", "React", "Next.js", "Angular", "Contentstack", "SASS"],
    },
    {
      company: "Troomi",
      title: "Senior full-stack developer and team lead",
      location: "Orem, UT",
      dates: "2025 – Now",
      current: true,
      url: "https://troomi.com",
      highlights: [
        "Promoted to team lead shortly after joining: release planning, timelines and code reviews",
        "Mentor developers through pairing, reviews and architecture discussions",
        "Build e-commerce features, executive analytics dashboards and support automation tools",
      ],
      tech: ["React", "Node.js", "Express", "MariaDB", "MongoDB", "Redis"],
    },
  ],
  next: {
    label: "Next leg",
    heading: "Your team?",
    cta: "Get in touch",
  },
};

// Skills list and the scrolling tech strip under it.
export const skills = {
  eyebrow: "Systems",
  heading: "What I bring on board.",
  items: [
    {
      title: "Front end",
      description:
        "Interfaces that feel fast and look sharp, built from reusable components and design tokens.",
      tech: ["React", "Next.js", "TypeScript", "Angular", "Redux", "Tailwind CSS", "SASS"],
    },
    {
      title: "Back end and APIs",
      description:
        "REST and GraphQL APIs in Node.js and Express, designed to be easy to use and hard to break.",
      tech: ["Node.js", "Express", "REST", "GraphQL"],
    },
    {
      title: "Data and dashboards",
      description:
        "Data models across SQL and NoSQL, and the dashboards that turn them into decisions.",
      tech: ["MariaDB", "PostgreSQL", "MongoDB", "Redis"],
    },
    {
      title: "Leadership",
      description:
        "Release planning, code reviews and mentoring that keep a team shipping on schedule.",
      tech: ["Release planning", "Code review", "Mentoring", "CI/CD", "Testing"],
    },
    {
      title: "Design",
      description:
        "A designer's eye from years of freelance graphic design, so the details get noticed.",
      tech: ["UI/UX", "Design systems", "Illustrator", "Photoshop"],
    },
  ],
  marquee: [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Express",
    "GraphQL",
    "MariaDB",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "Angular",
    "Redux",
    "Tailwind CSS",
    "SASS",
    "Contentstack",
    "Git",
    "CI/CD",
  ],
} as const;

// "How this site was built": the site as its own case study.
export const build = {
  eyebrow: "Under the hood",
  heading: "The decisions behind the scroll.",
  intro:
    "My professional work lives in private codebases, so here's one you can read. These are the calls I made building this site, and why.",
  features: [
    {
      title: "One frame loop",
      body: "Smooth scrolling runs on the same ticker as the animations instead of its own, so scroll and motion never fight over frames.",
      tag: "Lenis + GSAP",
    },
    {
      title: "Effects clean up after themselves",
      body: "Every animation is scoped to its component and torn down when it unmounts. The star field stops drawing the moment it leaves the screen.",
      tag: "React + useGSAP",
    },
    {
      title: "Reduced motion is a real mode",
      body: "With reduced motion turned on, nothing pins or streaks, the flight log stacks vertically, and every piece of content is still there.",
      tag: "Accessibility",
    },
    {
      title: "Layouts adapt, not just shrink",
      body: "The flight log scrolls sideways on desktop and becomes a vertical route on phones. Skill details open on hover with a mouse and stay open on touch.",
      tag: "Responsive design",
    },
    {
      title: "Content kept out of the code",
      body: "Every word on the page lives in one typed file, so copy changes never touch a component and the compiler catches anything missing.",
      tag: "TypeScript",
    },
    {
      title: "Shipped like real work",
      body: "Prettier, ESLint and strict TypeScript, with every push to main building and deploying to Vercel automatically.",
      tag: "Vercel",
    },
  ],
  stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "GSAP", "Lenis", "Vercel"],
  repo: "https://github.com/TrippJD/jdtripp-portfolio",
} as const;

// About section. Written for a hiring manager: who I am, how I work, why it matters.
export const about = {
  eyebrow: "About",
  heading: "Hand me the hard problem.",
  paragraphs: [
    "I'm Josh. For ten years I've taken software from a rough idea to something people depend on every day. When a project lands on my desk, I own all of it: the data model, the API, the interface, the release, and what happens when something breaks.",
    "I learn fast because I've had to. I started out in aerospace and worked my way into software, and I've been picking up whatever the next problem demands ever since. New stack, new domain, unfamiliar codebase: I get productive quickly and leave things better than I found them.",
    "Leading a team taught me that great engineering is a team result. I set clear priorities, keep code reviews fast and honest, and make sure every developer knows what we're shipping, why, and by when. The goal is a team that hits its dates and gets stronger with every release.",
    "If you need someone who can build it and lead the people building it, let's talk.",
  ],
  photo: {
    src: "/images/josh-portrait.jpg",
    alt: "Black and white portrait of Josh Tripp with a slight smile, short gray hair, a trimmed beard and a hoodie",
  },
  badge: [
    { label: "Name", value: "Josh Tripp" },
    { label: "Role", value: "Full-stack / Team lead" },
    { label: "Base", value: "Provo, UT" },
    { label: "Studied", value: "Aerospace, UVU" },
    { label: "Training", value: "Zero To Mastery" },
  ],
} as const;

// Contact section.
export const contact = {
  eyebrow: "Contact",
  heading: "Ready when you are.",
  intro:
    "Hiring a senior engineer or a team lead? Tell me about the role, the team and the problem you're solving, and I'll get back to you.",
  elsewhere: [
    { label: "LinkedIn", href: site.links.linkedin },
    { label: "GitHub", href: site.links.github },
  ],
  success: {
    heading: "Message received.",
    body: "Thanks for reaching out. I'll reply to the email you gave me soon.",
    again: "Send another message",
  },
} as const;

export const navLinks = [
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

// Footer.
export const footer = {
  tagline: "Senior full-stack developer and team lead in Provo, Utah.",
  signoff: "Designed and built by Josh Tripp. Next.js on Vercel.",
} as const;
