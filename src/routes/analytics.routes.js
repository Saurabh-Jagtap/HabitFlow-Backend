import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { getHabitAnalytics } from "../controllers/analytics.controllers.js";
import { getDashboardAnalytics } from "../controllers/analytics.dashboard.controllers.js";

const router = Router()

router.route('/analytics/habits/:habitid').get(verifyJWT, getHabitAnalytics)
router.route('/analytics/dashboard').get(verifyJWT, getDashboardAnalytics)

export default router