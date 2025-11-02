from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from core.macro_calculator import MacroCalculator
from core.menu_scanner import MenuScanner
from core.nutrition_rag import NutritionRAG
from agents.meal_agent import MealPlanningAgent

# Load environment variables
load_dotenv()

# Initialize FastAPI
app = FastAPI(title="Mess Meal Planner API")

# CORS middleware - allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY not found in .env file")

macro_calc = MacroCalculator()
menu_scanner = MenuScanner(GOOGLE_API_KEY)
nutrition_rag = NutritionRAG(GOOGLE_API_KEY)
meal_agent = MealPlanningAgent(GOOGLE_API_KEY)

# Request Models
class UserProfile(BaseModel):
    age: int
    height: float
    weight: float
    goal: str  # "bulk" or "cut"
    activity_level: str = "moderate"
    workout_today: str = "rest"

class MealRecommendationRequest(BaseModel):
    user_profile: UserProfile
    menu_items: dict
    current_intake: dict
    daily_target: dict

# Response Models
class HealthResponse(BaseModel):
    status: str
    timestamp: str

# API Endpoints

@app.get("/health")
def health_check():
    """Health check endpoint"""
    from datetime import datetime
    return {
        "status": "ok",
        "timestamp": datetime.now().isoformat(),
        "service": "Mess Meal Planner API"
    }

@app.post("/setup-profile")
def setup_profile(profile: UserProfile):
    """
    Calculate TDEE and macro targets based on user profile
    """
    try:
        tdee = macro_calc.calculate_tdee(
            profile.age,
            profile.height,
            profile.weight,
            "male",
            profile.activity_level
        )
        
        macros = macro_calc.calculate_macros(tdee, profile.goal, profile.weight)
        
        return {
            "status": "success",
            "tdee": tdee,
            "daily_targets": macros,
            "goal": profile.goal.upper(),
            "workout_today": profile.workout_today.upper()
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/scan-menu")
async def scan_menu(file: UploadFile = File(...)):
    try:
        # Save file
        file_path = f"temp_{file.filename}"
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        # Scan menu
        menu_structure = menu_scanner.scan_menu(file_path)
        
        # Process menus
        processed_menus = []
        for menu_entry in menu_structure.get('menus', []):
            date = menu_entry.get('date', 'unknown')
            day = menu_entry.get('day', 'Unknown')
            meals = menu_entry.get('meals', {})
            
            # Get nutrition for each meal
            meals_with_nutrition = {}
            for meal_type, items in meals.items():
                meals_with_nutrition[meal_type] = nutrition_rag.search_multiple_foods(items)
            
            processed_menus.append({
                "date": date,
                "day": day,
                "meals": meals_with_nutrition,
                "raw_items": meals
            })
        
        # Clean up
        os.remove(file_path)
        
        return {
            "status": "success",
            "menus": processed_menus,
            "count": len(processed_menus)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/get-recommendations")
def get_recommendations(request: MealRecommendationRequest):
    """
    Get AI-powered meal recommendations using Gemini
    """
    try:
        recommendations = meal_agent.analyze_menu_and_recommend(
            request.menu_items,
            request.user_profile.dict(),
            request.current_intake,
            request.daily_target
        )
        
        return {
            "status": "success",
            "recommendations": recommendations
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/get-guidance")
def get_guidance(request: MealRecommendationRequest):
    """
    Get personalized nutrition guidance
    """
    try:
        guidance = meal_agent.get_nutrition_guidance(
            request.user_profile.dict(),
            request.daily_target,
            request.current_intake
        )
        
        return {
            "status": "success",
            "guidance": guidance
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/workout-motivation/{workout_day}/{goal}")
def get_motivation(workout_day: str, goal: str):
    """
    Get workout motivation message
    """
    try:
        motivation = meal_agent.get_workout_motivation(workout_day, goal)
        
        return {
            "status": "success",
            "motivation": motivation
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/search-food/{food_name}")
def search_food(food_name: str):
    """
    Search for a specific food in the database
    """
    try:
        nutrition = nutrition_rag.search_food(food_name)
        
        if nutrition:
            return {
                "status": "success",
                "found": True,
                "nutrition": nutrition
            }
        else:
            return {
                "status": "success",
                "found": False,
                "message": f"Food '{food_name}' not found in database"
            }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)