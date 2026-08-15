import { createFileRoute } from "@tanstack/react-router";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/i18n";
import { FILMS } from "@/data/site";

/** Routes that exist in every supported language. */
const LOCALIZED_PATHS = ["/", "/films", "/international", "/contact"];

/** Single-language public routes. */
const STATIC_PATHS = [
  "/studio",
  "/development",
  "/news",
  "/press",
  "/partners",
  "/partners/naming-rights",
  "/partners/automotive",
  "/partners/founding-partners",
  "/partners/technology",
  "/partners/studio-development",
  "/partners/production-sponsorships",
  "/partners/education",
  "/partner-with-hls",
  "/academy",
  "/talent",
  "/casting",
  "/careers",
  "/newsletter",
  "/privacy",
  "/terms",
  "/accessibility",
];

function localeUrl(origin: string, path: string, lang: string) {
  const base = `${origin}${path === "/" ? "" : path}` || `${origin}/`;
  const url = path === "/" ? `${origin}/` : base;
  return lang === DEFAULT_LOCALE ? url : `${url}?lang=${lang}`;
}

function alternates(origin: string, path: string) {
  return [
    ...LOCALES.map(
      (l) =>
        `    <xhtml:link rel="alternate" hreflang="${l.code}" href="${localeUrl(origin, path, l.code)}" />`,
    ),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${localeUrl(origin, path, DEFAULT_LOCALE)}" />`,
  ].join("\n");
}

function buildSitemap(origin: string) {
  const today = new Date().toISOString().slice(0, 10);
  const entries: string[] = [];

  for (const path of LOCALIZED_PATHS) {
    for (const l of LOCALES) {
      entries.push(
        `  <url>\n    <loc>${localeUrl(origin, path, l.code)}</loc>\n${alternates(origin, path)}\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${path === "/" ? "1.0" : "0.8"}</priority>\n  </url>`,
      );
    }
  }

  for (const path of STATIC_PATHS) {
    entries.push(
      `  <url>\n    <loc>${origin}${path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`,
    );
  }

  for (const film of FILMS) {
    entries.push(
      `  <url>\n    <loc>${origin}/films/${film.slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`,
    );
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join("\n")}\n</urlset>\n`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const url = new URL(request.url);
        const forwardedHost =
          url.hostname === "localhost"
            ? request.headers.get("x-forwarded-host")
            : null;
        const origin = forwardedHost
          ? `https://${forwardedHost}`
          : url.origin;

        return new Response(buildSitemap(origin), {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
