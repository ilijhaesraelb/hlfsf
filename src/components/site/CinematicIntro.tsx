import { useCallback, useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import logo from "@/assets/hls-logo.png.asset.json";

const SKIP_KEY = "hls:intro:skip";
const SEEN_KEY = "hls:intro:seen";
const DURATION = 4200;
/** Reduced-motion visitors get a short static title card instead. */
const STATIC_DURATION = 2200;

export function introPreferenceSkipped(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(SKIP_KEY) === "1";
  } catch {
    return false;
  }
}

export function resetIntroPreference() {
  try {
    window.localStorage.removeItem(SKIP_KEY);
    window.sessionStorage.removeItem(SEEN_KEY);
  } catch {
    /* storage unavailable */
  }
}

/**
 * First-visit cinematic intro.
 * Accessibility:
 * - `prefers-reduced-motion: reduce` swaps every animation for a static,
 *   briefly shown title card (no beam sweep, no blur/scale transitions).
 * - Keyboard users land on the Skip button immediately, can dismiss with
 *   Escape, and focus is returned to the document afterwards.
 * - The overlay is otherwise pointer-transparent and auto-dismisses, so it
 *   can never block navigation.
 */
export function CinematicIntro() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [reduced, setReduced] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const startPath = useRef<string | null>(null);
  const skipRef = useRef<HTMLButtonElement | null>(null);

  const dismiss = useCallback(
    (persist: boolean) => {
      setLeaving(true);
      if (persist) {
        try {
          window.localStorage.setItem(SKIP_KEY, "1");
        } catch {
          /* storage unavailable */
        }
      }
      window.setTimeout(() => setVisible(false), reduced ? 0 : 600);
    },
    [reduced],
  );

  useEffect(() => {
    if (introPreferenceSkipped()) return;
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === "1";
      window.sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* storage unavailable */
    }
    if (seen) return;

    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    startPath.current = window.location.pathname;
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const end = () => dismiss(false);
    const onKey = (event: KeyboardEvent) => {
      // Escape and Enter/Space on the focused Skip button both dismiss;
      // any other key also clears the decorative overlay.
      if (event.key === "Tab") return;
      end();
    };

    const timer = window.setTimeout(
      end,
      reduced ? STATIC_DURATION : DURATION,
    );
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", end);
    window.addEventListener("wheel", end, { passive: true });
    window.addEventListener("touchstart", end, { passive: true });

    // Give keyboard users an immediately actionable control.
    skipRef.current?.focus({ preventScroll: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", end);
      window.removeEventListener("wheel", end);
      window.removeEventListener("touchstart", end);
    };
  }, [visible, dismiss, reduced]);

  // Any route change immediately clears the intro.
  useEffect(() => {
    if (!visible) return;
    if (startPath.current !== null && pathname !== startPath.current) {
      dismiss(false);
    }
  }, [pathname, visible, dismiss]);

  if (!visible) return null;

  const anim = (value: string) => (reduced ? undefined : value);

  return (
    <div
      role="dialog"
      aria-label="Studio intro"
      aria-describedby="hls-intro-desc"
      className={`pointer-events-none fixed inset-0 z-[200] bg-[#050505] ${
        reduced ? "" : "transition-opacity duration-700"
      } ${leaving ? "opacity-0" : "opacity-100"}`}
    >
      {!reduced && (
        <div
          className="beam absolute left-1/2 top-0 h-full w-32 -translate-x-1/2 opacity-80"
          style={{ animation: "intro-beam 1400ms ease-out both" }}
        />
      )}
      <div className="grain absolute inset-0" />

      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        <img
          src={logo.url}
          alt=""
          className="h-24 w-24 rounded-full object-cover ring-1 ring-gold/40"
          style={{ animation: anim("intro-mark 1600ms 700ms ease-out both") }}
        />
        <p
          className="display mt-8 text-xl text-foreground sm:text-3xl"
          style={{ animation: anim("intro-mark 1400ms 1400ms ease-out both") }}
        >
          High Light Source
        </p>
        <p
          className="mt-3 text-[0.6rem] tracking-[0.5em] text-gold sm:text-xs"
          style={{ animation: anim("intro-mark 1400ms 1900ms ease-out both") }}
        >
          FILM STUDIOS
        </p>
        <p id="hls-intro-desc" className="sr-only">
          Decorative studio intro. Press Escape or activate Skip Intro to
          dismiss it and never show it again.
        </p>
      </div>

      <button
        ref={skipRef}
        type="button"
        onClick={() => dismiss(true)}
        className="pointer-events-auto absolute bottom-8 right-6 min-h-11 border border-gold/50 px-5 text-[0.6rem] uppercase tracking-[0.26em] text-gold transition-colors hover:bg-gold hover:text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        Skip Intro
      </button>
    </div>
  );
}
