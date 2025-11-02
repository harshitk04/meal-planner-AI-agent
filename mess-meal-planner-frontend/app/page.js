'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dumbbell, Flame, Target, Loader, TrendingUp, Calendar, Award } from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState(null)
  const [todayProgress, setTodayProgress] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  })
  const [dailyTarget, setDailyTarget] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  })
  const [tdee, setTdee] = useState(0)
  const [workoutDay, setWorkoutDay] = useState("CHEST DAY")

  useEffect(() => {
    // Check if onboarding is complete
    const onboardingComplete = localStorage.getItem('onboardingComplete')
    
    if (!onboardingComplete) {
      router.push('/onboarding')
      return
    }
    
    // Load all data
    const profile = JSON.parse(localStorage.getItem('userProfile') || 'null')
    const targets = JSON.parse(localStorage.getItem('dailyTargets') || 'null')
    const savedTdee = localStorage.getItem('tdee')
    const currentIntake = JSON.parse(localStorage.getItem('currentIntake') || '{"calories":0,"protein":0,"carbs":0,"fats":0}')
    
    if (!profile || !targets) {
      router.push('/onboarding')
      return
    }
    
    setUserProfile(profile)
    setDailyTarget(targets)
    setTdee(savedTdee)
    setTodayProgress(currentIntake)
    
    // Determine workout day - FIXED WITH SAFETY CHECK
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const today = new Date().getDay()
    
    if (profile.workout_split && profile.workout_split[days[today]]) {
      const todayWorkout = profile.workout_split[days[today]]
      setWorkoutDay(todayWorkout.toUpperCase())
    } else {
      // Default workout schedule if not set
      const defaultWorkouts = ['rest', 'chest', 'back', 'legs', 'shoulders', 'arms', 'cardio']
      setWorkoutDay(defaultWorkouts[today].toUpperCase())
    }
    
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const progressPercentage = {
    calories: (todayProgress.calories / dailyTarget.calories) * 100,
    protein: (todayProgress.protein / dailyTarget.protein) * 100,
    carbs: (todayProgress.carbs / dailyTarget.carbs) * 100,
    fats: (todayProgress.fats / dailyTarget.fats) * 100
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-2">
          Welcome back, {userProfile?.name || 'User'}! 👋
        </h1>
        <p className="text-lg text-blue-100 mb-4">
          Ready to crush your fitness goals today?
        </p>
        <div className="flex items-center space-x-4 text-sm">
          <span className="bg-white/20 px-4 py-2 rounded-full">
            Goal: {userProfile?.goal === 'bulk' ? '💪 Bulk' : '🔥 Cut'}
          </span>
          <span className="bg-white/20 px-4 py-2 rounded-full">
            Activity: {userProfile?.activity_level?.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Workout Day Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">💪 Today is {workoutDay} DAY!</h2>
            <p className="text-orange-100">
              All the best! Let's crush it! 🔥
            </p>
          </div>
          <Dumbbell className="h-16 w-16 text-orange-200" />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <Flame className="h-10 w-10 text-blue-200 mb-3" />
          <p className="text-blue-100 text-sm">TDEE</p>
          <p className="text-3xl font-bold">{tdee}</p>
          <p className="text-blue-100 text-xs mt-1">calories/day</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <Target className="h-10 w-10 text-green-200 mb-3" />
          <p className="text-green-100 text-sm">Daily Goal</p>
          <p className="text-3xl font-bold">{dailyTarget.calories}</p>
          <p className="text-green-100 text-xs mt-1">
            {userProfile?.goal === 'bulk' ? '+300 surplus' : '-500 deficit'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <Award className="h-10 w-10 text-purple-200 mb-3" />
          <p className="text-purple-100 text-sm">Protein Target</p>
          <p className="text-3xl font-bold">{dailyTarget.protein}g</p>
          <p className="text-purple-100 text-xs mt-1">per day</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <TrendingUp className="h-10 w-10 text-orange-200 mb-3" />
          <p className="text-orange-100 text-sm">Weight</p>
          <p className="text-3xl font-bold">{userProfile?.weight}kg</p>
          <p className="text-orange-100 text-xs mt-1">current</p>
        </div>
      </div>

      {/* Today's Progress */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Today's Progress</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Calories */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-medium">Calories</span>
              <span className="text-gray-600 text-sm">
                {todayProgress.calories} / {dailyTarget.calories}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all"
                style={{ width: `${Math.min(progressPercentage.calories, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {Math.round(progressPercentage.calories)}% of daily goal
            </p>
          </div>

          {/* Protein */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-medium">Protein</span>
              <span className="text-gray-600 text-sm">
                {todayProgress.protein}g / {dailyTarget.protein}g
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all"
                style={{ width: `${Math.min(progressPercentage.protein, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {Math.round(progressPercentage.protein)}% of daily goal
            </p>
          </div>

          {/* Carbs */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-medium">Carbohydrates</span>
              <span className="text-gray-600 text-sm">
                {todayProgress.carbs}g / {dailyTarget.carbs}g
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-4 rounded-full transition-all"
                style={{ width: `${Math.min(progressPercentage.carbs, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {Math.round(progressPercentage.carbs)}% of daily goal
            </p>
          </div>

          {/* Fats */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-medium">Fats</span>
              <span className="text-gray-600 text-sm">
                {todayProgress.fats}g / {dailyTarget.fats}g
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-orange-500 to-orange-600 h-4 rounded-full transition-all"
                style={{ width: `${Math.min(progressPercentage.fats, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {Math.round(progressPercentage.fats)}% of daily goal
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a 
          href="/scan-menu" 
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-blue-500"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-4 rounded-lg">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Scan Menu</h3>
              <p className="text-sm text-gray-600">Upload today's menu</p>
            </div>
          </div>
        </a>

        <a 
          href="/recommendations" 
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-green-500"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-4 rounded-lg">
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Get Recommendations</h3>
              <p className="text-sm text-gray-600">AI-powered suggestions</p>
            </div>
          </div>
        </a>

        <a 
          href="/calendar" 
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-purple-500"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-4 rounded-lg">
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">View Calendar</h3>
              <p className="text-sm text-gray-600">Check saved menus</p>
            </div>
          </div>
        </a>
      </div>

      {/* Profile Summary Card */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📋 Your Profile Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Age</p>
            <p className="text-lg font-bold text-gray-800">{userProfile?.age} years</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Height</p>
            <p className="text-lg font-bold text-gray-800">{userProfile?.height} cm</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Weight</p>
            <p className="text-lg font-bold text-gray-800">{userProfile?.weight} kg</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">BMI</p>
            <p className="text-lg font-bold text-gray-800">
              {userProfile && (userProfile.weight / ((userProfile.height / 100) ** 2)).toFixed(1)}
            </p>
          </div>
        </div>
        <a 
          href="/profile" 
          className="mt-4 inline-block text-sm text-blue-600 hover:underline"
        >
          Update Profile →
        </a>
      </div>
    </div>
  )
}
