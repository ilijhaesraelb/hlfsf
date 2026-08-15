import { createFileRoute, Link } from "@tanstack/react-router";
import { CinematicHero } from "@/components/site/CinematicHero";
import { FilmCard } from "@/components/site/FilmCard";
import {
  Eyebrow,
  GoldLink,
  Heading,
  Placeholder,
  Section,
} from "@/components/site/primitives";
import { FILMS, GENRES, NEWS, PARTNER_AUDIENCES, REGIONS } from "@/data/site";
import { NewsletterSignup } from "@/components/site/NewsletterSignup";
import { localizedHead, pageCopy, validateLocaleSearch } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  validateSearch: validateLocaleSearch,
  loaderDeps: ({ search }) => ({ lang: search.lang }),
  loader: ({ deps }) => ({ lang: deps.lang }),
  head: ({ loaderData }) =>
    localizedHead("home", loaderData?.lang ?? "en", "/"),
  component: Home,
});

function Home() {
  const { lang } = Route.useSearch();
  const copy = pageCopy("home", lang ?? "en");

  return (
    <>
      <CinematicHero />

      {/* Studio statement */}
      <Section className="border-t border-border">
        <div className="mx-auto max-w-4xl text-center">
          <Eyebrow>{copy.eyebrow}</Eyebrow>
          <Heading>{copy.title}</Heading>
          <p className="mt-8 text-sm leading-relaxed text-silver sm:text-base">
            {copy.subtitle}
          </p>

          <p className="mt-5 text-sm leading-relaxed text-silver sm:text-base">
            Through international production partnerships, emerging-talent
            development, creative education and strategic co-productions, HLS
            brings together storytellers, filmmakers, institutions and
            communities to transform ambitious ideas into cinematic experiences.
          </p>
          <div className="mt-10">
            <GoldLink to="/studio">Discover HLS</GoldLink>
          </div>
        </div>
      </Section>

      {/* Featured productions */}
      <Section className="border-t border-border bg-graphite/30">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow>Featured</Eyebrow>
            <Heading>Productions</Heading>
          </div>
          <GoldLink to="/films" variant="ghost">
            View All Films
          </GoldLink>
        </div>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FILMS.map((film) => (
            <FilmCard key={film.slug} film={film} />
          ))}
        </div>
        <div className="mt-10">
          <Placeholder>
            Placeholder slate — titles, key art and status update once cleared
            for public announcement.
          </Placeholder>
        </div>
      </Section>

      {/* Original stories */}
      <Section className="border-t border-border">
        <div className="max-w-3xl">
          <Eyebrow>Slate</Eyebrow>
          <Heading>
            Original stories.
            <br />
            Global audiences.
          </Heading>
        </div>
        <div className="mt-14 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
          {GENRES.map((g) => (
            <div key={g.title} className="bg-[#050505] p-8">
              <h3 className="display text-sm text-gold">{g.title}</h3>
              <ul className="mt-6 space-y-3">
                {g.items.map((i) => (
                  <li key={i} className="text-sm text-silver">
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <GoldLink to="/development">Explore Our Slate</GoldLink>
        </div>
      </Section>

      {/* International */}
      <Section className="grain relative overflow-hidden border-t border-border">
        <div
          aria-hidden
          className="beam absolute left-1/2 top-0 h-full w-40 -translate-x-1/2 opacity-40"
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <Eyebrow>International Production</Eyebrow>
          <Heading>
            One world.
            <br />
            Unlimited stories.
          </Heading>
          <p className="mt-8 text-sm leading-relaxed text-silver sm:text-base">
            High Light Source Film Studios develops international productions
            designed to connect countries, filmmakers and audiences through
            cinema.
          </p>
        </div>
        <div className="relative mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {REGIONS.map((r) => (
            <Link
              key={r.name}
              to="/international"
              className="border border-border bg-graphite p-6 transition-colors hover:border-gold/60"
            >
              <h3 className="display text-xs text-foreground">{r.name}</h3>
              <p className="mt-3 text-xs leading-relaxed text-silver">
                {r.body}
              </p>
            </Link>
          ))}
        </div>
        <div className="relative mt-12 text-center">
          <GoldLink to="/international">International Co-Productions</GoldLink>
        </div>
      </Section>

      {/* Economic impact */}
      <Section className="border-t border-border bg-graphite/30">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Impact</Eyebrow>
          <Heading>Cinema creates more than stories.</Heading>
          <p className="mt-8 text-sm leading-relaxed text-silver sm:text-base">
            Film production supports local employment, vendor networks, skills
            training, tourism visibility and long-term creative infrastructure.
            HLS designs its productions to leave measurable capability behind in
            every territory it works in.
          </p>
          <div className="mt-10">
            <Placeholder>
              Verified statistics pending. HLS publishes production metrics only
              once independently confirmed.
            </Placeholder>
          </div>
        </div>
      </Section>

      {/* Academy */}
      <Section className="border-t border-border">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Eyebrow>High Light Source Film Academy</Eyebrow>
            <Heading>Preparing the next generation of storytellers.</Heading>
            <p className="mt-8 text-sm leading-relaxed text-silver">
              Training across acting, directing, screenwriting, cinematography,
              editing, production, visual effects, sound and film business —
              built alongside working productions and international partners.
            </p>
            <div className="mt-10">
              <GoldLink to="/academy">Visit the Academy</GoldLink>
            </div>
          </div>
          <div className="grain relative aspect-video overflow-hidden border border-border bg-[#050505]">
            <div
              aria-hidden
              className="beam absolute left-1/2 top-0 h-full w-24 -translate-x-1/2 opacity-60"
            />
            <span className="absolute bottom-4 left-4 text-[0.55rem] uppercase tracking-[0.24em] text-silver">
              Academy imagery placeholder
            </span>
          </div>
        </div>
      </Section>

      {/* News */}
      <Section className="border-t border-border bg-graphite/30">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow>Newsroom</Eyebrow>
            <Heading>Latest News</Heading>
          </div>
          <GoldLink to="/news" variant="ghost">
            All News
          </GoldLink>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {NEWS.map((n) => (
            <article key={n.slug} className="border border-border p-8">
              <p className="text-[0.6rem] uppercase tracking-[0.28em] text-gold">
                {n.category}
              </p>
              <h3 className="display mt-4 text-sm text-foreground">
                {n.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-silver">
                {n.excerpt}
              </p>
            </article>
          ))}
        </div>
      </Section>

      {/* Partner */}
      <Section className="grain relative overflow-hidden border-t border-border">
        <div
          aria-hidden
          className="beam absolute left-1/2 top-0 h-full w-64 -translate-x-1/2 opacity-50"
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <Eyebrow>Partner with HLS</Eyebrow>
          <Heading>Let's create something the world will remember.</Heading>
          <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PARTNER_AUDIENCES.map((a) => (
              <li
                key={a}
                className="border border-border bg-graphite px-4 py-5 text-[0.6rem] uppercase tracking-[0.2em] text-silver"
              >
                {a}
              </li>
            ))}
          </ul>
          <div className="mt-12">
            <GoldLink to="/partners" variant="solid">
              Become a Partner
            </GoldLink>
          </div>
        </div>
      </Section>

      {/* Newsletter */}
      <Section className="border-t border-border bg-graphite/30">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Newsletter</Eyebrow>
          <Heading>Join the HLS world.</Heading>
          <p className="mt-6 text-sm text-silver">
            Film announcements, casting notices, studio news, trailer releases
            and international production updates.
          </p>
          <div className="mt-10 text-left">
            <NewsletterSignup />
          </div>

        </div>
      </Section>
    </>
  );
}
