'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
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
  ChevronRight,
  Zap,
  Heart,
  Users,
  Calendar,
  Volume2,
  Loader2,
  Star,
  Gift,
  Shield,
  Crown,
  MessageCircle,
  Headphones,
  Search,
  X
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
    { id: 'pd5', title: 'Unforgettable', artist: 'Nat King Cole', label: 'Parent Dance' },
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
    { id: 'ld4', title: 'Don\'t Stop Me Now', artist: 'Queen' },
  ]
};

// Regional song preferences
const REGIONAL_SONGS = {
  'uk-london': {
    cocktails: [
      { id: 'uk1', title: 'Waterloo Sunset', artist: 'The Kinks', tag: 'London Classic' },
      { id: 'uk2', title: 'London Calling', artist: 'The Clash', tag: 'Local Anthem' }
    ],
    party: [
      { id: 'uk3', title: 'Common People', artist: 'Pulp', tag: 'Brit Classic' },
      { id: 'uk4', title: 'Parklife', artist: 'Blur', tag: 'London Favorite' }
    ]
  },
  'uk-manchester': {
    cocktails: [
      { id: 'man1', title: 'There She Goes', artist: 'The La\'s', tag: 'Manchester Sound' },
      { id: 'man2', title: 'This Charming Man', artist: 'The Smiths', tag: 'Local Heroes' }
    ],
    party: [
      { id: 'man3', title: 'Wonderwall', artist: 'Oasis', tag: 'Manchester Anthem' },
      { id: 'man4', title: 'Sit Down', artist: 'James', tag: 'Crowd Favorite' }
    ]
  },
  'us-northeast': {
    cocktails: [
      { id: 'ne1', title: 'Empire State of Mind', artist: 'Jay-Z ft. Alicia Keys', tag: 'NYC Anthem' },
      { id: 'ne2', title: 'Piano Man', artist: 'Billy Joel', tag: 'Long Island Legend' }
    ],
    party: [
      { id: 'ne3', title: 'Livin\' on a Prayer', artist: 'Bon Jovi', tag: 'Jersey Pride' },
      { id: 'ne4', title: 'Sweet Caroline', artist: 'Neil Diamond', tag: 'Boston Favorite' }
    ]
  },
  'us-south': {
    cocktails: [
      { id: 's1', title: 'Georgia', artist: 'Ray Charles', tag: 'Southern Soul' },
      { id: 's2', title: 'Tennessee Whiskey', artist: 'Chris Stapleton', tag: 'Modern Classic' }
    ],
    party: [
      { id: 's3', title: 'Wagon Wheel', artist: 'Darius Rucker', tag: 'Southern Anthem' },
      { id: 's4', title: 'Friends in Low Places', artist: 'Garth Brooks', tag: 'Country Classic' }
    ]
  }
};

// Genre definitions with emojis
const GENRES = {
  popular: [
    { id: 'pop', label: 'Pop', emoji: '🎵', selected: true },
    { id: 'rock', label: 'Rock', emoji: '🎸', selected: false },
    { id: 'indie', label: 'Indie', emoji: '🎤', selected: false },
    { id: 'electronic', label: 'Electronic', emoji: '🎹', selected: false },
    { id: 'rnb', label: 'R&B', emoji: '💜', selected: true },
    { id: 'country', label: 'Country', emoji: '🤠', selected: false },
  ],
  extended: [
    { id: 'jazz', label: 'Jazz', emoji: '🎺' },
    { id: 'soul', label: 'Soul', emoji: '💫' },
    { id: 'funk', label: 'Funk', emoji: '🕺' },
    { id: 'disco', label: 'Disco', emoji: '✨' },
    { id: 'house', label: 'House', emoji: '🏠' },
    { id: 'techno', label: 'Techno', emoji: '⚡' },
    { id: 'hiphop', label: 'Hip Hop', emoji: '🎤' },
    { id: 'rap', label: 'Rap', emoji: '🔥' },
    { id: 'reggae', label: 'Reggae', emoji: '🌴' },
    { id: 'latin', label: 'Latin', emoji: '💃' },
    { id: 'bollywood', label: 'Bollywood', emoji: '🎬' },
    { id: 'kpop', label: 'K-Pop', emoji: '🇰🇷' },
    { id: 'classical', label: 'Classical', emoji: '🎻' },
    { id: 'metal', label: 'Metal', emoji: '🤘' },
    { id: 'punk', label: 'Punk', emoji: '🎸' },
    { id: 'folk', label: 'Folk', emoji: '🪕' },
    { id: 'blues', label: 'Blues', emoji: '🎷' },
    { id: 'gospel', label: 'Gospel', emoji: '🙏' },
    { id: 'alternative', label: 'Alternative', emoji: '🎧' },
    { id: 'ambient', label: 'Ambient', emoji: '🌊' },
  ]
};

