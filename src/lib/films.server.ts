import { createClient } from "@supabase/supabase-js";

export type PublicFilm = {
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
};

const COLUMNS =
  "slug,title,genre,category,status,countries,logline,synopsis,credits,release_note,poster_url,stills,sort_order";

/** Reads the published slate with the publishable key (SSR safe, RLS applies). */
export async function readPublishedFilms(): Promise<PublicFilm[]> {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const client = createClient(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });

  const { data, error } = await client
    .from("films")
    .select(COLUMNS)
    .eq("published", true)
    .order("sort_order");
  if (error) return [];

  return ((data ?? []) as unknown as Record<string, unknown>[]).map((row) => ({
    ...(row as unknown as PublicFilm),
    stills: Array.isArray(row["stills"]) ? (row["stills"] as string[]) : [],
  }));
}
