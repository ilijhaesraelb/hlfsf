import { createFileRoute } from "@tanstack/react-router";

/**
 * Serves film posters and stills from the private film-media area under a
 * stable public URL, so artwork can be replaced without any code changes.
 */
export const Route = createFileRoute("/api/public/film-media/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = String((params as { _splat?: string })._splat ?? "");
        if (!path || path.includes("..")) {
          return new Response("Not found", { status: 404 });
        }

        const { supabaseAdmin } = await import(
          "@/integrations/supabase/client.server"
        );
        const { data, error } = await supabaseAdmin.storage
          .from("film-media")
          .download(path);
        if (error || !data) return new Response("Not found", { status: 404 });

        return new Response(await data.arrayBuffer(), {
          headers: {
            "Content-Type": data.type || "application/octet-stream",
            "Cache-Control": "public, max-age=300",
          },
        });
      },
    },
  },
});
