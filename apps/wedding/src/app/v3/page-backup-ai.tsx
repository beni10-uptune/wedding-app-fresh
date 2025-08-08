'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Music, 
  ChevronRight, 
  Heart, 
  Sparkles,
  Play,
  Globe,
  Info,
  Plus,
  X,
  Check,
  Star,
  Clock,
  Users,
  TrendingUp,
  Headphones,
  MessageSquare
} from 'lucide-react';

// Default timeline with songs
const DEFAULT_TIMELINE = [
  {
    id: 'prelude',
    time: '3:30 PM',
    duration: '30 min',
    title: 'Guest Arrival',
    emoji: '👋',
    energy: 2,
    description: 'Welcoming atmosphere',
    tip: 'Choose familiar, upbeat songs that set a positive tone',
    songs: [
      { id: '1', title: 'A Thousand Years', artist: 'Christina Perri' },
      { id: '2', title: 'Marry Me', artist: 'Train' },
      { id: '3', title: 'All of Me', artist: 'John Legend' },
    ],
    expandable: 15,
  },
  {
    id: 'processional',
    time: '4:00 PM',
    duration: '5 min',
    title: 'Processional',
    emoji: '💐',
    energy: 3,
    description: 'Walking down the aisle',
    tip: 'Classical or instrumental works best for timing',
    songs: [
      { id: '4', title: 'Canon in D', artist: 'Pachelbel' },
      { id: '5', title: 'Here Comes the Bride', artist: 'Wagner' },
    ],
  },
  {
    id: 'recessional',
    time: '4:30 PM',
    duration: '5 min',
    title: 'Recessional',
    emoji: '🎊',
    energy: 4,
    description: 'Celebration begins!',
    tip: 'High energy songs to celebrate the moment',
    songs: [
      { id: '6', title: 'Signed, Sealed, Delivered', artist: 'Stevie Wonder' },
    ],
  },
  {
    id: 'cocktails',
    time: '5:00 PM',
    duration: '90 min',
    title: 'Cocktail Hour',
    emoji: '🥂',
    energy: 3,
    description: 'Mingling and drinks',
    tip: 'Mix genres to appeal to all age groups',
    songs: [
      { id: '7', title: 'Fly Me to the Moon', artist: 'Frank Sinatra' },
      { id: '8', title: 'Sunday Morning', artist: 'Maroon 5' },
      { id: '9', title: 'Better Days', artist: 'OneRepublic' },
      { id: '10', title: 'Golden', artist: 'Harry Styles' },
    ],
    expandable: 30,
  },
  {
    id: 'dinner',
    time: '6:30 PM',
    duration: '60 min',
    title: 'Dinner',
    emoji: '🍽️',
    energy: 2,
    description: 'Background music for conversation',
    tip: 'Keep it low-key so guests can talk',
    songs: [
      { id: '11', title: 'At Last', artist: 'Etta James' },
      { id: '12', title: 'Wonderful Tonight', artist: 'Eric Clapton' },
      { id: '13', title: 'Your Song', artist: 'Elton John' },
    ],
    expandable: 20,
  },
  {
    id: 'firstdance',
    time: '7:00 PM',
    duration: '5 min',
    title: 'First Dance',
    emoji: '💕',
    energy: 3,
    description: 'Your special moment',
    tip: 'This is YOUR song - make it meaningful',
    songs: [
      { id: '14', title: 'Perfect', artist: 'Ed Sheeran' },
    ],
  },
  {
    id: 'party',
    time: '8:00 PM',
    duration: '150 min',
    title: 'Party Time',
    emoji: '🎉',
    energy: 5,
    description: 'Dance floor hits',
    tip: 'Build energy gradually, peak at 9:30pm',
    songs: [
      { id: '15', title: 'Uptown Funk', artist: 'Bruno Mars' },
      { id: '16', title: 'Shut Up and Dance', artist: 'Walk the Moon' },
      { id: '17', title: "Can't Stop the Feeling", artist: 'Justin Timberlake' },
      { id: '18', title: 'Mr. Brightside', artist: 'The Killers' },
    ],
    expandable: 50,
  },
  {
    id: 'lastdance',
    time: '10:30 PM',
    duration: '5 min',
    title: 'Last Dance',
    emoji: '🌙',
    energy: 5,
    description: 'Send-off song',
    tip: 'End on a high note that guests will remember',
    songs: [
      { id: '19', title: 'Time of Your Life', artist: 'Green Day' },
    ],
  },
];

