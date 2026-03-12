export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  parent_id?: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  compare_price?: number
  sku?: string
  stock_quantity: number
  category_id?: string
  images: string[]
  featured: boolean
  active: boolean
  attributes?: Record<string, any>
  sort_order: number
  created_at: string
  updated_at: string
  category?: Category
}

export interface Customer {
  id: string
  email: string
  phone?: string
  first_name?: string
  last_name?: string
  addresses?: Address[]
  created_at: string
  updated_at: string
}

export interface Address {
  name: string
  phone: string
  address: string
  city: string
  zone: string
  is_default?: boolean
}

export interface Order {
  id: string
  order_number: string
  customer_id?: string
  status: OrderStatus
  subtotal: number
  shipping_fee: number
  total: number
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  shipping_name: string
  shipping_phone: string
  shipping_address: string
  shipping_city: string
  shipping_zone: string
  delivery_date?: string
  delivery_time_slot?: string
  notes?: string
  items?: OrderItem[]
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  price: number
  total: number
}

export interface DeliveryZone {
  id: string
  name: string
  fee: number
  estimated_days: number
  active: boolean
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentMethod = 'cod' | 'koko'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

// Database Tables
export interface Database {
  public: {
    Tables: {
      categories: { Row: Category; Insert: Partial<Category>; Update: Partial<Category> }
      products: { Row: Product; Insert: Partial<Product>; Update: Partial<Product> }
      customers: { Row: Customer; Insert: Partial<Customer>; Update: Partial<Customer> }
      orders: { Row: Order; Insert: Partial<Order>; Update: Partial<Order> }
      order_items: { Row: OrderItem; Insert: Partial<OrderItem>; Update: Partial<OrderItem> }
      delivery_zones: { Row: DeliveryZone; Insert: Partial<DeliveryZone>; Update: Partial<DeliveryZone> }
    }
  }
}