'use client'

import { Bell, LogOut, User } from 'lucide-react'

interface AdminHeaderProps {
  collapsed?: boolean
}

export function AdminHeader({ collapsed = false }: AdminHeaderProps) {
  return (
    <header
      className="fixed right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-beige-dark bg-warm-white px-6 transition-all duration-300"
      style={{ left: collapsed ? '4rem' : '16rem' }}
    >
      {/* Page title - can be dynamic */}
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-wood-dark">Admin Dashboard</h1>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-wood hover:bg-beige hover:text-forest transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* User menu */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-forest text-white">
            <User className="h-5 w-5" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-wood-dark">Admin User</p>
            <p className="text-xs text-wood">admin@aurahomelk.com</p>
          </div>
        </div>

        {/* Logout */}
        <button className="rounded-lg p-2 text-wood hover:bg-red-50 hover:text-red-600 transition-colors">
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}