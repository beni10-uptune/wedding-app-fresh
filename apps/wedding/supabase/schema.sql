-- Supabase Schema for Wedding App
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search
CREATE EXTENSION IF NOT EXISTS "vector"; -- For similarity search (if needed later)

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weddings table
CREATE TABLE IF NOT EXISTS public.weddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  couple_names TEXT NOT NULL,
  partner1_name TEXT,
  partner2_name TEXT,
  wedding_date DATE,
  venue_name TEXT,
  venue_type TEXT,
  guest_count INT,
  
  -- Owner and permissions
  owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  co_owner_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  co_owner_code TEXT UNIQUE,
  guest_code TEXT UNIQUE,
  
  -- Settings and customization
  primary_color TEXT DEFAULT '#8B5CF6',
  secondary_color TEXT DEFAULT '#EC4899',
  font_style TEXT DEFAULT 'elegant',
  
  -- Payment and tier
  payment_status TEXT DEFAULT 'free' CHECK (payment_status IN ('free', 'paid', 'trial')),
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'starter', 'professional', 'ultimate')),
  stripe_subscription_id TEXT,
  subscription_end_date TIMESTAMPTZ,
  
  -- Timeline and preferences (JSONB for flexibility)
  timeline JSONB DEFAULT '{}',
  music_preferences JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  
  -- Features
  spotify_playlist_id TEXT,
  spotify_refresh_token TEXT,
  is_public BOOLEAN DEFAULT false,
  allow_guest_submissions BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Songs table (our cached Spotify songs)
CREATE TABLE IF NOT EXISTS public.songs (
  id TEXT PRIMARY KEY, -- Spotify track ID
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT,
  album_art TEXT,
  preview_url TEXT,
  spotify_uri TEXT NOT NULL,
  
  -- Musical properties
  duration INT, -- in seconds
  energy INT CHECK (energy BETWEEN 1 AND 5),
  bpm INT,
  valence DECIMAL(3,2), -- happiness 0-1
  danceability DECIMAL(3,2), -- 0-1
  acousticness DECIMAL(3,2), -- 0-1
  
  -- Categorization
  genres TEXT[], -- Array of genres
  moments TEXT[], -- Array of wedding moments this song fits
  explicit BOOLEAN DEFAULT false,
  popularity INT DEFAULT 50,
  
  -- Metadata
  audio_features JSONB, -- Full Spotify audio features
  spotify_data JSONB, -- Full Spotify track data
  added_by UUID REFERENCES public.users(id),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Guest submissions
CREATE TABLE IF NOT EXISTS public.guest_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE,
  song_id TEXT REFERENCES public.songs(id),
  
  -- Guest info
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  table_number TEXT,
  
  -- Song details (denormalized for performance)
  song_title TEXT NOT NULL,
  song_artist TEXT NOT NULL,
  song_spotify_id TEXT,
  
  -- Metadata
  moment TEXT, -- Which wedding moment they suggest it for
  dedication TEXT, -- Optional message
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT NOT NULL, -- Markdown content
  excerpt TEXT,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[],
  
  -- Categorization
  category TEXT,
  tags TEXT[],
  featured BOOLEAN DEFAULT false,
  
  -- Media
  featured_image TEXT,
  images JSONB DEFAULT '[]',
  
  -- Publishing
  author_id UUID REFERENCES public.users(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  
  -- Engagement
  view_count INT DEFAULT 0,
  share_count INT DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email captures (for landing page)
CREATE TABLE IF NOT EXISTS public.email_captures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  source TEXT, -- 'landing', 'blog', 'popup', etc.
  metadata JSONB DEFAULT '{}',
  subscribed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_weddings_slug ON public.weddings(slug);
CREATE INDEX IF NOT EXISTS idx_weddings_owner ON public.weddings(owner_id);
CREATE INDEX IF NOT EXISTS idx_weddings_codes ON public.weddings(co_owner_code, guest_code);

CREATE INDEX IF NOT EXISTS idx_songs_genres ON public.songs USING GIN(genres);
CREATE INDEX IF NOT EXISTS idx_songs_moments ON public.songs USING GIN(moments);
CREATE INDEX IF NOT EXISTS idx_songs_energy ON public.songs(energy);
CREATE INDEX IF NOT EXISTS idx_songs_search ON public.songs USING GIN(
  to_tsvector('english', title || ' ' || artist)
);

CREATE INDEX IF NOT EXISTS idx_guest_submissions_wedding ON public.guest_submissions(wedding_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status, published_at);

-- Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_captures ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Weddings policies
CREATE POLICY "Owners can do everything with their weddings" ON public.weddings
  FOR ALL USING (auth.uid() = owner_id OR auth.uid() = co_owner_id);

CREATE POLICY "Public weddings are viewable" ON public.weddings
  FOR SELECT USING (is_public = true);

CREATE POLICY "Anyone can view wedding by guest code" ON public.weddings
  FOR SELECT USING (true); -- We'll check guest_code in the query

-- Songs policies (everyone can read, authenticated can insert)
CREATE POLICY "Anyone can view songs" ON public.songs
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can add songs" ON public.songs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Guest submissions policies
CREATE POLICY "Anyone can create guest submissions" ON public.guest_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Wedding owners can view submissions" ON public.guest_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.weddings 
      WHERE weddings.id = guest_submissions.wedding_id 
      AND (weddings.owner_id = auth.uid() OR weddings.co_owner_id = auth.uid())
    )
  );

CREATE POLICY "Wedding owners can update submissions" ON public.guest_submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.weddings 
      WHERE weddings.id = guest_submissions.wedding_id 
      AND (weddings.owner_id = auth.uid() OR weddings.co_owner_id = auth.uid())
    )
  );

-- Blog posts policies
CREATE POLICY "Anyone can view published posts" ON public.blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authors can manage own posts" ON public.blog_posts
  FOR ALL USING (auth.uid() = author_id);

-- Email captures (only insert, no read for privacy)
CREATE POLICY "Anyone can subscribe" ON public.email_captures
  FOR INSERT WITH CHECK (true);

-- Functions for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weddings_updated_at BEFORE UPDATE ON public.weddings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_songs_updated_at BEFORE UPDATE ON public.songs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to upsert songs (insert or update)
CREATE OR REPLACE FUNCTION upsert_song(
  p_id TEXT,
  p_title TEXT,
  p_artist TEXT,
  p_album TEXT,
  p_album_art TEXT,
  p_preview_url TEXT,
  p_spotify_uri TEXT,
  p_duration INT,
  p_energy INT,
  p_genres TEXT[],
  p_explicit BOOLEAN,
  p_spotify_data JSONB
) RETURNS public.songs AS $$
DECLARE
  v_song public.songs;
BEGIN
  INSERT INTO public.songs (
    id, title, artist, album, album_art, preview_url, 
    spotify_uri, duration, energy, genres, explicit, spotify_data
  ) VALUES (
    p_id, p_title, p_artist, p_album, p_album_art, p_preview_url,
    p_spotify_uri, p_duration, p_energy, p_genres, p_explicit, p_spotify_data
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    artist = EXCLUDED.artist,
    album = EXCLUDED.album,
    album_art = EXCLUDED.album_art,
    preview_url = EXCLUDED.preview_url,
    duration = EXCLUDED.duration,
    energy = EXCLUDED.energy,
    genres = EXCLUDED.genres,
    explicit = EXCLUDED.explicit,
    spotify_data = EXCLUDED.spotify_data,
    updated_at = NOW()
  RETURNING * INTO v_song;
  
  RETURN v_song;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;