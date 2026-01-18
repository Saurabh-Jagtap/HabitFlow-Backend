# HabitFlow Backend API 🚀

The robust server-side application powering **HabitFlow**, a full-stack habit tracking platform. Built with Node.js and Express, focused on security, scalability, and performance.

> **Looking for the Frontend?** > Check out the [HabitFlow Frontend Repository](https://github.com/Saurabh-Jagtap/HabitFlow-Frontend.git) to see the **User Interface and React code**.

## 🌟 Key Features

* **🔐 Secure Authentication:** Full Signup/Login flow using **JWT** (JSON Web Tokens) and **BCrypt** for password hashing.
* **📧 Resilient Email Service:** Custom implementation of **EmailJS** using an asynchronous "fire-and-forget" architecture to prevent browser timeouts during password resets.
* **🛡️ Advanced Rate Limiting:** Custom middleware configured to handle **Render's Load Balancers** by correctly parsing `X-Forwarded-For` headers to prevent abuse.
* **💾 Data Management:** Scalable schema design using **MongoDB** and Mongoose.
* **🌍 CORS Configured:** Securely whitelisted for frontend communication.

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB
* **Email Service:** EmailJS (REST API)
* **Deployment:** Render

## ⚙️ Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_apikey
CLOUDINARY_API_SECRET=your_apisecret

# JWT Configuration
ACCESS_TOKEN_SECRET=your_accesstoken_secret
ACCESS_TOKEN_EXPIRY=your_accesstoken_expiry
REFRESH_TOKEN_SECRET=your_refreshtoken_secret
REFRESH_TOKEN_EXPIRY=your_refreshtoken_expiry

# EmailJS Configuration
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_emailjs_public_key
EMAILJS_PRIVATE_KEY=your_emailjs_private_key
```

🚀 Getting Started
1. Clone the repository:
git clone [https://github.com/Saurabh-Jagtap/HabitFlow-Backend.git](https://github.com/Saurabh-Jagtap/HabitFlow-Backend.git)
cd HabitFlow-Backend

2. Install dependencies:
   npm install

3. Run the server:
# Development mode
npm run dev

# Production mode
npm run start

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **Auth** | | |
| `POST` | `/api/v1/user/register` | Create a new user account |
| `POST` | `/api/v1/user/login` | Login & receive Access/Refresh Tokens |
| `POST` | `/api/v1/user/forgot-password` | Trigger reset email (Rate Limited) |
| **Habits** | | |
| `GET` | `/api/v1/habits` | Fetch all active habits |
| `POST` | `/api/v1/habits` | Create a new habit |
| `PATCH` | `/api/v1/habits/:id` | Update habit details |
| `POST` | `/api/v1/habits/:id/log` | Mark habit as done (Updates streak) |
| **Analytics** | | |
| `GET` | `/api/v1/analytics/dashboard` | Fetch weekly progress & completion stats |

## 📂 Project Structure

```bash
├── src/
│   ├── index.js            # App Entry Point (Server execution)
│   ├── app.js              # Express App Setup & Middleware config
│   ├── constants.js        # Global Constants (DB Name, Enums)
│   ├── controllers/        # Business Logic & Request Handling
│   │   ├── user/           # Auth & Profile Logic
│   │   ├── habit/          # CRUD Operations for Habits
│   │   ├── habitLog/       # Daily Tracking Logic
│   │   └── analytics/      # Data Aggregation for Dashboards
│   ├── middlewares/        # Custom Interceptors
│   │   ├── auth/           # JWT Verification (Protected Routes)
│   │   ├── multer/         # File Upload Handling
│   │   └── limiter/        # Rate Limiting Configuration
│   ├── models/             # Mongoose Schemas (Data Layer)
│   │   ├── user/
│   │   ├── habit/
│   │   └── habitLog/
│   ├── routes/             # API Endpoint Definitions
│   │   ├── user/
│   │   ├── habit/
│   │   └── analytics/
│   └── utils/              # Helper Functions & Wrappers
│       ├── ApiError.js     # Standardized Error Class
│       ├── ApiResponse.js  # Standardized Success Response
│       ├── asyncHandler.js # Try/Catch Wrapper for Async Ops
│       ├── Cloudinary.js   # Image Upload Service
│       ├── sendEmail.js    # EmailJS Integration
│       └── streak/         # Habit Streak Calculation Logic
├── .env.example            # Environment Variable Template
└── package.json            # Dependencies & Scripts
```

## 🚀 Deployment

The application is deployed on Render and available for public access.

🔗 **Live Link:** [View Live Demo 🚀](https://habitflow-backend-gf9f.onrender.com)
