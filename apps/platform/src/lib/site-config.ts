export const CONTACT_EMAIL = "patriothacksgmu@gmail.com";

export const PAGE_LINKS = [
  { href: "https://patriothackfest.com", label: "Hackathon" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/events", label: "Events" },
];

export const CONTACT_LINKS = [
  {
    icon: "linkedin",
    label: "linkedin.com/company/patriothacks",
    href: "https://www.linkedin.com/company/patriothacks",
  },
  { icon: "instagram", label: "instagram.com/patriothacks", href: "https://instagram.com/patriothacks" },
  { icon: "email", label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
] as const;

export const EVENTS = [
  { title: "Fall Hackathon", dates: "Nov 14 – 20", href: "https://patriothackfest.com" },
  {
    title: "MITRE x NICT Event",
    dates: "Dec 16 – 17",
    href: "https://create.nict.go.jp/ai-breach-challenge-2026/",
  },
];

export type Sponsor = {
  name: string;
  logo: string;
  url: string;
  /** Bumps compact logos up to the visual size of the wide wordmarks. */
  scale?: number;
};

export const SPONSORS: Sponsor[] = [
  { name: "Microsoft", logo: "/sponsors/microsoft.png", url: "https://microsoft.com" },
  { name: "AWS", logo: "/sponsors/aws.png", scale: 1.5, url: "https://aws.amazon.com" },
  { name: "Palantir", logo: "/sponsors/palantir.png", url: "https://palantir.com" },
  { name: "Salesforce", logo: "/sponsors/salesforce.png", scale: 1.55, url: "https://salesforce.com" },
  { name: "MetroStar", logo: "/sponsors/metrostar.png", scale: 1.35, url: "https://metrostar.com" },
  { name: "EY", logo: "/sponsors/ey.png", scale: 1.9, url: "https://ey.com" },
  { name: "Peraton", logo: "/sponsors/peraton.png", url: "https://peraton.com" },
  { name: "Red Bull Basement", logo: "/sponsors/redbull.png", scale: 1.7, url: "https://redbull.com/basement" },
  { name: "Cloudforce", logo: "/sponsors/cloudforce.png", url: "https://gocloudforce.com" },
  { name: "Department of Treasury", logo: "/sponsors/treasury.png", scale: 2, url: "https://home.treasury.gov" },
  { name: "Fannie Mae", logo: "/sponsors/fannie-mae.png", url: "https://fanniemae.com" },
  { name: "GDIT", logo: "/sponsors/gdit.png", url: "https://gdit.com" },
];

const pick = (...names: string[]) => names.map((n) => SPONSORS.find((s) => s.name === n)!);

export const HOME_LOGOS: Sponsor[] = [
  ...pick("Microsoft", "Palantir", "Salesforce", "AWS"),
  { name: "GitHub", logo: "/sponsors/github.png", url: "https://github.com" },
  { name: "LinkedIn", logo: "/sponsors/linkedin.png", url: "https://linkedin.com" },
];
