import mongoose, { Schema } from 'mongoose';

const resourceSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Book', 'Article', 'YouTube'],
      required: [true, 'Resource type is required'],
    },
    link: { type: String, trim: true },
    author: { type: String, trim: true },
    status: {
      type: String,
      enum: ['To Read', 'Reading', 'Completed'],
      default: 'To Read',
    },
    rating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true },
);

// Bug Fix: Prevent duplicate resource titles per user
resourceSchema.index({ user: 1, title: 1 }, { unique: true });
resourceSchema.index({ user: 1, createdAt: -1 });

export const Resource = mongoose.model('Resource', resourceSchema);
