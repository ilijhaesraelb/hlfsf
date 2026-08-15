import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

/** Throws unless the caller holds a communications-administration role. */
async function assertAdmin(context: {
  supabase: { rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown }> };
  userId: string;
}) {
  const { data } = await context.supabase.rpc("is_comms_admin", {
    _user_id: context.userId,
  });
  if (data !== true) throw new Error("Forbidden");
}

async function actor(context: { userId: string; claims: Record<string, unknown> }) {
  return {
    actorId: context.userId,
    actorEmail: (context.claims["email"] as string) ?? null,
  };
}

export const getCommsWorkspace = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as never);
    const { getAdmin } = await import("@/lib/comm.server");
    const admin = await getAdmin();

    const [departments, routes, rules, templates, signatures, settings, logs, audit] =
      await Promise.all([
        admin.from("comm_departments").select("*").order("sort_order"),
        admin.from("comm_form_routes").select("*").order("label"),
        admin.from("comm_routing_rules").select("*").order("priority"),
        admin.from("comm_templates").select("*").order("name"),
        admin.from("comm_signatures").select("*").order("department_key"),
        admin.from("comm_settings").select("*"),
        admin
          .from("email_outbox")
          .select("id,to_email,subject,kind,form_key,department,reference,status,error,created_at,sent_at")
          .order("created_at", { ascending: false })
          .limit(100),
        admin
          .from("comm_audit_log")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(60),
      ]);

    const [inquiries, leads] = await Promise.all([
      admin
        .from("corporate_inquiries")
        .select(
          "id,reference,organization,contact_person,country,email,partnership_types,contribution_range,confidential,nda_requested,priority,status,created_at",
        )
        .order("created_at", { ascending: false })
        .limit(50),
      admin
        .from("partner_leads")
        .select("id,reference,full_name,organization,country,email,project_type,stage,created_at")
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

    return {
      departments: departments.data ?? [],
      routes: routes.data ?? [],
      rules: rules.data ?? [],
      templates: templates.data ?? [],
      signatures: signatures.data ?? [],
      settings: Object.fromEntries(
        (settings.data ?? []).map((s) => [s.key as string, s.value]),
      ),
      logs: logs.data ?? [],
      audit: audit.data ?? [],
      inquiries: inquiries.data ?? [],
      leads: leads.data ?? [],
    };
  });

const departmentPatch = z.object({
  key: z.string().min(1).max(60),
  patch: z.object({
    name: z.string().trim().min(1).max(120).optional(),
    display_name: z.string().trim().max(140).optional(),
    email: z.string().trim().email().max(200).optional(),
    backup_email: z.string().trim().max(200).nullable().optional(),
    reply_to: z.string().trim().max(200).nullable().optional(),
    visibility: z.enum(["public", "limited", "private"]).optional(),
    status: z.enum(["active", "paused", "private", "archived"]).optional(),
    fallback_department: z.string().trim().max(60).nullable().optional(),
    purpose: z.string().trim().max(400).nullable().optional(),
  }),
});

export const updateDepartment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => departmentPatch.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { getAdmin, writeAudit } = await import("@/lib/comm.server");
    const admin = await getAdmin();
    const { data: before } = await admin
      .from("comm_departments")
      .select("*")
      .eq("key", data.key)
      .maybeSingle();
    const { data: after, error } = await admin
      .from("comm_departments")
      .update(data.patch as never)
      .eq("key", data.key)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    await writeAudit(admin, {
      ...(await actor(context as never)),
      action: "department.update",
      entity: "comm_departments",
      entityKey: data.key,
      previous: before,
      next: after,
    });
    return after;
  });

/** How many forms and rules point at a department — shown before an address change. */
export const departmentUsage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ key: z.string().max(60) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { getAdmin } = await import("@/lib/comm.server");
    const admin = await getAdmin();
    const [primary, secondary, cc, rules, templates] = await Promise.all([
      admin.from("comm_form_routes").select("form_key").eq("primary_department", data.key),
      admin.from("comm_form_routes").select("form_key").eq("secondary_department", data.key),
      admin.from("comm_form_routes").select("form_key").eq("executive_cc", data.key),
      admin.from("comm_routing_rules").select("label").eq("target_department", data.key),
      admin.from("comm_templates").select("key").eq("signature_department", data.key),
    ]);
    const forms = Array.from(
      new Set(
        [...(primary.data ?? []), ...(secondary.data ?? []), ...(cc.data ?? [])].map(
          (r) => r.form_key as string,
        ),
      ),
    );
    return {
      forms,
      rules: (rules.data ?? []).map((r) => r.label as string),
      templates: (templates.data ?? []).map((t) => t.key as string),
    };
  });

