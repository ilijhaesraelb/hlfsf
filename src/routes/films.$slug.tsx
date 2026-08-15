import { createFileRoute, notFound } from "@tanstack/react-router";
import {
  Eyebrow,
  GoldLink,
  Heading,
  Placeholder,
  Section,
} from "@/components/site/primitives";
import { FILMS } from "@/data/site";

export const Route = createFileRoute("/films/$slug")({
  loader: ({ params }) => {
    const film = FILMS.find((f) => f.slug === params.slug);
    if (!film) throw notFound();
    return { film };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Title Unavailable | HLS Film Studios" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { film } = loaderData;
    return {
      meta: [
        { title: `${film.title} | High Light Source Film Studios` },
        { name: "description", content: film.logline },
        { property: "og:title", content: `${film.title} | HLS Film Studios` },
        { property: "og:description", content: film.logline },
      ],
    };
  },
  component: FilmPage,
});

const CREDITS = [
  "Director",
  "Producers",
  "Cast",
  "Production Countries",
  "Production Partners",
  "Distribution",
];

function FilmPage() {
  const { film } = Route.useLoaderData();

  return (
    <>
      <div className="grain relative overflow-hidden border-b border-border px-5 pb-24 pt-40 lg:px-8">
        <div
          aria-hidden
          className="beam absolute left-1/2 top-0 h-full w-56 -translate-x-1/2 opacity-50"
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="border border-gold/50 px-3 py-1 text-[0.55rem] uppercase tracking-[0.24em] text-gold">
            {film.status}
          </span>
          <h1 className="display mt-8 text-3xl leading-[1.2] text-foreground sm:text-5xl">
            {film.title}
          </h1>
          <p className="mt-6 text-xs uppercase tracking-[0.28em] text-silver">
            {film.genre} · {film.countries}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <GoldLink to="/contact" variant="solid">
              Watch Trailer
            </GoldLink>
            <GoldLink to="/press">View Gallery</GoldLink>
          </div>
          <p className="mt-6 text-[0.6rem] uppercase tracking-[0.22em] text-silver">
            Trailer and gallery available once released
          </p>
        </div>
      </div>

      <Section>
        <div className="grid gap-16 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <Eyebrow>Synopsis</Eyebrow>
            <Heading className="text-xl sm:text-2xl">{film.logline}</Heading>
            <p className="mt-8 text-sm leading-relaxed text-silver">
              Full synopsis placeholder. Approved story material will be
              published here once the project is cleared for public
              announcement.
            </p>
            <div className="mt-10">
              <Placeholder>
                Behind the scenes, press materials and credits pending.
              </Placeholder>
            </div>
          </div>
          <aside className="border border-border bg-graphite p-8">
            <h2 className="text-[0.65rem] uppercase tracking-[0.3em] text-gold">
              Production
            </h2>
            <dl className="mt-6 space-y-5">
              <div>
                <dt className="text-[0.6rem] uppercase tracking-[0.24em] text-silver">
                  Status
                </dt>
                <dd className="mt-1 text-sm text-foreground">{film.status}</dd>
              </div>
              {CREDITS.map((c) => (
                <div key={c}>
                  <dt className="text-[0.6rem] uppercase tracking-[0.24em] text-silver">
                    {c}
                  </dt>
                  <dd className="mt-1 text-sm text-foreground">
                    To be announced
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </Section>
    </>
  );
}
