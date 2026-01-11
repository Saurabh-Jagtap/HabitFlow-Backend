import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { deleteUser, forgotPassword, loginUser, logoutUser, refreshAccessToken, registerUser, removeAvatar, resetPassword, updateAvatar, updatePassword, updateProfile, userDetails } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router()

router.route('/register').post(
    upload.fields(
        [{ name: 'avatar', maxCount: 1 }]
    ),
    registerUser
)

router.route('/login').post(loginUser)
router.route('/logout').post(logoutUser)
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password/:token').post(resetPassword)

// secured routes
router.route('/me').get(verifyJWT, userDetails)
router.route('/settings').patch(verifyJWT, updateProfile)
router.route('/password').patch(verifyJWT, updatePassword)
router.route('/').delete(verifyJWT, deleteUser)
router.route('/refresh-token').post(refreshAccessToken)

// Avatar route
router.route('/avatar')
    .patch(verifyJWT, upload.single("avatar"), updateAvatar)
    .delete(verifyJWT, removeAvatar)


export default router;