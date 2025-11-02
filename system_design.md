SYSTEM DESIGN - Mess Meal Planner AI Agent
Project Overview
An AI-powered meal planning application designed for IIT Roorkee students to scan mess menus, track nutrition, and receive personalized meal recommendations based on fitness goals (bulk/cut).​

1. Architecture Overview
Architecture Pattern
Frontend: Next.js (React) - Server-Side Rendering + Client Components

Backend: Next.js API Routes + Google Gemini API

Storage: Browser LocalStorage (no database)

AI/ML: Google Gemini API for OCR, nutrition extraction, and recommendations

Deployment: Vercel (frontend), Edge Functions (API routes)

High-Level Architecture Diagram
text
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Next.js Frontend (React Components)           │   │
│  │  - Calendar View  - Profile Setup  - Menu Scanner    │   │
│  │  - Recommendations  - Progress Tracking              │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER (Next.js)                     │
│  ┌──────────────┬──────────────┬──────────────────────┐    │
│  │ /api/scan    │ /api/profile │ /api/recommendations │    │
│  │              │              │                      │    │
│  └──────────────┴──────────────┴──────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    AI/PROCESSING LAYER                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Google Gemini API Integration              │   │
│  │  - Image OCR  - Nutrition Extraction  - RAG System  │   │
│  │  - Meal Recommendations  - Goal-based Planning      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      STORAGE LAYER                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Browser LocalStorage (Client-side)         │   │
│  │  - savedMenus  - userProfile  - dailyTargets        │   │
│  │  - currentIntake  - mealHistory                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
2. System Components
2.1 Frontend Components
Component	Path	Purpose
Home Page	/app/page.js	Landing page with quick actions
Menu Scanner	/app/scan-menu/page.js	Upload & scan mess menu images
Calendar View	/app/calendar/page.js	View menus by date, track meals
Profile Setup	/app/profile/page.js	User fitness goals, dietary preferences
Recommendations	/app/recommendations/page.js	AI-powered meal suggestions
Settings	/app/settings/page.js	Data management, reset storage
2.2 Backend API Routes
Endpoint	Method	Purpose
/api/scan	POST	OCR + nutrition extraction from menu images
/api/profile	GET/POST	User profile management
/api/recommendations	POST	Generate personalized meal combos
/api/targets	POST	Calculate daily macro targets
2.3 AI/ML Components
Google Gemini API Integration:​

OCR Processing: Extract text from mess menu images

Nutrition Analysis: Parse menu items and estimate macros

RAG System: Retrieval-Augmented Generation for context-aware recommendations

Goal-based Planning: Bulk/cut meal optimization

3. Data Models
3.1 User Profile
json
{
  "name": "string",
  "age": "number",
  "gender": "string",
  "height": "number",
  "weight": "number",
  "goal": "bulk | cut | maintain",
  "activityLevel": "string",
  "dietaryRestrictions": ["vegetarian", "vegan", "etc"]
}
3.2 Menu Data
json
{
  "date": "YYYY-MM-DD",
  "meals": {
    "Breakfast": {
      "Item Name": {
        "protein": "number",
        "carbs": "number",
        "fats": "number",
        "calories": "number"
      }
    },
    "Lunch": { /* ... */ },
    "Dinner": { /* ... */ }
  },
  "menu_nutrition": { /* flattened nutrition data */ }
}
3.3 Daily Targets
json
{
  "calories": "number",
  "protein": "number",
  "carbs": "number",
  "fats": "number"
}
3.4 Recommendations Response
json
{
  "status": "success",
  "recommendations": {
    "motivation": "string",
    "recommendations": [
      {
        "name": "string",
        "description": "string",
        "items": ["item1", "item2"],
        "total_macros": {
          "calories": "number",
          "protein": "number",
          "carbs": "number",
          "fats": "number"
        },
        "reasoning": "string"
      }
    ],
    "alternatives": ["alternative1", "alternative2"]
  }
}
4. Core Workflows
4.1 Menu Upload & Processing Flow
text
User uploads image → /api/scan endpoint → 
Google Gemini OCR → Extract menu items → 
Parse nutrition data → Store in localStorage → 
Display in calendar
4.2 Profile Setup Flow
text
User fills profile form → Calculate BMR/TDEE → 
Determine macro targets based on goal → 
Store profile + targets → Enable recommendations
4.3 Recommendation Generation Flow
text
User selects date + meal type → 
Fetch menu items → Load user profile + targets → 
/api/recommendations with context → 
Gemini generates optimal combos → 
Display top 3 recommendations
4.4 Meal Logging Flow
text
User selects recommended meal → 
Update currentIntake → Save to mealHistory → 
Update progress bars → Persist to localStorage
5. Technology Stack
Frontend
Framework: Next.js 14 (App Router)

