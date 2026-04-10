-- watchlist table (with applied/notified flags for edge function)
CREATE TABLE IF NOT EXISTS public.watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  scholarship_id TEXT REFERENCES public.scholarships(id) ON DELETE CASCADE,
  applied BOOLEAN DEFAULT FALSE,
  notified BOOLEAN DEFAULT FALSE,
  notify_before_days INTEGER DEFAULT 7,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, scholarship_id)
);

-- scholarships table (mirror of local SCHOLARSHIPS array for AI queries)
CREATE TABLE IF NOT EXISTS public.scholarships (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  provider TEXT,
  provider_type TEXT,
  amount INTEGER,
  deadline DATE,
  course_levels TEXT[],
  categories TEXT[],
  genders TEXT[],
  states TEXT[],
  min_percentage NUMERIC,
  description TEXT,
  documents_required TEXT[],
  apply_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  confidence_score NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Note: In the watchlist table, modified public.users to auth.users 
-- and scholarship_id to TEXT to match scholarships(id) schema.

-- Enable Row Level Security
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own watchlist" ON public.watchlist
  FOR ALL USING (auth.uid() = user_id);
