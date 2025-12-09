import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    avatar: {
        type: String   //Cloudinary link
    },
    refreshToken: {
        type: String
    }
}, {
    timestamps: true
})

// Hooks
userSchema.pre('save', async function (next){
    if(!this.isModified("password")) return next()

    this.passwordHash = await bcrypt.hash(this.password, 10)
})

// Custom Methods
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model("User", userSchema)