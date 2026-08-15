import { createFileRoute } from "@tanstack/react-router";
import {
  Eyebrow,
  GoldLink,
  Heading,
  PageHero,
  Section,
} from "@/components/site/primitives";

export const Route = createFileRoute("/academy")({
  head: () => ({
    meta: [
      { title: "Film Academy | High Light Source Film Studios" },
      {
        name: "description",
        content:
          "High Light Source Film Academy — training in acting, directing, screenwriting, cinematography, editing, production, visual effects, sound and film business.",
      },
      { property: "og:title", content: "HLS Film Academy" },
      {
        property: "og:description",
        content: "Preparing the next generation of storytellers.",
      },
    ],
  }),
  component: Academy,
});

const PROGRAMS = [
  "Acting",
  "Directing",
  "Screenwriting",
  "Cinematography",
  "Editing",
  "Production",
  "Visual Effects",
  "Sound",
  "Film Business",
  "International Co-Productions",
  "Internships",
  "Apprenticeships",
];

function Academy() {
  return (
    <>
      <PageHero
        eyebrow="High Light Source Film Academy"
        title="Preparing the next generation of storytellers."
        subtitle="Training built alongside working productions, international partners and universities."
      />
      <Section>
        <Eyebrow>Programs</Eyebrow>
        <Heading>Disciplines</Heading>
        <ul className="mt-12 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map((p) => (
            <li key={p} className="bg-[#050505] px-6 py-7">
              <span className="display text-xs text-foreground">{p}</span>
              <p className="mt-3 text-xs text-silver">
                Curriculum details publishing soon.
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-14 flex flex-wrap gap-4">
          <GoldLink to="/contact" variant="solid">
            Apply
          </GoldLink>
          <GoldLink to="/partners">Partner with the Academy</GoldLink>
          <GoldLink to="/partners" variant="ghost">
            University Partnerships
          </GoldLink>
        </div>
      </Section>
    </>
  );
}
