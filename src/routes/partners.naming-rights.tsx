import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/site/primitives";
import {
  ConfidentialCta,
  GlassPanel,
  GoldList,
  LegalNote,
  PanelIntro,
  PartnerButton,
  PartnerHero,
} from "@/components/site/PartnerUI";
import {
  DISCLAIMERS,
  FACILITY_NAMING,
  NAMING_EXAMPLES,
} from "@/data/partnerships";

export const Route = createFileRoute("/partners/naming-rights")({
  head: () => ({
    meta: [
      { title: "Studio Naming Rights | High Light Source Film Studios" },
      {
        name: "description",
        content:
          "Studio, campus, soundstage, lobby and academy naming-right opportunities with High Light Source Film Studios on customized multi-year terms.",
      },
      {
        property: "og:title",
        content: "Studio Naming Rights | HLS Film Studios",
      },
      {
        property: "og:description",
        content:
          "Place your brand at the center of storytelling with studio and facility naming rights.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/partners/naming-rights" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/partners/naming-rights" }],
  }),
  component: NamingRights,
});

const BENEFITS = [
  {
    title: "Permanent Visibility",
    body: "Architectural signage, wayfinding, interior identity and permanent recognition throughout the named environment.",
  },
  {
    title: "Digital Recognition",
    body: "Recognition across studio digital properties, partner directories and select production credits as agreed.",
  },
  {
    title: "Event Presence",
    body: "Presence at studio events, screenings, premieres and industry gatherings hosted within the named facility.",
  },
  {
    title: "Executive Hospitality",
    body: "Discussed individually and may include client experiences, studio visits and hosted programming.",
  },
];

function NamingRights() {
  return (
    <>
      <PartnerHero
        eyebrow="Naming Rights"
        title="Place your brand at the center of storytelling."
        subtitle="Studio, campus and facility naming opportunities."
        lede="High Light Source Film Studios offers naming-right opportunities across studio facilities, production environments, creative spaces, educational programs and future campus developments. Terms are customized and typically structured on a multi-year basis."
        actions={
          <PartnerButton to="/partners/confidential-inquiry" variant="solid">
            Inquire About Naming Rights
          </PartnerButton>
        }
      />

      <Section className="border-t border-border">
        <PanelIntro
          eyebrow="Availability"
          title="Facility naming opportunities"
        >
          <p>
            Availability varies by territory and development phase. The
            following categories illustrate the kinds of environments that may
            be named.
          </p>
        </PanelIntro>
        <div className="mt-12">
          <GoldList items={FACILITY_NAMING} columns={3} />
        </div>
      </Section>

      <Section className="border-t border-border bg-graphite/30">
        <PanelIntro
          eyebrow="Identity"
          title="How a naming partnership reads"
        >
          <p>
            Illustrative lockups only. Final naming conventions are developed
            with the partner's brand team and approved in a definitive
            agreement.
          </p>
        </PanelIntro>
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {NAMING_EXAMPLES.map((ex) => (
            <div
              key={ex.line1}
              className="grain relative overflow-hidden border border-border bg-[#050505] px-8 py-14 text-center"
            >
              <div
                aria-hidden
                className="beam absolute left-1/2 top-0 h-full w-20 -translate-x-1/2 opacity-40"
              />
              <p className="display relative text-sm tracking-[0.16em] text-foreground sm:text-base">
                {ex.line1}
              </p>
              <p className="relative mt-4 text-[0.6rem] uppercase tracking-[0.28em] text-gold">
                {ex.line2}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border">
        <PanelIntro eyebrow="Benefits" title="What a naming partner receives" />
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {BENEFITS.map((b) => (
            <GlassPanel key={b.title}>
              <h3 className="display text-sm text-gold">{b.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-silver">
                {b.body}
              </p>
            </GlassPanel>
          ))}
        </div>
        <div className="mt-14 space-y-8">
          <LegalNote label="Naming Rights Disclaimer">
            {DISCLAIMERS.naming}
          </LegalNote>
          <LegalNote label="Tax & Structure">{DISCLAIMERS.tax}</LegalNote>
        </div>
      </Section>

      <ConfidentialCta />
    </>
  );
}
