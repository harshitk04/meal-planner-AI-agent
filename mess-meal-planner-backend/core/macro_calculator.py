class MacroCalculator:
    def calculate_tdee(self, age, height, weight, gender="male", activity_level="moderate"):
        """
        Calculate Total Daily Energy Expenditure using Mifflin-St Jeor formula
        """
        if gender == "male":
            bmr = 10 * weight + 6.25 * height - 5 * age + 5
        else:
            bmr = 10 * weight + 6.25 * height - 5 * age - 161
        
        activity_multipliers = {
            "sedentary": 1.2,
            "light": 1.375,
            "moderate": 1.55,
            "active": 1.725,
            "very_active": 1.9
        }
        
        tdee = bmr * activity_multipliers.get(activity_level, 1.55)
        return round(tdee)
    
    def calculate_macros(self, tdee, goal, weight):
        """
        Calculate macro targets based on goal (bulk/cut)
        """
        if goal == "bulk":
            calories = tdee + 300  
            protein = weight * 2   
        elif goal == "cut":
            calories = tdee - 500  
            protein = weight * 2.2 
        else:
            calories = tdee
            protein = weight * 1.8
        
        fats = (calories * 0.25) / 9  
        carbs = (calories - (protein * 4) - (fats * 9)) / 4  
        
        return {
            "calories": round(calories),
            "protein": round(protein),
            "carbs": round(carbs),
            "fats": round(fats)
        }
