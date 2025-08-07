'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Timeline moments with generic songs (this would come from AI/database)
const INITIAL_TIMELINE = [
  {
    id: 'getting-ready',
    time: '2:00 PM',
    duration: '30 min',
    title: 'Getting Ready',
    emoji: '💄',
    energy: 3,
    description: 'Upbeat but relaxed as you prepare',
    songs: [
      { id: '1', title: 'Sunday Morning', artist: 'Maroon 5' },
      { id: '2', title: 'Here Comes the Sun', artist: 'Beatles' },
      { id: '3', title: 'Lovely Day', artist: 'Bill Withers' },
    ],
    expandable: 4, // "+4 more songs"
  },
  {
    id: 'ceremony',
    time: '3:00 PM',
    duration: '20 min',
    title: 'Ceremony',
    emoji: '💒',
    energy: 2,
    description: 'Emotional moments and traditions',
    songs: [
      { id: '4', title: 'Canon in D', artist: 'Pachelbel', label: 'Processional' },
      { id: '5', title: 'A Thousand Years', artist: 'Christina Perri', label: 'Bride Entrance' },
      { id: '6', title: 'Make You Feel My Love', artist: 'Adele', label: 'Signing' },
      { id: '7', title: 'Signed, Sealed, Delivered', artist: 'Stevie Wonder', label: 'Recessional' },
    ],
  },
  {
    id: 'cocktails',
    time: '3:30 PM',
    duration: '90 min',
    title: 'Cocktail Hour',
    emoji: '🥂',
    energy: 6,
    description: 'Mingling music - upbeat but not overwhelming',
    songs: [
      { id: '8', title: 'Fly Me to the Moon', artist: 'Sinatra' },
      { id: '9', title: 'Valerie', artist: 'Amy Winehouse' },
      { id: '10', title: 'Golden', artist: 'Harry Styles' },
    ],
    expandable: 22,
  },
  {
    id: 'dinner',
    time: '5:00 PM',
    duration: '90 min',
    title: 'Dinner',
    emoji: '🍽️',
    energy: 4,
    description: 'Background music for conversation',
    songs: [
      { id: '11', title: 'At Last', artist: 'Etta James' },
      { id: '12', title: 'Wonderful Tonight', artist: 'Eric Clapton' },
      { id: '13', title: 'Your Song', artist: 'Elton John' },
    ],
    expandable: 20,
  },
  {
    id: 'firstdance',
    time: '7:00 PM',
    duration: '5 min',
    title: 'First Dance',
    emoji: '💕',
    energy: 3,
    description: 'Your special moment',
    songs: [
      { id: '14', title: 'Perfect', artist: 'Ed Sheeran' },
    ],
  },
  {
    id: 'party',
    time: '7:15 PM',
    duration: '3 hours',
    title: 'Party Time',
    emoji: '🎉',
    energy: 9,
    description: 'Building energy to peak party',
    songs: [
      { id: '15', title: 'September', artist: 'Earth, Wind & Fire', label: 'Warm Up' },
      { id: '16', title: 'Uptown Funk', artist: 'Bruno Mars', label: 'Building' },
      { id: '17', title: 'Mr. Brightside', artist: 'The Killers', label: 'Peak' },
      { id: '18', title: "Can't Stop the Feeling", artist: 'Justin Timberlake', label: 'Peak' },
    ],
    expandable: 35,
  },
  {
    id: 'lastdance',
    time: '10:30 PM',
    duration: '5 min',
    title: 'Last Dance',
    emoji: '🌙',
    energy: 5,
    description: 'Send-off song',
    songs: [
      { id: '19', title: 'Time of Your Life', artist: 'Green Day' },
    ],
  },
];

// Regional transformations
const REGIONAL_CHANGES = {
  'north-england': {
    cocktails: [
      { old: 'Fly Me to the Moon', new: { title: 'There She Goes', artist: 'The La\'s' } },
      { old: 'Golden', new: { title: 'This Charming Man', artist: 'The Smiths' } },
    ],
    party: [
      { old: 'Mr. Brightside', new: { title: 'Mr. Brightside', artist: 'The Killers', note: '(keeping this - it\'s law!)' } },
      { old: 'Uptown Funk', new: { title: 'Wonderwall', artist: 'Oasis', note: '(Manchester essential!)' } },
      { old: "Can't Stop the Feeling", new: { title: 'Chelsea Dagger', artist: 'The Fratellis' } },
    ],
  },
  'london': {
    cocktails: [
      { old: 'Fly Me to the Moon', new: { title: 'Waterloo Sunset', artist: 'The Kinks' } },
    ],
    party: [
      { old: 'Uptown Funk', new: { title: 'Pump It Up', artist: 'Endor' } },
    ],
  },
};

