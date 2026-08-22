import { useEffect, useState } from "react";
import { GoldLink } from "./primitives";
import { BRAND } from "@/data/site";

export function CinematicHero() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 200),
      setTimeout(() => setStage(2), 1400),
      setTimeout(() => setStage(3), 2400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section className="grain relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#050505] px-5">
      {/* atmosphere */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 45% at 50% 0%, rgba(212,175,55,0.22), transparent 70%), radial-gradient(90% 60% at 50% 120%, rgba(212,175,55,0.10), transparent 70%)",
        }}
      />
      {/* central beam */}
      <div
        aria-hidden
        className={`beam animate-glow absolute left-1/2 top-0 h-[85%] w-24 sm:w-32 -translate-x-1/2 transition-opacity duration-[2500ms] ${
          stage >= 1 ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* spotlights */}
      <div
        aria-hidden
        className={`absolute left-0 top-10 h-64 w-64 rounded-full bg-gold/15 blur-3xl transition-opacity duration-[3000ms] ${
          stage >= 2 ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        aria-hidden
        className={`absolute right-0 top-10 h-64 w-64 rounded-full bg-gold/15 blur-3xl transition-opacity duration-[3000ms] ${
          stage >= 2 ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* floor reflection */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-gold/10 to-transparent"
      />

      <div className="relative z-10 w-full max-w-4xl py-32 text-center">
        <img
          src="/hls-logo.png"
          alt="High Light Source Film Studios emblem"
          fetchPriority="high"
          className={`mx-auto h-28 w-28 rounded-full object-cover ring-1 ring-gold/40 transition-all duration-[2000ms] sm:h-36 sm:w-36 ${
            stage >= 2 ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        />
        <h1
          className={`display mt-10 text-[1.65rem] leading-[1.25] text-foreground transition-all duration-[1800ms] sm:text-6xl ${
            stage >= 3 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          High Light Source
          <span className="mt-4 block text-[0.7rem] tracking-[0.6em] text-silver sm:text-lg">
            FILM STUDIOS
          </span>
        </h1>
        <p
          className={`mt-8 text-[0.7rem] uppercase tracking-[0.32em] text-gold transition-opacity delay-500 duration-[1800ms] sm:text-sm ${
            stage >= 3 ? "opacity-100" : "opacity-0"
          }`}
        >
          {BRAND.tagline}
        </p>
        <div
          className={`mt-12 flex flex-col items-center justify-center gap-4 transition-opacity delay-700 duration-[1800ms] sm:flex-row ${
            stage >= 3 ? "opacity-100" : "opacity-0"
          }`}
        >
          <GoldLink to="/films" variant="solid">
            Explore Our Films
          </GoldLink>
          <GoldLink to="/partners">Partner with HLS</GoldLink>
        </div>
      </div>
    </section>
  );
}
