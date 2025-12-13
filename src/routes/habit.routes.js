import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { archiveHabit, createHabit, getHabitById, getUserHabits, updateHabit } from "../controllers/habit.controllers.js";

const router = Router()

// GET /api/habits
// POST /api/habits
// GET /api/habits/:id
// PUT /api/habits/:id
// DELETE /api/habits/:id

// I am confused here what should I name the route in app.js already wrote api/v1/habits, help me out here
router.route('/').get(verifyJWT, getUserHabits)
router.route('/').post(verifyJWT, createHabit)
router.route('/:id').get(verifyJWT, getHabitById)
router.route('/:id').put(verifyJWT, updateHabit)
router.route('/:id').delete(verifyJWT, archiveHabit)

export default router