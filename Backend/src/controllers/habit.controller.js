import asyncHandler from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Habit } from '../models/habit.model.js';
import {
  findOwnedHabit,
  logProgress,
  removeLog,
  getDueToday,
  getStats,
  deleteWithHistory,
} from '../services/habit.service.js';
// Turn database errors into clean API errors
const rethrowWriteError = (error) => {
  if (error?.code === 11000) {
    throw new ApiError(409, 'You already have a habit with this title');
  }
  if (error?.name === 'ValidationError') {
    const first = Object.values(error.errors)[0];
    throw new ApiError(400, first?.message || 'Invalid habit data');
  }
  throw error;
};

const NESTED_FIELDS = ['schedule', 'target', 'reminder'];

export const createHabit = asyncHandler(async (req, res) => {
  const data = req.body; // already validated by the route
  // duplicate titles are caught by the case-insensitive unique index (-> 409)

  try {
    const habit = await Habit.create({ ...data, user: req.user._id });
    return res
      .status(201)
      .json(new ApiResponse(201, habit, 'Habit created successfully'));
  } catch (error) {
    rethrowWriteError(error);
  }
});

export const getHabits = asyncHandler(async (req, res) => {
  const { tag, archived } = req.validQuery;

  const filter = { user: req.user._id, isArchived: archived === 'true' };
  if (tag) filter.tags = tag;

  const habits = await Habit.find(filter).sort({ createdAt: 1 });

  // Cached streaks go stale after a missed day, so refresh them when listing
  await Promise.all(habits.map((habit) => habit.recalculateStreaks()));

  return res
    .status(200)
    .json(new ApiResponse(200, habits, 'Habits fetched successfully'));
});

export const getTodayHabits = asyncHandler(async (req, res) => {
  const due = await getDueToday(req.user._id);
  return res
    .status(200)
    .json(new ApiResponse(200, due, "Today's habits fetched successfully"));
});

export const getHabit = asyncHandler(async (req, res) => {
  const habit = await findOwnedHabit(req.params.id, req.user._id);
  await habit.recalculateStreaks();
  return res
    .status(200)
    .json(new ApiResponse(200, habit, 'Habit fetched successfully'));
});

export const updateHabit = asyncHandler(async (req, res) => {
  const data = req.body;
  if (Object.keys(data).length === 0)
    throw new ApiError(400, 'Nothing to update');

  const habit = await findOwnedHabit(req.params.id, req.user._id);

  // Set nested fields one key at a time so a partial update
  // (e.g. only schedule.type) doesn't wipe the sibling keys
  for (const [key, value] of Object.entries(data)) {
    if (NESTED_FIELDS.includes(key)) {
      for (const [innerKey, innerValue] of Object.entries(value)) {
        habit.set(`${key}.${innerKey}`, innerValue);
      }
    } else {
      habit.set(key, value);
    }
  }

  try {
    await habit.save();
  } catch (error) {
    rethrowWriteError(error);
  }

  // Schedule, target and dates all affect streaks
  await habit.recalculateStreaks();

  return res
    .status(200)
    .json(new ApiResponse(200, habit, 'Habit updated successfully'));
});

export const archiveHabit = asyncHandler(async (req, res) => {
  const habit = await findOwnedHabit(req.params.id, req.user._id);
  await habit.archive();
  return res.status(200).json(new ApiResponse(200, habit, 'Habit archived'));
});

export const unarchiveHabit = asyncHandler(async (req, res) => {
  const habit = await findOwnedHabit(req.params.id, req.user._id);
  await habit.unarchive();
  return res.status(200).json(new ApiResponse(200, habit, 'Habit restored'));
});

export const deleteHabit = asyncHandler(async (req, res) => {
  await deleteWithHistory(req.params.id, req.user._id);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Habit and its history deleted'));
});

export const setHabitLog = asyncHandler(async (req, res) => {
  const { value, note } = req.body;
  const { habit, log, completed } = await logProgress(
    req.params.id,
    req.user._id,
    req.params.date,
    value,
    note,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { habit, log, completed }, 'Progress saved'));
});

export const deleteHabitLog = asyncHandler(async (req, res) => {
  const habit = await removeLog(req.params.id, req.user._id, req.params.date);
  return res.status(200).json(new ApiResponse(200, habit, 'Log removed'));
});

export const getHabitStats = asyncHandler(async (req, res) => {
  const { from, to } = req.validQuery;
  const stats = await getStats(req.params.id, req.user._id, from, to);
  return res
    .status(200)
    .json(new ApiResponse(200, stats, 'Stats fetched successfully'));
});
