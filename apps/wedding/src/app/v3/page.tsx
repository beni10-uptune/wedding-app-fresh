'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Music, 
  ChevronRight, 
  MapPin,
  Sparkles,
  Play,
  Pause,
  Globe,
  Plus,
  X,
  Check,
  Clock,
  Users,
  Headphones,
  MessageSquare,
  Loader2,
  RefreshCw,
  Volume2,
  Mail,
  ChevronDown,
  Zap,
  Heart,
  Cake,
  Mic,
  PartyPopper,
  Moon
} from 'lucide-react';

// Timeline moments with default songs - THE COMPLETE WEDDING DAY
const DEFAULT_TIMELINE = [
  {
    id: 'getting-ready',
    time: '2:00 PM',
    duration: '30 min',
    title: 'Getting Ready',
    emoji: '💄',
    icon: <Heart className="w-4 h-4" />,
    songs: [
      { id: '1', title: 'Sunday Morning', artist: 'Maroon 5' },
      { id: '2', title: 'Here Comes the Sun', artist: 'Beatles' },
      { id: '3', title: 'Lovely Day', artist: 'Bill Withers' },
    ],
    expanded: false
  },
  {
    id: 'ceremony',
    time: '3:00 PM',
    duration: '20 min',
    title: 'Ceremony',
    emoji: '💒',
    icon: <Heart className="w-4 h-4" />,
    songs: [
      { id: '4', title: 'Canon in D', artist: 'Pachelbel', label: 'Processional' },
      { id: '5', title: 'A Thousand Years', artist: 'Christina Perri', label: 'Bride Entrance' },
      { id: '6', title: 'Make You Feel My Love', artist: 'Adele', label: 'Signing' },
      { id: '7', title: 'Signed, Sealed, Delivered', artist: 'Stevie Wonder', label: 'Recessional' },
    ],
    expanded: false
  },
  {
    id: 'cocktails',
    time: '3:30 PM',
    duration: '90 min',
    title: 'Cocktails',
    emoji: '🥂',
    icon: <Globe className="w-4 h-4" />,
    songs: [
      { id: '8', title: 'Fly Me to the Moon', artist: 'Frank Sinatra' },
      { id: '9', title: 'Valerie', artist: 'Amy Winehouse' },
      { id: '10', title: 'Golden', artist: 'Harry Styles' },
      { id: '11', title: 'Dreams', artist: 'Fleetwood Mac' },
      { id: '12', title: 'Three Little Birds', artist: 'Bob Marley' },
    ],
    moreCount: 22,
    expanded: false
  },
  {
    id: 'dinner',
    time: '5:00 PM',
    duration: '90 min',
    title: 'Dinner',
    emoji: '🍽️',
    icon: <Globe className="w-4 h-4" />,
    songs: [
      { id: '13', title: 'At Last', artist: 'Etta James' },
      { id: '14', title: 'Wonderful Tonight', artist: 'Eric Clapton' },
      { id: '15', title: 'Your Song', artist: 'Elton John' },
      { id: '16', title: 'The Way You Look Tonight', artist: 'Tony Bennett' },
    ],
    moreCount: 20,
    expanded: false
  },
  {
    id: 'speeches',
    time: '6:30 PM',
    duration: '30 min',
    title: 'Speeches & Cake',
    emoji: '🎤',
    icon: <Cake className="w-4 h-4" />,
    songs: [
      { id: '17', title: 'How Sweet It Is', artist: 'James Taylor' },
      { id: '18', title: 'L-O-V-E', artist: 'Nat King Cole' },
      { id: '19', title: 'Sugar', artist: 'Maroon 5' },
    ],
    moreCount: 5,
    expanded: false
  },
  {
    id: 'first-dance',
    time: '7:00 PM',
    duration: '5 min',
    title: 'First Dance',
    emoji: '💕',
    icon: <Heart className="w-4 h-4" />,
    songs: [
      { id: '20', title: 'Perfect', artist: 'Ed Sheeran' },
    ],
    expanded: false
  },
  {
    id: 'parent-dances',
    time: '7:05 PM',
    duration: '10 min',
    title: 'Parent Dances',
    emoji: '👨‍👩‍👧',
    icon: <Users className="w-4 h-4" />,
    songs: [
      { id: '21', title: 'My Girl', artist: 'The Temptations' },
      { id: '22', title: "Isn't She Lovely", artist: 'Stevie Wonder' },
    ],
    expanded: false
  },
  {
    id: 'party-time',
    time: '7:15 PM',
    duration: '3 hours',
    title: 'Party Time',
    emoji: '🎉',
    icon: <PartyPopper className="w-4 h-4" />,
    songs: [
      { id: '23', title: 'September', artist: 'Earth, Wind & Fire', phase: 'Building Energy' },
      { id: '24', title: 'Uptown Funk', artist: 'Bruno Mars', phase: 'Building Energy' },
      { id: '25', title: 'Mr. Brightside', artist: 'The Killers', phase: 'Peak Party' },
      { id: '26', title: 'Shut Up and Dance', artist: 'Walk the Moon', phase: 'Peak Party' },
      { id: '27', title: "Can't Stop the Feeling", artist: 'Justin Timberlake', phase: 'Peak Party' },
      { id: '28', title: 'Sweet Caroline', artist: 'Neil Diamond', phase: 'Wind Down' },
      { id: '29', title: 'Wonderwall', artist: 'Oasis', phase: 'Wind Down' },
    ],
    moreCount: 35,
    expanded: false
  },
  {
    id: 'last-dance',
    time: '10:30 PM',
    duration: '5 min',
    title: 'Last Dance',
    emoji: '🌙',
    icon: <Moon className="w-4 h-4" />,
    songs: [
      { id: '30', title: 'Time of Your Life', artist: 'Green Day' },
    ],
    expanded: false
  }
];

