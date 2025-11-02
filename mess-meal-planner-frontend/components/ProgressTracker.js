'use client'
import { CheckCircle, AlertCircle } from 'lucide-react'

export default function ProgressTracker({ current, target }) {
  const macros = [
    { 
      name: 'Calories', 
      current: current.calories, 
      target: target.calories, 
      unit: 'cal',
      color: 'blue'
    },
    { 
      name: 'Protein', 
      current: current.protein, 
      target: target.protein, 
      unit: 'g',
      color: 'green'
    },
    { 
      name: 'Carbs', 
      current: current.carbs, 
      target: target.carbs, 
      unit: 'g',
      color: 'yellow'
    },
    { 
      name: 'Fats', 
      current: current.fats, 
      target: target.fats, 
      unit: 'g',
      color: 'orange'
    },
  ]

  const getPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100)
  }

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      orange: 'bg-orange-500'
    }
    return colors[color]
  }

  return (
    <div className="space-y-6">
      {macros.map((macro) => {
        const percentage = getPercentage(macro.current, macro.target)
        const isComplete = percentage >= 100
        
        return (
          <div key={macro.name}>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-700">{macro.name}</span>
                {isComplete && <CheckCircle className="h-5 w-5 text-green-500" />}
              </div>
              <span className="text-sm text-gray-600">
                <span className="font-bold">{macro.current}</span> / {macro.target} {macro.unit}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full ${getColorClasses(macro.color)} transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            
            <div className="text-right mt-1">
              <span className="text-xs text-gray-500">{percentage.toFixed(0)}%</span>
            </div>
          </div>
        )
      })}
      
      {/* Remaining Macros */}
      <div className="bg-blue-50 rounded-lg p-4 mt-6">
        <h3 className="font-semibold text-gray-800 mb-3">Remaining for Today:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {macros.map((macro) => (
            <div key={macro.name} className="text-center">
              <p className="text-2xl font-bold text-gray-800">
                {Math.max(0, macro.target - macro.current)}
              </p>
              <p className="text-sm text-gray-600">{macro.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
