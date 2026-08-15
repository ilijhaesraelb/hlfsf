
ALTER TABLE public.newsletter_subscribers
  ADD COLUMN IF NOT EXISTS manage_token uuid NOT NULL DEFAULT gen_random_uuid();
CREATE UNIQUE INDEX IF NOT EXISTS newsletter_subscribers_manage_token_key
  ON public.newsletter_subscribers (manage_token);

ALTER TABLE public.partner_leads
  ADD COLUMN IF NOT EXISTS attachment_path text,
  ADD COLUMN IF NOT EXISTS attachment_name text,
  ADD COLUMN IF NOT EXISTS stage_updated_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS manage_token uuid NOT NULL DEFAULT gen_random_uuid();
CREATE UNIQUE INDEX IF NOT EXISTS partner_leads_manage_token_key
  ON public.partner_leads (manage_token);

CREATE TABLE IF NOT EXISTS public.lead_stage_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.partner_leads(id) ON DELETE CASCADE,
  stage public.crm_stage NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS lead_stage_events_lead_id_idx ON public.lead_stage_events (lead_id, created_at DESC);
GRANT ALL ON public.lead_stage_events TO service_role;
ALTER TABLE public.lead_stage_events ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.email_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  kind text NOT NULL,
  related_id uuid,
  status text NOT NULL DEFAULT 'queued',
  error text,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS email_outbox_status_idx ON public.email_outbox (status, created_at);
GRANT ALL ON public.email_outbox TO service_role;
ALTER TABLE public.email_outbox ENABLE ROW LEVEL SECURITY;
