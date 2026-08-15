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
  TECHNOLOGY_PARTNERS,
  TECHNOLOGY_SUPPORT,
} from "@/data/partnerships";

export const Route = createFileRoute("/partners/technology")({
  head: () => ({
    meta: [
      {
        title: "Technology Partnerships | High Light Source Film Studios",
      },
      {
        name: "description",
        content:
          "Camera, cloud, virtual production, LED, audio, cybersecurity and software partnerships supporting High Light Source Film Studios production environments.",
      },
      {
        property: "og:title",
        content: "Technology Partnerships | HLS Film Studios",
      },
      {
        property: "og:description",
        content:
          "Technology companies collaborating with HLS across production, post and studio infrastructure.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/partners/technology" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/partners/technology" }],
  }),
  component: Technology,
});

function Technology() {
  return (
    <>
      <PartnerHero
        eyebrow="Technology Partnerships"
        title="Build the future of production."
        subtitle="Cameras. Cloud. Virtual production. Infrastructure."
        lede="High Light Source Film Studios collaborates with technology organizations supporting production, post-production, virtual production, cybersecurity, connectivity and studio infrastructure."
        actions={
          <PartnerButton to="/partners/confidential-inquiry" variant="solid">
            Propose a Technology Partnership
          </PartnerButton>
        }
      />

      <Section className="border-t border-border">
        <PanelIntro eyebrow="Partners" title="Organizations we work with" />
        <div className="mt-12">
          <GoldList items={TECHNOLOGY_PARTNERS} columns={3} />
        </div>
      </Section>

      <Section className="border-t border-border bg-graphite/30">
        <PanelIntro
          eyebrow="Support"
          title="Technology categories under discussion"
        >
          <p>
            Partnerships may involve contribution, sponsorship, preferred
            supply, joint development or long-term collaboration.
          </p>
        </PanelIntro>
        <div className="mt-12">
          <GoldList items={TECHNOLOGY_SUPPORT} columns={3} />
        </div>
        <div className="mt-14">
          <LegalNote label="Disclaimer">{DISCLAIMERS.placement}</LegalNote>
        </div>
      </Section>

      <ConfidentialCta />
    </>
  );
}
