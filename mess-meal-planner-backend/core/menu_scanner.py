import google.generativeai as genai
import os
from PIL import Image
import json
import re

class MenuScanner:
    def __init__(self, api_key):
        """Initialize Gemini Vision for text extraction"""
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash-exp')
    
    def clean_json_response(self, text):
        """
        Clean JSON response from Gemini by removing markdown code blocks
        """
        text = text.strip()
        
        # Remove ```
        if text.startswith('```json'):
            text = text[7:]  # Remove first 7 characters
        elif text.startswith('```'):
            text = text[3:]  # Remove first 3 characters
        
        # Remove ``` at the end
        if text.endswith('```'):
            text = text[:-3]  # Remove last 3 characters
        
        # Strip whitespace again
        text = text.strip()
        
        print(f"✓ Cleaned JSON (first 100 chars): {text[:100]}")
        
        return text
    
    def scan_menu(self, file_path):
        """
        Extract menu items from image or PDF using Gemini Vision
        """
        # Get extension correctly (fixed the tuple error)
        file_extension = os.path.splitext(file_path)[1].lower()
        
        if file_extension == '.pdf':
            return self.scan_pdf(file_path)
        else:
            return self.scan_image(file_path)
    
    def scan_image(self, image_path):
        """
        Extract structured menu from image using Gemini Vision
        """
        try:
            image = Image.open(image_path)
            
            prompt = """
            You are a menu parser. Extract the complete menu structure from this image.
            
            IMPORTANT: Extract dates, meal types (Breakfast/Lunch/Dinner/Snacks), and food items.
            
            Return ONLY a valid JSON object in this exact format:
            {
                "menus": [
                    {
                        "date": "2025-11-01",
                        "day": "Friday",
                        "meals": {
                            "Breakfast": ["Poha", "Tea", "Banana"],
                            "Lunch": ["Dal Rice", "Paneer Curry", "Roti", "Curd"],
                            "Dinner": ["Rajma Rice", "Mixed Veg", "Salad"]
                        }
                    }
                ]
            }
            
            Rules:
            1. Extract actual dates if present (format: YYYY-MM-DD)
            2. Extract day names (Monday, Tuesday, etc.) if present
            3. Group items by meal type: Breakfast, Lunch, Dinner, Snacks
            4. Only include actual food items, not prices or descriptions
            5. If no dates visible, use "date": "unknown"
            6. Return ONLY the JSON object, no markdown formatting, no code blocks
            
            Extract from this image:
            """
            
            response = self.model.generate_content([prompt, image])
            text = response.text.strip()
            
            print(f"Raw response (first 200 chars): {text[:200]}")
            
            cleaned_text = self.clean_json_response(text)
            menu_structure = json.loads(cleaned_text)
            
            print(f"✓ Gemini Vision extracted {len(menu_structure.get('menus', []))} menu entries from image")
            return menu_structure
        
        except json.JSONDecodeError as e:
            print(f"❌ Error parsing JSON: {e}")
            print(f"Raw response: {text}")
            return {"menus": []}
        except Exception as e:
            print(f"❌ Error scanning image: {e}")
            import traceback
            traceback.print_exc()
            return {"menus": []}
    
    def scan_pdf(self, pdf_path):
        """
        Extract structured menu from PDF using Gemini
        """
        try:
            print(f"📄 Uploading PDF to Gemini...")
            uploaded_file = genai.upload_file(pdf_path)
            
            import time
            while uploaded_file.state.name == "PROCESSING":
                print("   Waiting for processing...")
                time.sleep(1)
                uploaded_file = genai.get_file(uploaded_file.name)
            
            if uploaded_file.state.name == "FAILED":
                raise Exception("PDF processing failed")
            
            print(f"✓ PDF uploaded successfully")
            
            prompt = """
            You are a menu parser. Extract the complete menu structure from this PDF.
            
            IMPORTANT: Extract dates, meal types (Breakfast/Lunch/Dinner/Snacks), and food items.
            
            Return ONLY a valid JSON object in this exact format:
            {
                "menus": [
                    {
                        "date": "2025-11-01",
                        "day": "Friday",
                        "meals": {
                            "Breakfast": ["Poha", "Tea", "Banana"],
                            "Lunch": ["Dal Rice", "Paneer Curry", "Roti", "Curd"],
                            "Dinner": ["Rajma Rice", "Mixed Veg", "Salad"]
                        }
                    }
                ]
            }
            
            Rules:
            1. Extract actual dates from the PDF (format: YYYY-MM-DD)
            2. Extract day names (Monday, Tuesday, etc.)
            3. Group items by meal type: Breakfast, Lunch, Dinner, Snacks
            4. Only include actual food items, ignore prices/descriptions
            5. If multiple dates present, create separate entries for each
            6. Return ONLY the JSON object, no markdown formatting, no code blocks
            7. Handle both English and Hindi text
            
            Extract from this PDF:
            """
            
            print(f"🤖 Asking Gemini to extract menu...")
            response = self.model.generate_content([uploaded_file, prompt])
            
            text = response.text.strip()
            print(f"Raw response (first 200 chars): {text[:200]}")
            
            cleaned_text = self.clean_json_response(text)
            menu_structure = json.loads(cleaned_text)
            
            genai.delete_file(uploaded_file.name)
            
            print(f"✓ Gemini extracted {len(menu_structure.get('menus', []))} menu entries from PDF")
            return menu_structure
        
        except json.JSONDecodeError as e:
            print(f"❌ Error parsing JSON: {e}")
            print(f"Raw response: {text}")
            return {"menus": []}
        except Exception as e:
            print(f"❌ Error scanning PDF: {e}")
            import traceback
            traceback.print_exc()
            return {"menus": []}
