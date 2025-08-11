import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CURATED_SONGS } from '@/data/curatedSongs';
import { WEDDING_MOMENTS_V2 as WEDDING_MOMENTS } from '@/data/weddingMomentsV2';
import { TimelineSong, WeddingV2 } from '@/types/wedding-v2';

export async function POST(request: NextRequest) {
  try {
    const { weddingId } = await request.json();
    
    if (!weddingId) {
      return NextResponse.json({ error: 'Wedding ID required' }, { status: 400 });
    }
    
    // Create fresh timeline with default songs
    const newTimeline: WeddingV2['timeline'] = {};
    let totalSongs = 0;
    
    WEDDING_MOMENTS.forEach(moment => {
      const momentSongs = CURATED_SONGS[moment.id as keyof typeof CURATED_SONGS] || [];
      const timelineSongs: TimelineSong[] = [];
      
      // Add first 2 songs from curated list
      if (momentSongs.length > 0) {
        momentSongs.slice(0, 2).forEach((song, index) => {
          timelineSongs.push({
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
          });
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
    
    // Force update the database
    await updateDoc(doc(db, 'weddings', weddingId), {
      timeline: newTimeline,
      updatedAt: Timestamp.now()
    });
    
    return NextResponse.json({
      success: true,
      message: `Timeline initialized with ${totalSongs} songs across ${Object.keys(newTimeline).length} moments`,
      totalSongs,
      moments: Object.keys(newTimeline).map(id => ({
        id,
        name: newTimeline[id].name,
        songCount: newTimeline[id].songs.length
      }))
    });
  } catch (error) {
    console.error('Force timeline init error:', error);
    return NextResponse.json({ 
      error: String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}