const routePatch = z.object({
  form_key: z.string().min(1).max(60),
  patch: z.object({
    primary_department: z.string().max(60).optional(),
    secondary_department: z.string().max(60).nullable().optional(),
    executive_cc: z.string().max(60).nullable().optional(),
    confidential_routing: z.boolean().optional(),
    send_auto_response: z.boolean().optional(),
    auto_response_template: z.string().max(60).nullable().optional(),
    crm_category: z.string().max(90).nullable().optional(),
    reference_prefix: z.string().max(10).optional(),
    active: z.boolean().optional(),
  }),
});

export const updateFormRoute = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => routePatch.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { getAdmin, writeAudit } = await import("@/lib/comm.server");
    const admin = await getAdmin();
    const { data: before } = await admin
      .from("comm_form_routes")
      .select("*")
      .eq("form_key", data.form_key)
      .maybeSingle();
    const { data: after, error } = await admin
      .from("comm_form_routes")
      .update(data.patch as never)
      .eq("form_key", data.form_key)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    await writeAudit(admin, {
      ...(await actor(context as never)),
      action: "form_route.update",
      entity: "comm_form_routes",
      entityKey: data.form_key,
      previous: before,
      next: after,
    });
    return after;
  });

export const updateRoutingRule = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        patch: z.object({
          value: z.string().max(120).optional(),
          target_department: z.string().max(60).optional(),
          action: z.enum(["notify", "restrict"]).optional(),
          active: z.boolean().optional(),
        }),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { getAdmin, writeAudit } = await import("@/lib/comm.server");
    const admin = await getAdmin();
    const { data: after, error } = await admin
      .from("comm_routing_rules")
      .update(data.patch as never)
      .eq("id", data.id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    await writeAudit(admin, {
      ...(await actor(context as never)),
      action: "routing_rule.update",
      entity: "comm_routing_rules",
      entityKey: data.id,
      next: after,
    });
    return after;
  });

export const updateTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        key: z.string().max(60),
        subject: z.string().trim().min(1).max(240),
        body: z.string().trim().min(1).max(20000),
        signature_department: z.string().max(60).nullable().optional(),
        active: z.boolean().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { getAdmin, writeAudit } = await import("@/lib/comm.server");
    const admin = await getAdmin();
    const { key, ...patch } = data;
    const { data: before } = await admin
      .from("comm_templates")
      .select("*")
      .eq("key", key)
      .maybeSingle();
    const { data: after, error } = await admin
      .from("comm_templates")
      .update(patch as never)
      .eq("key", key)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    await writeAudit(admin, {
      ...(await actor(context as never)),
      action: "template.update",
      entity: "comm_templates",
      entityKey: key,
      previous: before,
      next: after,
    });
    return after;
  });

export const updateSignature = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        department_key: z.string().max(60),
        body: z.string().trim().max(4000),
        active: z.boolean().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { getAdmin, writeAudit } = await import("@/lib/comm.server");
    const admin = await getAdmin();
    const { error } = await admin
      .from("comm_signatures")
      .upsert(
        {
          department_key: data.department_key,
          body: data.body,
          active: data.active ?? true,
        } as never,
        { onConflict: "department_key" },
      );
    if (error) throw new Error(error.message);
    await writeAudit(admin, {
      ...(await actor(context as never)),
      action: "signature.update",
      entity: "comm_signatures",
      entityKey: data.department_key,
      next: { body: data.body },
    });
    return { ok: true };
  });

export const updateSetting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ key: z.string().max(60), value: z.record(z.string(), z.unknown()) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { getAdmin, writeAudit } = await import("@/lib/comm.server");
    const admin = await getAdmin();
    const { data: before } = await admin
      .from("comm_settings")
      .select("value")
      .eq("key", data.key)
      .maybeSingle();
    const { error } = await admin
      .from("comm_settings")
      .upsert({ key: data.key, value: data.value } as never, { onConflict: "key" });
    if (error) throw new Error(error.message);
    await writeAudit(admin, {
      ...(await actor(context as never)),
      action: "setting.update",
      entity: "comm_settings",
      entityKey: data.key,
      previous: before?.value,
      next: data.value,
    });
    return { ok: true };
  });

