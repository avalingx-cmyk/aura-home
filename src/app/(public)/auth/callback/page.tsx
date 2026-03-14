'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

function AuthCallbackContent() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const hash = window.location.hash
    const params = new URLSearchParams(hash.slice(1))
    
    const error = params.get('error')
    const errorDescription = params.get('error_description')
    
    if (error) {
      setStatus('error')
      setMessage(errorDescription || 'Authentication failed')
    } else {
      setStatus('success')
      setMessage('Successfully signed in! Redirecting...')
      
      // Redirect to account page after successful login
      setTimeout(() => {
        router.push('/account')
      }, 2000)
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-wood mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-wood-dark mb-2">Signing you in...</h1>
            <p className="text-wood">Please wait a moment</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-wood-dark mb-2">Welcome back!</h1>
            <p className="text-wood">{message}</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-wood-dark mb-2">Sign in failed</h1>
            <p className="text-wood mb-4">{message}</p>
            <button
              onClick={() => router.push('/auth/login')}
              className="px-6 py-2 bg-wood text-white rounded-lg hover:bg-wood-dark transition-colors"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-wood mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-wood-dark mb-2">Loading...</h1>
          <p className="text-wood">Please wait</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}
