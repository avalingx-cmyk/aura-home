import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Aura Home | Premium Furniture Sri Lanka',
  description: 'Discover premium furniture for your home. Quality furniture delivered to your doorstep in Sri Lanka.',
  keywords: ['furniture', 'Sri Lanka', 'home decor', 'living room', 'bedroom', 'dining'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  )
}