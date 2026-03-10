'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, Star } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { useCartStore, type CartStore } from '@/lib/store/cart'

interface ProductCardProps {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  image: string
  rating?: number
  reviewCount?: number
  inStock?: boolean
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  comparePrice,
  image,
  rating = 4.5,
  reviewCount = 0,
  inStock = true,
}: ProductCardProps) {
  const addItem = useCartStore((state: CartStore) => state.addItem)

  const handleAddToCart = () => {
    addItem({
      id: `cart-${id}`,
      productId: id,
      name,
      price,
      quantity: 1,
      image,
    })
  }

  return (
    <Card hover className="overflow-hidden group">
      <Link href={`/products/${slug}`}>
        <div className="relative aspect-square bg-beige rounded-2xl overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {!inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-medium">Out of Stock</span>
            </div>
          )}
          <button className="absolute top-3 right-3 w-8 h-8 bg-warm-white rounded-full flex items-center justify-center shadow-soft">
            <Heart className="w-4 h-4 text-wood" />
          </button>
        </div>

        <div className="pt-4">
          <h3 className="font-medium text-wood-dark truncate">{name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-forest font-semibold">{formatPrice(price)}</span>
            {comparePrice && (
              <span className="text-wood/50 line-through text-sm">{formatPrice(comparePrice)}</span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-2 text-sm text-wood">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{rating}</span>
            <span className="text-wood/50">({reviewCount})</span>
          </div>
        </div>
      </Link>

      <Button className="w-full mt-4" size="sm" onClick={handleAddToCart} disabled={!inStock}>
        {inStock ? 'Add to Cart' : 'Out of Stock'}
      </Button>
    </Card>
  )
}