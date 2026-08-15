export const BRAND = {
  name: "High Light Source Film Studios",
  short: "HLS Film Studios",
  tagline: "Illuminating Stories. Inspiring the World.",
  support: "Where Vision Becomes Cinema.",
  descriptor:
    "An International Film Production, Education & Economic Development Company",
};

export type Film = {
  slug: string;
  title: string;
  genre: string;
  status:
    | "IN DEVELOPMENT"
    | "PRE-PRODUCTION"
    | "PRODUCTION"
    | "POST-PRODUCTION"
    | "COMING SOON";
  countries: string;
  logline: string;
  category: "ACTION" | "SUPERNATURAL" | "THRILLER" | "DRAMA" | "BUSINESS";
};

/**
 * Placeholder slate. Working titles only — no released titles are represented.
 * Replace via CMS once titles are cleared for public announcement.
 */
export const FILMS: Film[] = [
  {
    slug: "working-title-one",
    title: "Working Title I",
    genre: "Supernatural / Mystery",
    status: "IN DEVELOPMENT",
    countries: "Placeholder — countries to be confirmed",
    logline:
      "Placeholder logline. An ancient mystery resurfaces and forces a reckoning across two continents.",
    category: "SUPERNATURAL",
  },
  {
    slug: "working-title-two",
    title: "Working Title II",
    genre: "Action / Intelligence",
    status: "IN DEVELOPMENT",
    countries: "Placeholder — countries to be confirmed",
    logline:
      "Placeholder logline. An intelligence operation unravels inside a global cybersecurity crisis.",
    category: "ACTION",
  },
  {
    slug: "working-title-three",
    title: "Working Title III",
    genre: "Financial Thriller",
    status: "IN DEVELOPMENT",
    countries: "Placeholder — countries to be confirmed",
    logline:
      "Placeholder logline. A corporate takeover exposes the architecture of a hidden empire.",
    category: "BUSINESS",
  },
];

export const GENRES = [
  {
    title: "Supernatural & Mystery",
    items: [
      "Ancient mysteries",
      "Hidden worlds",
      "Unexplained phenomena",
      "Mythology",
      "Spiritual conflict",
      "Secret societies",
    ],
  },
  {
    title: "Action & Intelligence",
    items: [
      "International espionage",
      "Cybersecurity",
      "Political conspiracies",
      "Intelligence operations",
      "Global investigations",
      "Corporate espionage",
    ],
  },
  {
    title: "Financial Thrillers",
    items: [
      "Money, power, ambition",
      "Real estate & banking",
      "Corporate takeovers",
      "Financial engineering",
      "Business empires",
      "High-stakes negotiations",
    ],
  },
];

export const REGIONS = [
  {
    name: "North America",
    body: "Production opportunities, local partnerships, incentive programs and location scouting across the United States, Canada and Mexico.",
  },
  {
    name: "Europe",
    body: "Co-production treaties, cultural funds and broadcaster participation across EU and non-EU territories.",
  },
  {
    name: "Africa",
    body: "Creative industry collaboration, workforce development and location partnerships across the continent.",
  },
  {
    name: "Middle East",
    body: "Production infrastructure, rebate programs and cultural collaboration with regional film commissions.",
  },
  {
    name: "Asia-Pacific",
    body: "Distribution reach, co-financing and production services across a rapidly expanding market.",
  },
  {
    name: "Caribbean",
    body: "Locations, cultural collaboration and emerging production infrastructure.",
  },
  {
    name: "Latin America",
    body: "Local partnerships, crew depth and regional incentive frameworks.",
  },
];

export const PARTNER_AUDIENCES = [
  "Governments & Film Commissions",
  "Co-Producers",
  "Investors",
  "Broadcasters",
  "Streaming Platforms",
  "Distributors",
  "Universities",
  "Brands & Sponsors",
];

export const NEWS = [
  {
    slug: "studio-announcement-placeholder",
    category: "Studio News",
    title: "Placeholder — Studio Announcement",
    date: "Pending",
    excerpt:
      "Newsroom placeholder. Verified studio announcements will be published here.",
  },
  {
    slug: "international-partnership-placeholder",
    category: "International Partnerships",
    title: "Placeholder — International Partnership Update",
    date: "Pending",
    excerpt:
      "Newsroom placeholder. Confirmed partnership news will be published here.",
  },
  {
    slug: "academy-placeholder",
    category: "Film Academy",
    title: "Placeholder — Film Academy Update",
    date: "Pending",
    excerpt:
      "Newsroom placeholder. Academy programming news will be published here.",
  },
];
