import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Globe } from "lucide-react";
import { LOCALES, parseLocale, type LocaleCode } from "@/lib/i18n";

/** Routes that render localized copy + localized SEO metadata. */
const LOCALIZED_PATHS = ["/", "/films", "/international", "/contact"];

export function useCurrentLocale(): LocaleCode {
  const search = useRouterState({ select: (s) => s.location.search });
  return parseLocale((search as Record<string, unknown>)["lang"]);
}

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const current = useCurrentLocale();

  if (!LOCALIZED_PATHS.includes(pathname)) return null;

  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      role="group"
      aria-label="Select language"
    >
      <Globe size={13} className="shrink-0 text-silver" aria-hidden />
      {LOCALES.map((l) => (
        <button
          key={l.code}
          type="button"
          lang={l.code}
          aria-current={l.code === current ? "true" : undefined}
          title={l.label}
          onClick={() =>
            navigate({
              to: pathname,
              search: { lang: l.code } as never,
              resetScroll: false,
            })
          }

          className={`text-[0.6rem] uppercase tracking-[0.18em] transition-colors ${
            l.code === current
              ? "text-gold"
              : "text-silver hover:text-foreground"
          }`}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}
