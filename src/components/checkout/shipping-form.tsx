'use client'

import { useState, useEffect } from 'react'
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
  postalCode?: string
  notes?: string
  deliveryZone?: string
  deliveryDate?: string
  deliveryTimeSlot?: string
}

interface DeliveryZone {
  id: string
  name: string
  fee: number
  estimated_days: number
  active: boolean
}

const DELIVERY_TIME_SLOTS = [
  '9:00 AM - 12:00 PM',
  '12:00 PM - 3:00 PM',
  '3:00 PM - 6:00 PM',
  '6:00 PM - 9:00 PM',
]

// Generate next 7 days for delivery
const getAvailableDates = () => {
  const dates = []
  const today = new Date()
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    dates.push({
      value: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
    })
  }
  return dates
}

export function ShippingForm({ initialData, onSubmit, isProcessing }: ShippingFormProps) {
  const [zones, setZones] = useState<DeliveryZone[]>([])
  const [loadingZones, setLoadingZones] = useState(true)
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null)
  
  const [formData, setFormData] = useState<ShippingInfo & {
    delivery_zone?: string
    delivery_date?: string
    delivery_time_slot?: string
    whatsappOptIn?: boolean
  }>({
    fullName: initialData?.fullName || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    postalCode: initialData?.postalCode || '',
    notes: initialData?.notes || '',
    delivery_zone: initialData?.delivery_zone || '',
    delivery_date: initialData?.delivery_date || '',
    delivery_time_slot: initialData?.delivery_time_slot || '',
    whatsappOptIn: initialData?.whatsappOptIn || false,
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Fetch delivery zones on mount
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await fetch('/api/delivery-zones')
        if (response.ok) {
          const data = await response.json()
          setZones(data.zones || [])
        }
      } catch (error) {
        console.error('Error fetching delivery zones:', error)
      } finally {
        setLoadingZones(false)
      }
    }
    fetchZones()
  }, [])

  // Update selected zone when delivery_zone changes
  useEffect(() => {
    if (formData.delivery_zone) {
      const zone = zones.find(z => z.name === formData.delivery_zone)
      setSelectedZone(zone || null)
    } else {
      setSelectedZone(null)
    }
  }, [formData.delivery_zone, zones])

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
      case 'delivery_zone':
        if (!value.trim()) return 'Please select a delivery zone'
        break
      case 'delivery_date':
        if (!value.trim()) return 'Please select a delivery date'
        break
      case 'delivery_time_slot':
        if (!value.trim()) return 'Please select a time slot'
        break
    }
    return undefined
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (touched[field]) {
      const error = validateField(field, value)
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const error = validateField(field, formData[field as keyof typeof formData] ?? '')
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
      deliveryZone: validateField('delivery_zone', formData.delivery_zone || ''),
      deliveryDate: validateField('delivery_date', formData.delivery_date || ''),
      deliveryTimeSlot: validateField('delivery_time_slot', formData.delivery_time_slot || ''),
    }
    
    setErrors(newErrors)
    setTouched({
      fullName: true,
      phone: true,
      email: true,
      address: true,
      city: true,
      delivery_zone: true,
      delivery_date: true,
      delivery_time_slot: true,
    })
    
    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== undefined)
    if (hasErrors) return
    
    // Submit with delivery zone and WhatsApp opt-in
    onSubmit({
      fullName: formData.fullName,
      phone: formatPhone(formData.phone),
      email: formData.email,
      address: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      notes: formData.notes,
      zone: formData.delivery_zone,
      delivery_date: formData.delivery_date,
      delivery_time_slot: formData.delivery_time_slot,
      whatsappOptIn: formData.whatsappOptIn === 'true',
    } as ShippingInfo)
  }

  const inputClasses = (field: string) =>
    cn(
      "w-full px-4 py-3 rounded-lg border transition-colors",
      "focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent",
      errors[field as keyof FormErrors] && touched[field]
        ? "border-red-300 bg-red-50"
        : "border-sage-200 bg-white hover:border-sage-300"
    )

  const availableDates = getAvailableDates()

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

      {/* Delivery Zone */}
      <div>
        <label htmlFor="delivery_zone" className="block text-sm font-medium text-wood-900 mb-2">
          Delivery Zone <span className="text-red-500">*</span>
        </label>
        {loadingZones ? (
          <div className="text-sm text-sage-500 py-3">Loading zones...</div>
        ) : (
          <select
            id="delivery_zone"
            value={formData.delivery_zone || ''}
            onChange={(e) => handleChange('delivery_zone', e.target.value)}
            onBlur={() => handleBlur('delivery_zone')}
            className={cn(inputClasses('delivery_zone'), "cursor-pointer")}
            disabled={isProcessing || loadingZones}
          >
            <option value="">Select your delivery zone</option>
            {zones.map((zone) => (
              <option key={zone.id} value={zone.name}>
                {zone.name} - LKR {zone.fee.toLocaleString()} ({zone.estimated_days} day{zone.estimated_days > 1 ? 's' : ''})
              </option>
            ))}
          </select>
        )}
        {errors.deliveryZone && touched.deliveryZone && (
          <p className="mt-1 text-sm text-red-500">{errors.deliveryZone}</p>
        )}
        {selectedZone && (
          <p className="mt-2 text-sm text-forest-600">
            Delivery fee: <strong>LKR {selectedZone.fee.toLocaleString()}</strong> • 
            Estimated: <strong>{selectedZone.estimated_days} day{selectedZone.estimated_days > 1 ? 's' : ''}</strong>
          </p>
        )}
      </div>

      {/* Delivery Date */}
      <div>
        <label htmlFor="delivery_date" className="block text-sm font-medium text-wood-900 mb-2">
          Delivery Date <span className="text-red-500">*</span>
        </label>
        <select
          id="delivery_date"
          value={formData.delivery_date || ''}
          onChange={(e) => handleChange('delivery_date', e.target.value)}
          onBlur={() => handleBlur('delivery_date')}
          className={cn(inputClasses('delivery_date'), "cursor-pointer")}
          disabled={isProcessing}
        >
          <option value="">Select delivery date</option>
          {availableDates.map((date) => (
            <option key={date.value} value={date.value}>
              {date.label}
            </option>
          ))}
        </select>
        {errors.deliveryDate && touched.deliveryDate && (
          <p className="mt-1 text-sm text-red-500">{errors.deliveryDate}</p>
        )}
      </div>

      {/* Delivery Time Slot */}
      <div>
        <label htmlFor="delivery_time_slot" className="block text-sm font-medium text-wood-900 mb-2">
          Delivery Time Slot <span className="text-red-500">*</span>
        </label>
        <select
          id="delivery_time_slot"
          value={formData.delivery_time_slot || ''}
          onChange={(e) => handleChange('delivery_time_slot', e.target.value)}
          onBlur={() => handleBlur('delivery_time_slot')}
          className={cn(inputClasses('delivery_time_slot'), "cursor-pointer")}
          disabled={isProcessing}
        >
          <option value="">Select time slot</option>
          {DELIVERY_TIME_SLOTS.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
        {errors.deliveryTimeSlot && touched.deliveryTimeSlot && (
          <p className="mt-1 text-sm text-red-500">{errors.deliveryTimeSlot}</p>
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

      {/* WhatsApp Opt-in */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.whatsappOptIn || false}
            onChange={(e) => handleChange('whatsappOptIn', e.target.checked ? 'true' : '')}
            className="mt-1 h-4 w-4 text-forest-600 border-sage-300 rounded focus:ring-forest-500"
            disabled={isProcessing}
          />
          <div className="text-sm">
            <span className="font-medium text-wood-900">
              Get order updates on WhatsApp
            </span>
            <p className="text-sage-500">
              We'll send you order confirmation, shipping updates, and delivery reminders via WhatsApp.
            </p>
          </div>
        </label>
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
