import os
from dotenv import load_dotenv
from core.menu_scanner import MenuScanner
from core.nutrition_rag import NutritionRAG

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

print("="*80)
print("DIRECT TEST - NO FASTAPI")
print("="*80)

# Test 1: Initialize components
print("\n1. Initializing components...")
try:
    menu_scanner = MenuScanner(GOOGLE_API_KEY)
    print("   ✓ MenuScanner initialized")
    
    nutrition_rag = NutritionRAG(GOOGLE_API_KEY)
    print("   ✓ NutritionRAG initialized")
except Exception as e:
    print(f"   ✗ Initialization error: {e}")
    import traceback
    traceback.print_exc()
    exit(1)

# Test 2: Scan a file
print("\n2. Scanning PDF...")
pdf_path = "temp_mess_menu.pdf"  # Use your actual filename

if not os.path.exists(pdf_path):
    print(f"   ✗ File not found: {pdf_path}")
    print("   Please copy your PDF to the backend folder and update the filename above")
    exit(1)

try:
    menu_structure = menu_scanner.scan_menu(pdf_path)
    print(f"   ✓ Scan complete")
    print(f"   Type: {type(menu_structure)}")
    print(f"   Keys: {menu_structure.keys() if isinstance(menu_structure, dict) else 'N/A'}")
except Exception as e:
    print(f"   ✗ Scan error: {e}")
    import traceback
    traceback.print_exc()
    exit(1)

# Test 3: Check the structure
print("\n3. Checking menu structure...")
try:
    menus = menu_structure.get('menus', [])
    print(f"   Number of menus: {len(menus)}")
    
    if len(menus) > 0:
        first_menu = menus[0]
        print(f"   First menu type: {type(first_menu)}")
        print(f"   First menu keys: {first_menu.keys()}")
        
        meals = first_menu.get('meals', {})
        print(f"   Meals type: {type(meals)}")
        print(f"   Meal types: {list(meals.keys())}")
        
        # Get first meal
        first_meal_type = list(meals.keys())[0]
        first_meal_items = meals[first_meal_type]
        
        print(f"\n   First meal: {first_meal_type}")
        print(f"   Items type: {type(first_meal_items)}")
        print(f"   Items: {first_meal_items}")
        
        # THIS IS THE CRITICAL CHECK
        if isinstance(first_meal_items, list):
            print(f"   ✓ Items is a list (correct)")
            if len(first_meal_items) > 0:
                first_item = first_meal_items[0]
                print(f"   First item type: {type(first_item)}")
                print(f"   First item value: {repr(first_item)}")
        elif isinstance(first_meal_items, tuple):
            print(f"   ✗ Items is a TUPLE (this is the problem!)")
        else:
            print(f"   ✗ Items is {type(first_meal_items)} (unexpected)")
            
except Exception as e:
    print(f"   ✗ Structure check error: {e}")
    import traceback
    traceback.print_exc()
    exit(1)

# Test 4: Try nutrition lookup
print("\n4. Testing nutrition lookup...")
try:
    # Test with a simple list
    test_items = ["Poha", "Dal", "Rice"]
    print(f"   Testing with: {test_items}")
    
    result = nutrition_rag.search_multiple_foods(test_items)
    print(f"   ✓ Search successful")
    print(f"   Result keys: {list(result.keys())}")
    
except Exception as e:
    print(f"   ✗ Nutrition lookup error: {e}")
    import traceback
    traceback.print_exc()
    exit(1)

# Test 5: Try with actual menu items
print("\n5. Testing with actual menu items...")
try:
    if len(menus) > 0 and 'meals' in menus[0]:
        first_meal_type = list(menus[0]['meals'].keys())[0]
        actual_items = menus[0]['meals'][first_meal_type]
        
        print(f"   Items to search: {actual_items}")
        print(f"   Items type: {type(actual_items)}")
        
        # Convert to list if needed
        if isinstance(actual_items, tuple):
            print(f"   Converting tuple to list...")
            actual_items = list(actual_items)
        
        result = nutrition_rag.search_multiple_foods(actual_items)
        print(f"   ✓ Search successful")
        print(f"   Found {len(result)} items")
        
except Exception as e:
    print(f"   ✗ Actual items error: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "="*80)
print("TEST COMPLETE")
print("="*80)
