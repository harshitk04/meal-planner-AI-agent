'use client'
import { Dumbbell, Trophy, TrendingUp } from 'lucide-react'

export default function NotificationCard({ title, message, type }) {
  const styles = {
    motivation: 'bg-gradient-to-r from-purple-500 to-pink-500',
    success: 'bg-gradient-to-r from-green-500 to-teal-500',
    info: 'bg-gradient-to-r from-blue-500 to-cyan-500'
  }

  return (
    <div className={`${styles[type]} rounded-xl p-6 text-white shadow-lg`}>
      <div className="flex items-center space-x-4">
        <Dumbbell className="h-12 w-12" />
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-lg mt-1">{message}</p>
        </div>
      </div>
    </div>
  )
}
