'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
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
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
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
  GripVertical,
  Trash2,
  MessageSquare,
  Upload,
  Headphones,
  Calendar,
  Settings,
  Edit2,
  LogOut
} from 'lucide-react';
import { DraggableSong } from '@/components/v3/DraggableSong';
import { DroppableMoment } from '@/components/v3/DroppableMoment';
import { AddSongModal } from '@/components/v3/AddSongModal';
import { AuthModal } from '@/components/v3/AuthModal';
import { ShareModal } from '@/components/v3/ShareModal';
import { SettingsModal } from '@/components/v3/SettingsModal';
import { UpgradeModal } from '@/components/v3/UpgradeModal';

// Song type with BPM for flow analysis
interface Song {
  id: string;
  title: string;
  artist: string;
  bpm?: number;
  label?: string;
  previewUrl?: string;
  spotifyId?: string;
  duration?: number;
}

// Complete song database
const COMPLETE_PLAYLIST: Record<string, Song[]> = {
  'getting-ready': [
    { id: 'gr1', title: 'Sunday Morning', artist: 'Maroon 5', bpm: 90, duration: 239 },
    { id: 'gr2', title: 'Here Comes the Sun', artist: 'The Beatles', bpm: 129, duration: 185 },
    { id: 'gr3', title: 'Lovely Day', artist: 'Bill Withers', bpm: 98, duration: 255 },
    { id: 'gr4', title: 'Good Day Sunshine', artist: 'The Beatles', bpm: 126, duration: 129 },
    { id: 'gr5', title: 'Walking on Sunshine', artist: 'Katrina & The Waves', bpm: 109, duration: 238 },
    { id: 'gr6', title: 'Happy', artist: 'Pharrell Williams', bpm: 160, duration: 233 },
    { id: 'gr7', title: 'Beautiful Day', artist: 'U2', bpm: 136, duration: 246 },
  ],
  'ceremony': [
    { id: 'c1', title: 'Canon in D', artist: 'Pachelbel', label: 'Processional', bpm: 64, duration: 300 },
    { id: 'c2', title: 'A Thousand Years', artist: 'Christina Perri', label: 'Bride Entrance', bpm: 139, duration: 285 },
    { id: 'c3', title: 'Make You Feel My Love', artist: 'Adele', label: 'Signing', bpm: 72, duration: 212 },
    { id: 'c4', title: 'Signed, Sealed, Delivered', artist: 'Stevie Wonder', label: 'Recessional', bpm: 113, duration: 180 },
  ],
  'cocktails': [
    { id: 'ct1', title: 'Fly Me to the Moon', artist: 'Frank Sinatra', bpm: 116, duration: 148 },
    { id: 'ct2', title: 'Valerie', artist: 'Amy Winehouse', bpm: 123, duration: 210 },
    { id: 'ct3', title: 'Golden', artist: 'Harry Styles', bpm: 90, duration: 208 },
    { id: 'ct4', title: 'Dreams', artist: 'Fleetwood Mac', bpm: 120, duration: 253 },
    { id: 'ct5', title: 'Three Little Birds', artist: 'Bob Marley', bpm: 76, duration: 180 },
    { id: 'ct6', title: 'La Vie En Rose', artist: 'Édith Piaf', bpm: 72, duration: 197 },
    { id: 'ct7', title: 'Feeling Good', artist: 'Michael Bublé', bpm: 60, duration: 236 },
    { id: 'ct8', title: 'Somewhere Over the Rainbow', artist: 'Israel Kamakawiwoʻole', bpm: 90, duration: 318 },
    { id: 'ct9', title: 'Stand By Me', artist: 'Ben E. King', bpm: 120, duration: 179 },
    { id: 'ct10', title: "Let's Stay Together", artist: 'Al Green', bpm: 100, duration: 198 },
  ],
  'dinner': [
    { id: 'd1', title: 'At Last', artist: 'Etta James', bpm: 95, duration: 180 },
    { id: 'd2', title: 'Wonderful Tonight', artist: 'Eric Clapton', bpm: 96, duration: 219 },
    { id: 'd3', title: 'Your Song', artist: 'Elton John', bpm: 70, duration: 241 },
    { id: 'd4', title: 'The Way You Look Tonight', artist: 'Tony Bennett', bpm: 116, duration: 217 },
    { id: 'd5', title: 'Thinking Out Loud', artist: 'Ed Sheeran', bpm: 80, duration: 281 },
    { id: 'd6', title: 'All of Me', artist: 'John Legend', bpm: 63, duration: 269 },
    { id: 'd7', title: 'Better Days', artist: 'OneRepublic', bpm: 73, duration: 252 },
    { id: 'd8', title: 'Sunday Morning', artist: 'The Velvet Underground', bpm: 96, duration: 176 },
  ],
  'first-dance': [
    { id: 'fd1', title: 'Perfect', artist: 'Ed Sheeran', bpm: 80, duration: 263 },
  ],
  'parent-dances': [
    { id: 'pd1', title: 'My Girl', artist: 'The Temptations', label: 'Father-Daughter', bpm: 132, duration: 165 },
    { id: 'pd2', title: "Isn't She Lovely", artist: 'Stevie Wonder', label: 'Father-Daughter Alt', bpm: 125, duration: 397 },
    { id: 'pd3', title: 'A Song for Mama', artist: 'Boyz II Men', label: 'Mother-Son', bpm: 79, duration: 321 },
    { id: 'pd4', title: 'Simple Man', artist: 'Lynyrd Skynyrd', label: 'Mother-Son Alt', bpm: 60, duration: 357 },
  ],
  'party': [
    { id: 'p1', title: 'September', artist: 'Earth, Wind & Fire', bpm: 122, duration: 215 },
    { id: 'p2', title: 'Uptown Funk', artist: 'Bruno Mars', bpm: 128, duration: 270 },
    { id: 'p3', title: 'Mr. Brightside', artist: 'The Killers', bpm: 148, duration: 222 },
    { id: 'p4', title: 'Shut Up and Dance', artist: 'Walk the Moon', bpm: 135, duration: 197 },
    { id: 'p5', title: "Can't Stop the Feeling", artist: 'Justin Timberlake', bpm: 113, duration: 236 },
    { id: 'p6', title: 'I Wanna Dance with Somebody', artist: 'Whitney Houston', bpm: 118, duration: 289 },
    { id: 'p7', title: 'Dancing Queen', artist: 'ABBA', bpm: 101, duration: 230 },
    { id: 'p8', title: 'Sweet Caroline', artist: 'Neil Diamond', bpm: 128, duration: 204 },
    { id: 'p9', title: "Don't Stop Believin'", artist: 'Journey', bpm: 119, duration: 251 },
    { id: 'p10', title: 'Wonderwall', artist: 'Oasis', bpm: 89, duration: 258 },
    { id: 'p11', title: 'Hey Ya!', artist: 'OutKast', bpm: 80, duration: 235 },
    { id: 'p12', title: 'Crazy in Love', artist: 'Beyoncé', bpm: 99, duration: 235 },
  ],
  'last-dance': [
    { id: 'ld1', title: 'Time of Your Life', artist: 'Green Day', bpm: 95, duration: 158 },
    { id: 'ld2', title: 'Closing Time', artist: 'Semisonic', bpm: 92, duration: 274 },
    { id: 'ld3', title: 'New York, New York', artist: 'Frank Sinatra', bpm: 100, duration: 207 },
  ]
};

