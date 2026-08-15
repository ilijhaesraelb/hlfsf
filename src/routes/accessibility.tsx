import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/primitives";

export const Route = createFileRoute("/accessibility")({
  head: () => ({
    meta: [
      { title: "Accessibility Statement | High Light Source Film Studios" },
      {
        name: "description",
        content:
          "High Light Source Film Studios targets WCAG 2.2 AA, including keyboard navigation, visible focus states, captions, reduced motion and accessible forms.",
      },
      {
        property: "og:title",
        content: "Accessibility Statement | HLS Film Studios",
      },
      {
        property: "og:description",
        content: "Our commitment to WCAG 2.2 AA accessibility.",
      },
    ],
  }),
  component: Accessibility,
});

const COMMITMENTS = [
  "Keyboard navigation across all interactive elements",
  "Visible focus states",
  "Alt text on meaningful imagery",
  "Captions and transcripts for video",
  "ARIA labels where appropriate",
  "Sufficient colour contrast",
  "Reduced-motion support honouring system preferences",
  "Screen-reader compatible structure",
  "Accessible, clearly labelled forms",
];

function Accessibility() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Accessibility Statement"
        subtitle="High Light Source Film Studios targets WCAG 2.2 Level AA across this website."
      />
      <Section>
        <ul className="mx-auto grid max-w-3xl gap-px overflow-hidden border border-border bg-border">
          {COMMITMENTS.map((c) => (
            <li key={c} className="bg-[#050505] px-6 py-5 text-sm text-silver">
              {c}
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-10 max-w-3xl text-sm leading-relaxed text-silver">
          Important information is never communicated using colour alone. If you
          encounter an accessibility barrier on this site, please contact the
          studio so we can address it.
        </p>
      </Section>
    </>
  );
}
