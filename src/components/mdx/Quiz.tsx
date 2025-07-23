'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { ChevronRight, RotateCcw } from 'lucide-react'

interface QuizQuestion {
  id: string
  question: string
  options: { value: string; label: string }[]
}

interface QuizProps {
  title?: string
  questions: QuizQuestion[]
  resultType?: 'playlist' | 'style' | 'recommendation'
}

const musicStyles = {
  classic: {
    name: 'Classic Elegance',
    description: 'Timeless songs that never go out of style',
    traits: ['Frank Sinatra', 'Ella Fitzgerald', 'Classical pieces'],
    color: 'from-amber-500 to-yellow-600',
  },
  modern: {
    name: 'Modern Romance',
    description: 'Contemporary hits and current favorites',
    traits: ['Ed Sheeran', 'Taylor Swift', 'John Legend'],
    color: 'from-pink-500 to-rose-600',
  },
  party: {
    name: 'Party Starter',
    description: 'High-energy tracks to keep the dance floor packed',
    traits: ['Bruno Mars', 'Uptown Funk', 'Dance classics'],
    color: 'from-purple-500 to-indigo-600',
  },
  indie: {
    name: 'Indie Soul',
    description: 'Unique and alternative selections',
    traits: ['Bon Iver', 'First Aid Kit', 'Acoustic covers'],
    color: 'from-green-500 to-teal-600',
  },
}

export default function Quiz({ title = 'Find Your Wedding Music Style', questions, resultType = 'style' }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<string | null>(null)

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: value })
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResult()
    }
  }

  const calculateResult = () => {
    // Simple scoring based on answers
    const scores = {
      classic: 0,
      modern: 0,
      party: 0,
      indie: 0,
    }
    
    Object.values(answers).forEach((answer) => {
      if (answer.includes('classic') || answer.includes('timeless')) scores.classic++
      if (answer.includes('modern') || answer.includes('contemporary')) scores.modern++
      if (answer.includes('party') || answer.includes('dance')) scores.party++
      if (answer.includes('indie') || answer.includes('unique')) scores.indie++
    })
    
    const topStyle = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]
    setResult(topStyle)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setResult(null)
  }

  if (result && resultType === 'style') {
    const style = musicStyles[result as keyof typeof musicStyles]
    
    return (
      <div className="my-8 p-8 bg-gradient-to-br from-gray-50 to-purple-50 rounded-lg">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2">Your Wedding Music Style:</h3>
          <div className={`inline-block px-6 py-3 rounded-full bg-gradient-to-r ${style.color} text-white font-bold text-xl mb-4`}>
            {style.name}
          </div>
          <p className="text-gray-600 mb-4">{style.description}</p>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {style.traits.map((trait) => (
              <span key={trait} className="px-3 py-1 bg-white rounded-full text-sm">
                {trait}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Create Your Playlist
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" onClick={resetQuiz}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Take Again
          </Button>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="my-8 p-8 bg-gradient-to-br from-gray-50 to-purple-50 rounded-lg">
      <h3 className="text-2xl font-bold mb-6 text-center">{title}</h3>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div 
          className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-2">
          Question {currentQuestion + 1} of {questions.length}
        </p>
        <h4 className="text-xl font-semibold mb-4">{question.question}</h4>
        
        <RadioGroup onValueChange={handleAnswer}>
          <div className="space-y-3">
            {question.options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-white transition-colors">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}