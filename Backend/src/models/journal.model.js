import mongoose, { Schema } from 'mongoose';

const journalSchema = new Schema(
  {
    // Links journal entry to the authenticated user
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Journal title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Journal content is required'],
    },
    mood: {
      type: String,
      enum: ['Productive', 'Calm', 'Stressed', 'Motivated', 'Reflective'],
      default: 'Productive',
    },
  },
  { timestamps: true }, // Automatically manages createdAt and updatedAt
);

// Performance optimization: Index by user and creation date for fast chronological queries
journalSchema.index({ user: 1, createdAt: -1 });

export const Journal = mongoose.model('Journal', journalSchema);
