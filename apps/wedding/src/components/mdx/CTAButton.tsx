import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronRight, Download, Music, Sparkles, Play, FileText } from 'lucide-react'

interface CTAButtonProps {
  href?: string
  text: string
  variant?: 'primary' | 'secondary' | 'outline'
  icon?: 'chevron' | 'download' | 'music' | 'sparkles' | 'play' | 'document'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  download?: boolean
  fileName?: string
}

const icons = {
  chevron: ChevronRight,
  download: Download,
  music: Music,
  sparkles: Sparkles,
  play: Play,
  document: FileText,
}

export default function CTAButton({ 
  href = '/auth/signup', 
  text, 
  variant = 'primary', 
  icon = 'chevron',
  size = 'md',
  className = '',
  download = false,
  fileName
}: CTAButtonProps) {
  const Icon = icons[icon]
  const sizeClasses = {
    sm: 'text-sm px-4 py-2',
    md: 'px-6 py-3',
    lg: 'text-lg px-8 py-4'
  }

  const ButtonContent = () => (
    <Button 
      className={`btn-${variant} ${sizeClasses[size]} inline-flex items-center gap-2 ${className}`}
      asChild={!download}
    >
      {download ? (
        <span>
          {text}
          {Icon && <Icon className="w-4 h-4" />}
        </span>
      ) : (
        <span className="inline-flex items-center gap-2">
          {text}
          {Icon && <Icon className="w-4 h-4" />}
        </span>
      )}
    </Button>
  )

  if (download && fileName) {
    // For download links, we'll create a handler
    return (
      <button
        onClick={() => {
          // Create a sample timeline template
          const template = `Wedding Music Timeline Template

Pre-Ceremony (30 minutes)
- Guest arrival music
- Seating music
- Special moments

Processional (5-10 minutes)
- Family entrance
- Wedding party
- Bride's entrance

Ceremony (20-30 minutes)
- Unity ceremony music
- Special readings
- Signing music

Recessional (3-5 minutes)
- Celebration exit music

Cocktail Hour (60 minutes)
- Background music
- Mix of genres

Reception Entrance (5 minutes)
- Wedding party introduction
- Couple's grand entrance

Dinner (90 minutes)
- Background music
- Special announcements

Special Dances
- First dance
- Parent dances
- Anniversary dance

Dance Floor (3-4 hours)
- Opening set
- Peak party time
- Last dance

Notes:
- Add 20% buffer to your playlist
- Test all songs beforehand
- Have backup options ready

Created with UpTune - Start planning at uptune.xyz`

          const blob = new Blob([template], { type: 'text/plain' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = fileName
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }}
      >
        <ButtonContent />
      </button>
    )
  }

  return (
    <Link href={href}>
      <ButtonContent />
    </Link>
  )
}