import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Eyebrow,
  GoldLink,
  Heading,
  PageHero,
  Placeholder,
  Section,
} from "@/components/site/primitives";
import { REGIONS } from "@/data/site";
import { localizedHead, pageCopy, validateLocaleSearch } from "@/lib/i18n";

export const Route = createFileRoute("/international")({
  validateSearch: validateLocaleSearch,
  loaderDeps: ({ search }) => ({ lang: search.lang }),
  loader: ({ deps }) => ({ lang: deps.lang }),
  head: ({ loaderData }) =>
    localizedHead("international", loaderData?.lang ?? "en", "/international"),
  component: International,
});

const HLS_BRINGS = [
  "Original intellectual property",
  "Development",
  "Creative leadership",
  "International packaging",
  "Financing strategy",
  "Distribution strategy",
  "US market access",
];

const PARTNERS_BRING = [
  "Production expertise",
  "Local talent",
  "Locations",
  "Cultural knowledge",
  "Funding eligibility",
  "Government relationships",
  "Production infrastructure",
];

const FINANCING = [
  "Film funds",
  "Cultural funds",
  "Co-production funds",
  "Broadcaster participation",
  "Distribution advances",
  "Private investment",
  "Regional incentives",
  "Tax credits",
  "Production rebates",
];

function International() {
  const { lang } = Route.useSearch();
  const copy = pageCopy("international", lang ?? "en");
  const [active, setActive] = useState(REGIONS[0]!.name);
  const region = REGIONS.find((r) => r.name === active) ?? REGIONS[0]!;

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        subtitle={copy.subtitle}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="border border-border bg-graphite p-8">
            <Eyebrow>What HLS Brings</Eyebrow>
            <ul className="mt-6 space-y-3">
              {HLS_BRINGS.map((i) => (
                <li key={i} className="text-sm text-silver">
                  {i}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-border bg-graphite p-8">
            <Eyebrow>What Local Partners Bring</Eyebrow>
            <ul className="mt-6 space-y-3">
              {PARTNERS_BRING.map((i) => (
                <li key={i} className="text-sm text-silver">
                  {i}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section className="border-t border-border bg-graphite/30">
        <Eyebrow>Regions</Eyebrow>
        <Heading>Potential partnership regions</Heading>
        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_1.4fr]">
          <ul className="space-y-2">
            {REGIONS.map((r) => (
              <li key={r.name}>
                <button
                  type="button"
                  onClick={() => setActive(r.name)}
                  aria-pressed={active === r.name}
                  className={`min-h-11 w-full border px-5 text-left text-[0.65rem] uppercase tracking-[0.22em] transition-colors ${
                    active === r.name
                      ? "border-gold text-gold"
                      : "border-border text-silver hover:border-gold/50"
                  }`}
                >
                  {r.name}
                </button>
              </li>
            ))}
          </ul>
          <div className="grain relative overflow-hidden border border-border bg-[#050505] p-10">
            <div
              aria-hidden
              className="beam absolute left-1/2 top-0 h-full w-32 -translate-x-1/2 opacity-40"
            />
            <div className="relative">
              <h3 className="display text-lg text-foreground">{region.name}</h3>
              <p className="mt-5 text-sm leading-relaxed text-silver">
                {region.body}
              </p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  "Production opportunities",
                  "Local partnerships",
                  "Film incentives",
                  "Cultural collaboration",
                  "Locations",
                  "Production infrastructure",
                ].map((i) => (
                  <li
                    key={i}
                    className="border border-border px-4 py-3 text-[0.6rem] uppercase tracking-[0.2em] text-silver"
                  >
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <Section className="border-t border-border">
        <Eyebrow>Financing</Eyebrow>
        <Heading>Potential financing sources</Heading>
        <ul className="mt-12 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {FINANCING.map((f) => (
            <li
              key={f}
              className="bg-[#050505] px-6 py-6 text-sm text-silver"
            >
              {f}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-xs leading-relaxed text-silver">
          Availability and eligibility vary by project and jurisdiction. Nothing
          on this page constitutes a commitment of funding.
        </p>
        <div className="mt-10">
          <Placeholder>
            Country partnership pages (France, Ireland, Canada, Portugal,
            Norway) publish in Phase II with a Last Updated date on all funding
            information.
          </Placeholder>
        </div>
        <div className="mt-12">
          <GoldLink to="/contact" variant="solid">
            Discuss a Co-Production
          </GoldLink>
        </div>
      </Section>
    </>
  );
}
