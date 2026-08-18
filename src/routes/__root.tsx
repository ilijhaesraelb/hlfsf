import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CinematicIntro } from "@/components/site/CinematicIntro";
import { getPublicSiteSettings } from "@/lib/site-settings.functions";
import { useEmbedMode, useEmbedHeightReporter } from "@/lib/embed";
import {
  SiteSettingsProvider,
  brandCss,
  type PublicSettings,
} from "@/lib/site-settings";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="display text-6xl text-gold">404</h1>
        <h2 className="display mt-6 text-lg text-foreground">Page not found</h2>
        <p className="mt-3 text-sm text-silver">
          This page doesn't exist or hasn't been published yet.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            search={{}}
            className="inline-flex min-h-11 items-center border border-gold/60 px-6 text-[0.68rem] uppercase tracking-[0.26em] text-gold hover:bg-gold hover:text-primary-foreground"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="display text-lg text-foreground">
          This page didn't load
        </h1>
        <p className="mt-3 text-sm text-silver">
          Something went wrong. Try again or head back home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex min-h-11 items-center border border-gold/60 px-6 text-[0.68rem] uppercase tracking-[0.26em] text-gold hover:bg-gold hover:text-primary-foreground"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex min-h-11 items-center border border-border px-6 text-[0.68rem] uppercase tracking-[0.26em] text-silver"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: async () => {
    try {
      return { settings: (await getPublicSiteSettings()) as PublicSettings };
    } catch {
      return { settings: {} as PublicSettings };
    }
  },
  head: ({ loaderData }) => {
    const s = loaderData?.settings ?? {};
    const brand = s["brand_name"]?.trim() || "High Light Source Film Studios";
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: brand },
        {
          name: "description",
          content:
            s["meta_description"]?.trim() ||
            "An international film production, education and economic development company.",
        },
        { name: "author", content: brand },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Manrope:wght@300;400;500;600&display=swap",
        },
        { rel: "icon", href: s["logo_favicon"]?.trim() || "/favicon.png" },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const settings = Route.useLoaderData()?.settings ?? {};
  const embedded = useEmbedMode();
  useEmbedHeightReporter(embedded);

  return (
    <QueryClientProvider client={queryClient}>
      <SiteSettingsProvider value={settings}>
        <style dangerouslySetInnerHTML={{ __html: brandCss(settings) }} />
        {embedded ? null : (
          <>
            <CinematicIntro />
            <Header />
          </>
        )}
        <main className="min-h-screen bg-background">
          {/* Required: nested routes render here. */}
          <Outlet />
        </main>
        {embedded ? null : <Footer />}
      </SiteSettingsProvider>
    </QueryClientProvider>
  );
}
