
DO $$ BEGIN
  CREATE TYPE public.corp_status AS ENUM ('new','reviewing','qualified','intro_meeting','nda','due_diligence','proposal','negotiation','agreement','active_partner','declined','closed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.corporate_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reference TEXT NOT NULL UNIQUE,
  organization TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  job_title TEXT,
  country TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT,
  website TEXT,
  company_type TEXT NOT NULL,
  partnership_types TEXT[] NOT NULL DEFAULT '{}',
  contribution_types TEXT[] NOT NULL DEFAULT '{}',
  automotive_details JSONB,
  property_details JSONB,
  technology_details JSONB,
  contribution_range TEXT,
  objectives TEXT[] NOT NULL DEFAULT '{}',
  objectives_note TEXT,
  confidential BOOLEAN NOT NULL DEFAULT false,
  nda_requested BOOLEAN NOT NULL DEFAULT false,
  preferred_contact TEXT,
  meeting_request JSONB,
  authorized BOOLEAN NOT NULL DEFAULT false,
  documents JSONB NOT NULL DEFAULT '[]'::jsonb,
  status public.corp_status NOT NULL DEFAULT 'new',
  priority TEXT NOT NULL DEFAULT 'standard',
  assigned_executive TEXT,
  follow_up_date DATE,
  notes TEXT,
  lead_source TEXT NOT NULL DEFAULT 'partners_confidential_inquiry',
  locale TEXT NOT NULL DEFAULT 'en',
  manage_token UUID NOT NULL DEFAULT gen_random_uuid(),
  status_updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.corporate_inquiry_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  inquiry_id UUID NOT NULL REFERENCES public.corporate_inquiries(id) ON DELETE CASCADE,
  status public.corp_status NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.corporate_inquiries TO service_role;
GRANT ALL ON public.corporate_inquiry_events TO service_role;

ALTER TABLE public.corporate_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporate_inquiry_events ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS corporate_inquiries_status_idx ON public.corporate_inquiries(status);
CREATE INDEX IF NOT EXISTS corporate_inquiries_country_idx ON public.corporate_inquiries(country);
CREATE INDEX IF NOT EXISTS corporate_inquiry_events_inquiry_idx ON public.corporate_inquiry_events(inquiry_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$
LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS update_corporate_inquiries_updated_at ON public.corporate_inquiries;
CREATE TRIGGER update_corporate_inquiries_updated_at
BEFORE UPDATE ON public.corporate_inquiries
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
