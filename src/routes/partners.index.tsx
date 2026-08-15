import { createFileRoute } from "@tanstack/react-router";
import { Eyebrow, Heading, Section } from "@/components/site/primitives";
import {
  ConfidentialCta,
  GlassPanel,
  GoldList,
  PanelIntro,
  PartnerButton,
  PartnerHero,
} from "@/components/site/PartnerUI";
import {
  DISCLAIMERS,
  PARTNER_NAV,
  RECOGNITION_LEVELS,
  WHY_PARTNER,
} from "@/data/partnerships";

export const Route = createFileRoute("/partners/")({
  head: () => ({
    meta: [
      {
        title:
          "Corporate Partnerships & Naming Rights | High Light Source Film Studios",
      },
      {
        name: "description",
        content:
          "Naming rights, automotive partnerships, technology sponsorships, studio development and confidential capital opportunities with High Light Source Film Studios.",
      },
      {
        property: "og:title",
        content: "Corporate Partnerships & Naming Rights | HLS Film Studios",
      },
      {
        property: "og:description",
        content:
          "Place your brand at the center of storytelling — partnership, sponsorship and naming-right opportunities with HLS.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/partners" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/partners" }],
  }),
  component: PartnersHub,
});

const PILLARS = [
  {
    title: "Business Model",
    body: "HLS originates intellectual property, develops it to a financeable package and produces through international partnerships that share risk and expand market reach.",
  },
  {
    title: "Production Financing",
    body: "Each project is capitalized through a blend of equity, co-production participation, incentives and distribution commitments appropriate to its territory and scale.",
  },
  {
    title: "Co-Production Strategy",
    body: "Structures are built around treaty eligibility, local spend requirements and creative fit rather than financing alone.",
  },
  {
    title: "Distribution Strategy",
    body: "Titles are positioned for theatrical, broadcast and streaming pathways with territory-specific partners.",
  },
];

function PartnersHub() {
  return (
    <>
      <PartnerHero
        eyebrow="Corporate Partnerships"
        title="Place your brand at the center of storytelling."
        subtitle="Global partnerships. Enduring recognition."
        lede="High Light Source Film Studios develops long-term relationships with corporations, manufacturers, institutions, foundations and private organizations seeking meaningful association with international motion-picture production, creative education and cultural storytelling."
        actions={
          <>
            <PartnerButton to="/partners/naming-rights" variant="solid">
              Explore Naming Rights
            </PartnerButton>
            <PartnerButton to="/partners/confidential-inquiry">
              Confidential Inquiry
            </PartnerButton>
          </>
        }
      />

      <Section className="border-t border-border">
        <PanelIntro eyebrow="Overview" title="Partnership at studio scale">
          <p>
            Partnerships may involve naming rights, sponsorship, contributions
            of property or equipment, technology collaboration, vehicle
            partnerships, educational support and other strategic
            relationships. Each relationship is designed individually around
            the objectives of the partner and the long-term development of the
            studio.
          </p>
        </PanelIntro>
        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {WHY_PARTNER.map((item) => (
            <GlassPanel key={item.title}>
              <h3 className="display text-sm text-gold">{item.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-silver">
                {item.body}
              </p>
            </GlassPanel>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border bg-graphite/30">
        <PanelIntro
          eyebrow="Opportunities"
          title="Categories of collaboration"
        />
        <div className="mt-12 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {PARTNER_NAV.filter((n) => n.to !== "/partners").map((item) => (
            <div key={item.to} className="bg-[#050505] p-8">
              <h3 className="display text-sm text-gold">{item.label}</h3>
              <p className="mt-4 text-sm leading-relaxed text-silver">
                {item.blurb}
              </p>
              <div className="mt-6">
                <PartnerButton to={item.to} variant="quiet">
                  View
                </PartnerButton>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border">
        <PanelIntro
          eyebrow="Recognition"
          title="Designations available to partners"
        >
          <p>
            Recognition levels are illustrative and are finalized within a
            definitive written agreement.
          </p>
        </PanelIntro>
        <div className="mt-12">
          <GoldList items={RECOGNITION_LEVELS} columns={3} />
        </div>
      </Section>

      <Section className="border-t border-border bg-graphite/30">
        <Eyebrow>Approach</Eyebrow>
        <Heading>How HLS builds productions</Heading>
        <div className="mt-12 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
          {PILLARS.map((p) => (
            <div key={p.title} className="bg-[#050505] p-8">
              <h3 className="display text-sm text-gold">{p.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-silver">
                {p.body}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10 space-y-6">
          <p className="text-xs leading-relaxed text-silver">
            {DISCLAIMERS.tax}
          </p>
          <p className="text-xs leading-relaxed text-silver">
            Nothing on this page constitutes an offer to sell or a solicitation
            of an investment. Any participation is subject to definitive
            documentation and applicable law.
          </p>
        </div>
        <div className="mt-12 flex flex-wrap gap-4">
          <PartnerButton to="/partners/confidential-inquiry" variant="solid">
            Request Partner Access
          </PartnerButton>
          <PartnerButton to="/portal">Partner Portal</PartnerButton>
        </div>
      </Section>

      <ConfidentialCta />
    </>
  );
}
