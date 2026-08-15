import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MAX_FILE_BYTES = 15 * 1024 * 1024;
const MAX_FILES = 5;

const ALLOWED_EXT = ["pdf", "docx", "xlsx", "jpg", "jpeg", "png"];

const documentSchema = z.object({
  name: z.string().trim().min(1).max(180),
  type: z.string().trim().max(160).optional().default(""),
  /** base64 payload without the data: prefix */
  data: z.string().min(1),
});

const inquirySchema = z.object({
  organization: z.string().trim().min(2).max(180),
  contactPerson: z.string().trim().min(2).max(140),
  jobTitle: z.string().trim().max(140).optional().default(""),
  country: z.string().trim().min(2).max(90),
  email: z.string().trim().email().max(200),
  telephone: z.string().trim().max(60).optional().default(""),
  website: z.string().trim().max(200).optional().default(""),
  companyType: z.string().trim().min(2).max(90),

  partnershipTypes: z.array(z.string().trim().max(90)).max(30).default([]),
  contributionTypes: z.array(z.string().trim().max(90)).max(20).default([]),

  automotive: z.record(z.string(), z.string().max(400)).optional().nullable(),
  property: z.record(z.string(), z.string().max(400)).optional().nullable(),
  technology: z.record(z.string(), z.string().max(1200)).optional().nullable(),

  contributionRange: z.string().trim().max(90).optional().default(""),
  objectives: z.array(z.string().trim().max(90)).max(30).default([]),
  objectivesNote: z.string().trim().max(4000).optional().default(""),

  confidential: z.boolean().default(false),
  ndaRequested: z.boolean().default(false),
  preferredContact: z.string().trim().max(60).optional().default(""),
  authorized: z.literal(true),

  documents: z.array(documentSchema).max(MAX_FILES).default([]),
  locale: z.string().trim().max(8).optional().default("en"),
  /** anti-bot honeypot; must stay empty */
  companyFax: z.string().max(0).optional().default(""),
});

const meetingSchema = z.object({
  name: z.string().trim().min(2).max(140),
  organization: z.string().trim().min(2).max(180),
  email: z.string().trim().email().max(200),
  country: z.string().trim().min(2).max(90),
  reason: z.string().trim().min(4).max(3000),
  preferredDates: z.string().trim().max(200).optional().default(""),
  preferredFormat: z.string().trim().max(60).optional().default(""),
  locale: z.string().trim().max(8).optional().default("en"),
  companyFax: z.string().max(0).optional().default(""),
});

/** Turns an editable range label such as "$1M – $5M" into a comparable number. */
function rangeToValue(label: string): number {
  const match = /([\d.,]+)\s*(k|m|b|bn|million|billion)?/i.exec(label ?? "");
  if (!match) return 0;
  const base = Number(String(match[1]).replace(/,/g, "")) || 0;
  const unit = (match[2] ?? "").toLowerCase();
  if (unit.startsWith("k")) return base * 1_000;
  if (unit.startsWith("m")) return base * 1_000_000;
  if (unit.startsWith("b")) return base * 1_000_000_000;
  return base;
}

function decodeBase64(data: string) {
  return Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
}

