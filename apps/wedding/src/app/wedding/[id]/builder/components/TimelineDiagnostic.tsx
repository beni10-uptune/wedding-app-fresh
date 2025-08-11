'use client'

import { Timeline } from '@/types/wedding-v2'

interface TimelineDiagnosticProps {
  timeline: Timeline
  wedding: any
}

export default function TimelineDiagnostic({ timeline, wedding }: TimelineDiagnosticProps) {
  // Count songs
  const totalSongs = Object.values(timeline).reduce((count, moment) => {
    return count + (moment?.songs?.length || 0)
  }, 0)
  
  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg z-50 max-w-md text-xs">
      <h3 className="font-bold mb-2">🔍 Timeline Diagnostic</h3>
      
      <div className="space-y-1">
        <div>Wedding ID: {wedding?.id}</div>
        <div>Has Timeline Prop: {wedding?.timeline ? '✅' : '❌'}</div>
        <div>Timeline State Keys: {Object.keys(timeline).length}</div>
        <div>Total Songs: {totalSongs}</div>
        
        <div className="mt-2">
          <div className="font-bold">Moments:</div>
          {Object.entries(timeline).map(([id, moment]) => (
            <div key={id} className="ml-2">
              {id}: {moment?.songs?.length || 0} songs
              {moment?.songs?.length > 0 && (
                <div className="ml-2 text-gray-400">
                  First: {moment.songs[0]?.title || 'No title'}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-2">
          <div className="font-bold">Raw Wedding Timeline:</div>
          <pre className="text-[10px] overflow-auto max-h-32">
            {JSON.stringify(wedding?.timeline, null, 2).substring(0, 500)}
          </pre>
        </div>
      </div>
    </div>
  )
}