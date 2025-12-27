import { Habit } from "../models/habit.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// For each action:

// What input does it need? -> title, optional [description, category]
// What validations should happen? -> title is mandatory, rest all fields if present then include else fill empty string ""
// What should be returned? -> return habit object, habit created successfully!
// What errors can occur? -> Dont know as of now

// Actions to plan:

// Create habit -> Create habit function [createHabit]
// Get all habits for logged-in user  [getUserHabits]
// Get single habit by id  [getHabitById]
// Update habit  [updateHabit]
// Archive habit (soft delete)  [archiveHabit]

const createHabit = asyncHandler(async (req, res) => {
    const { title, description, category } = req.body

    if (!title) {
        throw new ApiError(400, "title is required")
    }

    const userHabit = await Habit.create({
        userId: req.user._id,
        title,
        description: description || "",
        category: category || ""
    })

    if (!userHabit) {
        throw new ApiError(500, "Something went wrong while creating the habit")
    }

    return res
        .status(201)
        .json(new ApiResponse(
            201,
            userHabit,
            "Habit created Successfully!"
        ))
})

const getUserHabits = asyncHandler(async (req, res) => {
    const Habits = await Habit.find({
        userId: req.user._id,
        isArchived: false
    })

    return res.status(200).json(new ApiResponse(200, Habits, "Habits retrieved  Successfully"))
})

const getHabitById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Habit ID is required");
    }

    const habit = await Habit.findById(id).populate("userId", "avatar");

    if (!habit || habit.isArchived) {
        throw new ApiError(404, "Habit not found");
    }

    const habitOwnerId = habit.userId._id ? habit.userId._id.toString() : habit.userId.toString()

    if (habitOwnerId !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to access this habit");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, habit, "Habit retrieved successfully"));
})

const updateHabit = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { title, description, category } = req.body

    if (!title && !description && !category) {
        throw new ApiError(400, "At least one field must be provided for update")
    }

    const habit = await Habit.findById(id)

    if (!habit || habit.isArchived) {
        throw new ApiError(400, "Habit not found")
    }

    if (req.user._id.toString() !== habit.userId.toString()) {
        throw new ApiError(403, "You are not allowed to update this habit")
    }

    if (title !== undefined) {
        habit.title = title
    }

    if (description !== undefined) {
        habit.description = description
    }

    if (category !== undefined) {
        habit.category = category
    }

    await habit.save()

    res.status(200)
        .json(new ApiResponse(
            200,
            habit,
            "Habit Details updated successfully"
        ))
})

const archiveHabit = asyncHandler(async (req, res) => {
    const { id } = req.params

    const habit = await Habit.findById(id)

    if (!habit || habit.isArchived) {
        throw new ApiError(400, "Habit not found")
    }

    if (habit.userId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to update this habit")
    }

    habit.isArchived = true
    await habit.save()

    return res.status(200)
        .json(new ApiResponse(
            200,
            habit,
            "Habit archived Successfully"
        ))

})

export {
    createHabit,
    getUserHabits,
    getHabitById,
    updateHabit,
    archiveHabit
}