// Regional transformations
const REGIONAL_CHANGES: Record<string, any> = {
  'uk': {
    cocktails: [
      { old: 'Fly Me to the Moon', new: { title: 'Valerie', artist: 'Amy Winehouse' } },
      { old: 'Golden', new: { title: 'Dreams', artist: 'Fleetwood Mac' } },
    ],
    party: [
      { old: 'Mr. Brightside', new: { title: 'Mr. Brightside', artist: 'The Killers', note: '(UK wedding essential!)' } },
      { old: "Can't Stop the Feeling", new: { title: 'Dancing in the Moonlight', artist: 'Toploader' } },
    ],
  },
  'us': {
    cocktails: [
      { old: 'Valerie', new: { title: 'Fly Me to the Moon', artist: 'Sinatra' } },
    ],
    party: [
      { old: 'Mr. Brightside', new: { title: 'September', artist: 'Earth, Wind & Fire' } },
    ],
  },
  'australia': {
    party: [
      { old: 'Uptown Funk', new: { title: 'Horses', artist: 'Daryl Braithwaite' } },
      { old: 'Mr. Brightside', new: { title: 'Eagle Rock', artist: 'Daddy Cool' } },
    ],
  },
  'canada': {
    party: [
      { old: "Can't Stop the Feeling", new: { title: 'Home for a Rest', artist: 'Spirit of the West' } },
    ],
  },
};

// Genre transformations
const GENRE_CHANGES: Record<string, any> = {
  'country': {
    firstdance: [
      { old: 'Perfect', new: { title: 'Die a Happy Man', artist: 'Thomas Rhett' } },
    ],
    party: [
      { old: 'Uptown Funk', new: { title: 'Wagon Wheel', artist: 'Darius Rucker' } },
      { old: 'Shut Up and Dance', new: { title: 'Chicken Fried', artist: 'Zac Brown Band' } },
    ],
  },
  'rock': {
    firstdance: [
      { old: 'Perfect', new: { title: 'Wonderful Tonight', artist: 'Eric Clapton' } },
    ],
    party: [
      { old: 'Uptown Funk', new: { title: 'You Shook Me All Night Long', artist: 'AC/DC' } },
      { old: "Can't Stop the Feeling", new: { title: 'Don\'t Stop Believin\'', artist: 'Journey' } },
    ],
  },
  'hip-hop': {
    cocktails: [
      { old: 'Sunday Morning', new: { title: 'Best I Ever Had', artist: 'Drake' } },
    ],
    party: [
      { old: 'Uptown Funk', new: { title: 'Yeah!', artist: 'Usher' } },
      { old: 'Shut Up and Dance', new: { title: 'Gold Digger', artist: 'Kanye West' } },
    ],
  },
  'indie': {
    cocktails: [
      { old: 'Golden', new: { title: 'Electric Feel', artist: 'MGMT' } },
      { old: 'Sunday Morning', new: { title: 'Oxford Comma', artist: 'Vampire Weekend' } },
    ],
    party: [
      { old: 'Uptown Funk', new: { title: 'Time to Dance', artist: 'The Sounds' } },
      { old: 'Mr. Brightside', new: { title: 'Tongue Tied', artist: 'Grouplove' } },
    ],
  },
  'electronic': {
    party: [
      { old: 'Uptown Funk', new: { title: 'Clarity', artist: 'Zedd' } },
      { old: 'Shut Up and Dance', new: { title: 'Animals', artist: 'Martin Garrix' } },
      { old: "Can't Stop the Feeling", new: { title: 'Titanium', artist: 'David Guetta' } },
    ],
  },
};

