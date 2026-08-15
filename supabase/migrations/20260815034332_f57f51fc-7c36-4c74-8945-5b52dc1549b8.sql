
CREATE TABLE IF NOT EXISTS public.comm_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  form_key text NOT NULL,
  category text,
  department text,
  routed_to text[] NOT NULL DEFAULT '{}',
  full_name text NOT NULL,
  email text NOT NULL,
  organization text,
  country text,
  telephone text,
  message text,
  extra jsonb NOT NULL DEFAULT '{}'::jsonb,
  confidential boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'new',
  assigned_to text,
  internal_notes text,
  locale text NOT NULL DEFAULT 'en',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.comm_submissions TO authenticated;
GRANT ALL ON public.comm_submissions TO service_role;
ALTER TABLE public.comm_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff read submissions" ON public.comm_submissions FOR SELECT TO authenticated USING (public.is_comms_admin(auth.uid()));
CREATE TRIGGER trg_comm_submissions_updated BEFORE UPDATE ON public.comm_submissions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