export const submitCorporateInquiry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inquirySchema.parse(data))
  .handler(async ({ data }) => {
    if (data.companyFax) throw new Error("Submission rejected.");

    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const {
      getAdmin,
      resolveRouting,
      nextReference,
      dispatchSubmission,
    } = await import("@/lib/comm.server");
    const comms = await getAdmin();

    // Basic rate limiting: max 3 inquiries per email per hour.
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("corporate_inquiries")
      .select("id", { count: "exact", head: true })
      .eq("email", data.email.toLowerCase())
      .gte("created_at", since);
    if ((count ?? 0) >= 3) {
      throw new Error(
        "Several inquiries have already been received from this address. Please contact us directly.",
      );
    }

    const [firstName, ...restName] = data.contactPerson.split(" ");
    const routingCtx = {
      firstName: firstName ?? "",
      lastName: restName.join(" "),
      organization: data.organization,
      email: data.email.toLowerCase(),
      country: data.country,
      partnershipTypes: data.partnershipTypes,
      contributionValue: rangeToValue(data.contributionRange ?? ""),
      confidential: data.confidential,
      ndaRequested: data.ndaRequested,
      propertyContribution: Boolean(data.property),
    };
    const decision = await resolveRouting(comms, "corporate_partnership", routingCtx);
    const reference = await nextReference(comms, decision.referencePrefix);

    const { data: row, error } = await supabaseAdmin
      .from("corporate_inquiries")
      .insert({
        reference,
        organization: data.organization,
        contact_person: data.contactPerson,
        job_title: data.jobTitle || null,
        country: data.country,
        email: data.email.toLowerCase(),
        telephone: data.telephone || null,
        website: data.website || null,
        company_type: data.companyType,
        partnership_types: data.partnershipTypes,
        contribution_types: data.contributionTypes,
        automotive_details: data.automotive ?? null,
        property_details: data.property ?? null,
        technology_details: data.technology ?? null,
        contribution_range: data.contributionRange || null,
        objectives: data.objectives,
        objectives_note: data.objectivesNote || null,
        confidential: data.confidential,
        nda_requested: data.ndaRequested,
        preferred_contact: data.preferredContact || null,
        authorized: data.authorized,
        locale: data.locale,
        status: "new",
        priority: data.confidential ? "high" : "standard",
      })
      .select("id, reference, created_at")
      .single();

    if (error) throw new Error(error.message);

    // Secure document upload (private bucket, no public URLs).
    const stored: { name: string; path: string; size: number }[] = [];
    for (const doc of data.documents) {
      const ext = doc.name.split(".").pop()?.toLowerCase() ?? "";
      if (!ALLOWED_EXT.includes(ext)) {
        throw new Error(`Unsupported file type: .${ext}`);
      }
      const bytes = decodeBase64(doc.data);
      if (bytes.byteLength > MAX_FILE_BYTES) {
        throw new Error(`${doc.name} exceeds the 15 MB limit.`);
      }
      const safe = doc.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${row.id}/${Date.now()}-${safe}`;
      const { error: upErr } = await supabaseAdmin.storage
        .from("partnership-documents")
        .upload(path, bytes, {
          contentType: doc.type || "application/octet-stream",
          upsert: false,
        });
      if (upErr) throw new Error(upErr.message);
      stored.push({ name: doc.name, path, size: bytes.byteLength });
    }

    if (stored.length) {
      await supabaseAdmin
        .from("corporate_inquiries")
        .update({ documents: stored })
        .eq("id", row.id);
    }

    await supabaseAdmin
      .from("corporate_inquiry_events")
      .insert({
        inquiry_id: row.id,
        status: "new",
        note: "Inquiry received through the confidential partnership portal.",
      });

    // Routed through HLS Communications — departments and auto responses are
    // configured in the backend, never hard-coded here.
    await dispatchSubmission({
      formKey: "corporate_partnership",
      ctx: { ...routingCtx, reference },
      relatedId: row.id,
      internalDetails: [
        `Company type: ${data.companyType}`,
        `Estimated range: ${data.contributionRange || "—"}`,
        `Contribution types: ${data.contributionTypes.join(", ") || "—"}`,
        `Confidential: ${data.confidential ? "YES" : "No"}`,
        `NDA requested: ${data.ndaRequested ? "Yes" : "No"}`,
        `Documents attached: ${stored.length} (stored privately, not attached)`,
        `Routed to: ${decision.departments.join(", ")}`,
        decision.appliedRules.length
          ? `Rules applied: ${decision.appliedRules.join("; ")}`
          : "",
      ].filter(Boolean),
    });

    return { reference, createdAt: row.created_at, documents: stored.length };
  });

export const requestPrivateMeeting = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => meetingSchema.parse(data))
  .handler(async ({ data }) => {
    if (data.companyFax) throw new Error("Submission rejected.");

    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { getAdmin, resolveRouting, nextReference, dispatchSubmission } =
      await import("@/lib/comm.server");
    const comms = await getAdmin();
    const meetingCtx = {
      firstName: data.name.split(" ")[0] ?? "",
      lastName: data.name.split(" ").slice(1).join(" "),
      organization: data.organization,
      email: data.email.toLowerCase(),
      country: data.country,
      confidential: true,
    };
    const meetingDecision = await resolveRouting(comms, "private_meeting", meetingCtx);
    const reference = await nextReference(comms, meetingDecision.referencePrefix);

    const { data: row, error } = await supabaseAdmin
      .from("corporate_inquiries")
      .insert({
        reference,
        organization: data.organization,
        contact_person: data.name,
        country: data.country,
        email: data.email.toLowerCase(),
        company_type: "Other",
        partnership_types: ["Private Meeting Request"],
        objectives_note: data.reason,
        preferred_contact: data.preferredFormat || "Private Executive Discussion",
        meeting_request: {
          preferredDates: data.preferredDates,
          preferredFormat: data.preferredFormat,
        },
        confidential: true,
        authorized: true,
        locale: data.locale,
        lead_source: "partners_private_meeting",
        priority: "high",
        status: "new",
      })
      .select("id, reference")
      .single();

    if (error) throw new Error(error.message);

    await dispatchSubmission({
      formKey: "private_meeting",
      ctx: { ...meetingCtx, reference },
      relatedId: row.id,
      internalDetails: [
        `Preferred dates: ${data.preferredDates || "—"}`,
        `Preferred format: ${data.preferredFormat || "—"}`,
        "",
        data.reason,
      ],
    });

    return { reference };
  });
