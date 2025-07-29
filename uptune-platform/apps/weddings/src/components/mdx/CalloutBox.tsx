'use client'

import { AlertCircle, Lightbulb, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CalloutBoxProps {
  type?: 'info' | 'tip' | 'warning' | 'important'
  title?: string
  children: React.ReactNode
}

const typeConfig = {
  info: {
    icon: Info,
    bgColor: 'bg-blue-600/10',
    borderColor: 'border-blue-500/30',
    iconColor: 'text-blue-400',
    titleColor: 'text-blue-300',
  },
  tip: {
    icon: Lightbulb,
    bgColor: 'bg-green-600/10',
    borderColor: 'border-green-500/30',
    iconColor: 'text-green-400',
    titleColor: 'text-green-300',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-600/10',
    borderColor: 'border-yellow-500/30',
    iconColor: 'text-yellow-400',
    titleColor: 'text-yellow-300',
  },
  important: {
    icon: AlertCircle,
    bgColor: 'bg-purple-600/10',
    borderColor: 'border-purple-500/30',
    iconColor: 'text-purple-400',
    titleColor: 'text-purple-300',
  },
}

export default function CalloutBox({ 
  type = 'info', 
  title,
  children 
}: CalloutBoxProps) {
  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <div className={cn(
      'my-6 p-4 rounded-lg border-2 backdrop-blur-sm',
      config.bgColor,
      config.borderColor
    )}>
      <div className="flex gap-3">
        <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', config.iconColor)} />
        <div className="flex-1">
          {title && (
            <h4 className={cn('font-semibold mb-1', config.titleColor)}>
              {title}
            </h4>
          )}
          <div className="text-white/80 prose-sm max-w-none">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}