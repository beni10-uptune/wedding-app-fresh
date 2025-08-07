'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

// Mock preview songs (in production, these come from AI based on preferences)
const PREVIEW_SONGS = [
  { id: '1', moment: '💕', title: 'Perfect', artist: 'Ed Sheeran', label: 'First Dance' },
  { id: '2', moment: '🥂', title: 'Uptown Funk', artist: 'Bruno Mars', label: 'Cocktail Hour' },
  { id: '3', moment: '🍽️', title: 'Thinking Out Loud', artist: 'Ed Sheeran', label: 'Dinner' },
  { id: '4', moment: '💃', title: 'Mr. Brightside', artist: 'The Killers', label: 'Party Peak' },
  { id: '5', moment: '🌙', title: 'Closing Time', artist: 'Semisonic', label: 'Last Dance' },
];

export default function PreviewPage() {
  const router = useRouter();
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [email, setEmail] = useState('');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  useEffect(() => {
    // Show email capture after 5 seconds of browsing
    const timer = setTimeout(() => {
      setShowEmailCapture(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handlePlayPreview = (songId: string) => {
    setCurrentlyPlaying(currentlyPlaying === songId ? null : songId);
    // In production, this would actually play the song preview
    console.log(`Playing preview for song ${songId}`);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Store email (in production, send to backend)
      sessionStorage.setItem('userEmail', email);
      router.push('/v2/playlist');
    }
  };

  const handleSeeAll = () => {
    setShowEmailCapture(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Here's a taste of your wedding... 🎵
          </h1>
          <p className="text-xl text-gray-600">
            Your AI DJ has selected these perfect moments
          </p>
        </motion.div>

        {/* Preview Songs */}
        <div className="space-y-4 mb-12">
          {PREVIEW_SONGS.map((song, index) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{song.moment}</div>
                  <div>
                    <div className="font-semibold text-lg text-gray-900">
                      {song.title}
                    </div>
                    <div className="text-gray-600">{song.artist}</div>
                    <div className="text-sm text-purple-600 mt-1">{song.label}</div>
                  </div>
                </div>
                <button
                  onClick={() => handlePlayPreview(song.id)}
                  className="px-6 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full font-medium transition-colors flex items-center gap-2"
                >
                  {currentlyPlaying === song.id ? '⏸️' : '▶️'} 
                  Preview 30s
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <button
            onClick={handleSeeAll}
            className="px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all"
          >
            See All 150 Songs FREE →
          </button>
          <p className="text-gray-600 mt-4">
            Complete timeline • DJ insights • Share with partner
          </p>
        </motion.div>

        {/* Email Capture Modal */}
        {showEmailCapture && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Get your complete wedding playlist 🎉
              </h2>
              <p className="text-gray-600 mb-6">
                See all 150 songs, timeline, and DJ insights
              </p>
              
              <form onSubmit={handleEmailSubmit}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors mb-4"
                  autoFocus
                />
                
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Get My Full Playlist
                </button>
              </form>
              
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-500">✓</span> Instant access to all 150 songs
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-500">✓</span> 30-second preview of every track
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-500">✓</span> Share with your partner
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-500">✓</span> No credit card required
                </div>
              </div>
              
              <button
                onClick={() => setShowEmailCapture(false)}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700"
              >
                Maybe later
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}