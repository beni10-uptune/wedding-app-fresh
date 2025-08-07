'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

// Simple vibe options
const VIBES = [
  { id: 'romantic', label: 'Romantic & Classic', emoji: '💕', color: 'from-pink-400 to-rose-500' },
  { id: 'modern', label: 'Modern & Fun', emoji: '🎉', color: 'from-purple-400 to-pink-500' },
  { id: 'rustic', label: 'Rustic & Chill', emoji: '🌿', color: 'from-green-400 to-teal-500' },
  { id: 'party', label: 'Party All Night', emoji: '🕺', color: 'from-orange-400 to-red-500' },
];

// Sample songs for instant preview (in production, these come from AI)
const PREVIEW_SONGS = {
  romantic: ['Perfect - Ed Sheeran', 'At Last - Etta James', 'Thinking Out Loud - Ed Sheeran'],
  modern: ["Can't Stop the Feeling - JT", 'Uptown Funk - Bruno Mars', 'Levitating - Dua Lipa'],
  rustic: ['Ho Hey - Lumineers', 'Wagon Wheel - OCMS', 'First Day of My Life - Bright Eyes'],
  party: ['Mr. Brightside - The Killers', 'September - Earth, Wind & Fire', 'I Wanna Dance - Whitney'],
};

export default function SimpleLandingPage() {
  const router = useRouter();
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlistCount] = useState(10847);

  const handleVibeClick = (vibeId: string) => {
    setSelectedVibe(vibeId);
    setIsPlaying(true);
    
    // In production, this would actually play music
    console.log(`Playing preview for ${vibeId}:`, PREVIEW_SONGS[vibeId as keyof typeof PREVIEW_SONGS]);
    
    // After a brief moment, navigate to genre selection
    setTimeout(() => {
      router.push(`/v2/genres?vibe=${vibeId}`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          UpTune
        </h1>
        <p className="text-gray-600 text-center">Your AI Wedding DJ 🎧</p>
      </motion.div>

      {/* Main Question */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center"
      >
        What's your wedding vibe?
      </motion.h2>

      {/* Vibe Buttons Grid */}
      <div className="grid grid-cols-2 gap-4 max-w-2xl w-full">
        {VIBES.map((vibe, index) => (
          <motion.button
            key={vibe.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleVibeClick(vibe.id)}
            className={`
              relative p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl 
              transition-all duration-300 border-2 border-transparent
              ${selectedVibe === vibe.id ? 'border-purple-500 ring-4 ring-purple-100' : 'hover:border-purple-200'}
            `}
          >
            <div className="text-4xl mb-3">{vibe.emoji}</div>
            <div className="font-semibold text-lg text-gray-900">{vibe.label}</div>
            
            {/* Music playing indicator */}
            {selectedVibe === vibe.id && isPlaying && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-2 right-2"
              >
                <div className="flex gap-1">
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <motion.div
                      key={i}
                      animate={{ scaleY: [1, 1.5, 1] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.6,
                        delay,
                      }}
                      className="w-1 h-4 bg-purple-500 rounded-full"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Now Playing Preview (shows when vibe selected) */}
      {selectedVibe && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-4 bg-white rounded-xl shadow-lg"
        >
          <div className="text-sm text-gray-600 mb-2">Loading your perfect playlist...</div>
          <div className="space-y-1">
            {PREVIEW_SONGS[selectedVibe as keyof typeof PREVIEW_SONGS].slice(0, 3).map((song, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="text-purple-500">♪</span>
                <span className={i === 0 ? 'font-semibold' : 'text-gray-600'}>
                  {i === 0 ? 'Now playing: ' : ''}{song}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Social Proof */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 text-center text-gray-600"
      >
        <div className="text-2xl font-semibold text-purple-600">
          {playlistCount.toLocaleString()}
        </div>
        <div className="text-sm">playlists created</div>
      </motion.div>
    </div>
  );
}