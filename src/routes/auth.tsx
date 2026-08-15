import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Section } from "@/components/site/primitives";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Staff Sign In | High Light Source Film Studios" },
      {
        name: "description",
        content:
          "Authorized access to the High Light Source Film Studios Communications Center.",
      },
      { property: "og:title", content: "Staff Sign In | HLS Film Studios" },
      {
        property: "og:description",
        content: "Authorized access to the HLS Communications Center.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const field =
  "w-full border border-border bg-[#050505] px-4 py-3 text-sm text-foreground outline-none focus:border-gold";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin/communications" });
    });
  }, [navigate]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      if (mode === "signin") {
        const { error: err } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (err) throw err;
        navigate({ to: "/admin/communications" });
      } else {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth` },
        });
        if (err) throw err;
        setNotice("Account created. Check your inbox if confirmation is required.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Section>
      <div className="mx-auto max-w-md border border-border bg-graphite p-10">
        <p className="text-[0.58rem] uppercase tracking-[0.28em] text-gold">
          HLS Administration
        </p>
        <h1 className="display mt-4 text-xl text-foreground">
          Communications Center
        </h1>
        <p className="mt-3 text-sm text-silver">
          Authorized studio personnel only.
        </p>

        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-[0.58rem] uppercase tracking-[0.24em] text-silver"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-2 ${field}`}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-[0.58rem] uppercase tracking-[0.24em] text-silver"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-2 ${field}`}
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {notice && <p className="text-sm text-gold">{notice}</p>}
          <button
            type="submit"
            disabled={busy}
            className="min-h-11 w-full border border-gold bg-gold text-[0.65rem] uppercase tracking-[0.24em] text-primary-foreground disabled:opacity-60"
          >
            {busy ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>


        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 text-[0.62rem] uppercase tracking-[0.22em] text-silver hover:text-gold"
        >
          {mode === "signin" ? "Create a staff account" : "Back to sign in"}
        </button>
      </div>
    </Section>
  );
}
