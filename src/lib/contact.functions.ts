import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Maps a public contact category to a FORM KEY. The form key — never an email
 * address — determines the destination; administrators change the destination
 * in HLS Communications → Form Routing.
 */
export const CONTACT_FORM_KEYS: Record<string, string> = {
  "General Inquiry": "general_contact",
  "Film Commission / Government": "government_inquiry",
  "International Co-Producer": "coproduction_inquiry",
  "Investor / Financing": "investor_inquiry",
  "Broadcaster / Streaming": "general_contact",
  Distribution: "general_contact",
  Talent: "casting_inquiry",
  Employment: "career_inquiry",
  "Film Academy": "general_contact",
  Press: "press_inquiry",
};

const schema = z.object({
  category: z.string().trim().min(2).max(90),
  fullName: z.string().trim().min(2).max(140),
  email: z.string().trim().email().max(200),
  organization: z.string().trim().max(180).optional().default(""),
  country: z.string().trim().max(90).optional().default(""),
  telephone: z.string().trim().max(60).optional().default(""),
  message: z.string().trim().min(4).max(6000),
  extra: z.record(z.string(), z.string().max(500)).optional().default({}),
  locale: z.string().trim().max(8).optional().default("en"),
  companyFax: z.string().max(0).optional().default(""),
});

export const submitContactInquiry = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => schema.parse(d))
  .handler(async ({ data }) => {
    if (data.companyFax) throw new Error("Submission rejected.");

    const { getAdmin, resolveRouting, dispatchSubmission, nextReference } =
      await import("@/lib/comm.server");
    const admin = await getAdmin();

    const formKey = CONTACT_FORM_KEYS[data.category] ?? "general_contact";

    // Rate limit: 5 messages per address per hour.
    const since = new Date(Date.now() - 3600_000).toISOString();
    const { count } = await admin
      .from("comm_submissions")
      .select("id", { count: "exact", head: true })
      .eq("email", data.email.toLowerCase())
      .gte("created_at", since);
    if ((count ?? 0) >= 5) {
      throw new Error(
        "Several messages have already been received from this address. Please try again later.",
      );
    }

    const [first, ...rest] = data.fullName.split(" ");
    const ctx = {
      firstName: first ?? "",
      lastName: rest.join(" "),
      organization: data.organization || data.fullName,
      email: data.email.toLowerCase(),
      country: data.country,
      partnershipTypes: [],
      confidential: false,
    };

    const decision = await resolveRouting(admin, formKey, ctx);
    const reference = await nextReference(admin, decision.referencePrefix);

    const { data: row, error } = await admin
      .from("comm_submissions")
      .insert({
        reference,
        form_key: formKey,
        category: data.category,
        department: decision.departments[0] ?? null,
        routed_to: decision.departments,
        full_name: data.fullName,
        email: data.email.toLowerCase(),
        organization: data.organization || null,
        country: data.country || null,
        telephone: data.telephone || null,
        message: data.message,
        extra: data.extra,
        confidential: decision.confidential,
        locale: data.locale,
      } as never)
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    await dispatchSubmission({
      formKey,
      ctx: { ...ctx, reference },
      relatedId: (row as { id: string }).id,
      internalDetails: [
        `Category: ${data.category}`,
        `Telephone: ${data.telephone || "—"}`,
        "",
        data.message,
      ],
    });

    return { reference };
  });
