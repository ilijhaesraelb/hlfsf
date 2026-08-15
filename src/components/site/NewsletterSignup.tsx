import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { Check, Loader2 } from "lucide-react";
import {
  subscribeToNewsletter,
  confirmNewsletter,
} from "@/lib/newsletter.functions";
import { useCurrentLocale } from "@/components/site/LanguageSwitcher";

const INTERESTS = [
  "Film Slate & Releases",
  "International Co-Production",
  "Investor & Financing News",
  "Film Academy & Talent",
  "Casting Calls",
] as const;

type Phase = "form" | "sent" | "confirmed";

export function NewsletterSignup({
  variant = "full",
}: {
  variant?: "full" | "compact";
}) {
  const subscribe = useServerFn(subscribeToNewsletter);
  const confirm = useServerFn(confirmNewsletter);
  const locale = useCurrentLocale();

  const [phase, setPhase] = useState<Phase>("form");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [manageToken, setManageToken] = useState<string | null>(null);

  const toggleInterest = (value: string) =>
    setInterests((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value],
    );

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!consentMarketing || !consentPrivacy) {
      setError("Please confirm both consent statements to continue.");
      return;
    }

    setBusy(true);
    try {
      const result = await subscribe({
        data: {
          email,
          fullName,
          locale,
          interests,
          consentMarketing: true,
          consentPrivacy: true,
        },
      });
      setToken(result.token);
      setManageToken(result.manageToken);
      setPhase("sent");
    } catch (err) {
      setError(
        err instanceof Error
          ? "We couldn't complete your signup. Please check your email address and try again."
          : "Something went wrong. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function onConfirm() {
    if (!token) return;
    setBusy(true);
    setError(null);
    try {
      await confirm({ data: { token } });
      setPhase("confirmed");
    } catch {
      setError("We couldn't confirm your subscription. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (phase !== "form") {
    return (
      <div className="border border-gold/40 bg-graphite/50 p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-full border border-gold/50 text-gold">
            <Check size={16} />
          </span>
          <p className="display text-base text-foreground">
            {phase === "confirmed"
              ? "You're on the list."
              : "One step to go — confirm your subscription."}
          </p>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-silver">
          {phase === "confirmed" ? (
            <>
              <span className="text-foreground">{email}</span> is confirmed for
              HLS studio dispatches. You can unsubscribe at any time using the
              link in every email.
            </>
          ) : (
            <>
              We recorded your consent for{" "}
              <span className="text-foreground">{email}</span>. Confirm below to
              activate your subscription (double opt-in).
            </>
          )}
        </p>

        {error && <p className="mt-4 text-xs text-red-400">{error}</p>}

        <div className="mt-6 flex flex-wrap gap-3">
          {phase === "sent" && (
            <button
              type="button"
              onClick={onConfirm}
              disabled={busy}
              className="inline-flex min-h-11 items-center gap-2 border border-gold bg-gold px-6 text-[0.68rem] uppercase tracking-[0.26em] text-primary-foreground disabled:opacity-60"
            >
              {busy && <Loader2 size={14} className="animate-spin" />}
              Confirm subscription
            </button>
          )}
          {manageToken && (
            <Link
              to="/newsletter/manage"
              search={{ token: manageToken }}
              className="inline-flex min-h-11 items-center border border-gold/60 px-6 text-[0.68rem] uppercase tracking-[0.26em] text-gold hover:bg-gold hover:text-primary-foreground"
            >
              Manage preferences
            </Link>
          )}
          {manageToken && (
            <Link
              to="/newsletter/unsubscribe"
              search={{ token: manageToken }}
              className="inline-flex min-h-11 items-center border border-border px-6 text-[0.68rem] uppercase tracking-[0.26em] text-silver hover:text-gold"
            >
              Unsubscribe
            </Link>
          )}
          <Link
            to="/privacy"
            className="inline-flex min-h-11 items-center border border-border px-6 text-[0.68rem] uppercase tracking-[0.26em] text-silver hover:text-gold"
          >
            Privacy policy
          </Link>
        </div>
      </div>
    );
  }

  const compact = variant === "compact";

  return (
    <form
      onSubmit={onSubmit}
      className={compact ? "" : "border border-border bg-graphite/40 p-6 sm:p-8"}
    >
      <div className={compact ? "space-y-3" : "grid gap-4 sm:grid-cols-2"}>
        <label className="block">
          <span className="eyebrow">Email address</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@studio.com"
            className="mt-2 w-full border border-border bg-background px-3 py-3 text-sm text-foreground outline-none focus:border-gold/70"
          />
        </label>
        <label className="block">
          <span className="eyebrow">Full name (optional)</span>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-2 w-full border border-border bg-background px-3 py-3 text-sm text-foreground outline-none focus:border-gold/70"
          />
        </label>
      </div>

      {!compact && (
        <fieldset className="mt-6">
          <legend className="eyebrow">Interests</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {INTERESTS.map((item) => {
              const active = interests.includes(item);
              return (
                <button
                  type="button"
                  key={item}
                  onClick={() => toggleInterest(item)}
                  aria-pressed={active}
                  className={`border px-3 py-2 text-[0.62rem] uppercase tracking-[0.18em] transition-colors ${
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
      )}

      <div className="mt-6 space-y-3 text-xs leading-relaxed text-silver">
        <label className="flex gap-3">
          <input
            type="checkbox"
            checked={consentMarketing}
            onChange={(e) => setConsentMarketing(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#D4AF37]"
          />
          <span>
            I agree to receive studio news, slate updates and opportunity
            announcements from High Light Source Film Studios by email.
          </span>
        </label>
        <label className="flex gap-3">
          <input
            type="checkbox"
            checked={consentPrivacy}
            onChange={(e) => setConsentPrivacy(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#D4AF37]"
          />
          <span>
            I have read the{" "}
            <Link to="/privacy" className="text-gold underline">
              privacy policy
            </Link>{" "}
            and consent to HLS storing my details. I can withdraw consent at any
            time.
          </span>
        </label>
      </div>

      {error && <p className="mt-4 text-xs text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="mt-6 inline-flex min-h-11 items-center gap-2 border border-gold px-6 text-[0.68rem] uppercase tracking-[0.26em] text-gold transition-colors hover:bg-gold hover:text-primary-foreground disabled:opacity-60"
      >
        {busy && <Loader2 size={14} className="animate-spin" />}
        Subscribe
      </button>
    </form>
  );
}
