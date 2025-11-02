// lib/api.js

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export const api = {
  // Health check
  healthCheck: async () => {
    try {
      const response = await fetch(`${API_BASE}/health`)
      return response.json()
    } catch (error) {
      console.error('Health check failed:', error)
      throw error
    }
  },

  // Setup user profile and calculate macros
  setupProfile: async (profile) => {
    try {
      const response = await fetch(`${API_BASE}/setup-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return response.json()
    } catch (error) {
      console.error('Error setting up profile:', error)
      throw error
    }
  },

  // Scan menu image/PDF and get structured data with dates and meal types
  scanMenu: async (file) => {
    try {
      const formData = new FormData()
      formData.append("file", file)
      
      const response = await fetch(`${API_BASE}/scan-menu`, {
        method: "POST",
        body: formData
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('API Response:', data) // Debug log
      return data
    } catch (error) {
      console.error('Error scanning menu:', error)
      throw error
    }
  },

  // Rest of your API functions...
  getRecommendations: async (userProfile, menuItems, currentIntake, dailyTarget) => {
    try {
      const response = await fetch(`${API_BASE}/get-recommendations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_profile: userProfile,
          menu_items: menuItems,
          current_intake: currentIntake,
          daily_target: dailyTarget
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return response.json()
    } catch (error) {
      console.error('Error getting recommendations:', error)
      throw error
    }
  },

  getGuidance: async (userProfile, dailyTarget, currentIntake) => {
    try {
      const response = await fetch(`${API_BASE}/get-guidance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_profile: userProfile,
          menu_items: {},
          current_intake: currentIntake,
          daily_target: dailyTarget
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return response.json()
    } catch (error) {
      console.error('Error getting guidance:', error)
      throw error
    }
  },

  getMotivation: async (workoutDay, goal) => {
    try {
      const response = await fetch(`${API_BASE}/workout-motivation/${workoutDay}/${goal}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return response.json()
    } catch (error) {
      console.error('Error getting motivation:', error)
      throw error
    }
  },

  searchFood: async (foodName) => {
    try {
      const response = await fetch(`${API_BASE}/search-food/${encodeURIComponent(foodName)}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return response.json()
    } catch (error) {
      console.error('Error searching food:', error)
      throw error
    }
  }
}
