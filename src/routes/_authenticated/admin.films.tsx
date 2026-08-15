import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import {
  FILM_CATEGORIES,
  FILM_STATUSES,
  deleteFilm,
  listFilmsAdmin,
  saveFilm,
  uploadFilmImage,
  type FilmRecord,
} from "@/lib/films.functions";

export const Route = createFileRoute("/_authenticated/admin/films")({
  head: () => ({
    meta: [
      { title: "Films Administration | HLS Film Studios" },
      {
        name: "description",
        content:
          "Create, edit and publish High Light Source Film Studios slate records with poster and still imagery.",
      },
      { property: "og:title", content: "Films Administration" },
      {
        property: "og:description",
        content: "Manage the studio film slate, artwork and publication state.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FilmsAdmin,
});

const input =
  "w-full border border-border bg-[#050505] px-3 py-2 text-xs text-foreground outline-none focus:border-gold";
const btn =
  "min-h-9 border border-gold/60 px-4 text-[0.6rem] uppercase tracking-[0.2em] text-gold hover:bg-gold hover:text-primary-foreground disabled:opacity-50";
const label = "block text-[0.55rem] uppercase tracking-[0.24em] text-silver";

type Draft = {
  id?: string;
  slug: string;
  title: string;
  genre: string;
  category: string;
  status: string;
  countries: string;
  logline: string;
  synopsis: string;
  credits: string;
  release_note: string;
  poster_url: string | null;
  stills: string[];
  sort_order: number;
  published: boolean;
};

const EMPTY: Draft = {
  slug: "",
  title: "",
  genre: "",
  category: "DRAMA",
  status: "IN DEVELOPMENT",
  countries: "",
  logline: "",
  synopsis: "",
  credits: "",
  release_note: "",
  poster_url: null,
  stills: [],
  sort_order: 100,
  published: false,
};

function toDraft(film: FilmRecord): Draft {
  return {
    id: film.id,
    slug: film.slug,
    title: film.title,
    genre: film.genre,
    category: film.category,
    status: film.status,
    countries: film.countries,
    logline: film.logline,
    synopsis: film.synopsis,
    credits: film.credits,
    release_note: film.release_note,
    poster_url: film.poster_url,
    stills: film.stills,
    sort_order: film.sort_order,
    published: film.published,
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function readBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.readAsDataURL(file);
  });
}

function FilmsAdmin() {
  const load = useServerFn(listFilmsAdmin);
  const save = useServerFn(saveFilm);
  const remove = useServerFn(deleteFilm);
  const upload = useServerFn(uploadFilmImage);

  const [films, setFilms] = useState<FilmRecord[] | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    load({})
      .then((res) => setFilms(res.films))
      .catch((e: Error) => setError(e.message));
  }, [load]);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  }

  async function refresh() {
    const res = await load({});
    setFilms(res.films);
  }

  async function onSave() {
    if (!draft) return;
    setBusy(true);
    setError("");
    setStatus("");
    try {
      const res = await save({ data: { ...draft, slug: draft.slug || slugify(draft.title) } });
      setDraft(toDraft(res.film));
      await refresh();
      setStatus(res.film.published ? "Saved and published." : "Saved as draft.");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: string) {
    setBusy(true);
    setError("");
    try {
      await remove({ data: { id } });
      setDraft(null);
      await refresh();
      setStatus("Film deleted.");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function onUpload(kind: "poster" | "still", file: File) {
    if (!draft) return;
    const slug = draft.slug || slugify(draft.title);
    if (!slug) {
      setError("Add a title or slug before uploading artwork.");
      return;
    }
    setBusy(true);
    setError("");
    setStatus("");
    try {
      const base64 = await readBase64(file);
      const res = await upload({
        data: {
          slug,
          kind,
          fileName: file.name,
          contentType: file.type || "application/octet-stream",
          data: base64,
        },
      });
      if (kind === "poster") set("poster_url", res.url);
      else set("stills", [...draft.stills, res.url]);
      setStatus("Image uploaded — remember to save the record.");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16">
      <p className="text-[0.6rem] uppercase tracking-[0.3em] text-gold">
        HLS Administration
      </p>
      <h1 className="display mt-3 text-2xl text-foreground sm:text-3xl">
        Films &amp; Slate
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-silver">
        Create film records, upload poster art and production stills, then
        publish titles to the public slate.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/admin/company" className={`${btn} inline-flex items-center`}>
          Company &amp; Brand
        </Link>
        <Link
          to="/admin/communications"
          className={`${btn} inline-flex items-center`}
        >
          Communications
        </Link>
      </div>

      {error && (
        <p className="mt-6 border border-red-500/50 px-4 py-3 text-xs text-red-300">
          {error}
        </p>
      )}
      {status && (
        <p className="mt-6 border border-gold/40 px-4 py-3 text-xs text-gold">
          {status}
        </p>
      )}

      <div className="mt-10 grid gap-10 lg:grid-cols-[320px_1fr]">
        <aside className="border border-border bg-graphite p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[0.6rem] uppercase tracking-[0.24em] text-gold">
              Slate
            </h2>
            <button
              type="button"
              className={btn}
              onClick={() => {
                setDraft({ ...EMPTY });
                setStatus("");
              }}
            >
              New Film
            </button>
          </div>
          <ul className="mt-5 space-y-2">
            {(films ?? []).map((film) => (
              <li key={film.id}>
                <button
                  type="button"
                  onClick={() => setDraft(toDraft(film))}
                  className={`w-full border px-3 py-3 text-left transition-colors ${
                    draft?.id === film.id
                      ? "border-gold"
                      : "border-border hover:border-gold/50"
                  }`}
                >
                  <span className="block text-xs text-foreground">
                    {film.title}
                  </span>
                  <span className="mt-1 block text-[0.55rem] uppercase tracking-[0.22em] text-silver">
                    {film.published ? "Published" : "Draft"} · {film.status}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          {films && films.length === 0 && (
            <p className="mt-5 text-xs text-silver">
              No films yet. Create the first record.
            </p>
          )}
          {!films && !error && (
            <p className="mt-5 text-xs text-silver">Loading slate…</p>
          )}
        </aside>

        <section className="border border-border bg-graphite p-6">
          {!draft ? (
            <p className="text-sm text-silver">
              Select a film from the slate or create a new record.
            </p>
          ) : (
            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={label} htmlFor="title">
                    Title
                  </label>
                  <input
                    id="title"
                    className={`${input} mt-2`}
                    value={draft.title}
                    onChange={(e) => {
                      const value = e.target.value;
                      setDraft((d) =>
                        d
                          ? {
                              ...d,
                              title: value,
                              slug: d.id || d.slug ? d.slug : slugify(value),
                            }
                          : d,
                      );
                    }}
                  />
                </div>
                <div>
                  <label className={label} htmlFor="slug">
                    URL slug
                  </label>
                  <input
                    id="slug"
                    className={`${input} mt-2`}
                    value={draft.slug}
                    onChange={(e) => set("slug", slugify(e.target.value))}
                  />
                </div>
                <div>
                  <label className={label} htmlFor="genre">
                    Genre
                  </label>
                  <input
                    id="genre"
                    className={`${input} mt-2`}
                    value={draft.genre}
                    onChange={(e) => set("genre", e.target.value)}
                  />
                </div>
                <div>
                  <label className={label} htmlFor="countries">
                    Countries
                  </label>
                  <input
                    id="countries"
                    className={`${input} mt-2`}
                    value={draft.countries}
                    onChange={(e) => set("countries", e.target.value)}
                  />
                </div>
                <div>
                  <label className={label} htmlFor="category">
                    Category
                  </label>
                  <select
                    id="category"
                    className={`${input} mt-2`}
                    value={draft.category}
                    onChange={(e) => set("category", e.target.value)}
                  >
                    {FILM_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={label} htmlFor="film-status">
                    Production status
                  </label>
                  <select
                    id="film-status"
                    className={`${input} mt-2`}
                    value={draft.status}
                    onChange={(e) => set("status", e.target.value)}
                  >
                    {FILM_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={label} htmlFor="logline">
                  Logline
                </label>
                <textarea
                  id="logline"
                  rows={2}
                  className={`${input} mt-2`}
                  value={draft.logline}
                  onChange={(e) => set("logline", e.target.value)}
                />
              </div>
              <div>
                <label className={label} htmlFor="synopsis">
                  Synopsis
                </label>
                <textarea
                  id="synopsis"
                  rows={5}
                  className={`${input} mt-2`}
                  value={draft.synopsis}
                  onChange={(e) => set("synopsis", e.target.value)}
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={label} htmlFor="credits">
                    Key credits
                  </label>
                  <textarea
                    id="credits"
                    rows={3}
                    className={`${input} mt-2`}
                    value={draft.credits}
                    onChange={(e) => set("credits", e.target.value)}
                  />
                </div>
                <div>
                  <label className={label} htmlFor="release">
                    Release note
                  </label>
                  <input
                    id="release"
                    className={`${input} mt-2`}
                    value={draft.release_note}
                    onChange={(e) => set("release_note", e.target.value)}
                  />
                  <label className={`${label} mt-4`} htmlFor="sort">
                    Sort order
                  </label>
                  <input
                    id="sort"
                    type="number"
                    className={`${input} mt-2`}
                    value={draft.sort_order}
                    onChange={(e) =>
                      set("sort_order", Number(e.target.value) || 0)
                    }
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className={label}>Poster</p>
                  {draft.poster_url && (
                    <img
                      src={draft.poster_url}
                      alt={`${draft.title} poster`}
                      className="mt-3 aspect-2/3 w-32 border border-border object-cover"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-3 block w-full text-[0.6rem] text-silver"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void onUpload("poster", file);
                      e.target.value = "";
                    }}
                  />
                  {draft.poster_url && (
                    <button
                      type="button"
                      className={`${btn} mt-3`}
                      onClick={() => set("poster_url", null)}
                    >
                      Remove poster
                    </button>
                  )}
                </div>
                <div>
                  <p className={label}>Stills</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {draft.stills.map((url) => (
                      <div key={url} className="w-24">
                        <img
                          src={url}
                          alt={`${draft.title} still`}
                          className="aspect-video w-24 border border-border object-cover"
                        />
                        <button
                          type="button"
                          className="mt-1 text-[0.55rem] uppercase tracking-[0.2em] text-silver hover:text-gold"
                          onClick={() =>
                            set(
                              "stills",
                              draft.stills.filter((s) => s !== url),
                            )
                          }
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-3 block w-full text-[0.6rem] text-silver"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void onUpload("still", file);
                      e.target.value = "";
                    }}
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 text-xs text-silver">
                <input
                  type="checkbox"
                  checked={draft.published}
                  onChange={(e) => set("published", e.target.checked)}
                />
                Published on the public slate
              </label>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  className={btn}
                  disabled={busy || !draft.title}
                  onClick={() => void onSave()}
                >
                  {busy ? "Working…" : "Save film"}
                </button>
                {draft.id && (
                  <button
                    type="button"
                    className={btn}
                    disabled={busy}
                    onClick={() => void onDelete(draft.id as string)}
                  >
                    Delete
                  </button>
                )}
                <button
                  type="button"
                  className={btn}
                  onClick={() => setDraft(null)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
