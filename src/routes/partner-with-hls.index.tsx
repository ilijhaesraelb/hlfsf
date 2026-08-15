import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, Loader2 } from "lucide-react";
import { PageHero, Section } from "@/components/site/primitives";
import { submitPartnerLead } from "@/lib/leads.functions";
import { useCurrentLocale } from "@/components/site/LanguageSwitcher";

export const Route = createFileRoute("/partner-with-hls/")({
  head: () => ({
    meta: [
      { title: "Partner With HLS | High Light Source Film Studios" },
      {
        name: "description",
        content:
          "Submit a partnership inquiry to High Light Source Film Studios. Tell us your role, country and project type and our team routes it into the right pipeline stage.",
      },
      { property: "og:title", content: "Partner With HLS" },
      {
        property: "og:description",
        content:
          "Co-production, financing, distribution, location and institutional partnerships with High Light Source Film Studios.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/partner-with-hls" }],
  }),
  component: PartnerWithHls,
});

const ROLES = [
  "Film Commission / Government",
  "International Co-Producer",
  "Investor / Financier",
  "Broadcaster / Streamer",
  "Distributor / Sales Agent",
  "Studio / Facility",
  "Brand / Sponsor",
  "Educational Institution",
  "Other",
];

const PROJECT_TYPES = [
  "Feature Film",
  "Documentary",
  "Series",
  "Short Film",
  "Co-Production Treaty Project",
  "Location & Incentive Program",
  "Film Academy Program",
  "Studio Infrastructure",
];

const BUDGETS = [
  "Under $1M",
  "$1M – $5M",
  "$5M – $20M",
  "$20M – $50M",
  "$50M+",
  "Not yet defined",
];

const TIMELINES = [
  "Immediate",
  "Within 3 months",
  "Within 6–12 months",
  "Exploratory",
];

const PIPELINE = [
  { key: "new", label: "New Inquiry", note: "Logged and acknowledged" },
  { key: "qualifying", label: "Qualifying", note: "Fit and territory review" },
  { key: "discovery", label: "Discovery Call", note: "Scope and objectives" },
  { key: "proposal", label: "Proposal", note: "Structure and terms" },
  { key: "negotiation", label: "Negotiation", note: "Agreements and closing" },
];

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const ACCEPTED =
  ".pdf,.doc,.docx,.ppt,.pptx,.key,.zip,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation";

