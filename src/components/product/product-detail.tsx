'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Minus, Plus, ShoppingCart, Heart, Share2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore, CartItem } from '@/lib/store/cart'
import { useToastStore } from '@/lib/store/toast'
import { Product } from '@/lib/data/mock-data'
import { cn } from '@/lib/utils'

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const { addItem, openCart } = useCartStore()
  const { addToast } = useToastStore()

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.sale_price,
      image: product.images[0],
      quantity: quantity,
      stock: product.stock,
    }
    
    addItem(cartItem)
    setAddedToCart(true)
    
    addToast({
      type: 'success',
      title: 'Added to cart',
      message: `${quantity} × ${product.name} added to your cart`,
      action: {
        label: 'View Cart',
        onClick: openCart,
      },
    })
    
    // Reset the added state after 2 seconds
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const displayPrice = product.sale_price || product.price
  const hasDiscount = product.sale_price && product.sale_price < product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
    : 0

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      {/* Product Images */}
      <div className="space-y-4">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-sage-50">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {hasDiscount && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              -{discountPercent}%
            </div>
          )}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {product.images.map((image, index) => (
            <button
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden bg-sage-50 hover:ring-2 ring-forest transition-all"
            >
              <Image
                src={image}
                alt={`${product.name} ${index + 1}`}
                fill
                className="object-cover"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <div>
          <p className="text-sm text-sage-500 uppercase tracking-wide mb-2">
            {product.category}
          </p>
          <h1 className="text-3xl lg:text-4xl font-bold text-wood-900">
            {product.name}
          </h1>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-forest-700">
            Rs. {displayPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-xl text-sage-400 line-through">
              Rs. {product.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Savings */}
        {hasDiscount && (
          <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg inline-flex items-center gap-2">
            <span className="font-semibold">You save Rs. {(product.price - product.sale_price!).toLocaleString()}</span>
          </div>
        )}

        {/* Description */}
        <p className="text-sage-600 leading-relaxed">
          {product.description}
        </p>

        {/* Stock Status */}
        <div className="flex items-center gap-2">
          {product.stock > 0 ? (
            <>
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-sage-600">
                {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left in stock`}
              </span>
            </>
          ) : (
            <>
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm text-red-600">Out of Stock</span>
            </>
          )}
        </div>

        {/* Quantity & Add to Cart */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center border border-sage-200 rounded-lg">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className={cn(
                "p-3 transition-colors",
                quantity <= 1
                  ? "text-sage-300 cursor-not-allowed"
                  : "text-sage-600 hover:text-forest-600"
              )}
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="w-12 text-center font-semibold text-wood-900">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= product.stock}
              className={cn(
                "p-3 transition-colors",
                quantity >= product.stock
                  ? "text-sage-300 cursor-not-allowed"
                  : "text-sage-600 hover:text-forest-600"
              )}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={cn(
              "flex-1 py-6 text-lg font-semibold rounded-lg transition-all duration-300",
              addedToCart
                ? "bg-green-600 hover:bg-green-600"
                : "bg-forest-600 hover:bg-forest-700"
            )}
          >
            {addedToCart ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4 border-t border-sage-200">
          <button className="flex items-center gap-2 text-sage-600 hover:text-forest-600 transition-colors">
            <Heart className="w-5 h-5" />
            <span>Add to Wishlist</span>
          </button>
          <button className="flex items-center gap-2 text-sage-600 hover:text-forest-600 transition-colors">
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>
        </div>

        {/* Product Details */}
        <div className="space-y-4 pt-6 border-t border-sage-200">
          <h3 className="font-semibold text-wood-900">Product Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {product.dimensions && (
              <div>
                <span className="text-sage-500">Dimensions</span>
                <p className="font-medium text-wood-900">{product.dimensions}</p>
              </div>
            )}
            {product.material && (
              <div>
                <span className="text-sage-500">Material</span>
                <p className="font-medium text-wood-900">{product.material}</p>
              </div>
            )}
            {product.color && (
              <div>
                <span className="text-sage-500">Color</span>
                <p className="font-medium text-wood-900">{product.color}</p>
              </div>
            )}
            {product.weight && (
              <div>
                <span className="text-sage-500">Weight</span>
                <p className="font-medium text-wood-900">{product.weight}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}