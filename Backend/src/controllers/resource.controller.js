import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Resource } from '../models/resource.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// 1. Create a new resource
const createResource = asyncHandler(async (req, res) => {
  const { title, type, link, author, status, rating } = req.body;

  // Validate mandatory fields
  if (!title || !type) {
    throw new ApiError(400, 'Title and type are required');
  }

  const resource = await Resource.create({
    title,
    type,
    link,
    author,
    status,
    rating,
    user: req.user._id, // Injected securely by verifyJWT middleware
  });

  return res
    .status(201)
    .json(new ApiResponse(201, resource, 'Resource added successfully'));
});

// 2. Get all resources for the logged-in user (with pagination & filters)
const getResources = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, type, status } = req.query;

  // Build filter object based on user and optional query params
  const filter = { user: req.user._id };
  if (type) filter.type = type;
  if (status) filter.status = status;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  // Fetch paginated resources sorted by newest first
  const resources = await Resource.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const totalResources = await Resource.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        resources,
        totalPages: Math.ceil(totalResources / limitNum),
        currentPage: pageNum,
        totalResources,
      },
      'Resources fetched successfully'
    )
  );
});

// 3. Update an existing resource
const updateResource = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, type, link, author, status, rating } = req.body;

  // Ensure users can only update their own resources
  const resource = await Resource.findOneAndUpdate(
    { _id: id, user: req.user._id },
    {
      $set: {
        title,
        type,
        link,
        author,
        status,
        rating,
      },
    },
    { new: true, runValidators: true }
  );

  if (!resource) {
    throw new ApiError(404, 'Resource not found or unauthorized');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, resource, 'Resource updated successfully'));
});

// 4. Delete a resource
const deleteResource = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const resource = await Resource.findOneAndDelete({
    _id: id,
    user: req.user._id,
  });

  if (!resource) {
    throw new ApiError(404, 'Resource not found or unauthorized');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Resource deleted successfully'));
});

export {
  createResource,
  getResources,
  updateResource,
  deleteResource,
};