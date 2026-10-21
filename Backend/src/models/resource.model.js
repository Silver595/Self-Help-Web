import mongoose,{Schema} from "mongoose";

const resourceSchema = new Schema({
    // Links resource to the authenticated user (One-to-Many relationship)
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
    // Allows tracking different media types in a single flexible collection
    type: {
      type: String,
      enum: ['Book', 'Article', 'YouTube'],
      required: [true, 'Resource type is required'],
    },
    link: {
      type: String,
      trim: true, // Stores URL for articles or YouTube videos
    },
    author: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['To Read', 'Reading', 'Completed'],
      default: 'To Read',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

// Compound index ensures queries filtering by user and sorting by creation date bypass slow scans.
resourceSchema.index({ user: 1, createdAt: -1 });
export const Resource = mongoose.Model('Resource',resourceSchema)