// UK regional transformations
const UK_REGIONAL_SONGS = {
  'north-england': {
    cocktails: [
      { id: 'uk1', title: 'There She Goes', artist: "The La's" },
      { id: 'uk2', title: 'Sit Down', artist: 'James' },
      { id: 'uk3', title: 'This Charming Man', artist: 'The Smiths' },
    ],
    party: [
      { id: 'uk4', title: 'Mr. Brightside', artist: 'The Killers', note: 'Manchester anthem' },
      { id: 'uk5', title: 'Wonderwall', artist: 'Oasis' },
      { id: 'uk6', title: 'Chelsea Dagger', artist: 'The Fratellis', note: 'Northern favorite' },
    ]
  },
  'london': {
    cocktails: [
      { id: 'l1', title: 'Waterloo Sunset', artist: 'The Kinks' },
      { id: 'l2', title: 'London Calling', artist: 'The Clash' },
    ],
    party: [
      { id: 'l3', title: 'Blue Monday', artist: 'New Order' },
      { id: 'l4', title: 'Pump It Up', artist: 'Elvis Costello' },
    ]
  }
};

export default function V3TrueVisionPage() {
  // Core state
  const [timeline, setTimeline] = useState(DEFAULT_TIMELINE);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [mustPlaySongs, setMustPlaySongs] = useState<string[]>(['']);
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [customInstructions, setCustomInstructions] = useState('');
  const [email, setEmail] = useState('');
  
  // UI state
  const [transforming, setTransforming] = useState(false);
  const [expandedMoments, setExpandedMoments] = useState<string[]>([]);
  const [totalSongs, setTotalSongs] = useState(152);
  const [totalDuration, setTotalDuration] = useState(8);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isLoadingReal, setIsLoadingReal] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  
  // Load real timeline from database on mount
  useEffect(() => {
    const loadRealTimeline = async () => {
      setIsLoadingReal(true);
      try {
        const response = await fetch('/api/v3/timeline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.timeline) {
            // Convert API timeline to our format
            const formattedTimeline = data.timeline.map((moment: any) => ({
              ...DEFAULT_TIMELINE.find(d => d.id === moment.id),
              songs: moment.songs.map((s: any) => ({
                id: s.id,
                title: s.title,
                artist: s.artist,
                previewUrl: s.previewUrl
              })),
              moreCount: moment.moreCount
            }));
            setTimeline(formattedTimeline);
            setTotalSongs(data.totalSongs || 152);
          }
        }
      } catch (error) {
        console.error('Failed to load real timeline:', error);
      } finally {
        setIsLoadingReal(false);
      }
    };
    
    loadRealTimeline();
  }, []);
  
  // Calculate stats when timeline changes
  useEffect(() => {
    const songs = timeline.reduce((total, moment) => {
      return total + moment.songs.length + (moment.moreCount || 0);
    }, 0);
    setTotalSongs(songs);
  }, [timeline]);

  // Handle region selection with real API transformation
  const handleRegionSelect = async (region: string) => {
    setTransforming(true);
    setSelectedRegion(region);
    
    try {
      // Get regional songs from API
      const response = await fetch('/api/v3/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          region, 
          moment: 'cocktails' 
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.songs && data.songs.length > 0) {
          // Update timeline with regional songs
          setTimeline(prev => prev.map(moment => {
            if (moment.id === 'cocktails' || moment.id === 'party-time') {
              return {
                ...moment,
                songs: [...data.songs.slice(0, 3), ...moment.songs.slice(3)]
              };
            }
            return moment;
          }));
        }
      }
    } catch (error) {
      console.error('Failed to get regional songs:', error);
      // Fallback to local transformation
      if (UK_REGIONAL_SONGS[region as keyof typeof UK_REGIONAL_SONGS]) {
        const regionalSongs = UK_REGIONAL_SONGS[region as keyof typeof UK_REGIONAL_SONGS];
        
        setTimeline(prev => prev.map(moment => {
          if (moment.id === 'cocktails' && regionalSongs.cocktails) {
            return {
              ...moment,
              songs: [...regionalSongs.cocktails, ...moment.songs.slice(3)]
            };
          }
          if (moment.id === 'party-time' && regionalSongs.party) {
            return {
              ...moment,
              songs: [...regionalSongs.party, ...moment.songs.slice(3)]
            };
          }
          return moment;
        }));
      }
    } finally {
      setTimeout(() => setTransforming(false), 800);
    }
  };

  // Handle must-play songs
  const handleMustPlayChange = (index: number, value: string) => {
    const updated = [...mustPlaySongs];
    updated[index] = value;
    setMustPlaySongs(updated);
    
    // Update first dance if first must-play
    if (index === 0 && value) {
      setTimeline(prev => prev.map(moment => {
        if (moment.id === 'first-dance') {
          return {
            ...moment,
            songs: [{ id: 'custom1', title: value.split(' - ')[0] || value, artist: value.split(' - ')[1] || 'Your Choice' }]
          };
        }
        return moment;
      }));
    }
  };

  // Toggle moment expansion
  const toggleMoment = (momentId: string) => {
    setExpandedMoments(prev =>
      prev.includes(momentId)
        ? prev.filter(id => id !== momentId)
        : [...prev, momentId]
    );
  };
  
  // Handle song preview
  const handlePlayPreview = (songId: string, previewUrl?: string) => {
    // If clicking same song that's playing, pause it
    if (currentlyPlaying === songId) {
      if (audioRef) {
        audioRef.pause();
        audioRef.currentTime = 0;
      }
      setCurrentlyPlaying(null);
      return;
    }
    
    // Stop any current preview
    if (audioRef) {
      audioRef.pause();
      audioRef.currentTime = 0;
    }
    
    // If no preview URL, show message
    if (!previewUrl) {
      console.log('No preview available for this song');
      return;
    }
    
    // Play new preview
    const audio = new Audio(previewUrl);
    audio.volume = 0.5;
    
    audio.play().catch(err => {
      console.error('Failed to play preview:', err);
    });
    
    // Auto-stop after 30 seconds or when ended
    audio.addEventListener('ended', () => {
      setCurrentlyPlaying(null);
    });
    
    setAudioRef(audio);
    setCurrentlyPlaying(songId);
  };
  
  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef) {
        audioRef.pause();
      }
    };
  }, [audioRef]);
  
  // Update playlist with AI when custom instructions change
  const updateWithAI = async () => {
    setTransforming(true);
    try {
      const response = await fetch('/api/v3/timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          region: selectedRegion,
          mustPlaySongs: mustPlaySongs.filter(s => s.trim()),
          spotifyUrl,
          customInstructions,
          genres: []
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.timeline) {
          // Update with AI-enhanced timeline
          const formattedTimeline = data.timeline.map((moment: any) => ({
            ...DEFAULT_TIMELINE.find(d => d.id === moment.id),
            songs: moment.songs.map((s: any) => ({
              id: s.id,
              title: s.title,
              artist: s.artist,
              previewUrl: s.previewUrl,
              aiRecommended: s.aiRecommended
            })),
            moreCount: moment.moreCount
          }));
          setTimeline(formattedTimeline);
          setTotalSongs(data.totalSongs || 152);
        }
      }
    } catch (error) {
      console.error('AI update failed:', error);
    } finally {
      setTransforming(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Uptune 3.0</h1>
                <p className="text-xs text-gray-500">AI Wedding Music</p>
              </div>
            </Link>
            
            <div className="flex items-center gap-4">
              {currentlyPlaying && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full animate-pulse">
                  <Volume2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-green-700 dark:text-green-300">
                    Preview playing...
                  </span>
                </div>
              )}
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm text-purple-700 dark:text-purple-300">
                  {totalSongs} songs • {totalDuration} hours
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Message */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Here's your wedding day. Let's make the music perfect.
          </h1>
          <p className="text-lg opacity-90">
            This is a complete {totalSongs}-song wedding playlist. Watch it transform as you personalize.
          </p>
        </div>
      </div>

      {/* Main 2-Pane Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT PANE - Personalization Inputs */}
          <div className="lg:col-span-1 space-y-6">
            {/* Region Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-600" />
                Where's your wedding?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                This changes EVERYTHING - watch your playlist transform
              </p>
              
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">UK Regions</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['North England', 'London', 'Scotland', 'Wales'].map(region => (
                      <button
                        key={region}
                        onClick={() => handleRegionSelect(region.toLowerCase().replace(' ', '-'))}
                        className={`px-3 py-2 text-sm rounded-lg transition-all ${
                          selectedRegion === region.toLowerCase().replace(' ', '-')
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">US Regions</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['Northeast', 'South', 'West Coast', 'Midwest'].map(region => (
                      <button
                        key={region}
                        onClick={() => handleRegionSelect(region.toLowerCase().replace(' ', '-'))}
                        className={`px-3 py-2 text-sm rounded-lg transition-all ${
                          selectedRegion === region.toLowerCase().replace(' ', '-')
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {selectedRegion && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    ✓ Added 23 regional favorites!
                  </p>
                </div>
              )}
            </div>

            {/* Must-Play Songs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-lg mb-4">
                Your must-play songs
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Your first song becomes your first dance
              </p>
              
              {mustPlaySongs.map((song, index) => (
                <div key={index} className="mb-3">
                  <input
                    type="text"
                    value={song}
                    onChange={(e) => handleMustPlayChange(index, e.target.value)}
                    placeholder="e.g., Perfect - Ed Sheeran"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700"
                  />
                </div>
              ))}
              
              <button
                onClick={() => setMustPlaySongs([...mustPlaySongs, ''])}
                className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add another song
              </button>
            </div>

            {/* Spotify Integration */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-lg mb-4">
                Share your music taste
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Paste a Spotify playlist URL to transform everything
              </p>
              
              <input
                type="text"
                value={spotifyUrl}
                onChange={(e) => setSpotifyUrl(e.target.value)}
                placeholder="spotify.com/playlist/..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 mb-3"
              />
              
              {spotifyUrl && (
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    <Zap className="w-4 h-4 inline mr-1" />
                    Analyzing your taste...
                  </p>
                </div>
              )}
            </div>

            {/* Custom Instructions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-lg mb-4">
                Special requests
              </h3>
              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                onBlur={() => {
                  // Trigger AI update when user finishes typing
                  if (customInstructions.length > 10) {
                    updateWithAI();
                  }
                }}
                placeholder="e.g., We love 90s R&B, avoid country music, include some Bollywood..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700"
              />
              {customInstructions.length > 0 && (
                <p className="text-xs text-purple-600 mt-2">
                  <Zap className="w-3 h-3 inline mr-1" />
                  AI will update your playlist when you finish typing
                </p>
              )}
            </div>

            {/* Save Section */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="font-semibold text-lg mb-2">
                Save your perfect playlist
              </h3>
              <p className="text-sm opacity-90 mb-4">
                Don't lose your customizations
              </p>
              
              <button
                onClick={() => setShowSaveModal(true)}
                className="w-full bg-white text-purple-600 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Customize Every Detail →
              </button>
            </div>
          </div>

          {/* RIGHT PANE - Live Timeline */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  YOUR WEDDING TIMELINE
                </h2>
                {transforming && (
                  <div className="flex items-center gap-2 text-purple-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Transforming...</span>
                  </div>
                )}
              </div>

              {/* Timeline */}
              {isLoadingReal && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-600">Loading real wedding songs from our database...</p>
                  </div>
                </div>
              )}
              
              {!isLoadingReal && (
              <div className="space-y-4">
                {timeline.map((moment) => (
                  <div 
                    key={moment.id} 
                    className={`border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-all ${
                      transforming && (moment.id === 'cocktails' || moment.id === 'party-time') 
                        ? 'ring-2 ring-purple-500 ring-opacity-50' 
                        : ''
                    }`}
                  >
                    <button
                      onClick={() => toggleMoment(moment.id)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{moment.emoji}</span>
                        <div className="text-left">
                          <div className="font-semibold flex items-center gap-2">
                            {moment.title}
                            {moment.id === 'first-dance' && mustPlaySongs[0] && (
                              <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">
                                Customized
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {moment.time} • {moment.duration} • {moment.songs.length + (moment.moreCount || 0)} songs
                          </div>
                        </div>
                      </div>
                      <ChevronDown 
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          expandedMoments.includes(moment.id) ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    {expandedMoments.includes(moment.id) && (
                      <div className="px-4 pb-4">
                        <div className="space-y-2">
                          {moment.songs.map((song, idx) => (
                            <div 
                              key={song.id} 
                              className={`flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 ${
                                transforming && 'note' in song && (song as any).note ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-gray-400 text-sm w-6">{idx + 1}</span>
                                <div>
                                  <p className="font-medium">
                                    {'label' in song && (song as any).label && <span className="text-xs text-gray-500 mr-2">{(song as any).label}:</span>}
                                    {'phase' in song && (song as any).phase && <span className="text-xs text-gray-500 mr-2">[{(song as any).phase}]</span>}
                                    {song.title}
                                  </p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {song.artist}
                                    {'note' in song && (song as any).note && <span className="ml-2 text-purple-600">• {(song as any).note}</span>}
                                  </p>
                                </div>
                              </div>
                              <button 
                                onClick={() => handlePlayPreview(song.id, 'previewUrl' in song ? (song as any).previewUrl : undefined)}
                                className={`p-2 rounded-lg transition-all ${
                                  currentlyPlaying === song.id 
                                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' 
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-400'
                                }`}
                                title={currentlyPlaying === song.id ? 'Pause preview' : 'Play preview'}
                              >
                                {currentlyPlaying === song.id ? (
                                  <Pause className="w-4 h-4" />
                                ) : (
                                  <Play className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          ))}
                          
                          {moment.moreCount && (
                            <div className="text-center py-2 text-gray-500">
                              <span className="text-sm">+{moment.moreCount} more songs</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              )}

              {/* Bottom Message */}
              <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg text-center">
                <p className="text-purple-700 dark:text-purple-300 font-medium">
                  This is a good wedding playlist. You're making it YOURS.
                </p>
                <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                  Every change updates instantly • No signup required to explore
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Save Your Perfect Playlist</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Don't lose your {totalSongs} customized songs. Create a free account to:
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" />
                <span>Save all customizations</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" />
                <span>Unlock detailed editing</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" />
                <span>Export to Spotify</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" />
                <span>Share with your DJ</span>
              </div>
            </div>
            
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 mb-4"
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Keep Exploring
              </button>
              <button className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90">
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}