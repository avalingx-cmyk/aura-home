import { Suspense } from 'react'
import OrderConfirmationContent from './order-confirmation-content'

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-sage-500">Loading order details...</div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  )
}