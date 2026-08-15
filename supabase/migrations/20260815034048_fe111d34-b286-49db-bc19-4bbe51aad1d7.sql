
-- ROLES -----------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('super_admin','executive','partnerships','international','legal','finance','hr','casting','marketing');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_comms_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('super_admin','executive'))
$$;

-- DEPARTMENT DIRECTORY ---------------------------------------------------
CREATE TABLE IF NOT EXISTS public.comm_departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  name text NOT NULL,
  display_name text NOT NULL DEFAULT '',
  email text NOT NULL,
  backup_email text,
  reply_to text,
  visibility text NOT NULL DEFAULT 'public',
  status text NOT NULL DEFAULT 'active',
  fallback_department text,
  purpose text,
  sort_order integer NOT NULL DEFAULT 100,
  updated_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.comm_departments TO authenticated;
GRANT ALL ON public.comm_departments TO service_role;
ALTER TABLE public.comm_departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff read departments" ON public.comm_departments FOR SELECT TO authenticated USING (public.is_comms_admin(auth.uid()));
CREATE TRIGGER trg_comm_departments_updated BEFORE UPDATE ON public.comm_departments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- FORM ROUTING -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.comm_form_routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_key text NOT NULL UNIQUE,
  label text NOT NULL,
  primary_department text NOT NULL,
  secondary_department text,
  executive_cc text,
  confidential_routing boolean NOT NULL DEFAULT false,
  send_auto_response boolean NOT NULL DEFAULT true,
  auto_response_template text,
  crm_category text,
  reference_prefix text NOT NULL DEFAULT 'GEN',
  active boolean NOT NULL DEFAULT true,
  updated_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.comm_form_routes TO authenticated;
GRANT ALL ON public.comm_form_routes TO service_role;
ALTER TABLE public.comm_form_routes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff read routes" ON public.comm_form_routes FOR SELECT TO authenticated USING (public.is_comms_admin(auth.uid()));
CREATE TRIGGER trg_comm_form_routes_updated BEFORE UPDATE ON public.comm_form_routes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- CONDITIONAL ROUTING RULES ---------------------------------------------
CREATE TABLE IF NOT EXISTS public.comm_routing_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_key text,
  label text NOT NULL,
  field text NOT NULL,
  operator text NOT NULL DEFAULT 'includes',
  value text NOT NULL DEFAULT '',
  action text NOT NULL DEFAULT 'notify',
  target_department text NOT NULL,
  priority integer NOT NULL DEFAULT 100,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.comm_routing_rules TO authenticated;
GRANT ALL ON public.comm_routing_rules TO service_role;
ALTER TABLE public.comm_routing_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff read rules" ON public.comm_routing_rules FOR SELECT TO authenticated USING (public.is_comms_admin(auth.uid()));
CREATE TRIGGER trg_comm_routing_rules_updated BEFORE UPDATE ON public.comm_routing_rules FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- TEMPLATES & SIGNATURES -------------------------------------------------
CREATE TABLE IF NOT EXISTS public.comm_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  name text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  signature_department text,
  active boolean NOT NULL DEFAULT true,
  updated_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.comm_templates TO authenticated;
GRANT ALL ON public.comm_templates TO service_role;
ALTER TABLE public.comm_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff read templates" ON public.comm_templates FOR SELECT TO authenticated USING (public.is_comms_admin(auth.uid()));
CREATE TRIGGER trg_comm_templates_updated BEFORE UPDATE ON public.comm_templates FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.comm_signatures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_key text NOT NULL UNIQUE,
  body text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.comm_signatures TO authenticated;
GRANT ALL ON public.comm_signatures TO service_role;
ALTER TABLE public.comm_signatures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff read signatures" ON public.comm_signatures FOR SELECT TO authenticated USING (public.is_comms_admin(auth.uid()));
CREATE TRIGGER trg_comm_signatures_updated BEFORE UPDATE ON public.comm_signatures FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- GLOBAL SETTINGS --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.comm_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_by text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.comm_settings TO authenticated;
GRANT ALL ON public.comm_settings TO service_role;
ALTER TABLE public.comm_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff read settings" ON public.comm_settings FOR SELECT TO authenticated USING (public.is_comms_admin(auth.uid()));
CREATE TRIGGER trg_comm_settings_updated BEFORE UPDATE ON public.comm_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- AUDIT LOG --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.comm_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  actor_email text,
  action text NOT NULL,
  entity text NOT NULL,
  entity_key text,
  previous_value jsonb,
  new_value jsonb,
  ip text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.comm_audit_log TO authenticated;
