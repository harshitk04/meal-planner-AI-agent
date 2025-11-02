text
# 🍽️ Mess Meal Planner AI Agent

> AI-powered meal planning application for IIT Roorkee students to scan mess menus, track nutrition, and receive personalized meal recommendations based on fitness goals.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini-orange?logo=google)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen)]()

---

## 📋 Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Future Roadmap](#future-roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## ✨ Features

### Core Features

- 📸 **Menu Scanning**: Upload and scan mess menu images using OCR
- 🤖 **AI-Powered OCR**: Google Gemini API for accurate text extraction
- 🥗 **Nutrition Analysis**: Automatic macro calculation (protein, carbs, fats)
- 📅 **Calendar Management**: View and manage menus by date
- 👤 **Profile Setup**: Configure fitness goals (bulk/cut/maintain)
- 🎯 **Smart Recommendations**: AI-generated meal combinations based on your goals
- 📊 **Progress Tracking**: Real-time macro progress visualization
- 💾 **Local Storage**: All data saved securely on your device
- ⚙️ **Settings Panel**: Reset data, manage preferences

### Advanced Features

- RAG-based context-aware recommendations
- Multi-meal combination optimization
- Goal-specific meal planning
- Dietary restriction filtering
- Meal history logging
- Daily progress summaries

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Google Gemini API Key** ([Get API Key](https://ai.google.dev/))
- Modern web browser

### Installation

1. **Clone the repository**
git clone https://github.com/yourusername/mess-meal-planner.git
cd mess-meal-planner-frontend

text

2. **Install dependencies**
npm install

or
yarn install

text

3. **Set up environment variables**
cp .env.example .env.local

text

Add your API keys to `.env.local`:
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000

text

4. **Run the development server**
npm run dev

or
yarn dev

text

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📖 Usage

### 1. Set Up Your Profile

- Navigate to **Profile** section
- Enter your fitness details (age, weight, height, goal)
- Choose your goal: **Bulk**, **Cut**, or **Maintain**
- System calculates your daily macro targets

### 2. Upload Mess Menu

- Go to **Scan Menu**
- Upload a clear image of the mess menu
- Wait for AI to extract menu items and nutrition data
- Menu is automatically saved for that date

### 3. View Calendar

- Open **Calendar** to see all saved menus
- Green highlighted dates have menus available
- Click on any date to see detailed menu breakdown
- View items with complete nutritional information

### 4. Get Meal Recommendations

- Visit **Recommendations** page
- Select a date and meal type
- Click "Get AI Recommendations"
- Review 3 personalized meal combinations
- Each combo shows macros and reasoning

### 5. Log Your Meals

- Click "Log This Meal" on any recommendation
- Current intake automatically updates
- Progress bars show how close you are to daily targets
- Meal history is saved for future reference

### 6. Track Progress

- **Today's Progress** section shows real-time macro tracking
- Visual progress bars for each macro
- Percentage of daily target achieved
- Daily targets based on your fitness goals

---

## 🔌 API Endpoints

### `/api/scan` (POST)

Upload and scan a menu image.

**Request:**
{
"image": "base64_encoded_image_data",
"date": "2025-11-03"
}

text

**Response:**
{
"status": "success",
"meals": {
"Breakfast": { "Item": { "protein": 15, "carbs": 45, "fats": 8 } }
}
}

text

### `/api/recommendations` (POST)

Generate meal recommendations.

**Request:**
{
"userProfile": { "goal": "bulk", "activityLevel": "high" },
"menuItems": { "Item1": {...}, "Item2": {...} },
"currentIntake": { "calories": 500, "protein": 30 },
"dailyTargets": { "calories": 2500, "protein": 150 }
}

text

**Response:**
{
"status": "success",
"recommendations": {
"motivation": "You're crushing it!",
"recommendations": [ { "name": "Power Combo", "items": [...] } ]
}
}

text

---

## 📁 Project Structure

mess-meal-planner-frontend/
├── app/
│ ├── page.js # Home page
│ ├── scan-menu/
│ │ └── page.js # Menu scanner
│ ├── calendar/
│ │ └── page.js # Calendar view
│ ├── profile/
│ │ └── page.js # Profile setup
│ ├── recommendations/
│ │ └── page.js # AI recommendations
│ ├── settings/
│ │ └── page.js # Settings & reset
│ ├── api/
│ │ ├── scan/route.js # OCR API
│ │ ├── recommendations/route.js # Recommendations API
│ │ └── profile/route.js # Profile API
│ └── layout.js # Root layout
├── lib/
│ ├── api.js # API utility functions
│ ├── storage.js # LocalStorage utilities
│ └── gemini.js # Gemini API integration
├── components/
│ ├── Navigation.js
│ ├── MenuCard.js
│ └── ProgressBar.js
├── public/
│ └── images/ # Static assets
├── .env.example # Environment template
├── package.json
├── tailwind.config.js
├── next.config.js
└── README.md

text

---

## ⚙️ Configuration

### Environment Variables

Create `.env.local` in the root directory:
