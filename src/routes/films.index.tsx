import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FilmCard } from "@/components/site/FilmCard";
import { PageHero, Section } from "@/components/site/primitives";
import { FILMS } from "@/data/site";
import { listPublishedFilms } from "@/lib/films.functions";
import { localizedHead, pageCopy, validateLocaleSearch } from "@/lib/i18n";

export const Route = createFileRoute("/films/")({
  validateSearch: validateLocaleSearch,
  loaderDeps: ({ search }) => ({ lang: search.lang }),
  loader: async ({ deps }) => {
    const { films } = await listPublishedFilms();
    return { lang: deps.lang, films };
  },
  head: ({ loaderData }) =>
    localizedHead("films", loaderData?.lang ?? "en", "/films"),
  component: Films,
});

const FILTERS = [
  "ALL",
  "ACTION",
  "SUPERNATURAL",
  "THRILLER",
  "DRAMA",
  "BUSINESS",
] as const;

function Films() {
  const { lang } = Route.useSearch();
  const { films } = Route.useLoaderData();
  const copy = pageCopy("films", lang ?? "en");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ALL");
  const slate = films.length
    ? films.map((f) => ({
        slug: f.slug,
        title: f.title,
        genre: f.genre,
        status: f.status,
        countries: f.countries,
        logline: f.logline,
        category: f.category,
        posterUrl: f.poster_url,
      }))
    : FILMS.map((f) => ({ ...f, posterUrl: null }));
  const list =
    filter === "ALL" ? slate : slate.filter((f) => f.category === filter);


  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        subtitle={copy.subtitle}
      />
      <Section>
        <div className="flex flex-wrap gap-3">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`min-h-11 border px-5 text-[0.62rem] uppercase tracking-[0.24em] transition-colors ${
                filter === f
                  ? "border-gold bg-gold text-primary-foreground"
                  : "border-border text-silver hover:border-gold/60 hover:text-gold"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((film) => (
            <FilmCard key={film.slug} film={film} />
          ))}
        </div>
        {list.length === 0 && (
          <p className="mt-14 text-sm text-silver">
            No titles announced in this category yet.
          </p>
        )}
      </Section>
    </>
  );
}
