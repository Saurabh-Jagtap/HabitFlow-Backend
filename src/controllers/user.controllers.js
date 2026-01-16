import { Habit } from "../models/habit.models.js";
import { HabitLog } from "../models/habitLog.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadonCloudinary from "../utils/Cloudinary.js";
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken'
import crypto from "crypto"
import { sendEmail } from "../utils/sendEmail.js";
import { isEmailValid } from "../utils/emailValidation.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        console.log(error)
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation
    // check if user already exists
    // check for avatar image
    // upload them to cloudinary
    // create user in db - user object
    // Remove password and refreshToken from res
    // check for user creation
    // return res - user registered

    const { username, email, password, fullname } = req.body

    if (
        [username, email, password, fullname].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    if (!isEmailValid(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email format"
        });
    }

    const existedUser = await User.findOne({ email })

    if (existedUser) {
        throw new ApiError(409, "User already exists!")
    }

    let avatarLocalFilePath;

    if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
        avatarLocalFilePath = req.files.avatar[0].path
    }
    const avatar = await uploadonCloudinary(avatarLocalFilePath)

    const user = await User.create({
        username,
        email,
        password,
        fullname,
        avatar: avatar ? avatar.secure_url : null
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating the user")
    }

    return res.
        status(200)
        .json(new ApiResponse(200, createdUser, "User Registered Successfully!"))

})

const loginUser = asyncHandler(async (req, res) => {
    // user details from frontend - email and password
    // check if user exists - if not return error
    // check password
    // generate refreshToken and accessToken
    // store refreshToken in db
    // send cookie

    const { email, password } = req.body

    if (!(email && password)) {
        throw new ApiError(401, "email and password is required")
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(404, "User doesn't exist!")
    }

    const verifyPassword = await user.isPasswordCorrect(password)

    if (!verifyPassword) {
        throw new ApiError(401, "Incorrect Password")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged In Successfully!"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {

    const incomingRefreshToken = req.cookies.refreshToken

    if (incomingRefreshToken) {
        try {
            const decoded = jwt.sign(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
            await User.findByIdAndUpdate(decoded._id,
                { $unset: { refreshToken: 1 } },
                { new: true }
            )
        } catch (error) {
            console.log(error)
        }
    }

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    res.status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token")
        }

        // Checking the refresh token received from user with the refresh token stored in database user.
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh Token is expired or used")
        }

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        };

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user?._id)

        return res.status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", newRefreshToken, cookieOptions)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh Token")
    }

})

const userDetails = asyncHandler(async (req, res) => {

    if (!req.user) {
        throw new ApiError(401, "Unauthorized")
    }

    return res.status(200).json(
        new ApiResponse(200, req.user, "User fetched successfully")
    );

})

const updateProfile = asyncHandler(async (req, res) => {
    const { fullname, username } = req.body;
    const userId = req.user._id;

    if (!fullname && !username) {
        throw new ApiError(400, "No fields provided for update")
    }

    if (fullname !== undefined && fullname.trim() === "") {
        throw new ApiError(400, "fullname cannot be empty")
    }

    if (username !== undefined && username.trim() === "") {
        throw new ApiError(400, "Username cannot be empty")
    }

    let updatefields = {}

    if (fullname !== undefined) {
        updatefields.fullname = fullname.trim()
    }

    if (username !== undefined) {
        updatefields.username = username.trim()
    }

    const updatedUser = await User.findByIdAndUpdate(
        { _id: userId },
        { $set: updatefields },
        { new: true }
    ).select("-password -refreshToken")

    if (!updatedUser) {
        throw new ApiError(404, "User not found")
    }

    res.status(200)
        .json(new ApiResponse(
            200,
            updatedUser,
            "Profile updated Successfully"
        ))
})

const updateAvatar = asyncHandler(async (req, res) => {
    // file comes from req.file
    // user comes from req.user
    // Old avatar file must be deleted before updating
    // after upload cloudinary returns img url

    if (!req.file) {
        throw new ApiError(400, "Avatar file is required")
    }

    const user = req.user

    // Delete old avatar if exists
    if (user.avatar) {
        const publicId = user.avatar.split("/").slice(-2).join("/").split(".")[0];
        await cloudinary.uploader.destroy(publicId);
    }

    // Upload new avatar after deletion
    const updatedAvatar = await uploadonCloudinary(req.file.path)

    if (!updateAvatar) {
        throw new ApiError(500, "Avatar upload failed")
    }

    user.avatar = updatedAvatar.secure_url
    await user.save({ validateBeforeSave: false })

    return res.status(200)
        .json(new ApiResponse(200,
            user,
            "Avatar updated Successfully")
        )
})

