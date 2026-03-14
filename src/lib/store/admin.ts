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
  productsLoading: boolean
  categoriesLoading: boolean
  productsError: string | null
  categoriesError: string | null
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
  productsLoading: false,
  categoriesLoading: false,
  productsError: null,
  categoriesError: null,

  // Fetch products from API
  fetchProducts: async () => {
    set({ productsLoading: true, productsError: null })
    try {
      const res = await fetch('/api/products')
      if (!res.ok) {
        const data = await res.json()
        set({ productsError: data.error || `Failed to fetch products (${res.status})`, productsLoading: false })
        return
      }
      const data = await res.json()
      set({ products: data.products, productsLoading: false })
    } catch (error: any) {
      set({ productsError: error.message, productsLoading: false })
    }
  },

  // Fetch categories from API
  fetchCategories: async () => {
    set({ categoriesLoading: true, categoriesError: null })
    try {
      const res = await fetch('/api/categories')
      if (!res.ok) {
        const data = await res.json()
        set({ categoriesError: data.error || `Failed to fetch categories (${res.status})`, categoriesLoading: false })
        return
      }
      const data = await res.json()
      set({ categories: data.categories, categoriesLoading: false })
    } catch (error: any) {
      set({ categoriesError: error.message, categoriesLoading: false })
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
      if (res.ok && data.product) {
        set((state) => ({ products: [...state.products, data.product] }))
        return data.product
      }
      set({ productsError: data.error || `Failed to create product (${res.status})` })
      return null
    } catch (error: any) {
      set({ productsError: error.message })
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
      if (res.ok && data.product) {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? data.product : p
          ),
        }))
        return true
      }
      set({ productsError: data.error || `Failed to update product (${res.status})` })
      return false
    } catch (error: any) {
      set({ productsError: error.message })
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
      if (res.ok && data.success) {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }))
        return true
      }
      set({ productsError: data.error || `Failed to delete product (${res.status})` })
      return false
    } catch (error: any) {
      set({ productsError: error.message })
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
      if (res.ok && data.category) {
        set((state) => ({ categories: [...state.categories, data.category] }))
        return data.category
      }
      set({ categoriesError: data.error || `Failed to create category (${res.status})` })
      return null
    } catch (error: any) {
      set({ categoriesError: error.message })
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
      if (res.ok && data.category) {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? data.category : c
          ),
        }))
        return true
      }
      set({ categoriesError: data.error || `Failed to update category (${res.status})` })
      return false
    } catch (error: any) {
      set({ categoriesError: error.message })
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
      if (res.ok && data.success) {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }))
        return true
      }
      set({ categoriesError: data.error || `Failed to delete category (${res.status})` })
      return false
    } catch (error: any) {
      set({ categoriesError: error.message })
      return false
    }
  },
}))