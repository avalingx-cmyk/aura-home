import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { BottomTabs } from '@/components/layout/bottom-tabs'
import { CartDrawer } from '@/components/cart/cart-drawer'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen pb-20 md:pb-0">{children}</main>
      <Footer />
      <BottomTabs />
      <CartDrawer />
    </>
  )
}