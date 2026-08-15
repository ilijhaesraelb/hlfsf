import { createFileRoute } from "@tanstack/react-router";
import { GoldLink, PageHero, Section } from "@/components/site/primitives";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "Partner Portal | High Light Source Film Studios" },
      {
        name: "description",
        content:
          "Secure document access for authorized High Light Source Film Studios partners — investors, governments, film commissions, co-producers, broadcasters and distributors.",
      },
      { property: "og:title", content: "Partner Portal | HLS Film Studios" },
      {
        property: "og:description",
        content: "Secure access for authorized HLS partners.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Portal,
});

const ROLES = [
  "Investor",
  "Government",
  "Film Commission",
  "Co-Producer",
  "Broadcaster",
  "Distributor",
  "Internal Executive",
];

function Portal() {
  return (
    <>
      <PageHero
        eyebrow="Secure Access"
        title="HLS Partner Portal"
        subtitle="Confidential production and financing material is available to authorized partners only."
      />
      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="display text-sm text-gold">Access Roles</h2>
            <ul className="mt-6 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
              {ROLES.map((r) => (
                <li
                  key={r}
                  className="bg-[#050505] px-6 py-5 text-sm text-silver"
                >
                  {r}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-xs leading-relaxed text-silver">
              Portal access includes two-factor authentication, role-based
              permissions, watermarking, download controls, access logging and
              document expiration.
            </p>
          </div>
          <div className="border border-border bg-graphite p-8">
            <h2 className="display text-sm text-gold">Request Access</h2>
            <p className="mt-4 text-sm leading-relaxed text-silver">
              Secure authentication activates in Phase III. Until then, submit a
              partner access request and the HLS team will verify your
              organization directly.
            </p>
            <div className="mt-8">
              <GoldLink to="/contact" variant="solid">
                Request Partner Access
              </GoldLink>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
