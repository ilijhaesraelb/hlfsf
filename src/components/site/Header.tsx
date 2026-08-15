import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/hls-logo.png.asset.json";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";
import { useSiteSettings } from "@/lib/site-settings";


const NAV = [
  { to: "/", label: "Home" },
  { to: "/studio", label: "Studio" },
  { to: "/films", label: "Films" },
  { to: "/development", label: "Productions" },
  { to: "/international", label: "International" },
  { to: "/academy", label: "Film Academy" },
  { to: "/partners", label: "Partnerships" },
  { to: "/news", label: "News" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { setting } = useSiteSettings();
  const brandName = setting("brand_name");
  const [brandLead, ...brandRest] = brandName.split(" Film ");
  const brandTail = brandRest.length
    ? `FILM ${brandRest.join(" Film ")}`.toUpperCase()
    : "";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 lg:px-8">
        <Link to="/" search={{}} className="flex min-w-0 items-center gap-3">
          <img
            src={setting("logo_primary") || logo.url}
            alt={`${brandName} emblem`}
            className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-gold/40"
          />
          <span className="min-w-0 leading-tight">
            <span className="display block whitespace-nowrap text-[0.72rem] text-foreground sm:text-sm">
              {brandLead}
            </span>
            {brandTail ? (
              <span className="block whitespace-nowrap text-[0.55rem] tracking-[0.4em] text-silver">
                {brandTail}
              </span>
            ) : null}
          </span>
        </Link>


        <nav className="hidden items-center gap-4 xl:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              search={{}}
              className="text-[0.62rem] uppercase tracking-[0.14em] text-silver transition-colors hover:text-gold"
              activeProps={{ className: "text-gold" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
          <LanguageSwitcher className="pl-1" />
          <Link
            to="/partner-with-hls"
            className="border border-gold/60 px-3 py-2 text-[0.6rem] uppercase tracking-[0.16em] text-gold transition-colors hover:bg-gold hover:text-primary-foreground"
          >
            Partner with HLS
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="grid h-11 w-11 place-items-center text-gold xl:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-border bg-background/95 px-5 pb-6 pt-2 backdrop-blur-xl xl:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              search={{}}
              onClick={() => setOpen(false)}
              className="block border-b border-border/60 py-3 text-xs uppercase tracking-[0.24em] text-silver"
              activeProps={{ className: "text-gold" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
          <LanguageSwitcher className="mt-5 justify-center" />
          <Link
            to="/partner-with-hls"
            onClick={() => setOpen(false)}
            className="mt-5 block border border-gold/60 py-3 text-center text-xs uppercase tracking-[0.24em] text-gold"
          >
            Partner with HLS
          </Link>
        </nav>
      )}
    </header>
  );
}
