
import mongoose, { Schema } from 'mongoose';

const pushKeysSchema = new Schema(
  {
    p256dh: { type: String, required: true },
    auth: { type: String, required: true },
  },
  { _id: false },
);

const pushSubscriptionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    endpoint: {
      type: String,
      required: true,
      unique: true,
      maxlength: 2048,
    },
    keys: {
      type: pushKeysSchema,
      required: true,
    },
  },
  { timestamps: true },
);

export const WebPushSubscription = mongoose.model(
  'WebPushSubscription',
  pushSubscriptionSchema,
);
