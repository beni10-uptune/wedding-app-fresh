'use client'

import { useState, useEffect } from 'react'
import { Check, Download, Save, ListChecks } from 'lucide-react'
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
    <div className="my-8 p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <ListChecks className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-white/60">
            {checkedItems.length} of {items.length} completed
          </span>
          <span className="text-sm font-medium text-purple-400">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-6 mb-6">
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <div key={category}>
            <h4 className="font-semibold text-white/80 mb-3">{category}</h4>
            <div className="space-y-2">
              {categoryItems.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all border border-white/10">
                  <Checkbox
                    id={item.id}
                    checked={checkedItems.includes(item.id)}
                    onCheckedChange={() => handleToggle(item.id)}
                    className="mt-0.5 border-white/30 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                  <label
                    htmlFor={item.id}
                    className={`flex-1 cursor-pointer ${
                      checkedItems.includes(item.id) ? 'line-through text-white/50' : 'text-white/80'
                    }`}
                  >
                    <span className="block">{item.text}</span>
                    {item.timeframe && (
                      <span className="text-xs text-white/50">{item.timeframe}</span>
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
          <Button 
            onClick={handleSave} 
            variant="ghost" 
            className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Progress
          </Button>
        )}
        <Button 
          onClick={handleDownload} 
          variant="ghost" 
          className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>
    </div>
  )
}