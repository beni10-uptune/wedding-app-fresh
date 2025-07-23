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
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-900',
  },
  tip: {
    icon: Lightbulb,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-600',
    titleColor: 'text-green-900',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    iconColor: 'text-yellow-600',
    titleColor: 'text-yellow-900',
  },
  important: {
    icon: AlertCircle,
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    iconColor: 'text-purple-600',
    titleColor: 'text-purple-900',
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
      'my-6 p-4 rounded-lg border-2',
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
          <div className="text-gray-700 prose-sm max-w-none">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}