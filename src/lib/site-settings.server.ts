import { createClient } from "@supabase/supabase-js";

export type PublicSettings = Record<string, string>;

/**
 * Reads the publicly visible company, brand and logo values with the
 * publishable key. Only rows flagged public are exposed by the policy.
 */
export async function readPublicSettings(): Promise<PublicSettings> {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  const url = process.env["SUPABASE_URL"];
  if (!key || !url) return {};

  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });

  const { data, error } = await client
    .from("site_settings")
    .select("key,value")
    .eq("is_public", true);
  if (error) {
    console.error("site_settings read failed", error.message);
    return {};
  }
  return Object.fromEntries(
    (data ?? []).map((row) => [String(row.key), String(row.value ?? "")]),
  );
}
