import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024;

const attachmentSchema = z
  .object({
    name: z.string().trim().min(1).max(180),
    type: z.string().trim().max(120).optional().default(""),
    /** base64 (no data: prefix) */
    data: z.string().min(1),
  })
  .optional()
  .nullable();

const leadSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  organization: z.string().trim().max(160).optional().default(""),
  role: z.string().trim().min(2).max(80),
  country: z.string().trim().min(2).max(80),
  projectType: z.string().trim().min(2).max(80),
  budgetRange: z.string().trim().max(80).optional().default(""),
  timeline: z.string().trim().max(80).optional().default(""),
  message: z.string().trim().max(4000).optional().default(""),
  locale: z.string().trim().max(8).optional().default("en"),
  consentPrivacy: z.literal(true),
  attachment: attachmentSchema,
});

const statusSchema = z.object({ token: z.string().uuid() });

export const submitPartnerLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => leadSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { queueEmail, STAGE_COPY } = await import(
      "@/lib/email.server"
    );

    const { data: row, error } = await supabaseAdmin
      .from("partner_leads")
      .insert({
        full_name: data.fullName,
        email: data.email.toLowerCase(),
        organization: data.organization || null,
        role: data.role,
        country: data.country,
        project_type: data.projectType,
        budget_range: data.budgetRange || null,
        timeline: data.timeline || null,
        message: data.message || null,
        locale: data.locale,
        consent_privacy: data.consentPrivacy,
        source: "partner_with_hls",
        stage: "new",
      })
      .select("id, stage, created_at, manage_token")
      .single();

    if (error) throw new Error(error.message);

    // Optional pitch deck / project brief.
    let attachmentName: string | null = null;
    if (data.attachment) {
      const bytes = Uint8Array.from(
        atob(data.attachment.data),
        (c) => c.charCodeAt(0),
      );
      if (bytes.byteLength > MAX_ATTACHMENT_BYTES) {
        throw new Error("Attachment exceeds the 8 MB limit.");
      }
      const safe = data.attachment.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${row.id}/${Date.now()}-${safe}`;
      const { error: upErr } = await supabaseAdmin.storage
        .from("lead-attachments")
        .upload(path, bytes, {
          contentType: data.attachment.type || "application/octet-stream",
          upsert: false,
        });
      if (upErr) throw new Error(upErr.message);

      attachmentName = data.attachment.name;
      await supabaseAdmin
        .from("partner_leads")
        .update({ attachment_path: path, attachment_name: attachmentName })
        .eq("id", row.id);
    }

    await supabaseAdmin
      .from("lead_stage_events")
      .insert({ lead_id: row.id, stage: "new", note: "Inquiry submitted" });

    const reference = row.id.slice(0, 8).toUpperCase();
    const statusUrl = `/partner-with-hls/status?token=${row.manage_token}`;

    // Applicant confirmation.
    await queueEmail(supabaseAdmin as never, {
      to: data.email,
      subject: STAGE_COPY["new"]!.subject,
      body: STAGE_COPY["new"]!.body({
        name: data.fullName,
        reference,
        statusUrl,
      }),
      kind: "lead_stage_new",
      relatedId: row.id,
    });

    // Studio-side notification, routed by HLS Communications (department
    // recipients are configured in the backend, never hard-coded here).
    const { dispatchSubmission } = await import("@/lib/comm.server");
    await dispatchSubmission({
      formKey: "partner_lead",
      ctx: {
        reference,
        firstName: data.fullName.split(" ")[0] ?? "",
        lastName: data.fullName.split(" ").slice(1).join(" "),
        organization: data.organization ?? "",
        email: data.email.toLowerCase(),
        country: data.country,
        partnershipTypes: [data.projectType],
      },
      relatedId: row.id,
      internalDetails: [
        `Role: ${data.role}`,
        `Budget: ${data.budgetRange || "—"}`,
        `Timeline: ${data.timeline || "—"}`,
        `Attachment: ${attachmentName || "none"}`,
        `Status link: ${statusUrl}`,
        "",
        data.message || "(no message)",
      ],
    });


    return {
      reference,
      stage: row.stage,
      createdAt: row.created_at,
      statusToken: row.manage_token,
      attachment: attachmentName,
    };
  });

/** Public status lookup for an applicant, keyed by their secure token. */
export const getLeadStatus = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => statusSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    const { data: row, error } = await supabaseAdmin
      .from("partner_leads")
      .select(
        "id, full_name, stage, stage_updated_at, project_type, attachment_name",
      )
      .eq("manage_token", data.token)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!row) return { ok: false as const, lead: null, events: [] };

    const { data: events } = await supabaseAdmin
      .from("lead_stage_events")
      .select("stage, note, created_at")
      .eq("lead_id", row.id)
      .order("created_at", { ascending: true });

    return {
      ok: true as const,
      lead: {
        reference: row.id.slice(0, 8).toUpperCase(),
        fullName: row.full_name,
        stage: row.stage as string,
        stageUpdatedAt: row.stage_updated_at as string,
        projectType: row.project_type,
        attachment: row.attachment_name,
      },
      events: (events ?? []).map((e) => ({
        stage: e.stage as string,
        note: e.note,
        createdAt: e.created_at as string,
      })),
    };
  });
