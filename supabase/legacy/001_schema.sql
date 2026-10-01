-- KILLSWITCH schema — the nervous system
-- Run this in your Supabase SQL Editor

-- Create a table for the active match
CREATE TABLE matches (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  status text DEFAULT 'lobby',       -- lobby | active | finished
  round int DEFAULT 1,
  best_of int DEFAULT 5,
  timer int DEFAULT 600,             -- seconds remaining
  active_modifier text DEFAULT 'none',
  problem_title text,
  problem_difficulty text DEFAULT 'Medium',
  created_at timestamptz DEFAULT now()
);

-- Create a table for contestants
CREATE TABLE players (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  slot int NOT NULL CHECK (slot BETWEEN 1 AND 4),
  name text NOT NULL,
  replit_url text,
  language text DEFAULT 'Python',
  score int DEFAULT 0,
  UNIQUE (match_id, slot)
);

-- Create a table for chat votes
CREATE TABLE votes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  command text NOT NULL,              -- e.g., 'darkmode', 'no-backspace'
  created_at timestamptz DEFAULT now()
);

-- ENABLE REALTIME FOR ALL
ALTER PUBLICATION supabase_realtime ADD TABLE matches;
ALTER PUBLICATION supabase_realtime ADD TABLE players;
ALTER PUBLICATION supabase_realtime ADD TABLE votes;

-- Permissive RLS for the sprint
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow all on matches" ON matches FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow all on players" ON players FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow all on votes" ON votes FOR ALL USING (true) WITH CHECK (true);
