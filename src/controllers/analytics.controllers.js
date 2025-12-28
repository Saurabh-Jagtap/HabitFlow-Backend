import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Habit } from "../models/habit.models.js";
import { HabitLog } from "../models/habitLog.models.js";
import { calculateCurrentStreak } from "../utils/streak.utils.js";
import { calculateLongestStreak } from "../utils/longestStreak.utils.js";


const getHabitAnalytics = asyncHandler(async (req, res) => {
    // perform ownership checks

    // fetch habitLogs

    // call helpers

    // compute totalCompletions

    // return structured response

    const { habitid } = req.params;

    if (!habitid) {
        throw new ApiError(400, "Habit ID is required");
    }

    const habit = await Habit.findById(habitid);

    if (!habit || habit.isArchived) {
        throw new ApiError(404, "Habit not found");
    }

    if (habit.userId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to access this habit");
    }

    const habitLogs = await HabitLog.find({ habitId: habit._id }).sort({ date: 1 });

    const currentStreak = calculateCurrentStreak(habitLogs)

    const longestStreak = calculateLongestStreak(habitLogs)

    let totalCompletions = 0

    for (const log of habitLogs) {
        if (log.completed === true) {
            totalCompletions++
        }
    }

    let completionRate = 0;
    let totalLogs = habitLogs.length;

    if (totalLogs === 0) {
        completionRate = 0;
    } else {
        completionRate = totalCompletions / totalLogs;
    }

    return res.status(200)
        .json(new ApiResponse(
            200,
            { "currentStreak": currentStreak, "longestStreak": longestStreak, "totalCompletions": totalCompletions, "completionRate": completionRate },
            "Analytics fetched Successfully"
        ))

})

export {
    getHabitAnalytics
}