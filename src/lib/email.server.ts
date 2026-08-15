import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Studio-side notification recipient. Override with the
 * STUDIO_NOTIFICATION_EMAIL environment variable.
 */
export function studioInbox(): string {
  return process.env["STUDIO_NOTIFICATION_EMAIL"] || "partnerships@hlsfilmstudios.com";
}

type Queued = {
  to: string;
  subject: string;
  body: string;
  kind: string;
  relatedId?: string | null;
};

/**
 * Queues a transactional email in the outbox.
 * Delivery is performed by the studio mail sender once an email sending
 * domain is verified for the project; queued rows are never lost.
 */
export async function queueEmail(
  admin: SupabaseClient<never, never, never>,
  mail: Queued,
) {
  const { error } = await (admin as never as SupabaseClient)
    .from("email_outbox")
    .insert({
      to_email: mail.to.toLowerCase(),
      subject: mail.subject,
      body: mail.body,
      kind: mail.kind,
      related_id: mail.relatedId ?? null,
      status: "queued",
    });
  if (error) console.error("email_outbox insert failed", error.message);
}

export const STAGE_COPY: Record<
  string,
  { label: string; subject: string; body: (ctx: StageCtx) => string }
> = {
  new: {
    label: "New Inquiry",
    subject: "We received your partnership inquiry",
    body: (c) =>
      `Dear ${c.name},\n\nThank you for contacting High Light Source Film Studios. Your inquiry (reference ${c.reference}) has been logged in our partnership pipeline and is now at the New Inquiry stage.\n\nA partnerships lead will review your submission and respond shortly.\n\nTrack your inquiry: ${c.statusUrl}\n\nHigh Light Source Film Studios`,
  },
  qualifying: {
    label: "Qualifying",
    subject: "Your HLS inquiry is under review",
    body: (c) =>
      `Dear ${c.name},\n\nYour inquiry ${c.reference} has moved to the Qualifying stage. Our team is reviewing territory fit, project type and financing structure.\n\nTrack your inquiry: ${c.statusUrl}\n\nHigh Light Source Film Studios`,
  },
  discovery: {
    label: "Discovery Call",
    subject: "Scheduling a discovery call with HLS",
    body: (c) =>
      `Dear ${c.name},\n\nYour inquiry ${c.reference} has advanced to the Discovery stage. We would like to schedule a call to discuss scope and objectives.\n\nTrack your inquiry: ${c.statusUrl}\n\nHigh Light Source Film Studios`,
  },
  proposal: {
    label: "Proposal",
    subject: "An HLS proposal is being prepared",
    body: (c) =>
      `Dear ${c.name},\n\nYour inquiry ${c.reference} has advanced to the Proposal stage. Our team is preparing structure and terms for your review.\n\nTrack your inquiry: ${c.statusUrl}\n\nHigh Light Source Film Studios`,
  },
  negotiation: {
    label: "Negotiation",
    subject: "Your HLS partnership is in negotiation",
    body: (c) =>
      `Dear ${c.name},\n\nYour inquiry ${c.reference} is now at the Negotiation stage. Agreements and closing documentation are in progress.\n\nTrack your inquiry: ${c.statusUrl}\n\nHigh Light Source Film Studios`,
  },
  closed_won: {
    label: "Closed — Won",
    subject: "Welcome to the HLS partner network",
    body: (c) =>
      `Dear ${c.name},\n\nWe are delighted to confirm that your partnership with High Light Source Film Studios (reference ${c.reference}) is now active.\n\nHigh Light Source Film Studios`,
  },
  closed_lost: {
    label: "Closed",
    subject: "Update on your HLS inquiry",
    body: (c) =>
      `Dear ${c.name},\n\nAfter review we are unable to progress inquiry ${c.reference} at this time. We appreciate your interest and welcome future submissions.\n\nHigh Light Source Film Studios`,
  },
};

export type StageCtx = {
  name: string;
  reference: string;
  statusUrl: string;
};
