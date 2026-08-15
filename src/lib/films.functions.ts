import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export type FilmRecord = {
  id: string;
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
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export const FILM_CATEGORIES = [
  "ACTION",
  "SUPERNATURAL",
  "THRILLER",
  "DRAMA",
  "BUSINESS",
] as const;

export const FILM_STATUSES = [
  "IN DEVELOPMENT",
  "PRE-PRODUCTION",
  "PRODUCTION",
  "POST-PRODUCTION",
  "COMING SOON",
] as const;

/** Published slate for the public website (anon read, SSR safe). */
export const listPublishedFilms = createServerFn({ method: "GET" }).handler(
  async () => {
    const { readPublishedFilms } = await import("@/lib/films.server");
    return { films: await readPublishedFilms() };
  },
);

async function assertAdmin(context: {
  supabase: {
    rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown }>;
  };
  userId: string;
}) {
  const { data } = await context.supabase.rpc("is_comms_admin", {
    _user_id: context.userId,
  });
  if (data !== true) throw new Error("Forbidden");
}

function normalise(row: Record<string, unknown>): FilmRecord {
  const stills = Array.isArray(row["stills"]) ? (row["stills"] as string[]) : [];
  return { ...(row as unknown as FilmRecord), stills };
}

/** Every film record, draft or published, for the administration console. */
export const listFilmsAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as never);
    const { getAdmin } = await import("@/lib/comm.server");
    const admin = await getAdmin();
    const { data, error } = await admin
      .from("films")
      .select("*")
      .order("sort_order")
      .order("title");
    if (error) throw new Error(error.message);
    return {
      films: ((data ?? []) as unknown as Record<string, unknown>[]).map(normalise),
    };
  });

const filmSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .min(2)
    .max(90)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only."),
  title: z.string().min(1).max(160),
  genre: z.string().max(120).default(""),
  category: z.enum(FILM_CATEGORIES),
  status: z.enum(FILM_STATUSES),
  countries: z.string().max(240).default(""),
  logline: z.string().max(1200).default(""),
  synopsis: z.string().max(6000).default(""),
  credits: z.string().max(4000).default(""),
  release_note: z.string().max(400).default(""),
  poster_url: z.string().max(400).nullable().default(null),
  stills: z.array(z.string().max(400)).max(20).default([]),
  sort_order: z.number().int().min(0).max(9999).default(100),
  published: z.boolean().default(false),
});

/** Creates or updates a film record and records the change in the audit log. */
export const saveFilm = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => filmSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { getAdmin, writeAudit } = await import("@/lib/comm.server");
    const admin = await getAdmin();

    const { id, ...fields } = data;
    const payload = {
      ...fields,
      published_at: fields.published ? new Date().toISOString() : null,
    };

    let saved: Record<string, unknown> | null = null;
    if (id) {
      const { data: row, error } = await admin
        .from("films")
        .update(payload as never)
        .eq("id", id)
        .select("*")
        .maybeSingle();
      if (error) throw new Error(error.message);
      saved = row as Record<string, unknown> | null;
    } else {
      const { data: row, error } = await admin
        .from("films")
        .insert(payload as never)
        .select("*")
        .maybeSingle();
      if (error) throw new Error(error.message);
      saved = row as Record<string, unknown> | null;
    }
    if (!saved) throw new Error("Film could not be saved.");

    await writeAudit(admin, {
      actorId: context.userId,
      actorEmail: (context.claims["email"] as string) ?? null,
      action: id ? "films.update" : "films.create",
      entity: "films",
      entityKey: data.slug,
      previous: null,
      next: { title: data.title, published: data.published },
    });

    return { film: normalise(saved) };
  });

/** Removes a film record permanently. */
export const deleteFilm = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { getAdmin, writeAudit } = await import("@/lib/comm.server");
    const admin = await getAdmin();
    const { error } = await admin.from("films").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await writeAudit(admin, {
      actorId: context.userId,
      actorEmail: (context.claims["email"] as string) ?? null,
      action: "films.delete",
      entity: "films",
      entityKey: data.id,
      previous: null,
      next: null,
    });
    return { ok: true };
  });

const uploadSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(90)
    .regex(/^[a-z0-9-]+$/),
  kind: z.enum(["poster", "still"]),
  fileName: z.string().min(1).max(160),
  contentType: z.string().min(3).max(120),
  data: z.string().min(8).max(14_000_000),
});

/** Uploads a poster or still and returns its stable public URL. */
export const uploadFilmImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => uploadSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { getAdmin } = await import("@/lib/comm.server");
    const admin = await getAdmin();

    const bytes = Buffer.from(data.data, "base64");
    if (bytes.byteLength > 8 * 1024 * 1024) {
      throw new Error("Images must be 8 MB or smaller.");
    }
    const safeName = data.fileName.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-80);
    const path = `${data.slug}/${data.kind}/${Date.now()}-${safeName}`;

    const { error } = await admin.storage
      .from("film-media")
      .upload(path, bytes, { contentType: data.contentType, upsert: true });
    if (error) throw new Error(error.message);

    return { url: `/api/public/film-media/${path}` };
  });
