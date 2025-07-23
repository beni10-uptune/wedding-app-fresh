'use client'

import { useState } from 'react'
import { Clock, Music, Users, Utensils, PartyPopper, Timer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface TimelineEvent {
  id: string
  time: string
  title: string
  duration: number
  icon: React.ElementType
  color: string
  musicStyle: string
  songCount: number
  description: string
}

const defaultTimeline: TimelineEvent[] = [
  {
    id: 'ceremony',
    time: '4:00 PM',
    title: 'Ceremony',
    duration: 30,
    icon: Users,
    color: 'bg-purple-500',
    musicStyle: 'Classical & Romantic',
    songCount: 8,
    description: 'Processional, bride entrance, and recessional music',
  },
  {
    id: 'cocktail',
    time: '4:30 PM',
    title: 'Cocktail Hour',
    duration: 60,
    icon: Music,
    color: 'bg-pink-500',
    musicStyle: 'Jazz & Light Acoustic',
    songCount: 17,
    description: 'Background music for mingling and drinks',
  },
  {
    id: 'dinner',
    time: '5:30 PM',
    title: 'Dinner',
    duration: 90,
    icon: Utensils,
    color: 'bg-indigo-500',
    musicStyle: 'Soft Pop & Standards',
    songCount: 23,
    description: 'Ambient music during the meal',
  },
  {
    id: 'dancing',
    time: '7:00 PM',
    title: 'Dancing & Party',
    duration: 180,
    icon: PartyPopper,
    color: 'bg-green-500',
    musicStyle: 'Dance Hits & Crowd Favorites',
    songCount: 60,
    description: 'First dance, parent dances, and open dancing',
  },
]

export default function InteractiveTimeline() {
  const [selectedEvent, setSelectedEvent] = useState<string>('ceremony')
  const activeEvent = defaultTimeline.find(e => e.id === selectedEvent)!

  return (
    <div className="my-8 p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">
      <div className="flex items-center gap-3 mb-6">
        <Timer className="w-8 h-8 text-purple-400" />
        <h3 className="text-2xl font-bold text-white">Interactive Wedding Timeline</h3>
      </div>
      
      {/* Timeline */}
      <div className="relative mb-8">
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-white/20"></div>
        <div className="flex justify-between relative">
          {defaultTimeline.map((event) => {
            const Icon = event.icon
            const isActive = selectedEvent === event.id
            
            return (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event.id)}
                className="flex flex-col items-center group"
              >
                <div className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center transition-all',
                  isActive ? event.color : 'bg-white/20',
                  'group-hover:scale-110'
                )}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={cn(
                  'text-xs mt-2 font-medium',
                  isActive ? 'text-white' : 'text-white/60'
                )}>
                  {event.time}
                </span>
                <span className={cn(
                  'text-xs',
                  isActive ? 'text-white/80' : 'text-white/50'
                )}>
                  {event.title}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Event Details */}
      <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-6 rounded-lg border border-purple-500/30">
        <div className="flex items-center gap-3 mb-4">
          <div className={cn('p-3 rounded-lg', activeEvent.color)}>
            <activeEvent.icon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-white">{activeEvent.title}</h4>
            <p className="text-sm text-white/70">
              {activeEvent.time} • {activeEvent.duration} minutes
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-white/10 rounded-lg border border-white/20">
            <h5 className="font-semibold mb-2 text-white">Music Style</h5>
            <p className="text-white/80">{activeEvent.musicStyle}</p>
          </div>
          <div className="p-4 bg-white/10 rounded-lg border border-white/20">
            <h5 className="font-semibold mb-2 text-white">Songs Needed</h5>
            <p className="text-2xl font-bold text-purple-300">{activeEvent.songCount}</p>
          </div>
        </div>

        <p className="text-white/70 mb-6">{activeEvent.description}</p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/auth/signup" className="flex-1">
            <Button className="w-full btn-primary">
              <Clock className="w-4 h-4 mr-2" />
              Build Your Timeline
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20"
          >
            View Sample Playlist
          </Button>
        </div>
      </div>
    </div>
  )
}