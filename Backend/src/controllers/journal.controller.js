import mongoose from 'mongoose';
import asyncHandler from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Journal } from '../models/journal.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// 1. Create a new journal entry
const createJournal = asyncHandler(async (req, res) => {
  const { title, content, mood } = req.body;

  if (!title || !content) {
    throw new ApiError(400, 'Title and content are required');
  }

  const journal = await Journal.create({
    title,
    content,
    mood: mood || 'Productive',
    user: req.user._id, // Injected securely by verifyJWT
  });

  return res
    .status(201)
    .json(new ApiResponse(201, journal, 'Journal entry created successfully'));
});

// 2. Get all journals for the logged-in user (with pagination)
const getJournals = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const journals = await Journal.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const totalJournals = await Journal.countDocuments({ user: req.user._id });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        journals,
        totalPages: Math.ceil(totalJournals / limitNum),
        currentPage: pageNum,
        totalJournals,
      },
      'Journal entries fetched successfully'
    )
  );
});

// 3. Update an existing journal entry
const updateJournal = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // Bug Fix: Prevent 500 CastError crash on malformed IDs
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid Resource ID format');
  }
  const { title, content, mood } = req.body;

  const journal = await Journal.findOneAndUpdate(
    { _id: id, user: req.user._id },
    {
      $set: {
        title,
        content,
        mood,
      },
    },
    { new: true, runValidators: true }
  );

  if (!journal) {
    throw new ApiError(404, 'Journal entry not found or unauthorized');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, journal, 'Journal entry updated successfully'));
});

// 4. Delete a journal entry
const deleteJournal = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // Bug Fix: Prevent 500 CastError crash on malformed IDs
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid Resource ID format');
  }

  const journal = await Journal.findOneAndDelete({
    _id: id,
    user: req.user._id,
  });

  if (!journal) {
    throw new ApiError(404, 'Journal entry not found or unauthorized');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Journal entry deleted successfully'));
});

export { createJournal, getJournals, updateJournal, deleteJournal };
