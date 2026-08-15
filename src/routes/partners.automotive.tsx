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
  AUTOMOTIVE_CONTRIBUTIONS,
  AUTOMOTIVE_RECOGNITION,
  DISCLAIMERS,
} from "@/data/partnerships";

export const Route = createFileRoute("/partners/automotive")({
  head: () => ({
    meta: [
      {
        title: "Automotive Partnerships | High Light Source Film Studios",
      },
      {
        name: "description",
        content:
          "Vehicle, fleet, electric mobility and charging-infrastructure partnerships supporting High Light Source Film Studios productions, events and executive transportation.",
      },
      {
        property: "og:title",
        content: "Automotive Partnerships | HLS Film Studios",
      },
      {
        property: "og:description",
        content:
          "Automotive manufacturers, dealer groups and mobility companies partnering with HLS.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/partners/automotive" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/partners/automotive" }],
  }),
  component: Automotive,
});

function Automotive() {
  return (
    <>
      <PartnerHero
        eyebrow="Automotive Partnerships"
        title="Drive the story forward."
        subtitle="Vehicles. Fleets. Mobility. Infrastructure."
        lede="High Light Source Film Studios welcomes partnerships with automotive manufacturers, dealer groups, mobility companies and transportation organizations supporting production logistics, executive transportation, studio operations and public events."
        actions={
          <PartnerButton to="/partners/confidential-inquiry" variant="solid">
            Discuss an Automotive Partnership
          </PartnerButton>
        }
      />

      <Section className="border-t border-border">
        <PanelIntro
          eyebrow="Contribution"
          title="Ways automotive partners participate"
        >
          <p>
            Contributions may be structured as donation, sponsorship, loan
            program, long-term lease or a combination, depending on the
            partner's objectives and jurisdiction.
          </p>
        </PanelIntro>
        <div className="mt-12">
          <GoldList items={AUTOMOTIVE_CONTRIBUTIONS} columns={3} />
        </div>
      </Section>

      <Section className="border-t border-border bg-graphite/30">
        <PanelIntro
          eyebrow="Recognition"
          title="Recognition and visibility opportunities"
        />
        <div className="mt-12">
          <GoldList items={AUTOMOTIVE_RECOGNITION} columns={2} />
        </div>
        <div className="mt-14 space-y-8">
          <LegalNote label="Automotive Disclaimer">
            {DISCLAIMERS.automotive}
          </LegalNote>
          <LegalNote label="Placement Disclaimer">
            {DISCLAIMERS.placement}
          </LegalNote>
        </div>
      </Section>

      <ConfidentialCta
        title="Speak with the studio directly"
        body="Automotive discussions frequently involve confidential product, launch and marketing timelines. HLS can execute a mutual confidentiality agreement before detailed conversations begin."
      />
    </>
  );
}
