import { NextRequest, NextResponse } from 'next/server';
import { getMusicDatabase } from '@/lib/music-database-service';

// Regional song preferences from database
const REGIONAL_PREFERENCES: Record<string, { artists: string[], songs: string[] }> = {
  'north-england': {
    artists: ['oasis', 'the smiths', 'the stone roses', 'joy division', 'the verve', 'james'],
    songs: ['mr. brightside', 'wonderwall', 'chelsea dagger', 'sit down', 'this charming man']
  },
  'london': {
    artists: ['the kinks', 'the clash', 'blur', 'amy winehouse', 'adele'],
    songs: ['waterloo sunset', 'london calling', 'parklife', 'valerie']
  },
  'scotland': {
    artists: ['the proclaimers', 'franz ferdinand', 'biffy clyro', 'calvin harris'],
    songs: ['500 miles', 'take me out', 'loch lomond', 'sweet caroline']
  },
  'northeast': {
    artists: ['billy joel', 'bon jovi', 'bruce springsteen'],
    songs: ['livin on a prayer', 'piano man', 'born to run', 'sweet caroline']
  },
  'south': {
    artists: ['dolly parton', 'garth brooks', 'chris stapleton', 'zac brown band'],
    songs: ['wagon wheel', 'friends in low places', 'chicken fried', 'sweet home alabama']
  },
  'west-coast': {
    artists: ['the beach boys', 'red hot chili peppers', 'sublime', 'tupac'],
    songs: ['california love', 'california gurls', 'hotel california', 'surfin usa']
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { region, moment } = body;
    
    if (!region || !moment) {
      return NextResponse.json(
        { error: 'Region and moment required' },
        { status: 400 }
      );
    }
    
    const musicDb = getMusicDatabase();
    const preferences = REGIONAL_PREFERENCES[region];
    
    if (!preferences) {
      return NextResponse.json({
        success: true,
        songs: [],
        message: 'No regional preferences found'
      });
    }
    
    // Search for regional songs in database
    const regionalSongs = [];
    
    // Search by artist names
    for (const artist of preferences.artists.slice(0, 3)) {
      const allSongs = await musicDb.searchSongs({}, 100);
      const results = allSongs.filter(song => 
        song.artist.toLowerCase().includes(artist)
      ).slice(0, 2);
      regionalSongs.push(...results);
    }
    
    // Search by song titles
    for (const songTitle of preferences.songs.slice(0, 3)) {
      const allSongs = await musicDb.searchSongs({}, 100);
      const results = allSongs.filter(song => 
        song.title.toLowerCase().includes(songTitle)
      ).slice(0, 1);
      regionalSongs.push(...results);
    }
    
    // Remove duplicates
    const uniqueSongs = Array.from(
      new Map(regionalSongs.map(s => [s.spotify_id, s])).values()
    );
    
    // Format for response
    const formattedSongs = uniqueSongs.slice(0, 5).map(song => ({
      id: song.spotify_id,
      title: song.title,
      artist: song.artist,
      album: song.album,
      previewUrl: song.preview_url,
      albumArt: song.album_art_url,
      note: getRegionalNote(song, region),
      regional: true
    }));
    
    return NextResponse.json({
      success: true,
      songs: formattedSongs,
      region,
      moment,
      message: `Found ${formattedSongs.length} regional favorites`
    });
    
  } catch (error) {
    console.error('Transform error:', error);
    return NextResponse.json(
      { error: 'Failed to transform playlist' },
      { status: 500 }
    );
  }
}

function getRegionalNote(song: any, region: string): string | undefined {
  const title = song.title.toLowerCase();
  const artist = song.artist.toLowerCase();
  
  if (region === 'north-england') {
    if (title.includes('mr. brightside')) return 'Manchester anthem';
    if (artist.includes('oasis')) return 'Manchester legends';
    if (title.includes('wonderwall')) return 'Northern classic';
    if (title.includes('chelsea dagger')) return 'Northern favorite';
  }
  
  if (region === 'london') {
    if (title.includes('london')) return 'London anthem';
    if (artist.includes('amy winehouse')) return 'London icon';
  }
  
  if (region === 'south') {
    if (title.includes('sweet home alabama')) return 'Southern anthem';
    if (title.includes('wagon wheel')) return 'Southern favorite';
  }
  
  return undefined;
}