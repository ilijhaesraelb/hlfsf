import { createFileRoute } from "@tanstack/react-router";
import {
  Eyebrow,
  GoldLink,
  Heading,
  PageHero,
  Placeholder,
  Section,
} from "@/components/site/primitives";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "The Studio | High Light Source Film Studios" },
      {
        name: "description",
        content:
          "Who we are, our vision, mission and values — High Light Source Film Studios, an international film production, education and economic development company.",
      },
      { property: "og:title", content: "The Studio | HLS Film Studios" },
      {
        property: "og:description",
        content:
          "An international film production, education and economic development company.",
      },
    ],
  }),
  component: Studio,
});

const VALUES = [
  "Creativity",
  "Integrity",
  "Innovation",
  "Collaboration",
  "Global Perspective",
  "Opportunity",
  "Excellence",
  "Leadership",
];

function Studio() {
  return (
    <>
      <PageHero
        eyebrow="The Studio"
        title="We create worlds."
        subtitle="An International Film Production, Education & Economic Development Company."
      />

      <Section>
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <Eyebrow>Who We Are</Eyebrow>
            <Heading className="text-xl sm:text-2xl">
              A studio built for international storytelling.
            </Heading>
            <p className="mt-6 text-sm leading-relaxed text-silver">
              High Light Source Film Studios develops, packages and produces
              motion pictures and entertainment intended for audiences across
              multiple territories. The company works through international
              partnerships that combine original intellectual property with
              local production expertise.
            </p>
          </div>
          <div className="space-y-10">
            <div>
              <Eyebrow>Our Vision</Eyebrow>
              <p className="mt-4 text-sm leading-relaxed text-silver">
                To build a globally connected entertainment studio where stories
                travel across borders and audiences meet perspectives they have
                not yet seen.
              </p>
            </div>
            <div>
              <Eyebrow>Our Mission</Eyebrow>
              <p className="mt-4 text-sm leading-relaxed text-silver">
                To develop compelling entertainment while supporting creative
                and economic development in every territory where HLS produces.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section className="border-t border-border bg-graphite/30">
        <Eyebrow>Our Values</Eyebrow>
        <Heading>Principles that guide every production.</Heading>
        <ul className="mt-12 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <li
              key={v}
              className="bg-[#050505] px-6 py-8 text-[0.65rem] uppercase tracking-[0.24em] text-silver"
            >
              {v}
            </li>
          ))}
        </ul>
      </Section>

      <Section className="border-t border-border">
        <Eyebrow>Leadership</Eyebrow>
        <Heading>Executive Team</Heading>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-border bg-graphite p-8">
              <div className="grain aspect-square border border-border bg-[#050505]" />
              <p className="display mt-6 text-sm text-foreground">
                Executive Name — Placeholder
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.22em] text-gold">
                Position Placeholder
              </p>
              <p className="mt-4 text-sm leading-relaxed text-silver">
                Biography placeholder. Approved executive profiles, portraits
                and professional links will be published here.
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Placeholder>
            Leadership profiles pending approval — no placeholder is presented
            as a real person.
          </Placeholder>
        </div>
        <div className="mt-12">
          <GoldLink to="/contact">Contact the Studio</GoldLink>
        </div>
      </Section>
    </>
  );
}
