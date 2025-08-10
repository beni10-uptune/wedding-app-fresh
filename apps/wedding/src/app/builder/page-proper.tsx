'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Music, 
  ChevronRight, 
  Heart, 
  Sparkles,
  Play,
  Pause,
  Globe,
  Plus,
  X,
  Check,
  Star,
  Clock,
  Users,
  Headphones,
  MessageSquare,
  Loader2,
  RefreshCw,
  Volume2,
  Mail,
  ArrowRight,
  Lock,
  Unlock
} from 'lucide-react';

// Vibe options with instant music preview
const VIBE_OPTIONS = [
  { 
    id: 'romantic', 
    label: 'Romantic & Classic', 
    emoji: '💕',
    description: 'Timeless love songs and elegant moments',
    previewSong: 'Perfect - Ed Sheeran',
    color: 'from-pink-500 to-red-500'
  },
  { 
    id: 'party', 
    label: 'Party All Night', 
    emoji: '🎉',
    description: 'High energy dance floor hits',
    previewSong: 'Uptown Funk - Bruno Mars',
    color: 'from-purple-500 to-pink-500'
  },
  { 
    id: 'modern', 
    label: 'Modern & Trendy', 
    emoji: '✨',
    description: 'Contemporary hits and current favorites',
    previewSong: 'Levitating - Dua Lipa',
    color: 'from-blue-500 to-purple-500'
  },
  { 
    id: 'rustic', 
    label: 'Rustic & Chill', 
    emoji: '🌿',
    description: 'Laid-back vibes and acoustic feels',
    previewSong: 'Ho Hey - The Lumineers',
    color: 'from-green-500 to-teal-500'
  },
];

interface Song {
  id: string;
  title: string;
  artist: string;
  duration?: number;
  previewUrl?: string;
  albumArt?: string;
  moment?: string;
  energy?: number;
  bpm?: number;
}

interface TimelineMoment {
  id: string;
  time: string;
  duration: string;
  title: string;
  emoji: string;
  description: string;
  songs: Song[];
  insight?: string;
  bpmRange?: string;
}

