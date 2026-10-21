import mongoose, { Schema } from 'mongoose';

const habitSchema = new Schema(
  {
    // Links habit to the authenticated user
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
    // Stores dates as "YYYY-MM-DD" for simple frontend/backend comparison
    completedDates: [{ type: String }],
    streak: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Performance optimization: Index by user for fast lookups
habitSchema.index({ user: 1 });

// Custom Mongoose Instance Method: Toggle completion for a specific date
habitSchema.methods.toggleDate = async function (dateString) {
  const index = this.completedDates.indexOf(dateString);

  if (index > -1) {
    // If already checked on this date, uncheck it
    this.completedDates.splice(index, 1);
  } else {
    // Otherwise, mark it complete
    this.completedDates.push(dateString);
  }

  // Recalculate streak after toggling
  this.streak = this.completedDates.length; // Simplified streak counter
  await this.save();
  return this;
};

export const Habit = mongoose.model('Habit', habitSchema);