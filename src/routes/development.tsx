import { createFileRoute } from "@tanstack/react-router";
import { FilmCard } from "@/components/site/FilmCard";
import {
  GoldLink,
  PageHero,
  Placeholder,
  Section,
} from "@/components/site/primitives";
import { FILMS } from "@/data/site";

export const Route = createFileRoute("/development")({
  head: () => ({
    meta: [
      { title: "Projects in Development | High Light Source Film Studios" },
      {
        name: "description",
        content:
          "Approved public-facing projects in development at High Light Source Film Studios. Confidential financing material is available to authorized partners only.",
      },
      {
        property: "og:title",
        content: "Projects in Development | HLS Film Studios",
      },
      {
        property: "og:description",
        content: "The HLS development slate for international financing.",
      },
    ],
  }),
  component: Development,
});

function Development() {
  return (
    <>
      <PageHero
        eyebrow="Development"
        title="Projects in development"
        subtitle="Approved public-facing projects. Sensitive financing information is shared only through the secure Partner Portal."
      />
      <Section>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FILMS.map((f) => (
            <FilmCard key={f.slug} film={f} />
          ))}
        </div>
        <div className="mt-12">
          <Placeholder>
            Working titles and concept artwork are placeholders until each
            project is cleared for public announcement.
          </Placeholder>
        </div>
        <div className="mt-12 flex flex-wrap gap-4">
          <GoldLink to="/partners" variant="solid">
            Request Partner Access
          </GoldLink>
          <GoldLink to="/contact">Contact Development</GoldLink>
        </div>
      </Section>
    </>
  );
}