export default function V3ProperPage() {
  const [step, setStep] = useState<'vibe' | 'preferences' | 'email' | 'playlist'>('vibe');
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [email, setEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlaylist, setGeneratedPlaylist] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [expandedMoments, setExpandedMoments] = useState<string[]>([]);
  const [showPaywall, setShowPaywall] = useState(false);
  const [aiProvider, setAiProvider] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Auto-play music when vibe is selected
  useEffect(() => {
    if (selectedVibe && step === 'preferences') {
      // Start playing preview music
      setIsPlaying(true);
      // In real implementation, this would play actual Spotify preview
    }
  }, [selectedVibe, step]);

  const handleVibeSelect = async (vibeId: string) => {
    setSelectedVibe(vibeId);
    setStep('preferences');
    
    // Start generating in background
    generateInitialPlaylist(vibeId);
  };

  const generateInitialPlaylist = async (vibe: string) => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate-playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vibe,
          genres: selectedGenres,
          spotifyPlaylist: spotifyUrl,
          // Basic generation for preview
          preview: true
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setGeneratedPlaylist(data.playlist);
        setAiProvider(data.metadata?.generatedBy);
      }
    } catch (error) {
      console.error('Generation failed:', error);
      // Use fallback playlist
      setGeneratedPlaylist(getFallbackPlaylist(vibe));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Save email for later conversion
      localStorage.setItem('uptune_email', email);
      setStep('playlist');
      
      // Enhance playlist with full details
      if (selectedGenres.length > 0 || spotifyUrl) {
        await enhancePlaylist();
      }
    }
  };

  const enhancePlaylist = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate-playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vibe: selectedVibe,
          genres: selectedGenres,
          spotifyPlaylist: spotifyUrl,
          email,
          // Full generation
          preview: false
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setGeneratedPlaylist(data.playlist);
        setAiProvider(data.metadata?.generatedBy);
      }
    } catch (error) {
      console.error('Enhancement failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getFallbackPlaylist = (vibe: string): any => {
    // Return a basic playlist structure based on vibe
    const baseTimeline: TimelineMoment[] = [
      {
        id: 'cocktail',
        time: '5:00 PM',
        duration: '60 min',
        title: 'Cocktail Hour',
        emoji: '🥂',
        description: 'Sophisticated mingling music',
        bpmRange: '110-120 BPM',
        insight: 'We start at 110 BPM with jazz and soul to create sophisticated ambiance. Notice how we alternate modern hits with classics every 3 songs to engage all generations.',
        songs: [
          { id: '1', title: 'Fly Me to the Moon', artist: 'Frank Sinatra', bpm: 105 },
          { id: '2', title: 'Valerie', artist: 'Amy Winehouse', bpm: 123 },
          { id: '3', title: 'Sunday Morning', artist: 'Maroon 5', bpm: 110 },
        ]
      },
      {
        id: 'dinner',
        time: '6:00 PM',
        duration: '90 min',
        title: 'Dinner',
        emoji: '🍽️',
        description: 'Background music for conversation',
        bpmRange: '95-110 BPM',
        insight: 'During dinner, we keep the energy low but positive, allowing conversation while maintaining the celebratory atmosphere.',
        songs: [
          { id: '4', title: 'At Last', artist: 'Etta James', bpm: 95 },
          { id: '5', title: 'Your Song', artist: 'Elton John', bpm: 102 },
          { id: '6', title: 'Make You Feel My Love', artist: 'Adele', bpm: 98 },
        ]
      },
      {
        id: 'firstdance',
        time: '7:30 PM',
        duration: '5 min',
        title: 'First Dance',
        emoji: '💕',
        description: 'Your special moment',
        songs: [
          { id: '7', title: vibe === 'romantic' ? 'Perfect' : 'All of Me', artist: vibe === 'romantic' ? 'Ed Sheeran' : 'John Legend' },
        ]
      },
      {
        id: 'party',
        time: '8:00 PM',
        duration: '150 min',
        title: 'Party Time',
        emoji: '🎉',
        description: 'Dance floor hits',
        bpmRange: '118-128 BPM',
        insight: 'Party section gradually builds from 118 to 128 BPM, with strategic throwbacks every 4th song to keep all ages dancing.',
        songs: [
          { id: '8', title: 'Uptown Funk', artist: 'Bruno Mars', bpm: 115 },
          { id: '9', title: 'Shut Up and Dance', artist: 'Walk the Moon', bpm: 128 },
          { id: '10', title: 'Mr. Brightside', artist: 'The Killers', bpm: 120 },
          { id: '11', title: "Can't Stop the Feeling", artist: 'Justin Timberlake', bpm: 113 },
        ]
      },
    ];

    return {
      name: 'Your Wedding Playlist',
      songCount: 150,
      duration: 360,
      timeline: baseTimeline,
      previewSongs: baseTimeline.slice(0, 3).flatMap(m => m.songs.slice(0, 2))
    };
  };

  const toggleMoment = (momentId: string) => {
    setExpandedMoments(prev =>
      prev.includes(momentId)
        ? prev.filter(id => id !== momentId)
        : [...prev, momentId]
    );
  };

  return (
    <div className="min-h-screen dark-gradient relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-purple w-96 h-96 -top-48 -right-48"></div>
        <div className="orb orb-blue w-96 h-96 -bottom-48 -left-48"></div>
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
                <p className="text-xs text-purple-400">AI Wedding Music</p>
              </div>
            </Link>
            
            {aiProvider && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-full">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-purple-300">
                  Powered by {aiProvider === 'gpt5' ? 'GPT-5' : 
                              aiProvider === 'claude' ? 'Claude' :
                              aiProvider === 'gemini' ? 'Gemini' : 'AI'}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        
        {/* Step 1: Vibe Selection */}
        {step === 'vibe' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-4">
                What's your <span className="text-gradient">wedding vibe?</span>
              </h1>
              <p className="text-xl text-white/70">
                Click to instantly hear your wedding music
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {VIBE_OPTIONS.map((vibe) => (
                <button
                  key={vibe.id}
                  onClick={() => handleVibeSelect(vibe.id)}
                  className="group relative overflow-hidden rounded-2xl p-8 text-left transition-all hover:scale-105 hover:shadow-2xl"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${vibe.color} opacity-90`} />
                  <div className="relative z-10">
                    <span className="text-4xl mb-4 block">{vibe.emoji}</span>
                    <h3 className="text-2xl font-bold text-white mb-2">{vibe.label}</h3>
                    <p className="text-white/80 mb-4">{vibe.description}</p>
                    <div className="flex items-center gap-2 text-white/60">
                      <Volume2 className="w-4 h-4" />
                      <span className="text-sm">Preview: {vibe.previewSong}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 transform translate-x-full group-hover:translate-x-0 transition-transform">
                    <ChevronRight className="w-6 h-6 text-white" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Quick Preferences */}
        {step === 'preferences' && (
          <div className="max-w-2xl mx-auto">
            {/* Music Playing Indicator */}
            <div className="mb-8 p-4 glass-card rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  {isPlaying ? (
                    <Volume2 className="w-6 h-6 text-white animate-pulse" />
                  ) : (
                    <Play className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-white/60">Now playing your vibe</p>
                  <p className="font-semibold text-white">
                    {VIBE_OPTIONS.find(v => v.id === selectedVibe)?.previewSong}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6">
                Perfect! Quick - what do you love?
              </h2>

              {/* Genre Selection */}
              <div className="mb-8">
                <p className="text-white/70 mb-4">Select your favorite genres (optional)</p>
                <div className="flex flex-wrap gap-3">
                  {['Pop', 'Rock', 'Country', 'R&B', 'Hip-Hop', 'Indie', 'Electronic', 'Jazz'].map((genre) => (
                    <button
                      key={genre}
                      onClick={() => {
                        setSelectedGenres(prev =>
                          prev.includes(genre)
                            ? prev.filter(g => g !== genre)
                            : [...prev, genre]
                        );
                      }}
                      className={`px-4 py-2 rounded-full transition-all ${
                        selectedGenres.includes(genre)
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Spotify Playlist */}
              <div className="mb-8">
                <p className="text-white/70 mb-4">Got a playlist? (optional)</p>
                <input
                  type="text"
                  value={spotifyUrl}
                  onChange={(e) => setSpotifyUrl(e.target.value)}
                  placeholder="Paste Spotify playlist URL"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-white/40"
                />
              </div>

              {/* Continue Button */}
              <button
                onClick={() => setStep('email')}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating your playlist...
                  </>
                ) : (
                  <>
                    See your playlist
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Skip Link */}
              <button
                onClick={() => setStep('email')}
                className="w-full mt-4 text-white/50 hover:text-white/70 text-sm"
              >
                Skip and continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Email Gate */}
        {step === 'email' && generatedPlaylist && (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-4">
                Here's your wedding music...
              </h2>
              <p className="text-xl text-white/70">
                5 song preview • {generatedPlaylist.songCount || 150} total songs ready
              </p>
            </div>

            {/* Preview Songs */}
            <div className="glass-card rounded-2xl p-6 mb-8">
              <div className="space-y-4">
                {(generatedPlaylist.previewSongs || []).slice(0, 5).map((song: Song, index: number) => (
                  <div key={song.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-purple-400">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-white">{song.title}</p>
                        <p className="text-white/60">{song.artist}</p>
                      </div>
                    </div>
                    <button className="text-purple-400 hover:text-purple-300">
                      <Play className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Email Form */}
            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Get your complete playlist
              </h3>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-white/80">All {generatedPlaylist.songCount || 150} songs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-white/80">Share with partner</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-white/80">No credit card</span>
                </div>
              </div>

              <form onSubmit={handleEmailSubmit} className="flex gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-white/40"
                />
                <button
                  type="submit"
                  className="btn-primary px-8"
                >
                  Get My Playlist
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Step 4: Full Playlist Reveal */}
        {step === 'playlist' && generatedPlaylist && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                YOUR COMPLETE WEDDING PLAYLIST
              </h1>
              <p className="text-xl text-white/70">
                {generatedPlaylist.songCount || 150} songs • {Math.round((generatedPlaylist.duration || 360) / 60)} hours of music
              </p>
            </div>

            {/* Timeline with Educational Insights */}
            <div className="space-y-6">
              {(generatedPlaylist.timeline || getFallbackPlaylist(selectedVibe!).timeline).map((moment: TimelineMoment) => (
                <div key={moment.id} className="glass-card rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleMoment(moment.id)}
                    className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{moment.emoji}</span>
                      <div className="text-left">
                        <h3 className="text-xl font-bold text-white">{moment.title}</h3>
                        <p className="text-white/60">
                          {moment.time} • {moment.duration} • {moment.songs.length}+ songs
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 text-white/40 transition-transform ${
                        expandedMoments.includes(moment.id) ? 'rotate-90' : ''
                      }`}
                    />
                  </button>

                  {expandedMoments.includes(moment.id) && (
                    <div className="px-6 pb-6">
                      {/* Educational Insight */}
                      {moment.insight && (
                        <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                          <p className="text-purple-300 leading-relaxed">
                            💡 {moment.insight}
                          </p>
                          {moment.bpmRange && (
                            <p className="text-purple-400 text-sm mt-2">
                              BPM Range: {moment.bpmRange}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Songs */}
                      <div className="space-y-3">
                        {moment.songs.map((song, index) => (
                          <div key={song.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                              <span className="text-purple-400 font-semibold">{index + 1}</span>
                              <div>
                                <p className="font-medium text-white">
                                  {song.title} - {song.artist}
                                </p>
                                {song.bpm && (
                                  <p className="text-xs text-white/50">
                                    {song.bpm} BPM
                                  </p>
                                )}
                              </div>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowPaywall(true);
                              }}
                              className="text-purple-400 hover:text-purple-300"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        
                        {/* More songs indicator */}
                        <div className="text-center py-3 text-white/50">
                          <button
                            onClick={() => setShowPaywall(true)}
                            className="hover:text-white transition-colors"
                          >
                            + {Math.floor(Math.random() * 20) + 10} more songs in this section
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Upgrade CTA */}
            <div className="mt-12 glass-card rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Customize Everything
              </h3>
              <p className="text-white/70 mb-6">
                Don't like a song? Change it. Want more country? Tell our AI. Export to Spotify in one click.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <Unlock className="w-5 h-5 text-green-500" />
                  <span className="text-white/80">Unlimited changes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-green-500" />
                  <span className="text-white/80">Spotify export</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-500" />
                  <span className="text-white/80">AI DJ chat</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-500" />
                  <span className="text-white/80">Guest requests</span>
                </div>
              </div>

              <div className="mb-6 p-4 bg-white/5 rounded-lg">
                <p className="text-sm text-white/60 mb-2">What couples spend on wedding music:</p>
                <div className="space-y-1">
                  <p className="text-white/40">Real DJ: $1,500+</p>
                  <p className="text-white/40">DIY: 40 hours of your time</p>
                  <p className="text-purple-400 font-bold">Uptune: $39 (today only, usually $59)</p>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button className="btn-secondary px-8">
                  Start Free Trial
                </button>
                <button className="btn-primary px-8 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Buy Now - $39
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowPaywall(false)} />
          <div className="relative glass-card rounded-xl p-8 max-w-md w-full">
            <button
              onClick={() => setShowPaywall(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-4">
              Unlock Full Customization
            </h2>
            <p className="text-white/60 mb-6">
              To change songs, export to Spotify, or customize your playlist, upgrade to the full version.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-white/80">Change any song</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-white/80">Export to Spotify</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-white/80">AI DJ assistance</span>
              </div>
            </div>
            
            <button className="w-full btn-primary">
              Upgrade Now - $39
            </button>
          </div>
        </div>
      )}
    </div>
  );
}