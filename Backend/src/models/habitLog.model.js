import mongoose, { Schema } from 'mongoose';
import { dateValidator } from '../utils/HabitDate.js';

// The history: one document per habit per day
const habitLogSchema = new Schema(
  {
    habit: { type: Schema.Types.ObjectId, ref: 'Habit', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true, validate: dateValidator },
    // Progress toward habit.target.count on that day
    value: { type: Number, min: 0, default: 1 },
    note: { type: String, trim: true, maxlength: 200 },
  },
  { timestamps: true },
);

// One log per habit per day, enforced by the database
habitLogSchema.index({ habit: 1, date: 1 }, { unique: true });
// "Everything I did this month" across all habits
habitLogSchema.index({ user: 1, date: 1 });

export const HabitLog = mongoose.model('HabitLog', habitLogSchema);