import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().trim().email().max(200),
  fullName: z.string().trim().max(120).optional().default(""),
  locale: z.string().trim().max(8).optional().default("en"),
  interests: z.array(z.string().max(60)).max(12).optional().default([]),
  consentMarketing: z.literal(true),
  consentPrivacy: z.literal(true),
});

const confirmSchema = z.object({ token: z.string().uuid() });
const manageSchema = z.object({ token: z.string().uuid() });

const preferencesSchema = z.object({
  token: z.string().uuid(),
  fullName: z.string().trim().max(120).optional().default(""),
  locale: z.string().trim().max(8).optional().default("en"),
  interests: z.array(z.string().max(60)).max(12).optional().default([]),
  consentMarketing: z.boolean(),
});

export const subscribeToNewsletter = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => subscribeSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { queueEmail } = await import("@/lib/email.server");

    const email = data.email.toLowerCase();

    const { data: row, error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .upsert(
        {
          email,
          full_name: data.fullName || null,
          locale: data.locale,
          interests: data.interests,
          consent_marketing: data.consentMarketing,
          consent_privacy: data.consentPrivacy,
          status: "pending",
          unsubscribed_at: null,
        },
        { onConflict: "email" },
      )
      .select("id, email, status, confirmation_token, manage_token")
      .single();

    if (error) throw new Error(error.message);

    await queueEmail(supabaseAdmin as never, {
      to: row.email,
      subject: "Confirm your HLS studio dispatches",
      body: `Please confirm your subscription:\n/newsletter/confirm?token=${row.confirmation_token}\n\nManage your preferences at any time:\n/newsletter/manage?token=${row.manage_token}`,
      kind: "newsletter_confirm",
      relatedId: row.id,
    });

    return {
      email: row.email,
      status: row.status,
      token: row.confirmation_token,
      manageToken: row.manage_token,
    };
  });

export const confirmNewsletter = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => confirmSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    const { data: row, error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .update({ status: "confirmed", confirmed_at: new Date().toISOString() })
      .eq("confirmation_token", data.token)
      .select("email, status, manage_token")
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!row) return { ok: false as const, email: null, manageToken: null };

    return {
      ok: true as const,
      email: row.email,
      manageToken: row.manage_token,
    };
  });

/** Loads a subscriber's current preferences from a secure manage token. */
export const getNewsletterPreferences = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => manageSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    const { data: row, error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .select(
        "email, full_name, locale, interests, consent_marketing, status",
      )
      .eq("manage_token", data.token)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!row) return { ok: false as const, subscriber: null };

    return {
      ok: true as const,
      subscriber: {
        email: row.email,
        fullName: row.full_name ?? "",
        locale: row.locale ?? "en",
        interests: (row.interests ?? []) as string[],
        consentMarketing: Boolean(row.consent_marketing),
        status: row.status as string,
      },
    };
  });

/** Saves communication types, language and marketing consent. */
export const updateNewsletterPreferences = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => preferencesSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    const off = !data.consentMarketing;

    const { data: row, error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .update({
        full_name: data.fullName || null,
        locale: data.locale,
        interests: data.interests,
        consent_marketing: data.consentMarketing,
        ...(off
          ? {
              status: "unsubscribed" as const,
              unsubscribed_at: new Date().toISOString(),
            }
          : {}),
      })
      .eq("manage_token", data.token)
      .select("email, status, interests, consent_marketing")
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!row) return { ok: false as const };

    return { ok: true as const, status: row.status as string };
  });

/** One-click unsubscribe used by the link in every email. */
export const unsubscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => manageSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    const { data: row, error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .update({
        status: "unsubscribed",
        consent_marketing: false,
        unsubscribed_at: new Date().toISOString(),
      })
      .eq("manage_token", data.token)
      .select("email")
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!row) return { ok: false as const, email: null };

    return { ok: true as const, email: row.email };
  });

/** Re-enables a subscription that was switched off by mistake. */
export const resubscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => manageSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    const { data: row, error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .update({
        status: "confirmed",
        consent_marketing: true,
        confirmed_at: new Date().toISOString(),
        unsubscribed_at: null,
      })
      .eq("manage_token", data.token)
      .select("email")
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!row) return { ok: false as const, email: null };

    return { ok: true as const, email: row.email };
  });
