import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageHero, Section, Eyebrow } from "@/components/site/primitives";
import { localizedHead, pageCopy, validateLocaleSearch } from "@/lib/i18n";
import { submitContactInquiry } from "@/lib/contact.functions";

export const Route = createFileRoute("/contact")({
  validateSearch: validateLocaleSearch,
  loaderDeps: ({ search }) => ({ lang: search.lang }),
  loader: ({ deps }) => ({ lang: deps.lang }),
  head: ({ loaderData }) =>
    localizedHead("contact", loaderData?.lang ?? "en", "/contact"),
  component: Contact,
});


type Kind =
  | "Film Commission / Government"
  | "International Co-Producer"
  | "Investor / Financing"
  | "Broadcaster / Streaming"
  | "Distribution"
  | "Talent"
  | "Employment"
  | "Film Academy"
  | "Press"
  | "General Inquiry";

const KINDS: Kind[] = [
  "Film Commission / Government",
  "International Co-Producer",
  "Investor / Financing",
  "Broadcaster / Streaming",
  "Distribution",
  "Talent",
  "Employment",
  "Film Academy",
  "Press",
  "General Inquiry",
];

const EXTRA: Record<string, string[]> = {
  "Film Commission / Government": [
    "Organization",
    "Government Department / Film Commission",
    "Position",
    "Official Website",
    "Funding Programs",
    "Production Incentives",
  ],
  "International Co-Producer": [
    "Company",
    "Producer Name",
    "Website",
    "IMDb / Professional Profile",
    "Previous Productions",
    "Co-Production Experience",
  ],
  "Investor / Financing": [
    "Organization",
    "Investor Type",
    "Areas of Interest",
    "Preferred Contact Method",
  ],
  "Broadcaster / Streaming": ["Organization", "Territories", "Content Needs"],
  Distribution: ["Company", "Territories", "Rights of Interest"],
  Talent: ["Professional Category", "Demo Reel URL", "IMDb URL", "Languages"],
  Employment: ["Department of Interest", "Portfolio / Resume URL"],
  "Film Academy": ["Program of Interest", "Education Background"],
  Press: ["Publication", "Deadline"],
  "General Inquiry": [],
};

function Field({ label }: { label: string }) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[0.6rem] uppercase tracking-[0.24em] text-silver"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        className="mt-2 min-h-11 w-full border border-border bg-[#050505] px-4 text-sm text-foreground placeholder:text-muted-foreground"
      />
    </div>
  );
}

function Contact() {
  const { lang } = Route.useSearch();
  const copy = pageCopy("contact", lang ?? "en");
  const submit = useServerFn(submitContactInquiry);
  const [kind, setKind] = useState<Kind>("General Inquiry");
  const [reference, setReference] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const get = (label: string) =>
      String(form.get(label.toLowerCase().replace(/[^a-z0-9]+/g, "-")) ?? "");
    const extra: Record<string, string> = {};
    for (const f of EXTRA[kind] ?? []) {
      const v = get(f);
      if (v) extra[f] = v;
    }
    try {
      const result = await submit({
        data: {
          category: kind,
          fullName: get("Contact Name"),
          email: get("Email"),
          country: get("Country"),
          telephone: get("Telephone"),
          organization: extra["Organization"] ?? extra["Company"] ?? "",
          message: String(form.get("message") ?? ""),
          extra,
          locale: lang ?? "en",
          companyFax: String(form.get("company-fax") ?? ""),
        },
      });
      setReference(result.reference);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "The inquiry could not be sent.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        subtitle={copy.subtitle}
      />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_1.6fr]">
          <div>
            <Eyebrow>Inquiry Type</Eyebrow>
            <ul className="mt-6 space-y-2">
              {KINDS.map((k) => (
                <li key={k}>
                  <button
                    type="button"
                    onClick={() => setKind(k)}
                    aria-pressed={kind === k}
                    className={`min-h-11 w-full border px-4 text-left text-[0.62rem] uppercase tracking-[0.2em] transition-colors ${
                      kind === k
                        ? "border-gold text-gold"
                        : "border-border text-silver hover:border-gold/50"
                    }`}
                  >
                    {k}
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-xs leading-relaxed text-silver">
              Each inquiry type is routed automatically to the responsible
              department. Addresses are managed centrally by the studio, so
              messages always reach the current representative.
            </p>
          </div>

          {reference ? (
            <div
              role="status"
              className="border border-gold/40 bg-graphite/50 p-10"
            >
              <p className="text-[0.58rem] uppercase tracking-[0.28em] text-gold">
                Inquiry Received
              </p>
              <h2 className="display mt-6 text-xl text-foreground">
                Thank you for contacting High Light Source Film Studios.
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-silver">
                Your message has been received and routed to the appropriate
                department. Please retain your reference number for future
                correspondence.
              </p>
              <p className="display mt-6 text-lg text-gold">{reference}</p>
            </div>
          ) : (
            <form
              className="border border-border bg-graphite p-8"
              onSubmit={onSubmit}
            >
              <h2 className="display text-sm text-gold">{kind}</h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <Field label="Contact Name" />
                <Field label="Email" />
                <Field label="Country" />
                <Field label="Telephone" />
                {(EXTRA[kind] ?? []).map((f) => (
                  <Field key={f} label={f} />
                ))}
              </div>
              <div className="mt-6">
                <label
                  htmlFor="message"
                  className="block text-[0.6rem] uppercase tracking-[0.24em] text-silver"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="mt-2 w-full border border-border bg-[#050505] p-4 text-sm text-foreground"
                />
              </div>
              <input
                type="text"
                name="company-fax"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="hidden"
              />
              <p className="mt-6 text-xs leading-relaxed text-silver">
                Please do not submit confidential financial, banking or identity
                documentation through this form. Due diligence is handled
                through a secure controlled process. High Light Source Film
                Studios does not accept unsolicited scripts, treatments,
                concepts or other creative materials through general email.
              </p>
              {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={busy}
                className="mt-8 min-h-11 border border-gold bg-gold px-8 text-[0.65rem] uppercase tracking-[0.24em] text-primary-foreground disabled:opacity-60"
              >
                {busy ? "Sending…" : "Submit Inquiry"}
              </button>
            </form>
          )}
        </div>
      </Section>
    </>
  );
}

