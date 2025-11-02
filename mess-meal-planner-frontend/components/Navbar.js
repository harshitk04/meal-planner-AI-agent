'use client'
import Link from 'next/link'
import { Home, User, ScanLine, History, Target, Calendar } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Target className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl text-gray-800">
                Meal Planner AI Agent
            </span>
          </Link>
          
          <div className="flex space-x-6">
            <Link href="/" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            
            <Link href="/scan-menu" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
              <ScanLine className="h-5 w-5" />
              <span>Scan Menu</span>
            </Link>

            <Link href="/calendar" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
              <Calendar className="h-5 w-5" />
              <span>Calendar</span>
            </Link>
            
            <Link href="/history" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
              <History className="h-5 w-5" />
              <span>History</span>
            </Link>
            
            <Link href="/profile" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
