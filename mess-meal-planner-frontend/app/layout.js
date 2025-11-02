'use client'
import './globals.css'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function RootLayout({ children }) {
  const pathname = usePathname()
  const isOnboarding = pathname === '/onboarding'

  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {!isOnboarding && <Navbar />}
        <main className={isOnboarding ? '' : 'container mx-auto px-4 py-8 max-w-6xl'}>
          {children}
        </main>
      </body>
    </html>
  )
}
