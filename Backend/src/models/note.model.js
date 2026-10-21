import mongoose, { Schema } from 'mongoose';

const noteSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Optional reference if the note belongs to a book/article/video
    resource: {
      type: Schema.Types.ObjectId,
      ref: 'Resource',
    },
    // Optional reference if the note belongs to a specific habit
    habit: {
      type: Schema.Types.ObjectId,
      ref: 'Habit',
    },
    title: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Note content is required'],
    },
  },
  { timestamps: true }
);

// Performance optimization: Index by user and creation date
noteSchema.index({ user: 1, createdAt: -1 });

export const Note = mongoose.model('Note', noteSchema);