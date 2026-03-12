'use client'

import { useState } from 'react'
import { ShippingInfo, isValidSriLankanPhone, SRI_LANKAN_CITIES, formatPhone } from '@/lib/store/checkout'
import { cn } from '@/lib/utils'

interface ShippingFormProps {
  initialData?: ShippingInfo | null
  onSubmit: (info: ShippingInfo) => void
  isProcessing?: boolean
}

interface FormErrors {
  fullName?: string
  phone?: string
  email?: string
  address?: string
  city?: string
}

export function ShippingForm({ initialData, onSubmit, isProcessing }: ShippingFormProps) {
  const [formData, setFormData] = useState<ShippingInfo>({
    fullName: initialData?.fullName || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    postalCode: initialData?.postalCode || '',
    notes: initialData?.notes || '',
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required'
        if (value.trim().length < 2) return 'Please enter a valid name'
        break
      case 'phone':
        if (!value.trim()) return 'Phone number is required'
        const cleanedPhone = value.replace(/\s/g, '')
        if (!isValidSriLankanPhone(cleanedPhone)) {
          return 'Please enter a valid Sri Lankan mobile number (07X XXX XXXX)'
        }
        break
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address'
        }
        break
      case 'address':
        if (!value.trim()) return 'Delivery address is required'
        if (value.trim().length < 10) return 'Please enter a complete address'
        break
      case 'city':
        if (!value.trim()) return 'City is required'
        break
    }
    return undefined
  }

  const handleChange = (field: keyof ShippingInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (touched[field]) {
      const error = validateField(field, value)
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  const handleBlur = (field: keyof ShippingInfo) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const error = validateField(field, formData[field])
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors: FormErrors = {
      fullName: validateField('fullName', formData.fullName),
      phone: validateField('phone', formData.phone),
      email: validateField('email', formData.email),
      address: validateField('address', formData.address),
      city: validateField('city', formData.city),
    }
    
    setErrors(newErrors)
    setTouched({
      fullName: true,
      phone: true,
      email: true,
      address: true,
      city: true,
    })
    
    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== undefined)
    if (hasErrors) return
    
    // Format phone number before submitting
    onSubmit({
      ...formData,
      phone: formatPhone(formData.phone),
    })
  }

  const inputClasses = (field: keyof ShippingInfo) =>
    cn(
      "w-full px-4 py-3 rounded-lg border transition-colors",
      "focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent",
      errors[field] && touched[field]
        ? "border-red-300 bg-red-50"
        : "border-sage-200 bg-white hover:border-sage-300"
    )

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-wood-900 mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="fullName"
          value={formData.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          onBlur={() => handleBlur('fullName')}
          placeholder="Enter your full name"
          className={inputClasses('fullName')}
          disabled={isProcessing}
        />
        {errors.fullName && touched.fullName && (
          <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-wood-900 mb-2">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          onBlur={() => handleBlur('phone')}
          placeholder="07X XXX XXXX"
          className={inputClasses('phone')}
          disabled={isProcessing}
        />
        {errors.phone && touched.phone && (
          <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
        )}
        <p className="mt-1 text-xs text-sage-500">
          We&apos;ll call you to confirm your order
        </p>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-wood-900 mb-2">
          Email <span className="text-sage-400">(optional)</span>
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          placeholder="your@email.com"
          className={inputClasses('email')}
          disabled={isProcessing}
        />
        {errors.email && touched.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
        <p className="mt-1 text-xs text-sage-500">
          For order updates and delivery notifications
        </p>
      </div>

      {/* Delivery Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-wood-900 mb-2">
          Delivery Address <span className="text-red-500">*</span>
        </label>
        <textarea
          id="address"
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          onBlur={() => handleBlur('address')}
          placeholder="House number, street name, area..."
          rows={3}
          className={cn(inputClasses('address'), "resize-none")}
          disabled={isProcessing}
        />
        {errors.address && touched.address && (
          <p className="mt-1 text-sm text-red-500">{errors.address}</p>
        )}
      </div>

      {/* City */}
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-wood-900 mb-2">
          City <span className="text-red-500">*</span>
        </label>
        <select
          id="city"
          value={formData.city}
          onChange={(e) => handleChange('city', e.target.value)}
          onBlur={() => handleBlur('city')}
          className={cn(inputClasses('city'), "cursor-pointer")}
          disabled={isProcessing}
        >
          <option value="">Select your city</option>
          {SRI_LANKAN_CITIES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        {errors.city && touched.city && (
          <p className="mt-1 text-sm text-red-500">{errors.city}</p>
        )}
      </div>

      {/* Postal Code */}
      <div>
        <label htmlFor="postalCode" className="block text-sm font-medium text-wood-900 mb-2">
          Postal Code <span className="text-sage-400">(optional)</span>
        </label>
        <input
          type="text"
          id="postalCode"
          value={formData.postalCode}
          onChange={(e) => handleChange('postalCode', e.target.value)}
          placeholder="12345"
          className={inputClasses('postalCode')}
          disabled={isProcessing}
          maxLength={10}
        />
      </div>

      {/* Order Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-wood-900 mb-2">
          Order Notes <span className="text-sage-400">(optional)</span>
        </label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Special instructions for delivery..."
          rows={2}
          className={cn(inputClasses('notes'), "resize-none")}
          disabled={isProcessing}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isProcessing}
        className={cn(
          "w-full py-4 rounded-lg font-semibold text-white transition-colors",
          isProcessing
            ? "bg-sage-400 cursor-not-allowed"
            : "bg-forest-600 hover:bg-forest-700"
        )}
      >
        {isProcessing ? 'Saving...' : 'Continue to Payment'}
      </button>
    </form>
  )
}