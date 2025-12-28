import { Habit } from "../models/habit.models.js"
import { HabitLog } from "../models/habitLog.models.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getDashboardAnalytics = asyncHandler(async (req, res) => {
    // totalHabits
    // completedToday Habits
    // avgCompletion Rate
    // Best Streak Across Habits

    const habits = await Habit.find({userId: req.user._id, isArchived: false})

    const totalHabits = habits.length;

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const habitlog = await HabitLog.find({userId: req.user._id, completed: true, date: today})
    const completedToday = habitlog.length;

    let sumCompletionRate = 0;
    let avgCompletionRate = 0;

    for(let habit of habits){
        let totalCompletions = await HabitLog.find({userId: req.user._id, completed: true, habitId: habit._id}).countDocuments({})
        let totalHabitLogs = await HabitLog.find({userId: req.user._id, habitId: habit._id}).countDocuments({})
        let completionRate = totalCompletions / totalHabitLogs;
        sumCompletionRate += completionRate;
    }

    if(totalHabits === 0){
        avgCompletionRate = 0;
    }else{
        avgCompletionRate = sumCompletionRate / totalHabits;
    }

})

export { getDashboardAnalytics }