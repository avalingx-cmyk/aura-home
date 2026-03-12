import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format price for display (without currency symbol)
 * @param price - Price in smallest currency unit (cents) or as a number
 * @returns Formatted price string
 */
export function formatPrice(price: number): string {
  return price.toLocaleString('en-US')
}

export function formatPrice(price: number): string {
  return `Rs. ${price.toLocaleString('en-LK')}`
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}