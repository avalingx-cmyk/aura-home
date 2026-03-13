'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, ShoppingCart, Heart, User } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/search', icon: Search, label: 'Search' },
  { href: '/cart', icon: ShoppingCart, label: 'Cart' },
  { href: '/wishlist', icon: Heart, label: 'Wishlist' },
  { href: '/account', icon: User, label: 'Account' },
]

export function BottomTabs() {
  const pathname = usePathname()
  const itemCount = useCartStore((state) => state.getTotalItems())

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-warm-white border-t border-beige md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href
          const showBadge = label === 'Cart' && itemCount > 0

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors relative',
                isActive ? 'text-forest' : 'text-wood'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{label}</span>
              {showBadge && (
                <span className="absolute top-0 right-2 w-4 h-4 bg-forest text-white text-[10px] rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}