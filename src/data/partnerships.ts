/**
 * Content model for the Corporate Partnerships & Naming Rights portal.
 * All values are illustrative structures — no current partners are implied.
 */

export const PARTNER_NAV: { to: string; label: string; blurb: string }[] = [
  {
    to: "/partners",
    label: "Corporate Partnerships",
    blurb:
      "Overview of strategic relationships available with High Light Source Film Studios.",
  },
  {
    to: "/partners/naming-rights",
    label: "Naming Rights",
    blurb:
      "Studio, campus, lobby and facility naming opportunities on customized multi-year terms.",
  },
  {
    to: "/partners/automotive",
    label: "Automotive Partnerships",
    blurb:
      "Vehicles, fleets, mobility and charging infrastructure supporting production and events.",
  },
  {
    to: "/partners/founding-partners",
    label: "Founding Partners",
    blurb:
      "A limited designation for organizations shaping the launch of the studio.",
  },
  {
    to: "/partners/technology",
    label: "Technology Partnerships",
    blurb:
      "Cameras, cloud, virtual production, LED, audio, security and software collaborations.",
  },
  {
    to: "/partners/studio-development",
    label: "Studio Development",
    blurb:
      "Buildings, land, construction, energy and infrastructure contributions.",
  },
  {
    to: "/partners/production-sponsorships",
    label: "Production Sponsorships",
    blurb:
      "Title, event, premiere, travel and hospitality relationships around individual productions.",
  },
  {
    to: "/partners/education",
    label: "Education Partnerships",
    blurb:
      "Film Academy programs, scholarships, workforce development and creative training.",
  },
  {
    to: "/partners/confidential-inquiry",
    label: "Confidential Inquiry",
    blurb:
      "A discreet channel for organizations requiring private discussions.",
  },
];

export const FACILITY_NAMING = [
  "Main Lobby",
  "Soundstages",
  "Screening Theater",
  "Executive Lounge",
  "Film Academy",
  "Production Center",
  "VFX Center",
  "Music Studio",
  "Editing Suites",
  "Conference Center",
  "Innovation Lab",
  "Media Center",
  "Production Offices",
];

export const NAMING_EXAMPLES = [
  { line1: "[PARTNER NAME] PRODUCTION CENTER", line2: "at High Light Source Film Studios" },
  { line1: "THE [PARTNER NAME] GRAND LOBBY", line2: "High Light Source Film Studios" },
  { line1: "[PARTNER NAME] SCREENING THEATER", line2: "High Light Source Film Studios" },
  { line1: "HIGH LIGHT SOURCE FILM STUDIOS", line2: "at the [PARTNER NAME] MEDIA CENTER" },
];

export const AUTOMOTIVE_CONTRIBUTIONS = [
  "New vehicles",
  "Electric vehicles",
  "Luxury vehicles",
  "Production SUVs",
  "Trucks",
  "Production vans",
  "Specialty vehicles",
  "Picture cars",
  "Executive transportation",
  "Charging stations",
  "Fleet support",
];

export const AUTOMOTIVE_RECOGNITION = [
  "Founding Automotive Partner status",
  "Corporate recognition",
  "Event visibility",
  "Premiere transportation",
  "Website recognition",
  "Facility recognition",
  "Production transportation branding",
  "Social media campaigns",
  "Behind-the-scenes content",
  "VIP transportation partnership",
  "Select production integration discussions",
];

export const PROPERTY_CONTRIBUTIONS = [
  "Buildings",
  "Warehouses",
  "Commercial property",
  "Land",
  "Soundstage facilities",
  "Office space",
  "Production campuses",
  "Construction",
  "Architectural services",
  "Furniture",
  "HVAC systems",
  "Security systems",
  "Energy systems",
  "Solar installations",
  "EV charging infrastructure",
  "Network infrastructure",
];

export const PROPERTY_RECOGNITION = [
  "Facility naming",
  "Building naming",
  "Permanent plaques",
  "Founding partner recognition",
  "Partner walls",
  "Executive recognition",
  "Public announcements",
  "Digital recognition",
  "Event recognition",
];

export const TECHNOLOGY_PARTNERS = [
  "Camera manufacturers",
  "Lighting companies",
  "Computer companies",
  "Cloud providers",
  "Software companies",
  "Editing technology",
  "Audio companies",
  "VFX systems",
  "Virtual production technology",
  "Cybersecurity providers",
  "Networking companies",
  "Artificial intelligence companies",
  "Communications companies",
  "Energy companies",
];

export const TECHNOLOGY_SUPPORT = [
  "Cameras",
  "Computers",
  "Servers",
  "LED walls",
  "Lighting",
  "Editing systems",
  "Sound systems",
  "Software licenses",
  "Production hardware",
  "Communication systems",
  "Cloud infrastructure",
  "Security systems",
];

export const PRODUCTION_OPPORTUNITIES = [
  "Production sponsorship",
  "Event sponsorship",
  "Premiere sponsorship",
  "Travel partnership",
  "Hospitality partnership",
  "Wardrobe partnerships",
  "Technology partnerships",
  "Transportation sponsorship",
  "Location support",
  "Equipment sponsorship",
  "Promotional collaboration",
];

export const FOUNDING_CATEGORIES = [
  "Founding Automotive Partner",
  "Founding Technology Partner",
  "Founding Financial Partner",
  "Founding Real Estate Partner",
  "Founding Equipment Partner",
  "Founding Education Partner",
  "Founding Energy Partner",
  "Founding Hospitality Partner",
];

