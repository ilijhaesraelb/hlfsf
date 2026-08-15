import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Placeholder, Section } from "@/components/site/primitives";
import { NEWS } from "@/data/site";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "Newsroom | High Light Source Film Studios" },
      {
        name: "description",
        content:
          "Studio news, film announcements, casting notices, international partnerships and production updates from High Light Source Film Studios.",
      },
      { property: "og:title", content: "Newsroom | HLS Film Studios" },
      {
        property: "og:description",
        content: "Announcements and production updates from HLS Film Studios.",
      },
    ],
  }),
  component: News,
});

const CATEGORIES = [
  "Studio News",
  "Film Announcements",
  "Casting",
  "International Partnerships",
  "Production Updates",
  "Film Academy",
  "Press Releases",
  "Awards",
  "Festivals",
];

function News() {
  return (
    <>
      <PageHero
        eyebrow="Newsroom"
        title="Studio news & announcements"
        subtitle="Verified announcements from High Light Source Film Studios."
      />
      <Section>
        <ul className="flex flex-wrap gap-3">
          {CATEGORIES.map((c) => (
            <li
              key={c}
              className="border border-border px-4 py-2 text-[0.6rem] uppercase tracking-[0.2em] text-silver"
            >
              {c}
            </li>
          ))}
        </ul>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {NEWS.map((n) => (
            <article key={n.slug} className="border border-border p-8">
              <p className="text-[0.6rem] uppercase tracking-[0.28em] text-gold">
                {n.category}
              </p>
              <h2 className="display mt-4 text-sm text-foreground">
                {n.title}
              </h2>
              <p className="mt-2 text-xs text-silver">{n.date}</p>
              <p className="mt-4 text-sm leading-relaxed text-silver">
                {n.excerpt}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-12">
          <Placeholder>
            No published articles yet — placeholders shown until the first
            release is approved.
          </Placeholder>
        </div>
      </Section>
    </>
  );
}
