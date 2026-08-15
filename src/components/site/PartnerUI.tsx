import { Link } from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";
import { Eyebrow, Heading, Section } from "@/components/site/primitives";

type To = NonNullable<ComponentProps<typeof Link>["to"]>;

/** Cinematic hero used across the corporate partnership portal. */
export function PartnerHero({
  eyebrow,
  title,
  subtitle,
  lede,
  actions,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  lede?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="grain relative overflow-hidden border-b border-border px-5 pb-24 pt-40 lg:px-8">
      <div
        aria-hidden
        className="beam animate-beam absolute left-1/2 top-0 h-[85%] w-56 -translate-x-1/2 opacity-50"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,color-mix(in_oklab,var(--gold)_12%,transparent),transparent_60%)]"
      />
      <div className="relative mx-auto max-w-4xl text-center">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="display animate-rise mt-6 text-3xl leading-[1.15] text-foreground sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 text-xs uppercase tracking-[0.28em] text-gold sm:text-sm">
            {subtitle}
          </p>
        )}
        {lede && (
          <p className="mx-auto mt-8 max-w-2xl text-sm leading-relaxed text-silver sm:text-base">
            {lede}
          </p>
        )}
        {actions && (
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

/** Executive-grade CTA button that renders as an internal link. */
export function PartnerButton({
  to,
  children,
  variant = "outline",
  hash,
}: {
  to: To;
  children: ReactNode;
  variant?: "solid" | "outline" | "quiet";
  hash?: string;
}) {
  const styles = {
    solid:
      "border border-gold bg-gold text-primary-foreground hover:bg-gold-bright",
    outline:
      "border border-gold/50 text-gold hover:border-gold hover:bg-gold/10",
    quiet:
      "border border-border text-silver hover:border-gold/50 hover:text-gold",
  }[variant];

  return (
    <Link
      to={to}
      {...(hash ? { hash } : {})}
      className={`inline-flex min-h-11 items-center justify-center px-6 py-3 text-[0.66rem] uppercase tracking-[0.24em] transition-colors ${styles}`}
    >
      {children}
    </Link>
  );
}

/** Dark glass panel with a gold hairline. */
export function GlassPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border border-border bg-graphite/50 p-8 backdrop-blur-sm transition-colors hover:border-gold/40 ${className}`}
    >
      {children}
    </div>
  );
}

/** Gold-bulleted list of opportunities. */
export function GoldList({
  items,
  columns = 2,
}: {
  items: readonly string[];
  columns?: 1 | 2 | 3;
}) {
  const cols =
    columns === 3
      ? "sm:grid-cols-2 lg:grid-cols-3"
      : columns === 2
        ? "sm:grid-cols-2"
        : "";
  return (
    <ul className={`grid gap-x-8 gap-y-3 ${cols}`}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm text-silver">
          <span
            aria-hidden
            className="mt-2 h-px w-4 shrink-0 bg-gold/70"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Section header with eyebrow, heading and optional body copy. */
export function PanelIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="max-w-3xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <Heading>{title}</Heading>
      {children && (
        <div className="mt-8 space-y-5 text-sm leading-relaxed text-silver sm:text-base">
          {children}
        </div>
      )}
    </div>
  );
}

/** Discreet legal note. */
export function LegalNote({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="border-l border-gold/40 pl-5">
      <p className="text-[0.58rem] uppercase tracking-[0.28em] text-gold">
        {label}
      </p>
      <p className="mt-3 text-xs leading-relaxed text-silver">{children}</p>
    </div>
  );
}

/** Shared closing block: private discussion pathways. */
export function ConfidentialCta({
  title = "Private & confidential discussions",
  body = "Organizations may request a mutual confidentiality agreement before providing sensitive proprietary, financial or transaction-related information.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <Section className="border-t border-border">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow>Confidential</Eyebrow>
        <Heading>{title}</Heading>
        <p className="mt-8 text-sm leading-relaxed text-silver sm:text-base">
          {body}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <PartnerButton to="/partners/confidential-inquiry" variant="solid">
            Submit Confidential Inquiry
          </PartnerButton>
          <PartnerButton to="/partners/confidential-inquiry" hash="private-meeting">
            Request Private Meeting
          </PartnerButton>
        </div>
      </div>
    </Section>
  );
}
