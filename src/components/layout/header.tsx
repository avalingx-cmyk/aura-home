'use client'

import Link from 'next/link'
import { Menu, Search, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CartBadge } from '@/components/cart/cart-badge'

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-sm border-b border-beige">
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
            <CartBadge />
            <Button variant="ghost" size="sm" className="md:hidden"><Menu className="w-5 h-5" /></Button>
          </div>
        </div>
      </div>
    </header>
  )
}