// Wedding type transformations
const WEDDING_TYPE_CHANGES: Record<string, any> = {
  'beach': {
    cocktails: [
      { old: 'Fly Me to the Moon', new: { title: 'Somewhere Over the Rainbow', artist: 'Israel Kamakawiwoʻole' } },
      { old: 'Better Days', new: { title: 'Three Little Birds', artist: 'Bob Marley' } },
    ],
  },
  'garden': {
    processional: [
      { old: 'Canon in D', new: { title: 'A Thousand Years', artist: 'Christina Perri' } },
    ],
  },
  'rustic': {
    cocktails: [
      { old: 'Golden', new: { title: 'Ho Hey', artist: 'The Lumineers' } },
    ],
    party: [
      { old: 'Uptown Funk', new: { title: 'Footloose', artist: 'Kenny Loggins' } },
    ],
  },
  'formal': {
    processional: [
      { old: 'Canon in D', new: { title: 'Ave Maria', artist: 'Schubert' } },
    ],
    cocktails: [
      { old: 'Sunday Morning', new: { title: 'The Way You Look Tonight', artist: 'Tony Bennett' } },
    ],
  },
};

export default function V3Page() {
  const [country, setCountry] = useState('us');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [weddingType, setWeddingType] = useState('classic');
  const [timeline, setTimeline] = useState(DEFAULT_TIMELINE);
  const [expandedMoments, setExpandedMoments] = useState<string[]>([]);
  const [mustPlaySongs, setMustPlaySongs] = useState<string[]>(['']);
  const [spotifyPlaylists, setSpotifyPlaylists] = useState<string[]>(['']);
  const [customInstructions, setCustomInstructions] = useState('');
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Update timeline based on preferences
  useEffect(() => {
    const newTimeline = JSON.parse(JSON.stringify(DEFAULT_TIMELINE));

    // Apply must-play songs (first one to first dance if specified)
    const validMustPlaySongs = mustPlaySongs.filter(s => s.trim());
    if (validMustPlaySongs.length > 0) {
      // First must-play song goes to first dance
      const firstSong = validMustPlaySongs[0];
      const firstDanceIndex = newTimeline.findIndex((m: any) => m.id === 'firstdance');
      if (firstDanceIndex !== -1 && firstSong) {
        const parts = firstSong.split(' - ');
        newTimeline[firstDanceIndex].songs = [{
          id: 'custom-first-dance',
          title: parts[0].trim(),
          artist: parts[1]?.trim() || 'Your Artist',
          custom: true,
          emoji: '❤️'
        }];
      }
      
      // Add other must-play songs throughout the timeline
      // This is where AI would intelligently place them based on tempo/mood
      // For now, we'll just indicate they'll be incorporated
    }

    // Apply regional changes
    if (REGIONAL_CHANGES[country]) {
      const changes = REGIONAL_CHANGES[country];
      for (const [momentId, songChanges] of Object.entries(changes)) {
        const momentIndex = newTimeline.findIndex((m: any) => m.id === momentId);
        if (momentIndex !== -1) {
          for (const change of songChanges as any[]) {
            const songIndex = newTimeline[momentIndex].songs.findIndex(
              (s: any) => s.title === change.old
            );
            if (songIndex !== -1) {
              newTimeline[momentIndex].songs[songIndex] = {
                ...newTimeline[momentIndex].songs[songIndex],
                ...change.new,
              };
            }
          }
        }
      }
    }

    // Apply genre changes
    selectedGenres.forEach((genre) => {
      if (GENRE_CHANGES[genre]) {
        const changes = GENRE_CHANGES[genre];
        for (const [momentId, songChanges] of Object.entries(changes)) {
          const momentIndex = newTimeline.findIndex((m: any) => m.id === momentId);
          if (momentIndex !== -1) {
            for (const change of songChanges as any[]) {
              const songIndex = newTimeline[momentIndex].songs.findIndex(
                (s: any) => s.title === change.old
              );
              if (songIndex !== -1) {
                newTimeline[momentIndex].songs[songIndex] = {
                  ...newTimeline[momentIndex].songs[songIndex],
                  ...change.new,
                };
              }
            }
          }
        }
      }
    });

    // Apply wedding type changes
    if (WEDDING_TYPE_CHANGES[weddingType]) {
      const changes = WEDDING_TYPE_CHANGES[weddingType];
      for (const [momentId, songChanges] of Object.entries(changes)) {
        const momentIndex = newTimeline.findIndex((m: any) => m.id === momentId);
        if (momentIndex !== -1) {
          for (const change of songChanges as any[]) {
            const songIndex = newTimeline[momentIndex].songs.findIndex(
              (s: any) => s.title === change.old
            );
            if (songIndex !== -1) {
              newTimeline[momentIndex].songs[songIndex] = {
                ...newTimeline[momentIndex].songs[songIndex],
                ...change.new,
              };
            }
          }
        }
      }
    }

    setTimeline(newTimeline);
  }, [country, selectedGenres, weddingType, mustPlaySongs]);

  const toggleMoment = (momentId: string) => {
    setExpandedMoments((prev) =>
      prev.includes(momentId)
        ? prev.filter((id) => id !== momentId)
        : [...prev, momentId]
    );
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    );
  };

  const addMustPlaySong = () => {
    setMustPlaySongs([...mustPlaySongs, '']);
  };

  const updateMustPlaySong = (index: number, value: string) => {
    const updated = [...mustPlaySongs];
    updated[index] = value;
    setMustPlaySongs(updated);
  };

  const removeMustPlaySong = (index: number) => {
    setMustPlaySongs(mustPlaySongs.filter((_, i) => i !== index));
  };

  const addPlaylistInput = () => {
    setSpotifyPlaylists([...spotifyPlaylists, '']);
  };

  const updatePlaylist = (index: number, value: string) => {
    const updated = [...spotifyPlaylists];
    updated[index] = value;
    setSpotifyPlaylists(updated);
  };

  const removePlaylist = (index: number) => {
    setSpotifyPlaylists(spotifyPlaylists.filter((_, i) => i !== index));
  };

  const getTotalSongs = () => {
    return timeline.reduce((acc, moment) => {
      const baseSongs = moment.songs.length;
      const expandable = moment.expandable || 0;
      return acc + baseSongs + (expandedMoments.includes(moment.id) ? expandable : 0);
    }, 0);
  };

  const getTotalDuration = () => {
    const totalMinutes = timeline.reduce((acc, moment) => {
      const match = moment.duration.match(/(\d+)/);
      return acc + (match ? parseInt(match[0]) : 0);
    }, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen dark-gradient relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-purple w-96 h-96 -top-48 -right-48"></div>
        <div className="orb orb-blue w-96 h-96 -bottom-48 -left-48"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-purple-600/10 animate-spin-slow"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 glass-darker border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">UpTune</h1>
                <p className="text-xs text-purple-400">for Weddings</p>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/blog" className="text-white/70 hover:text-white transition-colors">Blog</Link>
              <Link href="/auth/login" className="text-white/70 hover:text-white transition-colors">Log In</Link>
              <Link href="/auth/signup" className="btn-primary">
                Get Started Free
                <Heart className="w-4 h-4" />
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm">AI-powered wedding playlists</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your Perfect Wedding Soundtrack,
            <br />
            <span className="text-gradient">Personalized in Seconds</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Watch your wedding playlist come to life as you add your special touches.
            From your first dance to the last song of the night.
          </p>
        </div>

        {/* Main Content - 2 Pane Layout */}
        <div className="lg:grid lg:grid-cols-[420px,1fr] lg:gap-8">
          {/* Left Panel - Context Inputs */}
          <div className="mb-8 lg:mb-0">
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" />
                Make it yours
              </h2>

              {/* Must-Play Songs */}
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Your must-play songs
                  <span className="text-xs text-purple-300">(First one = First dance)</span>
                </label>
                {mustPlaySongs.map((song, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={song}
                      onChange={(e) => updateMustPlaySong(index, e.target.value)}
                      placeholder={index === 0 ? "Your first dance song - Artist" : "Song title - Artist"}
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-white/40 text-sm"
                    />
                    {mustPlaySongs.length > 1 && (
                      <button
                        onClick={() => removeMustPlaySong(index)}
                        className="p-2 text-white/50 hover:text-white/70"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addMustPlaySong}
                  className="w-full px-3 py-2 border border-dashed border-purple-400/50 rounded-lg hover:border-purple-400 transition-colors text-sm text-purple-300 hover:text-purple-200 flex items-center justify-center gap-2 mt-2"
                >
                  <Plus className="w-4 h-4" />
                  Add another must-play song
                </button>
              </div>

              {/* Country Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Where's your wedding?
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                >
                  <option value="us">United States</option>
                  <option value="uk">United Kingdom</option>
                  <option value="australia">Australia</option>
                  <option value="canada">Canada</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Genre Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                  <Music className="w-4 h-4" />
                  Your music taste
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['rock', 'country', 'hip-hop', 'indie', 'electronic', 'pop'].map((genre) => (
                    <button
                      key={genre}
                      onClick={() => toggleGenre(genre)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedGenres.includes(genre)
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {genre.charAt(0).toUpperCase() + genre.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wedding Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Wedding vibe
                  <button
                    onMouseEnter={() => setShowTooltip('vibe')}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="relative"
                  >
                    <Info className="w-3 h-3 text-purple-400" />
                    {showTooltip === 'vibe' && (
                      <div className="absolute bottom-full left-0 mb-2 p-2 bg-black/90 text-white text-xs rounded-lg w-48">
                        This adjusts song selections to match your venue and atmosphere
                      </div>
                    )}
                  </button>
                </label>
                <select
                  value={weddingType}
                  onChange={(e) => setWeddingType(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                >
                  <option value="classic">Classic & Elegant</option>
                  <option value="beach">Beach & Tropical</option>
                  <option value="garden">Garden Party</option>
                  <option value="rustic">Rustic & Country</option>
                  <option value="formal">Black Tie Formal</option>
                </select>
              </div>

              {/* Custom Instructions */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Special requests
                  <button
                    onMouseEnter={() => setShowTooltip('custom')}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="relative"
                  >
                    <Info className="w-3 h-3 text-purple-400" />
                    {showTooltip === 'custom' && (
                      <div className="absolute bottom-full left-0 mb-2 p-2 bg-black/90 text-white text-xs rounded-lg w-56">
                        E.g., "We have Indian and Southern US heritage", "No explicit lyrics", "Heavy on 90s R&B"
                      </div>
                    )}
                  </button>
                </label>
                <textarea
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="Tell us about your unique situation... multicultural families, specific genres to avoid, special traditions, etc."
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-white/40 text-sm h-20 resize-none"
                />
              </div>

              {/* Spotify Playlists - Simplified */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                  <Headphones className="w-4 h-4" />
                  Reference playlists
                  <span className="text-xs text-purple-300">(Optional)</span>
                </label>
                <p className="text-xs text-white/50 mb-2">
                  Share Spotify playlist links for music inspiration
                </p>
                {spotifyPlaylists.map((playlist, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={playlist}
                      onChange={(e) => updatePlaylist(index, e.target.value)}
                      placeholder="https://open.spotify.com/playlist/..."
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-white/40 text-sm"
                    />
                    {spotifyPlaylists.length > 1 && (
                      <button
                        onClick={() => removePlaylist(index)}
                        className="p-2 text-white/50 hover:text-white/70"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                {spotifyPlaylists.length < 3 && (
                  <button
                    onClick={addPlaylistInput}
                    className="text-xs text-purple-300 hover:text-purple-200 underline"
                  >
                    + Add another playlist
                  </button>
                )}
              </div>

              {/* Stats */}
              <div className="p-4 bg-white/5 rounded-lg mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-white/60 flex items-center gap-1">
                    <Music className="w-3 h-3" />
                    Total songs
                  </span>
                  <span className="font-semibold text-white">{getTotalSongs()}</span>
                </div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-white/60 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Total duration
                  </span>
                  <span className="font-semibold text-white">{getTotalDuration()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Energy flow
                  </span>
                  <div className="flex gap-1">
                    {[2, 3, 4, 3, 2, 3, 5, 5].map((level, i) => (
                      <div
                        key={i}
                        className="w-1 bg-purple-500"
                        style={{ height: `${level * 4}px` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => setShowSignupModal(true)}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Customize Every Detail
                <ChevronRight className="w-4 h-4" />
              </button>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-white/50 mb-2">Join 10,000+ couples</p>
                <div className="flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Live Playlist */}
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">Your Wedding Playlist</h1>
                  <p className="text-white/60 mt-1">
                    {customInstructions || mustPlaySongs.filter(s => s.trim()).length > 1 
                      ? '✨ AI is personalizing based on your requests'
                      : 'Adapting in real-time to your preferences'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-white/70">Auto-saved</span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
              {timeline.map((moment) => (
                <div
                  key={moment.id}
                  className="border border-white/10 rounded-lg overflow-hidden hover:border-purple-500/50 transition-all"
                >
                  <button
                    onClick={() => toggleMoment(moment.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{moment.emoji}</span>
                      <div className="text-left">
                        <div className="font-semibold text-white flex items-center gap-2">
                          {moment.title}
                          {moment.id === 'firstdance' && mustPlaySongs[0]?.trim() && (
                            <span className="text-xs bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full">
                              Customized
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-white/50">
                          {moment.time} • {moment.duration} • {moment.songs.length} songs
                          {moment.expandable && !expandedMoments.includes(moment.id) && (
                            <span className="text-purple-400"> +{moment.expandable} more</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      className={`h-5 w-5 text-white/40 transition-transform ${
                        expandedMoments.includes(moment.id) ? 'rotate-90' : ''
                      }`}
                    />
                  </button>

                  {expandedMoments.includes(moment.id) && (
                    <div className="px-4 pb-4">
                      {/* Educational Tip */}
                      {moment.tip && (
                        <div className="mb-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                          <p className="text-xs text-purple-300 flex items-start gap-2">
                            <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            {moment.tip}
                          </p>
                        </div>
                      )}
                      
                      {/* Songs */}
                      <div className="space-y-2">
                        {moment.songs.map((song) => (
                          <div
                            key={song.id}
                            className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-purple-400">
                                {'emoji' in song ? (song as any).emoji : '♪'}
                              </span>
                              <div>
                                <span className="font-medium text-white">
                                  {song.title}
                                  {'custom' in song && (
                                    <span className="ml-2 text-xs text-pink-400">(Your song!)</span>
                                  )}
                                </span>
                                <span className="text-white/50 ml-2">- {song.artist}</span>
                                {'note' in song && (song as any).note && (
                                  <span className="text-xs text-green-400 ml-2">
                                    {(song as any).note}
                                  </span>
                                )}
                              </div>
                            </div>
                            <button className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1">
                              <Play className="w-3 h-3" />
                              Preview
                            </button>
                          </div>
                        ))}
                        {moment.expandable && (
                          <div className="text-center py-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                            <p className="text-sm text-purple-300 mb-2">
                              +{moment.expandable} more songs available
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowSignupModal(true);
                              }}
                              className="text-xs text-purple-400 hover:text-purple-300 underline"
                            >
                              Unlock with free account
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Value Props */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="glass-card rounded-lg p-6 text-center">
            <Users className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-2">Guest Collaboration</h3>
            <p className="text-sm text-white/60">Let guests suggest songs before the big day</p>
          </div>
          <div className="glass-card rounded-lg p-6 text-center">
            <Headphones className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-2">Spotify Integration</h3>
            <p className="text-sm text-white/60">Export to Spotify with one click</p>
          </div>
          <div className="glass-card rounded-lg p-6 text-center">
            <Star className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-2">DJ-Approved</h3>
            <p className="text-sm text-white/60">Tested at 500+ real weddings</p>
          </div>
        </div>
      </div>

      {/* Signup Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowSignupModal(false)} />
          <div className="relative glass-card rounded-xl p-8 max-w-md w-full">
            <button
              onClick={() => setShowSignupModal(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-2">
              Save Your Perfect Playlist
            </h2>
            <p className="text-white/60 mb-6">
              Create a free account to unlock all customization features
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-white/80">Unlimited song customization</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-white/80">Share with your DJ & guests</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-white/80">Export to Spotify instantly</span>
              </div>
            </div>
            
            <Link href="/auth/signup" className="btn-primary w-full flex items-center justify-center gap-2">
              Continue to Signup
              <ChevronRight className="w-4 h-4" />
            </Link>
            
            <p className="text-center text-xs text-white/40 mt-4">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-purple-400 hover:text-purple-300">
                Log in
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}