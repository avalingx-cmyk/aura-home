import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { ProductDetail } from '@/components/product'
import { getProductBySlug } from '@/lib/data/mock-data'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    return {
      title: 'Product Not Found | Aura Home',
    }
  }

  return {
    title: `${product.name} | Aura Home`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-white via-beige/30 to-sage/20">
      <div className="container mx-auto px-4 py-8">
        <ProductDetail product={product} />
      </div>
    </div>
  )
}