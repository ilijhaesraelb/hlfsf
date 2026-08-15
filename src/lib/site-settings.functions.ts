import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export type SettingRow = {
  key: string;
  value: string;
  group_key: string;
  label: string;
  help: string | null;
  kind: string;
  is_public: boolean;
  sort_order: number;
};

/**
 * Public read of the centrally managed company, brand and logo values.
 * Runs during SSR with the publishable key so the header, footer and
 * page templates always render the current studio information.
 */
export const getPublicSiteSettings = createServerFn({ method: "GET" }).handler(
  async () => {
    const { readPublicSettings } = await import("@/lib/site-settings.server");
    return readPublicSettings();
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

/** Full settings list for the HLS Admin editor. */
export const getSiteSettingsAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as never);
    const { getAdmin } = await import("@/lib/comm.server");
    const admin = await getAdmin();
    const { data, error } = await admin
      .from("site_settings")
      .select("*")
      .order("group_key")
      .order("sort_order");
    if (error) throw new Error(error.message);
    return { settings: (data ?? []) as unknown as SettingRow[] };
  });

const updateSchema = z.object({
  changes: z
    .array(
      z.object({
        key: z.string().min(1).max(80),
        value: z.string().max(4000),
      }),
    )
    .min(1)
    .max(80),
});

/** Saves edited settings and records who changed what. */
export const updateSiteSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => updateSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { getAdmin, writeAudit } = await import("@/lib/comm.server");
    const admin = await getAdmin();

    const keys = data.changes.map((c) => c.key);
    const { data: before } = await admin
      .from("site_settings")
      .select("key,value")
      .in("key", keys);
    const previous = Object.fromEntries(
      ((before ?? []) as unknown as { key: string; value: string }[]).map((r) => [
        r.key,
        r.value,
      ]),
    );

    for (const change of data.changes) {
      if (previous[change.key] === change.value) continue;
      const { error } = await admin
        .from("site_settings")
        .update({ value: change.value } as never)
        .eq("key", change.key);
      if (error) throw new Error(error.message);
      await writeAudit(admin, {
        actorId: context.userId,
        actorEmail: (context.claims["email"] as string) ?? null,
        action: "site_settings.update",
        entity: "site_settings",
        entityKey: change.key,
        previous: { value: previous[change.key] ?? null },
        next: { value: change.value },
      });
    }

    const { data: after } = await admin
      .from("site_settings")
      .select("*")
      .order("group_key")
      .order("sort_order");
    return { settings: (after ?? []) as unknown as SettingRow[] };
  });

const uploadSchema = z.object({
  key: z.string().min(1).max(80),
  fileName: z.string().min(1).max(160),
  contentType: z.string().min(3).max(120),
  data: z.string().min(8).max(8_000_000),
});

/** Uploads a brand asset and points the chosen logo slot at it. */
export const uploadBrandAsset = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => uploadSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { getAdmin, writeAudit } = await import("@/lib/comm.server");
    const admin = await getAdmin();

    const safeName = data.fileName.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-80);
    const path = `${data.key}/${Date.now()}-${safeName}`;
    const bytes = Buffer.from(data.data, "base64");
    if (bytes.byteLength > 5 * 1024 * 1024) {
      throw new Error("Brand assets must be 5 MB or smaller.");
    }

    const { error: uploadError } = await admin.storage
      .from("brand")
      .upload(path, bytes, { contentType: data.contentType, upsert: true });
    if (uploadError) throw new Error(uploadError.message);

    const url = `/api/public/brand/${path}`;
    const { error } = await admin
      .from("site_settings")
      .update({ value: url } as never)
      .eq("key", data.key);
    if (error) throw new Error(error.message);

    await writeAudit(admin, {
      actorId: context.userId,
      actorEmail: (context.claims["email"] as string) ?? null,
      action: "site_settings.upload",
      entity: "site_settings",
      entityKey: data.key,
      previous: null,
      next: { value: url },
    });

    return { key: data.key, url };
  });
