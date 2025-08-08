'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  Music, 
  ChevronRight, 
  Heart, 
  Sparkles,
  Globe,
  Plus,
  X,
  Loader2
} from 'lucide-react';

// Dynamically import PlaylistBuilder to avoid SSR issues
const PlaylistBuilder = dynamic(() => import('./PlaylistBuilder'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
    </div>
  )
});

export default function V3Page() {
  const [step, setStep] = useState<'setup' | 'building'>('setup');
  const [coupleNames, setCoupleNames] = useState(['', '']);
  const [vibe, setVibe] = useState('');
  const [mustPlaySongs, setMustPlaySongs] = useState<string[]>(['']);
  const [customInstructions, setCustomInstructions] = useState('');

  const vibeOptions = [
    { id: 'romantic', label: 'Romantic & Intimate', emoji: '💕' },
    { id: 'party', label: 'High Energy Party', emoji: '🎉' },
    { id: 'elegant', label: 'Classic & Elegant', emoji: '🥂' },
    { id: 'fun', label: 'Fun & Quirky', emoji: '🎪' },
    { id: 'modern', label: 'Modern & Trendy', emoji: '✨' },
    { id: 'cultural', label: 'Cultural Mix', emoji: '🌍' },
  ];

  const handleAddMustPlay = () => {
    setMustPlaySongs([...mustPlaySongs, '']);
  };

  const handleRemoveMustPlay = (index: number) => {
    setMustPlaySongs(mustPlaySongs.filter((_, i) => i !== index));
  };

  const handleMustPlayChange = (index: number, value: string) => {
    const updated = [...mustPlaySongs];
    updated[index] = value;
    setMustPlaySongs(updated);
  };

  const handleStartBuilding = () => {
    if (coupleNames[0] && vibe) {
      setStep('building');
    }
  };

  const handleSavePlaylist = (playlist: any) => {
    console.log('Saving playlist:', playlist);
    // Here you would save to Firebase or handle the playlist data
  };

  if (step === 'building') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <Link href="/" className="flex items-center gap-2">
                <Music className="w-6 h-6 text-purple-600" />
                <span className="font-bold text-xl">Uptune</span>
                <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded-full">
                  v3.0
                </span>
              </Link>
              
              <button
                onClick={() => setStep('setup')}
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                ← Back to Setup
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {coupleNames[0] && coupleNames[1] 
                ? `${coupleNames[0]} & ${coupleNames[1]}'s Wedding Playlist`
                : 'Your Wedding Playlist'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              AI-powered playlist generation with real wedding songs from our database
            </p>
          </div>

          <PlaylistBuilder
            coupleNames={coupleNames}
            vibe={vibe}
            mustPlaySongs={mustPlaySongs}
            customInstructions={customInstructions}
            onSave={handleSavePlaylist}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-2">
              <Music className="w-6 h-6 text-purple-600" />
              <span className="font-bold text-xl">Uptune</span>
              <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded-full">
                v3.0
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Create Your Perfect Wedding Playlist
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Powered by AI and our database of 1,600+ curated wedding songs
          </p>
        </div>

        {/* Setup Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Couple Names */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Your Names
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={coupleNames[0]}
                onChange={(e) => setCoupleNames([e.target.value, coupleNames[1]])}
                placeholder="Partner 1"
                className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                value={coupleNames[1]}
                onChange={(e) => setCoupleNames([coupleNames[0], e.target.value])}
                placeholder="Partner 2"
                className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Vibe Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Wedding Vibe
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {vibeOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setVibe(option.id)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    vibe === option.id
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl mb-1">{option.emoji}</span>
                  <p className="text-sm font-medium">{option.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Must-Play Songs */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Must-Play Songs (Optional)
            </label>
            <div className="space-y-3">
              {mustPlaySongs.map((song, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={song}
                    onChange={(e) => handleMustPlayChange(index, e.target.value)}
                    placeholder="e.g., Perfect by Ed Sheeran"
                    className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {mustPlaySongs.length > 1 && (
                    <button
                      onClick={() => handleRemoveMustPlay(index)}
                      className="p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={handleAddMustPlay}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Add another song</span>
              </button>
            </div>
          </div>

          {/* Custom Instructions */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Special Instructions (Optional)
            </label>
            <textarea
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="e.g., We love 90s music, please avoid country songs, include some Bollywood hits..."
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleStartBuilding}
            disabled={!coupleNames[0] || !vibe}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Generate AI Playlist
          </button>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-1">AI-Powered</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Claude AI analyzes your preferences to create the perfect flow
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Music className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="font-semibold mb-1">1,600+ Songs</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Curated database of wedding-tested songs with Spotify integration
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-1">Personalized</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tailored to your vibe, must-plays, and special requirements
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}