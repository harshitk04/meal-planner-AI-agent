'use client'
import { format } from 'date-fns'
import { Calendar, Coffee, Utensils, Moon } from 'lucide-react'

export default function MenuAnalysis({ menuData }) {
  // Check if we have data
  if (!menuData || !menuData.menus || menuData.menus.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 Menu Analysis</h2>
        <p className="text-gray-600">No menu data available. Please upload a menu first.</p>
      </div>
    )
  }

  const mealIcons = {
    'Breakfast': Coffee,
    'Lunch': Utensils,
    'Dinner': Moon,
    'Snacks': Coffee,
    'General': Utensils
  }

  const mealColors = {
    'Breakfast': 'bg-yellow-50 border-yellow-200',
    'Lunch': 'bg-blue-50 border-blue-200',
    'Dinner': 'bg-purple-50 border-purple-200',
    'Snacks': 'bg-green-50 border-green-200',
    'General': 'bg-gray-50 border-gray-200'
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 Menu Analysis</h2>
        <p className="text-sm text-gray-600 mb-4">
          Found <span className="font-bold text-blue-600">{menuData.menus.length}</span> day(s) of menu
        </p>
      </div>

      {/* Each Date's Menu */}
      {menuData.menus.map((dayMenu, dayIndex) => {
        const dateStr = dayMenu.date !== 'unknown' 
          ? format(new Date(dayMenu.date), 'EEEE, MMMM d, yyyy')
          : `${dayMenu.day} (Date not specified)`

        return (
          <div key={dayIndex} className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Date Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
              <div className="flex items-center space-x-3">
                <Calendar className="h-8 w-8" />
                <div>
                  <h3 className="text-2xl font-bold">{dateStr}</h3>
                  {dayMenu.date !== 'unknown' && (
                    <p className="text-sm text-blue-100">
                      {Object.keys(dayMenu.meals).length} meal type(s) available
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Meal Types */}
            <div className="p-6 space-y-6">
              {Object.entries(dayMenu.meals).map(([mealType, items], mealIndex) => {
                const MealIcon = mealIcons[mealType] || Utensils
                const colorClass = mealColors[mealType] || mealColors['General']
                
                // Convert items object to array
                const menuItems = Object.entries(items).map(([name, nutrition]) => ({
                  name,
                  ...nutrition
                }))

                // Calculate meal totals
                const mealTotals = {
                  calories: menuItems.reduce((sum, item) => sum + (item.calories || 0), 0),
                  protein: menuItems.reduce((sum, item) => sum + (item.protein || 0), 0),
                  carbs: menuItems.reduce((sum, item) => sum + (item.carbs || 0), 0),
                  fats: menuItems.reduce((sum, item) => sum + (item.fats || 0), 0)
                }

                return (
                  <div key={mealIndex} className={`border-2 rounded-lg overflow-hidden ${colorClass}`}>
                    {/* Meal Type Header */}
                    <div className="px-6 py-4 bg-white border-b-2 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <MealIcon className="h-6 w-6 text-gray-700" />
                        <h4 className="text-xl font-bold text-gray-800">{mealType}</h4>
                      </div>
                      <span className="text-sm text-gray-600">
                        {menuItems.length} item(s)
                      </span>
                    </div>

                    {/* Items Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Food Item</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Portion</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Calories</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Protein</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Carbs</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Fats</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {menuItems.map((item, itemIndex) => (
                            <tr key={itemIndex} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.name}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{item.portion || 'N/A'}</td>
                              <td className="px-4 py-3 text-sm text-center text-gray-600">{item.calories} cal</td>
                              <td className="px-4 py-3 text-sm text-center text-green-600 font-semibold">{item.protein}g</td>
                              <td className="px-4 py-3 text-sm text-center text-yellow-600">{item.carbs}g</td>
                              <td className="px-4 py-3 text-sm text-center text-orange-600">{item.fats}g</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-blue-50">
                          <tr>
                            <td className="px-4 py-3 text-sm font-bold text-gray-800" colSpan="2">
                              {mealType} Total
                            </td>
                            <td className="px-4 py-3 text-sm text-center font-bold text-gray-800">
                              {mealTotals.calories} cal
                            </td>
                            <td className="px-4 py-3 text-sm text-center font-bold text-green-600">
                              {mealTotals.protein}g
                            </td>
                            <td className="px-4 py-3 text-sm text-center font-bold text-yellow-600">
                              {mealTotals.carbs}g
                            </td>
                            <td className="px-4 py-3 text-sm text-center font-bold text-orange-600">
                              {mealTotals.fats}g
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
