import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes.js';
import habitRouter from './routes/habit.routes.js'
import habitLogRouter from './routes/habitLog.routes.js'
import analyticsRouter from './routes/analytics.routes.js'

const app = express();

app.set("trust proxy", 1);

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

// Adding this temporarily in app.js
app.use((req, res, next) => {
  console.log("--------------------------------");
  console.log("Request from IP:", req.ip);
  console.log("X-Forwarded-For:", req.headers['x-forwarded-for']);
  console.log("--------------------------------");
  next();
});

// Health check route
app.get("/health", (req, res) => {
    res.status(200).json({ status: "Active", message: "Server is running" });
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cookieParser())

app.use('/api/v1/user', userRouter)
app.use('/api/v1/habits', habitRouter)
app.use('/api/v1', habitLogRouter)
app.use('/api/v1', analyticsRouter)

app.use((err, req, res, next) => {
 
    const statusCode = err.statusCode || 500; 
    
    const message = err.message || "Internal Server Error";
    
    const errors = err.errors || [];

    res.status(statusCode).json({
        success: false,
        message: message, 
        errors: errors,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
});

export default app
