import { createFileRoute } from "@tanstack/react-router";
import {
  GoldLink,
  PageHero,
  Placeholder,
  Section,
} from "@/components/site/primitives";
import { BRAND } from "@/data/site";

export const Route = createFileRoute("/press")({
  head: () => ({
    meta: [
      { title: "Press & Media | High Light Source Film Studios" },
      {
        name: "description",
        content:
          "Approved press materials, company boilerplate and media contact information for High Light Source Film Studios.",
      },
      { property: "og:title", content: "Press & Media | HLS Film Studios" },
      {
        property: "og:description",
        content: "Approved media assets and studio boilerplate.",
      },
    ],
  }),
  component: Press,
});

const ASSETS = [
  "HLS Logos",
  "Executive Biographies",
  "Executive Photographs",
  "Film Stills",
  "Press Releases",
  "Brand Guidelines",
];

function Press() {
  return (
    <>
      <PageHero
        eyebrow="Press & Media"
        title="Media resources"
        subtitle="Only approved downloadable assets are published here."
      />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="display text-sm text-gold">Company Boilerplate</h2>
            <p className="mt-5 text-sm leading-relaxed text-silver">
              {BRAND.name} is {BRAND.descriptor.toLowerCase()}. The studio
              develops motion pictures and entertainment experiences for global
              audiences through international production partnerships,
              emerging-talent development and creative education.
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.26em] text-gold">
              {BRAND.tagline}
            </p>

            <ul className="mt-12 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
              {ASSETS.map((a) => (
                <li key={a} className="bg-[#050505] px-6 py-6">
                  <span className="text-sm text-foreground">{a}</span>
                  <p className="mt-2 text-[0.6rem] uppercase tracking-[0.2em] text-silver">
                    Pending approval
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <aside className="border border-border bg-graphite p-8">
            <h2 className="display text-sm text-gold">Media Contact</h2>
            <p className="mt-5 text-sm text-silver">
              Press office contact details to be published.
            </p>
            <div className="mt-8">
              <GoldLink to="/contact">Press Inquiry</GoldLink>
            </div>
          </aside>
        </div>
        <div className="mt-12">
          <Placeholder>
            Downloadable press kit publishes once assets are cleared.
          </Placeholder>
        </div>
      </Section>
    </>
  );
}
