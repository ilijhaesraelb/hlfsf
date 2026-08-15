import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Embed mode is used when the site is displayed inside another page (for
 * example a WordPress page on Hostinger) through an iframe.
 *
 * It is enabled when either:
 * - the URL carries `?embed=1`, or
 * - the document is rendered inside a frame it does not own.
 *
 * In embed mode the global header, footer and cinematic intro are suppressed
 * so the host page supplies its own chrome, and the document height is
 * published to the parent window so the iframe can resize itself.
 */
export function useEmbedMode(): boolean {
  const search = useRouterState({
    select: (s) => s.location.search as Record<string, unknown>,
  });
  const flagged =
    search?.["embed"] === "1" ||
    search?.["embed"] === 1 ||
    search?.["embed"] === true;

  const [framed, setFramed] = useState(false);
  useEffect(() => {
    try {
      setFramed(window.self !== window.top);
    } catch {
      // Cross-origin access to window.top throws, which itself means framed.
      setFramed(true);
    }
  }, []);

  return Boolean(flagged) || framed;
}

/**
 * Publishes the rendered document height (and navigation changes) to the host
 * page so an embedding iframe can grow and shrink with the content instead of
 * showing an inner scrollbar.
 */
export function useEmbedHeightReporter(active: boolean) {
  const href = useRouterState({ select: (s) => s.location.href });

  useEffect(() => {
    if (!active || typeof window === "undefined") return;
    if (window.parent === window) return;

    let last = 0;
    const post = () => {
      const height = Math.ceil(
        Math.max(
          document.documentElement.scrollHeight,
          document.body?.scrollHeight ?? 0,
        ),
      );
      if (Math.abs(height - last) < 8) return;
      last = height;
      window.parent.postMessage({ type: "hls:embed:height", height, href }, "*");
    };

    post();
    const observer = new ResizeObserver(post);
    observer.observe(document.documentElement);
    if (document.body) observer.observe(document.body);
    const timer = window.setInterval(post, 1000);
    window.addEventListener("load", post);

    return () => {
      observer.disconnect();
      window.clearInterval(timer);
      window.removeEventListener("load", post);
    };
  }, [active, href]);
}