// Countries & regions - Updated with correct UK regions and added Ireland
const COUNTRIES = {
  'UK': { 
    flag: '🇬🇧', 
    regions: ['London', 'North West', 'North East', 'South East', 'South West', 'Scotland', 'Wales'] 
  },
  'Ireland': { 
    flag: '🇮🇪', 
    regions: ['Dublin', 'Cork', 'Galway', 'Limerick', 'Belfast', 'Waterford'] 
  },
  'US': { 
    flag: '🇺🇸', 
    regions: ['Northeast', 'South', 'West Coast', 'Midwest'] 
  },
  'Australia': { 
    flag: '🇦🇺', 
    regions: ['Sydney', 'Melbourne', 'Brisbane', 'Perth'] 
  },
  'Canada': { 
    flag: '🇨🇦', 
    regions: ['Toronto', 'Vancouver', 'Montreal', 'Calgary'] 
  },
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

// Popular first dance songs
const FIRST_DANCE_SUGGESTIONS = [
  { id: 'fd-sug-1', title: 'Perfect', artist: 'Ed Sheeran', duration: 263 },
  { id: 'fd-sug-2', title: 'At Last', artist: 'Etta James', duration: 180 },
  { id: 'fd-sug-3', title: 'All of Me', artist: 'John Legend', duration: 269 },
  { id: 'fd-sug-4', title: 'Thinking Out Loud', artist: 'Ed Sheeran', duration: 281 },
  { id: 'fd-sug-5', title: 'Make You Feel My Love', artist: 'Adele', duration: 212 },
];

interface TimelineMoment {
  id: string;
  time: string;
  duration: string;
  title: string;
  emoji: string;
  songs: Song[];
}

export default function V3ThreePanePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [weddingData, setWeddingData] = useState<any>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [weddingDate, setWeddingDate] = useState<string | null>(null);
  const [weddingName, setWeddingName] = useState<string>('Your Wedding');
  const [isEditingName, setIsEditingName] = useState(false);
  const [mobileTab, setMobileTab] = useState<'customize' | 'timeline' | 'studio'>('timeline');
  
  // State
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['pop', 'rnb']);
  const [timeline, setTimeline] = useState<TimelineMoment[]>([]);
  const [expandedMoments, setExpandedMoments] = useState<string[]>(['first-dance']);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedSong, setDraggedSong] = useState<Song | null>(null);
  const [isDraggingToTrash, setIsDraggingToTrash] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showAddSongModal, setShowAddSongModal] = useState(false);
  const [addSongMomentId, setAddSongMomentId] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [quickAddSong, setQuickAddSong] = useState<Song | null>(null);
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [leftPaneTab, setLeftPaneTab] = useState<'build' | 'manage' | 'guests'>('build');
  const [guestList, setGuestList] = useState<any[]>([]);
  
  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  
  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // Load wedding data if exists
        try {
          const weddingDoc = await getDoc(doc(db, 'weddings', user.uid));
          if (weddingDoc.exists()) {
            const data = weddingDoc.data();
            setWeddingData(data);
            // Load saved timeline if exists
            if (data.timeline) {
              setTimeline(data.timeline);
            }
            if (data.selectedGenres) {
              setSelectedGenres(data.selectedGenres);
            }
            if (data.selectedCountry) {
              setSelectedCountry(data.selectedCountry);
            }
            if (data.weddingDate) {
              setWeddingDate(data.weddingDate);
            }
            if (data.partner1Name && data.partner2Name) {
              setWeddingName(`${data.partner1Name} & ${data.partner2Name}`);
            }
          }
        } catch (error) {
          console.error('Error loading wedding data:', error);
        }
      } else {
        setUser(null);
        setWeddingData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Initialize timeline
  useEffect(() => {
    if (weddingData?.timeline) return; // Don't initialize if we have saved data
    const initialTimeline: TimelineMoment[] = [
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
  }, [weddingData]);

  // Calculate stats
  const totalSongs = timeline.reduce((sum, moment) => sum + (moment.songs?.length || 0), 0);
  const totalDuration = timeline.reduce((sum, moment) => {
    const momentDuration = moment.songs?.reduce((s, song) => s + (song.duration || 0), 0) || 0;
    return sum + momentDuration;
  }, 0);
  const totalHours = Math.floor(totalDuration / 3600);
  const totalMinutes = Math.floor((totalDuration % 3600) / 60);
  
  // Calculate days until wedding
  const daysUntilWedding = weddingDate 
    ? Math.ceil((new Date(weddingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;
  
  // Track changes
  useEffect(() => {
    if (timeline.length > 0 && !loading) {
      setHasChanges(true);
    }
  }, [timeline, selectedGenres, selectedCountry, loading]);

  // Save timeline to database
  const saveTimeline = async () => {
    if (!user) {
      setShowAccountModal(true);
      return;
    }

    try {
      await setDoc(doc(db, 'weddings', user.uid), {
        timeline,
        selectedGenres,
        selectedCountry,
        totalSongs,
        totalDuration,
        weddingDate,
        weddingName,
        updatedAt: new Date().toISOString(),
        userId: user.uid
      }, { merge: true });
      
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving timeline:', error);
    }
  };

  // Spotify search for quick add
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}&limit=5`);
      if (!response.ok) {
        console.error('Search response not ok:', response.status);
        setSearchResults([]);
        return;
      }
      
      const data = await response.json();
      console.log('Search response:', data);
      
      // Map tracks to songs format
      const songs = (data.tracks || []).map((track: any) => ({
        id: track.id || `song-${Date.now()}-${Math.random()}`,
        title: track.name || track.title,
        artist: track.artist,
        album: track.album,
        spotifyId: track.id,
        previewUrl: track.preview_url,
        duration: track.duration_ms ? Math.floor(track.duration_ms / 1000) : undefined
      }));
      
      setSearchResults(songs);
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
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);
  
  // Play/Pause functionality
  const handlePlaySong = (song: Song, songId: string) => {
    if (audioElement) {
      audioElement.pause();
    }

    if (song.previewUrl) {
      const audio = new Audio(song.previewUrl);
      audio.volume = 0.5;
      audio.play().catch(err => console.error('Play failed:', err));
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
  
  // Toggle moment expansion
  const toggleMoment = (momentId: string) => {
    setExpandedMoments(prev =>
      prev.includes(momentId)
        ? prev.filter(id => id !== momentId)
        : [...prev, momentId]
    );
  };
  
  // Drag and Drop handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const [momentId, songIndex] = active.id.toString().split('-song-');
    const moment = timeline.find(m => m.id === momentId);
    if (moment && songIndex !== undefined) {
      setDraggedSong(moment.songs[parseInt(songIndex)]);
      setIsDragging(true);
    }
  };
  
  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    setIsDraggingToTrash(over?.id === 'trash-zone');
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setIsDragging(false);
    setDraggedSong(null);
    setIsDraggingToTrash(false);
    
    if (!over) return;
    
    // Handle trash
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
    
    // Parse drag IDs
    const [sourceMomentId, sourceSongIndex] = active.id.toString().split('-song-');
    const sourceIndex = parseInt(sourceSongIndex);
    
    // Handle drop on moment header (add to end)
    if (over.id.toString().startsWith('moment-')) {
      const targetMomentId = over.id.toString().replace('moment-', '');
      
      if (sourceMomentId === targetMomentId) return; // Same moment, no move
      
      setTimeline(prev => {
        const newTimeline = [...prev];
        const sourceMoment = newTimeline.find(m => m.id === sourceMomentId);
        const targetMoment = newTimeline.find(m => m.id === targetMomentId);
        
        if (sourceMoment && targetMoment) {
          const [movedSong] = sourceMoment.songs.splice(sourceIndex, 1);
          targetMoment.songs.push(movedSong);
        }
        
        return newTimeline;
      });
      return;
    }
    
    // Handle reorder within or between moments
    if (over.id.toString().includes('-song-')) {
      const [targetMomentId, targetSongIndex] = over.id.toString().split('-song-');
      const targetIndex = parseInt(targetSongIndex);
      
      setTimeline(prev => {
        const newTimeline = [...prev];
        const sourceMomentIndex = newTimeline.findIndex(m => m.id === sourceMomentId);
        const targetMomentIndex = newTimeline.findIndex(m => m.id === targetMomentId);
        
        if (sourceMomentIndex !== -1 && targetMomentIndex !== -1) {
          if (sourceMomentId === targetMomentId) {
            // Same moment - reorder using arrayMove
            const newSongs = arrayMove(
              newTimeline[sourceMomentIndex].songs,
              sourceIndex,
              targetIndex
            );
            newTimeline[sourceMomentIndex] = {
              ...newTimeline[sourceMomentIndex],
              songs: newSongs
            };
          } else {
            // Different moments - move between
            const sourceMoment = newTimeline[sourceMomentIndex];
            const targetMoment = newTimeline[targetMomentIndex];
            const [movedSong] = sourceMoment.songs.splice(sourceIndex, 1);
            targetMoment.songs.splice(targetIndex, 0, movedSong);
          }
        }
        
        return newTimeline;
      });
    }
  };
  
  // Add song from search/modal
  const handleAddSongToMoment = (song: Song, momentId: string) => {
    setTimeline(prev => prev.map(moment => {
      if (moment.id === momentId) {
        return { ...moment, songs: [...moment.songs, song] };
      }
      return moment;
    }));
    setShowAddSongModal(false);
    setAddSongMomentId(null);
  };
  
  // Remove song from moment
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
  
  // Quick add song from search - show moment selector
  const handleQuickAddSong = (song: Song) => {
    setQuickAddSong(song);
    setShowQuickAddModal(true);
  };
  
  // Add song to selected moment from quick add
  const handleQuickAddToMoment = (momentId: string) => {
    if (quickAddSong) {
      handleAddSongToMoment(quickAddSong, momentId);
      setQuickAddSong(null);
      setShowQuickAddModal(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };
  
  // Set first dance
  const handleSetFirstDance = (song: Song) => {
    setTimeline(prev => prev.map(moment => {
      if (moment.id === 'first-dance') {
        return { ...moment, songs: [song] };
      }
      return moment;
    }));
  };
  
  // Open add song modal
  const openAddSongModal = (momentId: string) => {
    setAddSongMomentId(momentId);
    setShowAddSongModal(true);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen dark-gradient relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="orb orb-purple w-96 h-96 -top-48 -right-48"></div>
          <div className="orb orb-blue w-96 h-96 -bottom-48 -left-48"></div>
        </div>

        {/* Enhanced Header */}
        <header className="sticky top-0 z-50 glass-darker backdrop-blur-md border-b border-white/10">
          <div className="container-fluid px-4">
            <div className="flex items-center justify-between h-16 gap-4">
              {/* Left: Logo & Wedding Name */}
              <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                    <Music className="w-5 h-5 text-white" />
                  </div>
                </Link>
                
                {user && (
                  <div className="hidden sm:flex items-center gap-2">
                    {isEditingName ? (
                      <input
                        type="text"
                        value={weddingName}
                        onChange={(e) => setWeddingName(e.target.value)}
                        onBlur={() => {
                          setIsEditingName(false);
                          setHasChanges(true);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setIsEditingName(false);
                            setHasChanges(true);
                          }
                        }}
                        className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                        autoFocus
                      />
                    ) : (
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="flex items-center gap-1 hover:bg-white/10 px-2 py-1 rounded transition-colors"
                      >
                        <span className="text-white font-medium">{weddingName}</span>
                        <Edit2 className="w-3 h-3 text-white/40" />
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              {/* Center: Stats - Hide on mobile */}
              <div className="hidden md:flex items-center gap-6">
                {daysUntilWedding !== null && daysUntilWedding > 0 && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <span className="text-white font-medium">{daysUntilWedding}</span>
                    <span className="text-white/60 text-sm">days to go</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-purple-400" />
                  <span className="text-white font-medium">{totalSongs}</span>
                  <span className="text-white/60 text-sm">songs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span className="text-white font-medium">{totalHours}h {totalMinutes}m</span>
                  <span className="text-white/60 text-sm">playtime</span>
                </div>
              </div>
              
              {/* Right: Actions */}
              <div className="flex items-center gap-2">
                {hasChanges && (
                  <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                    Unsaved
                  </span>
                )}
                {user ? (
                  <>
                    <button
                      onClick={saveTimeline}
                      disabled={!hasChanges}
                      className={`px-4 py-1.5 text-white text-sm rounded-lg transition-all ${
                        hasChanges 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90' 
                          : 'bg-white/10 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowShareModal(true)}
                      className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                      title="Share & Invite"
                    >
                      <Share2 className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => setShowSettingsModal(true)}
                      className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                      title="Settings"
                    >
                      <Settings className="w-4 h-4 text-white" />
                    </button>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                      <span className="text-sm text-white hidden sm:inline">{user.email?.split('@')[0]}</span>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => setShowAccountModal(true)}
                    className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm rounded-lg hover:opacity-90"
                  >
                    Save Playlist
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Bottom Tabs - Visible on small screens */}
        <div className="fixed bottom-0 left-0 right-0 glass-darker border-t border-white/10 md:hidden z-50">
          <div className="flex">
            <button
              onClick={() => setMobileTab('customize')}
              className={`flex-1 py-3 text-xs font-medium transition-colors ${
                mobileTab === 'customize'
                  ? 'text-white border-t-2 border-purple-400'
                  : 'text-white/60'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <Heart className="w-5 h-5" />
                Customize
              </div>
            </button>
            <button
              onClick={() => setMobileTab('timeline')}
              className={`flex-1 py-3 text-xs font-medium transition-colors ${
                mobileTab === 'timeline'
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
              onClick={() => setMobileTab('studio')}
              className={`flex-1 py-3 text-xs font-medium transition-colors ${
                mobileTab === 'studio'
                  ? 'text-white border-t-2 border-purple-400'
                  : 'text-white/60'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <Sparkles className="w-5 h-5" />
                Studio
              </div>
            </button>
          </div>
        </div>

        {/* Three-Pane Layout - Desktop */}
        <div className="hidden md:flex h-[calc(100vh-3.5rem)] relative z-10">
          
          {/* LEFT PANE: Customization (Desktop) */}
          <div className="w-80 glass-darker border-r border-white/10 flex flex-col">
            {/* Tab Navigation for Authenticated Users */}
            {user && (
              <div className="border-b border-white/10">
                <div className="flex">
                  <button
                    onClick={() => setLeftPaneTab('build')}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                      leftPaneTab === 'build'
                        ? 'text-white border-b-2 border-purple-400'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Music className="w-4 h-4" />
                      Build
                    </div>
                  </button>
                  <button
                    onClick={() => setLeftPaneTab('manage')}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                      leftPaneTab === 'manage'
                        ? 'text-white border-b-2 border-purple-400'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Settings className="w-4 h-4" />
                      Manage
                    </div>
                  </button>
                  <button
                    onClick={() => setLeftPaneTab('guests')}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                      leftPaneTab === 'guests'
                        ? 'text-white border-b-2 border-purple-400'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Users className="w-4 h-4" />
                      Guests
                    </div>
                  </button>
                </div>
              </div>
            )}
            
            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {(!user || leftPaneTab === 'build') && (
                <>
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
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('selectedCountry', e.target.value);
                  }
                }}
              >
                <option value="">Select country</option>
                {Object.entries(COUNTRIES).map(([country, data]) => (
                  <option key={country} value={country}>
                    {data.flag} {country}
                  </option>
                ))}
              </select>
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
              {selectedGenres.length > 0 && (
                <p className="text-xs text-purple-400 mt-2">
                  ✓ Playlist customized for {selectedGenres.join(', ')}
                </p>
              )}
            </div>
            
            {/* Choose Your First Dance */}
            <div className="glass-card rounded-lg p-4 bg-gradient-to-r from-pink-600/10 to-purple-600/10">
              <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                <Headphones className="w-4 h-4 text-pink-400" />
                Choose Your First Dance
              </h3>
              <button
                onClick={() => openAddSongModal('first-dance')}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Add Your First Dance Song</span>
              </button>
              <p className="text-xs text-white/40 mt-2 text-center">
                This is your special moment - choose the perfect song
              </p>
            </div>
            
            {/* Analyze Spotify Taste - Pro Feature */}
            <div className="glass-card rounded-lg p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 relative">
              <div className="absolute top-2 right-2">
                <span className="px-2 py-0.5 bg-purple-600 text-white text-xs rounded-full">PRO</span>
              </div>
              <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                AI Taste Analysis
              </h3>
              <button
                onClick={() => setShowAccountModal(true)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white/50 hover:bg-white/20 hover:text-white transition-colors flex items-center justify-center gap-2 relative overflow-hidden"
              >
                <Lock className="w-4 h-4" />
                <span className="text-sm">Analyze Your Spotify</span>
              </button>
              <p className="text-xs text-white/40 mt-2 text-center">
                AI learns your music taste to create the perfect wedding flow with BPM matching
              </p>
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/40"
                />
              </div>
              
              {/* Search Results */}
              {searchQuery && (
                <div className="mt-2 max-h-48 overflow-y-auto">
                  {isSearching ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-4 h-4 animate-spin text-white/60" />
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-1">
                      {searchResults.map((song) => (
                        <button
                          key={song.id}
                          onClick={() => handleQuickAddSong(song)}
                          className="w-full p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-left group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-sm text-white font-medium">{song.title}</p>
                              <p className="text-xs text-white/60">{song.artist}</p>
                            </div>
                            <Plus className="w-4 h-4 text-white/40 group-hover:text-white/60" />
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-white/40 text-center py-2">
                      {searchQuery.length < 2 ? 'Keep typing...' : 'No results found'}
                    </p>
                  )}
                </div>
              )}
              
              <p className="text-xs text-white/40 mt-2">
                Search powered by Spotify
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
                  <span className="text-white font-medium">{totalHours}h {totalMinutes}m</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Customized</span>
                  <span className="text-white font-medium">
                    {selectedGenres.length > 0 ? `✓ ${selectedGenres.length} genres` : 'Not yet'}
                  </span>
                </div>
              </div>
            </div>
            
                  {/* Trash Zone */}
                  {isDragging && (
                    <div 
                      id="trash-zone"
                      className={`glass-card rounded-lg p-4 border-2 border-dashed ${
                        isDraggingToTrash ? 'border-red-500 bg-red-500/20' : 'border-white/20'
                      } transition-all`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Trash2 className={`w-5 h-5 ${isDraggingToTrash ? 'text-red-400' : 'text-white/40'}`} />
                        <span className={`text-sm ${isDraggingToTrash ? 'text-red-400' : 'text-white/40'}`}>
                          Drop here to remove
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
              
              {/* MANAGE TAB */}
              {user && leftPaneTab === 'manage' && (
                <>
                  <div>
                    <h2 className="text-sm font-semibold text-white/50 uppercase mb-3">Wedding Settings</h2>
                  </div>
                  
                  <div className="glass-card rounded-lg p-4">
                    <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      Wedding Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-white/60">Wedding Date</label>
                        <input
                          type="date"
                          value={weddingDate || ''}
                          onChange={(e) => {
                            setWeddingDate(e.target.value);
                            setHasChanges(true);
                          }}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/60">Venue</label>
                        <input
                          type="text"
                          placeholder="Enter venue name"
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/40"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/60">Guest Count</label>
                        <input
                          type="number"
                          placeholder="Expected guests"
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/40"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass-card rounded-lg p-4">
                    <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                      <UserPlus className="w-4 h-4 text-purple-400" />
                      Partner Access
                    </h3>
                    <p className="text-xs text-white/60 mb-3">
                      Share access with your partner to build together
                    </p>
                    <button
                      onClick={() => setShowShareModal(true)}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      Invite Partner
                    </button>
                  </div>
                  
                  <div className="glass-card rounded-lg p-4">
                    <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                      <Download className="w-4 h-4 text-purple-400" />
                      Export Options
                    </h3>
                    <div className="space-y-2">
                      <button className="w-full px-3 py-2 bg-white/10 rounded-lg text-white text-sm hover:bg-white/20 transition-colors text-left">
                        Export to Spotify
                      </button>
                      <button className="w-full px-3 py-2 bg-white/10 rounded-lg text-white text-sm hover:bg-white/20 transition-colors text-left">
                        Download for DJ
                      </button>
                      <button className="w-full px-3 py-2 bg-white/10 rounded-lg text-white text-sm hover:bg-white/20 transition-colors text-left">
                        Print Timeline
                      </button>
                    </div>
                  </div>
                </>
              )}
              
              {/* GUESTS TAB */}
              {user && leftPaneTab === 'guests' && (
                <>
                  <div>
                    <h2 className="text-sm font-semibold text-white/50 uppercase mb-3">Guest Management</h2>
                  </div>
                  
                  <div className="glass-card rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-400" />
                        Guest List
                      </h3>
                      <span className="text-xs bg-purple-600/20 text-purple-400 px-2 py-1 rounded-full">
                        {guestList.length} guests
                      </span>
                    </div>
                    <button
                      onClick={() => setShowShareModal(true)}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      Share Invite Link
                    </button>
                  </div>
                  
                  {guestList.length > 0 ? (
                    <div className="glass-card rounded-lg p-4">
                      <h4 className="text-sm font-medium text-white mb-3">Recent Submissions</h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {guestList.slice(0, 5).map((guest: any, idx: number) => (
                          <div key={idx} className="p-2 bg-white/5 rounded-lg">
                            <p className="text-sm text-white font-medium">{guest.name}</p>
                            <p className="text-xs text-white/60">{guest.songCount || 0} songs suggested</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="glass-card rounded-lg p-4">
                      <div className="text-center py-4">
                        <Users className="w-12 h-12 text-white/20 mx-auto mb-2" />
                        <p className="text-sm text-white/60">No guests yet</p>
                        <p className="text-xs text-white/40 mt-1">
                          Share your wedding link to collect song suggestions
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="glass-card rounded-lg p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20">
                    <h3 className="font-medium text-white mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-purple-400" />
                      Guest Features
                    </h3>
                    <ul className="space-y-1 text-xs text-white/60">
                      <li>• Guests can suggest up to 5 songs</li>
                      <li>• Vote on other suggestions</li>
                      <li>• Leave special dedications</li>
                      <li>• RSVP through the link</li>
                    </ul>
                  </div>
                </>
              )}
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
                <DroppableMoment
                  key={moment.id}
                  moment={moment}
                  isExpanded={expandedMoments.includes(moment.id)}
                  onToggle={() => toggleMoment(moment.id)}
                  onAddSong={() => openAddSongModal(moment.id)}
                  onPlaySong={handlePlaySong}
                  onPauseSong={handlePauseSong}
                  onRemoveSong={handleRemoveSong}
                  playingId={playingId}
                />
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
                  onClick={() => setAnalysisResults(null)}
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
                  <MessageSquare className="w-3 h-3 text-white/40" />
                  AI Assistant & Chat
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="w-3 h-3 text-white/40" />
                  BPM & Energy matching
                </li>
                <li className="flex items-center gap-2">
                  <Upload className="w-3 h-3 text-white/40" />
                  Import Spotify playlists
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="w-3 h-3 text-white/40" />
                  Unlimited saves
                </li>
                <li className="flex items-center gap-2">
                  <Users className="w-3 h-3 text-white/40" />
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

        {/* Mobile Layout - Single pane view with bottom tabs */}
        <div className="md:hidden h-[calc(100vh-3.5rem-3.5rem)] relative z-10 overflow-y-auto">
          {mobileTab === 'customize' && (
            <div className="p-4 space-y-4 pb-20">
              {/* Mobile tabs for authenticated users */}
              {user && (
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setLeftPaneTab('build')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      leftPaneTab === 'build'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/10 text-white/70'
                    }`}
                  >
                    Build
                  </button>
                  <button
                    onClick={() => setLeftPaneTab('manage')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      leftPaneTab === 'manage'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/10 text-white/70'
                    }`}
                  >
                    Manage
                  </button>
                  <button
                    onClick={() => setLeftPaneTab('guests')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      leftPaneTab === 'guests'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/10 text-white/70'
                    }`}
                  >
                    Guests
                  </button>
                </div>
              )}
              
              {/* Customize content - same as left pane */}
              {(!user || leftPaneTab === 'build') && (
                <>
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
                      onChange={(e) => {
                        setSelectedCountry(e.target.value);
                        if (typeof window !== 'undefined') {
                          localStorage.setItem('selectedCountry', e.target.value);
                        }
                      }}
                    >
                      <option value="">Select country</option>
                      {Object.entries(COUNTRIES).map(([country, data]) => (
                        <option key={country} value={country}>
                          {data.flag} {country}
                        </option>
                      ))}
                    </select>
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
                  
                  {/* Quick Add */}
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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/40"
                      />
                    </div>
                    {searchQuery && searchResults.length > 0 && (
                      <div className="mt-2 max-h-48 overflow-y-auto space-y-1">
                        {searchResults.map((song) => (
                          <button
                            key={song.id}
                            onClick={() => handleQuickAddSong(song)}
                            className="w-full p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-left"
                          >
                            <p className="text-sm text-white font-medium">{song.title}</p>
                            <p className="text-xs text-white/60">{song.artist}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
              
              {/* Manage/Guests tabs for mobile authenticated users */}
              {user && leftPaneTab === 'manage' && (
                <>
                  <div>
                    <h2 className="text-sm font-semibold text-white/50 uppercase mb-3">Wedding Settings</h2>
                  </div>
                  {/* Same manage content as desktop */}
                </>
              )}
              
              {user && leftPaneTab === 'guests' && (
                <>
                  <div>
                    <h2 className="text-sm font-semibold text-white/50 uppercase mb-3">Guest Management</h2>
                  </div>
                  {/* Same guests content as desktop */}
                </>
              )}
            </div>
          )}
          
          {mobileTab === 'timeline' && (
            <div className="overflow-y-auto bg-black/20">
              {/* Timeline Header */}
              <div className="sticky top-0 glass-darker backdrop-blur-md border-b border-white/10 px-4 py-3 z-10">
                <h2 className="text-xl font-bold text-white">YOUR WEDDING TIMELINE</h2>
                <p className="text-xs text-white/60">Tap to expand • Drag to reorder</p>
              </div>
              
              {/* Timeline Content */}
              <div className="p-4 space-y-4 pb-20">
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
          )}
          
          {mobileTab === 'studio' && (
            <div className="p-4 space-y-4 pb-20">
              {/* AI Assistant */}
              <div className="glass-gradient rounded-xl p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">AI Assistant</h4>
                    <p className="text-xs text-white/60">Get smart suggestions</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button className="glass-darker rounded-lg p-2 text-xs text-white">
                    Generate Mix
                  </button>
                  <button className="glass-darker rounded-lg p-2 text-xs text-white">
                    Fix Energy Flow
                  </button>
                </div>
              </div>
              
              {/* BPM Analysis */}
              <div className="glass-gradient rounded-xl p-4">
                <h4 className="font-semibold text-white mb-3">Energy Flow</h4>
                <div className="h-32 flex items-end justify-between gap-1">
                  {timeline.map((moment, idx) => (
                    <div key={moment.id} className="flex-1 flex flex-col items-center gap-1">
                      <div 
                        className="w-full bg-gradient-to-t from-purple-600 to-pink-600 rounded-t"
                        style={{ height: `${(idx + 1) * 15}%` }}
                      />
                      <span className="text-xs text-white/40 rotate-45 origin-left">
                        {moment.emoji}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Pro Features */}
              <div className="glass-gradient rounded-xl p-4 border border-purple-500/30">
                <h4 className="font-semibold text-white mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Pro Features
                </h4>
                <ul className="text-xs text-white/60 space-y-1">
                  <li>• AI Chat Assistant</li>
                  <li>• Spotify Import</li>
                  <li>• Unlimited saves</li>
                </ul>
                <button 
                  onClick={() => setShowUpgradeModal(true)}
                  className="w-full mt-3 px-3 py-2 bg-purple-600 text-white rounded-lg text-xs"
                >
                  Upgrade • $25
                </button>
              </div>
            </div>
          )}
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

        {/* Add Song Modal */}
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

        {/* Quick Add Moment Selector Modal */}
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
        <AuthModal
          isOpen={showAccountModal}
          onClose={() => setShowAccountModal(false)}
          onSuccess={saveTimeline}
          totalSongs={totalSongs}
        />

        {/* Share Modal */}
        {showShareModal && (
          <ShareModal
            onClose={() => setShowShareModal(false)}
            weddingId={user?.uid}
            weddingData={weddingData}
          />
        )}

        {/* Settings Modal */}
        {showSettingsModal && (
          <SettingsModal
            onClose={() => setShowSettingsModal(false)}
            weddingData={weddingData}
            onUpdate={(data) => {
              setWeddingData({ ...weddingData, ...data });
              setWeddingName(data.weddingName || weddingName);
              setWeddingDate(data.weddingDate || weddingDate);
              setHasChanges(true);
            }}
          />
        )}

        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <UpgradeModal
            onClose={() => setShowUpgradeModal(false)}
            weddingId={user?.uid}
            user={user}
          />
        )}
      </div>
    </DndContext>
  );
}