GRANT ALL ON public.comm_audit_log TO service_role;
ALTER TABLE public.comm_audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff read audit" ON public.comm_audit_log FOR SELECT TO authenticated USING (public.is_comms_admin(auth.uid()));

-- DELIVERY LOG EXTENSIONS ------------------------------------------------
ALTER TABLE public.email_outbox ADD COLUMN IF NOT EXISTS form_key text;
ALTER TABLE public.email_outbox ADD COLUMN IF NOT EXISTS department text;
ALTER TABLE public.email_outbox ADD COLUMN IF NOT EXISTS reference text;
ALTER TABLE public.email_outbox ADD COLUMN IF NOT EXISTS attempts integer NOT NULL DEFAULT 0;

-- REFERENCE NUMBERS ------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.comm_reference_counters (
  prefix text NOT NULL,
  year integer NOT NULL,
  counter integer NOT NULL DEFAULT 0,
  PRIMARY KEY (prefix, year)
);
GRANT ALL ON public.comm_reference_counters TO service_role;
ALTER TABLE public.comm_reference_counters ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.next_reference(_prefix text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE y integer := EXTRACT(YEAR FROM now())::int; n integer;
BEGIN
  INSERT INTO public.comm_reference_counters(prefix, year, counter)
  VALUES (upper(_prefix), y, 1)
  ON CONFLICT (prefix, year) DO UPDATE SET counter = public.comm_reference_counters.counter + 1
  RETURNING counter INTO n;
  RETURN 'HLS-' || upper(_prefix) || '-' || y::text || '-' || lpad(n::text, 6, '0');
END $$;

-- SEED: DEPARTMENTS ------------------------------------------------------
INSERT INTO public.comm_departments (key, name, display_name, email, visibility, status, purpose, sort_order) VALUES
('general','General Information','HLS Information','info@highlightsourcefilmstudios.com','public','active','General questions and public inquiries',10),
('office','Main Office','HLS Main Office','office@highlightsourcefilmstudios.com','public','active','General administrative matters',20),
('executive_office','Executive Office','HLS Executive Office','executiveoffice@highlightsourcefilmstudios.com','private','active','Executive-level correspondence',30),
('executive_assistant','Executive Assistant','HLS Executive Assistant','executiveassistant@highlightsourcefilmstudios.com','private','active','Scheduling and executive communications',40),
('partnerships','Partnerships','HLS Corporate Partnerships','partnerships@highlightsourcefilmstudios.com','public','active','Primary corporate partnership inbox',50),
('naming_rights','Naming Rights','HLS Naming Rights','namingrights@highlightsourcefilmstudios.com','public','active','Studio and facility naming opportunities',60),
('sponsorships','Sponsorships','HLS Sponsorships','sponsorships@highlightsourcefilmstudios.com','public','active','Corporate sponsorship proposals',70),
('founding_partners','Founding Partners','HLS Founding Partners','foundingpartners@highlightsourcefilmstudios.com','public','active','Founding Partner status inquiries',80),
('automotive','Automotive Partnerships','HLS Automotive Partnerships','automotive@highlightsourcefilmstudios.com','public','active','Automobile manufacturers and mobility companies',90),
('real_estate','Real Estate','HLS Real Estate','realestate@highlightsourcefilmstudios.com','public','active','Property opportunities',100),
('studio_development','Studio Development','HLS Studio Development','studiodevelopment@highlightsourcefilmstudios.com','public','active','Construction and physical studio development',110),
('technology','Technology Partnerships','HLS Technology','technology@highlightsourcefilmstudios.com','public','active','Technology companies',120),
('equipment','Equipment Partnerships','HLS Equipment','equipment@highlightsourcefilmstudios.com','public','active','Production equipment manufacturers and suppliers',130),
('international','International','HLS International','international@highlightsourcefilmstudios.com','public','active','General international film business',140),
('coproductions','Co-Productions','HLS Co-Productions','coproductions@highlightsourcefilmstudios.com','public','active','International co-production discussions',150),
('government_relations','Government Relations','HLS Government Relations','governmentrelations@highlightsourcefilmstudios.com','limited','active','Government agencies and ministries',160),
('film_commissions','Film Commissions','HLS Film Commissions','filmcommissions@highlightsourcefilmstudios.com','limited','active','Film commissions and incentive organizations',170),
('financing','Film Financing','HLS Financing','financing@highlightsourcefilmstudios.com','limited','active','Film financing inquiries',180),
('investors','Investors','HLS Investor Relations','investors@highlightsourcefilmstudios.com','limited','active','Qualified investor inquiries',190),
('capital','Capital Relationships','HLS Capital','capital@highlightsourcefilmstudios.com','private','active','Corporate and institutional capital relationships',200),
('distribution','Distribution','HLS Distribution','distribution@highlightsourcefilmstudios.com','public','active','Film distributors',210),
('sales','International Sales','HLS Sales','sales@highlightsourcefilmstudios.com','public','active','International sales agents and licensing',220),
('licensing','Licensing','HLS Licensing','licensing@highlightsourcefilmstudios.com','public','active','Film, television and merchandise licensing',230),
('broadcast','Broadcast','HLS Broadcast','broadcast@highlightsourcefilmstudios.com','public','active','Television networks and broadcasters',240),
('streaming','Streaming','HLS Streaming','streaming@highlightsourcefilmstudios.com','public','active','Streaming platform relationships',250),
('production','Production','HLS Production','production@highlightsourcefilmstudios.com','public','active','General production operations',260),
('development','Development','HLS Development','development@highlightsourcefilmstudios.com','public','active','Film and television project development',270),
('business_affairs','Business Affairs','HLS Business Affairs','businessaffairs@highlightsourcefilmstudios.com','private','active','Contracts and commercial negotiations',280),
('legal','Legal','HLS Legal','legal@highlightsourcefilmstudios.com','private','active','Legal correspondence',290),
('copyright','Copyright','HLS Copyright','copyright@highlightsourcefilmstudios.com','private','active','Copyright matters',300),
('trademarks','Trademarks','HLS Trademarks','trademarks@highlightsourcefilmstudios.com','private','active','Trademark and brand protection',310),
('casting','Casting','HLS Casting','casting@highlightsourcefilmstudios.com','public','active','Official casting matters',320),
('talent','Talent','HLS Talent','talent@highlightsourcefilmstudios.com','public','active','Actors, directors, writers and creatives',330),
('creatives','Creatives','HLS Creative Relations','creatives@highlightsourcefilmstudios.com','public','active','Creative professional relationships',340),
('careers','Careers','HLS Careers','careers@highlightsourcefilmstudios.com','public','active','Professional employment opportunities',350),
('internships','Internships','HLS Internships','internships@highlightsourcefilmstudios.com','public','active','Internships and apprenticeships',360),
('hr','Human Resources','HLS Human Resources','hr@highlightsourcefilmstudios.com','private','active','Internal human resources',370),
('academy','Film Academy','High Light Source Film Academy','academy@highlightsourcefilmstudios.com','public','active','Film academy matters',380),
('education','Education','HLS Education','education@highlightsourcefilmstudios.com','public','active','Educational partnerships',390),
('universities','Universities','HLS University Relations','universities@highlightsourcefilmstudios.com','public','active','University and film-school relationships',400),
('press','Press','HLS Press Office','press@highlightsourcefilmstudios.com','public','active','Journalists and media organizations',410),
('media','Media','HLS Media','media@highlightsourcefilmstudios.com','public','active','General media requests',420),
('public_relations','Public Relations','HLS Public Relations','publicrelations@highlightsourcefilmstudios.com','public','active','PR operations',430),
('marketing','Marketing','HLS Marketing','marketing@highlightsourcefilmstudios.com','public','active','Marketing partnerships and campaigns',440),
('events','Events','HLS Events','events@highlightsourcefilmstudios.com','public','active','Events, premieres and screenings',450),
('premieres','Premieres','HLS Premieres','premieres@highlightsourcefilmstudios.com','public','active','Premiere-related communications',460),
('confidential','Confidential Inquiries','HLS Confidential','confidential@highlightsourcefilmstudios.com','private','active','Routed to authorized executives only',470),
('privacy','Privacy','HLS Privacy Office','privacy@highlightsourcefilmstudios.com','public','active','Privacy rights and data inquiries',480),
('accessibility','Accessibility','HLS Accessibility','accessibility@highlightsourcefilmstudios.com','public','active','Website accessibility questions',490),
('security','Security','HLS Security','security@highlightsourcefilmstudios.com','private','active','Cybersecurity and responsible disclosure',500),
('websupport','Website Support','HLS Website Support','websupport@highlightsourcefilmstudios.com','public','active','Website technical problems',510)
ON CONFLICT (key) DO NOTHING;

-- SEED: FORM ROUTES ------------------------------------------------------
INSERT INTO public.comm_form_routes (form_key, label, primary_department, secondary_department, executive_cc, confidential_routing, send_auto_response, auto_response_template, crm_category, reference_prefix) VALUES
('general_contact','General Contact Form','general',NULL,NULL,false,true,'auto_general','General Inquiry','GEN'),
('corporate_partnership','Corporate Partnership Inquiry','partnerships','naming_rights','executive_office',false,true,'auto_partnership','Corporate Partnership','CP'),
('private_meeting','Private Executive Meeting Request','executive_office','partnerships',NULL,true,true,'auto_confidential','Executive Meeting','CP'),
('automotive_partnership','Automotive Partnership Form','automotive','partnerships',NULL,false,true,'auto_automotive','Automotive Partnership','AUTO'),
('naming_rights','Naming Rights Inquiry','naming_rights','partnerships','executive_office',false,true,'auto_partnership','Naming Rights','NR'),
('property_contribution','Property / Studio Development Form','real_estate','studio_development',NULL,false,true,'auto_property','Property Contribution','PROP'),
('technology_partnership','Technology Partnership Form','technology','partnerships',NULL,false,true,'auto_partnership','Technology Partnership','TECH'),
('partner_lead','Partner With HLS Lead','partnerships','international',NULL,false,true,'auto_partnership','Partner Lead','CP'),
('investor_inquiry','Investor Inquiry','investors','financing','executive_office',true,true,'auto_confidential','Investor','INV'),
('government_inquiry','Government / Film Commission','government_relations','international',NULL,false,true,'auto_general','Government','GOV'),
('coproduction_inquiry','Co-Production Inquiry','coproductions','international',NULL,false,true,'auto_general','Co-Production','COP'),
('casting_inquiry','Casting Inquiry','casting','talent',NULL,false,true,'auto_general','Casting','CAST'),
('career_inquiry','Career Inquiry','careers','hr',NULL,false,true,'auto_general','Career','CAREER'),
('press_inquiry','Press Inquiry','press','public_relations',NULL,false,true,'auto_general','Press','GEN'),
('newsletter','Newsletter Signup','marketing',NULL,NULL,false,false,NULL,'Newsletter','GEN')
ON CONFLICT (form_key) DO NOTHING;

-- SEED: ROUTING RULES ----------------------------------------------------
INSERT INTO public.comm_routing_rules (form_key, label, field, operator, value, action, target_department, priority) VALUES
(NULL,'Automotive interest routes to Automotive','partnershipTypes','includes','automotive','notify','automotive',10),
(NULL,'Property contribution routes to Real Estate','partnershipTypes','includes','property','notify','real_estate',20),
(NULL,'Building / land routes to Studio Development','partnershipTypes','includes','building','notify','studio_development',25),
(NULL,'Technology interest routes to Technology','partnershipTypes','includes','technology','notify','technology',30),
(NULL,'Naming rights interest routes to Naming Rights','partnershipTypes','includes','naming','notify','naming_rights',40),
(NULL,'High-value inquiries notify the Executive Office','contributionValue','gte','5000000','notify','executive_office',50),
(NULL,'NDA requests notify Legal','ndaRequested','is_true','','notify','legal',60),
(NULL,'NDA requests notify Business Affairs','ndaRequested','is_true','','notify','business_affairs',70),
(NULL,'Confidential submissions restrict routing','confidential','is_true','','restrict','confidential',5)
ON CONFLICT DO NOTHING;

-- SEED: TEMPLATES --------------------------------------------------------
INSERT INTO public.comm_templates (key, name, subject, body, signature_department) VALUES
('auto_general','General Contact Auto Response','Thank You for Contacting High Light Source Film Studios',
'Thank you for contacting High Light Source Film Studios.

Your message has been received and routed to the appropriate department.

If your inquiry requires additional information, a representative may contact you using the information provided.

Reference: {{REFERENCE_NUMBER}}','general'),
('auto_partnership','Partnership Auto Response','High Light Source Film Studios — Partnership Inquiry Received',
'Thank you for your interest in exploring a relationship with High Light Source Film Studios.

Your partnership inquiry has been received and is being directed to the appropriate business-development team.

Reference: {{REFERENCE_NUMBER}}

Please retain this number for future correspondence.

If your inquiry involves confidential or proprietary information, please avoid transmitting additional sensitive materials until an appropriate secure communication process has been established.','partnerships'),
('auto_confidential','Confidential Inquiry Auto Response','HLS Confidential Inquiry Received',
'Thank you for contacting High Light Source Film Studios.

Your inquiry has been designated as confidential within our internal routing system and has been directed to the appropriate authorized representatives.

Reference: {{REFERENCE_NUMBER}}

Please do not send additional sensitive financial, legal, proprietary or transaction-related information by ordinary email until secure communication arrangements have been established.','confidential'),
('auto_automotive','Automotive Auto Response','HLS Automotive Partnership Inquiry',
'Thank you for your organization''s interest in an automotive relationship with High Light Source Film Studios.

Reference: {{REFERENCE_NUMBER}}
Organization: {{ORGANIZATION}}
Partnership type: {{PARTNERSHIP_TYPE}}
Contact: {{FIRST_NAME}} {{LAST_NAME}} — {{EMAIL}}

This acknowledgement confirms receipt only and does not constitute an offer, sponsorship commitment or any assurance of film placement.','automotive'),
('auto_property','Property Auto Response','HLS Studio Development Inquiry Received',
'Thank you for contacting High Light Source Film Studios regarding a property or studio-development opportunity.

Reference: {{REFERENCE_NUMBER}}

Submission of this inquiry does not constitute acceptance, purchase, lease or any commitment by High Light Source Film Studios. Any opportunity is subject to review, due diligence and written agreement.','real_estate'),
('internal_notification','Internal Department Notification','New {{FORM_LABEL}} — {{ORGANIZATION}}',
'A new submission has been routed to your department.

Reference: {{REFERENCE_NUMBER}}
Form: {{FORM_LABEL}}
Organization: {{ORGANIZATION}}
Contact: {{FIRST_NAME}} {{LAST_NAME}} — {{EMAIL}}
Country: {{COUNTRY}}
Partnership type: {{PARTNERSHIP_TYPE}}
Submitted: {{SUBMISSION_DATE}}

Review the full record in the HLS Communications Center.','general')
ON CONFLICT (key) DO NOTHING;

-- SEED: SIGNATURES -------------------------------------------------------
INSERT INTO public.comm_signatures (department_key, body) VALUES
('general','High Light Source Film Studios
Illuminating Stories. Inspiring the World.
{{HLS_WEBSITE}} | {{HLS_PHONE}}'),
('partnerships','High Light Source Film Studios
Corporate Partnerships
Illuminating Stories. Inspiring the World.
{{HLS_WEBSITE}} | {{HLS_PHONE}}'),
('automotive','High Light Source Film Studios
Automotive Partnerships
{{HLS_WEBSITE}}'),
('real_estate','High Light Source Film Studios
Real Estate & Studio Development
{{HLS_WEBSITE}}'),
('confidential','High Light Source Film Studios
Confidential Correspondence
This message and any attachments are intended only for the named recipients.')
ON CONFLICT (department_key) DO NOTHING;

-- SEED: SETTINGS ---------------------------------------------------------
INSERT INTO public.comm_settings (key, value) VALUES
('corporate_profile','{"legalName":"High Light Source Film Studios","brandName":"High Light Source Film Studios","website":"https://highlightsourcefilmstudios.com","phone":"","address":"","country":"","mainEmailDepartment":"general","partnershipEmailDepartment":"partnerships","pressEmailDepartment":"press","privacyEmailDepartment":"privacy","copyrightNotice":"© High Light Source Film Studios","registration":"","social":{}}'::jsonb),
('confidential_routing','{"primary":"executiveoffice@highlightsourcefilmstudios.com","secondary":"","legal":"legal@highlightsourcefilmstudios.com","finance":"capital@highlightsourcefilmstudios.com","enableLegalCopy":true,"enableFinanceCopy":false}'::jsonb),
('thresholds','{"executiveNotifyAmount":5000000,"highPriorityAmount":1000000}'::jsonb),
('global','{"routingEnabled":true,"fallbackEmail":"info@highlightsourcefilmstudios.com","testMode":false,"fromName":"High Light Source Film Studios","replyTo":""}'::jsonb),
('delivery','{"provider":"lovable","host":"","port":587,"encryption":"tls","username":"","fromAddress":"","note":"Credentials are stored as project secrets and never displayed."}'::jsonb)
ON CONFLICT (key) DO NOTHING;
