'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Music, 
  MapPin,
  Sparkles,
  Play,
  Pause,
  Plus,
  Check,
  ChevronDown,
  ChevronRight,
  Zap,
  Heart,
  Users,
  Volume2,
  Loader2,
  Search,
  X,
  Lock,
  TrendingUp,
  AlertTriangle,
  Download,
  Share2,
  UserPlus,
  BarChart3,
  Shuffle,
  Save,
  Clock,
  GripVertical
} from 'lucide-react';

// Complete song database
const COMPLETE_PLAYLIST = {
  'getting-ready': [
    { id: 'gr1', title: 'Sunday Morning', artist: 'Maroon 5', bpm: 90 },
    { id: 'gr2', title: 'Here Comes the Sun', artist: 'The Beatles', bpm: 129 },
    { id: 'gr3', title: 'Lovely Day', artist: 'Bill Withers', bpm: 98 },
    { id: 'gr4', title: 'Good Day Sunshine', artist: 'The Beatles', bpm: 126 },
    { id: 'gr5', title: 'Walking on Sunshine', artist: 'Katrina & The Waves', bpm: 109 },
    { id: 'gr6', title: 'Happy', artist: 'Pharrell Williams', bpm: 160 },
    { id: 'gr7', title: 'Beautiful Day', artist: 'U2', bpm: 136 },
  ],
  'ceremony': [
    { id: 'c1', title: 'Canon in D', artist: 'Pachelbel', label: 'Processional', bpm: 64 },
    { id: 'c2', title: 'A Thousand Years', artist: 'Christina Perri', label: 'Bride Entrance', bpm: 139 },
    { id: 'c3', title: 'Make You Feel My Love', artist: 'Adele', label: 'Signing', bpm: 72 },
    { id: 'c4', title: 'Signed, Sealed, Delivered', artist: 'Stevie Wonder', label: 'Recessional', bpm: 113 },
  ],
  'cocktails': [
    { id: 'ct1', title: 'Fly Me to the Moon', artist: 'Frank Sinatra', bpm: 116 },
    { id: 'ct2', title: 'Valerie', artist: 'Amy Winehouse', bpm: 123 },
    { id: 'ct3', title: 'Golden', artist: 'Harry Styles', bpm: 90 },
    { id: 'ct4', title: 'Dreams', artist: 'Fleetwood Mac', bpm: 120 },
    { id: 'ct5', title: 'Three Little Birds', artist: 'Bob Marley', bpm: 76 },
    { id: 'ct6', title: 'La Vie En Rose', artist: 'Édith Piaf', bpm: 72 },
    { id: 'ct7', title: 'Feeling Good', artist: 'Michael Bublé', bpm: 60 },
    { id: 'ct8', title: 'Somewhere Over the Rainbow', artist: 'Israel Kamakawiwoʻole', bpm: 90 },
    { id: 'ct9', title: 'Stand By Me', artist: 'Ben E. King', bpm: 120 },
    { id: 'ct10', title: 'Let\'s Stay Together', artist: 'Al Green', bpm: 100 },
  ],
  'dinner': [
    { id: 'd1', title: 'At Last', artist: 'Etta James', bpm: 95 },
    { id: 'd2', title: 'Wonderful Tonight', artist: 'Eric Clapton', bpm: 96 },
    { id: 'd3', title: 'Your Song', artist: 'Elton John', bpm: 70 },
    { id: 'd4', title: 'The Way You Look Tonight', artist: 'Tony Bennett', bpm: 116 },
    { id: 'd5', title: 'Thinking Out Loud', artist: 'Ed Sheeran', bpm: 80 },
    { id: 'd6', title: 'All of Me', artist: 'John Legend', bpm: 63 },
    { id: 'd7', title: 'Better Days', artist: 'OneRepublic', bpm: 73 },
    { id: 'd8', title: 'Sunday Morning', artist: 'The Velvet Underground', bpm: 96 },
  ],
  'first-dance': [
    { id: 'fd1', title: 'Perfect', artist: 'Ed Sheeran', bpm: 80 },
  ],
  'parent-dances': [
    { id: 'pd1', title: 'My Girl', artist: 'The Temptations', label: 'Father-Daughter', bpm: 132 },
    { id: 'pd2', title: 'Isn\'t She Lovely', artist: 'Stevie Wonder', label: 'Father-Daughter Alt', bpm: 125 },
    { id: 'pd3', title: 'A Song for Mama', artist: 'Boyz II Men', label: 'Mother-Son', bpm: 79 },
    { id: 'pd4', title: 'Simple Man', artist: 'Lynyrd Skynyrd', label: 'Mother-Son Alt', bpm: 60 },
  ],
  'party': [
    { id: 'p1', title: 'September', artist: 'Earth, Wind & Fire', bpm: 122 },
    { id: 'p2', title: 'Uptown Funk', artist: 'Bruno Mars', bpm: 128 },
    { id: 'p3', title: 'Mr. Brightside', artist: 'The Killers', bpm: 148 },
    { id: 'p4', title: 'Shut Up and Dance', artist: 'Walk the Moon', bpm: 135 },
    { id: 'p5', title: 'Can\'t Stop the Feeling', artist: 'Justin Timberlake', bpm: 113 },
    { id: 'p6', title: 'I Wanna Dance with Somebody', artist: 'Whitney Houston', bpm: 118 },
    { id: 'p7', title: 'Dancing Queen', artist: 'ABBA', bpm: 101 },
    { id: 'p8', title: 'Sweet Caroline', artist: 'Neil Diamond', bpm: 128 },
    { id: 'p9', title: 'Don\'t Stop Believin\'', artist: 'Journey', bpm: 119 },
    { id: 'p10', title: 'Wonderwall', artist: 'Oasis', bpm: 89 },
    { id: 'p11', title: 'Hey Ya!', artist: 'OutKast', bpm: 80 },
    { id: 'p12', title: 'Crazy in Love', artist: 'Beyoncé', bpm: 99 },
  ],
  'last-dance': [
    { id: 'ld1', title: 'Time of Your Life', artist: 'Green Day', bpm: 95 },
    { id: 'ld2', title: 'Closing Time', artist: 'Semisonic', bpm: 92 },
    { id: 'ld3', title: 'New York, New York', artist: 'Frank Sinatra', bpm: 100 },
  ]
};

