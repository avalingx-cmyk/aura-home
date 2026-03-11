'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Share2, Minus, Plus, Check, ChevronRight, Star, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore, type CartStore } from '@/lib/store/cart'
import { formatPrice, cn } from '@/lib/utils'
import { getRelatedProducts, getProductBySlug, getCategoryBySlug, type Product } from '@/lib/data/mock-data'
import { ProductCard } from './product-card'

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const addItem = useCartStore((state: CartStore) => state.addItem)
  const toggleCart = useCartStore((state: CartStore) => state.toggleCart)

  const category = getCategoryBySlug(product.category_id.replace('cat-', '') === product.category_id ? '' : '')
  const relatedProducts = getRelatedProducts(product.id)
  const displayPrice = product.sale_price || product.price
  const hasDiscount = product.sale_price && product.sale_price < product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
    : 0

  const handleAddToCart = () => {
    addItem({
      id: `cart-${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: displayPrice,
      quantity,
      image: product.images[0],
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleBuyNow = () => {
    addItem({
      id: `cart-${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: displayPrice,
      quantity,
      image: product.images[0],
    })
    toggleCart()
  }

  return (
    <div className="space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-wood">
        <Link href="/" className="hover:text-forest">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/products" className="hover:text-forest">Products</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-wood-dark">{product.name}</span>
      </nav>

      {/* Main Product Section */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-beige rounded-3xl overflow-hidden">
            <Image
              src={product.images[selectedImage] || '/placeholder-product.jpg'}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {hasDiscount && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                -{discountPercent}% OFF
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    'relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all',
                    selectedImage === index
                      ? 'border-forest'
                      : 'border-transparent hover:border-sage'
                  )}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title and Rating */}
          <div>
            <h1 className="text-3xl lg:text-4xl font-semibold text-wood-dark">{product.name}</h1>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-5 h-5',
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    )}
                  />
                ))}
                <span className="ml-2 text-wood-dark font-medium">{product.rating}</span>
                <span className="text-wood/60">({product.review_count} reviews)</span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-forest">
              {formatPrice(displayPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xl text-wood/50 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-green-600 font-medium">
                  In Stock ({product.stock} available)
                </span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span className="text-red-600 font-medium">Out of Stock</span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-wood leading-relaxed">{product.description}</p>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="text-wood-dark font-medium">Quantity:</span>
            <div className="flex items-center border border-beige rounded-full">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-wood hover:text-forest"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-10 h-10 flex items-center justify-center text-wood hover:text-forest"
                disabled={quantity >= product.stock}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {addedToCart ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Added to Cart!
                </>
              ) : (
                'Add to Cart'
              )}
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="flex-1"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              Buy Now
            </Button>
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={cn(
                'w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors',
                isWishlisted
                  ? 'bg-red-50 border-red-200 text-red-500'
                  : 'border-beige text-wood hover:border-forest hover:text-forest'
              )}
            >
              <Heart className={cn('w-5 h-5', isWishlisted && 'fill-current')} />
            </button>
            <button className="w-12 h-12 rounded-full border-2 border-beige flex items-center justify-center text-wood hover:border-forest hover:text-forest transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Info */}
          <div className="bg-beige/50 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-forest mt-0.5" />
              <div>
                <p className="font-medium text-wood-dark">Free Delivery Available</p>
                <p className="text-sm text-wood">For orders over Rs. 50,000 within Colombo area</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-wood-dark">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                id={relatedProduct.id}
                name={relatedProduct.name}
                slug={relatedProduct.slug}
                price={relatedProduct.price}
                comparePrice={relatedProduct.sale_price}
                image={relatedProduct.images[0] || '/placeholder-product.jpg'}
                rating={relatedProduct.rating}
                reviewCount={relatedProduct.review_count}
                inStock={relatedProduct.stock > 0}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}