import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/site/primitives";
import {
  ConfidentialCta,
  GoldList,
  LegalNote,
  PanelIntro,
  PartnerButton,
  PartnerHero,
} from "@/components/site/PartnerUI";
import {
  DISCLAIMERS,
  PROPERTY_CONTRIBUTIONS,
  PROPERTY_RECOGNITION,
} from "@/data/partnerships";

export const Route = createFileRoute("/partners/studio-development")({
  head: () => ({
    meta: [
      {
        title:
          "Studio Development & Property Contributions | High Light Source Film Studios",
      },
      {
        name: "description",
        content:
          "Buildings, land, construction, energy and infrastructure contributions supporting the development of High Light Source Film Studios facilities.",
      },
      {
        property: "og:title",
        content: "Studio Development & Property | HLS Film Studios",
      },
      {
        property: "og:description",
        content:
          "Property, land, construction and infrastructure partnerships with HLS.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/partners/studio-development" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/partners/studio-development" }],
  }),
  component: StudioDevelopment,
});

function StudioDevelopment() {
  return (
    <>
      <PartnerHero
        eyebrow="Studio Development"
        title="Build where stories are made."
        subtitle="Property. Land. Construction. Infrastructure."
        lede="High Light Source Film Studios welcomes discussions with property owners, developers, construction firms, infrastructure providers and organizations able to contribute physical assets supporting studio development."
        actions={
          <PartnerButton to="/partners/confidential-inquiry" variant="solid">
            Submit a Property Discussion
          </PartnerButton>
        }
      />

      <Section className="border-t border-border">
        <PanelIntro
          eyebrow="Contribution"
          title="Assets and services under consideration"
        />
        <div className="mt-12">
          <GoldList items={PROPERTY_CONTRIBUTIONS} columns={3} />
        </div>
      </Section>

      <Section className="border-t border-border bg-graphite/30">
        <PanelIntro eyebrow="Recognition" title="Recognition opportunities" />
        <div className="mt-12">
          <GoldList items={PROPERTY_RECOGNITION} columns={3} />
        </div>
        <div className="mt-14 space-y-8">
          <LegalNote label="Property Disclaimer">
            {DISCLAIMERS.property}
          </LegalNote>
          <LegalNote label="Tax & Structure">{DISCLAIMERS.tax}</LegalNote>
        </div>
      </Section>

      <ConfidentialCta />
    </>
  );
}
