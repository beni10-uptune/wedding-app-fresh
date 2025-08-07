'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

const GENRES = [
  'Pop', 'Rock', 'Country', 'Hip-Hop', 'R&B',
  'Indie', 'Electronic', 'Classic', 'Latin', 'Jazz',
  'Soul', 'Folk', 'Alternative', 'Dance', 'Reggae'
];

function GenresContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vibe = searchParams.get('vibe') || 'modern';
  
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Store preferences in sessionStorage for now
    sessionStorage.setItem('weddingPrefs', JSON.stringify({
      vibe,
      genres: selectedGenres,
      playlistUrl
    }));
    
    // Navigate to preview
    setTimeout(() => {
      router.push('/v2/preview');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Perfect! Quick question...
          </h1>
          <p className="text-xl text-gray-600">
            What music do you love?
          </p>
        </motion.div>

        {/* Genre Selection */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {GENRES.map((genre, index) => (
              <motion.button
                key={genre}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * index }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleGenre(genre)}
                className={`
                  py-3 px-4 rounded-xl font-medium transition-all
                  ${selectedGenres.includes(genre)
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-purple-50 shadow'
                  }
                `}
              >
                {genre}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Playlist URL Input */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8 p-6 bg-white rounded-2xl shadow-lg"
        >
          <label className="block text-gray-700 font-medium mb-2">
            Got a playlist? Share the vibe (optional)
          </label>
          <input
            type="text"
            value={playlistUrl}
            onChange={(e) => setPlaylistUrl(e.target.value)}
            placeholder="Paste Spotify playlist URL..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
          />
          <p className="text-sm text-gray-500 mt-2">
            Share your "our songs" or date night playlist
          </p>
        </motion.div>

        {/* Generate Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <button
            onClick={handleGenerate}
            disabled={selectedGenres.length === 0 || isGenerating}
            className={`
              px-12 py-4 rounded-full font-semibold text-lg
              transition-all transform hover:scale-105
              ${selectedGenres.length > 0
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl hover:shadow-2xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                >
                  ⚡
                </motion.span>
                Creating magic...
              </span>
            ) : (
              'Create My Playlist →'
            )}
          </button>
          
          {selectedGenres.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Select at least one genre to continue
            </p>
          )}
        </motion.div>

        {/* Selected Genres Display */}
        {selectedGenres.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-gray-600">
              Selected: {selectedGenres.join(', ')}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function GenresPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GenresContent />
    </Suspense>
  );
}