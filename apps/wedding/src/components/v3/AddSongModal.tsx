'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, Search, Loader2, Music, Plus } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  albumArt?: string;
  previewUrl?: string;
  duration?: number;
  spotifyId?: string;
}

interface AddSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSong: (song: Song) => void;
  momentId: string | null;
}

const MOMENT_NAMES: Record<string, string> = {
  'getting-ready': 'Getting Ready',
  'ceremony': 'Ceremony',
  'cocktails': 'Cocktails',
  'dinner': 'Dinner',
  'first-dance': 'First Dance',
  'parent-dances': 'Parent Dances',
  'party': 'Party Time',
  'last-dance': 'Last Dance'
};

export function AddSongModal({ isOpen, onClose, onAddSong, momentId }: AddSongModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  
  // Search for songs
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(searchQuery)}&limit=10`);
      if (!response.ok) {
        console.error('Search failed:', response.status);
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      console.log('Search response:', data); // Debug log
      
      // API returns 'tracks' not 'songs'
      const tracks = data.tracks || [];
      const formattedSongs = tracks.map((track: any) => ({
        id: track.id || `song-${Date.now()}-${Math.random()}`,
        title: track.name || track.title,
        artist: track.artist,
        album: track.album,
        albumArt: track.image,
        previewUrl: track.preview_url,
        duration: track.duration_ms,
        spotifyId: track.id
      }));
      
      setSearchResults(formattedSongs);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);
  
  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery && searchQuery.length >= 2) {
        handleSearch();
      } else if (searchQuery.length < 2) {
        setSearchResults([]);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);
  
  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSearchResults([]);
      setSelectedSong(null);
    }
  }, [isOpen]);
  
  const formatDuration = (ms?: number) => {
    if (!ms) return '';
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleAddSong = () => {
    if (selectedSong) {
      onAddSong(selectedSong);
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative glass-darker rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Add Song to {momentId ? MOMENT_NAMES[momentId] : 'Playlist'}
          </h2>
          <p className="text-white/60">
            Search for songs to add to this moment
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            placeholder="Search for songs, artists, or albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
            autoFocus
          />
        </div>
        
        {/* Search Results */}
        <div className="flex-1 overflow-y-auto mb-6 min-h-[300px]">
          {isSearching ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-white/60" />
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-2">
              {searchResults.map((song) => (
                <button
                  key={song.id}
                  onClick={() => setSelectedSong(song)}
                  className={`w-full p-4 rounded-lg transition-all text-left ${
                    selectedSong?.id === song.id
                      ? 'bg-purple-600/30 border border-purple-500'
                      : 'bg-white/5 hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {song.albumArt ? (
                      <img 
                        src={song.albumArt} 
                        alt={song.album}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                        <Music className="w-6 h-6 text-white/40" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{song.title}</p>
                      <p className="text-sm text-white/60 truncate">
                        {song.artist}
                        {song.album && ` • ${song.album}`}
                      </p>
                    </div>
                    {song.duration && (
                      <span className="text-sm text-white/40">
                        {formatDuration(song.duration)}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : searchQuery && searchQuery.length < 2 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/40">Keep typing...</p>
              <p className="text-sm text-white/30 mt-1">Enter at least 2 characters to search</p>
            </div>
          ) : searchQuery ? (
            <div className="text-center py-12">
              <Music className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/40">No songs found</p>
              <p className="text-sm text-white/30 mt-1">Try a different search</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/40">Search for songs</p>
              <p className="text-sm text-white/30 mt-1">Type an artist, song, or album name</p>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddSong}
            disabled={!selectedSong}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Song
          </button>
        </div>
      </div>
    </div>
  );
}