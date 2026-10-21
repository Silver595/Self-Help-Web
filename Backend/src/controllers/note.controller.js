import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Note } from '../models/note.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// 1. Create a new note (can be standalone or linked to a resource/habit)
const createNote = asyncHandler(async (req, res) => {
  const { title, content, resourceId, habitId } = req.body;

  if (!content) {
    throw new ApiError(400, 'Note content is required');
  }

  const note = await Note.create({
    title,
    content,
    resource: resourceId || undefined,
    habit: habitId || undefined,
    user: req.user._id, // Injected by verifyJWT
  });

  return res
    .status(201)
    .json(new ApiResponse(201, note, 'Note created successfully'));
});

// 2. Get notes (supports filtering by resourceId or habitId via query params)
const getNotes = asyncHandler(async (req, res) => {
  const { resourceId, habitId } = req.query;

  const filter = { user: req.user._id };
  if (resourceId) filter.resource = resourceId;
  if (habitId) filter.habit = habitId;

  const notes = await Note.find(filter).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, notes, 'Notes fetched successfully'));
});

// 3. Update an existing note
const updateNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const note = await Note.findOneAndUpdate(
    { _id: id, user: req.user._id },
    {
      $set: {
        title,
        content,
      },
    },
    { new: true, runValidators: true }
  );

  if (!note) {
    throw new ApiError(404, 'Note not found or unauthorized');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, note, 'Note updated successfully'));
});

// 4. Delete a note
const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const note = await Note.findOneAndDelete({ _id: id, user: req.user._id });

  if (!note) {
    throw new ApiError(404, 'Note not found or unauthorized');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Note deleted successfully'));
});

export { createNote, getNotes, updateNote, deleteNote };