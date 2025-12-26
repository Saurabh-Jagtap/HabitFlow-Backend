import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Habit } from "../models/habit.models.js";
import { HabitLog } from "../models/habitLog.models.js";

const upsertHabitLog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;

    if (!id) {
        throw new ApiError(400, "Habit ID is required");
    }

    if (typeof completed !== "boolean") {
        throw new ApiError(400, "Completed must be a boolean value");
    }

    const habit = await Habit.findById(id);

    if (!habit || habit.isArchived) {
        throw new ApiError(404, "Habit not found");
    }

    if (habit.userId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to access this habit");
    }

    // Normalize date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const habitLog = await HabitLog.findOneAndUpdate(
        { habitId: habit._id, date: today },
        { $set: { completed, userId: req.user._id } },
        { new: true, upsert: true }
    )

    return res.status(200)
        .json(new ApiResponse(
            200,
            habitLog,
            "Habit Log updated Successfully!"
        ))

})

const getHabitLogs = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Habit ID is required");
    }

    const habit = await Habit.findById(id);

    if (!habit || habit.isArchived) {
        throw new ApiError(404, "Habit not found");
    }

    if (habit.userId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to access this habit");
    }

    const habitLogs = await HabitLog.find({ habitId: habit._id }).sort({ date: 1 });

    return res.status(200)
        .json(new ApiResponse(
            200,
            { "HabitId": habit._id, "logs": habitLogs },
            "HabitLogs fetched Successfully!"
        ))
})

export {
    upsertHabitLog,
    getHabitLogs
}