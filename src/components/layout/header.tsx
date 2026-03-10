'use client'

import Link from 'next/link'
import { ShoppingCart, Menu, Search, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store/cart'

export function Header() {
  const itemCount = useCartStore((state) => state.getItemCount())
  const toggleCart = useCartStore((state) => state.toggleCart)

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-beige">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-forest">Aura</span>
            <span className="text-2xl font-light text-wood">Home</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-wood-dark hover:text-forest transition-colors">Home</Link>
            <Link href="/products" className="text-wood-dark hover:text-forest transition-colors">Shop</Link>
            <Link href="/blog" className="text-wood-dark hover:text-forest transition-colors">Blog</Link>
            <Link href="/about" className="text-wood-dark hover:text-forest transition-colors">About</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm"><Search className="w-5 h-5" /></Button>
            <Button variant="ghost" size="sm"><User className="w-5 h-5" /></Button>
            <Button variant="ghost" size="sm" onClick={toggleCart} className="relative">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-forest text-white text-xs rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="sm" className="md:hidden"><Menu className="w-5 h-5" /></Button>
          </div>
        </div>
      </div>
    </header>
  )
}