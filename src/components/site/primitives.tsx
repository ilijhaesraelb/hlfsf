import { Link } from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";

type To = NonNullable<ComponentProps<typeof Link>["to"]>;

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`px-5 py-20 sm:py-28 lg:px-8 ${className}`}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

export function Heading({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`display mt-5 text-2xl leading-[1.25] text-foreground sm:text-4xl ${className}`}
    >
      {children}
    </h2>
  );
}

export function GoldLink({
  to,
  children,
  variant = "outline",
}: {
  to: To;
  children: ReactNode;
  variant?: "outline" | "solid" | "ghost";
}) {
  const styles = {
    outline:
      "border border-gold/60 text-gold hover:bg-gold hover:text-primary-foreground",
    solid:
      "border border-gold bg-gold text-primary-foreground hover:bg-gold-bright",
    ghost: "border border-border text-silver hover:border-gold/60 hover:text-gold",
  }[variant];

  return (
    <Link
      to={to}
      className={`inline-flex min-h-11 items-center justify-center px-6 text-[0.68rem] uppercase tracking-[0.26em] transition-colors ${styles}`}
    >
      {children}
    </Link>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="grain relative overflow-hidden border-b border-border px-5 pb-20 pt-40 lg:px-8">
      <div
        aria-hidden
        className="beam animate-beam absolute left-1/2 top-0 h-[70%] w-40 -translate-x-1/2 opacity-60"
      />
      <div className="relative mx-auto max-w-4xl text-center">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="display animate-rise mt-6 text-3xl leading-[1.2] text-foreground sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-silver sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

export function Placeholder({ children }: { children: ReactNode }) {
  return (
    <p className="border border-dashed border-gold/30 bg-graphite/60 p-4 text-xs uppercase tracking-[0.2em] text-silver">
      {children}
    </p>
  );
}
