import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import {
  getSiteSettingsAdmin,
  updateSiteSettings,
  uploadBrandAsset,
  type SettingRow,
} from "@/lib/site-settings.functions";

export const Route = createFileRoute("/_authenticated/admin/company")({
  head: () => ({
    meta: [
      { title: "Company & Brand Settings | HLS Administration" },
      {
        name: "description",
        content:
          "Central administration for High Light Source Film Studios company identity, contact details, logos, brand colours and social profiles.",
      },
      { property: "og:title", content: "Company & Brand Settings" },
      {
        property: "og:description",
        content:
          "Manage studio identity, contact details, logos and brand colours from one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CompanySettings,
});

const GROUPS: { key: string; title: string; blurb: string }[] = [
  {
    key: "identity",
    title: "Company Identity",
    blurb: "Names, tagline and corporate description used across the site.",
  },
  {
    key: "contact",
    title: "Contact & Address",
    blurb: "Public contact details shown in the footer and contact pages.",
  },
  {
    key: "website",
    title: "Website",
    blurb: "Canonical website address used for links and metadata.",
  },
  {
    key: "logos",
    title: "Logos & Favicon",
    blurb: "Upload brand files once — every page picks them up automatically.",
  },
  {
    key: "brand",
    title: "Brand Colours",
    blurb: "Studio palette applied site-wide as theme colours.",
  },
  {
    key: "social",
    title: "Social Profiles",
    blurb: "Only profiles with a link are shown in the footer.",
  },
];

const input =
  "w-full border border-border bg-[#050505] px-3 py-2 text-xs text-foreground outline-none focus:border-gold";
const btn =
  "min-h-9 border border-gold/60 px-4 text-[0.6rem] uppercase tracking-[0.2em] text-gold hover:bg-gold hover:text-primary-foreground disabled:opacity-50";

function labelFor(row: SettingRow) {
  if (row.label) return row.label;
  return row.key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function CompanySettings() {
  const load = useServerFn(getSiteSettingsAdmin);
  const save = useServerFn(updateSiteSettings);
  const upload = useServerFn(uploadBrandAsset);

  const [rows, setRows] = useState<SettingRow[] | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    load({})
      .then((res) => {
        setRows(res.settings);
        setDraft(Object.fromEntries(res.settings.map((r) => [r.key, r.value])));
      })
      .catch((e: Error) => setError(e.message));
  }, [load]);

  const grouped = useMemo(() => {
    const map = new Map<string, SettingRow[]>();
    for (const row of rows ?? []) {
      map.set(row.group_key, [...(map.get(row.group_key) ?? []), row]);
    }
    return map;
  }, [rows]);

  const dirty = (rows ?? []).filter((r) => draft[r.key] !== r.value);

  async function onSave() {
    if (!dirty.length) return;
    setBusy(true);
    setError("");
    setStatus("");
    try {
      const res = await save({
        data: { changes: dirty.map((r) => ({ key: r.key, value: draft[r.key] ?? "" })) },
      });
      setRows(res.settings);
      setStatus(`Saved ${dirty.length} change${dirty.length === 1 ? "" : "s"}.`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function onUpload(key: string, file: File) {
    if (file.size > 5 * 1024 * 1024) {
      setError("Brand assets must be 5 MB or smaller.");
      return;
    }
    setBusy(true);
    setError("");
    setStatus("");
    try {
      const buffer = await file.arrayBuffer();
      let binary = "";
      const bytes = new Uint8Array(buffer);
      for (let i = 0; i < bytes.length; i += 1)
        binary += String.fromCharCode(bytes[i]!);
      const res = await upload({
        data: {
          key,
          fileName: file.name,
          contentType: file.type || "application/octet-stream",
          data: btoa(binary),
        },
      });
      setDraft((d) => ({ ...d, [key]: res.url }));
      setRows((rs) =>
        (rs ?? []).map((r) => (r.key === key ? { ...r, value: res.url } : r)),
      );
      setStatus("Upload complete.");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-32 lg:px-8">
      <p className="text-[0.6rem] uppercase tracking-[0.3em] text-gold">
        HLS Administration
      </p>
      <h1 className="display mt-4 text-2xl text-foreground sm:text-3xl">
        Company &amp; Brand
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-silver">
        Everything here is used across the public website. Change a value once
        and every page, header, footer and email template follows.
      </p>

      <nav className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/admin/communications"
          className="border border-border px-4 py-2 text-[0.6rem] uppercase tracking-[0.2em] text-silver hover:text-gold"
        >
          Communications Center
        </Link>
        <span className="border border-gold/60 px-4 py-2 text-[0.6rem] uppercase tracking-[0.2em] text-gold">
          Company &amp; Brand
        </span>
      </nav>

      {error ? (
        <p className="mt-6 border border-destructive/50 px-4 py-3 text-xs text-destructive">
          {error}
        </p>
      ) : null}
      {status ? (
        <p className="mt-6 border border-gold/40 px-4 py-3 text-xs text-gold">
          {status}
        </p>
      ) : null}

      {!rows ? (
        <p className="mt-10 text-sm text-silver">Loading settings…</p>
      ) : (
        <div className="mt-10 space-y-8">
          {GROUPS.filter((g) => grouped.get(g.key)?.length).map((group) => (
            <section
              key={group.key}
              className="border border-border bg-graphite/40 p-6"
            >
              <h2 className="display text-sm text-gold">{group.title}</h2>
              <p className="mt-2 text-xs text-silver">{group.blurb}</p>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {(grouped.get(group.key) ?? []).map((row) => (
                  <div
                    key={row.key}
                    className={row.kind === "longtext" ? "sm:col-span-2" : ""}
                  >
                    <label
                      htmlFor={`f-${row.key}`}
                      className="block text-[0.55rem] uppercase tracking-[0.2em] text-silver"
                    >
                      {labelFor(row)}
                    </label>
                    {row.help ? (
                      <p className="mt-1 text-[0.65rem] text-silver/70">
                        {row.help}
                      </p>
                    ) : null}

                    {row.kind === "longtext" ? (
                      <textarea
                        id={`f-${row.key}`}
                        rows={4}
                        className={`${input} mt-2`}
                        value={draft[row.key] ?? ""}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, [row.key]: e.target.value }))
                        }
                      />
                    ) : row.kind === "color" ? (
                      <div className="mt-2 flex items-center gap-3">
                        <input
                          type="color"
                          aria-label={`${labelFor(row)} colour picker`}
                          className="h-9 w-12 border border-border bg-transparent"
                          value={/^#[0-9a-f]{6}$/i.test(draft[row.key] ?? "")
                            ? (draft[row.key] as string)
                            : "#000000"}
                          onChange={(e) =>
                            setDraft((d) => ({ ...d, [row.key]: e.target.value }))
                          }
                        />
                        <input
                          id={`f-${row.key}`}
                          className={input}
                          value={draft[row.key] ?? ""}
                          onChange={(e) =>
                            setDraft((d) => ({ ...d, [row.key]: e.target.value }))
                          }
                        />
                      </div>
                    ) : row.kind === "image" ? (
                      <div className="mt-2 space-y-2">
                        {draft[row.key] ? (
                          <img
                            src={draft[row.key]}
                            alt={`${labelFor(row)} preview`}
                            className="h-16 w-16 border border-border object-contain"
                          />
                        ) : null}
                        <input
                          id={`f-${row.key}`}
                          className={input}
                          placeholder="No file uploaded"
                          value={draft[row.key] ?? ""}
                          onChange={(e) =>
                            setDraft((d) => ({ ...d, [row.key]: e.target.value }))
                          }
                        />
                        <input
                          type="file"
                          accept="image/*"
                          aria-label={`Upload ${labelFor(row)}`}
                          className="block w-full text-[0.65rem] text-silver file:mr-3 file:border file:border-gold/50 file:bg-transparent file:px-3 file:py-1 file:text-[0.6rem] file:uppercase file:tracking-[0.2em] file:text-gold"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) void onUpload(row.key, file);
                          }}
                        />
                      </div>
                    ) : (
                      <input
                        id={`f-${row.key}`}
                        className={`${input} mt-2`}
                        value={draft[row.key] ?? ""}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, [row.key]: e.target.value }))
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}

          <div className="sticky bottom-4 flex items-center gap-4 border border-gold/30 bg-[#050505]/95 px-5 py-4">
            <button
              type="button"
              className={btn}
              disabled={busy || !dirty.length}
              onClick={() => void onSave()}
            >
              {busy ? "Saving…" : `Save changes${dirty.length ? ` (${dirty.length})` : ""}`}
            </button>
            <p className="text-xs text-silver">
              Changes go live immediately across the public site.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
