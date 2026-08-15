import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageHero, Section } from "@/components/site/primitives";
import { getLeadStatus } from "@/lib/leads.functions";

const STAGES = [
  { key: "new", label: "New Inquiry" },
  { key: "qualifying", label: "Qualifying" },
  { key: "discovery", label: "Discovery Call" },
  { key: "proposal", label: "Proposal" },
  { key: "negotiation", label: "Negotiation" },
  { key: "closed_won", label: "Partnership Active" },
];

export const Route = createFileRoute("/partner-with-hls/status")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search["token"] === "string" ? search["token"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Inquiry Status | High Light Source Film Studios" },
      {
        name: "description",
        content:
          "Track the pipeline stage of your High Light Source Film Studios partnership inquiry.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Inquiry Status | HLS Film Studios" },
      {
        property: "og:description",
        content: "Track your HLS partnership inquiry through the pipeline.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: StatusPage,
});

type Data = Awaited<ReturnType<typeof getLeadStatus>>;

function StatusPage() {
  const { token } = Route.useSearch();
  const load = useServerFn(getLeadStatus);
  const [state, setState] = useState<"loading" | "ready" | "invalid">(
    "loading",
  );
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    let active = true;
    if (!token) {
      setState("invalid");
      return;
    }
    load({ data: { token } })
      .then((res) => {
        if (!active) return;
        if (res.ok) {
          setData(res);
          setState("ready");
        } else setState("invalid");
      })
      .catch(() => active && setState("invalid"));
    return () => {
      active = false;
    };
  }, [token, load]);

  const lead = data?.lead ?? null;
  const currentIndex = lead
    ? STAGES.findIndex((s) => s.key === lead.stage)
    : -1;

  return (
    <>
      <PageHero
        eyebrow="Partnerships"
        title={
          state === "ready" && lead
            ? `Inquiry ${lead.reference}`
            : state === "invalid"
              ? "This status link is not valid"
              : "Loading your inquiry…"
        }
        subtitle={
          state === "ready" && lead
            ? `${lead.projectType} — last updated ${new Date(lead.stageUpdatedAt).toLocaleDateString()}`
            : state === "invalid"
              ? "The link is missing or has expired. Submit a new inquiry or contact the partnerships team."
              : "One moment."
        }
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          {state === "ready" && lead && (
            <>
              <ol className="grid gap-px overflow-hidden border border-border bg-border">
                {STAGES.map((s, i) => {
                  const done = currentIndex >= 0 && i <= currentIndex;
                  return (
                    <li
                      key={s.key}
                      className="flex items-center justify-between bg-[#050505] px-6 py-5"
                      aria-current={i === currentIndex ? "step" : undefined}
                    >
                      <span
                        className={`text-sm ${done ? "text-gold" : "text-silver"}`}
                      >
                        {s.label}
                      </span>
                      <span className="text-[0.6rem] uppercase tracking-[0.26em] text-silver">
                        {i === currentIndex
                          ? "Current"
                          : done
                            ? "Complete"
                            : "Pending"}
                      </span>
                    </li>
                  );
                })}
              </ol>

              {data && data.events.length > 0 && (
                <div className="mt-10">
                  <h2 className="display text-sm text-gold">Activity</h2>
                  <ul className="mt-4 space-y-3 text-sm text-silver">
                    {data.events.map((e, i) => (
                      <li key={i} className="border-l border-gold/40 pl-4">
                        <span className="text-foreground uppercase tracking-[0.18em] text-[0.62rem]">
                          {e.stage}
                        </span>
                        <span className="ml-3 text-xs">
                          {new Date(e.createdAt).toLocaleString()}
                        </span>
                        {e.note && <p className="mt-1 text-xs">{e.note}</p>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {lead.attachment && (
                <p className="mt-8 text-xs text-silver">
                  Attached document on file:{" "}
                  <span className="text-foreground">{lead.attachment}</span>
                </p>
              )}
            </>
          )}

          <div className="mt-10">
            <Link
              to="/partner-with-hls"
              className="inline-flex min-h-11 items-center border border-gold/60 px-6 text-[0.68rem] uppercase tracking-[0.26em] text-gold hover:bg-gold hover:text-primary-foreground"
            >
              Partnerships
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
