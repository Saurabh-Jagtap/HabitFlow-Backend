import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadonCloudinary from "../utils/Cloudinary.js";

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
        [username, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
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
        avatar: avatar?.url || ""
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating the user")
    }

    return res.
        status(200)
        .json(new ApiResponse(200, createdUser, "User Registered Successfully!"))

})

export {
    registerUser
}