import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { WeddingV2 } from '@/types/wedding-v2';

export async function POST(request: NextRequest) {
  try {
    const { weddingId } = await request.json();
    
    if (!weddingId) {
      return NextResponse.json({ error: 'Wedding ID required' }, { status: 400 });
    }
    
    // Get the wedding document
    const weddingDoc = await getDoc(doc(db, 'weddings', weddingId));
    
    if (!weddingDoc.exists()) {
      return NextResponse.json({ error: 'Wedding not found' }, { status: 404 });
    }
    
    const rawData = weddingDoc.data();
    
    // Check if already has V2 timeline
    if (rawData.timelineV2 && typeof rawData.timelineV2 === 'object' && !Array.isArray(rawData.timelineV2)) {
      return NextResponse.json({ 
        message: 'Wedding already has V2 timeline format',
        hasTimelineV2: true,
        totalMoments: Object.keys(rawData.timelineV2).length,
        totalSongs: Object.values(rawData.timelineV2).reduce((acc: number, m: any) => 
          acc + (m?.songs?.length || 0), 0
        )
      });
    }
    
    // Check if timeline exists and is an array (old format)
    if (!rawData.timeline || !Array.isArray(rawData.timeline)) {
      return NextResponse.json({ 
        error: 'Wedding does not have an old format timeline to migrate',
        hasTimeline: !!rawData.timeline,
        isArray: Array.isArray(rawData.timeline)
      }, { status: 400 });
    }
    
    // Convert array timeline to V2 object format
    const timelineV2: WeddingV2['timeline'] = {};
    let totalSongs = 0;
    
    rawData.timeline.forEach((moment: any, index: number) => {
      const timelineSongs = (moment.songs || []).map((song: any, songIndex: number) => ({
        id: `${moment.id}_${song.id}_${songIndex}`,
        spotifyId: song.spotifyId || song.id,
        title: song.title,
        artist: song.artist,
        album: song.album || '',
        albumArt: song.albumArt || '',
        previewUrl: song.previewUrl || null,
        duration: song.duration || 0,
        addedBy: 'couple',
        addedAt: Timestamp.now(),
        energy: song.bpm ? Math.min(5, Math.max(1, Math.round((song.bpm - 60) / 40))) : 3,
        explicit: false
      }));
      
      totalSongs += timelineSongs.length;
      
      timelineV2[moment.id] = {
        id: moment.id,
        name: moment.title,
        order: index,
        duration: parseInt(moment.duration) || 30,
        songs: timelineSongs
      };
    });
    
    // Update the document with V2 timeline
    const updateData: any = {
      timelineV2,
      updatedAt: Timestamp.now(),
      // Ensure other V2 fields exist
      coupleNames: rawData.coupleNames || (rawData.weddingName ? rawData.weddingName.split(' & ') : ['Partner 1', 'Partner 2']),
      weddingDate: rawData.weddingDate || Timestamp.now(),
      createdAt: rawData.createdAt || Timestamp.now(),
      paymentStatus: rawData.paymentStatus || 'unpaid',
      slug: rawData.slug || weddingId
    };
    
    await updateDoc(doc(db, 'weddings', weddingId), updateData);
    
    return NextResponse.json({
      success: true,
      message: `Timeline migrated to V2 format with ${totalSongs} songs across ${Object.keys(timelineV2).length} moments`,
      totalSongs,
      moments: Object.keys(timelineV2).map(id => ({
        id,
        name: timelineV2[id].name,
        songCount: timelineV2[id].songs.length
      }))
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ 
      error: String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const weddingId = searchParams.get('weddingId');
  
  if (!weddingId) {
    return NextResponse.json({ error: 'Wedding ID required' }, { status: 400 });
  }
  
  try {
    const weddingDoc = await getDoc(doc(db, 'weddings', weddingId));
    
    if (!weddingDoc.exists()) {
      return NextResponse.json({ error: 'Wedding not found' }, { status: 404 });
    }
    
    const data = weddingDoc.data();
    
    return NextResponse.json({
      hasTimeline: !!data.timeline,
      hasTimelineV2: !!data.timelineV2,
      timelineIsArray: Array.isArray(data.timeline),
      timelineV2IsObject: data.timelineV2 && typeof data.timelineV2 === 'object' && !Array.isArray(data.timelineV2),
      oldTimelineMoments: data.timeline ? (Array.isArray(data.timeline) ? data.timeline.length : Object.keys(data.timeline).length) : 0,
      v2TimelineMoments: data.timelineV2 ? Object.keys(data.timelineV2).length : 0,
      oldTimelineSongs: data.timeline ? (
        Array.isArray(data.timeline) 
          ? data.timeline.reduce((acc: number, m: any) => acc + (m?.songs?.length || 0), 0)
          : Object.values(data.timeline).reduce((acc: number, m: any) => acc + (m?.songs?.length || 0), 0)
      ) : 0,
      v2TimelineSongs: data.timelineV2 ? 
        Object.values(data.timelineV2).reduce((acc: number, m: any) => acc + (m?.songs?.length || 0), 0) : 0
    });
  } catch (error) {
    console.error('Check error:', error);
    return NextResponse.json({ 
      error: String(error)
    }, { status: 500 });
  }
}