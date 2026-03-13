import { create } from 'zustand'

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  compare_price?: number
  sku?: string
  stock_quantity?: number
  category_id?: string
  images: string[]
  featured: boolean
  active: boolean
  category?: {
    id: string
    name: string
    slug: string
  }
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
}

interface AdminState {
  products: Product[]
  categories: Category[]
  loading: boolean
  error: string | null
  // Fetch actions
  fetchProducts: () => Promise<void>
  fetchCategories: () => Promise<void>
  // Product actions
  addProduct: (product: Partial<Product>) => Promise<Product | null>
  updateProduct: (id: string, product: Partial<Product>) => Promise<boolean>
  deleteProduct: (id: string) => Promise<boolean>
  // Category actions
  addCategory: (category: Partial<Category>) => Promise<Category | null>
  updateCategory: (id: string, category: Partial<Category>) => Promise<boolean>
  deleteCategory: (id: string) => Promise<boolean>
}

export const useAdminStore = create<AdminState>((set, get) => ({
  products: [],
  categories: [],
  loading: false,
  error: null,

  // Fetch products from API
  fetchProducts: async () => {
    set({ loading: true, error: null })
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      if (data.products) {
        set({ products: data.products, loading: false })
      } else {
        set({ error: data.error || 'Failed to fetch products', loading: false })
      }
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  // Fetch categories from API
  fetchCategories: async () => {
    set({ loading: true, error: null })
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      if (data.categories) {
        set({ categories: data.categories, loading: false })
      } else {
        set({ error: data.error || 'Failed to fetch categories', loading: false })
      }
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  // Add product via API
  addProduct: async (productData) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })
      const data = await res.json()
      if (data.product) {
        set((state) => ({ products: [...state.products, data.product] }))
        return data.product
      }
      set({ error: data.error || 'Failed to create product' })
      return null
    } catch (error: any) {
      set({ error: error.message })
      return null
    }
  },

  // Update product via API
  updateProduct: async (id, productData) => {
    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })
      const data = await res.json()
      if (data.product) {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? data.product : p
          ),
        }))
        return true
      }
      set({ error: data.error || 'Failed to update product' })
      return false
    } catch (error: any) {
      set({ error: error.message })
      return false
    }
  },

  // Delete product via API
  deleteProduct: async (id) => {
    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }))
        return true
      }
      set({ error: data.error || 'Failed to delete product' })
      return false
    } catch (error: any) {
      set({ error: error.message })
      return false
    }
  },

  // Add category via API
  addCategory: async (categoryData) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      })
      const data = await res.json()
      if (data.category) {
        set((state) => ({ categories: [...state.categories, data.category] }))
        return data.category
      }
      set({ error: data.error || 'Failed to create category' })
      return null
    } catch (error: any) {
      set({ error: error.message })
      return null
    }
  },

  // Update category via API
  updateCategory: async (id, categoryData) => {
    try {
      const res = await fetch(`/api/categories?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      })
      const data = await res.json()
      if (data.category) {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? data.category : c
          ),
        }))
        return true
      }
      set({ error: data.error || 'Failed to update category' })
      return false
    } catch (error: any) {
      set({ error: error.message })
      return false
    }
  },

  // Delete category via API
  deleteCategory: async (id) => {
    try {
      const res = await fetch(`/api/categories?id=${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }))
        return true
      }
      set({ error: data.error || 'Failed to delete category' })
      return false
    } catch (error: any) {
      set({ error: error.message })
      return false
    }
  },
}))