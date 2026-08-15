CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  group_key text NOT NULL DEFAULT 'general',
  label text NOT NULL,
  help text,
  kind text NOT NULL DEFAULT 'text',
  is_public boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 100,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public settings are readable by anyone"
ON public.site_settings FOR SELECT TO anon
USING (is_public = true);

CREATE POLICY "Signed-in staff can read all settings"
ON public.site_settings FOR SELECT TO authenticated
USING (true);

CREATE TRIGGER trg_site_settings_updated
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_settings (key, value, group_key, label, help, kind, is_public, sort_order) VALUES
  ('brand_name', 'High Light Source Film Studios', 'identity', 'Brand Name', 'Shown in the header, footer and page titles.', 'text', true, 10),
  ('legal_name', 'High Light Source Film Studios LLC', 'identity', 'Legal Company Name', 'Used in legal pages and corporate correspondence.', 'text', true, 20),
  ('short_name', 'HLS', 'identity', 'Short Name', 'Compact abbreviation used in tight layouts.', 'text', true, 30),
  ('tagline', 'Illuminating Stories. Inspiring the World.', 'identity', 'Tagline', 'Primary brand line under the logo.', 'text', true, 40),
  ('corporate_description', 'High Light Source Film Studios is an international motion-picture company developing, financing and producing feature films, television and documentary work across global markets.', 'identity', 'Corporate Description', 'Boilerplate paragraph reused across the site and press material.', 'longtext', true, 50),
  ('registration_info', '', 'identity', 'Company Registration Information', 'Registration or incorporation details, if published.', 'text', true, 60),
  ('copyright_statement', 'High Light Source Film Studios. All rights reserved.', 'identity', 'Copyright Statement', 'The year is added automatically in the footer.', 'text', true, 70),
  ('phone_main', '', 'contact', 'Main Telephone', '', 'text', true, 10),
  ('phone_secondary', '', 'contact', 'Secondary Telephone', '', 'text', true, 20),
  ('email_main', 'info@highlightsourcefilmstudios.com', 'contact', 'Main Email', 'General public address. Department routing is managed in Communications.', 'text', true, 30),
  ('address_line', '', 'contact', 'Office Address', '', 'text', true, 40),
  ('address_city', '', 'contact', 'City', '', 'text', true, 50),
  ('address_state', '', 'contact', 'State / Province', '', 'text', true, 60),
  ('address_postal', '', 'contact', 'Postal Code', '', 'text', true, 70),
  ('address_country', '', 'contact', 'Country', '', 'text', true, 80),
  ('website_url', 'https://highlightsourcefilmstudios.com', 'website', 'Official Website URL', 'Used for canonical links, sitemaps and structured data.', 'url', true, 10),
  ('social_instagram', '', 'social', 'Instagram', '', 'url', true, 10),
  ('social_facebook', '', 'social', 'Facebook', '', 'url', true, 20),
  ('social_youtube', '', 'social', 'YouTube', '', 'url', true, 30),
  ('social_linkedin', '', 'social', 'LinkedIn', '', 'url', true, 40),
  ('social_tiktok', '', 'social', 'TikTok', '', 'url', true, 50),
  ('social_x', '', 'social', 'X', '', 'url', true, 60),
  ('social_imdb', '', 'social', 'IMDb', '', 'url', true, 70),
  ('social_other', '', 'social', 'Other', '', 'url', true, 80),
  ('color_black', '#050505', 'brand', 'HLS Black', 'Primary background.', 'color', true, 10),
  ('color_gold', '#D4AF37', 'brand', 'Cinematic Gold', 'Primary accent used site-wide.', 'color', true, 20),
  ('color_gold_highlight', '#FFD76A', 'brand', 'Highlight Gold', 'Light beams and hover states.', 'color', true, 30),
  ('color_warm_white', '#F5F2EA', 'brand', 'Warm White', 'Primary text colour.', 'color', true, 40),
  ('color_graphite', '#161616', 'brand', 'Graphite', 'Panels and cards.', 'color', true, 50),
  ('color_silver', '#B8B8B8', 'brand', 'Silver', 'Secondary text colour.', 'color', true, 60),
  ('logo_primary', '', 'logos', 'Primary HLS Logo', 'Used in the header and footer when set.', 'image', true, 10),
  ('logo_horizontal', '', 'logos', 'Horizontal Logo', '', 'image', true, 20),
  ('logo_vertical', '', 'logos', 'Vertical Logo', '', 'image', true, 30),
  ('logo_emblem', '', 'logos', 'HLS Emblem', 'Compact mark used on mobile.', 'image', true, 40),
  ('logo_white', '', 'logos', 'White Logo', '', 'image', true, 50),
  ('logo_gold', '', 'logos', 'Gold Logo', '', 'image', true, 60),
  ('logo_dark', '', 'logos', 'Dark Logo', '', 'image', true, 70),
  ('logo_favicon', '', 'logos', 'Favicon', '', 'image', true, 80),
  ('logo_intro', '', 'logos', 'Studio Intro Logo', 'Shown in the cinematic opening animation.', 'image', true, 90);

CREATE POLICY "Brand assets are publicly readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'brand');

CREATE POLICY "Staff can upload brand assets"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'brand');

CREATE POLICY "Staff can update brand assets"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'brand');

CREATE POLICY "Staff can delete brand assets"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'brand');