import { motion } from 'framer-motion'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  stepLabels?: string[]
}

export function ProgressBar({ currentStep, totalSteps, stepLabels }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100
  
  return (
    <div className="w-full mb-8">
      {/* Text Progress */}
      <div className="flex justify-between text-sm text-white/60 mb-3">
        <span>Step {currentStep} of {totalSteps}</span>
        {stepLabels && stepLabels[currentStep - 1] && (
          <span className="text-white/80 font-medium">{stepLabels[currentStep - 1]}</span>
        )}
        <span>{Math.round(progress)}% Complete</span>
      </div>
      
      {/* Visual Progress Bar */}
      <div className="relative">
        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
          <motion.div 
            className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        
        {/* Step Dots */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-1">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <motion.div
              key={step}
              className={`w-3 h-3 rounded-full border-2 ${
                step <= currentStep 
                  ? 'bg-white border-purple-500' 
                  : 'bg-transparent border-white/30'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: step * 0.1 }}
            />
          ))}
        </div>
      </div>
      
      {/* Mobile Step Labels */}
      {stepLabels && (
        <div className="mt-4 lg:hidden">
          <p className="text-xs text-white/60">
            Next: {stepLabels[currentStep] || 'Complete'}
          </p>
        </div>
      )}
    </div>
  )
}