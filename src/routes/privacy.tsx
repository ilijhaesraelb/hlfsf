import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/primitives";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | High Light Source Film Studios" },
      {
        name: "description",
        content:
          "How High Light Source Film Studios collects, uses and protects personal information submitted through this website.",
      },
      { property: "og:title", content: "Privacy Policy | HLS Film Studios" },
      {
        property: "og:description",
        content: "Privacy practices for the HLS Film Studios website.",
      },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <Section>
        <div className="mx-auto max-w-3xl space-y-8 text-sm leading-relaxed text-silver">
          <p className="text-xs uppercase tracking-[0.24em] text-gold">
            Draft — pending legal review
          </p>
          <p>
            High Light Source Film Studios collects only the information
            necessary to respond to inquiries submitted through this website,
            including name, organization, country, contact details and the
            content of your message.
          </p>
          <p>
            Information submitted through partnership, investor, talent, press
            and employment forms is used solely to evaluate and respond to that
            inquiry, and is shared internally on a need-to-know basis.
          </p>
          <p>
            Cookie preferences may be set across necessary, analytics,
            functional and marketing categories, and can be modified at any
            time.
          </p>
          <p>
            Please do not submit confidential banking or identity documentation
            through public forms. Due diligence is handled through a separate
            secure process.
          </p>
          <p>
            To request access, correction or deletion of your information,
            contact the studio through the contact page.
          </p>
        </div>
      </Section>
    </>
  );
}
