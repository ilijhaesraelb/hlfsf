import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/primitives";
import { NewsletterSignup } from "@/components/site/NewsletterSignup";

export const Route = createFileRoute("/newsletter/")({
  head: () => ({
    meta: [
      { title: "Newsletter | High Light Source Film Studios" },
      {
        name: "description",
        content:
          "Subscribe to HLS studio dispatches — slate announcements, co-production calls, academy intakes and casting notices. Consent-based, unsubscribe anytime.",
      },
      { property: "og:title", content: "HLS Studio Dispatches" },
      {
        property: "og:description",
        content:
          "Slate announcements, co-production calls, academy intakes and casting notices from High Light Source Film Studios.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/newsletter" }],
  }),
  component: NewsletterPage,
});

function NewsletterPage() {
  return (
    <>
      <PageHero
        eyebrow="Newsletter"
        title="Studio dispatches from HLS"
        subtitle="Slate announcements, co-production calls, academy intakes and casting notices — sent only to people who ask for them."
      />
      <Section>
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <NewsletterSignup />
          <div className="text-sm leading-relaxed text-silver">
            <h2 className="display text-lg text-foreground">
              How we handle your consent
            </h2>
            <ul className="mt-5 space-y-4">
              <li>
                Double opt-in: nothing is sent until you confirm your
                subscription.
              </li>
              <li>
                Consent is recorded separately for marketing email and for data
                storage, with a timestamp.
              </li>
              <li>
                Your interests decide what you receive — we do not send the full
                firehose to everyone.
              </li>
              <li>
                Withdraw at any time; every email carries an unsubscribe link
                and we delete on request.
              </li>
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
