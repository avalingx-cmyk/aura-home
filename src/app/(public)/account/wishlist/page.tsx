'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, ShoppingBag, Trash2, ExternalLink, Loader2 } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { Button } from '@/components/ui/button'

interface WishlistItem {
  id: string
  product_id: string
  created_at: string
  products: {
    id: string
    name: string
    slug: string
    price: number
    compare_price?: number
    images?: string[]
    active: boolean
  }
}

export default function AccountWishlistPage() {
  const router = useRouter()
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState<string | null>(null)

  useEffect(() => {
    const fetchWishlist = async () => {
      const user = await getCurrentUser()
      
      if (!user) {
        // Guest wishlist from localStorage
        const guestWishlist = JSON.parse(localStorage.getItem('aura-guest-wishlist') || '[]')
        // For guests, we'd need to fetch product details separately
        // For now, just show empty state or login prompt
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/wishlist')
        if (!response.ok) throw new Error('Failed to fetch wishlist')
        const data = await response.json()
        setWishlist(data.wishlist || [])
      } catch (error) {
        console.error('Error fetching wishlist:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [])

  const handleRemove = async (productId: string) => {
    setRemoving(productId)
    
    try {
      const response = await fetch(`/api/wishlist?product_id=${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setWishlist(wishlist.filter(item => item.product_id !== productId))
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    } finally {
      setRemoving(null)
    }
  }

  const handleAddToCart = (product: any) => {
    // TODO: Implement add to cart
    router.push(`/products/${product.slug}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-wood mx-auto mb-3" />
        <p className="text-wood">Loading your wishlist...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-wood-dark mb-2">My Wishlist</h2>
        <p className="text-wood">Save your favorite products for later</p>
      </div>

      {/* Wishlist Content */}
      {wishlist.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-sage-100 p-12 text-center">
          <Heart className="h-16 w-16 mx-auto mb-4 opacity-20 text-red-500" />
          <h3 className="text-lg font-semibold text-wood-dark mb-2">Your wishlist is empty</h3>
          <p className="text-wood mb-6">
            Save products you love by clicking the heart icon on product cards
          </p>
          <Button
            onClick={() => router.push('/products')}
            className="px-6 py-3 bg-wood text-white rounded-lg hover:bg-wood-dark transition-colors"
          >
            Browse Products
          </Button>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-sage-100 p-4">
            <p className="text-sm text-wood">
              <strong className="text-wood-dark">{wishlist.length}</strong> {wishlist.length === 1 ? 'item' : 'items'} in your wishlist
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => {
              const product = item.products
              const discount = product.compare_price 
                ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
                : 0

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm border border-sage-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Product Image */}
                  <div 
                    className="aspect-square bg-sage-100 cursor-pointer"
                    onClick={() => router.push(`/products/${product.slug}`)}
                  >
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ShoppingBag className="h-12 w-12 text-wood opacity-30" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-3">
                    {/* Title */}
                    <h3 
                      className="font-medium text-wood-dark line-clamp-2 cursor-pointer hover:text-wood transition-colors"
                      onClick={() => router.push(`/products/${product.slug}`)}
                    >
                      {product.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-wood-dark">
                        LKR {product.price.toLocaleString()}
                      </span>
                      {product.compare_price && (
                        <>
                          <span className="text-sm text-wood line-through">
                            LKR {product.compare_price.toLocaleString()}
                          </span>
                          {discount > 0 && (
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                              -{discount}%
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t border-sage-100">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-wood text-white rounded-lg hover:bg-wood-dark transition-colors text-sm font-medium"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => router.push(`/products/${product.slug}`)}
                        className="p-2 text-wood hover:text-wood-dark transition-colors"
                        title="View product"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleRemove(product.id)}
                        disabled={removing === product.id}
                        className="p-2 text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
                        title="Remove from wishlist"
                      >
                        {removing === product.id ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Trash2 className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    {/* Added Date */}
                    <p className="text-xs text-wood">
                      Added {formatDate(item.created_at)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
