'use client'

import { Store, CreditCard, Bell, Shield, Globe, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-wood-dark">Settings</h1>
        <p className="text-wood">Configure your store settings</p>
      </div>

      {/* Settings Sections */}
      <div className="grid gap-6">
        {/* Store Information */}
        <div className="rounded-2xl bg-warm-white border border-beige-dark p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-xl bg-forest/10 p-2">
              <Store className="h-5 w-5 text-forest" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-wood-dark">Store Information</h2>
              <p className="text-sm text-wood">Basic store details</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Store Name" defaultValue="Aura Home" />
            <Input label="Store Email" type="email" defaultValue="hello@aurahomelk.com" />
            <Input label="Phone Number" defaultValue="+94 11 234 5678" />
            <Input label="Store Address" defaultValue="Colombo, Sri Lanka" />
          </div>
        </div>

        {/* Currency Settings */}
        <div className="rounded-2xl bg-warm-white border border-beige-dark p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-xl bg-sage/30 p-2">
              <CreditCard className="h-5 w-5 text-sage" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-wood-dark">Currency & Payment</h2>
              <p className="text-sm text-wood">Payment and currency settings</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-wood-dark mb-2">
                Currency
              </label>
              <select
                className={cn(
                  'w-full px-4 py-3 rounded-2xl border-2 border-beige-dark',
                  'bg-warm-white text-wood-dark',
                  'focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20',
                  'transition-all'
                )}
                defaultValue="LKR"
              >
                <option value="LKR">LKR - Sri Lankan Rupee</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-wood-dark mb-2">
                Currency Symbol
              </label>
              <Input defaultValue="Rs." />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-2xl bg-warm-white border border-beige-dark p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-xl bg-wood/10 p-2">
              <Bell className="h-5 w-5 text-wood" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-wood-dark">Notifications</h2>
              <p className="text-sm text-wood">Email notification preferences</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { label: 'New order notifications', checked: true },
              { label: 'Low stock alerts', checked: true },
              { label: 'Customer registration', checked: false },
              { label: 'Weekly sales report', checked: true },
            ].map((item, index) => (
              <label key={index} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={item.checked}
                  className={cn(
                    'h-5 w-5 rounded border-2 border-beige-dark',
                    'text-forest focus:ring-forest focus:ring-offset-0'
                  )}
                />
                <span className="text-sm text-wood-dark">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="rounded-2xl bg-warm-white border border-beige-dark p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-xl bg-red-50 p-2">
              <Shield className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-wood-dark">Security</h2>
              <p className="text-sm text-wood">Admin security settings</p>
            </div>
          </div>
          <div className="space-y-4">
            <Button variant="secondary">Change Password</Button>
            <p className="text-sm text-wood">
              Two-factor authentication and other security features will be available after Supabase integration.
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      {/* Notice */}
      <div className="rounded-xl bg-beige/50 border border-beige-dark p-4">
        <p className="text-sm text-wood text-center">
          ⚙️ Settings are currently placeholders. Configuration will be saved to Supabase after integration.
        </p>
      </div>
    </div>
  )
}