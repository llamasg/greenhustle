import type { FestivalPhase } from "./phase";

export type NavLink = {
  label: string;
  href: string;
  liveLabel?: string;
};

export const SITE_NAV: { brand: string; links: NavLink[] } = {
  brand: "Green Hustle",
  links: [
    { label: "Festival 2026", href: "/", liveLabel: "Live now" },
    { label: "Lineup", href: "/lineup" },
    { label: "About", href: "/about" },
  ],
};

export type HeroCta = { label: string; href: string };

export const HERO: {
  imageLabel: string;
  ariaLabel: string;
  reassurance: string;
  secondaryLink: { label: string; href: string };
  ctaByPhase: Record<FestivalPhase, HeroCta>;
} = {
  imageLabel:
    "Hero graphic, composed SVG containing festival mark, date, location, and theme. Designed in Illustrator, dropped in as a responsive asset.",
  ariaLabel:
    "Green Hustle Festival 2026, Saturday 30 May, Nottingham city centre",
  reassurance: "Free entry. No tickets. Just turn up.",
  secondaryLink: {
    label: "First time? Learn what Green Hustle is",
    href: "/about",
  },
  ctaByPhase: {
    "pre-launch": { label: "Save the date", href: "#save-the-date" },
    "lineup-live": { label: "See the lineup", href: "/lineup" },
    "festival-day": { label: "What's on right now", href: "/lineup" },
    "post-festival": { label: "Relive Green Hustle '26", href: "/lineup" },
  },
};

export type SiteCard = {
  key: "market" | "sussex" | "library";
  name: string;
  subtitle: string;
  vibe: string;
  counts: { stalls: number; acts: number };
};

export const SITES: SiteCard[] = [
  {
    key: "market",
    name: "Old Market Square",
    subtitle: "Gather",
    vibe: "The main square. Food, makers, main stage, community.",
    counts: { stalls: 23, acts: 8 },
  },
  {
    key: "sussex",
    name: "Sussex Street Tram Stop",
    subtitle: "Move",
    vibe: "Skate park energy. DJ stage, sports, gardening, paint jam.",
    counts: { stalls: 10, acts: 7 },
  },
  {
    key: "library",
    name: "Notts Central Library",
    subtitle: "Imagine",
    vibe: "Quieter and reflective. Poetry, writing, walks, lego.",
    counts: { stalls: 5, acts: 5 },
  },
];

export type PracticalBlock = {
  title: string;
  description: string;
  href: string | null;
};

export const PRACTICAL: PracticalBlock[] = [
  {
    title: "Free entry",
    description: "No tickets, no wristbands. Just turn up.",
    href: null,
  },
  {
    title: "Accessibility",
    description:
      "All three sites are step-free. BSL on request. Quiet spaces and a dedicated access team on the day.",
    href: "/about#accessibility",
  },
  {
    title: "Getting there",
    description:
      "Old Market Sq, NG1 2BY. Tram stops opposite. Parking nearby.",
    href: "/about#getting-there",
  },
  {
    title: "Food",
    description:
      "Plant-based and pay-what-you-feel options. Veggies has been cooking vegan food in Nottingham since 1984.",
    href: "/lineup?category=food",
  },
];

export const WHY_EXISTS = {
  body: "Green Hustle started in 2020 with a simple idea: that climate action is something joyful and communal, not just earnest. Six years on, we are a year-round community interest company running festivals, school projects, and rewilding work across Nottingham. The festival is one day. The work is the other 364.",
  quote: {
    text: "Green Hustle is a much-needed opportunity to get together, regardless of age, where you're from, or your interests.",
    attribution: "Adam Pickering, Co-Director",
  },
  link: { label: "Read more about what we do", href: "/about" },
};

export const SAVE_THE_DATE = {
  date: "Saturday 30 May 2026, 11am to 6pm",
  locations:
    "Old Market Square · Sussex Street Tram Stop · Notts Central Library · Nottingham city centre",
  calendarLink: "#",
};

export type FooterLink = { label: string; href: string };

export const FOOTER = {
  beyond: {
    title: "Beyond the festival",
    links: [
      { label: "Community Projects", href: "#" },
      { label: "Schools", href: "#" },
      { label: "Volunteering", href: "#" },
    ] as FooterLink[],
  },
  contact: {
    title: "Contact",
    email: "hello@thehustlecollective.com",
    socials: [
      { label: "Instagram", href: "#" },
      { label: "Facebook", href: "#" },
      { label: "TikTok", href: "#" },
    ] as FooterLink[],
    accessibilityForm: {
      label: "Share your thoughts on accessibility",
      href: "https://forms.gle/UDe9aZy8yZASVUabA",
    },
  },
  newsletter: {
    title: "Get festival updates",
    placeholder: "you@example.com",
    submit: "Subscribe",
  },
  legal: "Green Hustle CIC, Company number 14464901 · 2026",
};
