'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, ShoppingBag, LogOut, Loader2 } from 'lucide-react'
import { getCurrentUser, signOut } from '@/lib/auth'
import { cn } from '@/lib/utils'

interface AccountLayoutProps {
  children: React.ReactNode
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'profile'>('overview')

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push('/auth/login')
        return
      }
      setUser(currentUser)
      setLoading(false)
    }
    checkAuth()
  }, [router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-wood" />
        <p className="ml-3 text-wood">Loading your account...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sage-50/30">
      {/* Header */}
      <header className="bg-white border-b border-sage-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-wood-dark">My Account</h1>
              <p className="text-sm text-wood">{user?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-wood hover:text-wood-dark transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="md:col-span-1">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left',
                  activeTab === 'overview'
                    ? 'bg-wood text-white'
                    : 'bg-white text-wood hover:bg-beige/50'
                )}
              >
                <User className="h-5 w-5" />
                <span className="font-medium">Overview</span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left',
                  activeTab === 'orders'
                    ? 'bg-wood text-white'
                    : 'bg-white text-wood hover:bg-beige/50'
                )}
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="font-medium">Orders</span>
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left',
                  activeTab === 'profile'
                    ? 'bg-wood text-white'
                    : 'bg-white text-wood hover:bg-beige/50'
                )}
              >
                <User className="h-5 w-5" />
                <span className="font-medium">Profile</span>
              </button>
            </nav>

            {/* Account Info */}
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-sage-100 p-4">
              <h3 className="font-semibold text-wood-dark mb-3">Account Info</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-wood">Email</p>
                  <p className="text-wood-dark font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-wood">Member since</p>
                  <p className="text-wood-dark font-medium">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Today'}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="md:col-span-3">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
