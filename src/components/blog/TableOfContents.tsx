'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

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
    <div className="sticky top-20 bg-gray-50 p-6 rounded-lg">
      <h3 className="font-semibold mb-4">Table of Contents</h3>
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
                  'block text-sm py-1 hover:text-purple-600 transition-colors',
                  activeId === id ? 'text-purple-600 font-medium' : 'text-gray-600'
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