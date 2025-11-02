'use client'
import { useState } from 'react'
import { api } from '@/lib/api'

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    age: 20,
    height: 175,
    weight: 70,
    goal: 'bulk',
    activity_level: 'moderate',
    workout_today: 'chest'
  })

  const [macroResults, setMacroResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await api.setupProfile(profile)
      setMacroResults(result)
      console.log('Profile setup result:', result)
      
      // Save to localStorage for other pages to use
      localStorage.setItem('userProfile', JSON.stringify(profile))
      localStorage.setItem('dailyTargets', JSON.stringify(result.daily_targets))
    } catch (error) {
      console.error('Error setting up profile:', error)
      alert('Failed to calculate macros. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'height' || name === 'weight' 
        ? parseFloat(value) 
        : value
    }))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Profile</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age
            </label>
            <input
              type="number"
              name="age"
              value={profile.age}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Height */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Height (cm)
            </label>
            <input
              type="number"
              name="height"
              value={profile.height}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              name="weight"
              value={profile.weight}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Goal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Goal
            </label>
            <select
              name="goal"
              value={profile.goal}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="bulk">Bulk (Gain Muscle)</option>
              <option value="cut">Cut (Lose Fat)</option>
            </select>
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activity Level
            </label>
            <select
              name="activity_level"
              value={profile.activity_level}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="sedentary">Sedentary (Little or no exercise)</option>
              <option value="light">Light (Exercise 1-3 days/week)</option>
              <option value="moderate">Moderate (Exercise 3-5 days/week)</option>
              <option value="active">Active (Exercise 6-7 days/week)</option>
              <option value="very_active">Very Active (Hard exercise daily)</option>
            </select>
          </div>

          {/* Workout Today */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Today's Workout
            </label>
            <select
              name="workout_today"
              value={profile.workout_today}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="chest">Chest</option>
              <option value="back">Back</option>
              <option value="legs">Legs</option>
              <option value="shoulders">Shoulders</option>
              <option value="arms">Arms</option>
              <option value="cardio">Cardio</option>
              <option value="rest">Rest</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Calculating...' : 'Calculate My Macros'}
          </button>
        </form>

        {/* Display Results */}
        {macroResults && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Daily Targets</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{macroResults.daily_targets.calories}</p>
                <p className="text-sm text-gray-600">Calories</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{macroResults.daily_targets.protein}g</p>
                <p className="text-sm text-gray-600">Protein</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">{macroResults.daily_targets.carbs}g</p>
                <p className="text-sm text-gray-600">Carbs</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">{macroResults.daily_targets.fats}g</p>
                <p className="text-sm text-gray-600">Fats</p>
              </div>
            </div>
            <p className="text-center mt-4 text-gray-700">
              TDEE: <span className="font-bold">{macroResults.tdee}</span> calories/day
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
