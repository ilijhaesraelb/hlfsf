import { Link } from "@tanstack/react-router";
import type { Film } from "@/data/site";

type CardFilm = Omit<Film, "status" | "category"> & {
  status: string;
  category: string;
  posterUrl?: string | null;
};

export function FilmCard({ film }: { film: CardFilm }) {
  return (
    <article className="group relative overflow-hidden border border-border bg-graphite transition-colors hover:border-gold/60">
      <div className="grain relative aspect-2/3 overflow-hidden bg-[#050505]">
        {film.posterUrl ? (
          <img
            src={film.posterUrl}
            alt={`${film.title} poster`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <>
            <div
              aria-hidden
              className="beam absolute left-1/2 top-0 h-2/3 w-20 -translate-x-1/2 opacity-40 transition-opacity duration-700 group-hover:opacity-80"
            />
            <div className="absolute inset-0 grid place-items-center px-6 text-center transition-transform duration-700 group-hover:scale-105">
              <span className="display text-sm text-foreground sm:text-lg">
                {film.title}
              </span>
            </div>
            <span className="absolute bottom-4 left-4 text-[0.55rem] uppercase tracking-[0.22em] text-silver">
              Key art placeholder
            </span>
          </>
        )}
        <span className="absolute left-4 top-4 border border-gold/50 bg-background/70 px-2 py-1 text-[0.55rem] uppercase tracking-[0.22em] text-gold">
          {film.status}
        </span>

      </div>
      <div className="p-6">
        <p className="text-[0.6rem] uppercase tracking-[0.28em] text-gold">
          {film.genre}
        </p>
        <h3 className="display mt-3 text-base text-foreground">{film.title}</h3>
        <p className="mt-2 text-xs text-silver">{film.countries}</p>
        <p className="mt-4 text-sm leading-relaxed text-silver">
          {film.logline}
        </p>
        <Link
          to="/films/$slug"
          params={{ slug: film.slug }}
          className="mt-6 inline-flex min-h-11 items-center text-[0.65rem] uppercase tracking-[0.26em] text-gold transition-opacity hover:opacity-70"
        >
          Explore Film →
        </Link>
      </div>
    </article>
  );
}