export default function TimelineFirstPage() {
  const [timeline, setTimeline] = useState(INITIAL_TIMELINE);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [showingChanges, setShowingChanges] = useState(false);
  const [customizationStep, setCustomizationStep] = useState(0);

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    setShowingChanges(true);
    
    // Apply regional changes
    setTimeout(() => {
      const changes = REGIONAL_CHANGES[region as keyof typeof REGIONAL_CHANGES];
      if (changes) {
        // Transform the timeline based on region
        const newTimeline = [...timeline];
        // This would be more sophisticated in production
        setTimeline(newTimeline);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-purple-50">
      {/* Header */}
      <div className="text-center py-8 px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
        >
          Here's your wedding day. Let's make the music perfect.
        </motion.h1>
        <p className="text-gray-600">
          150+ songs already organized. ChatGPT could never do this.
        </p>
      </div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <div className="space-y-4">
          {timeline.map((moment, index) => (
            <motion.div
              key={moment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Moment Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{moment.emoji}</span>
                    <div>
                      <h3 className="font-bold text-lg">{moment.title}</h3>
                      <p className="text-purple-100 text-sm">
                        {moment.time} • {moment.duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-purple-200">Energy</span>
                    <div className="flex gap-1">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 h-4 rounded ${
                            i < moment.energy ? 'bg-white' : 'bg-purple-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-purple-100 mt-2">{moment.description}</p>
              </div>

              {/* Songs */}
              <div className="p-4 space-y-2">
                {moment.songs.map((song) => (
                  <motion.div
                    key={song.id}
                    className={`flex items-center justify-between p-2 rounded-lg hover:bg-purple-50 transition-colors ${
                      showingChanges && selectedRegion ? 'bg-yellow-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-purple-500">♪</span>
                      <div>
                        <span className="font-medium">{song.title}</span>
                        <span className="text-gray-500 ml-2">- {song.artist}</span>
                        {song.label && (
                          <span className="text-xs text-purple-600 ml-2">({song.label})</span>
                        )}
                        {song.note && (
                          <span className="text-xs text-green-600 ml-2">{song.note}</span>
                        )}
                      </div>
                    </div>
                    <button className="text-purple-600 hover:text-purple-800 text-sm">
                      Preview
                    </button>
                  </motion.div>
                ))}
                {moment.expandable && (
                  <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                    +{moment.expandable} more songs
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-xl font-semibold text-gray-800 mb-4">
            This is a good wedding playlist. Let's make it YOURS.
          </p>
          <button
            onClick={() => setCustomizationStep(1)}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
          >
            Start Personalizing →
          </button>
        </motion.div>
      </div>

      {/* Customization Modal */}
      <AnimatePresence>
        {customizationStep === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-6">Where's your wedding?</h2>
              <p className="text-gray-600 mb-6">This changes EVERYTHING about your music.</p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">UK Regions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['North England', 'South England', 'Scotland', 'Wales', 'London', 'Northern Ireland'].map((region) => (
                      <button
                        key={region}
                        onClick={() => handleRegionSelect(region.toLowerCase().replace(' ', '-'))}
                        className="p-3 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all"
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">US Regions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Northeast', 'South', 'Midwest', 'West Coast', 'Texas', 'Pacific Northwest'].map((region) => (
                      <button
                        key={region}
                        className="p-3 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all"
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {selectedRegion && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-green-50 rounded-xl"
                >
                  <p className="text-green-800 font-medium">
                    ✨ Adding {selectedRegion === 'north-england' ? 'Manchester' : selectedRegion} favorites!
                  </p>
                  <p className="text-green-700 text-sm mt-1">
                    Watch your timeline transform with local anthems...
                  </p>
                </motion.div>
              )}

              <button
                onClick={() => setCustomizationStep(0)}
                className="mt-6 text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}