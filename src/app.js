import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes.js';
import habitRouter from './routes/habit.routes.js'
import habitLogRouter from './routes/habitLog.routes.js'
import analyticsRouter from './routes/analytics.routes.js'

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cookieParser())

app.use('/api/v1/user', userRouter)
app.use('/api/v1/habits', habitRouter)
app.use('/api/v1', habitLogRouter)
app.use('/api/v1', analyticsRouter)

export default app
