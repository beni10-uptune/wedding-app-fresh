'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/SupabaseAuthProvider';
import { weddingHelpers } from '@/lib/supabase/wedding-helpers';
import { detectUserCurrency, formatPrice, PRICE_AMOUNTS } from '@/config/stripe-prices';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
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
  Heart,
  Users,
  Loader2,
  Search,
  X,
  Lock,
  Calendar,
  Settings,
  ChevronUp,
  Trash2,
  Share2,
  Download,
  LogOut,
  User,
  Save,
  Zap,
  TrendingUp,
  AlertCircle,
  Info
} from 'lucide-react';
import { DroppableMoment } from '@/components/v3/DroppableMoment';
import { AddSongModal } from '@/components/v3/AddSongModal';
import { ProgressiveAuthModal } from '@/components/auth/ProgressiveAuthModal';
import { ShareModal } from '@/components/v3/ShareModal';
import { SettingsModal } from '@/components/v3/SettingsModal';
import { UpgradeModal } from '@/components/v3/UpgradeModal';
import { 
  searchDatabaseSongs, 
  addSongToDatabase,
  loadMomentSongs,
  MOMENT_SONG_COUNTS
} from '../builder/BuilderFixes';

// Song type
interface Song {
  id: string;
  title: string;
  artist: string;
  bpm?: number;
  label?: string;
  previewUrl?: string;
  spotifyId?: string;
  duration?: number;
  albumArt?: string;
  album?: string;
}

interface TimelineMoment {
  id: string;
  time: string;
  duration: string;
  title: string;
  emoji: string;
  songs: Song[];
  isSpecial?: boolean;
}

// Countries & Genres data
const COUNTRIES = {
  'UK': { flag: '🇬🇧' },
  'Ireland': { flag: '🇮🇪' },
  'US': { flag: '🇺🇸' },
  'Australia': { flag: '🇦🇺' },
  'Canada': { flag: '🇨🇦' },
};

const GENRES = [
  { id: 'pop', label: 'Pop', emoji: '🎵' },
  { id: 'rock', label: 'Rock', emoji: '🎸' },
  { id: 'indie', label: 'Indie', emoji: '🎤' },
  { id: 'rnb', label: 'R&B', emoji: '💜' },
  { id: 'country', label: 'Country', emoji: '🤠' },
  { id: 'electronic', label: 'Electronic', emoji: '🎹' },
];

