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
import { DISCLAIMERS, PRODUCTION_OPPORTUNITIES } from "@/data/partnerships";

export const Route = createFileRoute("/partners/production-sponsorships")({
  head: () => ({
    meta: [
      {
        title: "Production Sponsorships | High Light Source Film Studios",
      },
      {
        name: "description",
        content:
          "Title, event, premiere, travel, hospitality and equipment sponsorships around individual High Light Source Film Studios productions.",
      },
      {
        property: "og:title",
        content: "Production Sponsorships | HLS Film Studios",
      },
      {
        property: "og:description",
        content:
          "Sponsorship relationships built around individual HLS productions and events.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/partners/production-sponsorships" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/partners/production-sponsorships" }],
  }),
  component: ProductionSponsorships,
});

function ProductionSponsorships() {
  return (
    <>
      <PartnerHero
        eyebrow="Production Sponsorships"
        title="Stand beside the work itself."
        subtitle="Productions. Premieres. Events."
        lede="Organizations may support individual productions, premieres, festivals, industry events and production logistics through sponsorship relationships developed for each title."
        actions={
          <PartnerButton to="/partners/confidential-inquiry" variant="solid">
            Discuss a Production Sponsorship
          </PartnerButton>
        }
      />

      <Section className="border-t border-border">
        <PanelIntro eyebrow="Opportunities" title="Sponsorship categories" />
        <div className="mt-12">
          <GoldList items={PRODUCTION_OPPORTUNITIES} columns={3} />
        </div>
        <div className="mt-14">
          <LegalNote label="Placement Disclaimer">
            {DISCLAIMERS.placement}
          </LegalNote>
        </div>
      </Section>

      <ConfidentialCta />
    </>
  );
}
