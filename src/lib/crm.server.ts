import { z } from "zod";

export const STAGES = [
  "new",
  "qualifying",
  "discovery",
  "proposal",
  "negotiation",
  "closed_won",
  "closed_lost",
] as const;

export const stageUpdateSchema = z.object({
  reference: z.string().trim().min(6).max(60).optional(),
  leadId: z.string().uuid().optional(),
  stage: z.enum(STAGES),
  note: z.string().trim().max(500).optional(),
});

export type StageUpdate = z.infer<typeof stageUpdateSchema>;

/**
 * Moves a lead to a new pipeline stage, records the stage event, and queues
 * both the applicant status email and the studio notification.
 */
export async function advanceLeadStage(input: StageUpdate) {
  const { supabaseAdmin } = await import(
    "@/integrations/supabase/client.server"
  );
  const { queueEmail, STAGE_COPY } = await import(
    "@/lib/email.server"
  );

  let query = supabaseAdmin
    .from("partner_leads")
    .select("id, full_name, email, stage, manage_token");

  if (input.leadId) {
    query = query.eq("id", input.leadId);
  } else if (input.reference) {
    query = query.eq("reference", input.reference.trim().toUpperCase());
  } else {
    throw new Error("leadId or reference is required");
  }

  const { data: lead, error } = await query.maybeSingle();
  if (error) throw new Error(error.message);
  if (!lead) return { ok: false as const, reason: "lead_not_found" };

  const now = new Date().toISOString();

  const { error: updErr } = await supabaseAdmin
    .from("partner_leads")
    .update({ stage: input.stage, stage_updated_at: now })
    .eq("id", lead.id);
  if (updErr) throw new Error(updErr.message);

  await supabaseAdmin.from("lead_stage_events").insert({
    lead_id: lead.id,
    stage: input.stage,
    note: input.note ?? null,
  });

  const reference = lead.id.slice(0, 8).toUpperCase();
  const statusUrl = `/partner-with-hls/status?token=${lead.manage_token}`;
  const copy = STAGE_COPY[input.stage]!;

  await queueEmail(supabaseAdmin as never, {
    to: lead.email,
    subject: copy.subject,
    body: copy.body({ name: lead.full_name, reference, statusUrl }),
    kind: `lead_stage_${input.stage}`,
    relatedId: lead.id,
  });

  // Internal stage notification goes to the departments configured for the
  // partner-lead form in HLS Communications.
  const { getAdmin, resolveRouting, queueMessage } = await import(
    "@/lib/comm.server"
  );
  const comms = await getAdmin();
  const decision = await resolveRouting(comms, "partner_lead", {
    organization: lead.full_name,
    email: lead.email,
  });
  for (const to of decision.recipients) {
    await queueMessage(comms, {
      to,
      subject: `Lead ${reference} → ${copy.label}`,
      body: `${lead.full_name} (${lead.email}) moved from ${lead.stage} to ${input.stage}.\n\n${input.note ?? ""}\n\nStatus link: ${statusUrl}`,
      kind: "lead_internal_stage",
      formKey: "partner_lead",
      department: decision.departments.join(","),
      reference,
      relatedId: lead.id,
    });
  }


  return {
    ok: true as const,
    reference,
    stage: input.stage,
    label: copy.label,
  };
}
