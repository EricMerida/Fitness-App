DEMO  https://fitness-app-plum-ten.vercel.app/



IronLog 🏋️‍♂️

IronLog is a full-stack fitness tracking application that allows users to securely register, log in, and manage their workouts and nutrition data.

The application uses JWT authentication and protected routes to ensure secure access to user data.

---

## Tech Stack

### Frontend
- React (Vite)
- JavaScript (ES6+)
- React Router
- Context API (Authentication state)
- Plain CSS
- Fetch/Axios for API requests

### Backend
- Node.js
- Express.js
- MongoDB
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcrypt (password hashing)
- CORS
- dotenv

### Tools
- Git / GitHub
- Postman
- MongoDB Compass
- Nodemon

## Features
- Create an account
- log workouts and add comments to the workout
- Log Nutrition and you can look up meals that you ate and from the USDA the micros will be included
- Set gaols for nutrition
- Track gym progess
- Dashboard that gives you a run down on your activities and nutrition

## 🧱 Architecture

The app follows a **client-server architecture**:

- Frontend communicates with backend via REST API
- Backend handles authentication, data validation, and database operations
- MongoDB stores user, workout, and nutrition data

---

## 🗂 Database Schema

(main/db.schem)

---

## 🔄 User Flow

(main.user.flow

---

## ⚙️ How to Run Locally

### 1. Clone the repo
```bash
git clone https://github.com/EricMerida/Fitness-App
cd ironlog
2. Install dependencies

Frontend:

cd client
npm install
npm run dev

Backend:

cd server
npm install
npm run dev
