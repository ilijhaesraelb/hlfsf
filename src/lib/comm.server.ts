/**
 * HLS Communications — central routing engine.
 *
 * No frontend page or server function may hard-code a recipient address.
 * Every message is addressed by DEPARTMENT KEY; this module resolves the
 * department to a live address using the administrator-managed directory
 * (comm_departments), the per-form routing table (comm_form_routes) and the
 * conditional rules table (comm_routing_rules).
 */
import type { SupabaseClient } from "@supabase/supabase-js";

type Admin = SupabaseClient;

export type Department = {
  key: string;
  name: string;
  display_name: string;
  email: string;
  backup_email: string | null;
  reply_to: string | null;
  visibility: string;
  status: string;
  fallback_department: string | null;
  purpose: string | null;
  sort_order: number;
  updated_at: string;
};

export type FormRoute = {
  form_key: string;
  label: string;
  primary_department: string;
  secondary_department: string | null;
  executive_cc: string | null;
  confidential_routing: boolean;
  send_auto_response: boolean;
  auto_response_template: string | null;
  crm_category: string | null;
  reference_prefix: string;
  active: boolean;
};

export type RoutingRule = {
  id: string;
  form_key: string | null;
  label: string;
  field: string;
  operator: string;
  value: string;
  action: string;
  target_department: string;
  priority: number;
  active: boolean;
};

export type SubmissionContext = {
  reference?: string;
  firstName?: string;
  lastName?: string;
  organization?: string;
  email?: string;
  country?: string;
  partnershipTypes?: string[];
  partnershipType?: string;
  contributionValue?: number;
  confidential?: boolean;
  ndaRequested?: boolean;
  propertyContribution?: boolean;
  submissionDate?: string;
  assignedRepresentative?: string;
  [key: string]: unknown;
};

export async function getAdmin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin as unknown as Admin;
}

export async function getSetting<T = Record<string, unknown>>(
  admin: Admin,
  key: string,
  fallback: T,
): Promise<T> {
  const { data } = await admin
    .from("comm_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  return ((data?.value as T) ?? fallback) as T;
}

export async function listDepartments(admin: Admin): Promise<Department[]> {
  const { data } = await admin
    .from("comm_departments")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data ?? []) as Department[];
}

/**
 * Resolves a department key to a deliverable address, honouring PAUSED /
 * ARCHIVED status and the configured fallback chain.
 */
export function resolveAddress(
  departments: Department[],
  key: string | null | undefined,
  fallbackEmail: string,
  seen: string[] = [],
): string | null {
  if (!key || seen.includes(key)) return null;
  const dept = departments.find((d) => d.key === key);
  if (!dept) return null;
  if (dept.status === "archived") return null;
  if (dept.status === "paused") {
    const viaFallback = resolveAddress(
      departments,
      dept.fallback_department,
      fallbackEmail,
      [...seen, key],
    );
    return viaFallback ?? dept.backup_email ?? fallbackEmail ?? null;
  }
  return dept.email || dept.backup_email || fallbackEmail || null;
}

function matches(rule: RoutingRule, ctx: SubmissionContext): boolean {
  const raw = ctx[rule.field];
  switch (rule.operator) {
    case "is_true":
      return raw === true;
    case "is_false":
      return raw === false;
    case "gte":
      return Number(raw ?? 0) >= Number(rule.value || 0);
    case "lte":
      return Number(raw ?? 0) <= Number(rule.value || 0);
    case "equals":
      return String(raw ?? "").toLowerCase() === rule.value.toLowerCase();
    case "includes":
    default: {
      const needle = rule.value.toLowerCase();
      if (Array.isArray(raw))
        return raw.some((v) => String(v).toLowerCase().includes(needle));
      return String(raw ?? "").toLowerCase().includes(needle);
    }
  }
}

export type RoutingDecision = {
  route: FormRoute | null;
  /** department keys the submission was routed to */
  departments: string[];
  /** deliverable internal recipient addresses */
  recipients: string[];
  confidential: boolean;
  autoResponseTemplate: string | null;
  crmCategory: string | null;
  referencePrefix: string;
  appliedRules: string[];
  routingEnabled: boolean;
};

/**
 * Works out where a submission goes. Pure configuration — changing a row in
 * the backend changes delivery with no code edit.
 */
