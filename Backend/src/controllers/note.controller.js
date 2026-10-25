import asyncHandler from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Note } from '../models/note.model.js';
import { Resource } from '../models/resource.model.js';
import { Habit } from '../models/habit.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const createNote = asyncHandler(async (req, res) => {
  const { title, content, resourceId, habitId } = req.body;

  if (
    resourceId &&
    !(await Resource.exists({
      _id: resourceId,
      user: req.user._id,
    }))
  ) {
    throw new ApiError(404, 'Resource not found');
  }

  if (
    habitId &&
    !(await Habit.exists({
      _id: habitId,
      user: req.user._id,
    }))
  ) {
    throw new ApiError(404, 'Habit not found');
  }

  const note = await Note.create({
    title,
    content,
    resource: resourceId || undefined,
    habit: habitId || undefined,
    user: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, note, 'Note created successfully'));
});

const getNotes = asyncHandler(async (req, res) => {
  const { resourceId, habitId, page, limit } = req.validQuery;
  const filter = { user: req.user._id };

  if (resourceId) filter.resource = resourceId;
  if (habitId) filter.habit = habitId;

  const [notes, totalNotes] = await Promise.all([
    Note.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Note.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        notes,
        totalPages: Math.ceil(totalNotes / limit),
        currentPage: page,
        totalNotes,
      },
      'Notes fetched successfully',
    ),
  );
});

const updateNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { resourceId, habitId, ...updates } = req.body;

  if (
    resourceId &&
    !(await Resource.exists({
      _id: resourceId,
      user: req.user._id,
    }))
  ) {
    throw new ApiError(404, 'Resource not found');
  }

  if (
    habitId &&
    !(await Habit.exists({
      _id: habitId,
      user: req.user._id,
    }))
  ) {
    throw new ApiError(404, 'Habit not found');
  }

  if (resourceId !== undefined) updates.resource = resourceId;
  if (habitId !== undefined) updates.habit = habitId;

  const note = await Note.findOneAndUpdate(
    { _id: id, user: req.user._id },
    { $set: updates },
    { new: true, runValidators: true },
  );

  if (!note) {
    throw new ApiError(404, 'Note not found or unauthorized');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, note, 'Note updated successfully'));
});

const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!note) {
    throw new ApiError(404, 'Note not found or unauthorized');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Note deleted successfully'));
});

export { createNote, getNotes, updateNote, deleteNote };
