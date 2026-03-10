import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'bg-warm-white rounded-3xl p-4 shadow-soft',
        hover && 'transition-transform hover:-translate-y-1 hover:shadow-medium',
        className
      )}
    >
      {children}
    </div>
  )
}