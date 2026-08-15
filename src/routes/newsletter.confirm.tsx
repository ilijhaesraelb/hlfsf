import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageHero, Section } from "@/components/site/primitives";
import { confirmNewsletter } from "@/lib/newsletter.functions";

export const Route = createFileRoute("/newsletter/confirm")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search["token"] === "string" ? search["token"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Confirm your subscription | High Light Source Film Studios" },
      {
        name: "description",
        content:
          "Confirm your High Light Source Film Studios newsletter subscription.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Confirm your HLS subscription" },
      {
        property: "og:description",
        content: "Activate your HLS studio dispatches subscription.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/newsletter/confirm" }],
  }),
  component: ConfirmPage,
});

function ConfirmPage() {
  const { token } = Route.useSearch();
  const confirm = useServerFn(confirmNewsletter);
  const [state, setState] = useState<"working" | "done" | "invalid">("working");
  const [email, setEmail] = useState<string | null>(null);
  const [manageToken, setManageToken] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!token) {
      setState("invalid");
      return;
    }
    confirm({ data: { token } })
      .then((res) => {
        if (!active) return;
        if (res.ok) {
          setEmail(res.email);
          setManageToken(res.manageToken);
          setState("done");
        } else {
          setState("invalid");
        }
      })
      .catch(() => active && setState("invalid"));
    return () => {
      active = false;
    };
  }, [token, confirm]);

  return (
    <>
      <PageHero
        eyebrow="Newsletter"
        title={
          state === "done"
            ? "Subscription confirmed"
            : state === "invalid"
              ? "This link is no longer valid"
              : "Confirming your subscription…"
        }
        subtitle={
          state === "done"
            ? `${email ?? "Your address"} will now receive HLS studio dispatches.`
            : state === "invalid"
              ? "The confirmation link is missing or has already been used. You can subscribe again below."
              : "One moment while we activate your subscription."
        }

      />
      <Section>
        <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-3 text-center">
          {manageToken && (
            <Link
              to="/newsletter/manage"
              search={{ token: manageToken }}
              className="inline-flex min-h-11 items-center border border-gold bg-gold px-6 text-[0.68rem] uppercase tracking-[0.26em] text-primary-foreground"
            >
              Manage preferences
            </Link>
          )}
          <Link
            to="/newsletter"
            className="inline-flex min-h-11 items-center border border-gold/60 px-6 text-[0.68rem] uppercase tracking-[0.26em] text-gold hover:bg-gold hover:text-primary-foreground"
          >
            Back to newsletter
          </Link>
        </div>
      </Section>
    </>
  );
}