const removeAvatar = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user.avatar) {
        throw new ApiError(400, "No avatar to remove")
    }

    const publicId = user.avatar.split("/").slice(-2).join("/").split(".")[0];
    await cloudinary.uploader.destroy(publicId);

    user.avatar = null;
    await user.save({ validateBeforeSave: false });

    return res.status(200)
        .json(new ApiResponse(
            200,
            user,
            "Avatar removed successfully"
        ))
})

const updatePassword = asyncHandler(async (req, res) => {
    // Input currentPassword and newPassword
    // Return if currentPassword and newPassword are missing or both are same
    // fetch user from verifyJWT
    // compare currentPassword with the password in user db
    // store newPassword with hash
    // Set refreshToken as null
    // Return success message and clearCookies - accessToken and refreshToken

    const { currentPassword, newPassword } = req.body;

    if (!(currentPassword && newPassword)) {
        throw new ApiError(400, "Both current and new password are required")
    }

    if (currentPassword === newPassword) {
        throw new ApiError(400, "New Password must be different from current password")
    }

    const user = await User.findById(req.user._id).select("+password")

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const isMatch = await user.isPasswordCorrect(currentPassword)

    if (!isMatch) {
        throw new ApiError(400, "Current password is incorrect")
    }

    user.password = newPassword
    user.refreshToken = null
    await user.save()

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };


    return res.status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(
            200,
            "Password updated Successfully. Log in again"
        ))

})

const deleteUser = asyncHandler(async (req, res) => {

    if (!req.user || !req.user._id) {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        await Habit.deleteMany({ userId: req.user._id })
        await HabitLog.deleteMany({ userId: req.user._id })
        await User.deleteOne({ _id: req.user._id })
    } catch (error) {
        throw new ApiError(500, "Failed to delete completely")
    }

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    return res.status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(
            200,
            null,
            "Account deleted successfully"
        ))
})

const forgotPassword = asyncHandler(async (req, res) => {
    // ********* Purpose **********
    // - Generate Token
    // - Send Email

    // ********* Logic Flow **********
    // Input email
    // Validate email exists in body
    // Find User by email
    // If not found - return 200 ok [Imp - For security purpose]
    // If user found - 
    // Then generate reset-Token
    // Hash it and store the token and expiry in db
    // Send email with raw token
    // Return generic success message

    const { email } = req.body;

    if (!email || email.trim() === "") {
        throw new ApiError(400, "Email is required")
    }

    const user = await User.findOne({ email })

    if (!user) {
        return res.status(200).json(new ApiResponse(200, {}, "Success"))
    }

    const resetToken = crypto.randomBytes(16).toString('hex')

    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    console.log(
        `Reset link: ${process.env.FRONTEND_URL}/reset-password/${resetToken}`
    );

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000;
    await user.save({ validateBeforeSave: false })

    const resetUrl = `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`;

    sendEmail({
        to: user.email,
        subject: "Reset your HabitFlow password",
        text: resetUrl,
    })
        .catch(async (error) => {
            // CODE RUNS IF EMAIL FAILS
            console.error("Background Email Error:", error.message);

            // Perform the Rollback asynchronously
            try {
                user.passwordResetToken = null;
                user.passwordResetExpires = null;
                await user.save({ validateBeforeSave: false });
                console.log("Rollback successful: Token cleared.");
            } catch (dbError) {
                console.error("Rollback failed:", dbError);
            }
        });

    return res.status(200).
        json(new ApiResponse(
            200,
            {},
            "Success"
        ))

})

const resetPassword = asyncHandler(async (req, res) => {
    // ********* Purpose **********
    // Validate Token
    // Set new password

    // ********* Logic Flow **********
    // Input new Password from req.body
    // Input Token from URL params
    // Find user:
    // incomingToken = db reset-Token
    // incomingToken expiry < db reset-Token expiry
    // If no user found - Invalid or expired Token
    // If user found - 
    // Set new password
    // clear reset-token fields
    // clear refreshToken
    // Return success
    // User must log in again with new password now.

    const { newPassword } = req.body;
    const { token } = req.params;

    if (!token || !newPassword || newPassword.trim().length < 6) {
        throw new ApiError(400, "Invalid token or password")
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: new Date() } })

    if (!user) {
        throw new ApiError(400, "Invalid or expired Token")
    }

    user.password = newPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    user.refreshToken = null;
    await user.save({ validateBeforeSave: false })

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    return res.status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(
            200,
            {},
            "Success"
        ))

})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    userDetails,
    updateProfile,
    updateAvatar,
    removeAvatar,
    updatePassword,
    deleteUser,
    forgotPassword,
    resetPassword
}