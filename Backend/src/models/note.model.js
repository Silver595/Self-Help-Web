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
    content: { type: String, trim: true, default: '' }, // your reflection
    quote: { type: String, trim: true, maxlength: 1000 },
    tags: {
      type: [{ type: String, trim: true, lowercase: true, maxlength: 20 }],
      // normalise and de-duplicate: ["Focus", "focus "] -> ["focus"]
      set: (value) =>
        Array.isArray(value)
          ? [
              ...new Set(
                value
                  .map((t) => String(t).trim().toLowerCase())
                  .filter(Boolean),
              ),
            ]
          : value,
      validate: [(v) => v.length <= 10, 'A note can have at most 10 tags'],
    },
  },
  { timestamps: true },
);

// A note needs a quote or some content (or both)
noteSchema.pre('validate', async function () {
  if (!this.content && !this.quote) {
    this.invalidate('content', 'Add a quote or some content');
  }
});

// Performance optimization: Index by user and creation date
noteSchema.index({ user: 1, createdAt: -1 });
noteSchema.index({ user: 1, tags: 1 });

export const Note = mongoose.model('Note', noteSchema);
