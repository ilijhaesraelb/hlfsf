import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    <Select
      value={current}
      onValueChange={(value) =>
        navigate({
          to: pathname,
          search: { lang: value as LocaleCode } as never,
          resetScroll: false,
        })
      }
    >
      <SelectTrigger
        aria-label="Select language"
        className={`h-auto w-auto gap-1.5 border-0 bg-transparent px-1 py-0 text-[0.6rem] uppercase tracking-[0.18em] text-silver shadow-none hover:text-foreground focus:ring-0 focus:ring-offset-0 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:opacity-100 ${className}`}
      >
        <Globe size={13} className="shrink-0" aria-hidden />
        <SelectValue>{LOCALES.find((l) => l.code === current)?.short}</SelectValue>
      </SelectTrigger>
      <SelectContent className="min-w-36 border-border bg-graphite text-foreground">
        {LOCALES.map((l) => (
          <SelectItem
            key={l.code}
            value={l.code}
            lang={l.code}
            className="text-[0.68rem] uppercase tracking-[0.14em] text-silver focus:bg-border/60 focus:text-gold data-[state=checked]:text-gold"
          >
            {l.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
