'use client';

import React, { useState, useEffect } from 'react';
import { 
  Music, 
  Sparkles,
  Play,
  Plus,
  X,
  Check,
  Clock,
  Users,
  Loader2,
  Search,
  ChevronDown,
  ChevronUp,
  Pause,
  ExternalLink
} from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration?: number;
  previewUrl?: string;
  albumArt?: string;
  spotifyUrl?: string;
  moment?: string;
  mood?: string;
  confidence?: number;
  reason?: string;
}

interface TimelineSection {
  id: string;
  time: string;
  duration: string;
  title: string;
  emoji: string;
  energy: number;
  description: string;
  tip: string;
  songs: Song[];
  expandable?: number;
}

interface PlaylistBuilderProps {
  coupleNames: string[];
  vibe: string;
  mustPlaySongs: string[];
  customInstructions: string;
  onSave?: (playlist: any) => void;
}

export default function PlaylistBuilder({
  coupleNames,
  vibe,
  mustPlaySongs,
  customInstructions,
  onSave
}: PlaylistBuilderProps) {
  const [timeline, setTimeline] = useState<TimelineSection[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [playingPreview, setPlayingPreview] = useState<string | null>(null);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [playlistInsights, setPlaylistInsights] = useState<any>(null);

  // Generate AI playlist
  const generatePlaylist = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate-playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coupleNames,
          vibe,
          mustPlaySongs: mustPlaySongs.filter(s => s.trim()),
          customInstructions,
          timeline: [
            { moment: 'cocktail', duration: 60 },
            { moment: 'dinner', duration: 90 },
            { moment: 'first_dance', duration: 5 },
            { moment: 'party_warmup', duration: 30 },
            { moment: 'party_peak', duration: 120 },
            { moment: 'last_dance', duration: 5 }
          ]
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.playlist) {
        // Convert to timeline sections
        const sections = createTimelineSections(data.playlist);
        setTimeline(sections);
        setPlaylistInsights(data.playlist.insights);
      } else {
        console.error('Failed to generate playlist:', data);
        // Use fallback
        if (data.fallback) {
          const sections = createTimelineSections(data.fallback);
          setTimeline(sections);
        }
      }
    } catch (error) {
      console.error('Error generating playlist:', error);
    }
    
    setIsGenerating(false);
  };

  // Create timeline sections from API response
  const createTimelineSections = (playlist: any): TimelineSection[] => {
    const momentConfig = {
      cocktail: {
        time: '5:00 PM',
        duration: '60 min',
        title: 'Cocktail Hour',
        emoji: '🥂',
        energy: 3,
        description: 'Mingling and drinks',
        tip: 'Mix genres to appeal to all age groups'
      },
      dinner: {
        time: '6:00 PM',
        duration: '90 min',
        title: 'Dinner',
        emoji: '🍽️',
        energy: 2,
        description: 'Background music for conversation',
        tip: 'Keep it low-key so guests can talk'
      },
      first_dance: {
        time: '7:30 PM',
        duration: '5 min',
        title: 'First Dance',
        emoji: '💑',
        energy: 3,
        description: 'Your special moment',
        tip: 'Choose a song that tells your story'
      },
      party_warmup: {
        time: '7:35 PM',
        duration: '30 min',
        title: 'Party Warm-up',
        emoji: '🎵',
        energy: 4,
        description: 'Getting everyone on the floor',
        tip: 'Build energy gradually'
      },
      party_peak: {
        time: '8:05 PM',
        duration: '120 min',
        title: 'Dance Party',
        emoji: '🕺',
        energy: 5,
        description: 'Peak celebration',
        tip: 'Mix current hits with classics'
      },
      last_dance: {
        time: '10:05 PM',
        duration: '5 min',
        title: 'Last Dance',
        emoji: '✨',
        energy: 3,
        description: 'Send-off song',
        tip: 'End on a memorable note'
      }
    };
    
    const sections: TimelineSection[] = [];
    
    // Create sections based on moments
    if (playlist.moments) {
      for (const [moment, config] of Object.entries(momentConfig)) {
        const momentSongs = playlist.songs.filter((s: Song) => 
          s.moment === moment || 
          (playlist.moments[moment] && playlist.moments[moment].songs.includes(s.id))
        );
        
        if (momentSongs.length > 0) {
          sections.push({
            id: moment,
            ...config,
            songs: momentSongs.slice(0, 10), // Limit display
            expandable: momentSongs.length > 10 ? momentSongs.length - 10 : undefined
          });
        }
      }
    } else {
      // Fallback distribution
      const songsPerSection = Math.ceil(playlist.songs.length / 6);
      let songIndex = 0;
      
      for (const [moment, config] of Object.entries(momentConfig)) {
        const sectionSongs = playlist.songs.slice(songIndex, songIndex + songsPerSection);
        songIndex += songsPerSection;
        
        if (sectionSongs.length > 0) {
          sections.push({
            id: moment,
            ...config,
            songs: sectionSongs
          });
        }
      }
    }
    
    return sections;
  };

  // Search for songs
  const searchSongs = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    try {
      const response = await fetch(`/api/search-songs?q=${encodeURIComponent(query)}&limit=10`);
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.songs);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
    
    setIsSearching(false);
  };

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      searchSongs(searchQuery);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Add song to section
  const addSongToSection = (sectionId: string, song: Song) => {
    setTimeline(prev => prev.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          songs: [...section.songs, song]
        };
      }
      return section;
    }));
    setSearchQuery('');
    setSearchResults([]);
  };

  // Remove song from section
  const removeSongFromSection = (sectionId: string, songId: string) => {
    setTimeline(prev => prev.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          songs: section.songs.filter(s => s.id !== songId)
        };
      }
      return section;
    }));
  };

  // Play/pause preview
  const togglePreview = (url: string) => {
    if (playingPreview === url) {
      audioRef?.pause();
      setPlayingPreview(null);
    } else {
      if (audioRef) {
        audioRef.pause();
      }
      const audio = new Audio(url);
      audio.play();
      setAudioRef(audio);
      setPlayingPreview(url);
      
      audio.addEventListener('ended', () => {
        setPlayingPreview(null);
      });
    }
  };

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  // Calculate total duration
  const totalDuration = timeline.reduce((sum, section) => {
    const minutes = parseInt(section.duration);
    return sum + (isNaN(minutes) ? 0 : minutes);
  }, 0);

  const totalSongs = timeline.reduce((sum, section) => sum + section.songs.length, 0);

  // Generate on mount if we have inputs
  useEffect(() => {
    if (coupleNames.length > 0 && vibe) {
      generatePlaylist();
    }
  }, []); // Only on mount

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">{totalDuration} minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">{totalSongs} songs</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">{vibe}</span>
            </div>
          </div>
          
          <button
            onClick={generatePlaylist}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Regenerating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Regenerate
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Insights */}
      {playlistInsights && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            AI Insights
          </h3>
          <div className="space-y-2">
            {playlistInsights.strengths?.slice(0, 2).map((strength: string, i: number) => (
              <div key={i} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{strength}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for songs to add..."
          className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        
        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
            {searchResults.map(song => (
              <div key={song.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{song.title}</p>
                    <p className="text-xs text-gray-500">{song.artist}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {song.previewUrl && (
                      <button
                        onClick={() => togglePreview(song.previewUrl!)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                      >
                        {playingPreview === song.previewUrl ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </button>
                    )}
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          addSongToSection(e.target.value, song);
                        }
                      }}
                      className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 rounded"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="">Add to...</option>
                      {timeline.map(section => (
                        <option key={section.id} value={section.id}>
                          {section.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {isGenerating ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : (
          timeline.map((section, index) => (
            <div key={section.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Section Header */}
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{section.emoji}</span>
                    <div>
                      <h3 className="font-semibold">{section.title}</h3>
                      <p className="text-sm text-gray-500">
                        {section.time} · {section.duration} · {section.songs.length} songs
                      </p>
                    </div>
                  </div>
                  {expandedSections.has(section.id) ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                
                {/* Energy indicator */}
                <div className="flex gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 w-8 rounded ${
                        i < section.energy
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Section Content */}
              {expandedSections.has(section.id) && (
                <div className="border-t border-gray-200 dark:border-gray-700">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/30">
                    <p className="text-sm text-gray-600 dark:text-gray-300">{section.description}</p>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">💡 {section.tip}</p>
                  </div>
                  
                  {/* Songs */}
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {section.songs.map((song, songIndex) => (
                      <div key={song.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-400">{songIndex + 1}</span>
                            {song.albumArt && (
                              <img 
                                src={song.albumArt} 
                                alt={song.album}
                                className="w-10 h-10 rounded"
                              />
                            )}
                            <div>
                              <p className="font-medium text-sm">{song.title}</p>
                              <p className="text-xs text-gray-500">{song.artist}</p>
                              {song.reason && (
                                <p className="text-xs text-purple-600 dark:text-purple-400 mt-0.5">
                                  {song.reason}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {song.confidence && (
                              <div className="flex items-center gap-1">
                                <div className="w-8 h-1 bg-gray-200 dark:bg-gray-700 rounded">
                                  <div 
                                    className="h-full bg-green-500 rounded"
                                    style={{ width: `${song.confidence * 100}%` }}
                                  />
                                </div>
                              </div>
                            )}
                            {song.previewUrl && (
                              <button
                                onClick={() => togglePreview(song.previewUrl!)}
                                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                              >
                                {playingPreview === song.previewUrl ? (
                                  <Pause className="w-4 h-4" />
                                ) : (
                                  <Play className="w-4 h-4" />
                                )}
                              </button>
                            )}
                            {song.spotifyUrl && (
                              <a
                                href={song.spotifyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                            <button
                              onClick={() => removeSongFromSection(section.id, song.id)}
                              className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {section.expandable && (
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-center">
                      <button className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
                        + {section.expandable} more songs available
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Save Button */}
      {timeline.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={() => onSave?.(timeline)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Save Playlist
          </button>
        </div>
      )}
    </div>
  );
}