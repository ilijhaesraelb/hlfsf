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
import { DISCLAIMERS } from "@/data/partnerships";

export const Route = createFileRoute("/partners/education")({
  head: () => ({
    meta: [
      { title: "Education Partnerships | High Light Source Film Studios" },
      {
        name: "description",
        content:
          "Film Academy sponsorships, scholarships, workforce development and creative-training partnerships with High Light Source Film Studios.",
      },
      {
        property: "og:title",
        content: "Education Partnerships | HLS Film Studios",
      },
      {
        property: "og:description",
        content:
          "Support scholarships, training and workforce development through the HLS Film Academy.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/partners/education" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/partners/education" }],
  }),
  component: EducationPartnerships,
});

const PROGRAMS = [
  "Scholarship funds",
  "Equipment for training environments",
  "Named classrooms and labs",
  "Workforce development programs",
  "Internship and apprenticeship pipelines",
  "Curriculum collaboration",
  "Guest instruction and masterclasses",
  "Community access programs",
];

const OUTCOMES = [
  {
    title: "Skills That Stay Local",
    body: "Training programs are designed so capability remains in the territory after production concludes.",
  },
  {
    title: "Named Recognition",
    body: "Academy spaces, programs and scholarships may carry partner recognition under agreed terms.",
  },
  {
    title: "Measured Impact",
    body: "HLS reports program participation and outcomes to partners on an agreed cadence.",
  },
];

function EducationPartnerships() {
  return (
    <>
      <PartnerHero
        eyebrow="Education Partnerships"
        title="Invest in the next generation of storytellers."
        subtitle="Academy. Scholarships. Workforce development."
        lede="High Light Source Film Studios partners with corporations, foundations, universities and public institutions to fund creative education, technical training and pathways into the film industry."
        actions={
          <PartnerButton to="/partners/confidential-inquiry" variant="solid">
            Discuss an Education Partnership
          </PartnerButton>
        }
      />

      <Section className="border-t border-border">
        <PanelIntro eyebrow="Programs" title="Ways partners contribute" />
        <div className="mt-12">
          <GoldList items={PROGRAMS} columns={2} />
        </div>
      </Section>

      <Section className="border-t border-border bg-graphite/30">
        <PanelIntro eyebrow="Impact" title="What partners receive" />
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {OUTCOMES.map((o) => (
            <GlassPanel key={o.title}>
              <h3 className="display text-sm text-gold">{o.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-silver">
                {o.body}
              </p>
            </GlassPanel>
          ))}
        </div>
        <div className="mt-14">
          <LegalNote label="Tax & Structure">{DISCLAIMERS.tax}</LegalNote>
        </div>
      </Section>

      <ConfidentialCta />
    </>
  );
}
