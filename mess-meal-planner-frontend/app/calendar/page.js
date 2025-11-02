'use client'
import { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { format } from 'date-fns'
import { Upload, Eye } from 'lucide-react'

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [savedMenus, setSavedMenus] = useState({})
  const [showMenuDetails, setShowMenuDetails] = useState(false)

  // Load saved menus from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('savedMenus')
    if (stored) setSavedMenus(JSON.parse(stored))
  }, [])

  const hasMenu = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd')
    return savedMenus[dateKey] !== undefined
  }

  const getMenuForDate = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd')
    return savedMenus[dateKey]
  }

  const tileClassName = ({ date, view }) =>
    view === 'month' && hasMenu(date) ? 'has-menu' : null

  const selectedMenu = getMenuForDate(selectedDate)
  const selectedDateKey = format(selectedDate, 'yyyy-MM-dd')
  const todayKey = format(new Date(), 'yyyy-MM-dd')
  const isToday = selectedDateKey === todayKey

  // Safe function to get menu items count
  const getMenuItemsCount = () => {
    if (!selectedMenu?.menu_nutrition || typeof selectedMenu.menu_nutrition !== 'object') {
      return 0
    }
    return Object.keys(selectedMenu.menu_nutrition).length
  }

  // Safe function to get today's menu items count
  const getTodayMenuItemsCount = () => {
    const todayMenu = savedMenus[todayKey]
    if (!todayMenu?.menu_nutrition || typeof todayMenu.menu_nutrition !== 'object') {
      return 0
    }
    return Object.keys(todayMenu.menu_nutrition).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Menu Calendar</h1>
        <p className="text-gray-600">
          View and manage your mess menus by date. Dates with saved menus are highlighted in green.
        </p>
      </div>

      {/* Today's Menu Banner */}
      {savedMenus[todayKey] && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-2">📋 Today's Menu</h2>
          <p className="text-lg mb-4">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
          <div className="flex items-center space-x-4">
            <span className="text-sm bg-white/20 px-4 py-2 rounded-full">
              {getTodayMenuItemsCount()} items available
            </span>
            <button
              onClick={() => setSelectedDate(new Date())}
              className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              View Details
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <style jsx global>{`
            .react-calendar {
              width: 100%;
              border: none;
              font-family: inherit;
            }
            .react-calendar__tile {
              padding: 20px 10px;
              font-size: 14px;
            }
            .react-calendar__tile--active {
              background: #3b82f6 !important;
              color: white;
            }
            .react-calendar__tile--now {
              background: #dbeafe;
            }
            .react-calendar__tile.has-menu {
              background: #d1fae5;
              font-weight: 600;
              position: relative;
            }
            .react-calendar__tile.has-menu::after {
              content: '•';
              position: absolute;
              bottom: 5px;
              left: 50%;
              transform: translateX(-50%);
              color: #10b981;
              font-size: 20px;
            }
            .react-calendar__navigation button {
              font-size: 16px;
              font-weight: 600;
            }
          `}</style>

          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={tileClassName}
            className="rounded-lg"
          />

          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-200 rounded"></div>
                <span>Has Menu</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-100 rounded"></div>
                <span>Today</span>
              </div>
            </div>
            <span>{Object.keys(savedMenus).length} menus saved</span>
          </div>
        </div>

        {/* Selected Date Details */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            <p className="text-sm text-gray-600">{format(selectedDate, 'EEEE')}</p>
            {isToday && (
              <span className="inline-block mt-2 bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                Today
              </span>
            )}
          </div>

          {selectedMenu ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-semibold mb-2">✓ Menu Available</p>
                <p className="text-sm text-gray-700">
                  {getMenuItemsCount()} items detected
                </p>
              </div>

              <button
                onClick={() => setShowMenuDetails(!showMenuDetails)}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Eye className="h-5 w-5" />
                <span>{showMenuDetails ? 'Hide' : 'View'} Menu Details</span>
              </button>

              <a
                href="/scan-menu"
                className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Upload className="h-5 w-5" />
                <span>Update Menu</span>
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 font-semibold mb-2">⚠ No Menu Saved</p>
                <p className="text-sm text-gray-700">Upload a menu for this date</p>
              </div>

              <a
                href="/scan-menu"
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Upload className="h-5 w-5" />
                <span>Upload Menu</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Menu Details Section */}
      {showMenuDetails && selectedMenu && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Menu for {format(selectedDate, 'MMMM d, yyyy')}
          </h3>

          {selectedMenu.meals && typeof selectedMenu.meals === 'object' ? (
            Object.entries(selectedMenu.meals).length > 0 ? (
              Object.entries(selectedMenu.meals).map(([mealType, items]) => (
                <div
                  key={mealType}
                  className="mb-6 border-2 border-gray-200 rounded-lg overflow-hidden"
                >
                  <div className="bg-blue-50 px-4 py-3">
                    <h4 className="font-bold text-lg text-gray-800">{mealType}</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Item
                          </th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                            Protein
                          </th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                            Carbs
                          </th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                            Fats
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {Object.entries(items).length > 0 ? (
                          Object.entries(items).map(([name, nutrition], idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-800">
                                {name}
                              </td>
                              <td className="px-4 py-3 text-sm text-center text-green-600">
                                {nutrition?.protein ?? 'N/A'}g
                              </td>
                              <td className="px-4 py-3 text-sm text-center text-yellow-600">
                                {nutrition?.carbs ?? 'N/A'}g
                              </td>
                              <td className="px-4 py-3 text-sm text-center text-orange-600">
                                {nutrition?.fats ?? 'N/A'}g
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="px-4 py-3 text-center text-gray-500">
                              No items for this meal
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">No meal data available</p>
              </div>
            )
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">Menu data format is invalid</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
