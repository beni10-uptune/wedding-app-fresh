'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Music, 
  ChevronRight, 
  Heart, 
  Upload,
  Sparkles,
  Play,
  Globe
} from 'lucide-react';

// Default timeline with songs
const DEFAULT_TIMELINE = [
  {
    id: 'prelude',
    time: '3:30 PM',
    duration: '30 min',
    title: 'Guest Arrival',
    emoji: '👋',
    energy: 2,
    description: 'Welcoming atmosphere',
    songs: [
      { id: '1', title: 'A Thousand Years', artist: 'Christina Perri' },
      { id: '2', title: 'Marry Me', artist: 'Train' },
      { id: '3', title: 'All of Me', artist: 'John Legend' },
    ],
    expandable: 15,
  },
  {
    id: 'processional',
    time: '4:00 PM',
    duration: '5 min',
    title: 'Processional',
    emoji: '💐',
    energy: 3,
    description: 'Walking down the aisle',
    songs: [
      { id: '4', title: 'Canon in D', artist: 'Pachelbel' },
      { id: '5', title: 'Here Comes the Bride', artist: 'Wagner' },
    ],
  },
  {
    id: 'recessional',
    time: '4:30 PM',
    duration: '5 min',
    title: 'Recessional',
    emoji: '🎊',
    energy: 4,
    description: 'Celebration begins!',
    songs: [
      { id: '6', title: 'Signed, Sealed, Delivered', artist: 'Stevie Wonder' },
    ],
  },
  {
    id: 'cocktails',
    time: '5:00 PM',
    duration: '90 min',
    title: 'Cocktail Hour',
    emoji: '🥂',
    energy: 3,
    description: 'Mingling and drinks',
    songs: [
      { id: '7', title: 'Fly Me to the Moon', artist: 'Frank Sinatra' },
      { id: '8', title: 'Sunday Morning', artist: 'Maroon 5' },
      { id: '9', title: 'Better Days', artist: 'OneRepublic' },
      { id: '10', title: 'Golden', artist: 'Harry Styles' },
    ],
    expandable: 30,
  },
  {
    id: 'dinner',
    time: '6:30 PM',
    duration: '60 min',
    title: 'Dinner',
    emoji: '🍽️',
    energy: 2,
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
    time: '8:00 PM',
    duration: '150 min',
    title: 'Party Time',
    emoji: '🎉',
    energy: 5,
    description: 'Dance floor hits',
    songs: [
      { id: '15', title: 'Uptown Funk', artist: 'Bruno Mars' },
      { id: '16', title: 'Shut Up and Dance', artist: 'Walk the Moon' },
      { id: '17', title: "Can't Stop the Feeling", artist: 'Justin Timberlake' },
      { id: '18', title: 'Mr. Brightside', artist: 'The Killers' },
    ],
    expandable: 50,
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
const REGIONAL_CHANGES: Record<string, any> = {
  'uk': {
    cocktails: [
      { old: 'Fly Me to the Moon', new: { title: 'Valerie', artist: 'Amy Winehouse' } },
      { old: 'Golden', new: { title: 'Dreams', artist: 'Fleetwood Mac' } },
    ],
    party: [
      { old: 'Mr. Brightside', new: { title: 'Mr. Brightside', artist: 'The Killers', note: '(UK wedding essential!)' } },
      { old: "Can't Stop the Feeling", new: { title: 'Dancing in the Moonlight', artist: 'Toploader' } },
    ],
  },
  'us': {
    cocktails: [
      { old: 'Valerie', new: { title: 'Fly Me to the Moon', artist: 'Sinatra' } },
    ],
    party: [
      { old: 'Mr. Brightside', new: { title: 'September', artist: 'Earth, Wind & Fire' } },
    ],
  },
  'australia': {
    party: [
      { old: 'Uptown Funk', new: { title: 'Horses', artist: 'Daryl Braithwaite' } },
      { old: 'Mr. Brightside', new: { title: 'Eagle Rock', artist: 'Daddy Cool' } },
    ],
  },
  'canada': {
    party: [
      { old: "Can't Stop the Feeling", new: { title: 'Home for a Rest', artist: 'Spirit of the West' } },
    ],
  },
};

// Genre transformations
const GENRE_CHANGES: Record<string, any> = {
  'country': {
    firstdance: [
      { old: 'Perfect', new: { title: 'Die a Happy Man', artist: 'Thomas Rhett' } },
    ],
    party: [
      { old: 'Uptown Funk', new: { title: 'Wagon Wheel', artist: 'Darius Rucker' } },
      { old: 'Shut Up and Dance', new: { title: 'Chicken Fried', artist: 'Zac Brown Band' } },
    ],
  },
  'rock': {
    firstdance: [
      { old: 'Perfect', new: { title: 'Wonderful Tonight', artist: 'Eric Clapton' } },
    ],
    party: [
      { old: 'Uptown Funk', new: { title: 'You Shook Me All Night Long', artist: 'AC/DC' } },
      { old: "Can't Stop the Feeling", new: { title: 'Don\'t Stop Believin\'', artist: 'Journey' } },
    ],
  },
  'hip-hop': {
    cocktails: [
      { old: 'Sunday Morning', new: { title: 'Best I Ever Had', artist: 'Drake' } },
    ],
    party: [
      { old: 'Uptown Funk', new: { title: 'Yeah!', artist: 'Usher' } },
      { old: 'Shut Up and Dance', new: { title: 'Gold Digger', artist: 'Kanye West' } },
    ],
  },
  'indie': {
    cocktails: [
      { old: 'Golden', new: { title: 'Electric Feel', artist: 'MGMT' } },
      { old: 'Sunday Morning', new: { title: 'Oxford Comma', artist: 'Vampire Weekend' } },
    ],
    party: [
      { old: 'Uptown Funk', new: { title: 'Time to Dance', artist: 'The Sounds' } },
      { old: 'Mr. Brightside', new: { title: 'Tongue Tied', artist: 'Grouplove' } },
    ],
  },
  'electronic': {
    party: [
      { old: 'Uptown Funk', new: { title: 'Clarity', artist: 'Zedd' } },
      { old: 'Shut Up and Dance', new: { title: 'Animals', artist: 'Martin Garrix' } },
      { old: "Can't Stop the Feeling", new: { title: 'Titanium', artist: 'David Guetta' } },
    ],
  },
};

// Wedding type transformations
const WEDDING_TYPE_CHANGES: Record<string, any> = {
  'beach': {
    cocktails: [
      { old: 'Fly Me to the Moon', new: { title: 'Somewhere Over the Rainbow', artist: 'Israel Kamakawiwoʻole' } },
      { old: 'Better Days', new: { title: 'Three Little Birds', artist: 'Bob Marley' } },
    ],
  },
  'garden': {
    processional: [
      { old: 'Canon in D', new: { title: 'A Thousand Years', artist: 'Christina Perri' } },
    ],
  },
  'rustic': {
    cocktails: [
      { old: 'Golden', new: { title: 'Ho Hey', artist: 'The Lumineers' } },
    ],
    party: [
      { old: 'Uptown Funk', new: { title: 'Footloose', artist: 'Kenny Loggins' } },
    ],
  },
  'formal': {
    processional: [
      { old: 'Canon in D', new: { title: 'Ave Maria', artist: 'Schubert' } },
    ],
    cocktails: [
      { old: 'Sunday Morning', new: { title: 'The Way You Look Tonight', artist: 'Tony Bennett' } },
    ],
  },
};

export default function V3Page() {
  const [country, setCountry] = useState('us');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [weddingType, setWeddingType] = useState('classic');
  const [timeline, setTimeline] = useState(DEFAULT_TIMELINE);
  const [expandedMoments, setExpandedMoments] = useState<string[]>([]);

  // Update timeline based on preferences
  useEffect(() => {
    let newTimeline = JSON.parse(JSON.stringify(DEFAULT_TIMELINE));

    // Apply regional changes
    if (REGIONAL_CHANGES[country]) {
      const changes = REGIONAL_CHANGES[country];
      for (const [momentId, songChanges] of Object.entries(changes)) {
        const momentIndex = newTimeline.findIndex((m: any) => m.id === momentId);
        if (momentIndex !== -1) {
          for (const change of songChanges as any[]) {
            const songIndex = newTimeline[momentIndex].songs.findIndex(
              (s: any) => s.title === change.old
            );
            if (songIndex !== -1) {
              newTimeline[momentIndex].songs[songIndex] = {
                ...newTimeline[momentIndex].songs[songIndex],
                ...change.new,
              };
            }
          }
        }
      }
    }

    // Apply genre changes
    selectedGenres.forEach((genre) => {
      if (GENRE_CHANGES[genre]) {
        const changes = GENRE_CHANGES[genre];
        for (const [momentId, songChanges] of Object.entries(changes)) {
          const momentIndex = newTimeline.findIndex((m: any) => m.id === momentId);
          if (momentIndex !== -1) {
            for (const change of songChanges as any[]) {
              const songIndex = newTimeline[momentIndex].songs.findIndex(
                (s: any) => s.title === change.old
              );
              if (songIndex !== -1) {
                newTimeline[momentIndex].songs[songIndex] = {
                  ...newTimeline[momentIndex].songs[songIndex],
                  ...change.new,
                };
              }
            }
          }
        }
      }
    });

    // Apply wedding type changes
    if (WEDDING_TYPE_CHANGES[weddingType]) {
      const changes = WEDDING_TYPE_CHANGES[weddingType];
      for (const [momentId, songChanges] of Object.entries(changes)) {
        const momentIndex = newTimeline.findIndex((m: any) => m.id === momentId);
        if (momentIndex !== -1) {
          for (const change of songChanges as any[]) {
            const songIndex = newTimeline[momentIndex].songs.findIndex(
              (s: any) => s.title === change.old
            );
            if (songIndex !== -1) {
              newTimeline[momentIndex].songs[songIndex] = {
                ...newTimeline[momentIndex].songs[songIndex],
                ...change.new,
              };
            }
          }
        }
      }
    }

    setTimeline(newTimeline);
  }, [country, selectedGenres, weddingType]);

  const toggleMoment = (momentId: string) => {
    setExpandedMoments((prev) =>
      prev.includes(momentId)
        ? prev.filter((id) => id !== momentId)
        : [...prev, momentId]
    );
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    );
  };

  const getTotalSongs = () => {
    return timeline.reduce((acc, moment) => {
      const baseSongs = moment.songs.length;
      const expandable = moment.expandable || 0;
      return acc + baseSongs + (expandedMoments.includes(moment.id) ? expandable : 0);
    }, 0);
  };

  const getTotalDuration = () => {
    const totalMinutes = timeline.reduce((acc, moment) => {
      const match = moment.duration.match(/(\d+)/);
      return acc + (match ? parseInt(match[0]) : 0);
    }, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-2">
              <Music className="h-8 w-8 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">Uptune</span>
            </Link>
            <Link
              href="/auth/signup"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              Save & Customize
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content - 2 Pane Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="lg:grid lg:grid-cols-[400px,1fr] lg:gap-8">
          {/* Left Panel - Context Inputs */}
          <div className="mb-8 lg:mb-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Tell us about your wedding
              </h2>

              {/* Country Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Where's your wedding?
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                >
                  <option value="us">United States</option>
                  <option value="uk">United Kingdom</option>
                  <option value="australia">Australia</option>
                  <option value="canada">Canada</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Genre Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Music className="h-4 w-4" />
                  Favorite music genres
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['rock', 'country', 'hip-hop', 'indie', 'electronic', 'pop'].map((genre) => (
                    <button
                      key={genre}
                      onClick={() => toggleGenre(genre)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedGenres.includes(genre)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {genre.charAt(0).toUpperCase() + genre.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wedding Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Wedding vibe
                </label>
                <select
                  value={weddingType}
                  onChange={(e) => setWeddingType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                >
                  <option value="classic">Classic & Elegant</option>
                  <option value="beach">Beach & Tropical</option>
                  <option value="garden">Garden Party</option>
                  <option value="rustic">Rustic & Country</option>
                  <option value="formal">Black Tie Formal</option>
                </select>
              </div>

              {/* Spotify Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Import your music taste
                </label>
                <button className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 transition-colors text-sm text-gray-600 hover:text-purple-600">
                  Connect Spotify Playlist
                </button>
              </div>

              {/* Stats */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total songs</span>
                  <span className="font-semibold text-gray-900">{getTotalSongs()}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600">Total duration</span>
                  <span className="font-semibold text-gray-900">{getTotalDuration()}</span>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/auth/signup"
                className="mt-6 w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                Save this playlist
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Panel - Live Playlist */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold text-gray-900">Your Wedding Playlist</h1>
              <p className="text-gray-600 mt-1">
                Watch your perfect playlist come together as you customize
              </p>
            </div>

            <div className="p-6 space-y-4">
              {timeline.map((moment) => (
                <div
                  key={moment.id}
                  className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => toggleMoment(moment.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{moment.emoji}</span>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">{moment.title}</div>
                        <div className="text-sm text-gray-500">
                          {moment.time} • {moment.duration} • {moment.songs.length} songs
                          {moment.expandable && !expandedMoments.includes(moment.id) && (
                            <span className="text-purple-600"> +{moment.expandable} more</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      className={`h-5 w-5 text-gray-400 transition-transform ${
                        expandedMoments.includes(moment.id) ? 'rotate-90' : ''
                      }`}
                    />
                  </button>

                  {expandedMoments.includes(moment.id) && (
                    <div className="px-4 pb-4 space-y-2">
                      {moment.songs.map((song) => (
                        <div
                          key={song.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-purple-500">♪</span>
                            <div>
                              <span className="font-medium text-gray-900">{song.title}</span>
                              <span className="text-gray-500 ml-2">- {song.artist}</span>
                              {'note' in song && (song as any).note && (
                                <span className="text-xs text-green-600 ml-2">
                                  {(song as any).note}
                                </span>
                              )}
                            </div>
                          </div>
                          <button className="text-purple-600 hover:text-purple-800 text-sm flex items-center gap-1">
                            <Play className="h-3 w-3" />
                            Preview
                          </button>
                        </div>
                      ))}
                      {moment.expandable && (
                        <div className="text-center py-2">
                          <span className="text-sm text-purple-600">
                            +{moment.expandable} more songs available with signup
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}