'use client'
import { useState, useEffect } from 'react'
import { ThumbsUp, Award, TrendingUp, Loader } from 'lucide-react'
import { api } from '@/lib/api'

export default function MealRecommendations({ menuData }) {
  const [selectedCombo, setSelectedCombo] = useState(null)
  const [recommendations, setRecommendations] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (menuData && menuData.menu_nutrition) {
      fetchRecommendations()
    }
  }, [menuData])

  const fetchRecommendations = async () => {
    setLoading(true)
    setError(null)

    try {
      const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}')
      const dailyTargets = JSON.parse(localStorage.getItem('dailyTargets') || '{}')
      const currentIntake = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0
      }

      // If no profile set, use defaults
      if (!userProfile.age) {
        userProfile.age = 20
        userProfile.height = 175
        userProfile.weight = 70
        userProfile.goal = 'bulk'
        userProfile.activity_level = 'moderate'
        userProfile.workout_today = 'chest'
      }

      if (!dailyTargets.calories) {
        dailyTargets.calories = 2800
        dailyTargets.protein = 140
        dailyTargets.carbs = 350
        dailyTargets.fats = 78
      }

      // Call API to get recommendations
      const response = await api.getRecommendations(
        userProfile,
        menuData.menu_nutrition,
        currentIntake,
        dailyTargets
      )

      if (response.status === 'success') {
        setRecommendations(response.recommendations)
      } else {
        setError('Failed to get recommendations')
      }

    } catch (err) {
      console.error('Error fetching recommendations:', err)
      setError('Failed to generate recommendations. Using menu data instead.')
      
      // Fallback: Show manual recommendations based on available menu
      generateFallbackRecommendations()
    } finally {
      setLoading(false)
    }
  }

  const generateFallbackRecommendations = () => {
    // Convert menu_nutrition to array
    const items = Object.entries(menuData.menu_nutrition || {})
    
    if (items.length === 0) return

    // Create simple recommendations based on protein content
    const highProteinItems = items
      .filter(([name, data]) => data.protein >= 15)
      .sort((a, b) => b[1].protein - a[1].protein)
      .slice(0, 3)

    const fallback = {
      recommendations: [
        {
          name: '💪 High Protein Combo',
          description: 'Best items for muscle gain',
          items: highProteinItems.map(([name, data]) => `${name} (${data.protein}g protein)`),
          total_macros: {
            calories: highProteinItems.reduce((sum, [, data]) => sum + data.calories, 0),
            protein: highProteinItems.reduce((sum, [, data]) => sum + data.protein, 0),
            carbs: highProteinItems.reduce((sum, [, data]) => sum + data.carbs, 0),
            fats: highProteinItems.reduce((sum, [, data]) => sum + data.fats, 0),
          },
          reasoning: 'Selected items with highest protein content'
        }
      ],
      alternatives: ['Add more vegetables', 'Include dairy products'],
      motivation: 'Keep pushing towards your goals!'
    }

    setRecommendations(fallback)
  }

  const logMeal = (combo) => {
    setSelectedCombo(combo)
    // You can add logic here to save meal to localStorage
    console.log('Logging meal:', combo)
  }

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 AI Recommendations</h2>
        <div className="flex items-center justify-center py-12">
          <Loader className="h-12 w-12 text-blue-500 animate-spin" />
          <p className="ml-4 text-gray-600">Generating personalized recommendations...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error && !recommendations) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 AI Recommendations</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={fetchRecommendations}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // No recommendations available
  if (!recommendations || !recommendations.recommendations) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 AI Recommendations</h2>
        <p className="text-gray-600">
          Set up your profile first to get personalized recommendations.
        </p>
        <a 
          href="/profile" 
          className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go to Profile
        </a>
      </div>
    )
  }

  const iconMap = {
    0: Award,
    1: ThumbsUp,
    2: TrendingUp
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 AI Recommendations</h2>
      
      {/* Motivation message */}
      {recommendations.motivation && (
        <div className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4 text-white">
          <p className="text-lg font-semibold">{recommendations.motivation}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.recommendations.map((combo, index) => {
          const Icon = iconMap[index] || ThumbsUp
          return (
            <div 
              key={index}
              className={`border-2 rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg
                ${selectedCombo === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
              onClick={() => logMeal(index)}
            >
              {index === 0 && (
                <span className="inline-block bg-green-500 text-white text-xs px-3 py-1 rounded-full mb-3">
                  Recommended
                </span>
              )}
              
              <div className="flex items-center space-x-2 mb-2">
                <Icon className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-800">{combo.name}</h3>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{combo.description}</p>
              
              <div className="space-y-2 mb-4">
                {combo.items && combo.items.map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <span className="text-blue-500">•</span>
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              
              {combo.total_macros && (
                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Calories</p>
                      <p className="font-bold text-gray-800">{combo.total_macros.calories}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Protein</p>
                      <p className="font-bold text-green-600">{combo.total_macros.protein}g</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Carbs</p>
                      <p className="font-bold text-yellow-600">{combo.total_macros.carbs}g</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Fats</p>
                      <p className="font-bold text-orange-600">{combo.total_macros.fats}g</p>
                    </div>
                  </div>
                </div>
              )}

              {combo.reasoning && (
                <div className="mt-3 text-xs text-gray-600 italic">
                  {combo.reasoning}
                </div>
              )}
              
              <button 
                className={`w-full mt-4 py-2 rounded-lg font-medium transition-colors
                  ${selectedCombo === index
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {selectedCombo === index ? '✓ Selected' : 'Select This Meal'}
              </button>
            </div>
          )
        })}
      </div>

      {/* Alternatives */}
      {recommendations.alternatives && recommendations.alternatives.length > 0 && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-2">💡 Alternative Options:</h3>
          <ul className="list-disc list-inside space-y-1">
            {recommendations.alternatives.map((alt, idx) => (
              <li key={idx} className="text-sm text-gray-700">{alt}</li>
            ))}
          </ul>
        </div>
      )}
      
      {selectedCombo !== null && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">
            ✓ Meal logged successfully! Your progress has been updated.
          </p>
        </div>
      )}
    </div>
  )
}