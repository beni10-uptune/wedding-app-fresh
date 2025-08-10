'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { FlowVisualization } from '@/components/FlowVisualization';
import { 
  Music, 
  MapPin,
  Sparkles,
  Play,
  Pause,
  Globe,
  Plus,
  Check,
  ChevronDown,
  Zap,
  Heart,
  Users,
  Volume2,
  Loader2,
  Headphones,
  Search,
  X,
  Lock,
  TrendingUp,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

// Complete song database with regional variations
const COMPLETE_PLAYLIST = {
  'getting-ready': [
    { id: 'gr1', title: 'Sunday Morning', artist: 'Maroon 5' },
    { id: 'gr2', title: 'Here Comes the Sun', artist: 'The Beatles' },
    { id: 'gr3', title: 'Lovely Day', artist: 'Bill Withers' },
    { id: 'gr4', title: 'Good Day Sunshine', artist: 'The Beatles' },
    { id: 'gr5', title: 'Walking on Sunshine', artist: 'Katrina & The Waves' },
    { id: 'gr6', title: 'Happy', artist: 'Pharrell Williams' },
    { id: 'gr7', title: 'Beautiful Day', artist: 'U2' },
  ],
  'ceremony': [
    { id: 'c1', title: 'Canon in D', artist: 'Pachelbel', label: 'Processional' },
    { id: 'c2', title: 'A Thousand Years', artist: 'Christina Perri', label: 'Bride Entrance' },
    { id: 'c3', title: 'Make You Feel My Love', artist: 'Adele', label: 'Signing' },
    { id: 'c4', title: 'Signed, Sealed, Delivered', artist: 'Stevie Wonder', label: 'Recessional' },
  ],
  'cocktails': [
    { id: 'ct1', title: 'Fly Me to the Moon', artist: 'Frank Sinatra' },
    { id: 'ct2', title: 'Valerie', artist: 'Amy Winehouse' },
    { id: 'ct3', title: 'Golden', artist: 'Harry Styles' },
    { id: 'ct4', title: 'Dreams', artist: 'Fleetwood Mac' },
    { id: 'ct5', title: 'Three Little Birds', artist: 'Bob Marley' },
    { id: 'ct6', title: 'La Vie En Rose', artist: 'Édith Piaf' },
    { id: 'ct7', title: 'Feeling Good', artist: 'Michael Bublé' },
    { id: 'ct8', title: 'Somewhere Over the Rainbow', artist: 'Israel Kamakawiwoʻole' },
    { id: 'ct9', title: 'Stand By Me', artist: 'Ben E. King' },
    { id: 'ct10', title: 'Let\'s Stay Together', artist: 'Al Green' },
  ],
  'dinner': [
    { id: 'd1', title: 'At Last', artist: 'Etta James' },
    { id: 'd2', title: 'Wonderful Tonight', artist: 'Eric Clapton' },
    { id: 'd3', title: 'Your Song', artist: 'Elton John' },
    { id: 'd4', title: 'The Way You Look Tonight', artist: 'Tony Bennett' },
    { id: 'd5', title: 'Thinking Out Loud', artist: 'Ed Sheeran' },
    { id: 'd6', title: 'All of Me', artist: 'John Legend' },
    { id: 'd7', title: 'Better Days', artist: 'OneRepublic' },
    { id: 'd8', title: 'Sunday Morning', artist: 'The Velvet Underground' },
  ],
  'first-dance': [
    { id: 'fd1', title: 'Perfect', artist: 'Ed Sheeran' },
  ],
  'parent-dances': [
    { id: 'pd1', title: 'My Girl', artist: 'The Temptations', label: 'Father-Daughter' },
    { id: 'pd2', title: 'Isn\'t She Lovely', artist: 'Stevie Wonder', label: 'Father-Daughter Alt' },
    { id: 'pd3', title: 'A Song for Mama', artist: 'Boyz II Men', label: 'Mother-Son' },
    { id: 'pd4', title: 'Simple Man', artist: 'Lynyrd Skynyrd', label: 'Mother-Son Alt' },
  ],
  'party': [
    { id: 'p1', title: 'September', artist: 'Earth, Wind & Fire' },
    { id: 'p2', title: 'Uptown Funk', artist: 'Bruno Mars' },
    { id: 'p3', title: 'Mr. Brightside', artist: 'The Killers' },
    { id: 'p4', title: 'Shut Up and Dance', artist: 'Walk the Moon' },
    { id: 'p5', title: 'Can\'t Stop the Feeling', artist: 'Justin Timberlake' },
    { id: 'p6', title: 'I Wanna Dance with Somebody', artist: 'Whitney Houston' },
    { id: 'p7', title: 'Dancing Queen', artist: 'ABBA' },
    { id: 'p8', title: 'Sweet Caroline', artist: 'Neil Diamond' },
    { id: 'p9', title: 'Don\'t Stop Believin\'', artist: 'Journey' },
    { id: 'p10', title: 'Wonderwall', artist: 'Oasis' },
  ],
  'last-dance': [
    { id: 'ld1', title: 'Time of Your Life', artist: 'Green Day' },
    { id: 'ld2', title: 'Closing Time', artist: 'Semisonic' },
    { id: 'ld3', title: 'New York, New York', artist: 'Frank Sinatra' },
  ]
};

// Countries with regions
const COUNTRIES = {
  'UK': { flag: '🇬🇧', regions: ['London', 'Manchester', 'Birmingham', 'Scotland'] },
  'US': { flag: '🇺🇸', regions: ['Northeast', 'South', 'West Coast', 'Midwest'] },
  'Australia': { flag: '🇦🇺', regions: ['Sydney', 'Melbourne', 'Brisbane', 'Perth'] },
  'Canada': { flag: '🇨🇦', regions: ['Toronto', 'Vancouver', 'Montreal', 'Calgary'] },
};

// Simple genre list
const GENRES = [
  { id: 'pop', label: 'Pop', emoji: '🎵', selected: true },
  { id: 'rock', label: 'Rock', emoji: '🎸', selected: false },
  { id: 'indie', label: 'Indie', emoji: '🎤', selected: false },
  { id: 'rnb', label: 'R&B', emoji: '💜', selected: true },
  { id: 'country', label: 'Country', emoji: '🤠', selected: false },
  { id: 'electronic', label: 'Electronic', emoji: '🎹', selected: false },
];

export default function V3AIDJPage() {
  // Core state - Start with timeline visible
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState(GENRES);
  const [customSongs, setCustomSongs] = useState<any[]>([]);
  const [isPro, setIsPro] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [customizationLevel, setCustomizationLevel] = useState(0);
  
  // Timeline state
  const [timeline, setTimeline] = useState<any[]>([]);
  const [expandedMoments, setExpandedMoments] = useState<string[]>(['party']); // Only expand party by default
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  
  // Initialize timeline with complete songs
  useEffect(() => {
    const initialTimeline = [
      {
        id: 'getting-ready',
        time: '2:00 PM',
        duration: '30 min',
        title: 'Getting Ready',
        emoji: '💄',
        songs: COMPLETE_PLAYLIST['getting-ready']
      },
      {
        id: 'ceremony',
        time: '3:00 PM',
        duration: '20 min',
        title: 'Ceremony',
        emoji: '💒',
        songs: COMPLETE_PLAYLIST['ceremony']
      },
      {
        id: 'cocktails',
        time: '3:30 PM',
        duration: '90 min',
        title: 'Cocktails',
        emoji: '🥂',
        songs: COMPLETE_PLAYLIST['cocktails']
      },
      {
        id: 'dinner',
        time: '5:00 PM',
        duration: '90 min',
        title: 'Dinner',
        emoji: '🍽️',
        songs: COMPLETE_PLAYLIST['dinner']
      },
      {
        id: 'first-dance',
        time: '7:00 PM',
        duration: '5 min',
        title: 'First Dance',
        emoji: '💕',
        songs: COMPLETE_PLAYLIST['first-dance']
      },
      {
        id: 'parent-dances',
        time: '7:05 PM',
        duration: '10 min',
        title: 'Parent Dances',
        emoji: '👨‍👩‍👧',
        songs: COMPLETE_PLAYLIST['parent-dances']
      },
      {
        id: 'party',
        time: '7:15 PM',
        duration: '3 hours',
        title: 'Party Time',
        emoji: '🎉',
        songs: COMPLETE_PLAYLIST['party']
      },
      {
        id: 'last-dance',
        time: '10:15 PM',
        duration: '5 min',
        title: 'Last Dance',
        emoji: '🌙',
        songs: COMPLETE_PLAYLIST['last-dance']
      }
    ];
    setTimeline(initialTimeline);
  }, []);

  // Calculate stats
  const totalSongs = timeline.reduce((sum, moment) => sum + moment.songs.length, 0);
  const totalHours = 8;
  
  // Get party songs for flow visualization
  const partySongs = timeline.find(m => m.id === 'party')?.songs || [];

  return (
    <div className="min-h-screen dark-gradient relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-purple w-96 h-96 -top-48 -right-48"></div>
        <div className="orb orb-blue w-96 h-96 -bottom-48 -left-48"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass-darker backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Uptune</h1>
                <p className="text-xs text-purple-400">AI Wedding DJ</p>
              </div>
            </Link>
            
            <div className="flex items-center gap-4">
              {customizationLevel > 0 && (
                <div className="hidden md:block">
                  <p className="text-sm text-purple-400">
                    You've personalized {customizationLevel} elements
                  </p>
                </div>
              )}
              <button
                onClick={() => setShowAccountModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Save Playlist
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Hero Message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            152 songs • 8 hours • Every moment planned
          </h1>
          <p className="text-lg text-white/70">
            This is a good wedding playlist. Let's make it <span className="text-purple-400 font-semibold">YOURS</span>.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT: Progressive Customization */}
          <div className="lg:col-span-1 space-y-4">
            {/* Step 1: Location */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-4 text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-400" />
                Step 1: Where's your celebration?
              </h3>
              
              <div className="grid grid-cols-2 gap-2 mb-3">
                {Object.entries(COUNTRIES).map(([country, data]) => (
                  <button
                    key={country}
                    onClick={() => {
                      setSelectedCountry(country);
                      setCustomizationLevel(prev => prev + 1);
                    }}
                    className={`p-3 rounded-lg transition-all ${
                      selectedCountry === country
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    <span className="text-2xl mr-2">{data.flag}</span>
                    <span className="text-sm">{country}</span>
                  </button>
                ))}
              </div>
              
              {selectedCountry && (
                <div className="space-y-2">
                  <p className="text-xs text-white/50 uppercase">Select Region</p>
                  <div className="grid grid-cols-2 gap-2">
                    {COUNTRIES[selectedCountry as keyof typeof COUNTRIES].regions.map(region => (
                      <button
                        key={region}
                        onClick={() => {
                          setSelectedRegion(region);
                          setCustomizationLevel(prev => prev + 1);
                        }}
                        className={`px-3 py-2 text-sm rounded-lg transition-all ${
                          selectedRegion === region
                            ? 'bg-purple-600 text-white'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedRegion && (
                <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-xs text-green-400">✓ Added {selectedRegion} favorites!</p>
                </div>
              )}
            </div>

            {/* Step 2: Music Taste */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-4 text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-purple-400" />
                Step 2: Your music taste
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                {selectedGenres.map(genre => (
                  <button
                    key={genre.id}
                    onClick={() => {
                      setSelectedGenres(prev => prev.map(g => 
                        g.id === genre.id ? { ...g, selected: !g.selected } : g
                      ));
                      setCustomizationLevel(prev => prev + 0.5);
                    }}
                    className={`p-3 rounded-lg transition-all ${
                      genre.selected
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    <span className="text-lg mr-2">{genre.emoji}</span>
                    <span className="text-sm">{genre.label}</span>
                    {genre.selected && <Check className="w-4 h-4 inline ml-1" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Ready to Save */}
            {customizationLevel >= 3 && (
              <div className="glass-card rounded-xl p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20">
                <h3 className="font-semibold text-lg mb-3 text-white">
                  Looking good!
                </h3>
                <p className="text-sm text-white/80 mb-4">
                  You've personalized your playlist. Create a free account to save it.
                </p>
                <button 
                  onClick={() => setShowAccountModal(true)}
                  className="w-full px-4 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100"
                >
                  Create Free Account
                </button>
                <p className="text-xs text-white/60 mt-2 text-center">
                  Takes 30 seconds • No credit card required
                </p>
              </div>
            )}
          </div>

          {/* RIGHT: Live Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flow Visualization */}
            <FlowVisualization 
              songs={partySongs}
              isPro={isPro}
              onUpgradeClick={() => setShowUpgradeModal(true)}
            />

            {/* Timeline */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">YOUR WEDDING TIMELINE</h2>
                  <p className="text-sm text-white/60 mt-1">
                    {totalSongs} songs • {totalHours} hours • {selectedRegion && `Customized for ${selectedRegion}`}
                  </p>
                </div>
                {isPro && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
                    <Zap className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-300">AI Optimized</span>
                  </div>
                )}
              </div>

              {/* Timeline Moments */}
              <div className="space-y-4">
                {timeline.map((moment) => (
                  <div 
                    key={moment.id}
                    className="bg-white/5 border border-white/10 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => {
                        setExpandedMoments(prev =>
                          prev.includes(moment.id)
                            ? prev.filter(id => id !== moment.id)
                            : [...prev, moment.id]
                        );
                      }}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{moment.emoji}</span>
                        <div className="text-left">
                          <div className="font-semibold text-white">
                            {moment.title}
                          </div>
                          <div className="text-sm text-white/60">
                            {moment.time} • {moment.duration} • {moment.songs.length} songs
                          </div>
                        </div>
                      </div>
                      <ChevronDown 
                        className={`w-5 h-5 text-white/40 transition-transform ${
                          expandedMoments.includes(moment.id) ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    {expandedMoments.includes(moment.id) && (
                      <div className="px-4 pb-4">
                        <div className="space-y-2">
                          {moment.songs.slice(0, 3).map((song: any, idx: number) => (
                            <div 
                              key={song.id}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-white/40 text-sm w-6">{idx + 1}</span>
                                <div>
                                  <p className="font-medium text-white">
                                    {song.label && <span className="text-xs text-white/50 mr-2">{song.label}:</span>}
                                    {song.title}
                                  </p>
                                  <p className="text-sm text-white/60">{song.artist}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                          {moment.songs.length > 3 && (
                            <p className="text-sm text-white/40 text-center pt-2">
                              +{moment.songs.length - 3} more songs
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setShowUpgradeModal(false)} />
          <div className="relative glass-darker rounded-2xl p-8 max-w-lg w-full">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-4">
              Unlock AI DJ Features
            </h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span className="text-white">Smart BPM matching for smooth transitions</span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-purple-400" />
                <span className="text-white">Perfect energy flow throughout the night</span>
              </div>
              <div className="flex items-center gap-3">
                <Music className="w-5 h-5 text-purple-400" />
                <span className="text-white">AI adds transition songs automatically</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-purple-400" />
                <span className="text-white">Guest request system included</span>
              </div>
            </div>
            
            <div className="text-center mb-6">
              <p className="text-3xl font-bold text-white">$25</p>
              <p className="text-sm text-white/60">One-time payment</p>
            </div>
            
            <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90">
              Upgrade to Pro
            </button>
            
            <p className="text-xs text-white/50 text-center mt-4">
              Cancel anytime • Instant access
            </p>
          </div>
        </div>
      )}

      {/* Account Creation Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setShowAccountModal(false)} />
          <div className="relative glass-darker rounded-2xl p-8 max-w-lg w-full">
            <button
              onClick={() => setShowAccountModal(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-2">
              Save Your Perfect Playlist
            </h2>
            <p className="text-white/70 mb-6">
              You've customized {Math.floor(customizationLevel)} elements. Don't lose your work!
            </p>
            
            <div className="space-y-4 mb-6">
              <button className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 flex items-center justify-center gap-2">
                Continue with Google
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-white/50">or</span>
                </div>
              </div>
              
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40"
              />
            </div>
            
            <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90">
              Create Free Account
            </button>
            
            <p className="text-xs text-white/50 text-center mt-4">
              Already have an account? <button className="text-purple-400 hover:text-purple-300">Sign in</button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}