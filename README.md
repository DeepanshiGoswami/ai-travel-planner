# ✈️ AI Travel Planner

An AI-powered full-stack travel planning application that generates personalized travel itineraries, estimates trip budgets, recommends hotels, and provides destination insights using **Groq AI (Llama 3.3 70B)**.


---

## 📖 Overview

AI Travel Planner helps users create complete travel plans in seconds. Users can register, create trips, generate AI-powered itineraries, estimate budgets, explore hotel recommendations, and manage their travel plans from a modern dashboard.

---

## ✨ Features

### 🔐 Authentication
- User Registration
- Secure Login
- JWT Authentication
- Protected Routes

### 🤖 AI Travel Planner
- Generate unique travel itineraries
- Supports any destination worldwide
- Day-wise planning
- Personalized recommendations

### 💰 Budget Estimation
- Flight estimate
- Hotel estimate
- Food expenses
- Local transportation
- Activities cost
- Total trip budget

### 🏨 Hotel Recommendations
- Budget hotels
- Mid-range hotels
- Luxury hotels
- AI-based recommendations

### 🌍 Travel Insights
- Local customs
- Famous food
- Hidden gems
- Safety tips
- Best places to visit

### 💱 Currency Converter
Supports multiple currencies:

- INR
- USD
- EUR
- GBP
- JPY
- AUD
- AED

### ✏️ Trip Management
- Create trips
- View trips
- Delete trips
- Edit itinerary
- Add activities
- Remove activities
- Regenerate activities

### 📱 Responsive Design
- Desktop
- Tablet
- Mobile

---

# 🛠 Tech Stack

## Frontend

- Next.js 14
- React
- Tailwind CSS
- Axios

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

## Authentication

- JWT
- bcryptjs

## AI

- Groq API
- Llama 3.3 70B Versatile

## Security

- Helmet
- CORS
- Rate Limiting
- Express Validator

---

# 📂 Project Structure

```
ai-travel-planner
│
├── backend
│   ├── config
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── server.js
│   └── package.json
│
├── frontend
│   ├── app
│   ├── components
│   ├── contexts
│   ├── lib
│   ├── public
│   └── package.json
│
├── README.md
└── .gitignore
```

---

# ⚙️ Installation

## 1. Clone Repository

```bash
git clone https://github.com/DeepanshiGoswami/ai-travel-planner.git

cd ai-travel-planner
```

---

## 2. Install Backend

```bash
cd backend

npm install
```

---

## 3. Install Frontend

```bash
cd ../frontend

npm install
```

---

# 🔑 Environment Variables

## Backend (.env)

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

GROQ_API_KEY=your_groq_api_key

FRONTEND_URL=http://localhost:3000

NODE_ENV=development
```

---

## Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

# ▶️ Run Project

## Backend

```bash
cd backend

npm run dev
```

---

## Frontend

```bash
cd frontend

npm run dev
```

---

Open

```
http://localhost:3000
```

---

# 🚀 API Endpoints

## Authentication

| Method | Endpoint |
|----------|-------------------------|
| POST | /api/auth/register |
| POST | /api/auth/login |
| GET | /api/auth/me |

---

## Trips

| Method | Endpoint |
|----------|----------------|
| GET | /api/trips |
| POST | /api/trips |
| GET | /api/trips/:id |
| DELETE | /api/trips/:id |

---

## AI Itinerary

| Method | Endpoint |
|----------|--------------------------------|
| POST | /api/itinerary/:tripId/generate |
| POST | /api/itinerary/:tripId/day/:day/activity |
| DELETE | /api/itinerary/:tripId/day/:day/activity/:index |

---

## Hotels

| Method | Endpoint |
|----------|-------------------------|
| GET | /api/hotels/:tripId |
| GET | /api/hotels/:tripId/insights |

---

# 📸 Screenshots

## Landing Page

- Modern Hero Section
- Featured Destinations
- Quick Trip Planning

---

## Dashboard

- User Trips
- Destination Cards
- Trip Management

---

## Trip Details

- AI Generated Itinerary
- Budget Breakdown
- Currency Converter
- Hotel Recommendations
- Travel Insights

---

# 🔒 Security

- JWT Authentication
- Password Hashing
- Protected APIs
- Input Validation
- Helmet Security
- Rate Limiting
- CORS Protection

---

# 🎯 Future Improvements

- PDF Export
- Flight Booking Integration
- Weather Forecast
- Google Maps Integration
- Trip Sharing
- Email Itinerary
- Multi-language Support
- PWA Support

---

# 👨‍💻 Author

**Deepanshi Goswami**

GitHub

https://github.com/DeepanshiGoswami

LinkedIn

https://www.linkedin.com/in/deepanshi-goswami-35994724a

---

# 📄 License

This project is licensed under the MIT License.

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.
