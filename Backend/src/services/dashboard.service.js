import { Resource } from '../models/resource.model.js';
import { Note } from '../models/note.model.js';
import { Journal } from '../models/journal.model.js';
import { Habit } from '../models/habit.model.js';
import { RESOURCE_STATUSES } from '../constants.js';
import { getDueToday } from './habit.service.js';

const DAY_MS = 24 * 60 * 60 * 1000;

// Everything the dashboard needs in one round trip.
// The queries are independent, so they run in parallel.
export const getSummary = async (userId) => {
  const [
    statusCounts,
    inProgress,
    notesTotal,
    journalsTotal,
    journalsLast7Days,
    activeHabits,
    topStreak,
    dueToday,
  ] = await Promise.all([
    Resource.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Resource.find({ user: userId, status: 'In Progress' })
      .sort({ updatedAt: -1 })
      .limit(3),
    Note.countDocuments({ user: userId }),
    Journal.countDocuments({ user: userId }),
    Journal.countDocuments({
      user: userId,
      createdAt: { $gte: new Date(Date.now() - 7 * DAY_MS) },
    }),
    Habit.countDocuments({ user: userId, isArchived: false }),
    Habit.findOne({ user: userId, isArchived: false })
      .sort({ currentStreak: -1 })
      .select('currentStreak'),
    getDueToday(userId),
  ]);

  // every status always present, even with 0, so the UI never has to guess
  const byStatus = Object.fromEntries(RESOURCE_STATUSES.map((s) => [s, 0]));
  for (const row of statusCounts) byStatus[row._id] = row.count;

  return {
    library: {
      total: Object.values(byStatus).reduce((sum, n) => sum + n, 0),
      byStatus,
      inProgress,
    },
    notes: { total: notesTotal },
    journals: { total: journalsTotal, last7Days: journalsLast7Days },
    habits: {
      active: activeHabits,
      dueToday: dueToday.length,
      completedToday: dueToday.filter((d) => d.completed).length,
      bestStreak: topStreak?.currentStreak ?? 0,
    },
  };
};
