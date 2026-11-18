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
  width: number;
  height: number;
  url: string;
  /** Bumps compact logos up to the visual size of the wide wordmarks. */
  scale?: number;
};

export const SPONSORS: Sponsor[] = [
  { name: "Microsoft", logo: "/sponsors/microsoft.png", width: 364, height: 80, url: "https://microsoft.com" },
  { name: "AWS", logo: "/sponsors/aws.png", width: 200, height: 120, scale: 1.5, url: "https://aws.amazon.com" },
  { name: "Palantir", logo: "/sponsors/palantir.png", width: 327, height: 80, url: "https://palantir.com" },
  { name: "Salesforce", logo: "/sponsors/salesforce.png", width: 176, height: 124, scale: 1.55, url: "https://salesforce.com" },
  { name: "MetroStar", logo: "/sponsors/metrostar.png", width: 346, height: 108, scale: 1.35, url: "https://metrostar.com" },
  { name: "EY", logo: "/sponsors/ey.png", width: 150, height: 152, scale: 1.9, url: "https://ey.com" },
  { name: "Peraton", logo: "/sponsors/peraton.png", width: 353, height: 80, url: "https://peraton.com" },
  { name: "Red Bull Basement", logo: "/sponsors/redbull.png", width: 264, height: 136, scale: 1.7, url: "https://redbull.com/basement" },
  { name: "Cloudforce", logo: "/sponsors/cloudforce.png", width: 489, height: 80, url: "https://gocloudforce.com" },
  { name: "Department of Treasury", logo: "/sponsors/treasury.png", width: 160, height: 160, scale: 2, url: "https://home.treasury.gov" },
  { name: "Fannie Mae", logo: "/sponsors/fannie-mae.png", width: 395, height: 80, url: "https://fanniemae.com" },
  { name: "GDIT", logo: "/sponsors/gdit.png", width: 379, height: 80, url: "https://gdit.com" },
];

const pick = (...names: string[]) => names.map((n) => SPONSORS.find((s) => s.name === n)!);

export const HOME_LOGOS: Sponsor[] = [
  ...pick("Microsoft", "Palantir", "Salesforce", "AWS"),
  { name: "GitHub", logo: "/sponsors/github.png", width: 148, height: 34, url: "https://github.com" },
  { name: "LinkedIn", logo: "/sponsors/linkedin.png", width: 132, height: 34, url: "https://linkedin.com" },
];