export const RECOGNITION_LEVELS = [
  "Founding Partner",
  "Principal Partner",
  "Official Studio Partner",
  "Naming Partner",
  "Automotive Partner",
  "Technology Partner",
  "Production Partner",
  "Education Partner",
  "Capital Partner",
  "Philanthropic Partner",
];

export const WHY_PARTNER = [
  {
    title: "Global Entertainment Association",
    body: "Associate your brand with film, television, talent, technology and international storytelling.",
  },
  {
    title: "Long-Term Brand Recognition",
    body: "Develop a multi-year relationship around facilities, productions, events or programs.",
  },
  {
    title: "International Exposure",
    body: "Potential visibility across HLS productions, digital properties, events and international partnerships.",
  },
  {
    title: "Client & Executive Hospitality",
    body: "Select partnerships may include access to premieres, screenings, industry events and executive experiences.",
  },
  {
    title: "Community Impact",
    body: "Support education, workforce development and creative-industry opportunities.",
  },
  {
    title: "Innovation",
    body: "Demonstrate products, vehicles and technology in professional entertainment environments.",
  },
];

/* ---------- Confidential inquiry form vocabularies ---------- */

export const COMPANY_TYPES = [
  "Corporation",
  "Automotive Manufacturer",
  "Financial Institution",
  "Real Estate Company",
  "Technology Company",
  "Foundation",
  "Family Office",
  "Government",
  "University",
  "Media Company",
  "Equipment Manufacturer",
  "Construction Company",
  "Hospitality Company",
  "Other",
];

export const PARTNERSHIP_TYPES = [
  "Studio Naming Rights",
  "Building Naming Rights",
  "Lobby Naming Rights",
  "Soundstage Naming Rights",
  "Screening Theater Naming Rights",
  "Film Academy Sponsorship",
  "Vehicle Donation",
  "Vehicle Fleet Sponsorship",
  "Automotive Partnership",
  "Product Placement Discussion",
  "Building Contribution",
  "Property Contribution",
  "Land Contribution",
  "Construction Sponsorship",
  "Technology Sponsorship",
  "Equipment Contribution",
  "Production Sponsorship",
  "Educational Sponsorship",
  "Foundation / Philanthropic Support",
  "Founding Partner",
  "Other Strategic Partnership",
];

export const CONTRIBUTION_TYPES = [
  "Cash Sponsorship",
  "Vehicle",
  "Property",
  "Land",
  "Building",
  "Equipment",
  "Technology",
  "Professional Services",
  "Media",
  "Construction",
  "Infrastructure",
  "Other",
];

export const CONTRIBUTION_RANGES = [
  "Under $100,000",
  "$100,000–$249,999",
  "$250,000–$499,999",
  "$500,000–$999,999",
  "$1M–$4.99M",
  "$5M–$9.99M",
  "$10M–$24.99M",
  "$25M+",
  "Prefer to Discuss Privately",
  "Non-Cash Contribution",
];

export const OBJECTIVES = [
  "Naming Rights",
  "Facility Recognition",
  "Corporate Branding",
  "Event Recognition",
  "Digital Recognition",
  "Film Credit",
  "Production Integration Discussion",
  "Community Impact",
  "Education Partnership",
  "Hospitality / VIP Opportunities",
  "Exclusivity",
  "Executive Engagement",
  "International Visibility",
  "Other",
];

export const CONTACT_METHODS = [
  "Email",
  "Telephone",
  "Video Meeting",
  "In-Person Meeting",
  "Private Executive Discussion",
];

export const VEHICLE_TYPES = [
  "New",
  "Demonstration",
  "Fleet",
  "Specialty",
  "Other",
];

export const PIPELINE_STATUSES = [
  { key: "new", label: "New" },
  { key: "reviewing", label: "Reviewing" },
  { key: "qualified", label: "Qualified" },
  { key: "intro_meeting", label: "Intro Meeting" },
  { key: "nda", label: "NDA" },
  { key: "due_diligence", label: "Due Diligence" },
  { key: "proposal", label: "Proposal" },
  { key: "negotiation", label: "Negotiation" },
  { key: "agreement", label: "Agreement" },
  { key: "active_partner", label: "Active Partner" },
];

/* ---------- Disclaimers ---------- */

export const DISCLAIMERS = {
  tax: "Sponsorships, commercial partnerships and charitable contributions are structured separately. Tax treatment depends on the nature of the contribution, the receiving entity and applicable law. Prospective contributors should consult their own legal and tax advisors.",
  placement:
    "Commercial sponsorship, product contributions and vehicle partnerships do not automatically guarantee creative integration or product placement in any HLS film, television program or other production. All creative integration requires separate written approval and may depend on the story, director, production team, distributor and other contractual considerations.",
  naming:
    "Naming-right opportunities are subject to availability, due diligence, brand compatibility, legal review and execution of a definitive written agreement. High Light Source Film Studios reserves the right to determine whether a proposed naming partner is consistent with the studio's brand, values and long-term objectives.",
  property:
    "Submission of property information does not constitute acceptance, purchase, donation or contractual commitment by High Light Source Film Studios. Any property transaction is subject to inspection, valuation, environmental review, title review, financial analysis, legal due diligence and execution of definitive agreements.",
  automotive:
    "Vehicle contributions or sponsorships do not automatically guarantee placement in a motion picture, television production or other creative property. Any on-screen integration is subject to separate creative, legal, contractual and production approval.",
};

export const MAX_UPLOAD_MB = 15;
export const ACCEPTED_UPLOAD =
  ".pdf,.docx,.xlsx,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png";
