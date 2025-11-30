// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Velora - Ride Beyond Limits',
  description: 'Premium bicycles for sport enthusiasts and urban commuters',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <VeloraNavbar />
        <main className="min-h-screen">
          {children}
        </main>
        <VeloraFooter />
      </body>
    </html>
  )
}

// Navbar Component với style Velora
function VeloraNavbar() {
  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-green-400 bg-clip-text text-transparent">
              VELORA
            </div>
            <span className="ml-2 text-xs text-gray-500 hidden sm:block">Ride Beyond Limits</span>
          </div>

          {/* Navigation Menu */}
          <div className="hidden md:flex space-x-8">
            {['Home', 'Bikes', 'Accessories', 'About', 'Contact'].map((item) => (
              <a
                key={item}
                href={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`}
                className="text-gray-700 hover:text-cyan-600 font-medium transition duration-300"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-cyan-600 transition duration-300">
              🔍
            </button>
            <button className="p-2 text-gray-600 hover:text-cyan-600 transition duration-300">
              👤
            </button>
            <button className="p-2 text-gray-600 hover:text-cyan-600 transition duration-300">
              🛒
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

// Footer Component
function VeloraFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="text-2xl font-bold text-cyan-400 mb-4">VELORA</div>
            <p className="text-gray-400">Ride Beyond Limits with premium bicycles engineered for performance and adventure.</p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              {['All Bikes', 'Road Bikes', 'Mountain Bikes', 'City Bikes', 'Accessories'].map((link) => (
                <li key={link}><a href="#" className="hover:text-cyan-400 transition duration-300">{link}</a></li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              {['Contact Us', 'Shipping Info', 'Returns', 'Size Guide', 'FAQ'].map((link) => (
                <li key={link}><a href="#" className="hover:text-cyan-400 transition duration-300">{link}</a></li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">Join Velora Club</h3>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 bg-gray-800 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 flex-1"
              />
              <button className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-r-lg transition duration-300">
                Join
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Velora. Ride Beyond Limits.</p>
        </div>
      </div>
    </footer>
  )
}