export async function resolveRouting(
  admin: Admin,
  formKey: string,
  ctx: SubmissionContext = {},
): Promise<RoutingDecision> {
  const departments = await listDepartments(admin);
  const global = await getSetting(admin, "global", {
    routingEnabled: true,
    fallbackEmail: "",
  } as { routingEnabled: boolean; fallbackEmail: string });
  const confidentialCfg = await getSetting(admin, "confidential_routing", {
    primary: "",
    secondary: "",
    legal: "",
    finance: "",
    enableLegalCopy: false,
    enableFinanceCopy: false,
  });
  const thresholds = await getSetting(admin, "thresholds", {
    executiveNotifyAmount: 5000000,
  } as { executiveNotifyAmount: number });

  const { data: routeRow } = await admin
    .from("comm_form_routes")
    .select("*")
    .eq("form_key", formKey)
    .maybeSingle();
  const route = (routeRow as FormRoute | null) ?? null;

  const { data: ruleRows } = await admin
    .from("comm_routing_rules")
    .select("*")
    .eq("active", true)
    .order("priority", { ascending: true });
  const rules = ((ruleRows ?? []) as RoutingRule[]).filter(
    (r) => !r.form_key || r.form_key === formKey,
  );

  const applied: string[] = [];
  const keys: string[] = [];
  let confidential = Boolean(route?.confidential_routing || ctx.confidential);
  let restricted = false;

  if (route?.active !== false && route) {
    keys.push(route.primary_department);
    if (route.secondary_department) keys.push(route.secondary_department);
    if (route.executive_cc) keys.push(route.executive_cc);
  }

  for (const rule of rules) {
    // Threshold rules read their editable amount from settings.
    const effective =
      rule.field === "contributionValue" && rule.operator === "gte"
        ? { ...rule, value: String(thresholds.executiveNotifyAmount ?? rule.value) }
        : rule;
    if (!matches(effective, ctx)) continue;
    applied.push(rule.label);
    if (rule.action === "restrict") {
      restricted = true;
      confidential = true;
    } else {
      keys.push(rule.target_department);
    }
  }

  const fallbackEmail = global.fallbackEmail ?? "";
  let departmentKeys = Array.from(new Set(keys.filter(Boolean)));
  let recipients: string[] = [];

  if (restricted || confidential) {
    // Confidential submissions bypass shared mailboxes entirely.
    departmentKeys = ["confidential"];
    recipients = [
      confidentialCfg.primary,
      confidentialCfg.secondary,
      confidentialCfg.enableLegalCopy ? confidentialCfg.legal : "",
      confidentialCfg.enableFinanceCopy ? confidentialCfg.finance : "",
    ].filter((v): v is string => Boolean(v && v.includes("@")));
    if (!recipients.length) {
      const addr = resolveAddress(departments, "confidential", fallbackEmail);
      if (addr) recipients = [addr];
    }
  } else {
    recipients = departmentKeys
      .map((k) => resolveAddress(departments, k, fallbackEmail))
      .filter((v): v is string => Boolean(v));
  }

  recipients = Array.from(new Set(recipients.map((r) => r.toLowerCase())));
  if (!recipients.length && fallbackEmail) recipients = [fallbackEmail];

  return {
    route,
    departments: departmentKeys,
    recipients,
    confidential,
    autoResponseTemplate:
      route?.send_auto_response === false
        ? null
        : (route?.auto_response_template ??
          (confidential ? "auto_confidential" : "auto_general")),
    crmCategory: route?.crm_category ?? null,
    referencePrefix: route?.reference_prefix ?? "GEN",
    appliedRules: applied,
    routingEnabled: global.routingEnabled !== false,
  };
}

/** Generates HLS-<PREFIX>-<YEAR>-<000000> using the database counter. */
export async function nextReference(admin: Admin, prefix: string) {
  const { data, error } = await admin.rpc("next_reference", { _prefix: prefix });
  if (error || !data) {
    const y = new Date().getUTCFullYear();
    return `HLS-${prefix.toUpperCase()}-${y}-${Math.random().toString().slice(2, 8)}`;
  }
  return data as string;
}

export function fillPlaceholders(text: string, vars: Record<string, string>) {
  return text.replace(/\{\{\s*([A-Z_]+)\s*\}\}/g, (_m, key: string) =>
    vars[key] !== undefined ? vars[key] : "",
  );
}

export async function templateVariables(
  admin: Admin,
  ctx: SubmissionContext,
  extra: Record<string, string> = {},
): Promise<Record<string, string>> {
  const profile = await getSetting(admin, "corporate_profile", {
    website: "",
    phone: "",
  } as { website: string; phone: string });
  return {
    FIRST_NAME: ctx.firstName ?? "",
    LAST_NAME: ctx.lastName ?? "",
    ORGANIZATION: ctx.organization ?? "",
    EMAIL: ctx.email ?? "",
    REFERENCE_NUMBER: ctx.reference ?? "",
    PARTNERSHIP_TYPE:
      ctx.partnershipType ?? (ctx.partnershipTypes ?? []).join(", "),
    COUNTRY: ctx.country ?? "",
    SUBMISSION_DATE: ctx.submissionDate ?? new Date().toISOString().slice(0, 10),
    ASSIGNED_REPRESENTATIVE: ctx.assignedRepresentative ?? "",
    HLS_PHONE: profile.phone ?? "",
    HLS_WEBSITE: profile.website ?? "",
    ...extra,
  };
}