// Countries with regions
const COUNTRIES = {
  'UK': {
    flag: '🇬🇧',
    regions: ['London', 'Manchester', 'Birmingham', 'Scotland', 'Wales', 'Northern Ireland']
  },
  'US': {
    flag: '🇺🇸',
    regions: ['Northeast', 'South', 'West Coast', 'Midwest', 'Texas', 'Florida']
  },
  'Australia': {
    flag: '🇦🇺',
    regions: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Tasmania']
  },
  'Canada': {
    flag: '🇨🇦',
    regions: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Quebec']
  },
  'Germany': {
    flag: '🇩🇪',
    regions: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart']
  },
  'Netherlands': {
    flag: '🇳🇱',
    regions: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Groningen']
  }
};

export default function V3DJHarmonyPage() {
  // Core state
  const [currentStep, setCurrentStep] = useState<'intro' | 'country' | 'genres' | 'details' | 'preview'>('intro');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState(GENRES.popular);
  const [showAllGenres, setShowAllGenres] = useState(false);
  const [weddingDate, setWeddingDate] = useState('');
  const [guestCount, setGuestCount] = useState('100');
  const [customSongs, setCustomSongs] = useState<string[]>(['']);
  const [firstDanceSong, setFirstDanceSong] = useState('');
  
  // Timeline state
  const [timeline, setTimeline] = useState<any[]>([]);
  const [expandedMoments, setExpandedMoments] = useState<string[]>(['cocktails', 'party']); // Auto-expand key moments
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Audio state
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  
  // DJ Harmony state
  const [djHarmonyMessage, setDjHarmonyMessage] = useState("👋 Hi! I'm DJ Harmony, your AI wedding music expert. Let's create the perfect soundtrack for your big day!");
  const [showPricing, setShowPricing] = useState(false);
  
  // Spotify search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedFirstDance, setSelectedFirstDance] = useState<any>(null);
  const [customSearchQueries, setCustomSearchQueries] = useState<string[]>(['']);
  const [selectedCustomSongs, setSelectedCustomSongs] = useState<any[]>([]);

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

  // Update timeline based on selections
  useEffect(() => {
    if (selectedCountry && selectedRegion) {
      const regionKey = `${selectedCountry.toLowerCase()}-${selectedRegion.toLowerCase().replace(' ', '')}`;
      const regionalSongs = REGIONAL_SONGS[regionKey as keyof typeof REGIONAL_SONGS];
      
      if (regionalSongs) {
        setTimeline(prev => prev.map(moment => {
          if (moment.id === 'cocktails' && regionalSongs.cocktails) {
            return {
              ...moment,
              songs: [...regionalSongs.cocktails, ...COMPLETE_PLAYLIST.cocktails.slice(2)]
            };
          }
          if (moment.id === 'party' && regionalSongs.party) {
            return {
              ...moment,
              songs: [...regionalSongs.party, ...COMPLETE_PLAYLIST.party.slice(2)]
            };
          }
          return moment;
        }));
        
        setDjHarmonyMessage(`🎯 Perfect! I've added ${selectedRegion} favorites to your playlist. Your guests will love these local classics!`);
      }
    }
  }, [selectedCountry, selectedRegion]);

  // Handle genre selection and update playlist
  const toggleGenre = (genreId: string) => {
    setSelectedGenres(prev => {
      const updated = prev.map(g => 
        g.id === genreId ? { ...g, selected: !g.selected } : g
      );
      
      // Update playlist based on selected genres
      updatePlaylistForGenres(updated);
      
      return updated;
    });
  };
  
  // Update playlist based on selected genres
  const updatePlaylistForGenres = (genres: typeof GENRES.popular) => {
    const selectedGenreIds = genres.filter(g => g.selected).map(g => g.id);
    
    // Genre-specific song additions
    const genreSongs: Record<string, any[]> = {
      'country': [
        { id: 'cs1', title: 'Tennessee Whiskey', artist: 'Chris Stapleton', tag: 'Country Pick' },
        { id: 'cs2', title: 'Wagon Wheel', artist: 'Darius Rucker', tag: 'Country Favorite' }
      ],
      'electronic': [
        { id: 'es1', title: 'Clarity', artist: 'Zedd', tag: 'Electronic Hit' },
        { id: 'es2', title: 'Titanium', artist: 'David Guetta', tag: 'Dance Floor' }
      ],
      'indie': [
        { id: 'is1', title: 'Electric Feel', artist: 'MGMT', tag: 'Indie Favorite' },
        { id: 'is2', title: 'Pumped Up Kicks', artist: 'Foster The People', tag: 'Indie Hit' }
      ],
      'rock': [
        { id: 'rs1', title: 'You Shook Me All Night Long', artist: 'AC/DC', tag: 'Rock Classic' },
        { id: 'rs2', title: 'Livin\' on a Prayer', artist: 'Bon Jovi', tag: 'Rock Anthem' }
      ]
    };
    
    setTimeline(prev => prev.map(moment => {
      if (moment.id === 'party') {
        // Add genre-specific songs to party
        let extraSongs: any[] = [];
        selectedGenreIds.forEach(genreId => {
          if (genreSongs[genreId]) {
            extraSongs = [...extraSongs, ...genreSongs[genreId]];
          }
        });
        
        if (extraSongs.length > 0) {
          return {
            ...moment,
            songs: [...extraSongs, ...COMPLETE_PLAYLIST.party]
          };
        }
      }
      return moment;
    }));
    
    // Update DJ message
    if (selectedGenreIds.length > 0) {
      const genreNames = genres.filter(g => g.selected).map(g => g.label).join(', ');
      setDjHarmonyMessage(`Nice taste! I've added some ${genreNames} tracks to really get the party going.`);
    }
  };

  // Search Spotify for songs
  const searchSpotify = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      // Use GET request with query parameters
      const params = new URLSearchParams({
        q: query,
        limit: '8'
      });
      
      const response = await fetch(`/api/spotify/search?${params}`, {
        method: 'GET',
      });
      
      const data = await response.json();
      console.log('Search response:', data); // Debug log
      
      if (data.tracks && Array.isArray(data.tracks)) {
        setSearchResults(data.tracks);
      } else if (data.error) {
        console.error('Search API error:', data.error, data.details);
        setSearchResults([]);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);
  
  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchSpotify(searchQuery);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery, searchSpotify]);
  
  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.spotify-search-container')) {
        setShowSearchDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Handle song preview with real Spotify API
  const handlePlayPreview = async (songId: string, title?: string, artist?: string) => {
    if (currentlyPlaying === songId) {
      if (audioRef) {
        audioRef.pause();
        audioRef.currentTime = 0;
      }
      setCurrentlyPlaying(null);
      setAudioRef(null);
      return;
    }
    
    // Stop any current preview
    if (audioRef) {
      audioRef.pause();
      audioRef.currentTime = 0;
    }
    
    try {
      // Fetch preview URL from Spotify API
      const response = await fetch('/api/v3/spotify-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songId, title, artist })
      });
      
      const data = await response.json();
      
      if (data.success && data.previewUrl) {
        const audio = new Audio(data.previewUrl);
        audio.volume = 0.5;
        
        audio.play().catch(err => {
          console.error('Failed to play preview:', err);
          setCurrentlyPlaying(null);
        });
        
        // Auto-stop after preview ends
        audio.addEventListener('ended', () => {
          setCurrentlyPlaying(null);
          setAudioRef(null);
        });
        
        setAudioRef(audio);
        setCurrentlyPlaying(songId);
      } else {
        console.log('No preview available for this song');
      }
    } catch (error) {
      console.error('Failed to fetch preview:', error);
    }
  };

  // Calculate stats
  const totalSongs = timeline.reduce((sum, moment) => sum + moment.songs.length, 0);
  const totalHours = 8;

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
                <p className="text-xs text-purple-400">AI Wedding Music</p>
              </div>
            </Link>
            
            <div className="flex items-center gap-4">
              {currentlyPlaying && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full animate-pulse">
                  <Volume2 className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-300">Playing preview...</span>
                </div>
              )}
              <button
                onClick={() => setShowPricing(true)}
                className="text-sm text-purple-400 hover:text-purple-300"
              >
                Pricing
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {currentStep === 'intro' && (
        <div className="relative z-10 py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                Your Wedding. Your Music. <span className="text-gradient">Perfectly Crafted.</span>
              </h1>
              <p className="text-xl text-white/80 mb-8">
                152 songs. 8 hours. Every moment planned. Watch your playlist transform as you personalize.
              </p>
              
              {/* Value Props */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="glass-card rounded-xl p-6">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Zap className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Instant Generation</h3>
                  <p className="text-sm text-white/70">See your complete wedding playlist in seconds, not hours</p>
                </div>
                
                <div className="glass-card rounded-xl p-6">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Globe className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Local Favorites</h3>
                  <p className="text-sm text-white/70">Regional songs your guests will actually know and love</p>
                </div>
                
                <div className="glass-card rounded-xl p-6">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Guest Requests</h3>
                  <p className="text-sm text-white/70">Let guests add songs with a simple link (Pro feature)</p>
                </div>
              </div>

              <button
                onClick={() => setCurrentStep('country')}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/25"
              >
                Start Building My Playlist →
              </button>
              
              <p className="text-sm text-white/50 mt-4">
                No credit card required • 2 minutes to complete
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {currentStep !== 'intro' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT: Customization Flow */}
            <div className="lg:col-span-1">
              {/* DJ Harmony Assistant */}
              <div className="glass-card rounded-xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Headphones className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">DJ Harmony</h3>
                    <p className="text-sm text-white/80">{djHarmonyMessage}</p>
                  </div>
                </div>
              </div>

              {/* Country Selection */}
              {currentStep === 'country' && (
                <div className="glass-card rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-lg mb-4 text-white">
                    Where's your celebration?
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {Object.entries(COUNTRIES).map(([country, data]) => (
                      <button
                        key={country}
                        onClick={() => {
                          setSelectedCountry(country);
                          setDjHarmonyMessage(`Great choice! Now let's pick your specific region in ${country}.`);
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
                    <>
                      <p className="text-xs text-white/50 uppercase mb-2">Select Region</p>
                      <div className="grid grid-cols-2 gap-2">
                        {COUNTRIES[selectedCountry as keyof typeof COUNTRIES].regions.map(region => (
                          <button
                            key={region}
                            onClick={() => {
                              setSelectedRegion(region);
                              setCurrentStep('genres');
                              setDjHarmonyMessage("Now let's talk about your music taste. What genres get you moving?");
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
                    </>
                  )}
                </div>
              )}

              {/* Genre Selection */}
              {currentStep === 'genres' && (
                <div className="glass-card rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-lg mb-4 text-white">
                    Your favorite genres
                  </h3>
                  <p className="text-sm text-white/70 mb-4">
                    We've pre-selected popular choices. Adjust to match your taste!
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {selectedGenres.map(genre => (
                      <button
                        key={genre.id}
                        onClick={() => toggleGenre(genre.id)}
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
                  
                  {!showAllGenres ? (
                    <button
                      onClick={() => setShowAllGenres(true)}
                      className="text-sm text-purple-400 hover:text-purple-300"
                    >
                      Show all genres →
                    </button>
                  ) : (
                    <div className="mt-4 p-4 bg-white/5 rounded-lg">
                      <p className="text-xs text-white/50 uppercase mb-3">All Genres</p>
                      <div className="grid grid-cols-3 gap-2">
                        {GENRES.extended.map(genre => (
                          <button
                            key={genre.id}
                            className="p-2 text-xs bg-white/10 rounded hover:bg-white/20 text-white/70"
                          >
                            {genre.emoji} {genre.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={() => {
                      setCurrentStep('details');
                      setDjHarmonyMessage("Almost done! A few quick details about your big day...");
                    }}
                    className="w-full mt-4 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Continue →
                  </button>
                </div>
              )}

              {/* Wedding Details */}
              {currentStep === 'details' && (
                <div className="glass-card rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-lg mb-4 text-white">
                    Wedding Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-white/70 block mb-2">Wedding Date</label>
                      <input
                        type="date"
                        value={weddingDate}
                        onChange={(e) => setWeddingDate(e.target.value)}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm text-white/70 block mb-2">Guest Count</label>
                      <select
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                      >
                        <option value="50">Up to 50</option>
                        <option value="100">50-100</option>
                        <option value="150">100-150</option>
                        <option value="200">150-200</option>
                        <option value="300">200+</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm text-white/70 block mb-2">
                        First Dance Song (optional)
                      </label>
                      <div className="relative spotify-search-container">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                          <input
                            type="text"
                            value={selectedFirstDance ? `${selectedFirstDance.name} - ${selectedFirstDance.artist}` : searchQuery}
                            onChange={(e) => {
                              setSearchQuery(e.target.value);
                              setShowSearchDropdown(true);
                              if (selectedFirstDance) {
                                setSelectedFirstDance(null);
                              }
                            }}
                            onFocus={() => setShowSearchDropdown(true)}
                            placeholder="Search for a song..."
                            className="w-full pl-10 pr-10 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40"
                          />
                          {selectedFirstDance && (
                            <button
                              onClick={() => {
                                setSelectedFirstDance(null);
                                setSearchQuery('');
                                setFirstDanceSong('');
                              }}
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                              <X className="w-4 h-4 text-white/40 hover:text-white/60" />
                            </button>
                          )}
                        </div>
                        
                        {showSearchDropdown && searchQuery && !selectedFirstDance && (
                          <div className="absolute z-10 w-full mt-2 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg overflow-hidden">
                            {isSearching ? (
                              <div className="p-4 text-center">
                                <Loader2 className="w-4 h-4 animate-spin mx-auto text-purple-400" />
                                <p className="text-sm text-white/60 mt-2">Searching...</p>
                              </div>
                            ) : searchResults.length > 0 ? (
                              <div className="max-h-60 overflow-y-auto">
                                {searchResults.map((track: any) => (
                                  <button
                                    key={track.id}
                                    onClick={() => {
                                      setSelectedFirstDance(track);
                                      setFirstDanceSong(`${track.name} - ${track.artist}`);
                                      setSearchQuery('');
                                      setShowSearchDropdown(false);
                                      
                                      // Update the timeline with the selected first dance
                                      setTimeline(prev => prev.map(moment => 
                                        moment.id === 'first-dance' 
                                          ? { ...moment, songs: [{ 
                                              id: track.id, 
                                              title: track.name, 
                                              artist: track.artist 
                                            }] }
                                          : moment
                                      ));
                                      
                                      setDjHarmonyMessage(`Beautiful choice! "${track.name}" will be perfect for your first dance.`);
                                    }}
                                    className="w-full p-3 hover:bg-white/10 flex items-center gap-3 text-left transition-colors"
                                  >
                                    {track.image ? (
                                      <img 
                                        src={track.image} 
                                        alt={track.name}
                                        className="w-10 h-10 rounded object-cover"
                                      />
                                    ) : (
                                      <div className="w-10 h-10 rounded bg-purple-500/20 flex items-center justify-center">
                                        <Music className="w-5 h-5 text-purple-400" />
                                      </div>
                                    )}
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-white">{track.name}</p>
                                      <p className="text-xs text-white/60">{track.artist}</p>
                                    </div>
                                    {track.preview_url && (
                                      <Play className="w-4 h-4 text-purple-400" />
                                    )}
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div className="p-4 text-center">
                                <p className="text-sm text-white/60">No results found</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm text-white/70 block mb-2">
                        Must-play songs
                      </label>
                      <div className="space-y-2">
                        {selectedCustomSongs.map((song, idx) => (
                          <div key={`selected-${idx}`} className="flex items-center gap-2 p-2 bg-purple-500/10 rounded-lg">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-white">{song.name}</p>
                              <p className="text-xs text-white/60">{song.artist}</p>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedCustomSongs(prev => prev.filter((_, i) => i !== idx));
                              }}
                              className="p-1 hover:bg-white/10 rounded"
                            >
                              <X className="w-4 h-4 text-white/40" />
                            </button>
                          </div>
                        ))}
                        
                        {(selectedCustomSongs.length === 0 || customSearchQueries.length > 0) && (
                          <div className="relative spotify-search-container">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                              <input
                                type="text"
                                value={customSearchQueries[0] || ''}
                                onChange={(e) => {
                                  setCustomSearchQueries([e.target.value]);
                                  setSearchQuery(e.target.value);
                                  if (e.target.value.length > 2) {
                                    searchSpotify(e.target.value);
                                    setShowSearchDropdown(true);
                                  }
                                }}
                                onFocus={() => setShowSearchDropdown(true)}
                                placeholder="Search for must-play songs..."
                                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40"
                              />
                            </div>
                            
                            {showSearchDropdown && customSearchQueries[0] && customSearchQueries[0].length > 2 && (
                              <div className="absolute z-10 w-full mt-2 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg overflow-hidden">
                                {isSearching ? (
                                  <div className="p-4 text-center">
                                    <Loader2 className="w-4 h-4 animate-spin mx-auto text-purple-400" />
                                    <p className="text-sm text-white/60 mt-2">Searching...</p>
                                  </div>
                                ) : searchResults.length > 0 ? (
                                  <div className="max-h-60 overflow-y-auto">
                                    {searchResults.map((track: any) => (
                                      <button
                                        key={track.id}
                                        onClick={() => {
                                          setSelectedCustomSongs(prev => [...prev, track]);
                                          setCustomSearchQueries(['']);
                                          setSearchQuery('');
                                          setShowSearchDropdown(false);
                                          setDjHarmonyMessage(`Great choice! "${track.name}" added to your must-play list.`);
                                        }}
                                        className="w-full p-3 hover:bg-white/10 flex items-center gap-3 text-left transition-colors"
                                      >
                                        {track.image ? (
                                          <img 
                                            src={track.image} 
                                            alt={track.name}
                                            className="w-10 h-10 rounded object-cover"
                                          />
                                        ) : (
                                          <div className="w-10 h-10 rounded bg-purple-500/20 flex items-center justify-center">
                                            <Music className="w-5 h-5 text-purple-400" />
                                          </div>
                                        )}
                                        <div className="flex-1">
                                          <p className="text-sm font-medium text-white">{track.name}</p>
                                          <p className="text-xs text-white/60">{track.artist}</p>
                                        </div>
                                        <Plus className="w-4 h-4 text-purple-400" />
                                      </button>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="p-4 text-center">
                                    <p className="text-sm text-white/60">No results found</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {selectedCustomSongs.length >= 5 && (
                        <p className="text-xs text-white/50 mt-2">Maximum 5 must-play songs</p>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setCurrentStep('preview');
                      setIsGenerating(true);
                      setTimeout(() => {
                        setIsGenerating(false);
                        setDjHarmonyMessage("🎉 Perfect! Your personalized playlist is ready. Create a free account to save and customize every detail!");
                      }, 2000);
                    }}
                    className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90"
                  >
                    Generate My Playlist →
                  </button>
                </div>
              )}

              {/* Preview Mode CTAs */}
              {currentStep === 'preview' && (
                <div className="glass-card rounded-xl p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20">
                  <h3 className="font-semibold text-lg mb-3 text-white">
                    Love what you see?
                  </h3>
                  <p className="text-sm text-white/80 mb-4">
                    Create a free account to unlock:
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-white/90">
                      <Check className="w-4 h-4 text-green-400" />
                      <span>Save & customize every song</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/90">
                      <Check className="w-4 h-4 text-green-400" />
                      <span>Drag & drop to reorder</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/90">
                      <Check className="w-4 h-4 text-green-400" />
                      <span>Share with your partner</span>
                    </div>
                  </div>
                  <button className="w-full px-4 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100">
                    Create Free Account
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT: Live Timeline */}
            <div className="lg:col-span-2">
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">YOUR WEDDING TIMELINE</h2>
                    <p className="text-sm text-white/60 mt-1">
                      {totalSongs} songs • {totalHours} hours • {selectedRegion && `Customized for ${selectedRegion}`}
                    </p>
                  </div>
                  {isGenerating && (
                    <div className="flex items-center gap-2 text-purple-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Generating...</span>
                    </div>
                  )}
                </div>

                {/* Timeline */}
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
                            {moment.songs.map((song: any, idx: number) => (
                              <div 
                                key={song.id}
                                className={`flex items-center justify-between p-2 rounded-lg hover:bg-white/5 ${
                                  song.tag ? 'bg-purple-500/10' : ''
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-white/40 text-sm w-6">{idx + 1}</span>
                                  <div>
                                    <p className="font-medium text-white">
                                      {song.label && <span className="text-xs text-white/50 mr-2">{song.label}:</span>}
                                      {song.title}
                                    </p>
                                    <p className="text-sm text-white/60">
                                      {song.artist}
                                      {song.tag && <span className="ml-2 text-purple-400">• {song.tag}</span>}
                                    </p>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => handlePlayPreview(song.id, song.title, song.artist)}
                                  className={`p-2 rounded-lg transition-all ${
                                    currentlyPlaying === song.id 
                                      ? 'bg-purple-500/20 text-purple-400' 
                                      : 'hover:bg-white/10 text-white/40'
                                  }`}
                                  title={currentlyPlaying === song.id ? 'Pause' : 'Preview on Spotify'}
                                >
                                  {currentlyPlaying === song.id ? (
                                    <Pause className="w-4 h-4" />
                                  ) : (
                                    <Play className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* How It Works Section */}
        {currentStep === 'intro' && (
          <div className="mt-24">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              How It Works
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">1. Choose Location</h3>
                <p className="text-sm text-white/70">Select your country and region for local favorites</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">2. Pick Genres</h3>
                <p className="text-sm text-white/70">Tell us what music you love</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">3. AI Magic</h3>
                <p className="text-sm text-white/70">Watch your perfect playlist appear</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">4. Collaborate</h3>
                <p className="text-sm text-white/70">Invite your partner and guests</p>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Section */}
        {(showPricing || currentStep === 'intro') && (
          <div className="mt-24" id="pricing">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              Simple, Transparent Pricing
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Free Tier */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-2">Free</h3>
                <p className="text-3xl font-bold text-white mb-4">£0</p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-white/80">Generate unlimited playlists</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-white/80">Basic customization</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-white/80">Save 1 playlist</span>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20">
                  Get Started
                </button>
              </div>

              {/* Pro Tier */}
              <div className="glass-card rounded-xl p-6 ring-2 ring-purple-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-white">Pro</h3>
                  <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full">Popular</span>
                </div>
                <p className="text-3xl font-bold text-white mb-4">£39</p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-white/80">Everything in Free</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-white/80">Unlimited saved playlists</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-white/80">Guest request link</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-white/80">Collaborate with partner</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-white/80">Export to Spotify</span>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Upgrade to Pro
                </button>
              </div>

              {/* Ultimate Tier */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-2">Ultimate</h3>
                <p className="text-3xl font-bold text-white mb-4">£79</p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-white/80">Everything in Pro</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-white/80">DJ Harmony consultations</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-white/80">Professional DJ notes</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-white/80">Multiple event support</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-white/80">Priority support</span>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20">
                  Go Ultimate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}