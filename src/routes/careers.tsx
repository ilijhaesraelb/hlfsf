import { createFileRoute } from "@tanstack/react-router";
import {
  GoldLink,
  PageHero,
  Placeholder,
  Section,
} from "@/components/site/primitives";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers | High Light Source Film Studios" },
      {
        name: "description",
        content:
          "Career opportunities at High Light Source Film Studios across corporate, production, creative, technology, marketing, finance, legal and academy teams.",
      },
      { property: "og:title", content: "Careers | HLS Film Studios" },
      {
        property: "og:description",
        content: "Build international cinema with HLS Film Studios.",
      },
    ],
  }),
  component: Careers,
});

const DEPARTMENTS = [
  "Corporate",
  "Production",
  "Creative",
  "Technology",
  "Marketing",
  "Finance",
  "Legal",
  "Internships",
  "Film Academy",
  "International",
];

function Careers() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Build cinema with HLS"
        subtitle="Open roles are published here as teams are formed."
      />
      <Section>
        <ul className="flex flex-wrap gap-3">
          {DEPARTMENTS.map((d) => (
            <li
              key={d}
              className="border border-border px-4 py-2 text-[0.6rem] uppercase tracking-[0.2em] text-silver"
            >
              {d}
            </li>
          ))}
        </ul>
        <div className="mt-12">
          <Placeholder>
            No open positions posted yet. Filters for country, department,
            employment type and remote/hybrid/on-site activate with the first
            listing.
          </Placeholder>
        </div>
        <div className="mt-12">
          <GoldLink to="/contact">General Application</GoldLink>
        </div>
      </Section>
    </>
  );
}
