import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { PARTNER_NAV } from "@/data/partnerships";

export const Route = createFileRoute("/partners")({
  component: PartnersLayout,
});

function PartnersLayout() {
  return (
    <>
      <Outlet />
      <nav
        aria-label="Corporate partnership sections"
        className="border-t border-border bg-graphite/40 px-5 py-14 lg:px-8"
      >
        <p className="text-[0.58rem] uppercase tracking-[0.28em] text-gold">
          Partnership Sections
        </p>
        <ul className="mt-8 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {PARTNER_NAV.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="block h-full bg-[#050505] p-6 transition-colors hover:bg-graphite"
                activeOptions={{ exact: true }}
                activeProps={{ className: "block h-full bg-graphite p-6" }}
              >
                <span className="display text-xs text-gold">{item.label}</span>
                <span className="mt-3 block text-xs leading-relaxed text-silver">
                  {item.blurb}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
