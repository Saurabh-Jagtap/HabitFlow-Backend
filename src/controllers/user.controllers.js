import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler( async (req, res)=>{
    // get user details from frontend
    // validation
    // check if user already exists
    // check for avatar image
    // upload them to cloudinary
    // create user in db - user object
    // Remove password and refreshToken from res
    // check for user creation
    // return res - user registered

    const {username, email, password} = req.body

    if (
        [username, email, password].some((field)=>field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({email})

    if (!existedUser) {
        throw new ApiError(409, "User already exists!") 
    }

    const avatarLocalPath = req.files?.['avatar'][0]?.path

    
})

export {
    registerUser
}