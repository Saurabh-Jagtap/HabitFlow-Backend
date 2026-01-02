import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { loginUser, logoutUser, refreshAccessToken, registerUser, userDetails } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router()

router.route('/register').post(
    upload.fields(
        [{ name: 'avatar', maxCount: 1 }]
    ),
    registerUser
)

router.route('/login').post(loginUser)

// secured routes
router.route('/me').get(verifyJWT, userDetails)
router.route('/logout').post(logoutUser)
router.route('/refresh-token').post(refreshAccessToken)

export default router;