ALTER TABLE public.partner_leads
  ADD COLUMN IF NOT EXISTS reference text
  GENERATED ALWAYS AS (upper(left(id::text, 8))) STORED;
CREATE INDEX IF NOT EXISTS partner_leads_reference_idx ON public.partner_leads (reference);