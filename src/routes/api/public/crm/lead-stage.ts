import { createFileRoute } from "@tanstack/react-router";
import { advanceLeadStage, stageUpdateSchema } from "@/lib/crm.server";

/**
 * CRM integration endpoint.
 * Moves a Partner With HLS lead to a new pipeline stage and queues the
 * applicant status email plus the internal studio notification.
 *
 * POST /api/public/crm/lead-stage
 * Header: x-hls-crm-key: <CRM_API_KEY>
 * Body: { "reference": "A1B2C3D4", "stage": "proposal", "note": "..." }
 */
export const Route = createFileRoute("/api/public/crm/lead-stage")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["CRM_API_KEY"];
        const provided = request.headers.get("x-hls-crm-key");
        if (!key || !provided || provided !== key) {
          return new Response("Unauthorized", { status: 401 });
        }

        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const parsed = stageUpdateSchema.safeParse(payload);
        if (!parsed.success) {
          return Response.json(
            { error: "invalid_payload", issues: parsed.error.issues },
            { status: 400 },
          );
        }

        try {
          const result = await advanceLeadStage(parsed.data);
          return Response.json(result, { status: result.ok ? 200 : 404 });
        } catch (err) {
          return Response.json(
            { error: err instanceof Error ? err.message : "failed" },
            { status: 500 },
          );
        }
      },
    },
  },
});
