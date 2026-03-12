'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, Star, ShoppingCart, Check } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { useCartStore, CartItem } from '@/lib/store/cart'
import { useToastStore } from '@/lib/store/toast'
import { useState } from 'react'

interface ProductCardProps {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number | null
  image: string
  rating?: number
  reviewCount?: number
  inStock?: boolean
  stock?: number
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
  stock = 10,
}: ProductCardProps) {
  const [addedToCart, setAddedToCart] = useState(false)
  const { addItem, openCart } = useCartStore()
  const { addToast } = useToastStore()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const cartItem: CartItem = {
      id: `${id}-${Date.now()}`,
      productId: id,
      name,
      price,
      salePrice: comparePrice && comparePrice < price ? comparePrice : undefined,
      image,
      quantity: 1,
      stock,
    }
    
    addItem(cartItem)
    setAddedToCart(true)
    
    addToast({
      type: 'success',
      title: 'Added to cart',
      message: `${name} added to your cart`,
      action: {
        label: 'View Cart',
        onClick: openCart,
      },
    })
    
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const hasDiscount = comparePrice && comparePrice < price
  const discountPercent = hasDiscount
    ? Math.round(((price - comparePrice!) / price) * 100)
    : 0

  return (
    <Card hover className="overflow-hidden group">
      <Link href={`/products/${slug}`}>
        <div className="relative aspect-square bg-beige rounded-2xl overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {!inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-medium">Out of Stock</span>
            </div>
          )}
          {hasDiscount && inStock && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              -{discountPercent}%
            </div>
          )}
          <button 
            className="absolute top-3 right-3 w-8 h-8 bg-warm-white rounded-full flex items-center justify-center shadow-soft hover:bg-white transition-colors"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <Heart className="w-4 h-4 text-wood hover:text-red-500 transition-colors" />
          </button>
        </div>

        <div className="pt-4">
          <h3 className="font-medium text-wood-dark truncate">{name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-forest font-semibold">{formatPrice(price)}</span>
            {hasDiscount && (
              <span className="text-wood/50 line-through text-sm">{formatPrice(comparePrice!)}</span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-2 text-sm text-wood">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{rating}</span>
            <span className="text-wood/50">({reviewCount})</span>
          </div>
        </div>
      </Link>

      <Button
        className="w-full mt-4"
        size="sm"
        onClick={handleAddToCart}
        disabled={!inStock}
        variant={addedToCart ? 'default' : 'default'}
      >
        {addedToCart ? (
          <>
            <Check className="w-4 h-4 mr-1" />
            Added
          </>
        ) : !inStock ? (
          'Out of Stock'
        ) : (
          <>
            <ShoppingCart className="w-4 h-4 mr-1" />
            Add to Cart
          </>
        )}
      </Button>
    </Card>
  )
}