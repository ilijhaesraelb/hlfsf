import { Link } from "@tanstack/react-router";
import { Instagram, Youtube, Linkedin, Facebook, Music2, X } from "lucide-react";
import logo from "@/assets/hls-logo.png.asset.json";
import { BRAND } from "@/data/site";
import { NewsletterSignup } from "@/components/site/NewsletterSignup";
import { resetIntroPreference } from "@/components/site/CinematicIntro";
import { useSiteSettings } from "@/lib/site-settings";


const COLUMNS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "Studio",
    links: [
      { label: "About", to: "/studio" },
      { label: "Leadership", to: "/studio" },
      { label: "Careers", to: "/careers" },
      { label: "News", to: "/news" },
    ],
  },
  {
    title: "Productions",
    links: [
      { label: "Films", to: "/films" },
      { label: "Development", to: "/development" },
      { label: "Casting", to: "/casting" },
      { label: "Talent", to: "/talent" },
    ],
  },
  {
    title: "International",
    links: [
      { label: "Co-Productions", to: "/international" },
      { label: "Countries", to: "/international" },
      { label: "Partner With HLS", to: "/partner-with-hls" },
      { label: "Partner Portal", to: "/portal" },
    ],
  },
  {
    title: "Partnerships",
    links: [
      { label: "Corporate Partnerships", to: "/partners" },
      { label: "Naming Rights", to: "/partners/naming-rights" },
      { label: "Automotive", to: "/partners/automotive" },
      { label: "Founding Partners", to: "/partners/founding-partners" },
      { label: "Technology", to: "/partners/technology" },
      { label: "Studio Development", to: "/partners/studio-development" },
      { label: "Production Sponsorships", to: "/partners/production-sponsorships" },
      { label: "Education", to: "/partners/education" },
      { label: "Confidential Inquiry", to: "/partners/confidential-inquiry" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Contact", to: "/contact" },
      { label: "Press", to: "/press" },
      { label: "Academy", to: "/academy" },
      { label: "Newsletter", to: "/newsletter" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
      { label: "Accessibility", to: "/accessibility" },
      { label: "Submission Policy", to: "/terms" },
      { label: "Staff Access", to: "/auth" },

    ],
  },
];

const SOCIALS = [
  { Icon: Instagram, label: "Instagram", key: "social_instagram" },
  { Icon: Youtube, label: "YouTube", key: "social_youtube" },
  { Icon: Linkedin, label: "LinkedIn", key: "social_linkedin" },
  { Icon: Facebook, label: "Facebook", key: "social_facebook" },
  { Icon: Music2, label: "TikTok", key: "social_tiktok" },
  { Icon: X, label: "X", key: "social_x" },
];

export function Footer() {
  const { setting } = useSiteSettings();
  const brandName = setting("brand_name");
  const email = setting("email_main");
  const phone = setting("phone_main");
  const address = [
    setting("address_line"),
    setting("address_city"),
    setting("address_state"),
    setting("address_postal"),
    setting("address_country"),
  ]
    .filter(Boolean)
    .join(", ");


  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <img
            src={setting("logo_primary") || logo.url}
            alt={`${brandName} emblem`}
            className="h-24 w-24 rounded-full object-cover ring-1 ring-gold/40"
            loading="lazy"
          />
          <p className="display mt-6 text-lg text-foreground sm:text-2xl">
            {brandName}
          </p>
          <p className="mt-3 text-xs uppercase tracking-[0.3em] text-gold">
            {setting("tagline", BRAND.tagline)}
          </p>
          <div className="mt-5 space-y-1 text-sm text-silver">
            {address ? <p>{address}</p> : null}
            {email ? (
              <p>
                <a className="hover:text-gold" href={`mailto:${email}`}>
                  {email}
                </a>
              </p>
            ) : null}
            {phone ? (
              <p>
                <a className="hover:text-gold" href={`tel:${phone.replace(/[^+\d]/g, "")}`}>
                  {phone}
                </a>
              </p>
            ) : null}
          </div>
        </div>


        <div className="gold-rule my-12" />

        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[0.65rem] uppercase tracking-[0.3em] text-gold">
            Studio Dispatches
          </h2>
          <p className="mt-3 text-sm text-silver">
            Slate announcements, co-production calls and academy intakes.
          </p>
          <div className="mt-6 text-left">
            <NewsletterSignup variant="compact" />
          </div>
        </div>

        <div className="gold-rule my-12" />

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h2 className="text-[0.65rem] uppercase tracking-[0.3em] text-gold">
                {col.title}
              </h2>
              <ul className="mt-4 space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-silver transition-colors hover:text-gold"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-6 border-t border-border pt-8 sm:flex-row sm:justify-between">
          <p className="text-xs text-silver">
            © {new Date().getFullYear()} {setting("copyright_statement")}
          </p>
          <button
            type="button"
            onClick={() => {
              resetIntroPreference();
              window.location.reload();
            }}
            className="text-xs text-silver transition-colors hover:text-gold"
          >
            Replay intro
          </button>
          <ul className="flex items-center gap-5">
            {SOCIALS.filter(({ key }) => setting(key)).map(
              ({ Icon, label, key }) => (
                <li key={label}>
                  <a
                    href={setting(key)}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    className="block text-silver transition-colors hover:text-gold"
                  >
                    <Icon size={18} />
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>

      </div>
    </footer>
  );
}
