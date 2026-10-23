import mongoose from 'mongoose';
import asyncHandler from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Habit } from '../models/habit.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// 1. Create a new habit
const createHabit = asyncHandler(async (req, res) => {
  const { title, frequency } = req.body;

  if (!title) {
    throw new ApiError(400, 'Habit title is required');
  }

  const habit = await Habit.create({
    title,
    frequency: frequency || 'Daily',
    user: req.user._id, // Injected by verifyJWT
  });

  return res
    .status(201)
    .json(new ApiResponse(201, habit, 'Habit created successfully'));
});

// 2. Get all habits for the logged-in user
const getHabits = asyncHandler(async (req, res) => {
  const habits = await Habit.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, habits, 'Habits fetched successfully'));
});

// 3. Toggle a habit completion for a specific date
const toggleHabit = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // Bug Fix: Prevent 500 CastError crash on malformed IDs
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid Resource ID format');
  }

  const { date } = req.body; // Expected format: "YYYY-MM-DD"

  if (!date) {
    throw new ApiError(400, 'Date is required for tracking habits');
  }

  const habit = await Habit.findOne({ _id: id, user: req.user._id });

  if (!habit) {
    throw new ApiError(404, 'Habit not found or unauthorized');
  }

  // Call the custom schema method we defined in the model
  await habit.toggleDate(date);

  return res
    .status(200)
    .json(new ApiResponse(200, habit, 'Habit status updated successfully'));
});

// 4. Delete a habit
const deleteHabit = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // Bug Fix: Prevent 500 CastError crash on malformed IDs
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid Resource ID format');
  }

  const habit = await Habit.findOneAndDelete({ _id: id, user: req.user._id });

  if (!habit) {
    throw new ApiError(404, 'Habit not found or unauthorized');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Habit deleted successfully'));
});

export { createHabit, getHabits, toggleHabit, deleteHabit };
