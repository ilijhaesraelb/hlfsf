import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageHero, Section } from "@/components/site/primitives";
import { unsubscribeNewsletter } from "@/lib/newsletter.functions";

export const Route = createFileRoute("/newsletter/unsubscribe")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search["token"] === "string" ? search["token"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Unsubscribe | High Light Source Film Studios" },
      {
        name: "description",
        content:
          "Unsubscribe from High Light Source Film Studios studio dispatches.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Unsubscribe from HLS dispatches" },
      {
        property: "og:description",
        content: "Stop receiving High Light Source Film Studios email.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: UnsubscribePage,
});

function UnsubscribePage() {
  const { token } = Route.useSearch();
  const unsub = useServerFn(unsubscribeNewsletter);
  const [state, setState] = useState<"working" | "done" | "invalid">("working");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!token) {
      setState("invalid");
      return;
    }
    unsub({ data: { token } })
      .then((res) => {
        if (!active) return;
        if (res.ok) {
          setEmail(res.email);
          setState("done");
        } else setState("invalid");
      })
      .catch(() => active && setState("invalid"));
    return () => {
      active = false;
    };
  }, [token, unsub]);

  return (
    <>
      <PageHero
        eyebrow="Newsletter"
        title={
          state === "done"
            ? "You have been unsubscribed"
            : state === "invalid"
              ? "This unsubscribe link is not valid"
              : "Processing your request…"
        }
        subtitle={
          state === "done"
            ? `${email ?? "Your address"} will no longer receive HLS studio dispatches. You can fine-tune your preferences instead of leaving entirely.`
            : state === "invalid"
              ? "The link is missing or has already been used."
              : "One moment."
        }
      />
      <Section>
        <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-3">
          {state === "done" && token && (
            <Link
              to="/newsletter/manage"
              search={{ token }}
              className="inline-flex min-h-11 items-center border border-gold/60 px-6 text-[0.68rem] uppercase tracking-[0.26em] text-gold hover:bg-gold hover:text-primary-foreground"
            >
              Manage preferences
            </Link>
          )}
          <Link
            to="/newsletter"
            className="inline-flex min-h-11 items-center border border-border px-6 text-[0.68rem] uppercase tracking-[0.26em] text-silver hover:text-gold"
          >
            Back to newsletter
          </Link>
        </div>
      </Section>
    </>
  );
}
