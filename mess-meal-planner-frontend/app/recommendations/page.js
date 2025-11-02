'use client'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Utensils } from 'lucide-react'
import { Calendar, Target, Dumbbell, Loader, TrendingUp, Award, ThumbsUp, ChevronDown, RefreshCw } from 'lucide-react'
import { format, parseISO } from 'date-fns'


export default function RecommendationsPage() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [selectedMealType, setSelectedMealType] = useState('all')
  const [savedMenus, setSavedMenus] = useState({})
  const [currentMenu, setCurrentMenu] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [dailyTargets, setDailyTargets] = useState(null)
  const [currentIntake, setCurrentIntake] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 })
  const [recommendations, setRecommendations] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedCombo, setSelectedCombo] = useState(null)


  // Load data on mount
  useEffect(() => {
    // Load saved menus
    const menus = JSON.parse(localStorage.getItem('savedMenus') || '{}')
    setSavedMenus(menus)

    // Load user profile
    const profile = JSON.parse(localStorage.getItem('userProfile') || 'null')
    setUserProfile(profile)

    // Load daily targets
    const targets = JSON.parse(localStorage.getItem('dailyTargets') || 'null')
    setDailyTargets(targets)

    // Load current intake
    const intake = JSON.parse(localStorage.getItem('currentIntake') || '{"calories": 0, "protein": 0, "carbs": 0, "fats": 0}')
    setCurrentIntake(intake)
  }, [])


  // Update current menu when date changes
  useEffect(() => {
    if (savedMenus[selectedDate]) {
      setCurrentMenu(savedMenus[selectedDate])
    } else {
      setCurrentMenu(null)
    }
  }, [selectedDate, savedMenus])


  // Get available dates
  const availableDates = Object.keys(savedMenus).sort()

  // Safe date formatting function
  const formatDateSafe = (dateString) => {
    try {
      // Parse ISO date string (YYYY-MM-DD)
      const date = parseISO(dateString)
      // Validate the date
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date')
      }
      return format(date, 'EEEE, MMMM d, yyyy')
    } catch (err) {
      console.error('Date formatting error:', err, dateString)
      return dateString // Fallback to original string
    }
  }

  // Get recommendations
  const handleGetRecommendations = async () => {
    if (!currentMenu || !userProfile || !dailyTargets) {
      setError('Please complete your profile and upload a menu first')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Prepare menu items based on selected meal type
      let menuItems = {}
      
      if (selectedMealType === 'all') {
        // Combine all meals
        Object.values(currentMenu.meals).forEach(mealItems => {
          menuItems = { ...menuItems, ...mealItems }
        })
      } else {
        // Use specific meal type
        menuItems = currentMenu.meals[selectedMealType] || {}
      }

      // Call API
      const response = await api.getRecommendations(
        userProfile,
        menuItems,
        currentIntake,
        dailyTargets
      )

      if (response.status === 'success') {
        setRecommendations(response.recommendations)
      } else {
        setError('Failed to get recommendations')
      }
    } catch (err) {
      console.error('Error:', err)
      setError('Failed to generate recommendations')
    } finally {
      setLoading(false)
    }
  }

  // Log meal and update intake
  const handleLogMeal = (combo) => {
    setSelectedCombo(combo)
    
    // Update current intake with safe checks
    const newIntake = {
      calories: (currentIntake.calories || 0) + (combo?.total_macros?.calories || 0),
      protein: (currentIntake.protein || 0) + (combo?.total_macros?.protein || 0),
      carbs: (currentIntake.carbs || 0) + (combo?.total_macros?.carbs || 0),
      fats: (currentIntake.fats || 0) + (combo?.total_macros?.fats || 0)
    }
    
    setCurrentIntake(newIntake)
    localStorage.setItem('currentIntake', JSON.stringify(newIntake))

    // Save to meal history
    const history = JSON.parse(localStorage.getItem('mealHistory') || '[]')
    history.push({
      date: new Date().toISOString(),
      meal: combo,
      menuDate: selectedDate
    })
    localStorage.setItem('mealHistory', JSON.stringify(history))
  }

  const iconMap = [Award, ThumbsUp, TrendingUp]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-2">🎯 Meal Recommendations</h1>
        <p className="text-lg text-blue-100">
          Get AI-powered meal suggestions based on your fitness goals
        </p>
      </div>

      {/* Profile Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`rounded-xl p-6 ${userProfile ? 'bg-green-50 border-2 border-green-200' : 'bg-yellow-50 border-2 border-yellow-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Profile Status</p>
              <p className={`text-lg font-bold ${userProfile ? 'text-green-700' : 'text-yellow-700'}`}>
                {userProfile ? '✓ Complete' : '⚠ Incomplete'}
              </p>
            </div>
            <Target className={`h-10 w-10 ${userProfile ? 'text-green-500' : 'text-yellow-500'}`} />
          </div>
          {!userProfile && (
            <a href="/profile" className="mt-3 inline-block text-sm text-blue-600 hover:underline">
              Complete Profile →
            </a>
          )}
        </div>

        <div className={`rounded-xl p-6 ${dailyTargets ? 'bg-green-50 border-2 border-green-200' : 'bg-yellow-50 border-2 border-yellow-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Daily Targets</p>
              <p className={`text-lg font-bold ${dailyTargets ? 'text-green-700' : 'text-yellow-700'}`}>
                {dailyTargets ? `${dailyTargets.protein}g Protein` : 'Not Set'}
              </p>
            </div>
            <Dumbbell className={`h-10 w-10 ${dailyTargets ? 'text-green-500' : 'text-yellow-500'}`} />
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Today's Progress</p>
              <p className="text-lg font-bold text-blue-700">
                {currentIntake.protein || 0}g / {dailyTargets?.protein || 0}g
              </p>
            </div>
            <TrendingUp className="h-10 w-10 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Selection Controls */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Select Menu & Meal Type</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                {availableDates.length === 0 ? (
                  <option value="">No menus available</option>
                ) : (
                  availableDates.map(date => (
                    <option key={date} value={date}>
                      {formatDateSafe(date)}
                    </option>
                  ))
                )}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Meal Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meal Type
            </label>
            <div className="relative">
              <Utensils className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedMealType}
                onChange={(e) => setSelectedMealType(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                disabled={!currentMenu}
              >
                <option value="all">All Meals</option>
                {currentMenu && Object.keys(currentMenu.meals).map(mealType => (
                  <option key={mealType} value={mealType}>{mealType}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Available Items Preview */}
        {currentMenu && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Available items:</strong> {
                selectedMealType === 'all' 
                  ? Object.values(currentMenu.meals).reduce((sum, meal) => sum + Object.keys(meal).length, 0)
                  : Object.keys(currentMenu.meals[selectedMealType] || {}).length
              } food items
            </p>
          </div>
        )}

        {/* Get Recommendations Button */}
        <button
          onClick={handleGetRecommendations}
          disabled={!currentMenu || !userProfile || !dailyTargets || loading}
          className="w-full mt-4 flex items-center justify-center space-x-2 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              <span>Generating Recommendations...</span>
            </>
          ) : (
            <>
              <RefreshCw className="h-5 w-5" />
              <span>Get AI Recommendations</span>
            </>
          )}
        </button>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}
      </div>

      {/* Recommendations Display */}
      {recommendations && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🎯 Your Personalized Recommendations</h2>
          
          {/* Motivation Message */}
          {recommendations.motivation && (
            <div className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
              <p className="text-lg font-semibold">{recommendations.motivation}</p>
            </div>
          )}

          {/* Recommendation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.recommendations && Array.isArray(recommendations.recommendations) && recommendations.recommendations.map((combo, index) => {
              const Icon = iconMap[index] || ThumbsUp
              const isSelected = selectedCombo?.name === combo.name
              
              return (
                <div 
                  key={index}
                  className={`border-2 rounded-xl p-6 transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50 shadow-lg scale-105' 
                      : 'border-gray-200 hover:shadow-lg'
                  }`}
                >
                  {index === 0 && (
                    <span className="inline-block bg-green-500 text-white text-xs px-3 py-1 rounded-full mb-3">
                      Recommended
                    </span>
                  )}
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <Icon className="h-6 w-6 text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-800">{combo.name || `Option ${index + 1}`}</h3>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{combo.description || 'Great meal option'}</p>
                  
                  {/* Items List */}
                  <div className="space-y-2 mb-4">
                    <p className="text-xs font-semibold text-gray-700 uppercase">Items:</p>
                    {combo.items && Array.isArray(combo.items) && combo.items.map((item, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span className="text-sm text-gray-700 flex-1">{item}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Macros */}
                  {combo.total_macros && (
                    <div className="border-t pt-4 mb-4">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-xs text-gray-500">Calories</p>
                          <p className="font-bold text-gray-800">{combo.total_macros.calories || 0}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-2">
                          <p className="text-xs text-gray-500">Protein</p>
                          <p className="font-bold text-green-600">{combo.total_macros.protein || 0}g</p>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-2">
                          <p className="text-xs text-gray-500">Carbs</p>
                          <p className="font-bold text-yellow-600">{combo.total_macros.carbs || 0}g</p>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-2">
                          <p className="text-xs text-gray-500">Fats</p>
                          <p className="font-bold text-orange-600">{combo.total_macros.fats || 0}g</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reasoning */}
                  {combo.reasoning && (
                    <div className="bg-blue-50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-blue-800">
                        <strong>Why this combo?</strong> {combo.reasoning}
                      </p>
                    </div>
                  )}
                  
                  {/* Action Button */}
                  <button 
                    onClick={() => handleLogMeal(combo)}
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                      isSelected
                        ? 'bg-green-500 text-white' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isSelected ? '✓ Logged' : 'Log This Meal'}
                  </button>
                </div>
              )
            })}
          </div>

          {recommendations.alternatives && Array.isArray(recommendations.alternatives) && recommendations.alternatives.length > 0 && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                <span>💡</span>
                <span>Alternative Options</span>
              </h3>
              <ul className="list-disc list-inside space-y-2">
                {recommendations.alternatives.map((alt, idx) => (
                  <li key={idx} className="text-sm text-gray-700">{alt}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {dailyTargets && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Today's Progress</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Calories', current: currentIntake.calories || 0, target: dailyTargets.calories || 0, unit: '' },
              { label: 'Protein', current: currentIntake.protein || 0, target: dailyTargets.protein || 0, unit: 'g' },
              { label: 'Carbs', current: currentIntake.carbs || 0, target: dailyTargets.carbs || 0, unit: 'g' },
              { label: 'Fats', current: currentIntake.fats || 0, target: dailyTargets.fats || 0, unit: 'g' }
            ].map((macro, idx) => {
              const percentage = macro.target > 0 ? (macro.current / macro.target) * 100 : 0
              return (
                <div key={idx} className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">{macro.label}</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {macro.current}{macro.unit}
                  </p>
                  <p className="text-xs text-gray-500">
                    of {macro.target}{macro.unit} ({percentage.toFixed(0)}%)
                  </p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* No Menus Available Message */}
      {availableDates.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Menus Available</h3>
          <p className="text-gray-600 mb-6">
            Upload a mess menu first to get personalized recommendations
          </p>
          <a 
            href="/scan-menu"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>Upload Menu</span>
          </a>
        </div>
      )}
    </div>
  )
}