async function fileToBase64(file: File): Promise<string> {
  const buffer = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  for (let i = 0; i < buffer.length; i += 0x8000) {
    binary += String.fromCharCode(...buffer.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

function PartnerWithHls() {
  const submit = useServerFn(submitPartnerLead);
  const locale = useCurrentLocale();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{
    reference: string;
    stage: string;
    statusToken: string;
  } | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    organization: "",
    role: ROLES[0]!,
    country: "",
    projectType: PROJECT_TYPES[0]!,
    budgetRange: BUDGETS[5]!,
    timeline: TIMELINES[2]!,
    message: "",
  });
  const [consent, setConsent] = useState(false);

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!consent) {
      setError("Please accept the privacy statement to submit your inquiry.");
      return;
    }
    if (file && file.size > MAX_UPLOAD_BYTES) {
      setError("Attachments must be 8 MB or smaller.");
      return;
    }
    setBusy(true);
    try {
      const attachment = file
        ? {
            name: file.name,
            type: file.type,
            data: await fileToBase64(file),
          }
        : null;
      const result = await submit({
        data: { ...form, locale, consentPrivacy: true, attachment },
      });
      setDone({
        reference: result.reference,
        stage: result.stage,
        statusToken: result.statusToken,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError(
        "We couldn't submit your inquiry. Please review the required fields and try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Partnerships"
        title="Partner With HLS"
        subtitle="Co-production, financing, distribution, locations and institutional collaboration. Tell us who you are and what you're building — your inquiry enters our partnership pipeline immediately."
      />

      <Section>
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            {done ? (
              <div className="border border-gold/40 bg-graphite/50 p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-gold/50 text-gold">
                    <Check size={16} />
                  </span>
                  <p className="display text-base text-foreground">
                    Inquiry received — reference {done.reference}
                  </p>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-silver">
                  Your submission is now at the{" "}
                  <span className="text-gold uppercase tracking-[0.18em]">
                    {done.stage}
                  </span>{" "}
                  stage of the HLS partnership pipeline. A partnerships lead
                  will contact you at{" "}
                  <span className="text-foreground">{form.email}</span>.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/partner-with-hls/status"
                    search={{ token: done.statusToken }}
                    className="inline-flex min-h-11 items-center border border-gold bg-gold px-6 text-[0.68rem] uppercase tracking-[0.26em] text-primary-foreground"
                  >
                    Track this inquiry
                  </Link>
                  <Link
                    to="/international"
                    className="inline-flex min-h-11 items-center border border-gold/60 px-6 text-[0.68rem] uppercase tracking-[0.26em] text-gold hover:bg-gold hover:text-primary-foreground"
                  >
                    Explore territories
                  </Link>
                  <Link
                    to="/newsletter"
                    className="inline-flex min-h-11 items-center border border-border px-6 text-[0.68rem] uppercase tracking-[0.26em] text-silver hover:text-gold"
                  >
                    Get studio dispatches
                  </Link>
                </div>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="border border-border bg-graphite/40 p-6 sm:p-8"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name *">
                    <input
                      required
                      value={form.fullName}
                      onChange={(e) => set("fullName", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Email *">
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Organization">
                    <input
                      value={form.organization}
                      onChange={(e) => set("organization", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Country *">
                    <input
                      required
                      value={form.country}
                      onChange={(e) => set("country", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Your role *">
                    <select
                      value={form.role}
                      onChange={(e) => set("role", e.target.value)}
                      className={inputClass}
                    >
                      {ROLES.map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Project type *">
                    <select
                      value={form.projectType}
                      onChange={(e) => set("projectType", e.target.value)}
                      className={inputClass}
                    >
                      {PROJECT_TYPES.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Budget range">
                    <select
                      value={form.budgetRange}
                      onChange={(e) => set("budgetRange", e.target.value)}
                      className={inputClass}
                    >
                      {BUDGETS.map((b) => (
                        <option key={b}>{b}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Timeline">
                    <select
                      value={form.timeline}
                      onChange={(e) => set("timeline", e.target.value)}
                      className={inputClass}
                    >
                      {TIMELINES.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="mt-4">
                  <Field label="Tell us about the opportunity">
                    <textarea
                      rows={5}
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                </div>

                <div className="mt-6 border border-border bg-graphite/30 p-5">
                  <label
                    htmlFor="lead-attachment"
                    className="eyebrow block"
                  >
                    Pitch deck or project brief (optional)
                  </label>
                  <input
                    id="lead-attachment"
                    type="file"
                    accept={ACCEPTED}
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    className="mt-3 block w-full text-xs text-silver file:mr-4 file:min-h-11 file:cursor-pointer file:border file:border-gold/50 file:bg-transparent file:px-5 file:text-[0.62rem] file:uppercase file:tracking-[0.26em] file:text-gold"
                  />
                  <p className="mt-3 text-[0.68rem] leading-relaxed text-silver">
                    PDF, Word, Keynote, PowerPoint or ZIP up to 8 MB. Documents
                    are stored privately and shared only with the HLS
                    partnerships team.
                  </p>
                  {file && (
                    <p className="mt-2 text-[0.68rem] text-gold">
                      Attached: {file.name} (
                      {(file.size / 1024 / 1024).toFixed(2)} MB)
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="ml-3 underline"
                      >
                        Remove
                      </button>
                    </p>
                  )}
                </div>



                <label className="mt-6 flex gap-3 text-xs leading-relaxed text-silver">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#D4AF37]"
                  />
                  <span>
                    I consent to HLS storing and processing these details to
                    evaluate a partnership, as described in the{" "}
                    <Link to="/privacy" className="text-gold underline">
                      privacy policy
                    </Link>
                    .
                  </span>
                </label>

                {error && <p className="mt-4 text-xs text-red-400">{error}</p>}

                <button
                  type="submit"
                  disabled={busy}
                  className="mt-6 inline-flex min-h-11 items-center gap-2 border border-gold bg-gold px-7 text-[0.68rem] uppercase tracking-[0.26em] text-primary-foreground disabled:opacity-60"
                >
                  {busy && <Loader2 size={14} className="animate-spin" />}
                  Submit inquiry
                </button>
              </form>
            )}
          </div>

          <aside>
            <h2 className="display text-lg text-foreground">
              The partnership pipeline
            </h2>
            <ol className="mt-6 space-y-5">
              {PIPELINE.map((step, i) => (
                <li key={step.key} className="flex gap-4">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center border border-gold/50 text-[0.6rem] text-gold">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block text-sm text-foreground">
                      {step.label}
                    </span>
                    <span className="block text-xs text-silver">
                      {step.note}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-xs leading-relaxed text-silver">
              Every inquiry is logged with its role, country and project type so
              the right regional team picks it up. Investor and government
              inquiries are handled under confidentiality.
            </p>
          </aside>
        </div>
      </Section>
    </>
  );
}

const inputClass =
  "mt-2 w-full border border-border bg-background px-3 py-3 text-sm text-foreground outline-none focus:border-gold/70";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      {children}
    </label>
  );
}
