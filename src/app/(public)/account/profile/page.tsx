'use client'

import { useEffect, useState } from 'react'
import { User, Mail, Phone, MapPin, Save, Loader2 } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { SRI_LANKAN_CITIES } from '@/lib/store/checkout'

interface CustomerProfile {
  id: string
  email: string
  phone?: string
  first_name?: string
  last_name?: string
  addresses?: {
    type: string
    address: string
    city: string
    postal_code?: string
    is_default: boolean
  }[]
}

export default function AccountProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<CustomerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
        
        // Fetch customer profile from Supabase
        const response = await fetch('/api/customer/profile')
        if (response.ok) {
          const data = await response.json()
          setProfile(data.customer)
          if (data.customer) {
            setFormData({
              first_name: data.customer.first_name || '',
              last_name: data.customer.last_name || '',
              phone: data.customer.phone || '',
            })
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const response = await fetch('/api/customer/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update profile')
      }

      const data = await response.json()
      setProfile(data.customer)
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-wood">Loading your profile...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-wood-dark mb-2">Profile Settings</h2>
        <p className="text-wood">Manage your personal information</p>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-sage-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-sage-100">
            <h3 className="font-semibold text-wood-dark">Personal Information</h3>
          </div>
          <div className="p-6 space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-wood-dark mb-2">
                  First Name
                </label>
                <input
                  id="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="w-full px-4 py-3 border border-beige-dark rounded-lg focus:ring-2 focus:ring-wood focus:border-transparent bg-warm-white text-wood-dark"
                  placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-wood-dark mb-2">
                  Last Name
                </label>
                <input
                  id="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full px-4 py-3 border border-beige-dark rounded-lg focus:ring-2 focus:ring-wood focus:border-transparent bg-warm-white text-wood-dark"
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Email (Read-only) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-wood-dark mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full pl-10 pr-4 py-3 border border-beige-dark rounded-lg bg-sage-50 text-wood cursor-not-allowed"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-wood" />
              </div>
              <p className="text-xs text-wood mt-1">Email cannot be changed</p>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-wood-dark mb-2">
                Phone Number
              </label>
              <div className="relative">
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-beige-dark rounded-lg focus:ring-2 focus:ring-wood focus:border-transparent bg-warm-white text-wood-dark"
                  placeholder="07X XXX XXXX"
                />
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-wood" />
              </div>
              <p className="text-xs text-wood mt-1">Sri Lankan format: 07X XXX XXXX</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-wood text-white rounded-lg hover:bg-wood-dark transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Account Info */}
      <div className="bg-white rounded-xl shadow-sm border border-sage-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-sage-100">
          <h3 className="font-semibold text-wood-dark">Account Information</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm text-wood mb-1">Member Since</p>
            <p className="text-wood-dark font-medium">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'Today'}
            </p>
          </div>
          <div>
            <p className="text-sm text-wood mb-1">User ID</p>
            <p className="text-wood-dark font-medium font-mono text-sm">{user?.id}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
