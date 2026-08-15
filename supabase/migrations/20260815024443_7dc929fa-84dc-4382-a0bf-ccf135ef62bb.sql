CREATE TYPE public.subscriber_status AS ENUM ('pending','confirmed','unsubscribed');
CREATE TYPE public.crm_stage AS ENUM ('new','qualifying','discovery','proposal','negotiation','closed_won','closed_lost');

CREATE TABLE public.newsletter_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  locale TEXT NOT NULL DEFAULT 'en',
  interests TEXT[] NOT NULL DEFAULT '{}',
  consent_marketing BOOLEAN NOT NULL DEFAULT false,
  consent_privacy BOOLEAN NOT NULL DEFAULT false,
  status public.subscriber_status NOT NULL DEFAULT 'pending',
  confirmation_token UUID NOT NULL DEFAULT gen_random_uuid(),
  confirmed_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.partner_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT,
  role TEXT NOT NULL,
  country TEXT NOT NULL,
  project_type TEXT NOT NULL,
  budget_range TEXT,
  timeline TEXT,
  message TEXT,
  locale TEXT NOT NULL DEFAULT 'en',
  source TEXT NOT NULL DEFAULT 'partner_form',
  stage public.crm_stage NOT NULL DEFAULT 'new',
  consent_privacy BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.partner_leads TO service_role;
ALTER TABLE public.partner_leads ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_partner_leads_stage ON public.partner_leads (stage, created_at DESC);
CREATE INDEX idx_newsletter_status ON public.newsletter_subscribers (status, created_at DESC);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$
LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_newsletter_updated BEFORE UPDATE ON public.newsletter_subscribers
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_partner_leads_updated BEFORE UPDATE ON public.partner_leads
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();