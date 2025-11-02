import os
import json
class NutritionRAG:
    def __init__(self, api_key):
        """Initialize nutrition database"""
        self.api_key = api_key
        self.food_database = {}
        self.initialize_database()
    
    def initialize_database(self):
        """Create simple dictionary with Indian food nutrition data"""
        indian_foods = [
            # Common mess items
            {"name": "Rajma Rice", "protein": 15, "carbs": 70, "fats": 8, "calories": 450, "portion": "1 plate"},
            {"name": "Rajma", "protein": 15, "carbs": 40, "fats": 1, "calories": 230, "portion": "1 bowl"},
            {"name": "Dal Rice", "protein": 12, "carbs": 65, "fats": 5, "calories": 350, "portion": "1 plate"},
            {"name": "Paneer Curry", "protein": 18, "carbs": 12, "fats": 18, "calories": 280, "portion": "1 bowl"},
            {"name": "Paneer", "protein": 18, "carbs": 3, "fats": 20, "calories": 265, "portion": "100g"},
            {"name": "Dal Fry", "protein": 8, "carbs": 22, "fats": 4, "calories": 150, "portion": "1 bowl"},
            {"name": "Dal Tadka", "protein": 8, "carbs": 22, "fats": 5, "calories": 160, "portion": "1 bowl"},
            {"name": "Dal Mix Tadka", "protein": 8, "carbs": 22, "fats": 5, "calories": 160, "portion": "1 bowl"},
            {"name": "Dal", "protein": 8, "carbs": 22, "fats": 4, "calories": 150, "portion": "1 bowl"},
            {"name": "Arhar Dal", "protein": 9, "carbs": 20, "fats": 4, "calories": 155, "portion": "1 bowl"},
            {"name": "Arhar", "protein": 9, "carbs": 20, "fats": 4, "calories": 155, "portion": "1 bowl"},
            {"name": "Chana Masala", "protein": 12, "carbs": 28, "fats": 6, "calories": 220, "portion": "1 bowl"},
            {"name": "Chana", "protein": 12, "carbs": 28, "fats": 6, "calories": 220, "portion": "1 bowl"},
            {"name": "Chole", "protein": 12, "carbs": 28, "fats": 6, "calories": 220, "portion": "1 bowl"},
            {"name": "Cholla", "protein": 12, "carbs": 28, "fats": 6, "calories": 220, "portion": "1 bowl"},
            {"name": "Chanamasala", "protein": 12, "carbs": 28, "fats": 6, "calories": 220, "portion": "1 bowl"},
            {"name": "Kala Chana", "protein": 12, "carbs": 28, "fats": 6, "calories": 220, "portion": "1 bowl"},
            {"name": "Masoor Sabut", "protein": 9, "carbs": 20, "fats": 0.5, "calories": 120, "portion": "1 bowl"},
            
            # Breads
            {"name": "Roti", "protein": 2, "carbs": 14, "fats": 1, "calories": 70, "portion": "1 piece"},
            {"name": "Chapati", "protein": 2, "carbs": 14, "fats": 1, "calories": 70, "portion": "1 piece"},
            {"name": "Paratha", "protein": 4, "carbs": 25, "fats": 8, "calories": 180, "portion": "1 piece"},
            {"name": "Poori", "protein": 3, "carbs": 18, "fats": 10, "calories": 160, "portion": "1 piece"},
            {"name": "Naan", "protein": 5, "carbs": 30, "fats": 5, "calories": 180, "portion": "1 piece"},
            
            # Rice dishes
            {"name": "Rice", "protein": 2, "carbs": 30, "fats": 0.5, "calories": 130, "portion": "1/2 cup"},
            {"name": "Jeera Rice", "protein": 2, "carbs": 32, "fats": 3, "calories": 160, "portion": "1 cup"},
            {"name": "Zeera Rice", "protein": 2, "carbs": 32, "fats": 3, "calories": 160, "portion": "1 cup"},
            {"name": "Onion Rice", "protein": 3, "carbs": 35, "fats": 4, "calories": 180, "portion": "1 cup"},
            {"name": "Biryani", "protein": 12, "carbs": 50, "fats": 15, "calories": 380, "portion": "1 plate"},
            {"name": "Veg Biryani", "protein": 8, "carbs": 50, "fats": 12, "calories": 340, "portion": "1 plate"},
            {"name": "Pulao", "protein": 8, "carbs": 45, "fats": 10, "calories": 300, "portion": "1 plate"},
            {"name": "Matar Pulao", "protein": 8, "carbs": 45, "fats": 10, "calories": 300, "portion": "1 plate"},
            {"name": "Tahari", "protein": 10, "carbs": 48, "fats": 8, "calories": 300, "portion": "1 plate"},
            
            # Dairy
            {"name": "Curd", "protein": 6, "carbs": 8, "fats": 3, "calories": 80, "portion": "1 bowl"},
            {"name": "Dahi", "protein": 6, "carbs": 8, "fats": 3, "calories": 80, "portion": "1 bowl"},
            {"name": "Raita", "protein": 4, "carbs": 6, "fats": 3, "calories": 60, "portion": "1 bowl"},
            {"name": "Boondi Raita", "protein": 4, "carbs": 8, "fats": 3, "calories": 70, "portion": "1 bowl"},
            {"name": "Milk", "protein": 8, "carbs": 12, "fats": 5, "calories": 120, "portion": "1 cup"},
            
            # Proteins
            {"name": "Egg", "protein": 6, "carbs": 0.5, "fats": 5, "calories": 78, "portion": "1 egg"},
            {"name": "Egg Curry", "protein": 12, "carbs": 8, "fats": 15, "calories": 220, "portion": "2 eggs"},
            {"name": "Butter", "protein": 0, "carbs": 0, "fats": 11, "calories": 100, "portion": "1 tbsp"},
            {"name": "Matar Paneer", "protein": 15, "carbs": 12, "fats": 18, "calories": 280, "portion": "1 bowl"},
            
            # Vegetables
            {"name": "Aloo", "protein": 2, "carbs": 20, "fats": 0.2, "calories": 90, "portion": "1 medium"},
            {"name": "Aloo Gobhi", "protein": 3, "carbs": 18, "fats": 4, "calories": 120, "portion": "1 bowl"},
            {"name": "Aloo Gajar", "protein": 2, "carbs": 15, "fats": 3, "calories": 100, "portion": "1 bowl"},
            {"name": "Alu Curry", "protein": 3, "carbs": 22, "fats": 6, "calories": 150, "portion": "1 bowl"},
            {"name": "Dum Aloo", "protein": 3, "carbs": 25, "fats": 8, "calories": 180, "portion": "1 bowl"},
            {"name": "Gobhi", "protein": 2, "carbs": 5, "fats": 0.3, "calories": 25, "portion": "1 cup"},
            {"name": "Kaddu", "protein": 1, "carbs": 7, "fats": 0.1, "calories": 30, "portion": "1 cup"},
            {"name": "Cabbage Matar", "protein": 3, "carbs": 10, "fats": 2, "calories": 70, "portion": "1 bowl"},
            {"name": "Baigan Bharta", "protein": 2, "carbs": 10, "fats": 5, "calories": 90, "portion": "1 bowl"},
            {"name": "Louki Kofta", "protein": 5, "carbs": 15, "fats": 10, "calories": 160, "portion": "1 bowl"},
            {"name": "Moong Kofta", "protein": 8, "carbs": 12, "fats": 8, "calories": 150, "portion": "1 bowl"},
            {"name": "Mixed Veg", "protein": 4, "carbs": 12, "fats": 4, "calories": 100, "portion": "1 bowl"},
            {"name": "Tawa Veg", "protein": 4, "carbs": 12, "fats": 6, "calories": 120, "portion": "1 bowl"},
            {"name": "Salad", "protein": 2, "carbs": 8, "fats": 0.5, "calories": 40, "portion": "1 bowl"},
            
            # South Indian
            {"name": "Idli", "protein": 3, "carbs": 20, "fats": 1, "calories": 100, "portion": "2 pieces"},
            {"name": "Dosa", "protein": 5, "carbs": 25, "fats": 4, "calories": 160, "portion": "1 dosa"},
            {"name": "Uttapam", "protein": 4, "carbs": 22, "fats": 3, "calories": 140, "portion": "1 piece"},
            {"name": "Sambhar", "protein": 8, "carbs": 15, "fats": 4, "calories": 130, "portion": "1 bowl"},
            {"name": "Rasam", "protein": 2, "carbs": 8, "fats": 2, "calories": 50, "portion": "1 bowl"},
            
            # Breakfast items
            {"name": "Poha", "protein": 4, "carbs": 30, "fats": 3, "calories": 160, "portion": "1 bowl"},
            {"name": "Upma", "protein": 6, "carbs": 35, "fats": 5, "calories": 200, "portion": "1 cup"},
            {"name": "Halwa", "protein": 3, "carbs": 45, "fats": 12, "calories": 280, "portion": "1 bowl"},
            {"name": "Suji Halwa", "protein": 3, "carbs": 45, "fats": 12, "calories": 280, "portion": "1 bowl"},
            {"name": "Moong Dal Halwa", "protein": 8, "carbs": 50, "fats": 15, "calories": 350, "portion": "1 bowl"},
            {"name": "Maggi", "protein": 8, "carbs": 55, "fats": 15, "calories": 380, "portion": "1 packet"},
            {"name": "Cornflakes", "protein": 2, "carbs": 25, "fats": 0.5, "calories": 110, "portion": "1 cup"},
            {"name": "Dalia", "protein": 5, "carbs": 30, "fats": 2, "calories": 160, "portion": "1 bowl"},
            {"name": "Samosa", "protein": 4, "carbs": 25, "fats": 12, "calories": 220, "portion": "1 piece"},
            {"name": "Cholla Samose", "protein": 16, "carbs": 53, "fats": 18, "calories": 440, "portion": "combo"},
            
            # Sweets
            {"name": "Jalebi", "protein": 2, "carbs": 50, "fats": 8, "calories": 250, "portion": "100g"},
            {"name": "Gulab Jamun", "protein": 3, "carbs": 40, "fats": 15, "calories": 300, "portion": "2 pieces"},
            {"name": "Gulabjamun", "protein": 3, "carbs": 40, "fats": 15, "calories": 300, "portion": "2 pieces"},
            {"name": "Kala Jam", "protein": 3, "carbs": 42, "fats": 15, "calories": 310, "portion": "2 pieces"},
            {"name": "Kheer", "protein": 6, "carbs": 40, "fats": 8, "calories": 250, "portion": "1 bowl"},
            {"name": "Sewai", "protein": 4, "carbs": 35, "fats": 6, "calories": 210, "portion": "1 bowl"},
            {"name": "Ladoo", "protein": 4, "carbs": 35, "fats": 12, "calories": 260, "portion": "2 pieces"},
            {"name": "Nariyal Laddo", "protein": 3, "carbs": 38, "fats": 14, "calories": 280, "portion": "2 pieces"},
            
            # Condiments & Misc
            {"name": "Chutney", "protein": 1, "carbs": 5, "fats": 0.5, "calories": 25, "portion": "2 tbsp"},
            {"name": "Chatni", "protein": 1, "carbs": 5, "fats": 0.5, "calories": 25, "portion": "2 tbsp"},
            {"name": "Hari Chatni", "protein": 1, "carbs": 3, "fats": 0.5, "calories": 20, "portion": "2 tbsp"},
            {"name": "Lashun Chatni", "protein": 1, "carbs": 4, "fats": 1, "calories": 25, "portion": "2 tbsp"},
            {"name": "Achar", "protein": 0.5, "carbs": 3, "fats": 1, "calories": 20, "portion": "1 tbsp"},
            {"name": "Jam", "protein": 0, "carbs": 15, "fats": 0, "calories": 60, "portion": "1 tbsp"},
            {"name": "Sauce", "protein": 0.5, "carbs": 5, "fats": 0, "calories": 20, "portion": "1 tbsp"},
            {"name": "Kadhi Pakora", "protein": 8, "carbs": 15, "fats": 12, "calories": 200, "portion": "1 bowl"},
            {"name": "Kadhi", "protein": 8, "carbs": 12, "fats": 10, "calories": 180, "portion": "1 bowl"},
            {"name": "Sprout", "protein": 4, "carbs": 8, "fats": 0.5, "calories": 50, "portion": "1 cup"},
            {"name": "Dal Makhani", "protein": 10, "carbs": 25, "fats": 15, "calories": 280, "portion": "1 bowl"},
            
            # Fruits
            {"name": "Banana", "protein": 1, "carbs": 27, "fats": 0.3, "calories": 105, "portion": "1 medium"},
            {"name": "Papaya", "protein": 0.5, "carbs": 11, "fats": 0.2, "calories": 43, "portion": "1 cup"},
            
            # Special dishes
            {"name": "Special Dinner", "protein": 25, "carbs": 60, "fats": 20, "calories": 520, "portion": "1 thali"},
        ]
        for food in indian_foods:
            key = food['name'].lower()
            self.food_database[key] = {
                "name": food['name'],
                "calories": food['calories'],
                "protein": food['protein'],
                "carbs": food['carbs'],
                "fats": food['fats'],
                "portion": food['portion']
            }
        
        print(f"✓ Nutrition database initialized with {len(self.food_database)} food items")
    
    def search_food(self, food_name):
        """Search for food item"""
        if not food_name or not isinstance(food_name, str):
            return {
                "name": str(food_name),
                "calories": 100,
                "protein": 3,
                "carbs": 15,
                "fats": 3,
                "portion": "1 serving"
            }
        
        key = food_name.lower().strip()
        
        if key in self.food_database:
            return self.food_database[key]
        
        # Partial match
        for db_key, db_value in self.food_database.items():
            if key in db_key or db_key in key:
                return db_value
        
        # Default
        return {
            "name": food_name,
            "calories": 100,
            "protein": 3,
            "carbs": 15,
            "fats": 3,
            "portion": "1 serving"
        }
    
    def search_multiple_foods(self, food_names):
        """Search multiple foods"""
        result = {}
        
        if isinstance(food_names, list):
            for food in food_names:
                if food:
                    result[food] = self.search_food(food)
        elif isinstance(food_names, dict):
            for food in food_names.keys():
                if food:
                    result[food] = self.search_food(food)
        
        return result