/** Renders a backend-editable template plus its department signature. */
export async function renderTemplate(
  admin: Admin,
  templateKey: string,
  ctx: SubmissionContext,
  extra: Record<string, string> = {},
): Promise<{ subject: string; body: string } | null> {
  const { data: tpl } = await admin
    .from("comm_templates")
    .select("*")
    .eq("key", templateKey)
    .maybeSingle();
  if (!tpl) return null;
  const vars = await templateVariables(admin, ctx, extra);

  let signature = "";
  if (tpl.signature_department) {
    const { data: sig } = await admin
      .from("comm_signatures")
      .select("body, active")
      .eq("department_key", tpl.signature_department)
      .maybeSingle();
    if (sig?.active !== false && sig?.body) signature = String(sig.body);
  }

  return {
    subject: fillPlaceholders(String(tpl.subject), vars),
    body:
      fillPlaceholders(String(tpl.body), vars) +
      (signature ? `\n\n${fillPlaceholders(signature, vars)}` : ""),
  };
}

type QueueArgs = {
  to: string;
  subject: string;
  body: string;
  kind: string;
  formKey?: string | null;
  department?: string | null;
  reference?: string | null;
  relatedId?: string | null;
};

export async function queueMessage(admin: Admin, mail: QueueArgs) {
  const { error } = await admin.from("email_outbox").insert({
    to_email: mail.to.toLowerCase(),
    subject: mail.subject,
    body: mail.body,
    kind: mail.kind,
    form_key: mail.formKey ?? null,
    department: mail.department ?? null,
    reference: mail.reference ?? null,
    related_id: mail.relatedId ?? null,
    status: "queued",
  });
  if (error) console.error("email_outbox insert failed", error.message);
}

/**
 * The single entry point every form uses. Routes, renders and queues both the
 * internal department notification and the applicant auto-response.
 */
export async function dispatchSubmission(opts: {
  formKey: string;
  ctx: SubmissionContext;
  relatedId?: string | null;
  /** extra lines appended to the internal notification */
  internalDetails?: string[];
}): Promise<{ reference: string; recipients: string[]; decision: RoutingDecision }> {
  const admin = await getAdmin();
  const decision = await resolveRouting(admin, opts.formKey, opts.ctx);
  const reference =
    opts.ctx.reference ?? (await nextReference(admin, decision.referencePrefix));
  const ctx = { ...opts.ctx, reference };

  if (!decision.routingEnabled) {
    return { reference, recipients: [], decision };
  }

  const internal = await renderTemplate(admin, "internal_notification", ctx, {
    FORM_LABEL: decision.route?.label ?? opts.formKey,
  });
  const detailBlock = opts.internalDetails?.length
    ? `\n\n${opts.internalDetails.join("\n")}`
    : "";

  for (const to of decision.recipients) {
    await queueMessage(admin, {
      to,
      subject: internal?.subject ?? `New submission — ${opts.formKey}`,
      body: (internal?.body ?? `Reference: ${reference}`) + detailBlock,
      kind: `${opts.formKey}_internal`,
      formKey: opts.formKey,
      department: decision.departments.join(","),
      reference,
      relatedId: opts.relatedId ?? null,
    });
  }

  if (decision.autoResponseTemplate && ctx.email) {
    const auto = await renderTemplate(admin, decision.autoResponseTemplate, ctx);
    if (auto) {
      await queueMessage(admin, {
        to: ctx.email,
        subject: auto.subject,
        body: auto.body,
        kind: `${opts.formKey}_auto_response`,
        formKey: opts.formKey,
        department: decision.departments[0] ?? null,
        reference,
        relatedId: opts.relatedId ?? null,
      });
    }
  }

  return { reference, recipients: decision.recipients, decision };
}

export async function writeAudit(
  admin: Admin,
  entry: {
    actorId?: string | null;
    actorEmail?: string | null;
    action: string;
    entity: string;
    entityKey?: string | null;
    previous?: unknown;
    next?: unknown;
    ip?: string | null;
  },
) {
  await admin.from("comm_audit_log").insert({
    actor_id: entry.actorId ?? null,
    actor_email: entry.actorEmail ?? null,
    action: entry.action,
    entity: entry.entity,
    entity_key: entry.entityKey ?? null,
    previous_value: (entry.previous as never) ?? null,
    new_value: (entry.next as never) ?? null,
    ip: entry.ip ?? null,
  });
}
