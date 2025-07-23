'use client'

import { useState, useEffect } from 'react'
import { Check, Download, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

interface ChecklistItem {
  id: string
  text: string
  category?: string
  timeframe?: string
}

interface ChecklistProps {
  title?: string
  items: ChecklistItem[]
  saveable?: boolean
}

export default function Checklist({ 
  title = 'Wedding Music Checklist',
  items,
  saveable = true
}: ChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<string[]>([])
  const { user } = useAuth()

  useEffect(() => {
    // Load saved progress if user is logged in
    if (user && saveable) {
      const saved = localStorage.getItem(`checklist_${user.uid}`)
      if (saved) {
        setCheckedItems(JSON.parse(saved))
      }
    }
  }, [user, saveable])

  const handleToggle = (itemId: string) => {
    const newCheckedItems = checkedItems.includes(itemId)
      ? checkedItems.filter(id => id !== itemId)
      : [...checkedItems, itemId]
    
    setCheckedItems(newCheckedItems)
    
    // Save progress
    if (user && saveable) {
      localStorage.setItem(`checklist_${user.uid}`, JSON.stringify(newCheckedItems))
    }
  }

  const handleSave = () => {
    if (!user) {
      toast.error('Please sign in to save your checklist')
      return
    }
    
    toast.success('Checklist saved!')
  }

  const handleDownload = () => {
    const checkedText = items
      .map(item => `[${checkedItems.includes(item.id) ? 'x' : ' '}] ${item.text}`)
      .join('\n')
    
    const blob = new Blob([`${title}\n\n${checkedText}`], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'wedding-music-checklist.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const progress = (checkedItems.length / items.length) * 100

  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || 'General'
    if (!acc[category]) acc[category] = []
    acc[category].push(item)
    return acc
  }, {} as Record<string, ChecklistItem[]>)

  return (
    <div className="my-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">
            {checkedItems.length} of {items.length} completed
          </span>
          <span className="text-sm font-medium text-purple-600">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-6 mb-6">
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <div key={category}>
            <h4 className="font-semibold text-gray-700 mb-3">{category}</h4>
            <div className="space-y-2">
              {categoryItems.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 bg-white rounded hover:shadow-sm transition-shadow">
                  <Checkbox
                    id={item.id}
                    checked={checkedItems.includes(item.id)}
                    onCheckedChange={() => handleToggle(item.id)}
                    className="mt-0.5"
                  />
                  <label
                    htmlFor={item.id}
                    className={`flex-1 cursor-pointer ${
                      checkedItems.includes(item.id) ? 'line-through text-gray-500' : ''
                    }`}
                  >
                    <span className="block">{item.text}</span>
                    {item.timeframe && (
                      <span className="text-xs text-gray-500">{item.timeframe}</span>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        {saveable && (
          <Button onClick={handleSave} variant="outline" className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            Save Progress
          </Button>
        )}
        <Button onClick={handleDownload} variant="outline" className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>
    </div>
  )
}