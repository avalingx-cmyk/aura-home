'use client'

import { useEffect, useState } from 'react'
import { Heart, Loader2 } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { cn } from '@/lib/utils'

interface WishlistButtonProps {
  productId: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'outline' | 'filled'
}

export function WishlistButton({ 
  productId, 
  className,
  size = 'md',
  variant = 'outline'
}: WishlistButtonProps) {
  const [inWishlist, setInWishlist] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Check if user is logged in and if product is in wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)

      if (!currentUser) {
        // Check localStorage for guest wishlist
        const guestWishlist = JSON.parse(localStorage.getItem('aura-guest-wishlist') || '[]')
        setInWishlist(guestWishlist.includes(productId))
        setLoading(false)
        return
      }

      // Check server wishlist for authenticated user
      try {
        const response = await fetch('/api/wishlist')
        if (response.ok) {
          const data = await response.json()
          const isInWishlist = data.wishlist?.some((item: any) => item.product_id === productId)
          setInWishlist(!!isInWishlist)
        }
      } catch (error) {
        console.error('Error checking wishlist:', error)
      } finally {
        setLoading(false)
      }
    }

    checkWishlist()
  }, [productId])

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (toggling) return
    
    setToggling(true)

    if (!user) {
      // Guest user - use localStorage
      const guestWishlist = JSON.parse(localStorage.getItem('aura-guest-wishlist') || '[]')
      
      if (guestWishlist.includes(productId)) {
        // Remove from wishlist
        const updated = guestWishlist.filter((id: string) => id !== productId)
        localStorage.setItem('aura-guest-wishlist', JSON.stringify(updated))
        setInWishlist(false)
      } else {
        // Add to wishlist
        const updated = [...guestWishlist, productId]
        localStorage.setItem('aura-guest-wishlist', JSON.stringify(updated))
        setInWishlist(true)
      }
      
      setToggling(false)
      return
    }

    // Authenticated user - use API
    try {
      const response = await fetch('/api/wishlist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId }),
      })

      if (response.ok) {
        const data = await response.json()
        setInWishlist(data.in_wishlist)
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
    } finally {
      setToggling(false)
    }
  }

  if (loading) {
    return (
      <button
        className={cn(
          'flex items-center justify-center transition-colors',
          size === 'sm' && 'p-1.5',
          size === 'md' && 'p-2',
          size === 'lg' && 'p-2.5',
          className
        )}
        disabled
      >
        <Loader2 className={cn(
          'animate-spin text-wood',
          size === 'sm' && 'h-4 w-4',
          size === 'md' && 'h-5 w-5',
          size === 'lg' && 'h-6 w-6'
        )} />
      </button>
    )
  }

  return (
    <button
      onClick={handleToggle}
      disabled={toggling}
      className={cn(
        'flex items-center justify-center transition-all hover:scale-110 active:scale-95',
        inWishlist 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-wood hover:text-red-500',
        size === 'sm' && 'p-1.5',
        size === 'md' && 'p-2',
        size === 'lg' && 'p-2.5',
        className
      )}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart 
        className={cn(
          'transition-all',
          inWishlist ? 'fill-current' : 'fill-none',
          size === 'sm' && 'h-4 w-4',
          size === 'md' && 'h-5 w-5',
          size === 'lg' && 'h-6 w-6'
        )} 
      />
    </button>
  )
}