export default function SimplifiedBuilderPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [weddingData, setWeddingData] = useState<any>(null);
  const [weddingId, setWeddingId] = useState<string | null>(null);
  
  // Core state
  const [timeline, setTimeline] = useState<TimelineMoment[]>([]);
  const [expandedMoments, setExpandedMoments] = useState<string[]>(['first-dance']);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['pop', 'rnb']);
  const [weddingDate, setWeddingDate] = useState<string>('');
  const [weddingName, setWeddingName] = useState<string>('Your Wedding');
  const [venue, setVenue] = useState<string>('');
  const [guestCount, setGuestCount] = useState<string>('');
  
  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedSong, setDraggedSong] = useState<Song | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTrigger, setAuthTrigger] = useState<'save' | 'share' | 'spotify' | 'premium' | 'export'>('save');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAddSongModal, setShowAddSongModal] = useState(false);
  const [addSongMomentId, setAddSongMomentId] = useState<string | null>(null);
  const [quickAddSong, setQuickAddSong] = useState<Song | null>(null);
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  
  // Mobile state
  const [mobilePane, setMobilePane] = useState<'timeline' | 'assistant'>('timeline');
  
  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  
  // Calculate stats
  const totalSongs = timeline.reduce((sum, moment) => sum + (moment.songs?.length || 0), 0);
  const totalDuration = timeline.reduce((sum, moment) => {
    const momentDuration = moment.songs?.reduce((s, song) => s + (song.duration || 0), 0) || 0;
    return sum + momentDuration;
  }, 0);
  const totalHours = Math.floor(totalDuration / 3600);
  const totalMinutes = Math.floor((totalDuration % 3600) / 60);
  const daysUntilWedding = weddingDate 
    ? Math.ceil((new Date(weddingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;
  
  // Get smart suggestions based on current state
  const getSmartSuggestions = () => {
    const suggestions = [];
    
    // Check for first dance
    const firstDance = timeline.find(m => m.id === 'first-dance');
    if (!firstDance?.songs?.length) {
      suggestions.push({
        type: 'missing',
        icon: '💕',
        text: 'Add your first dance song',
        action: () => openAddSongModal('first-dance')
      });
    }
    
    // Check for energy flow issues
    const partyMoment = timeline.find(m => m.id === 'party');
    if (partyMoment?.songs?.length && partyMoment.songs.length < 10) {
      suggestions.push({
        type: 'tip',
        icon: '🎉',
        text: 'Add more party songs for dancing',
        action: () => openAddSongModal('party')
      });
    }
    
    // Check for customization
    if (!selectedCountry && !selectedGenres.length) {
      suggestions.push({
        type: 'customize',
        icon: '📍',
        text: 'Set your location for local favorites',
        action: () => setShowQuickActions(true)
      });
    }
    
    return suggestions.slice(0, 3); // Max 3 suggestions
  };
  
  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          const weddings = await weddingHelpers.getMyWeddings();
          
          if (weddings && weddings.length > 0) {
            const wedding = weddings[0];
            setWeddingData(wedding);
            setWeddingId(wedding.id);
            setWeddingName(wedding.couple_names || 'Your Wedding');
            setWeddingDate(wedding.wedding_date || '');
            setVenue(wedding.venue_name || '');
            setGuestCount(wedding.guest_count?.toString() || '');
            
            if (wedding.timeline) {
              const convertedTimeline = Object.entries(wedding.timeline).map(([key, value]: [string, any]) => ({
                id: key,
                ...value,
                songs: value.songs || []
              }));
              setTimeline(convertedTimeline);
            }
            
            if (wedding.music_preferences?.genres) {
              setSelectedGenres(wedding.music_preferences.genres);
            }
            if (wedding.music_preferences?.location) {
              setSelectedCountry(wedding.music_preferences.location);
            }
          }
        } catch (error) {
          console.error('Error loading wedding data:', error);
        }
      }
      setLoading(false);
    };
    
    loadUserData();
  }, [user]);
  
  // Initialize timeline
  useEffect(() => {
    if (weddingData?.timeline) return;
    
    const loadInitialTimeline = async () => {
      const moments = [
        { id: 'getting-ready', time: '2:00 PM', duration: '30 min', title: 'Getting Ready', emoji: '💄' },
        { id: 'ceremony', time: '3:00 PM', duration: '20 min', title: 'Ceremony', emoji: '💒' },
        { id: 'cocktails', time: '3:30 PM', duration: '90 min', title: 'Cocktails', emoji: '🥂' },
        { id: 'dinner', time: '5:00 PM', duration: '90 min', title: 'Dinner', emoji: '🍽️' },
        { id: 'first-dance', time: '7:00 PM', duration: '5 min', title: 'First Dance', emoji: '💕', isSpecial: true },
        { id: 'parent-dances', time: '7:05 PM', duration: '10 min', title: 'Parent Dances', emoji: '👨‍👩‍👧' },
        { id: 'party', time: '7:15 PM', duration: '3 hours', title: 'Party Time', emoji: '🎉' },
        { id: 'last-dance', time: '10:15 PM', duration: '10 min', title: 'Last Dance', emoji: '🌙' }
      ];
      
      const timelineWithSongs = await Promise.all(
        moments.map(async (moment) => {
          const songs = await loadMomentSongs(
            moment.id, 
            selectedGenres.length > 0 ? selectedGenres : undefined,
            selectedCountry || undefined
          );
          
          const songCount = MOMENT_SONG_COUNTS[moment.id as keyof typeof MOMENT_SONG_COUNTS] || 10;
          
          return {
            ...moment,
            songs: songs.slice(0, songCount)
          };
        })
      );
      
      setTimeline(timelineWithSongs);
    };
    
    loadInitialTimeline();
  }, [weddingData, selectedGenres, selectedCountry]);
  
  // Search functionality
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const songs = await searchDatabaseSongs(query, selectedGenres, selectedCountry || undefined);
      const mappedSongs = songs.map(song => ({
        id: song.id || song.spotifyId || `song-${Date.now()}-${Math.random()}`,
        title: song.title,
        artist: song.artist,
        album: song.album,
        spotifyId: song.spotifyId,
        previewUrl: song.previewUrl,
        duration: song.durationMs ? Math.floor(song.durationMs / 1000) : undefined,
        bpm: song.features?.tempo ? Math.round(song.features.tempo) : undefined,
        albumArt: song.albumArt
      }));
      
      setSearchResults(mappedSongs);
    } catch (error) {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [selectedGenres, selectedCountry]);
  
  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);
  
  // Auto-save functionality
  useEffect(() => {
    if (!user || !hasChanges || isSaving || loading || !weddingId) return;

    const autoSaveTimer = setTimeout(async () => {
      setIsSaving(true);
      try {
        const timelineV2: any = {};
        timeline.forEach((moment, index) => {
          const timelineSongs = (moment.songs || []).map((song: any, songIndex: number) => ({
            id: `${moment.id}_${song.id}_${songIndex}`,
            spotifyId: song.spotifyId || song.id,
            title: song.title,
            artist: song.artist,
            album: song.album || '',
            albumArt: song.albumArt || '',
            previewUrl: song.previewUrl || null,
            duration: song.duration || 0,
            addedBy: 'couple',
            addedAt: new Date(),
            energy: song.bpm ? Math.min(5, Math.max(1, Math.round((song.bpm - 60) / 40))) : 3,
            explicit: false
          }));

          timelineV2[moment.id] = {
            id: moment.id,
            name: moment.title,
            order: index,
            duration: parseInt(moment.duration) || 30,
            songs: timelineSongs
          };
        });

        await weddingHelpers.updateWedding(weddingId, {
          timeline: timelineV2,
          music_preferences: {
            genres: selectedGenres,
            location: selectedCountry
          },
          couple_names: weddingName,
          wedding_date: weddingDate || undefined,
          venue_name: venue || undefined,
          guest_count: guestCount ? parseInt(guestCount) : undefined
        });
        
        setHasChanges(false);
        setLastSaved(new Date());
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setIsSaving(false);
      }
    }, 2000);

    return () => clearTimeout(autoSaveTimer);
  }, [timeline, selectedGenres, selectedCountry, weddingDate, weddingName, venue, guestCount, user, weddingId, hasChanges, isSaving, loading]);
  
  // Track changes
  useEffect(() => {
    if (timeline.length > 0 && !loading) {
      setHasChanges(true);
    }
  }, [timeline, selectedGenres, selectedCountry, loading]);
  
  // Drag and drop handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const [momentId, songIndex] = active.id.toString().split('-song-');
    const moment = timeline.find(m => m.id === momentId);
    if (moment && songIndex !== undefined) {
      setDraggedSong(moment.songs[parseInt(songIndex)]);
      setIsDragging(true);
    }
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setIsDragging(false);
    setDraggedSong(null);
    
    if (!over) return;
    
    if (over.id === 'trash-zone') {
      const [sourceMomentId, songIndex] = active.id.toString().split('-song-');
      setTimeline(prev => prev.map(moment => {
        if (moment.id === sourceMomentId) {
          const newSongs = [...moment.songs];
          newSongs.splice(parseInt(songIndex), 1);
          return { ...moment, songs: newSongs };
        }
        return moment;
      }));
      return;
    }
    
    // Handle reordering logic here...
  };
  
  // Song management
  const openAddSongModal = (momentId: string) => {
    setAddSongMomentId(momentId);
    setShowAddSongModal(true);
  };
  
  const handleAddSongToMoment = async (song: Song, momentId: string) => {
    setTimeline(prev => prev.map(moment => {
      if (moment.id === momentId) {
        return { ...moment, songs: [...moment.songs, song] };
      }
      return moment;
    }));
    
    setShowAddSongModal(false);
    setAddSongMomentId(null);
  };
  
  const handleRemoveSong = (momentId: string, songIndex: number) => {
    setTimeline(prev => prev.map(moment => {
      if (moment.id === momentId) {
        const newSongs = [...moment.songs];
        newSongs.splice(songIndex, 1);
        return { ...moment, songs: newSongs };
      }
      return moment;
    }));
  };
  
  const handleQuickAddSong = (song: Song) => {
    setQuickAddSong(song);
    setShowQuickAddModal(true);
  };
  
  const handleQuickAddToMoment = (momentId: string) => {
    if (quickAddSong) {
      handleAddSongToMoment(quickAddSong, momentId);
      setQuickAddSong(null);
      setShowQuickAddModal(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };
  
  // Play/Pause functionality
  const handlePlaySong = (song: Song, songId: string) => {
    if (audioElement) {
      audioElement.pause();
    }

    if (song.previewUrl) {
      const audio = new Audio(song.previewUrl);
      audio.volume = 0.5;
      audio.play().catch(err => {});
      audio.addEventListener('ended', () => setPlayingId(null));
      
      setAudioElement(audio);
      setPlayingId(songId);
    }
  };
  
  const handlePauseSong = () => {
    if (audioElement) {
      audioElement.pause();
      setPlayingId(null);
    }
  };
  
  const saveTimeline = async () => {
    if (!user) {
      setAuthTrigger('save');
      setShowAuthModal(true);
      return;
    }
    // Save logic implemented in auto-save
  };
  
  const getPriceDisplay = () => {
    const currency = detectUserCurrency();
    const price = PRICE_AMOUNTS.professional[currency];
    return formatPrice(price, currency);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen dark-gradient flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }
  
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen dark-gradient relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="orb orb-purple w-96 h-96 -top-48 -right-48"></div>
          <div className="orb orb-blue w-96 h-96 -bottom-48 -left-48"></div>
        </div>

        {/* Simplified Header */}
        <header className="sticky top-0 z-50 glass-darker backdrop-blur-md border-b border-white/10">
          <div className="container-fluid px-4">
            <div className="flex items-center justify-between h-14">
              {/* Left: Logo & Wedding Name */}
              <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                    <Music className="w-5 h-5 text-white" />
                  </div>
                </Link>
                <div className="flex items-center gap-3">
                  <h1 className="text-white font-medium">{weddingName}</h1>
                  {daysUntilWedding !== null && daysUntilWedding > 0 && (
                    <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full">
                      {daysUntilWedding} days
                    </span>
                  )}
                </div>
              </div>
              
              {/* Right: Save Status & Profile */}
              <div className="flex items-center gap-3">
                {user && isSaving && (
                  <span className="text-xs text-green-400 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Saving
                  </span>
                )}
                {user && !isSaving && lastSaved && (
                  <span className="text-xs text-white/40">Saved</span>
                )}
                
                {/* Profile Menu */}
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <User className="w-4 h-4 text-white" />
                      <span className="text-sm text-white hidden sm:inline">
                        {user.email?.split('@')[0]}
                      </span>
                      <ChevronDown className="w-3 h-3 text-white/60" />
                    </button>
                    
                    {showProfileMenu && (
                      <div className="absolute right-0 mt-2 w-48 glass-darker rounded-lg shadow-xl border border-white/10 overflow-hidden">
                        <button
                          onClick={() => {
                            setShowSettingsModal(true);
                            setShowProfileMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 flex items-center gap-2"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </button>
                        <button
                          onClick={() => {
                            setShowShareModal(true);
                            setShowProfileMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 flex items-center gap-2"
                        >
                          <Share2 className="w-4 h-4" />
                          Share & Invite
                        </button>
                        <button
                          onClick={() => {
                            // Handle export
                            setShowProfileMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Export
                        </button>
                        <hr className="border-white/10" />
                        <button
                          onClick={() => {
                            // Handle logout
                            setShowProfileMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={saveTimeline}
                    className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm rounded-lg hover:opacity-90"
                  >
                    Save Playlist
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Two-Pane Layout - Desktop */}
        <div className="hidden md:flex h-[calc(100vh-3.5rem)] relative z-10">
          
          {/* LEFT PANE: Timeline Builder */}
          <div className="flex-1 flex flex-col bg-black/20">
            {/* Quick Add Search - Now at the top! */}
            <div className="p-4 glass-darker border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  placeholder="Quick add: Search for any song..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:bg-white/20 focus:border-purple-400 focus:outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {/* Search Results Dropdown */}
              {searchQuery && (
                <div className="absolute left-4 right-4 mt-2 max-h-64 overflow-y-auto glass-darker rounded-lg border border-white/10 z-20">
                  {isSearching ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-5 h-5 animate-spin text-white/60" />
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((song) => (
                        <button
                          key={song.id}
                          onClick={() => handleQuickAddSong(song)}
                          className="w-full px-4 py-2 hover:bg-white/10 transition-colors text-left group"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-white font-medium">{song.title}</p>
                              <p className="text-xs text-white/60">{song.artist}</p>
                            </div>
                            <Plus className="w-4 h-4 text-white/40 group-hover:text-white" />
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-white/40 text-center py-4">
                      No results found
                    </p>
                  )}
                </div>
              )}
            </div>
            
            {/* Timeline Header */}
            <div className="px-4 py-3 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">WEDDING TIMELINE</h2>
              <p className="text-xs text-white/60">{totalSongs} songs • {totalHours}h {totalMinutes}m</p>
            </div>
            
            {/* Timeline Moments */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {timeline.map((moment) => (
                <div key={moment.id} className="relative">
                  {moment.isSpecial && (
                    <div className="absolute -left-2 top-3">
                      <span className="text-yellow-400">⭐</span>
                    </div>
                  )}
                  <DroppableMoment
                    moment={moment}
                    isExpanded={expandedMoments.includes(moment.id)}
                    onToggle={() => {
                      setExpandedMoments(prev =>
                        prev.includes(moment.id)
                          ? prev.filter(id => id !== moment.id)
                          : [...prev, moment.id]
                      );
                    }}
                    onAddSong={() => openAddSongModal(moment.id)}
                    onRemoveSong={(momentId, songIndex) => handleRemoveSong(momentId, songIndex)}
                    onPlaySong={handlePlaySong}
                    onPauseSong={handlePauseSong}
                    playingId={playingId}
                  />
                </div>
              ))}
              
              {/* Add Custom Moment */}
              <button className="w-full py-3 border-2 border-dashed border-white/20 rounded-lg text-white/40 hover:text-white hover:border-white/40 transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Add Custom Moment
              </button>
              
              {/* Trash Zone (only visible when dragging) */}
              {isDragging && (
                <div 
                  id="trash-zone"
                  className="mt-4 p-4 border-2 border-dashed border-red-500/50 rounded-lg bg-red-500/10 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5 text-red-400" />
                  <span className="text-red-400">Drop here to remove</span>
                </div>
              )}
            </div>
          </div>
          
          {/* RIGHT PANE: Smart Assistant */}
          <div className="w-80 glass-darker border-l border-white/10 flex flex-col">
            <div className="p-4 space-y-4 overflow-y-auto">
              
              {/* Quick Actions */}
              <div className="glass-card rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="w-full p-3 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <h3 className="font-medium text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    Quick Actions
                  </h3>
                  {showQuickActions ? (
                    <ChevronUp className="w-4 h-4 text-white/40" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white/40" />
                  )}
                </button>
                
                {showQuickActions && (
                  <div className="p-3 pt-0 space-y-2">
                    <button className="w-full px-3 py-2 bg-white/10 rounded-lg text-sm text-white hover:bg-white/20 transition-colors flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {selectedCountry ? `${COUNTRIES[selectedCountry as keyof typeof COUNTRIES]?.flag} ${selectedCountry}` : 'Set Location'}
                    </button>
                    <button className="w-full px-3 py-2 bg-white/10 rounded-lg text-sm text-white hover:bg-white/20 transition-colors flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      {selectedGenres.length > 0 ? `${selectedGenres.length} Genres` : 'Music Taste'}
                    </button>
                    <button className="w-full px-3 py-2 bg-white/10 rounded-lg text-sm text-white hover:bg-white/20 transition-colors flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Wedding Details
                    </button>
                  </div>
                )}
              </div>
              
              {/* Smart Suggestions */}
              <div className="glass-card rounded-lg p-4">
                <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Smart Suggestions
                </h3>
                <div className="space-y-2">
                  {getSmartSuggestions().map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={suggestion.action}
                      className="w-full text-left p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-lg">{suggestion.icon}</span>
                        <p className="text-xs text-white/80">{suggestion.text}</p>
                      </div>
                    </button>
                  ))}
                  {getSmartSuggestions().length === 0 && (
                    <p className="text-xs text-white/40">Your playlist is looking great! 🎉</p>
                  )}
                </div>
              </div>
              
              {/* PRO Features - All in one place! */}
              <div className="glass-card rounded-lg p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-purple-400" />
                    Pro Features
                  </h3>
                  <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">
                    PRO
                  </span>
                </div>
                
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center gap-2 text-xs text-white/80">
                    <Check className="w-3 h-3 text-purple-400" />
                    AI Chat Assistant
                  </li>
                  <li className="flex items-center gap-2 text-xs text-white/80">
                    <Check className="w-3 h-3 text-purple-400" />
                    Import from Spotify
                  </li>
                  <li className="flex items-center gap-2 text-xs text-white/80">
                    <Check className="w-3 h-3 text-purple-400" />
                    Guest Request Portal
                  </li>
                  <li className="flex items-center gap-2 text-xs text-white/80">
                    <Check className="w-3 h-3 text-purple-400" />
                    BPM & Energy Analysis
                  </li>
                  <li className="flex items-center gap-2 text-xs text-white/80">
                    <Check className="w-3 h-3 text-purple-400" />
                    Professional DJ Export
                  </li>
                </ul>
                
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Upgrade for {getPriceDisplay()}
                </button>
              </div>
              
              {/* Ready to Share */}
              <div className="glass-card rounded-lg p-4">
                <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  Ready to Share?
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      if (!user) {
                        setAuthTrigger('export');
                        setShowAuthModal(true);
                      }
                    }}
                    className="px-3 py-2 bg-white/10 rounded-lg text-xs text-white hover:bg-white/20 transition-colors flex items-center justify-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    Export
                  </button>
                  <button
                    onClick={() => {
                      if (!user) {
                        setAuthTrigger('share');
                        setShowAuthModal(true);
                      } else {
                        setShowShareModal(true);
                      }
                    }}
                    className="px-3 py-2 bg-white/10 rounded-lg text-xs text-white hover:bg-white/20 transition-colors flex items-center justify-center gap-1"
                  >
                    <Share2 className="w-3 h-3" />
                    Invite
                  </button>
                </div>
                {!user && (
                  <button
                    onClick={saveTimeline}
                    className="w-full mt-2 py-2 bg-purple-600 text-white rounded-lg text-xs hover:bg-purple-700 transition-colors"
                  >
                    Save Your Playlist
                  </button>
                )}
              </div>
              
              {/* Playlist Stats */}
              <div className="glass-card rounded-lg p-3 bg-gradient-to-r from-purple-600/10 to-pink-600/10">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-white/60">Total Songs</p>
                    <p className="text-white font-semibold">{totalSongs}</p>
                  </div>
                  <div>
                    <p className="text-white/60">Duration</p>
                    <p className="text-white font-semibold">{totalHours}h {totalMinutes}m</p>
                  </div>
                  <div>
                    <p className="text-white/60">Customized</p>
                    <p className="text-white font-semibold">
                      {selectedGenres.length > 0 || selectedCountry ? 'Yes ✓' : 'Not yet'}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60">Status</p>
                    <p className="text-white font-semibold">
                      {user ? 'Saved' : 'Draft'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Layout - Single pane view */}
        <div className="md:hidden h-[calc(100vh-3.5rem-3.5rem)] relative z-10">
          {mobilePane === 'timeline' ? (
            /* Mobile Timeline */
            <div className="flex flex-col h-full bg-black/20">
              {/* Quick Add Search */}
              <div className="p-4 glass-darker border-b border-white/10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    placeholder="Quick add: Search for any song..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:bg-white/20 focus:border-purple-400 focus:outline-none transition-all"
                  />
                </div>
                
                {/* Mobile Search Results */}
                {searchQuery && searchResults.length > 0 && (
                  <div className="absolute left-4 right-4 mt-2 max-h-48 overflow-y-auto glass-darker rounded-lg border border-white/10 z-20">
                    {searchResults.map((song) => (
                      <button
                        key={song.id}
                        onClick={() => handleQuickAddSong(song)}
                        className="w-full px-4 py-2 hover:bg-white/10 transition-colors text-left"
                      >
                        <p className="text-sm text-white font-medium">{song.title}</p>
                        <p className="text-xs text-white/60">{song.artist}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Timeline Header */}
              <div className="px-4 py-3 border-b border-white/10">
                <h2 className="text-lg font-bold text-white">WEDDING TIMELINE</h2>
                <p className="text-xs text-white/60">{totalSongs} songs • {totalHours}h {totalMinutes}m</p>
              </div>
              
              {/* Timeline Moments */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-4">
                {timeline.map((moment) => (
                  <DroppableMoment
                    key={moment.id}
                    moment={moment}
                    isExpanded={expandedMoments.includes(moment.id)}
                    onToggle={() => {
                      setExpandedMoments(prev =>
                        prev.includes(moment.id)
                          ? prev.filter(id => id !== moment.id)
                          : [...prev, moment.id]
                      );
                    }}
                    onAddSong={() => openAddSongModal(moment.id)}
                    onRemoveSong={(momentId, songIndex) => handleRemoveSong(momentId, songIndex)}
                    onPlaySong={handlePlaySong}
                    onPauseSong={handlePauseSong}
                    playingId={playingId}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* Mobile Assistant */
            <div className="h-full glass-darker overflow-y-auto p-4 space-y-4 pb-4">
              {/* Same assistant content as desktop */}
              <div className="glass-card rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="w-full p-3 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <h3 className="font-medium text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    Quick Actions
                  </h3>
                  {showQuickActions ? (
                    <ChevronUp className="w-4 h-4 text-white/40" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white/40" />
                  )}
                </button>
                
                {showQuickActions && (
                  <div className="p-3 pt-0 space-y-2">
                    <button className="w-full px-3 py-2 bg-white/10 rounded-lg text-sm text-white hover:bg-white/20 transition-colors flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {selectedCountry ? `${COUNTRIES[selectedCountry as keyof typeof COUNTRIES]?.flag} ${selectedCountry}` : 'Set Location'}
                    </button>
                    <button className="w-full px-3 py-2 bg-white/10 rounded-lg text-sm text-white hover:bg-white/20 transition-colors flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      {selectedGenres.length > 0 ? `${selectedGenres.length} Genres` : 'Music Taste'}
                    </button>
                    <button className="w-full px-3 py-2 bg-white/10 rounded-lg text-sm text-white hover:bg-white/20 transition-colors flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Wedding Details
                    </button>
                  </div>
                )}
              </div>
              
              {/* Smart Suggestions */}
              <div className="glass-card rounded-lg p-4">
                <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Smart Suggestions
                </h3>
                <div className="space-y-2">
                  {getSmartSuggestions().map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={suggestion.action}
                      className="w-full text-left p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-lg">{suggestion.icon}</span>
                        <p className="text-xs text-white/80">{suggestion.text}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* PRO Features */}
              <div className="glass-card rounded-lg p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-purple-400" />
                    Pro Features
                  </h3>
                  <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">
                    PRO
                  </span>
                </div>
                
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center gap-2 text-xs text-white/80">
                    <Check className="w-3 h-3 text-purple-400" />
                    AI Chat Assistant
                  </li>
                  <li className="flex items-center gap-2 text-xs text-white/80">
                    <Check className="w-3 h-3 text-purple-400" />
                    Import from Spotify
                  </li>
                  <li className="flex items-center gap-2 text-xs text-white/80">
                    <Check className="w-3 h-3 text-purple-400" />
                    Guest Request Portal
                  </li>
                  <li className="flex items-center gap-2 text-xs text-white/80">
                    <Check className="w-3 h-3 text-purple-400" />
                    BPM & Energy Analysis
                  </li>
                </ul>
                
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium"
                >
                  Upgrade for {getPriceDisplay()}
                </button>
              </div>
              
              {/* Ready to Share */}
              <div className="glass-card rounded-lg p-4">
                <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  Ready to Share?
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button className="px-3 py-2 bg-white/10 rounded-lg text-xs text-white hover:bg-white/20 transition-colors">
                    <Download className="w-3 h-3 inline mr-1" />
                    Export
                  </button>
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="px-3 py-2 bg-white/10 rounded-lg text-xs text-white hover:bg-white/20 transition-colors"
                  >
                    <Share2 className="w-3 h-3 inline mr-1" />
                    Invite
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 glass-darker border-t border-white/10 md:hidden z-50">
          <div className="flex">
            <button
              onClick={() => setMobilePane('timeline')}
              className={`flex-1 py-3 text-xs font-medium transition-colors ${
                mobilePane === 'timeline'
                  ? 'text-white border-t-2 border-purple-400'
                  : 'text-white/60'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <Music className="w-5 h-5" />
                Timeline
              </div>
            </button>
            <button
              onClick={() => setMobilePane('assistant')}
              className={`flex-1 py-3 text-xs font-medium transition-colors ${
                mobilePane === 'assistant'
                  ? 'text-white border-t-2 border-purple-400'
                  : 'text-white/60'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <Sparkles className="w-5 h-5" />
                Assistant
              </div>
            </button>
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {draggedSong && (
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 shadow-2xl border border-white/20">
              <p className="text-sm font-medium text-white">{draggedSong.title}</p>
              <p className="text-xs text-white/60">{draggedSong.artist}</p>
            </div>
          )}
        </DragOverlay>

        {/* Modals */}
        <AddSongModal
          isOpen={showAddSongModal}
          onClose={() => {
            setShowAddSongModal(false);
            setAddSongMomentId(null);
          }}
          onAddSong={(song) => {
            if (addSongMomentId) {
              handleAddSongToMoment(song, addSongMomentId);
            }
          }}
          momentId={addSongMomentId}
        />
        
        {/* Quick Add Moment Selector */}
        {showQuickAddModal && quickAddSong && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60" onClick={() => {
              setShowQuickAddModal(false);
              setQuickAddSong(null);
            }} />
            <div className="relative glass-darker rounded-2xl p-6 max-w-md w-full">
              <button
                onClick={() => {
                  setShowQuickAddModal(false);
                  setQuickAddSong(null);
                }}
                className="absolute top-4 right-4 text-white/50 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-xl font-bold text-white mb-2">
                Where should this song go?
              </h2>
              <div className="mb-4">
                <p className="text-white font-medium">{quickAddSong.title}</p>
                <p className="text-sm text-white/60">{quickAddSong.artist}</p>
              </div>
              
              <div className="space-y-2">
                {timeline.map((moment) => (
                  <button
                    key={moment.id}
                    onClick={() => handleQuickAddToMoment(moment.id)}
                    className="w-full p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{moment.emoji}</span>
                      <div className="flex-1">
                        <p className="text-white font-medium">{moment.title}</p>
                        <p className="text-xs text-white/60">{moment.time} • {moment.songs.length} songs</p>
                      </div>
                      <Plus className="w-5 h-5 text-white/40 group-hover:text-white" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Auth Modal */}
        <ProgressiveAuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          trigger={authTrigger}
          metadata={{ totalSongs }}
        />
        
        {/* Share Modal */}
        {showShareModal && (
          <ShareModal
            onClose={() => setShowShareModal(false)}
            weddingId={weddingId}
            weddingData={weddingData}
          />
        )}
        
        {/* Settings Modal */}
        {showSettingsModal && (
          <SettingsModal
            onClose={() => setShowSettingsModal(false)}
            weddingData={weddingData}
            onUpdate={(data) => {
              setWeddingName(data.couple_names || weddingName);
              setWeddingDate(data.wedding_date || weddingDate);
              setVenue(data.venue_name || venue);
              setGuestCount(data.guest_count?.toString() || guestCount);
              setHasChanges(true);
            }}
          />
        )}
        
        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <UpgradeModal
            onClose={() => setShowUpgradeModal(false)}
            weddingId={weddingId}
            user={user}
          />
        )}
      </div>
    </DndContext>
  );
}