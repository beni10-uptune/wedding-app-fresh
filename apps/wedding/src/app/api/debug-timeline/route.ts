import { NextResponse } from 'next/server';
import { CURATED_SONGS } from '@/data/curatedSongs';
import { WEDDING_MOMENTS_V2 as WEDDING_MOMENTS } from '@/data/weddingMomentsV2';
import { TimelineSong, WeddingV2 } from '@/types/wedding-v2';
import { Timestamp } from 'firebase/firestore';

export async function GET() {
  try {
    // Simulate what happens in the page.tsx
    const newTimeline: WeddingV2['timeline'] = {};
    let totalSongs = 0;
    
    WEDDING_MOMENTS.forEach(moment => {
      const momentSongs = CURATED_SONGS[moment.id as keyof typeof CURATED_SONGS] || [];
      const timelineSongs: TimelineSong[] = [];
      
      // Add first 2 songs from curated list
      if (momentSongs.length > 0) {
        momentSongs.slice(0, 2).forEach((song, index) => {
          const timelineSong: TimelineSong = {
            id: `${moment.id}_${song.id}_${index}`,
            spotifyId: song.id,
            title: song.title,
            artist: song.artist,
            album: song.album || '',
            albumArt: song.albumArt || '',
            previewUrl: song.previewUrl || null,
            duration: song.duration,
            addedBy: 'couple',
            addedAt: Timestamp.now(),
            energy: song.energyLevel || 3,
            explicit: song.explicit || false
          };
          timelineSongs.push(timelineSong);
          totalSongs++;
        });
      }
      
      newTimeline[moment.id] = {
        id: moment.id,
        name: moment.name,
        order: moment.order,
        duration: moment.duration,
        songs: timelineSongs
      };
    });
    
    // Check each moment
    const momentDetails = Object.entries(newTimeline).map(([momentId, moment]) => ({
      momentId,
      name: moment.name,
      songCount: moment.songs.length,
      songs: moment.songs.map(s => ({
        title: s.title,
        artist: s.artist,
        hasAlbumArt: !!s.albumArt && s.albumArt !== '',
        albumArt: s.albumArt
      }))
    }));
    
    return NextResponse.json({
      success: true,
      totalSongs,
      totalMoments: Object.keys(newTimeline).length,
      momentDetails,
      emptyMoments: momentDetails.filter(m => m.songCount === 0).map(m => m.momentId)
    });
  } catch (error) {
    console.error('Debug timeline error:', error);
    return NextResponse.json({ 
      success: false,
      error: String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}