import { createFileRoute } from "@tanstack/react-router";

const BODY = (origin: string) => `User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: *
Allow: /
Disallow: /newsletter/confirm
Disallow: /newsletter/manage
Disallow: /newsletter/unsubscribe
Disallow: /partner-with-hls/status
Disallow: /portal

Sitemap: ${origin}/sitemap.xml
`;

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const url = new URL(request.url);
        const forwardedHost =
          url.hostname === "localhost"
            ? request.headers.get("x-forwarded-host")
            : null;
        const origin = forwardedHost ? `https://${forwardedHost}` : url.origin;

        return new Response(BODY(origin), {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
