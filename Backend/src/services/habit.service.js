import mongoose from 'mongoose';
import { Habit } from '../models/habit.model.js';
import { ApiError } from '../utils/ApiError.js';
import {
  MAX_RANGE_DAYS,
  addDays,
  assertDate,
  dayNumber,
  fromDayNumber,
} from '../utils/habitDate.js';

// Find a habit that belongs to this user, or throw 404.
// Every other function here goes through it, so ownership is always checked.
export const findOwnedHabit = async (habitId, userId) => {
  if (!mongoose.isValidObjectId(habitId)) throw new ApiError(400, 'Invalid habit id');
  const habit = await Habit.findOne({ _id: habitId, user: userId });
  if (!habit) throw new ApiError(404, 'Habit not found');
  return habit;
};

// Set progress for one date. Idempotent: calling it twice gives the same result.
export const logProgress = async (habitId, userId, date, value = 1, note) => {
  assertDate(date);
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    throw new ApiError(400, 'Value must be a number greater than 0. Use removeLog to undo');
  }

  const habit = await findOwnedHabit(habitId, userId);

  if (habit.isArchived) throw new ApiError(400, 'Cannot log progress on an archived habit');
  if (date > habit.today()) throw new ApiError(400, 'Cannot log progress for a future date');
  if (!habit.isScheduledOn(date)) {
    throw new ApiError(400, 'This habit is not scheduled on that date');
  }

  const update = { $set: { value }, $setOnInsert: { user: userId } };
  if (note !== undefined) update.$set.note = note;

  // upsert makes find-or-create a single atomic operation, so there is no race
  const log = await HabitLog.findOneAndUpdate({ habit: habit._id, date }, update, {
    upsert: true,
    new: true,
    runValidators: true,
    setDefaultsOnInsert: true,
  });

  await habit.recalculateStreaks();
  return { habit, log, completed: habit.isComplete(log.value) };
};

// Undo a log (for example a mistaken tap)
export const removeLog = async (habitId, userId, date) => {
  assertDate(date);
  const habit = await findOwnedHabit(habitId, userId);

  const result = await HabitLog.deleteOne({ habit: habit._id, date });
  if (result.deletedCount === 0) throw new ApiError(404, 'No log found for that date');

  await habit.recalculateStreaks();
  return habit;
};

// The app's main screen: habits scheduled today, with each one's progress
export const getDueToday = async (userId) => {
  const habits = await Habit.find({ user: userId, isArchived: false }).sort({ createdAt: 1 });

  // "today" is decided per habit, using that habit's timezone
  const due = habits
    .map((habit) => ({ habit, date: habit.today() }))
    .filter(({ habit, date }) => habit.isScheduledOn(date));

  if (due.length === 0) return []; // an empty $or would be a MongoDB error

  const logs = await HabitLog.find({
    $or: due.map(({ habit, date }) => ({ habit: habit._id, date })),
  }).lean();
  const byKey = new Map(logs.map((l) => [`${l.habit}:${l.date}`, l]));

  return due.map(({ habit, date }) => {
    const value = byKey.get(`${habit._id}:${date}`)?.value ?? 0;
    return {
      habit,
      date,
      value,
      target: habit.target.count,
      completed: habit.isComplete(value),
    };
  });
};

// Completion rate and per-day data (ready for a heatmap) for a date range
export const getStats = async (habitId, userId, from, to) => {
  const habit = await findOwnedHabit(habitId, userId);
  const today = habit.today();

  const end = to ?? today;
  assertDate(end, 'to');
  const defaultStart = addDays(end, -29);
  const start = from ?? (defaultStart > habit.startDate ? defaultStart : habit.startDate);
  assertDate(start, 'from');

  if (start > end) throw new ApiError(400, '"from" cannot be after "to"');
  if (dayNumber(end) - dayNumber(start) + 1 > MAX_RANGE_DAYS) {
    throw new ApiError(400, `Date range cannot exceed ${MAX_RANGE_DAYS} days`);
  }

  const logs = await HabitLog.find({ habit: habit._id, date: { $gte: start, $lte: end } })
    .select('date value')
    .lean();
  const valueByDate = new Map(logs.map((l) => [l.date, l.value]));

  const days = [];
  let scheduledDays = 0;
  let completedDays = 0;

  for (let n = dayNumber(start); n <= dayNumber(end); n++) {
    const date = fromDayNumber(n);
    const value = valueByDate.get(date) ?? 0;
    // future days are not "missed" yet, so they don't count as scheduled
    const scheduled = date <= today && habit.isScheduledOn(date);
    const completed = habit.isComplete(value);

    if (scheduled) {
      scheduledDays += 1;
      if (completed) completedDays += 1;
    }
    days.push({ date, scheduled, value, completed });
  }

  return {
    from: start,
    to: end,
    scheduledDays,
    completedDays,
    completionRate: scheduledDays ? Math.round((completedDays / scheduledDays) * 1000) / 1000 : 0,
    currentStreak: habit.currentStreak,
    longestStreak: habit.longestStreak,
    days,
  };
};

// Delete a habit AND its history, so no orphaned logs are left behind
export const deleteWithHistory = async (habitId, userId) => {
  const habit = await findOwnedHabit(habitId, userId);
  await HabitLog.deleteMany({ habit: habit._id });
  await habit.deleteOne();
  return habit;
};