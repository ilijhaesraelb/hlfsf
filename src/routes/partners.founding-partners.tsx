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
import { DISCLAIMERS, FOUNDING_CATEGORIES } from "@/data/partnerships";

export const Route = createFileRoute("/partners/founding-partners")({
  head: () => ({
    meta: [
      { title: "Founding Partners | High Light Source Film Studios" },
      {
        name: "description",
        content:
          "A limited founding-partner designation for organizations supporting the establishment of High Light Source Film Studios across facilities, technology, education and capital.",
      },
      {
        property: "og:title",
        content: "Founding Partners | HLS Film Studios",
      },
      {
        property: "og:description",
        content:
          "Founding designations for organizations shaping the launch of the studio.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/partners/founding-partners" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/partners/founding-partners" }],
  }),
  component: FoundingPartners,
});

const BENEFITS = [
  {
    title: "Permanent Acknowledgment",
    body: "Founding partners are recognized permanently in studio recognition environments, subject to agreement terms.",
  },
  {
    title: "Priority Access",
    body: "Early consideration for facility naming, event participation and future partnership categories.",
  },
  {
    title: "Executive Relationship",
    body: "Direct engagement with studio leadership throughout the development of the partnership.",
  },
];

function FoundingPartners() {
  return (
    <>
      <PartnerHero
        eyebrow="Founding Partners"
        title="Be part of the beginning."
        subtitle="A limited designation."
        lede="High Light Source Film Studios extends a limited number of founding-partner designations to organizations that support the establishment of studio facilities, technology environments, educational programs and international production capability."
        actions={
          <PartnerButton to="/partners/confidential-inquiry" variant="solid">
            Inquire About Founding Partnership
          </PartnerButton>
        }
      />

      <Section className="border-t border-border">
        <PanelIntro eyebrow="Categories" title="Founding designations" />
        <div className="mt-12">
          <GoldList items={FOUNDING_CATEGORIES} columns={2} />
        </div>
      </Section>

      <Section className="border-t border-border bg-graphite/30">
        <PanelIntro eyebrow="Benefits" title="What founding status means" />
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {BENEFITS.map((b) => (
            <GlassPanel key={b.title}>
              <h3 className="display text-sm text-gold">{b.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-silver">
                {b.body}
              </p>
            </GlassPanel>
          ))}
        </div>
        <div className="mt-14">
          <LegalNote label="Availability">
            Founding designations are limited, discretionary and subject to due
            diligence, brand compatibility, legal review and execution of a
            definitive written agreement. {DISCLAIMERS.tax}
          </LegalNote>
        </div>
      </Section>

      <ConfidentialCta />
    </>
  );
}
