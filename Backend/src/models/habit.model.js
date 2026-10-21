import mongoose, { Schema } from 'mongoose';

const habitSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Habit title is required'],
      trim: true,
    },
    frequency: {
      type: String,
      enum: ['Daily', 'Weekly'],
      default: 'Daily',
    },
    // Stores unique "YYYY-MM-DD" date strings
    completedDates: [{ type: String }],
    streak: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Bug Fix: Prevent a single user from having duplicate habit titles
habitSchema.index({ user: 1, title: 1 }, { unique: true });

// Bug Fix: Real consecutive streak calculation algorithm
habitSchema.methods.calculateStreak = function () {
  if (!this.completedDates || this.completedDates.length === 0) return 0;

  // Sort dates descending (newest to oldest) and remove duplicates
  const sortedDates = [...new Set(this.completedDates)].sort(
    (a, b) => new Date(b) - new Date(a)
  );

  let streak = 0;
  let expectedDate = new Date();
  expectedDate.setHours(0, 0, 0, 0);

  // Check if the most recent completion is today or yesterday to keep streak alive
  const latestDate = new Date(sortedDates[0]);
  latestDate.setHours(0, 0, 0, 0);

  const diffTime = expectedDate - latestDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 1) {
    return 0; // Streak is broken if missed yesterday and today
  }

  expectedDate = new Date(latestDate);

  for (let i = 0; i < sortedDates.length; i++) {
    const currentDate = new Date(sortedDates[i]);
    currentDate.setHours(0, 0, 0, 0);

    if (currentDate.getTime() === expectedDate.getTime()) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1); // Move back 1 day
    } else {
      break; // Gap found, streak ends
    }
  }

  return streak;
};

// Toggle method with duplicate date protection
habitSchema.methods.toggleDate = async function (dateString) {
  const index = this.completedDates.indexOf(dateString);

  if (index > -1) {
    this.completedDates.splice(index, 1);
  } else {
    this.completedDates.push(dateString);
  }

  this.streak = this.calculateStreak();
  await this.save();
  return this;
};

export const Habit = mongoose.model('Habit', habitSchema);