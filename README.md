# HabitFlow Backend API 🚀

The robust server-side application powering **HabitFlow**, a full-stack habit tracking platform. Built with Node.js and Express, focused on security, scalability, and performance.

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
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# EmailJS Configuration
EMAILJS_SERVICE_ID=your_service_id
```

🚀 Getting Started
1. Clone the repository:
git clone [https://github.com/your-username/HabitFlow-Backend.git](https://github.com/your-username/HabitFlow-Backend.git)
cd HabitFlow-Backend

2. Install dependencies:
   npm install

3. Run the server:
# Development mode
npm run dev

# Production mode
npm run start

📡 API Endpoints (Brief)

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | /api/v1/user/register | Create a new user account |
| POST | /api/v1/user/login | Login and receive JWT |
| POST | /api/v1/user/forgot-password | Trigger reset password email (Rate Limited) |
| PATCH | /api/v1/user/reset-password/:token | Set new password |
| GET | /api/v1/habits | Fetch all user habits (Protected) |

🔗 Deployment
Deployed live on Render: `https://habitflow-backend-gf9f.onrender.com`

