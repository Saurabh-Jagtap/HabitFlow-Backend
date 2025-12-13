import mongoose, { Schema } from "mongoose";

const habitSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    category: {
        type: String
    },
    isArchived: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

export const Habit = mongoose.model("Habit", habitSchema)