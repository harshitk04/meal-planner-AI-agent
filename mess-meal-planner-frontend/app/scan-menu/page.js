'use client'
import { useState } from 'react'
import MenuUploader from '@/components/MenuUploader'
import MenuAnalysis from '@/components/MenuAnalysis'
import MealRecommendations from '@/components/MealRecommendations'
import { api } from '@/lib/api'
import { Save, Calendar, CheckCircle, AlertCircle } from 'lucide-react'

export default function ScanMenuPage() {
  const [menuData, setMenuData] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState(null)
  const [autoSaved, setAutoSaved] = useState(false)

  const handleMenuUpload = async (file) => {
    setIsAnalyzing(true)
    setError(null)
    setAutoSaved(false)
    setMenuData(null) // Clear previous data
    
    try {
      console.log('📤 Uploading file:', file.name)
      const data = await api.scanMenu(file)
      console.log('📥 Received menu data:', data)
      
      // Validate response structure
      if (!data) {
        throw new Error('No data received from server')
      }
      
      if (data.status !== 'success') {
        throw new Error(data.detail || 'Server returned error status')
      }
      
      if (!data.menus) {
        throw new Error('No menus found in response')
      }
      
      if (!Array.isArray(data.menus)) {
        throw new Error('Menus is not an array')
      }
      
      if (data.menus.length === 0) {
        throw new Error('No menu entries found. Please try a different image/PDF.')
      }
      
      console.log('✅ Data validation passed')
      setMenuData(data)
      
      // Automatically save to calendar
      autoSaveToCalendar(data)
      
    } catch (error) {
      console.error('❌ Error uploading menu:', error)
      setError(error.message || 'Failed to scan menu. Please try again.')
      
      // Show more details in console
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const autoSaveToCalendar = (data) => {
    if (!data || !data.menus || data.menus.length === 0) {
      console.warn('⚠️ No menus to save')
      return
    }

    try {
      console.log('💾 Auto-saving to calendar...')
      
      // Get existing saved menus
      const savedMenus = JSON.parse(localStorage.getItem('savedMenus') || '{}')
      
      let savedCount = 0
      
      // Save each date's menu
      data.menus.forEach((dayMenu, index) => {
        console.log(`  Processing day ${index + 1}:`, dayMenu)
        
        // Use the date from the menu, or generate one if unknown
        let dateKey = dayMenu.date
        
        if (dateKey === 'unknown' || !dateKey) {
          // If no date specified, use today + index
          const date = new Date()
          date.setDate(date.getDate() + index)
          dateKey = date.toISOString().split('T')[0]
          console.log(`  Generated date: ${dateKey}`)
        }
        
        savedMenus[dateKey] = {
          date: dayMenu.date,
          day: dayMenu.day,
          meals: dayMenu.meals,
          raw_items: dayMenu.raw_items,
          savedAt: new Date().toISOString()
        }
        
        savedCount++
      })

      // Save to localStorage
      localStorage.setItem('savedMenus', JSON.stringify(savedMenus))
      setAutoSaved(true)

      console.log(`✅ Auto-saved ${savedCount} day(s) of menus to calendar`)
    } catch (err) {
      console.error('❌ Error auto-saving to calendar:', err)
      setError(`Scanned successfully but failed to save to calendar: ${err.message}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Scan Mess Menu</h1>
        <p className="text-gray-600 mb-6">
          Upload your mess menu as an image (JPG, PNG) or PDF file. The system will automatically detect dates, meal types, and save to calendar.
        </p>

        <MenuUploader onUpload={handleMenuUpload} isAnalyzing={isAnalyzing} />
        
        {error && (
          <div className="mt-4 bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-800 font-semibold">Error:</p>
                <p className="text-red-700 text-sm mt-1">{error}</p>
                <details className="mt-2">
                  <summary className="text-xs text-red-600 cursor-pointer hover:underline">
                    Show technical details
                  </summary>
                  <div className="mt-2 text-xs bg-red-100 p-2 rounded font-mono overflow-auto">
                    Check browser console (F12) for more details
                  </div>
                </details>
              </div>
            </div>
          </div>
        )}

        {autoSaved && (
          <div className="mt-4 bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
              <div>
                <p className="text-green-800 font-semibold">
                  ✓ Menu automatically saved to calendar!
                </p>
                <p className="text-green-700 text-sm mt-1">
                  {menuData?.menus?.length || 0} day(s) of menu have been added to your calendar.
                </p>
                <a href="/calendar" className="text-blue-600 hover:underline text-sm font-medium mt-2 inline-block">
                  View in Calendar →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Display Menu Data */}
      {menuData && menuData.menus && menuData.menus.length > 0 && (
        <>
          <MenuAnalysis menuData={menuData} />
          <MealRecommendations menuData={menuData} />
        </>
      )}

      {/* Debug Info */}
      {menuData && (
        <details className="bg-gray-50 rounded-lg p-4 text-xs border border-gray-200">
          <summary className="cursor-pointer font-semibold text-gray-700 hover:text-blue-600">
            🔍 Debug: View Raw Response Data
          </summary>
          <pre className="mt-2 overflow-auto bg-white p-4 rounded border text-xs max-h-96">
            {JSON.stringify(menuData, null, 2)}
          </pre>
        </details>
      )}
    </div>
  )
}

const handleMenuUpload = async (file) => {
  setIsAnalyzing(true)
  setError(null)
  setAutoSaved(false)
  setMenuData(null)
  
  try {
    console.log('📤 Uploading to TEST endpoint:', file.name)
    
    // Use test endpoint temporarily
    const data = await api.testScan(file)
    
    console.log('📥 Test response:', data)
    alert('Test complete! Check backend terminal for detailed logs.')
    
  } catch (error) {
    console.error('❌ Test error:', error)
    setError(error.message || 'Test failed')
  } finally {
    setIsAnalyzing(false)
  }
}