UI Library: React 18

Styling: Tailwind CSS

Icons: Lucide React

Calendar: react-calendar

Date Utils: date-fns

Backend
Runtime: Node.js (Next.js API Routes)

AI Integration: Google Gemini API

Image Processing: Base64 encoding for image upload

Storage
Client Storage: Browser LocalStorage (5-10MB limit)

Session Management: Client-side state management

Deployment
Hosting: Vercel

Edge Functions: Next.js API Routes on Edge Runtime

CDN: Vercel CDN for static assets

6. Key Features
6.1 Core Features
✅ Menu image scanning with OCR​
✅ Automatic nutrition extraction
✅ Calendar-based menu management
✅ User profile with fitness goals
✅ Daily macro target calculation
✅ AI-powered meal recommendations
✅ Progress tracking (protein/carbs/fats)
✅ Meal history logging

6.2 Advanced Features
🔄 RAG-based context-aware recommendations​
🔄 Multi-meal combination optimization
🔄 Goal-specific meal planning (bulk/cut)
🔄 Dietary restriction filtering
🔄 Weekly meal planning

7. Security & Privacy
Data Privacy
No server-side storage: All data stored locally in browser

No user authentication: Privacy-first approach

API key security: Gemini API key in environment variables

Data Protection
Client-side encryption (optional future enhancement)

HTTPS-only communication

No third-party tracking

8. Scalability Considerations
Current Limitations
LocalStorage 5-10MB limit (~50-100 menus)

No multi-device sync

Client-side processing overhead

Future Enhancements
Database Migration: MongoDB/PostgreSQL for persistent storage

User Authentication: Firebase Auth or NextAuth.js

Cloud Storage: AWS S3 for menu images

Caching: Redis for API response caching

Real-time Sync: WebSocket for multi-device support

9. Error Handling
Frontend
Try-catch blocks for all API calls

User-friendly error messages

Fallback UI states (loading, error, empty)

Backend
API rate limiting (Gemini API quota)

Image size validation (max 5MB)

Input sanitization

Graceful degradation for AI failures

10. Performance Optimization
Frontend
Code splitting with Next.js dynamic imports

Image optimization with Next/Image

Lazy loading for heavy components

Debouncing for search/filter operations

Backend
Gemini API request optimization

Response caching (future)

Parallel processing for batch operations

11. Testing Strategy
Unit Tests
Component rendering tests

Utility function tests

Data transformation tests

Integration Tests
API endpoint testing

LocalStorage operations

End-to-end user flows

Manual Testing
Cross-browser compatibility

Mobile responsiveness

Edge cases (empty data, large datasets)

12. Deployment Architecture
text
GitHub Repository → Vercel CI/CD Pipeline → 
Build Next.js App → Deploy to Vercel Edge → 
Serve via CDN
Environment Variables
text
GEMINI_API_KEY=your_api_key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
13. Future Roadmap
Phase 1 (Current)
✅ Menu scanning & storage
✅ Profile setup
✅ Basic recommendations

Phase 2 (Next 3 months)
🔄 Database integration (MongoDB)
🔄 User authentication
🔄 Multi-device sync

Phase 3 (Next 6 months)
🔄 Social features (meal sharing)
🔄 Fitness app integration (Google Fit, Apple Health)
🔄 Recipe suggestions
🔄 Grocery list generation

14. Monitoring & Analytics
Performance Monitoring
Vercel Analytics for page load times

API response time tracking

Error rate monitoring

User Analytics (Future)
Usage patterns

Feature adoption rates

Conversion funnels

15. File Structure
text
mess-meal-planner-frontend/
├── app/
│   ├── page.js                 # Home page
│   ├── scan-menu/page.js       # Menu scanner
│   ├── calendar/page.js        # Calendar view
│   ├── profile/page.js         # Profile setup
│   ├── recommendations/page.js # AI recommendations
│   ├── settings/page.js        # Settings & reset
│   └── api/
│       ├── scan/route.js       # OCR API
│       ├── recommendations/route.js
│       └── profile/route.js
├── lib/
│   ├── api.js                  # API utility functions
│   ├── storage.js              # LocalStorage utilities
│   └── gemini.js               # Gemini API integration
├── components/
│   ├── Navigation.js
│   ├── MenuCard.js
│   └── ProgressBar.js
├── public/
│   └── images/
└── package.json
16. Contact & Support
Developer: IIT Roorkee Student (3rd Year Metallurgy)​
Tech Stack: Next.js, React, Google Gemini API
Repository: [Your GitHub Link]
Demo: [Your Vercel URL]