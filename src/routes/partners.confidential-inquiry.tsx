import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/site/primitives";
import {
  CorporateInquiryForm,
  PrivateMeetingForm,
} from "@/components/site/CorporateInquiryForm";
import {
  LegalNote,
  PanelIntro,
  PartnerHero,
} from "@/components/site/PartnerUI";
import { DISCLAIMERS } from "@/data/partnerships";

export const Route = createFileRoute("/partners/confidential-inquiry")({
  head: () => ({
    meta: [
      {
        title: "Confidential Partnership Inquiry | High Light Source Film Studios",
      },
      {
        name: "description",
        content:
          "A discreet channel for corporations, manufacturers, institutions and private organizations to discuss naming rights, sponsorship, property and capital opportunities with HLS.",
      },
      {
        property: "og:title",
        content: "Confidential Partnership Inquiry | HLS Film Studios",
      },
      {
        property: "og:description",
        content:
          "Submit a confidential corporate partnership inquiry to High Light Source Film Studios.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/partners/confidential-inquiry" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/partners/confidential-inquiry" }],
  }),
  component: ConfidentialInquiry,
});

function ConfidentialInquiry() {
  return (
    <>
      <PartnerHero
        eyebrow="Confidential"
        title="Private partnership inquiry."
        subtitle="Discreet. Secure. Executive-level."
        lede="Information submitted here is handled confidentially and reviewed only by authorized studio representatives. Please do not include highly sensitive material until a secure channel has been established."
      />

      <Section className="border-t border-border">
        <PanelIntro eyebrow="Inquiry" title="Corporate partnership form">
          <p>
            The form adapts to your area of interest — automotive, property,
            technology and capital questions appear only where relevant.
          </p>
        </PanelIntro>
        <div className="mt-14">
          <CorporateInquiryForm />
        </div>
      </Section>

      <Section
        id="private-meeting"
        className="scroll-mt-28 border-t border-border bg-graphite/30"
      >
        <PanelIntro eyebrow="Executive" title="Request a private meeting">
          <p>
            Organizations preferring a direct conversation before submitting
            details may request a private executive discussion.
          </p>
        </PanelIntro>
        <div className="mt-12">
          <PrivateMeetingForm />
        </div>
      </Section>

      <Section className="border-t border-border">
        <div className="grid gap-10 md:grid-cols-2">
          <LegalNote label="Naming Rights">{DISCLAIMERS.naming}</LegalNote>
          <LegalNote label="Placement">{DISCLAIMERS.placement}</LegalNote>
          <LegalNote label="Property">{DISCLAIMERS.property}</LegalNote>
          <LegalNote label="Tax & Structure">{DISCLAIMERS.tax}</LegalNote>
        </div>
      </Section>
    </>
  );
}
