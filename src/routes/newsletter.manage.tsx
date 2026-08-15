import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, Loader2 } from "lucide-react";
import { PageHero, Section } from "@/components/site/primitives";
import {
  getNewsletterPreferences,
  updateNewsletterPreferences,
  unsubscribeNewsletter,
  resubscribeNewsletter,
} from "@/lib/newsletter.functions";
import { LOCALES } from "@/lib/i18n";

const INTERESTS = [
  "Film Slate & Releases",
  "International Co-Production",
  "Investor & Financing News",
  "Film Academy & Talent",
  "Casting Calls",
] as const;

export const Route = createFileRoute("/newsletter/manage")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search["token"] === "string" ? search["token"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Email Preferences | High Light Source Film Studios" },
      {
        name: "description",
        content:
          "Manage which High Light Source Film Studios communications you receive, change your language, or unsubscribe entirely.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "HLS Email Preference Centre" },
      {
        property: "og:description",
        content: "Manage your HLS communication types and consent.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ManagePage,
});

function ManagePage() {
  const { token } = Route.useSearch();
  const load = useServerFn(getNewsletterPreferences);
  const save = useServerFn(updateNewsletterPreferences);
  const unsub = useServerFn(unsubscribeNewsletter);
  const resub = useServerFn(resubscribeNewsletter);

  const [state, setState] = useState<"loading" | "ready" | "invalid">(
    "loading",
  );
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("pending");
  const [fullName, setFullName] = useState("");
  const [locale, setLocale] = useState("en");
  const [interests, setInterests] = useState<string[]>([]);
  const [consentMarketing, setConsentMarketing] = useState(true);

  useEffect(() => {
    let active = true;
    if (!token) {
      setState("invalid");
      return;
    }
    load({ data: { token } })
      .then((res) => {
        if (!active) return;
        if (!res.ok || !res.subscriber) {
          setState("invalid");
          return;
        }
        setEmail(res.subscriber.email);
        setStatus(res.subscriber.status);
        setFullName(res.subscriber.fullName);
        setLocale(res.subscriber.locale);
        setInterests(res.subscriber.interests);
        setConsentMarketing(res.subscriber.consentMarketing);
        setState("ready");
      })
      .catch(() => active && setState("invalid"));
    return () => {
      active = false;
    };
  }, [token, load]);

  const toggle = (value: string) =>
    setInterests((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value],
    );

  async function onSave(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      const res = await save({
        data: { token, fullName, locale, interests, consentMarketing },
      });
      if (!res.ok) throw new Error("failed");
      setStatus(res.status);
      setSaved(true);
    } catch {
      setError("We couldn't save your preferences. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function onUnsubscribe() {
    setBusy(true);
    setError(null);
    try {
      const res = await unsub({ data: { token } });
      if (!res.ok) throw new Error("failed");
      setStatus("unsubscribed");
      setConsentMarketing(false);
      setSaved(true);
    } catch {
      setError("We couldn't unsubscribe you. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function onResubscribe() {
    setBusy(true);
    setError(null);
    try {
      const res = await resub({ data: { token } });
      if (!res.ok) throw new Error("failed");
      setStatus("confirmed");
      setConsentMarketing(true);
      setSaved(true);
    } catch {
      setError("We couldn't reactivate your subscription. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Newsletter"
        title="Email preference centre"
        subtitle={
          state === "ready"
            ? `Managing communications for ${email}.`
            : state === "invalid"
              ? "This preference link is missing or no longer valid."
              : "Loading your preferences…"
        }
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          {state === "invalid" && (
            <Link
              to="/newsletter"
              className="inline-flex min-h-11 items-center border border-gold/60 px-6 text-[0.68rem] uppercase tracking-[0.26em] text-gold hover:bg-gold hover:text-primary-foreground"
            >
              Subscribe again
            </Link>
          )}

          {state === "ready" && (
            <form
              onSubmit={onSave}
              className="border border-border bg-graphite/40 p-6 sm:p-8"
            >
              <p className="text-xs uppercase tracking-[0.26em] text-gold">
                Status: {status}
              </p>

              <label className="mt-6 block">
                <span className="eyebrow">Full name</span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-2 w-full border border-border bg-background px-3 py-3 text-sm text-foreground outline-none focus:border-gold/70"
                />
              </label>

              <fieldset className="mt-6">
                <legend className="eyebrow">Communication types</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {INTERESTS.map((item) => {
                    const active = interests.includes(item);
                    return (
                      <button
                        type="button"
                        key={item}
                        onClick={() => toggle(item)}
                        aria-pressed={active}
                        className={`min-h-11 border px-3 py-2 text-[0.62rem] uppercase tracking-[0.18em] transition-colors ${
                          active
                            ? "border-gold text-gold"
                            : "border-border text-silver hover:border-gold/50"
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset className="mt-6">
                <legend className="eyebrow">Preferred language</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {LOCALES.map((l) => (
                    <button
                      type="button"
                      key={l.code}
                      onClick={() => setLocale(l.code)}
                      aria-pressed={locale === l.code}
                      className={`min-h-11 border px-4 text-[0.62rem] uppercase tracking-[0.18em] transition-colors ${
                        locale === l.code
                          ? "border-gold text-gold"
                          : "border-border text-silver hover:border-gold/50"
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="mt-6 flex gap-3 text-xs leading-relaxed text-silver">
                <input
                  type="checkbox"
                  checked={consentMarketing}
                  onChange={(e) => setConsentMarketing(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#D4AF37]"
                />
                <span>
                  I consent to receiving marketing email from High Light Source
                  Film Studios. Clearing this box stops all campaigns.
                </span>
              </label>

              {error && <p className="mt-4 text-xs text-red-400">{error}</p>}
              {saved && !error && (
                <p className="mt-4 flex items-center gap-2 text-xs text-gold">
                  <Check size={14} /> Preferences saved.
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex min-h-11 items-center gap-2 border border-gold bg-gold px-6 text-[0.68rem] uppercase tracking-[0.26em] text-primary-foreground disabled:opacity-60"
                >
                  {busy && <Loader2 size={14} className="animate-spin" />}
                  Save preferences
                </button>
                {status === "unsubscribed" ? (
                  <button
                    type="button"
                    onClick={onResubscribe}
                    disabled={busy}
                    className="inline-flex min-h-11 items-center border border-gold/60 px-6 text-[0.68rem] uppercase tracking-[0.26em] text-gold disabled:opacity-60"
                  >
                    Reactivate subscription
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onUnsubscribe}
                    disabled={busy}
                    className="inline-flex min-h-11 items-center border border-border px-6 text-[0.68rem] uppercase tracking-[0.26em] text-silver hover:text-gold disabled:opacity-60"
                  >
                    Unsubscribe from everything
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </Section>
    </>
  );
}
