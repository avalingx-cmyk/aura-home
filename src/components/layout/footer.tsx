import Link from 'next/link'
import { Facebook, Instagram, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-wood-dark text-warm-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-sage">Aura</span>
              <span className="text-2xl font-light text-beige">Home</span>
            </Link>
            <p className="text-beige/80 text-sm">
              Premium furniture for your home. Quality craftsmanship delivered to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-beige/80">
              <li><Link href="/products" className="hover:text-sage transition-colors">Shop</Link></li>
              <li><Link href="/about" className="hover:text-sage transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-sage transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-sage transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm text-beige/80">
              <li><Link href="/faq" className="hover:text-sage transition-colors">FAQ</Link></li>
              <li><Link href="/terms" className="hover:text-sage transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-sage transition-colors">Privacy Policy</Link></li>
              <li><Link href="/returns" className="hover:text-sage transition-colors">Returns Policy</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-sage transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-sage transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-sage transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-beige/20 mt-8 pt-8 text-center text-sm text-beige/60">
          <p>© {new Date().getFullYear()} Aura Home. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}