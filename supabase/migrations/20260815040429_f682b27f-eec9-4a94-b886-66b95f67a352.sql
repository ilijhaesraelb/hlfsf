CREATE TABLE public.films (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  genre text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'DRAMA',
  status text NOT NULL DEFAULT 'IN DEVELOPMENT',
  countries text NOT NULL DEFAULT '',
  logline text NOT NULL DEFAULT '',
  synopsis text NOT NULL DEFAULT '',
  credits text NOT NULL DEFAULT '',
  release_note text NOT NULL DEFAULT '',
  poster_url text,
  stills jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order integer NOT NULL DEFAULT 100,
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.films TO anon;
GRANT SELECT ON public.films TO authenticated;
GRANT ALL ON public.films TO service_role;

ALTER TABLE public.films ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published films are readable by anyone"
  ON public.films FOR SELECT TO anon USING (published = true);

CREATE POLICY "Published films are readable by signed-in visitors"
  ON public.films FOR SELECT TO authenticated USING (published = true);

CREATE POLICY "Staff can read all films"
  ON public.films FOR SELECT TO authenticated USING (public.is_comms_admin(auth.uid()));

CREATE TRIGGER trg_films_updated
  BEFORE UPDATE ON public.films
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX films_published_idx ON public.films (published, sort_order);