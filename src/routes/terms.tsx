import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/primitives";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use | High Light Source Film Studios" },
      {
        name: "description",
        content:
          "Terms of use, submission policy, copyright and investment disclaimer for the High Light Source Film Studios website.",
      },
      { property: "og:title", content: "Terms of Use | HLS Film Studios" },
      {
        property: "og:description",
        content: "Website terms, submission policy and disclaimers.",
      },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Use" />
      <Section>
        <div className="mx-auto max-w-3xl space-y-8 text-sm leading-relaxed text-silver">
          <p className="text-xs uppercase tracking-[0.24em] text-gold">
            Draft — pending legal review
          </p>
          <section>
            <h2 className="display text-sm text-foreground">
              Production Submission Policy
            </h2>
            <p className="mt-4">
              High Light Source Film Studios does not accept unsolicited
              screenplays, treatments, concepts or other creative material. Any
              unsolicited submission may be discarded unread. Material is
              considered only when requested in writing and submitted through an
              approved representative.
            </p>
          </section>
          <section>
            <h2 className="display text-sm text-foreground">
              Investment Disclaimer
            </h2>
            <p className="mt-4">
              Nothing on this website constitutes an offer to sell or a
              solicitation of an offer to buy any security or interest in any
              production. Any participation is subject to definitive
              documentation and applicable law.
            </p>
          </section>
          <section>
            <h2 className="display text-sm text-foreground">
              Copyright & Trademark
            </h2>
            <p className="mt-4">
              All content, marks and materials on this website are the property
              of High Light Source Film Studios or its licensors and may not be
              reproduced without written permission.
            </p>
          </section>
        </div>
      </Section>
    </>
  );
}
