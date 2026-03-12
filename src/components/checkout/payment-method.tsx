'use client'

import { Truck, CreditCard, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaymentMethodProps {
  selected: 'cod' | 'koko'
  onSelect: (method: 'cod' | 'koko') => void
  disabled?: boolean
}

export function PaymentMethod({ selected, onSelect, disabled }: PaymentMethodProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-wood-900">Payment Method</h3>
      
      <div className="space-y-3">
        {/* Cash on Delivery */}
        <button
          type="button"
          onClick={() => onSelect('cod')}
          disabled={disabled}
          className={cn(
            "w-full p-4 rounded-lg border-2 text-left transition-all",
            selected === 'cod'
              ? "border-forest-500 bg-forest-50"
              : "border-sage-200 bg-white hover:border-sage-300",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <div className="flex items-start gap-4">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0",
              selected === 'cod' ? "bg-forest-100" : "bg-sage-100"
            )}>
              <Truck className={cn(
                "w-6 h-6",
                selected === 'cod' ? "text-forest-600" : "text-sage-500"
              )} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-wood-900">Cash on Delivery</h4>
                {selected === 'cod' && (
                  <div className="w-5 h-5 rounded-full bg-forest-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-sm text-sage-600 mt-1">
                Pay with cash when your order is delivered
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-sage-500">
                <Clock className="w-3.5 h-3.5" />
                <span>No additional fees</span>
              </div>
            </div>
          </div>
        </button>

        {/* Koko - Coming Soon */}
        <button
          type="button"
          onClick={() => onSelect('koko')}
          disabled={disabled || true} // Always disabled for now
          className={cn(
            "w-full p-4 rounded-lg border-2 text-left transition-all relative",
            selected === 'koko'
              ? "border-forest-500 bg-forest-50"
              : "border-sage-200 bg-white hover:border-sage-300",
            "opacity-60 cursor-not-allowed"
          )}
        >
          {/* Coming Soon Badge */}
          <div className="absolute top-3 right-3 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
            Coming Soon
          </div>
          
          <div className="flex items-start gap-4">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0",
              selected === 'koko' ? "bg-forest-100" : "bg-sage-100"
            )}>
              <CreditCard className={cn(
                "w-6 h-6",
                selected === 'koko' ? "text-forest-600" : "text-sage-500"
              )} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-wood-900">Koko</h4>
                {selected === 'koko' && (
                  <div className="w-5 h-5 rounded-full bg-forest-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-sm text-sage-600 mt-1">
                Buy now, pay later in 3 interest-free installments
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-sage-500">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Split your payment over 3 months</span>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Payment Info */}
      {selected === 'cod' && (
        <div className="mt-4 p-4 bg-sage-50 rounded-lg">
          <h4 className="font-medium text-wood-900 mb-2">Cash on Delivery</h4>
          <ul className="text-sm text-sage-600 space-y-1">
            <li>• Pay with cash when your order arrives</li>
            <li>• Please have the exact amount ready</li>
            <li>• Our delivery partner will call you before delivery</li>
          </ul>
        </div>
      )}

      {selected === 'koko' && (
        <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-sm text-amber-700">
            Koko payment integration is coming soon! You&apos;ll be able to split your payment into 3 interest-free installments.
          </p>
        </div>
      )}
    </div>
  )
}