// Countries & regions
const COUNTRIES = {
  'UK': { flag: '🇬🇧', regions: ['London', 'Manchester', 'Birmingham', 'Scotland'] },
  'US': { flag: '🇺🇸', regions: ['Northeast', 'South', 'West Coast', 'Midwest'] },
  'Australia': { flag: '🇦🇺', regions: ['Sydney', 'Melbourne', 'Brisbane', 'Perth'] },
  'Canada': { flag: '🇨🇦', regions: ['Toronto', 'Vancouver', 'Montreal', 'Calgary'] },
};

// Genres
const GENRES = [
  { id: 'pop', label: 'Pop', emoji: '🎵' },
  { id: 'rock', label: 'Rock', emoji: '🎸' },
  { id: 'indie', label: 'Indie', emoji: '🎤' },
  { id: 'rnb', label: 'R&B', emoji: '💜' },
  { id: 'country', label: 'Country', emoji: '🤠' },
  { id: 'electronic', label: 'Electronic', emoji: '🎹' },
];

export default function V3ThreePanePage() {
  // State
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['pop', 'rnb']);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Initialize timeline
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
  const totalSongs = timeline.reduce((sum, moment) => sum + (moment.songs?.length || 0), 0);
  const totalHours = 8;
  
  // AI Analysis
  const runAIAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const results = {
        bpmJumps: 12,
        energyDrops: 3,
        genreClashes: 5,
        suggestions: [
          'Add transition song between Ceremony and Cocktails',
          'BPM jump from 64 to 139 in Ceremony needs smoothing',
          'Energy drop after Mr. Brightside might clear dance floor'
        ]
      };
      setAnalysisResults(results);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen dark-gradient relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-purple w-96 h-96 -top-48 -right-48"></div>
        <div className="orb orb-blue w-96 h-96 -bottom-48 -left-48"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass-darker backdrop-blur-md border-b border-white/10">
        <div className="container-fluid px-4">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Uptune</h1>
              </div>
            </Link>
            
            <div className="flex items-center gap-2">
              <div className="text-sm text-white/60">
                {totalSongs} songs • {totalHours} hours
              </div>
              <button
                onClick={() => setShowAccountModal(true)}
                className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm rounded-lg hover:opacity-90"
              >
                Save Playlist
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Three-Pane Layout */}
      <div className="flex h-[calc(100vh-3.5rem)] relative z-10">
        
        {/* LEFT PANE: Customization */}
        <div className="w-80 glass-darker border-r border-white/10 overflow-y-auto p-4 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-white/50 uppercase mb-3">Customize</h2>
          </div>
          
          {/* Location */}
          <div className="glass-card rounded-lg p-4">
            <h3 className="font-medium text-white mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-400" />
              Location
            </h3>
            <select 
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm mb-2"
              value={selectedCountry || ''}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="">Select country</option>
              {Object.entries(COUNTRIES).map(([country, data]) => (
                <option key={country} value={country}>
                  {data.flag} {country}
                </option>
              ))}
            </select>
            {selectedCountry && (
              <select 
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                value={selectedRegion || ''}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                <option value="">Select region</option>
                {COUNTRIES[selectedCountry as keyof typeof COUNTRIES].regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            )}
          </div>
          
          {/* Genres */}
          <div className="glass-card rounded-lg p-4">
            <h3 className="font-medium text-white mb-3 flex items-center gap-2">
              <Heart className="w-4 h-4 text-purple-400" />
              Music Taste
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {GENRES.map(genre => (
                <button
                  key={genre.id}
                  onClick={() => {
                    setSelectedGenres(prev => 
                      prev.includes(genre.id)
                        ? prev.filter(g => g !== genre.id)
                        : [...prev, genre.id]
                    );
                  }}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedGenres.includes(genre.id)
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <span className="mr-1">{genre.emoji}</span>
                  {genre.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Quick Add Songs */}
          <div className="glass-card rounded-lg p-4">
            <h3 className="font-medium text-white mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-purple-400" />
              Quick Add
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search for songs..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/40"
              />
            </div>
            <p className="text-xs text-white/40 mt-2">
              Type to search our 10,000+ song library
            </p>
          </div>
          
          {/* Stats */}
          <div className="glass-card rounded-lg p-4 bg-gradient-to-r from-purple-600/10 to-pink-600/10">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Total songs</span>
                <span className="text-white font-medium">{totalSongs}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Duration</span>
                <span className="text-white font-medium">{totalHours} hours</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Customized</span>
                <span className="text-white font-medium">
                  {selectedRegion ? `✓ ${selectedRegion}` : 'Not yet'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE PANE: Timeline (The Hero) */}
        <div className="flex-1 overflow-y-auto bg-black/20">
          {/* Timeline Header */}
          <div className="sticky top-0 glass-darker backdrop-blur-md border-b border-white/10 px-6 py-4 z-10">
            <h2 className="text-2xl font-bold text-white">YOUR WEDDING TIMELINE</h2>
            <p className="text-sm text-white/60">Drag songs between moments • Click to preview • Everything customizable</p>
          </div>
          
          {/* Timeline Content */}
          <div className="p-6 space-y-6">
            {timeline.map((moment) => (
              <div key={moment.id} className="glass-card rounded-xl p-6">
                {/* Moment Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{moment.emoji}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white">{moment.title}</h3>
                      <p className="text-sm text-white/60">
                        {moment.time} • {moment.duration} • {moment.songs?.length || 0} songs
                      </p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Plus className="w-5 h-5 text-white/60" />
                  </button>
                </div>
                
                {/* Songs List - ALL VISIBLE */}
                <div className="space-y-2">
                  {moment.songs?.map((song: any, idx: number) => (
                    <div 
                      key={song.id}
                      className="group flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all cursor-move"
                      draggable
                      onDragStart={() => setIsDragging(true)}
                      onDragEnd={() => setIsDragging(false)}
                    >
                      <GripVertical className="w-4 h-4 text-white/30 group-hover:text-white/60" />
                      <span className="text-white/40 text-sm w-6">{idx + 1}</span>
                      <div className="flex-1">
                        <p className="font-medium text-white">
                          {song.label && <span className="text-xs text-white/50 mr-2">{song.label}:</span>}
                          {song.title}
                        </p>
                        <p className="text-sm text-white/60">
                          {song.artist}
                          {song.bpm && <span className="ml-2 text-xs text-white/40">• {song.bpm} BPM</span>}
                        </p>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/10 rounded transition-all">
                        <Play className="w-4 h-4 text-white/60" />
                      </button>
                      <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/10 rounded transition-all">
                        <X className="w-4 h-4 text-white/60" />
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* Drop Zone */}
                {isDragging && (
                  <div className="mt-2 p-4 border-2 border-dashed border-purple-500/50 rounded-lg text-center">
                    <p className="text-sm text-purple-400">Drop song here</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANE: Studio */}
        <div className="w-80 glass-darker border-l border-white/10 overflow-y-auto p-4 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-white/50 uppercase mb-3">Studio</h2>
          </div>
          
          {/* AI Analysis */}
          <div className="glass-card rounded-lg p-4">
            <h3 className="font-medium text-white mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              AI Analysis
            </h3>
            
            {!analysisResults ? (
              <button
                onClick={runAIAnalysis}
                disabled={isAnalyzing}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Analyze Playlist
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                    <span className="text-sm font-medium text-white">Issues Found</span>
                  </div>
                  <ul className="text-xs text-white/70 space-y-1">
                    <li>• {analysisResults.bpmJumps} BPM jumps</li>
                    <li>• {analysisResults.energyDrops} energy drops</li>
                    <li>• {analysisResults.genreClashes} genre clashes</li>
                  </ul>
                </div>
                <button 
                  onClick={() => setShowUpgradeModal(true)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium"
                >
                  Fix with AI ($25)
                </button>
              </div>
            )}
            
            {analysisResults && (
              <button
                onClick={() => {
                  setAnalysisResults(null);
                }}
                className="w-full mt-2 text-xs text-white/50 hover:text-white/70"
              >
                Run new analysis
              </button>
            )}
          </div>
          
          {/* Export Options */}
          <div className="glass-card rounded-lg p-4">
            <h3 className="font-medium text-white mb-3 flex items-center gap-2">
              <Download className="w-4 h-4 text-purple-400" />
              Export
            </h3>
            <div className="space-y-2">
              <button 
                onClick={() => setShowAccountModal(true)}
                className="w-full px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 flex items-center justify-center gap-2 text-sm"
              >
                <Music className="w-4 h-4" />
                Export to Spotify
              </button>
              <button className="w-full px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 flex items-center justify-center gap-2 text-sm">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
          
          {/* Collaborate */}
          <div className="glass-card rounded-lg p-4">
            <h3 className="font-medium text-white mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              Collaborate
            </h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 flex items-center justify-center gap-2 text-sm">
                <UserPlus className="w-4 h-4" />
                Invite Partner
              </button>
              <button className="w-full px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 flex items-center justify-center gap-2 text-sm">
                <Share2 className="w-4 h-4" />
                Guest Requests
              </button>
            </div>
            <p className="text-xs text-white/40 mt-2">
              Pro feature • Upgrade to enable
            </p>
          </div>
          
          {/* Pro Features */}
          <div className="glass-card rounded-lg p-4 bg-gradient-to-r from-purple-600/10 to-pink-600/10">
            <h3 className="font-medium text-white mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              Pro Features
            </h3>
            <ul className="text-sm text-white/70 space-y-2">
              <li className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-white/40" />
                AI BPM matching
              </li>
              <li className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-white/40" />
                Energy optimization
              </li>
              <li className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-white/40" />
                Unlimited saves
              </li>
              <li className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-white/40" />
                Guest requests
              </li>
            </ul>
            <button 
              onClick={() => setShowUpgradeModal(true)}
              className="w-full mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
            >
              Upgrade to Pro • $25
            </button>
          </div>
        </div>
      </div>

      {/* Account Modal */}
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
              Save Your Playlist
            </h2>
            <p className="text-white/70 mb-6">
              Create a free account to save your {totalSongs} songs and continue customizing.
            </p>
            
            <div className="space-y-4 mb-6">
              <button className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100">
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
              Unlock Pro Features
            </h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span className="text-white">AI fixes all {analysisResults?.bpmJumps || 0} BPM jumps</span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-purple-400" />
                <span className="text-white">Perfect energy flow guaranteed</span>
              </div>
              <div className="flex items-center gap-3">
                <Music className="w-5 h-5 text-purple-400" />
                <span className="text-white">Export directly to Spotify</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-purple-400" />
                <span className="text-white">Guest request system</span>
              </div>
              <div className="flex items-center gap-3">
                <Save className="w-5 h-5 text-purple-400" />
                <span className="text-white">Unlimited saves & versions</span>
              </div>
            </div>
            
            <div className="text-center mb-6">
              <p className="text-3xl font-bold text-white">$25</p>
              <p className="text-sm text-white/60">One-time payment • Lifetime access</p>
            </div>
            
            <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90">
              Upgrade to Pro
            </button>
            
            <p className="text-xs text-white/50 text-center mt-4">
              30-day money back guarantee • Instant access
            </p>
          </div>
        </div>
      )}
    </div>
  );
}