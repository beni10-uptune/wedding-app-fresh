'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { List } from 'lucide-react'

interface TOCItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const [headings, setHeadings] = useState<TOCItem[]>([])

  useEffect(() => {
    // Extract headings from content
    const headingRegex = /^(#{2,3})\s+(.+)$/gm
    const matches = Array.from(content.matchAll(headingRegex))
    
    const items: TOCItem[] = matches.map((match) => {
      const level = match[1].length
      const text = match[2]
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      
      return { id, text, level }
    })
    
    setHeadings(items)
  }, [content])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -70% 0px' }
    )

    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <div className="sticky top-20 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-xl">
      <div className="flex items-center gap-2 mb-4">
        <List className="w-5 h-5 text-purple-400" />
        <h3 className="font-semibold text-white">Table of Contents</h3>
      </div>
      <nav>
        <ul className="space-y-2">
          {headings.map(({ id, text, level }) => (
            <li
              key={id}
              style={{ paddingLeft: `${(level - 2) * 1}rem` }}
            >
              <a
                href={`#${id}`}
                className={cn(
                  'block text-sm py-1 transition-colors',
                  activeId === id 
                    ? 'text-purple-400 font-medium' 
                    : 'text-white/60 hover:text-white'
                )}
              >
                {text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}