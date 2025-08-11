import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CURATED_SONGS } from '@/data/curatedSongs';
import { WEDDING_MOMENTS_V2 as WEDDING_MOMENTS } from '@/data/weddingMomentsV2';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: weddingId } = await params;
    
    // 1. Check if wedding exists
    const weddingDoc = await getDoc(doc(db, 'weddings', weddingId));
    if (!weddingDoc.exists()) {
      return NextResponse.json({ 
        error: 'Wedding not found',
        weddingId 
      }, { status: 404 });
    }
    
    const weddingData = weddingDoc.data();
    
    // 2. Analyze timeline structure
    const timelineAnalysis = {
      hasTimeline: !!weddingData.timeline,
      timelineType: typeof weddingData.timeline,
      timelineKeys: weddingData.timeline ? Object.keys(weddingData.timeline) : [],
      moments: {} as Record<string, any>
    };
    
    // 3. Analyze each moment
    if (weddingData.timeline) {
      Object.entries(weddingData.timeline).forEach(([momentId, moment]: [string, any]) => {
        timelineAnalysis.moments[momentId] = {
          exists: true,
          type: typeof moment,
          hasSongs: !!moment?.songs,
          songsType: typeof moment?.songs,
          songsIsArray: Array.isArray(moment?.songs),
          songCount: moment?.songs?.length || 0,
          firstSong: moment?.songs?.[0] || null,
          momentStructure: moment ? {
            hasId: 'id' in moment,
            hasName: 'name' in moment,
            hasOrder: 'order' in moment,
            hasDuration: 'duration' in moment,
            hasSongs: 'songs' in moment,
            keys: Object.keys(moment)
          } : null
        };
      });
    }
    
    // 4. Check what we SHOULD have
    const expectedStructure = {
      totalMoments: WEDDING_MOMENTS.length,
      momentsWithSongs: Object.keys(CURATED_SONGS).length,
      expectedMomentIds: WEDDING_MOMENTS.map(m => m.id),
      curatedMomentIds: Object.keys(CURATED_SONGS)
    };
    
    // 5. Check for common issues
    const issues = [];
    
    if (!weddingData.timeline) {
      issues.push('No timeline field in wedding document');
    } else if (typeof weddingData.timeline !== 'object') {
      issues.push(`Timeline is ${typeof weddingData.timeline}, expected object`);
    } else {
      // Check each expected moment
      WEDDING_MOMENTS.forEach(moment => {
        if (!weddingData.timeline[moment.id]) {
          issues.push(`Missing moment: ${moment.id}`);
        } else if (!weddingData.timeline[moment.id].songs) {
          issues.push(`Moment ${moment.id} has no songs field`);
        } else if (!Array.isArray(weddingData.timeline[moment.id].songs)) {
          issues.push(`Moment ${moment.id} songs is not an array`);
        } else if (weddingData.timeline[moment.id].songs.length === 0) {
          issues.push(`Moment ${moment.id} has empty songs array`);
        }
      });
    }
    
    // 6. Check raw data
    const rawTimeline = weddingData.timeline ? JSON.stringify(weddingData.timeline).substring(0, 1000) : 'null';
    
    return NextResponse.json({
      weddingId,
      diagnosis: {
        weddingExists: true,
        hasTimeline: !!weddingData.timeline,
        timelineAnalysis,
        expectedStructure,
        issues,
        rawTimelinePreview: rawTimeline,
        recommendation: issues.length > 0 ? 
          'Timeline needs initialization. Issues found: ' + issues.join(', ') :
          'Timeline structure looks correct'
      }
    });
    
  } catch (error) {
    console.error('Diagnose error:', error);
    return NextResponse.json({ 
      error: String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}