import google.generativeai as genai
import json

class MealPlanningAgent:
    def __init__(self, api_key):
        """Initialize Gemini agent"""
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash')
    
    def analyze_menu_and_recommend(self, menu_items, user_profile, current_intake, target_macros):
        """
        Use Gemini to analyze menu and create recommendations
        """
        
        # Create prompt for Gemini
        prompt = f"""
        You are a professional fitness coach and nutritionist. 
        
        USER PROFILE:
        - Age: {user_profile['age']}
        - Height: {user_profile['height']} cm
        - Weight: {user_profile['weight']} kg
        - Goal: {user_profile['goal']} (bulk/cut)
        - Workout: {user_profile['workout_today']}
        
        DAILY TARGETS:
        - Calories: {target_macros['calories']}
        - Protein: {target_macros['protein']}g
        - Carbs: {target_macros['carbs']}g
        - Fats: {target_macros['fats']}g
        
        CURRENT INTAKE (eaten so far):
        - Calories: {current_intake['calories']}
        - Protein: {current_intake['protein']}g
        - Carbs: {current_intake['carbs']}g
        - Fats: {current_intake['fats']}g
        
        TODAY'S AVAILABLE MENU:
        {json.dumps(menu_items, indent=2)}
        
        TASK:
        1. Analyze the available menu items
        2. Create 3 meal recommendations that:
           - Fit within daily macro targets
           - Consider the user's goal (bulk = high calories/protein, cut = high protein, low carbs)
           - Account for what they've already eaten
           - Are appropriate for their workout today
        3. For each recommendation, specify:
           - Which items to eat
           - Portion sizes
           - Total macros (calories, protein, carbs, fats)
           - Why this combination is optimal
        4. Provide 2-3 alternative food swaps if they don't like something
        
        Format response as JSON with this structure:
        {{
            "recommendations": [
                {{
                    "name": "Recommendation 1",
                    "description": "Best for muscle gain",
                    "items": ["item1 - quantity", "item2 - quantity"],
                    "total_macros": {{"calories": 950, "protein": 52, "carbs": 98, "fats": 31}},
                    "reasoning": "Why this is optimal"
                }}
            ],
            "alternatives": ["Alternative 1", "Alternative 2"],
            "motivation": "Motivational message about today's workout"
        }}
        """
        
        # Call Gemini API
        response = self.model.generate_content(prompt)
        
        try:
            # Parse JSON response
            response_text = response.text
            # Find JSON in response
            import re
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            else:
                return {"error": "Could not parse recommendations", "raw": response_text}
        except json.JSONDecodeError:
            return {"error": "Invalid JSON response", "raw": response.text}
    
    def get_nutrition_guidance(self, user_profile, daily_target, current_intake):
        """
        Get personalized nutrition guidance from Gemini
        """
        
        remaining_protein = daily_target['protein'] - current_intake['protein']
        remaining_calories = daily_target['calories'] - current_intake['calories']
        
        prompt = f"""
        As a fitness coach, provide personalized nutrition guidance.
        
        User: {user_profile['goal'].upper()} phase
        Workout today: {user_profile['workout_today']}
        
        Daily target: {daily_target['protein']}g protein, {daily_target['calories']} calories
        Current intake: {current_intake['protein']}g protein, {current_intake['calories']} calories
        Remaining: {remaining_protein}g protein, {remaining_calories} calories
        
        Provide:
        1. A motivational message about today's progress
        2. Specific recommendations for the next meal
        3. Tips to hit remaining targets
        4. If targets already met: Congratulations message
        
        Keep response concise and actionable.
        """
        
        response = self.model.generate_content(prompt)
        return response.text
    
    def get_workout_motivation(self, workout_day, user_goal):
        """
        Get personalized workout motivation
        """
        
        prompt = f"""
        Give a SHORT, POWERFUL motivational message (2-3 sentences) for someone:
        - Doing: {workout_day.upper()} day
        - Goal: {user_goal.upper()}
        
        Make it energetic and action-focused!
        """
        
        response = self.model.generate_content(prompt)
        return response.text
