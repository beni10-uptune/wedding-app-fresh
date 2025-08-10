'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Music, 
  ChevronRight, 
  Sparkles,
  Play,
  Pause,
  Check,
  Users,
  Loader2,
  Volume2,
  ArrowRight,
  Lock,
  RefreshCw,
  Clock,
  Heart,
  Star
} from 'lucide-react';
import PlaylistBuilder from './PlaylistBuilder';

// Vibe options
const VIBE_OPTIONS = [
  { id: 'romantic', label: 'Romantic', emoji: '💕' },
  { id: 'party', label: 'Party', emoji: '🎉' },
  { id: 'modern', label: 'Modern', emoji: '✨' },
  { id: 'rustic', label: 'Rustic', emoji: '🌿' },
];

export default function V3VisionPage() {
  // Onboarding state
  const [selectedVibe, setSelectedVibe] = useState<string>('');
  const [coupleNames, setCoupleNames] = useState(['', '']);
  const [mustPlaySongs, setMustPlaySongs] = useState<string[]>(['']);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [customInstructions, setCustomInstructions] = useState('');
  const [email, setEmail] = useState('');
  
  // UI state
  const [currentStep, setCurrentStep] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Start showing playlist immediately after vibe selection
  useEffect(() => {
    if (selectedVibe && !showPlaylist) {
      setShowPlaylist(true);
      setCurrentStep(1);
    }
  }, [selectedVibe, showPlaylist]);

  const handleVibeSelect = (vibeId: string) => {
    setSelectedVibe(vibeId);
    // Playlist will show automatically via useEffect
  };

  const handleCoupleNameChange = (index: number, value: string) => {
    const newNames = [...coupleNames];
    newNames[index] = value;
    setCoupleNames(newNames);
  };

  const handleMustPlayChange = (index: number, value: string) => {
    const newSongs = [...mustPlaySongs];
    newSongs[index] = value;
    setMustPlaySongs(newSongs);
  };

  const addMustPlaySong = () => {
    setMustPlaySongs([...mustPlaySongs, '']);
  };

  const removeMustPlaySong = (index: number) => {
    setMustPlaySongs(mustPlaySongs.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen dark-gradient relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-purple w-96 h-96 -top-48 -right-48"></div>
        <div className="orb orb-blue w-96 h-96 -bottom-48 -left-48"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 glass-darker border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">UpTune 3.0</h1>
                <p className="text-xs text-purple-400">AI Wedding Music</p>
              </div>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-full">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-purple-300">
                  Powered by AI
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - The Magic 2-Pane Layout */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {!selectedVibe ? (
          // Initial Vibe Selection - Full Screen
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-4">
                Pick your <span className="text-gradient">vibe</span>
              </h1>
              <p className="text-xl text-white/70">
                Your AI playlist starts building immediately
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {VIBE_OPTIONS.map((vibe) => (
                <button
                  key={vibe.id}
                  onClick={() => handleVibeSelect(vibe.id)}
                  className="group relative overflow-hidden rounded-2xl p-8 text-left transition-all hover:scale-105 hover:shadow-2xl glass-card"
                >
                  <div className="relative z-10">
                    <span className="text-4xl mb-4 block">{vibe.emoji}</span>
                    <h3 className="text-2xl font-bold text-white mb-2">{vibe.label}</h3>
                    <p className="text-white/80">Click to start building →</p>
                  </div>
                  <div className="absolute bottom-4 right-4 transform translate-x-full group-hover:translate-x-0 transition-transform">
                    <ChevronRight className="w-6 h-6 text-white" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // The 2-Pane Experience
          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* LEFT PANE - Progressive Questions */}
            <div className="space-y-6">
              <div className="glass-card rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Customize Your Playlist
                </h2>
                
                {/* Progress indicator */}
                <div className="flex items-center gap-2 mb-6">
                  {[0, 1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`flex-1 h-2 rounded-full transition-all ${
                        currentStep >= step ? 'bg-purple-500' : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>

                {/* Step 1: Names (Optional) */}
                <div className="space-y-4 mb-6">
                  <label className="text-white/80 text-sm">Your Names (Optional)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Partner 1"
                      value={coupleNames[0]}
                      onChange={(e) => handleCoupleNameChange(0, e.target.value)}
                      onBlur={() => setCurrentStep(Math.max(currentStep, 1))}
                      className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-white/40"
                    />
                    <input
                      type="text"
                      placeholder="Partner 2"
                      value={coupleNames[1]}
                      onChange={(e) => handleCoupleNameChange(1, e.target.value)}
                      onBlur={() => setCurrentStep(Math.max(currentStep, 1))}
                      className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-white/40"
                    />
                  </div>
                </div>

                {/* Step 2: Must-Play Songs */}
                {currentStep >= 1 && (
                  <div className="space-y-4 mb-6 animate-fadeIn">
                    <label className="text-white/80 text-sm">Must-Play Songs (Optional)</label>
                    {mustPlaySongs.map((song, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g., Perfect by Ed Sheeran"
                          value={song}
                          onChange={(e) => handleMustPlayChange(index, e.target.value)}
                          onBlur={() => setCurrentStep(Math.max(currentStep, 2))}
                          className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-white/40"
                        />
                        {index === mustPlaySongs.length - 1 ? (
                          <button
                            onClick={addMustPlaySong}
                            className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30"
                          >
                            Add
                          </button>
                        ) : (
                          <button
                            onClick={() => removeMustPlaySong(index)}
                            className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Step 3: Genres */}
                {currentStep >= 2 && (
                  <div className="space-y-4 mb-6 animate-fadeIn">
                    <label className="text-white/80 text-sm">Favorite Genres (Optional)</label>
                    <div className="flex flex-wrap gap-2">
                      {['Pop', 'Rock', 'Country', 'R&B', 'Hip-Hop', 'Indie', 'Electronic', 'Jazz'].map((genre) => (
                        <button
                          key={genre}
                          onClick={() => {
                            setSelectedGenres(prev =>
                              prev.includes(genre)
                                ? prev.filter(g => g !== genre)
                                : [...prev, genre]
                            );
                            setCurrentStep(Math.max(currentStep, 3));
                          }}
                          className={`px-3 py-1 rounded-full transition-all text-sm ${
                            selectedGenres.includes(genre)
                              ? 'bg-purple-600 text-white'
                              : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Custom Instructions */}
                {currentStep >= 3 && (
                  <div className="space-y-4 mb-6 animate-fadeIn">
                    <label className="text-white/80 text-sm">Special Requests (Optional)</label>
                    <textarea
                      placeholder="e.g., Avoid explicit lyrics, include some Spanish songs..."
                      value={customInstructions}
                      onChange={(e) => setCustomInstructions(e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-white/40 h-20 resize-none"
                    />
                  </div>
                )}

                {/* Email Capture - Always visible at bottom */}
                <div className="pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-white/80 text-sm">Save Your Playlist</label>
                    <span className="text-xs text-purple-400">Free • No spam</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-white/40"
                    />
                    <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-600/30 transition-all">
                      Save
                    </button>
                  </div>
                </div>
              </div>

              {/* Tips & Info */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  💡 Pro Tips
                </h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Your playlist updates in real-time as you answer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>AI learns from 1,600+ wedding-tested songs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Drag & drop to reorder songs anytime</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* RIGHT PANE - Live Playlist */}
            <div className="lg:sticky lg:top-8 h-fit">
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Your Playlist
                  </h2>
                  <div className="flex items-center gap-2">
                    {isGenerating && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-full">
                        <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                        <span className="text-sm text-purple-300">Updating...</span>
                      </div>
                    )}
                    <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                      <RefreshCw className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* Playlist Component */}
                <PlaylistBuilder
                  coupleNames={coupleNames}
                  vibe={selectedVibe}
                  mustPlaySongs={mustPlaySongs.filter(s => s.trim())}
                  customInstructions={customInstructions}
                  onSave={(playlist) => console.log('Saving playlist:', playlist)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}