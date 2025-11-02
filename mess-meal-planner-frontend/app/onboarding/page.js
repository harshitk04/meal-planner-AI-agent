'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, ChevronLeft, Check, Target, TrendingUp, Calendar, Dumbbell, Loader } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [isCalculating, setIsCalculating] = useState(false)
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    goal: '',
    activity_level: '',
    workout_split: {
      sunday: 'rest',
      monday: 'chest',
      tuesday: 'back',
      wednesday: 'legs',
      thursday: 'shoulders',
      friday: 'arms',
      saturday: 'cardio'
    }
  })

  const totalSteps = 6

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const getTodayWorkout = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const today = new Date().getDay()
    return profile.workout_split[days[today]] || 'rest'
  }

  const handleComplete = async () => {
    setIsCalculating(true)
    try {
      // Calculate macros using the API
      const response = await fetch('http://localhost:8000/setup-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: parseInt(profile.age),
          height: parseFloat(profile.height),
          weight: parseFloat(profile.weight),
          goal: profile.goal,
          activity_level: profile.activity_level,
          workout_today: getTodayWorkout()
        })
      })

      const data = await response.json()

      if (data.status === 'success') {
        // Save everything to localStorage
        localStorage.setItem('userProfile', JSON.stringify({
          name: profile.name,
          age: parseInt(profile.age),
          height: parseFloat(profile.height),
          weight: parseFloat(profile.weight),
          goal: profile.goal,
          activity_level: profile.activity_level,
          workout_split: profile.workout_split
        }))
        
        localStorage.setItem('dailyTargets', JSON.stringify(data.daily_targets))
        localStorage.setItem('tdee', data.tdee)
        localStorage.setItem('onboardingComplete', 'true')
        
        // Initialize current intake
        localStorage.setItem('currentIntake', JSON.stringify({
          calories: 0,
          protein: 0,
          carbs: 0,
          fats: 0
        }))

        // Redirect to dashboard
        router.push('/')
      } else {
        alert('Failed to calculate macros. Please try again.')
      }
    } catch (error) {
      console.error('Error calculating macros:', error)
      alert('Failed to calculate macros. Please try again.')
    } finally {
      setIsCalculating(false)
    }
  }

  const updateProfile = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const updateWorkout = (day, value) => {
    setProfile(prev => ({
      ...prev,
      workout_split: {
        ...prev.workout_split,
        [day]: value
      }
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {step + 1} of {totalSteps + 1}
            </span>
            <span className="text-sm font-medium text-blue-600">
              {Math.round(((step + 1) / (totalSteps + 1)) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((step + 1) / (totalSteps + 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          
          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-full">
                  <Target className="h-16 w-16 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900">
                Welcome to Mess Meal Planner! 🎯
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Your AI-powered nutrition assistant for IIT mess food
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <div className="bg-blue-50 rounded-xl p-6">
                  <Calendar className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2">Scan Menus</h3>
                  <p className="text-sm text-gray-600">
                    Upload weekly mess menus and get instant macro analysis
                  </p>
                </div>
                
                <div className="bg-purple-50 rounded-xl p-6">
                  <TrendingUp className="h-10 w-10 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2">Track Progress</h3>
                  <p className="text-sm text-gray-600">
                    Monitor your daily intake vs. targets in real-time
                  </p>
                </div>
                
                <div className="bg-green-50 rounded-xl p-6">
                  <Dumbbell className="h-10 w-10 text-green-600 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2">Get Recommendations</h3>
                  <p className="text-sm text-gray-600">
                    AI-powered meal suggestions for your fitness goals
                  </p>
                </div>
              </div>

              <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                <p className="text-gray-700 font-medium">
                  ✨ Let's get started by setting up your profile in just 7 simple steps!
                </p>
              </div>
            </div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Let's Start with the Basics 👤
                </h2>
                <p className="text-gray-600">Tell us a bit about yourself</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What's your name?
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => updateProfile('name', e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How old are you?
                </label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => updateProfile('age', e.target.value)}
                  placeholder="Enter your age"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
            </div>
          )}

          {/* Step 2: Body Metrics */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Your Body Metrics 📏
                </h2>
                <p className="text-gray-600">We need these to calculate your nutrition needs</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={profile.height}
                    onChange={(e) => updateProfile('height', e.target.value)}
                    placeholder="e.g., 175"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Your height in centimeters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={profile.weight}
                    onChange={(e) => updateProfile('weight', e.target.value)}
                    placeholder="e.g., 70"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Your current weight in kilograms</p>
                </div>
              </div>

              {profile.height && profile.weight && (
                <div className="bg-blue-50 rounded-xl p-6 text-center">
                  <p className="text-sm text-gray-600 mb-2">Your BMI</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {(profile.weight / ((profile.height / 100) ** 2)).toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {(profile.weight / ((profile.height / 100) ** 2)) < 18.5 ? 'Underweight' :
                     (profile.weight / ((profile.height / 100) ** 2)) < 25 ? 'Normal weight' :
                     (profile.weight / ((profile.height / 100) ** 2)) < 30 ? 'Overweight' : 'Obese'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Fitness Goal */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  What's Your Goal? 🎯
                </h2>
                <p className="text-gray-600">Choose your primary fitness objective</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => updateProfile('goal', 'bulk')}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    profile.goal === 'bulk'
                      ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-4xl mb-3">💪</div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">Bulk (Gain Muscle)</h3>
                  <p className="text-sm text-gray-600">
                    Increase muscle mass with a calorie surplus
                  </p>
                  {profile.goal === 'bulk' && (
                    <div className="mt-3 flex items-center justify-center text-blue-600">
                      <Check className="h-5 w-5 mr-1" />
                      <span className="text-sm font-medium">Selected</span>
                    </div>
                  )}
                </button>

                <button
                  onClick={() => updateProfile('goal', 'cut')}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    profile.goal === 'cut'
                      ? 'border-green-500 bg-green-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="text-4xl mb-3">🔥</div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">Cut (Lose Fat)</h3>
                  <p className="text-sm text-gray-600">
                    Reduce body fat with a calorie deficit
                  </p>
                  {profile.goal === 'cut' && (
                    <div className="mt-3 flex items-center justify-center text-green-600">
                      <Check className="h-5 w-5 mr-1" />
                      <span className="text-sm font-medium">Selected</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Activity Level */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  How Active Are You? 🏃‍♂️
                </h2>
                <p className="text-gray-600">This helps calculate your calorie needs</p>
              </div>

              <div className="space-y-3">
                {[
                  { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise', emoji: '🛋️' },
                  { value: 'light', label: 'Lightly Active', desc: 'Exercise 1-3 days/week', emoji: '🚶‍♂️' },
                  { value: 'moderate', label: 'Moderately Active', desc: 'Exercise 3-5 days/week', emoji: '🏋️‍♂️' },
                  { value: 'active', label: 'Very Active', desc: 'Exercise 6-7 days/week', emoji: '🤸‍♂️' },
                  { value: 'very_active', label: 'Extra Active', desc: 'Hard exercise daily + physical job', emoji: '🔥' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateProfile('activity_level', option.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center ${
                      profile.activity_level === option.value
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <span className="text-3xl mr-4">{option.emoji}</span>
                    <div className="flex-1 text-left">
                      <h4 className="font-bold text-gray-900">{option.label}</h4>
                      <p className="text-sm text-gray-600">{option.desc}</p>
                    </div>
                    {profile.activity_level === option.value && (
                      <Check className="h-6 w-6 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Workout Schedule */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Your Workout Schedule 💪
                </h2>
                <p className="text-gray-600">Customize your weekly workout plan</p>
              </div>

              <div className="space-y-3">
                {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day) => (
                  <div key={day} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                    <label className="w-28 font-medium text-gray-700 capitalize text-sm">
                      {day}
                    </label>
                    <select
                      value={profile.workout_split[day]}
                      onChange={(e) => updateWorkout(day, e.target.value)}
                      className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="chest">🫀 Chest</option>
                      <option value="back">🔙 Back</option>
                      <option value="legs">🦵 Legs</option>
                      <option value="shoulders">💪 Shoulders</option>
                      <option value="arms">🎯 Arms</option>
                      <option value="cardio">❤️ Cardio</option>
                      <option value="rest">😴 Rest Day</option>
                    </select>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> A good split includes 1-2 rest days per week for recovery!
                </p>
              </div>
            </div>
          )}

          {/* Step 6: Review */}
          {step === 6 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  All Set! Let's Review 📋
                </h2>
                <p className="text-gray-600">Here's your profile summary</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-gray-800 mb-3">Personal Info</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name</span>
                      <span className="font-bold text-gray-900">{profile.name || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age</span>
                      <span className="font-bold text-gray-900">{profile.age} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Height</span>
                      <span className="font-bold text-gray-900">{profile.height} cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weight</span>
                      <span className="font-bold text-gray-900">{profile.weight} kg</span>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-300" />

                <div>
                  <h3 className="font-bold text-gray-800 mb-3">Fitness Plan</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Goal</span>
                      <span className="font-bold text-gray-900 capitalize">
                        {profile.goal === 'bulk' ? '💪 Bulk' : '🔥 Cut'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Activity Level</span>
                      <span className="font-bold text-gray-900 capitalize">
                        {profile.activity_level.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-300" />

                <div>
                  <h3 className="font-bold text-gray-800 mb-3">Weekly Workout</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(profile.workout_split).map(([day, workout]) => (
                      <div key={day} className="flex justify-between bg-white p-2 rounded">
                        <span className="text-gray-600 capitalize">{day}</span>
                        <span className="font-bold text-gray-900 capitalize">{workout}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> You can always update your profile later from the settings page.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12">
            <button
              onClick={handleBack}
              disabled={step === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                step === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Back</span>
            </button>

            {step < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={
                  (step === 1 && (!profile.name || !profile.age)) ||
                  (step === 2 && (!profile.height || !profile.weight)) ||
                  (step === 3 && !profile.goal) ||
                  (step === 4 && !profile.activity_level)
                }
                className="flex items-center space-x-2 px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all"
              >
                <span>Next</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={isCalculating}
                className="flex items-center space-x-2 px-8 py-3 rounded-xl font-medium bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 transition-all shadow-lg disabled:from-gray-400 disabled:to-gray-400"
              >
                {isCalculating ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Calculating...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Setup</span>
                    <Check className="h-5 w-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
