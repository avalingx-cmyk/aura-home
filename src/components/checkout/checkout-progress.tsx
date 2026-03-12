'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface CheckoutProgressProps {
  currentStep: 'cart' | 'details' | 'confirm'
}

export function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  const steps = [
    { id: 'cart', label: 'Cart', number: 1 },
    { id: 'details', label: 'Details', number: 2 },
    { id: 'confirm', label: 'Confirm', number: 3 },
  ]

  const currentIndex = steps.findIndex(s => s.id === currentStep)

  return (
    <div className="w-full">
      {/* Desktop */}
      <div className="hidden md:flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            {/* Step */}
            <div className="flex items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors",
                  currentIndex > index
                    ? "bg-forest-600 text-white"
                    : currentIndex === index
                    ? "bg-forest-600 text-white"
                    : "bg-sage-200 text-sage-500"
                )}
              >
                {currentIndex > index ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={cn(
                  "ml-3 font-medium",
                  currentIndex >= index ? "text-wood-900" : "text-sage-400"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-16 h-0.5 mx-4",
                  currentIndex > index ? "bg-forest-600" : "bg-sage-200"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-wood-900">
            Step {currentIndex + 1} of {steps.length}
          </span>
          <span className="text-sm text-forest-600 font-medium">
            {steps[currentIndex].label}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                currentIndex >= index ? "bg-forest-600" : "bg-sage-200"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}