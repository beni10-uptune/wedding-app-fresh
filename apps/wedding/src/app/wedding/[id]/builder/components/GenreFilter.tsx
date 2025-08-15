/**
 * Genre Filter Component
 * Allows users to select music genres to customize their wedding playlist
 */

import React from 'react';
import { Music, Check, X, Sparkles, RefreshCw } from 'lucide-react';

interface GenreFilterProps {
  availableGenres: string[];
  selectedGenres: string[];
  onToggleGenre: (genre: string) => void;
  onClearGenres: () => void;
  onApplyFilters: () => void;
  isLoading?: boolean;
  songCount?: number;
}

// Genre display configuration
const GENRE_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  'pop': { label: 'Pop', icon: '🎤', color: 'bg-pink-500' },
  'rock': { label: 'Rock', icon: '🎸', color: 'bg-red-500' },
  'r&b': { label: 'R&B', icon: '🎶', color: 'bg-purple-500' },
  'hip-hop': { label: 'Hip Hop', icon: '🎧', color: 'bg-green-500' },
  'country': { label: 'Country', icon: '🤠', color: 'bg-yellow-600' },
  'indie': { label: 'Indie', icon: '🎵', color: 'bg-indigo-500' },
  'electronic': { label: 'Electronic', icon: '🎹', color: 'bg-blue-500' },
  'jazz': { label: 'Jazz', icon: '🎺', color: 'bg-amber-600' },
  'soul': { label: 'Soul', icon: '💿', color: 'bg-orange-500' },
  'classical': { label: 'Classical', icon: '🎻', color: 'bg-gray-600' },
  'acoustic': { label: 'Acoustic', icon: '🪕', color: 'bg-teal-500' },
  'latin': { label: 'Latin', icon: '💃', color: 'bg-rose-500' },
  'reggae': { label: 'Reggae', icon: '🌴', color: 'bg-lime-500' },
  'funk': { label: 'Funk', icon: '🕺', color: 'bg-cyan-500' }
};

export default function GenreFilter({
  availableGenres,
  selectedGenres,
  onToggleGenre,
  onClearGenres,
  onApplyFilters,
  isLoading = false,
  songCount = 0
}: GenreFilterProps) {
  
  const getGenreConfig = (genre: string) => {
    return GENRE_CONFIG[genre.toLowerCase()] || {
      label: genre.charAt(0).toUpperCase() + genre.slice(1),
      icon: '🎵',
      color: 'bg-gray-500'
    };
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
            <Music className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Music Style</h3>
            <p className="text-sm text-gray-500">
              {selectedGenres.length === 0 
                ? 'Select genres to personalize your playlist'
                : `${selectedGenres.length} genre${selectedGenres.length > 1 ? 's' : ''} selected`
              }
            </p>
          </div>
        </div>
        
        {selectedGenres.length > 0 && (
          <button
            onClick={onClearGenres}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>
      
      {/* Genre Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
        {availableGenres.map(genre => {
          const config = getGenreConfig(genre);
          const isSelected = selectedGenres.includes(genre);
          
          return (
            <button
              key={genre}
              onClick={() => onToggleGenre(genre)}
              className={`
                relative group flex items-center gap-2 px-4 py-3 rounded-lg
                border-2 transition-all duration-200 text-sm font-medium
                ${isSelected 
                  ? `border-purple-500 bg-purple-50 text-purple-900`
                  : `border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50`
                }
              `}
              disabled={isLoading}
            >
              <span className="text-lg">{config.icon}</span>
              <span className="flex-1 text-left">{config.label}</span>
              {isSelected && (
                <Check className="w-4 h-4 text-purple-600" />
              )}
              
              {/* Hover effect */}
              <div className={`
                absolute inset-0 rounded-lg opacity-0 group-hover:opacity-10
                transition-opacity pointer-events-none ${config.color}
              `} />
            </button>
          );
        })}
      </div>
      
      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Sparkles className="w-4 h-4" />
          <span>
            {songCount > 0 
              ? `${songCount.toLocaleString()} songs available`
              : 'Loading songs...'
            }
          </span>
        </div>
        
        <button
          onClick={onApplyFilters}
          disabled={isLoading || selectedGenres.length === 0}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium
            transition-all duration-200
            ${selectedGenres.length > 0
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Apply Filters</span>
            </>
          )}
        </button>
      </div>
      
      {/* Info Box */}
      {selectedGenres.length > 0 && (
        <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex gap-3">
            <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-purple-900">
              <p className="font-medium mb-1">Smart Playlist Generation</p>
              <p className="text-purple-700">
                Your playlist will be automatically customized for each moment of your wedding day 
                based on your selected genres. Songs will be intelligently distributed to match 
                the energy and mood of each section.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}