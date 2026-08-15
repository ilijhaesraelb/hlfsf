import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Placeholder, Section } from "@/components/site/primitives";

export const Route = createFileRoute("/casting")({
  head: () => ({
    meta: [
      { title: "Casting | High Light Source Film Studios" },
      {
        name: "description",
        content:
          "Legitimate casting opportunities from High Light Source Film Studios. HLS never requires performers to pay a fee in exchange for a role.",
      },
      { property: "og:title", content: "Casting | HLS Film Studios" },
      {
        property: "og:description",
        content: "Official HLS casting opportunities and fraud notice.",
      },
    ],
  }),
  component: Casting,
});

function Casting() {
  return (
    <>
      <PageHero
        eyebrow="Casting"
        title="Casting opportunities"
        subtitle="Only listings published on this page are official HLS casting calls."
      />
      <Section>
        <div className="border border-gold/60 bg-graphite p-8">
          <h2 className="display text-sm text-gold">Fraud Notice</h2>
          <p className="mt-4 text-sm leading-relaxed text-foreground">
            High Light Source Film Studios will never require performers to pay
            a fee in exchange for a role. Report any request for payment made in
            the studio's name.
          </p>
        </div>
        <div className="mt-12">
          <Placeholder>
            No active casting calls. Listings will include production, role,
            location, union status, role description, shooting dates, deadline
            and submission requirements.
          </Placeholder>
        </div>
      </Section>
    </>
  );
}