/** Re-queues a previously failed or sent notification without re-submitting the form. */
export const resendMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { getAdmin, writeAudit } = await import("@/lib/comm.server");
    const admin = await getAdmin();
    const { data: row, error } = await admin
      .from("email_outbox")
      .select("*")
      .eq("id", data.id)
      .single();
    if (error) throw new Error(error.message);
    await admin.from("email_outbox").insert({
      to_email: row.to_email,
      subject: row.subject,
      body: row.body,
      kind: row.kind,
      form_key: row.form_key,
      department: row.department,
      reference: row.reference,
      related_id: row.related_id,
      status: "queued",
    } as never);
    await writeAudit(admin, {
      ...(await actor(context as never)),
      action: "message.resend",
      entity: "email_outbox",
      entityKey: data.id,
    });
    return { ok: true };
  });

/** Test Center — checks routing and optionally queues a test message. */
export const runRoutingTest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        formKey: z.string().max(60),
        send: z.boolean().default(false),
        confidential: z.boolean().default(false),
        ndaRequested: z.boolean().default(false),
        contributionValue: z.number().default(0),
        partnershipTypes: z.array(z.string().max(90)).max(20).default([]),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { getAdmin, resolveRouting, dispatchSubmission } = await import(
      "@/lib/comm.server"
    );
    const admin = await getAdmin();
    const ctx = {
      organization: "HLS Routing Test",
      firstName: "Test",
      lastName: "Message",
      email: ((context as never as { claims: Record<string, string> }).claims[
        "email"
      ] ?? "") as string,
      country: "Test",
      confidential: data.confidential,
      ndaRequested: data.ndaRequested,
      contributionValue: data.contributionValue,
      partnershipTypes: data.partnershipTypes,
    };
    const decision = await resolveRouting(admin, data.formKey, ctx);
    if (data.send) {
      await dispatchSubmission({
        formKey: data.formKey,
        ctx,
        internalDetails: ["This is a routing test message generated from the Test Center."],
      });
    }
    return {
      recipients: decision.recipients,
      departments: decision.departments,
      appliedRules: decision.appliedRules,
      autoResponseTemplate: decision.autoResponseTemplate,
      confidential: decision.confidential,
      referencePrefix: decision.referencePrefix,
      sent: data.send,
    };
  });

/** Public, read-only department directory — powers "Contact department" buttons. */
export const listPublicDepartments = createServerFn({ method: "GET" }).handler(
  async () => {
    const { getAdmin } = await import("@/lib/comm.server");
    const admin = await getAdmin();
    const { data } = await admin
      .from("comm_departments")
      .select("key,name,display_name,email,visibility,status,purpose,sort_order")
      .eq("visibility", "public")
      .eq("status", "active")
      .order("sort_order");
    return (data ?? []).map((d) => ({
      key: d.key as string,
      name: d.name as string,
      displayName: (d.display_name as string) || (d.name as string),
      email: d.email as string,
      purpose: (d.purpose as string) ?? "",
    }));
  },
);

/**
 * First-run bootstrap: the first signed-in staff member becomes SUPER ADMIN.
 * Once a super admin exists this call is refused.
 */
export const claimCommsAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { getAdmin, writeAudit } = await import("@/lib/comm.server");
    const admin = await getAdmin();
    const { count } = await admin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "super_admin");
    if ((count ?? 0) > 0) throw new Error("A super administrator already exists.");
    const { error } = await admin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "super_admin" } as never);
    if (error) throw new Error(error.message);
    await writeAudit(admin, {
      ...(await actor(context as never)),
      action: "role.bootstrap_super_admin",
      entity: "user_roles",
      entityKey: context.userId,
    });
    return { ok: true };
  });

/** Roles held by the current user (drives what the console shows). */
export const myCommsRoles = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const roles = (data ?? []).map((r) => r.role as string);
    return { roles, isAdmin: roles.some((r) => r === "super_admin" || r === "executive") };
  });
