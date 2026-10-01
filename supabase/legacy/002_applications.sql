-- Competitor intake: stored for traction / outreach (run after 001_schema.sql)

CREATE TABLE applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  email text NOT NULL,
  portfolio_url text,
  preferred_language text NOT NULL,
  experience_level text NOT NULL,
  motivation text NOT NULL,
  live_availability text NOT NULL CHECK (live_availability IN ('yes', 'voice', 'no')),
  source text DEFAULT 'web',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX applications_created_at_idx ON applications (created_at DESC);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON applications TO anon, authenticated;

-- Public form: anyone can submit; no public reads (view rows in Supabase Table Editor or SQL)
CREATE POLICY "anon insert applications"
  ON applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
