import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  claimCommsAdmin,
  departmentUsage,
  getCommsWorkspace,
  resendMessage,
  runRoutingTest,
  updateDepartment,
  updateFormRoute,
  updateRoutingRule,
  updateSetting,
  updateSignature,
  updateTemplate,
} from "@/lib/comms.functions";

export const Route = createFileRoute("/_authenticated/admin/communications")({
  head: () => ({
    meta: [
      { title: "HLS Communications Center | Studio Administration" },
      {
        name: "description",
        content:
          "Central administration for High Light Source Film Studios department email addresses, form routing, auto responses, signatures and delivery logs.",
      },
      { property: "og:title", content: "HLS Communications Center" },
      {
        property: "og:description",
        content:
          "Manage department addresses, routing rules, templates and delivery logs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CommunicationsCenter,
});

type Workspace = Awaited<ReturnType<typeof getCommsWorkspace>>;

const TABS = [
  "Dashboard",
  "Email Addresses",
  "Form Routing",
  "Routing Rules",
  "Auto Responses",
  "Signatures",
  "Confidential Routing",
  "Global Settings",
  "SMTP / Delivery",
  "Email Logs",
  "Audit Log",
  "Test Center",
] as const;
type Tab = (typeof TABS)[number];

const input =
  "w-full border border-border bg-[#050505] px-3 py-2 text-xs text-foreground outline-none focus:border-gold";
const cell = "border-b border-border/60 px-3 py-2 align-top text-xs text-silver";
const head =
  "border-b border-gold/30 px-3 py-2 text-left text-[0.55rem] uppercase tracking-[0.2em] text-gold";
const btn =
  "min-h-9 border border-gold/60 px-4 text-[0.6rem] uppercase tracking-[0.2em] text-gold hover:bg-gold hover:text-primary-foreground disabled:opacity-50";

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-border bg-graphite/40 p-6">
      <h2 className="display text-sm text-gold">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function CommunicationsCenter() {
  const load = useServerFn(getCommsWorkspace);
  const claim = useServerFn(claimCommsAdmin);

  const [tab, setTab] = useState<Tab>("Dashboard");
  const [ws, setWs] = useState<Workspace | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    try {
      setWs(await load({ data: undefined } as never));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load workspace.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const forbidden = error === "Forbidden";

  if (loading && !ws) {
    return <p className="p-16 text-sm text-silver">Loading communications…</p>;
  }

  if (forbidden) {
    return (
      <div className="mx-auto max-w-lg p-16 text-center">
        <h1 className="display text-lg text-foreground">Access restricted</h1>
        <p className="mt-4 text-sm text-silver">
          Your account has no communications role. If this studio has not yet
          appointed an administrator, you may claim the first super-administrator
          account.
        </p>
        <button
          className={`${btn} mt-8`}
          onClick={async () => {
            try {
              await claim({ data: undefined } as never);
              await refresh();
            } catch (err) {
              setStatus(err instanceof Error ? err.message : "Failed.");
            }
          }}
        >
          Claim Super Admin
        </button>
        {status && <p className="mt-4 text-xs text-silver">{status}</p>}
        <button
          className="mt-8 block w-full text-[0.6rem] uppercase tracking-[0.2em] text-silver hover:text-gold"
          onClick={() => supabase.auth.signOut().then(() => location.assign("/auth"))}
        >
          Sign out
        </button>
      </div>
    );
  }

  if (!ws) {
    return <p className="p-16 text-sm text-red-400">{error}</p>;
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 py-16">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="text-[0.55rem] uppercase tracking-[0.3em] text-gold">
            HLS Admin
          </p>
          <h1 className="display mt-3 text-2xl text-foreground">
            Communications Center
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/company"
            className="inline-flex min-h-9 items-center border border-border px-4 text-[0.6rem] uppercase tracking-[0.2em] text-silver hover:border-gold/60 hover:text-gold"
          >
            Company &amp; Brand
          </Link>
          <Link
            to="/admin/films"
            className="inline-flex min-h-9 items-center border border-border px-4 text-[0.6rem] uppercase tracking-[0.2em] text-silver hover:border-gold/60 hover:text-gold"
          >
            Films
          </Link>



          <button className={btn} onClick={() => void refresh()}>
            Refresh
          </button>
          <button
            className="min-h-9 border border-border px-4 text-[0.6rem] uppercase tracking-[0.2em] text-silver hover:border-gold/60 hover:text-gold"
            onClick={() =>
              supabase.auth.signOut().then(() => location.assign("/auth"))
            }
          >
            Sign out
          </button>
        </div>
      </header>

      {status && (
        <p role="status" className="mt-4 text-xs text-gold">
          {status}
        </p>
      )}

      <nav className="mt-8 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            aria-pressed={tab === t}
            className={`min-h-9 border px-4 text-[0.58rem] uppercase tracking-[0.18em] ${
              tab === t
                ? "border-gold text-gold"
                : "border-border text-silver hover:border-gold/50"
            }`}
          >
            {t}
          </button>
        ))}
      </nav>

      <div className="mt-10 space-y-10">
        {tab === "Dashboard" && <Dashboard ws={ws} />}
        {tab === "Email Addresses" && (
          <Departments ws={ws} onDone={refresh} setStatus={setStatus} />
        )}
        {tab === "Form Routing" && (
          <Routes ws={ws} onDone={refresh} setStatus={setStatus} />
        )}
        {tab === "Routing Rules" && (
          <Rules ws={ws} onDone={refresh} setStatus={setStatus} />
        )}
        {tab === "Auto Responses" && (
          <Templates ws={ws} onDone={refresh} setStatus={setStatus} />
        )}
        {tab === "Signatures" && (
          <Signatures ws={ws} onDone={refresh} setStatus={setStatus} />
        )}
        {tab === "Confidential Routing" && (
          <SettingsEditor
            settingKey="confidential_routing"
            title="Confidential Recipients"
            ws={ws}
            onDone={refresh}
            setStatus={setStatus}
          />
        )}
        {tab === "Global Settings" && (
          <>
            <SettingsEditor
              settingKey="corporate_profile"
              title="Corporate Profile"
              ws={ws}
              onDone={refresh}
              setStatus={setStatus}
            />
            <SettingsEditor
              settingKey="global"
              title="Global Routing"
              ws={ws}
              onDone={refresh}
              setStatus={setStatus}
            />
            <SettingsEditor
              settingKey="thresholds"
              title="Threshold Alerts"
              ws={ws}
              onDone={refresh}
              setStatus={setStatus}
            />
          </>
        )}
        {tab === "SMTP / Delivery" && (
          <SettingsEditor
            settingKey="delivery"
            title="Delivery Provider"
            ws={ws}
            onDone={refresh}
            setStatus={setStatus}
            note="Credentials are never displayed here. Store API keys and passwords as protected project secrets."
          />
        )}
        {tab === "Email Logs" && <Logs ws={ws} setStatus={setStatus} onDone={refresh} />}
        {tab === "Audit Log" && <Audit ws={ws} />}
        {tab === "Test Center" && <TestCenter ws={ws} setStatus={setStatus} />}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Dashboard({ ws }: { ws: Workspace }) {
  const inquiries = ws.inquiries as Record<string, unknown>[];
  const leads = ws.leads as Record<string, unknown>[];
  const logs = ws.logs as Record<string, unknown>[];
  const has = (arr: Record<string, unknown>[], fn: (r: Record<string, unknown>) => boolean) =>
    arr.filter(fn).length;

  const tiles = [
    ["New Inquiries", has(inquiries, (r) => r["status"] === "new")],
    ["Confidential Inquiries", has(inquiries, (r) => r["confidential"] === true)],
    ["Partnership Leads", leads.length],
    [
      "Automotive Leads",
      has(inquiries, (r) =>
        (r["partnership_types"] as string[] | null)?.some((t) => /vehicle|automotive/i.test(t)) ?? false,
      ),
    ],
    [
      "Property Leads",
      has(inquiries, (r) =>
        (r["partnership_types"] as string[] | null)?.some((t) => /property|building|land/i.test(t)) ?? false,
      ),
    ],
    ["NDA Requests", has(inquiries, (r) => r["nda_requested"] === true)],
    ["High-Priority Leads", has(inquiries, (r) => r["priority"] === "high")],
    ["Delivery Failures", has(logs, (r) => r["status"] === "failed")],
    ["Pending Emails", has(logs, (r) => r["status"] === "queued")],
  ] as const;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map(([label, value]) => (
          <div key={label} className="border border-border bg-graphite/40 p-6">
            <p className="text-[0.55rem] uppercase tracking-[0.22em] text-silver">
              {label}
            </p>
            <p className="display mt-3 text-3xl text-gold">{value}</p>
          </div>
        ))}
      </div>

      <Card title="Recent Inquiries">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr>
                {["Reference", "Organization", "Contact", "Country", "Status", "Priority"].map(
                  (h) => (
                    <th key={h} className={head}>
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {inquiries.slice(0, 12).map((r) => (
                <tr key={String(r["id"])}>
                  <td className={cell}>{String(r["reference"])}</td>
                  <td className={cell}>{String(r["organization"])}</td>
                  <td className={cell}>{String(r["contact_person"])}</td>
                  <td className={cell}>{String(r["country"])}</td>
                  <td className={cell}>{String(r["status"])}</td>
                  <td className={cell}>{String(r["priority"])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

function Departments({
  ws,
  onDone,
  setStatus,
}: {
  ws: Workspace;
  onDone: () => Promise<void>;
  setStatus: (s: string | null) => void;
}) {
  const save = useServerFn(updateDepartment);
  const usage = useServerFn(departmentUsage);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [impact, setImpact] = useState<string | null>(null);

  const departments = ws.departments as Record<string, unknown>[];
  const filtered = useMemo(
    () =>
      departments.filter((d) =>
        `${d["key"]} ${d["name"]} ${d["email"]}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [departments, query],
  );

  async function beginEdit(d: Record<string, unknown>) {
    setEditing(String(d["key"]));
    setDraft({
      name: String(d["name"] ?? ""),
      display_name: String(d["display_name"] ?? ""),
      email: String(d["email"] ?? ""),
      backup_email: String(d["backup_email"] ?? ""),
      visibility: String(d["visibility"] ?? "public"),
      status: String(d["status"] ?? "active"),
      fallback_department: String(d["fallback_department"] ?? ""),
    });
    const u = await usage({ data: { key: String(d["key"]) } });
    setImpact(
      `This department is used by ${u.forms.length} form${u.forms.length === 1 ? "" : "s"} and ${u.rules.length} routing rule${u.rules.length === 1 ? "" : "s"}.`,
    );
  }

  return (
    <Card title="Master Email Directory">
      <input
        className={`${input} mb-5 max-w-sm`}
        placeholder="Search department, address…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px]">
          <thead>
            <tr>
              {[
                "Department",
                "Display Name",
                "Email Address",
                "Backup",
                "Visibility",
                "Status",
                "Last Modified",
                "",
              ].map((h) => (
                <th key={h} className={head}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => {
              const key = String(d["key"]);
              const isEditing = editing === key;
              return (
                <tr key={key}>
                  <td className={cell}>
                    {String(d["name"])}
                    <div className="text-[0.55rem] uppercase tracking-[0.16em] text-silver/50">
                      {key}
                    </div>
                  </td>
                  <td className={cell}>
                    {isEditing ? (
                      <input
                        className={input}
                        value={draft["display_name"] ?? ""}
                        onChange={(e) =>
                          setDraft({ ...draft, display_name: e.target.value })
                        }
                      />
                    ) : (
                      String(d["display_name"] ?? "")
                    )}
                  </td>
                  <td className={cell}>
                    {isEditing ? (
                      <input
                        className={input}
                        value={draft["email"] ?? ""}
                        onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                      />
                    ) : (
                      String(d["email"])
                    )}
                  </td>
                  <td className={cell}>
                    {isEditing ? (
                      <input
                        className={input}
                        value={draft["backup_email"] ?? ""}
                        onChange={(e) =>
                          setDraft({ ...draft, backup_email: e.target.value })
                        }
                      />
                    ) : (
                      String(d["backup_email"] ?? "—")
                    )}
                  </td>
                  <td className={cell}>
                    {isEditing ? (
                      <select
                        className={input}
                        value={draft["visibility"]}
                        onChange={(e) =>
                          setDraft({ ...draft, visibility: e.target.value })
                        }
                      >
                        <option value="public">Public</option>
                        <option value="limited">Limited</option>
                        <option value="private">Private</option>
                      </select>
                    ) : (
                      String(d["visibility"])
                    )}
                  </td>
                  <td className={cell}>
                    {isEditing ? (
                      <select
                        className={input}
                        value={draft["status"]}
                        onChange={(e) => setDraft({ ...draft, status: e.target.value })}
                      >
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="private">Private</option>
                        <option value="archived">Archived</option>
                      </select>
                    ) : (
                      String(d["status"])
                    )}
                  </td>
                  <td className={cell}>
                    {String(d["updated_at"] ?? "").slice(0, 10)}
                  </td>
                  <td className={cell}>
                    {isEditing ? (
                      <div className="space-y-2">
                        {impact && (
                          <p className="text-[0.6rem] text-gold/80">{impact}</p>
                        )}
                        <div className="flex gap-2">
                          <button
                            className={btn}
                            onClick={async () => {
                              try {
                                await save({
                                  data: {
                                    key,
                                    patch: {
                                      name: draft["name"],
                                      display_name: draft["display_name"],
                                      email: draft["email"],
                                      backup_email: draft["backup_email"] || null,
                                      visibility: draft["visibility"] as
                                        | "public"
                                        | "limited"
                                        | "private",
                                      status: draft["status"] as
                                        | "active"
                                        | "paused"
                                        | "private"
                                        | "archived",
                                      fallback_department:
                                        draft["fallback_department"] || null,
                                    },
                                  },
                                });
                                setEditing(null);
                                setStatus(`${key} updated — all connected forms now use the new address.`);
                                await onDone();
                              } catch (err) {
                                setStatus(
                                  err instanceof Error ? err.message : "Update failed.",
                                );
                              }
                            }}
                          >
                            Update Email
                          </button>
                          <button
                            className="text-[0.6rem] uppercase tracking-[0.18em] text-silver"
                            onClick={() => setEditing(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button className={btn} onClick={() => void beginEdit(d)}>
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function Routes({
  ws,
  onDone,
  setStatus,
}: {
  ws: Workspace;
  onDone: () => Promise<void>;
  setStatus: (s: string | null) => void;
}) {
  const save = useServerFn(updateFormRoute);
  const departments = ws.departments as Record<string, unknown>[];
  const templates = ws.templates as Record<string, unknown>[];
  const [drafts, setDrafts] = useState<Record<string, Record<string, unknown>>>({});

  const value = (r: Record<string, unknown>, k: string) =>
    (drafts[String(r["form_key"])]?.[k] ?? r[k] ?? "") as string;
  const setValue = (r: Record<string, unknown>, k: string, v: unknown) =>
    setDrafts((d) => ({
      ...d,
      [String(r["form_key"])]: { ...(d[String(r["form_key"])] ?? {}), [k]: v },
    }));

  const deptOptions = (
    <>
      <option value="">—</option>
      {departments.map((d) => (
        <option key={String(d["key"])} value={String(d["key"])}>
          {String(d["name"])}
        </option>
      ))}
    </>
  );

  return (
    <Card title="Form Routing">
      <div className="space-y-6">
        {(ws.routes as Record<string, unknown>[]).map((r) => (
          <div key={String(r["form_key"])} className="border border-border p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-sm text-foreground">{String(r["label"])}</h3>
              <span className="text-[0.55rem] uppercase tracking-[0.18em] text-silver/60">
                {String(r["form_key"])}
              </span>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <label className="text-[0.55rem] uppercase tracking-[0.2em] text-silver">
                Primary department
                <select
                  className={`${input} mt-2`}
                  value={value(r, "primary_department")}
                  onChange={(e) => setValue(r, "primary_department", e.target.value)}
                >
                  {deptOptions}
                </select>
              </label>
              <label className="text-[0.55rem] uppercase tracking-[0.2em] text-silver">
                Secondary department
                <select
                  className={`${input} mt-2`}
                  value={value(r, "secondary_department")}
                  onChange={(e) => setValue(r, "secondary_department", e.target.value)}
                >
                  {deptOptions}
                </select>
              </label>
              <label className="text-[0.55rem] uppercase tracking-[0.2em] text-silver">
                Executive CC
                <select
                  className={`${input} mt-2`}
                  value={value(r, "executive_cc")}
                  onChange={(e) => setValue(r, "executive_cc", e.target.value)}
                >
                  {deptOptions}
                </select>
              </label>
              <label className="text-[0.55rem] uppercase tracking-[0.2em] text-silver">
                Auto response template
                <select
                  className={`${input} mt-2`}
                  value={value(r, "auto_response_template")}
                  onChange={(e) => setValue(r, "auto_response_template", e.target.value)}
                >
                  <option value="">—</option>
                  {templates.map((t) => (
                    <option key={String(t["key"])} value={String(t["key"])}>
                      {String(t["name"])}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-[0.55rem] uppercase tracking-[0.2em] text-silver">
                CRM category
                <input
                  className={`${input} mt-2`}
                  value={value(r, "crm_category")}
                  onChange={(e) => setValue(r, "crm_category", e.target.value)}
                />
              </label>
              <label className="text-[0.55rem] uppercase tracking-[0.2em] text-silver">
                Reference prefix
                <input
                  className={`${input} mt-2`}
                  value={value(r, "reference_prefix")}
                  onChange={(e) =>
                    setValue(r, "reference_prefix", e.target.value.toUpperCase())
                  }
                />
              </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-6 text-xs text-silver">
              {(
                [
                  ["confidential_routing", "Confidential routing"],
                  ["send_auto_response", "Send auto response"],
                  ["active", "Active"],
                ] as const
              ).map(([k, l]) => (
                <label key={k} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-[var(--gold)]"
                    checked={Boolean(
                      drafts[String(r["form_key"])]?.[k] ?? r[k],
                    )}
                    onChange={(e) => setValue(r, k, e.target.checked)}
                  />
                  {l}
                </label>
              ))}
              <button
                className={btn}
                onClick={async () => {
                  const d = drafts[String(r["form_key"])] ?? {};
                  try {
                    await save({
                      data: {
                        form_key: String(r["form_key"]),
                        patch: {
                          primary_department: String(
                            d["primary_department"] ?? r["primary_department"],
                          ),
                          secondary_department:
                            String(d["secondary_department"] ?? r["secondary_department"] ?? "") ||
                            null,
                          executive_cc:
                            String(d["executive_cc"] ?? r["executive_cc"] ?? "") || null,
                          auto_response_template:
                            String(
                              d["auto_response_template"] ?? r["auto_response_template"] ?? "",
                            ) || null,
                          crm_category:
                            String(d["crm_category"] ?? r["crm_category"] ?? "") || null,
                          reference_prefix: String(
                            d["reference_prefix"] ?? r["reference_prefix"],
                          ),
                          confidential_routing: Boolean(
                            d["confidential_routing"] ?? r["confidential_routing"],
                          ),
                          send_auto_response: Boolean(
                            d["send_auto_response"] ?? r["send_auto_response"],
                          ),
                          active: Boolean(d["active"] ?? r["active"]),
                        },
                      },
                    });
                    setStatus(`${String(r["label"])} routing saved.`);
                    await onDone();
                  } catch (err) {
                    setStatus(err instanceof Error ? err.message : "Save failed.");
                  }
                }}
              >
                Save
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Rules({
  ws,
  onDone,
  setStatus,
}: {
  ws: Workspace;
  onDone: () => Promise<void>;
  setStatus: (s: string | null) => void;
}) {
  const save = useServerFn(updateRoutingRule);
  const [drafts, setDrafts] = useState<Record<string, Record<string, unknown>>>({});
  const departments = ws.departments as Record<string, unknown>[];

  return (
    <Card title="Conditional Routing Rules">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr>
              {["Rule", "Condition", "Value", "Action", "Target department", "Active", ""].map(
                (h) => (
                  <th key={h} className={head}>
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {(ws.rules as Record<string, unknown>[]).map((r) => {
              const id = String(r["id"]);
              const d = drafts[id] ?? {};
              return (
                <tr key={id}>
                  <td className={cell}>{String(r["label"])}</td>
                  <td className={cell}>
                    {String(r["field"])} {String(r["operator"])}
                  </td>
                  <td className={cell}>
                    <input
                      className={input}
                      value={String(d["value"] ?? r["value"] ?? "")}
                      onChange={(e) =>
                        setDrafts({ ...drafts, [id]: { ...d, value: e.target.value } })
                      }
                    />
                  </td>
                  <td className={cell}>
                    <select
                      className={input}
                      value={String(d["action"] ?? r["action"])}
                      onChange={(e) =>
                        setDrafts({ ...drafts, [id]: { ...d, action: e.target.value } })
                      }
                    >
                      <option value="notify">Also notify</option>
                      <option value="restrict">Restrict to</option>
                    </select>
                  </td>
                  <td className={cell}>
                    <select
                      className={input}
                      value={String(d["target_department"] ?? r["target_department"])}
                      onChange={(e) =>
                        setDrafts({
                          ...drafts,
                          [id]: { ...d, target_department: e.target.value },
                        })
                      }
                    >
                      {departments.map((dep) => (
                        <option key={String(dep["key"])} value={String(dep["key"])}>
                          {String(dep["name"])}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className={cell}>
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-[var(--gold)]"
                      checked={Boolean(d["active"] ?? r["active"])}
                      onChange={(e) =>
                        setDrafts({ ...drafts, [id]: { ...d, active: e.target.checked } })
                      }
                    />
                  </td>
                  <td className={cell}>
                    <button
                      className={btn}
                      onClick={async () => {
                        try {
                          await save({
                            data: {
                              id,
                              patch: {
                                value: String(d["value"] ?? r["value"] ?? ""),
                                action: (d["action"] ?? r["action"]) as
                                  | "notify"
                                  | "restrict",
                                target_department: String(
                                  d["target_department"] ?? r["target_department"],
                                ),
                                active: Boolean(d["active"] ?? r["active"]),
                              },
                            },
                          });
                          setStatus("Rule saved.");
                          await onDone();
                        } catch (err) {
                          setStatus(err instanceof Error ? err.message : "Save failed.");
                        }
                      }}
                    >
                      Save
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-5 text-xs text-silver">
        Financial thresholds are editable in Global Settings → Threshold Alerts.
      </p>
    </Card>
  );
}

const PLACEHOLDERS = [
  "{{FIRST_NAME}}",
  "{{LAST_NAME}}",
  "{{ORGANIZATION}}",
  "{{EMAIL}}",
  "{{REFERENCE_NUMBER}}",
  "{{PARTNERSHIP_TYPE}}",
  "{{COUNTRY}}",
  "{{SUBMISSION_DATE}}",
  "{{ASSIGNED_REPRESENTATIVE}}",
  "{{HLS_PHONE}}",
  "{{HLS_WEBSITE}}",
];

function Templates({
  ws,
  onDone,
  setStatus,
}: {
  ws: Workspace;
  onDone: () => Promise<void>;
  setStatus: (s: string | null) => void;
}) {
  const save = useServerFn(updateTemplate);
  const [drafts, setDrafts] = useState<Record<string, { subject: string; body: string }>>({});

  return (
    <Card title="Email Templates & Auto Responses">
      <p className="text-xs text-silver">
        Available placeholders: {PLACEHOLDERS.join("  ")}
      </p>
      <div className="mt-6 space-y-6">
        {(ws.templates as Record<string, unknown>[]).map((t) => {
          const key = String(t["key"]);
          const d = drafts[key] ?? {
            subject: String(t["subject"]),
            body: String(t["body"]),
          };
          return (
            <div key={key} className="border border-border p-5">
              <h3 className="text-sm text-foreground">{String(t["name"])}</h3>
              <input
                className={`${input} mt-4`}
                value={d.subject}
                onChange={(e) =>
                  setDrafts({ ...drafts, [key]: { ...d, subject: e.target.value } })
                }
              />
              <textarea
                rows={10}
                className={`${input} mt-3 font-mono`}
                value={d.body}
                onChange={(e) =>
                  setDrafts({ ...drafts, [key]: { ...d, body: e.target.value } })
                }
              />
              <button
                className={`${btn} mt-4`}
                onClick={async () => {
                  try {
                    await save({
                      data: {
                        key,
                        subject: d.subject,
                        body: d.body,
                        signature_department:
                          (t["signature_department"] as string | null) ?? null,
                      },
                    });
                    setStatus(`Template “${String(t["name"])}” saved.`);
                    await onDone();
                  } catch (err) {
                    setStatus(err instanceof Error ? err.message : "Save failed.");
                  }
                }}
              >
                Save Template
              </button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function Signatures({
  ws,
  onDone,
  setStatus,
}: {
  ws: Workspace;
  onDone: () => Promise<void>;
  setStatus: (s: string | null) => void;
}) {
  const save = useServerFn(updateSignature);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const departments = ws.departments as Record<string, unknown>[];
  const signatures = ws.signatures as Record<string, unknown>[];
  const [dept, setDept] = useState("general");

  const current =
    drafts[dept] ??
    String(
      signatures.find((s) => s["department_key"] === dept)?.["body"] ?? "",
    );

  return (
    <Card title="Department Signatures">
      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <select
          className={input}
          value={dept}
          onChange={(e) => setDept(e.target.value)}
        >
          {departments.map((d) => (
            <option key={String(d["key"])} value={String(d["key"])}>
              {String(d["name"])}
            </option>
          ))}
        </select>
        <div>
          <textarea
            rows={8}
            className={`${input} font-mono`}
            value={current}
            onChange={(e) => setDrafts({ ...drafts, [dept]: e.target.value })}
          />
          <button
            className={`${btn} mt-4`}
            onClick={async () => {
              try {
                await save({ data: { department_key: dept, body: current } });
                setStatus("Signature saved.");
                await onDone();
              } catch (err) {
                setStatus(err instanceof Error ? err.message : "Save failed.");
              }
            }}
          >
            Save Signature
          </button>
        </div>
      </div>
    </Card>
  );
}

function SettingsEditor({
  settingKey,
  title,
  ws,
  onDone,
  setStatus,
  note,
}: {
  settingKey: string;
  title: string;
  ws: Workspace;
  onDone: () => Promise<void>;
  setStatus: (s: string | null) => void;
  note?: string;
}) {
  const save = useServerFn(updateSetting);
  const initial = (ws.settings as Record<string, Record<string, unknown>>)[settingKey] ?? {};
  const [values, setValues] = useState<Record<string, unknown>>(initial);

  return (
    <Card title={title}>
      {note && <p className="mb-5 text-xs text-silver">{note}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(values).map(([k, v]) => (
          <label
            key={k}
            className="text-[0.55rem] uppercase tracking-[0.2em] text-silver"
          >
            {k}
            {typeof v === "boolean" ? (
              <div className="mt-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[var(--gold)]"
                  checked={v}
                  onChange={(e) => setValues({ ...values, [k]: e.target.checked })}
                />
              </div>
            ) : typeof v === "object" && v !== null ? (
              <textarea
                rows={3}
                className={`${input} mt-2 font-mono`}
                value={JSON.stringify(v)}
                onChange={(e) => {
                  try {
                    setValues({ ...values, [k]: JSON.parse(e.target.value) });
                  } catch {
                    /* keep previous value until valid */
                  }
                }}
              />
            ) : (
              <input
                className={`${input} mt-2`}
                value={String(v ?? "")}
                onChange={(e) =>
                  setValues({
                    ...values,
                    [k]:
                      typeof v === "number" ? Number(e.target.value) : e.target.value,
                  })
                }
              />
            )}
          </label>
        ))}
      </div>
      <button
        className={`${btn} mt-6`}
        onClick={async () => {
          try {
            await save({ data: { key: settingKey, value: values } });
            setStatus(`${title} saved.`);
            await onDone();
          } catch (err) {
            setStatus(err instanceof Error ? err.message : "Save failed.");
          }
        }}
      >
        Save
      </button>
    </Card>
  );
}

function Logs({
  ws,
  setStatus,
  onDone,
}: {
  ws: Workspace;
  setStatus: (s: string | null) => void;
  onDone: () => Promise<void>;
}) {
  const resend = useServerFn(resendMessage);
  const [query, setQuery] = useState("");
  const logs = (ws.logs as Record<string, unknown>[]).filter((l) =>
    `${l["reference"]} ${l["to_email"]} ${l["subject"]} ${l["department"]} ${l["status"]}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <Card title="Email Delivery Log">
      <input
        className={`${input} mb-5 max-w-sm`}
        placeholder="Search reference, recipient, department…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px]">
          <thead>
            <tr>
              {["Date", "Reference", "Form", "Department", "Recipient", "Type", "Status", "Error", ""].map(
                (h) => (
                  <th key={h} className={head}>
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={String(l["id"])}>
                <td className={cell}>{String(l["created_at"]).slice(0, 16).replace("T", " ")}</td>
                <td className={cell}>{String(l["reference"] ?? "—")}</td>
                <td className={cell}>{String(l["form_key"] ?? "—")}</td>
                <td className={cell}>{String(l["department"] ?? "—")}</td>
                <td className={cell}>{String(l["to_email"])}</td>
                <td className={cell}>{String(l["kind"])}</td>
                <td className={cell}>{String(l["status"])}</td>
                <td className={cell}>{String(l["error"] ?? "—")}</td>
                <td className={cell}>
                  <button
                    className={btn}
                    onClick={async () => {
                      try {
                        await resend({ data: { id: String(l["id"]) } });
                        setStatus("Notification re-queued.");
                        await onDone();
                      } catch (err) {
                        setStatus(err instanceof Error ? err.message : "Resend failed.");
                      }
                    }}
                  >
                    Resend
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function Audit({ ws }: { ws: Workspace }) {
  return (
    <Card title="Audit Log">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr>
              {["Date", "Administrator", "Action", "Entity", "Previous", "New"].map((h) => (
                <th key={h} className={head}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(ws.audit as Record<string, unknown>[]).map((a) => (
              <tr key={String(a["id"])}>
                <td className={cell}>
                  {String(a["created_at"]).slice(0, 16).replace("T", " ")}
                </td>
                <td className={cell}>{String(a["actor_email"] ?? "—")}</td>
                <td className={cell}>{String(a["action"])}</td>
                <td className={cell}>
                  {String(a["entity"])} / {String(a["entity_key"] ?? "—")}
                </td>
                <td className={`${cell} max-w-[220px] truncate`}>
                  {a["previous_value"] ? JSON.stringify(a["previous_value"]).slice(0, 160) : "—"}
                </td>
                <td className={`${cell} max-w-[220px] truncate`}>
                  {a["new_value"] ? JSON.stringify(a["new_value"]).slice(0, 160) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function TestCenter({
  ws,
  setStatus,
}: {
  ws: Workspace;
  setStatus: (s: string | null) => void;
}) {
  const test = useServerFn(runRoutingTest);
  const [formKey, setFormKey] = useState("general_contact");
  const [confidential, setConfidential] = useState(false);
  const [nda, setNda] = useState(false);
  const [amount, setAmount] = useState(0);
  const [types, setTypes] = useState("");
  const [result, setResult] = useState<Awaited<ReturnType<typeof runRoutingTest>> | null>(
    null,
  );

  async function run(send: boolean) {
    try {
      const r = await test({
        data: {
          formKey,
          send,
          confidential,
          ndaRequested: nda,
          contributionValue: Number(amount) || 0,
          partnershipTypes: types
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        },
      });
      setResult(r);
      setStatus(send ? "Test message queued." : "Routing checked.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Test failed.");
    }
  }

  return (
    <Card title="Test Center">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-[0.55rem] uppercase tracking-[0.2em] text-silver">
          Form
          <select
            className={`${input} mt-2`}
            value={formKey}
            onChange={(e) => setFormKey(e.target.value)}
          >
            {(ws.routes as Record<string, unknown>[]).map((r) => (
              <option key={String(r["form_key"])} value={String(r["form_key"])}>
                {String(r["label"])}
              </option>
            ))}
          </select>
        </label>
        <label className="text-[0.55rem] uppercase tracking-[0.2em] text-silver">
          Partnership types (comma separated)
          <input
            className={`${input} mt-2`}
            value={types}
            onChange={(e) => setTypes(e.target.value)}
          />
        </label>
        <label className="text-[0.55rem] uppercase tracking-[0.2em] text-silver">
          Estimated value (USD)
          <input
            type="number"
            className={`${input} mt-2`}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </label>
        <div className="flex items-end gap-6 text-xs text-silver">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[var(--gold)]"
              checked={confidential}
              onChange={(e) => setConfidential(e.target.checked)}
            />
            Confidential
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[var(--gold)]"
              checked={nda}
              onChange={(e) => setNda(e.target.checked)}
            />
            NDA requested
          </label>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button className={btn} onClick={() => void run(false)}>
          Check Routing
        </button>
        <button className={btn} onClick={() => void run(true)}>
          Send Test
        </button>
      </div>

      {result && (
        <div className="mt-6 border border-border p-5 text-xs text-silver">
          <p>Departments: {result.departments.join(", ") || "—"}</p>
          <p>Recipients: {result.recipients.join(", ") || "—"}</p>
          <p>Auto response: {result.autoResponseTemplate ?? "disabled"}</p>
          <p>Confidential: {result.confidential ? "Yes" : "No"}</p>
          <p>Reference prefix: {result.referencePrefix}</p>
          <p>Applied rules: {result.appliedRules.join("; ") || "none"}</p>
        </div>
      )}
    </Card>
  );
}
