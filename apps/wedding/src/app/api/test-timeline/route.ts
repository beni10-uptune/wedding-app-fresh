import { NextResponse } from 'next/server';
import { CURATED_SONGS } from '@/data/curatedSongs';
import { WEDDING_MOMENTS } from '@/data/weddingMoments';

export async function GET() {
  try {
    // Check what songs we have
    const songCounts: Record<string, number> = {};
    const missingSongs: string[] = [];
    
    WEDDING_MOMENTS.forEach(moment => {
      const momentSongs = CURATED_SONGS[moment.id as keyof typeof CURATED_SONGS];
      if (!momentSongs) {
        missingSongs.push(moment.id);
        songCounts[moment.id] = 0;
      } else {
        songCounts[moment.id] = momentSongs.length;
      }
    });
    
    // Check the structure of first song in each moment
    const sampleSongs: Record<string, any> = {};
    Object.entries(CURATED_SONGS).forEach(([momentId, songs]) => {
      if (songs && songs.length > 0) {
        sampleSongs[momentId] = {
          song: songs[0],
          hasAlbumArt: !!songs[0].albumArt,
          hasPreviewUrl: !!songs[0].previewUrl,
          keys: Object.keys(songs[0])
        };
      }
    });
    
    return NextResponse.json({
      songCounts,
      missingSongs,
      totalMoments: WEDDING_MOMENTS.length,
      curatedMoments: Object.keys(CURATED_SONGS).length,
      sampleSongs,
      allMomentIds: WEDDING_MOMENTS.map(m => m.id),
      allCuratedIds: Object.keys(CURATED_SONGS)
    });
  } catch (error) {
    console.error('Test timeline error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}