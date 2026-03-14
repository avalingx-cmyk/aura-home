'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { signInWithMagicLink } from '@/lib/auth'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await signInWithMagicLink(email)
      if (error) {
        throw error
      }
      setSent(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send magic link')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-warm-white rounded-2xl shadow-sm border border-beige-dark p-8">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-wood-dark mb-2">Check your email</h1>
              <p className="text-wood mb-6">
                We've sent a magic link to <strong className="text-wood-dark">{email}</strong>
              </p>
              <p className="text-sm text-wood">
                Click the link in the email to sign in to your account.
              </p>
              
              <div className="mt-8 space-y-3">
                <button
                  onClick={() => setSent(false)}
                  className="text-wood hover:text-wood-dark transition-colors text-sm"
                >
                  Use a different email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-warm-white rounded-2xl shadow-sm border border-beige-dark p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-wood hover:text-wood-dark transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to home</span>
            </button>
            
            <h1 className="text-2xl font-bold text-wood-dark mb-2">Welcome back</h1>
            <p className="text-wood">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-wood-dark mb-2">
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-beige-dark rounded-lg focus:ring-2 focus:ring-wood focus:border-transparent bg-warm-white text-wood-dark placeholder-wood"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-wood" />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-wood text-white rounded-lg hover:bg-wood-dark transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </Button>
          </form>

          {/* Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-wood">
              No account? No problem! We'll create one for you automatically.
            </p>
          </div>

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-beige-dark">
            <div className="space-y-3 text-sm text-wood">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>View your order history</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Track current orders</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Manage your profile</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
