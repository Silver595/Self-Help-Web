
import mongoose, { Schema } from 'mongoose';

const deliverySchema = new Schema(
  {
    habit: {
      type: Schema.Types.ObjectId,
      ref: 'Habit',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subscription: {
      type: Schema.Types.ObjectId,
      ref: 'WebPushSubscription',
      required: true,
    },
    date: { type: String, required: true },
    reminderTime: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending',
      required: true,
    },
    attempts: { type: Number, default: 0 },
    sentAt: Date,
    lastError: { type: String, maxlength: 500 },
  },
  { timestamps: true },
);

// Prevent the scheduler from sending the same reminder twice
// to the same subscription for the same habit/day/time.
deliverySchema.index(
  {
    habit: 1,
    date: 1,
    reminderTime: 1,
    subscription: 1,
  },
  { unique: true },
);

export const HabitReminderDelivery = mongoose.model(
  'HabitReminderDelivery',
  deliverySchema,
);
