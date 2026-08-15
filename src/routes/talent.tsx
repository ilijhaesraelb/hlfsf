import { createFileRoute } from "@tanstack/react-router";
import {
  GoldLink,
  PageHero,
  Placeholder,
  Section,
} from "@/components/site/primitives";

export const Route = createFileRoute("/talent")({
  head: () => ({
    meta: [
      { title: "Talent Portal | High Light Source Film Studios" },
      {
        name: "description",
        content:
          "Actors, writers, directors, composers, editors, cinematographers, crew and VFX professionals can register with the High Light Source Film Studios talent portal.",
      },
      { property: "og:title", content: "Talent Portal | HLS Film Studios" },
      {
        property: "og:description",
        content: "Register your professional profile with HLS Film Studios.",
      },
    ],
  }),
  component: Talent,
});

const CATEGORIES = [
  "Actors",
  "Writers",
  "Directors",
  "Composers",
  "Editors",
  "Cinematographers",
  "Production Crew",
  "VFX Professionals",
];

const PROFILE = [
  "Name",
  "Country",
  "Professional category",
  "Biography",
  "Headshot",
  "Resume",
  "Demo reel URL",
  "IMDb URL",
  "Portfolio",
  "Languages",
  "Availability",
  "Union affiliation",
];

function Talent() {
  return (
    <>
      <PageHero
        eyebrow="Talent"
        title="Register with HLS"
        subtitle="Private contact details are never publicly searchable."
      />
      <Section>
        <ul className="flex flex-wrap gap-3">
          {CATEGORIES.map((c) => (
            <li
              key={c}
              className="border border-border px-4 py-2 text-[0.6rem] uppercase tracking-[0.2em] text-silver"
            >
              {c}
            </li>
          ))}
        </ul>
        <h2 className="display mt-14 text-sm text-gold">Profile Information</h2>
        <ul className="mt-6 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {PROFILE.map((p) => (
            <li key={p} className="bg-[#050505] px-6 py-5 text-sm text-silver">
              {p}
            </li>
          ))}
        </ul>
        <div className="mt-12">
          <Placeholder>
            Profile registration opens in Phase II with secure account handling.
          </Placeholder>
        </div>
        <div className="mt-12">
          <GoldLink to="/contact" variant="solid">
            Submit Talent Inquiry
          </GoldLink>
        </div>
      </Section>
    </>
  );
}
