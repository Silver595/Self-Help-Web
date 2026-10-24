import asyncHandler from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Resource } from '../models/resource.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const createResource = asyncHandler(async (req, res) => {
  const { title, type, link, author, status, rating } = req.body;

  const resource = await Resource.create({
    title,
    type,
    link,
    author,
    status,
    rating,
    user: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, resource, 'Resource added successfully'));
});

const getResources = asyncHandler(async (req, res) => {
  const { page, limit, type, status } = req.validQuery;
  const filter = { user: req.user._id };

  if (type) filter.type = type;
  if (status) filter.status = status;

  const [resources, totalResources] = await Promise.all([
    Resource.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Resource.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      resources,
      totalPages: Math.ceil(totalResources / limit),
      currentPage: page,
      totalResources,
    }, 'Resources fetched successfully'),
  );
});

const updateResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { $set: req.body },
    { new: true, runValidators: true },
  );

  if (!resource) {
    throw new ApiError(404, 'Resource not found or unauthorized');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, resource, 'Resource updated successfully'));
});

const deleteResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findOneAndDelete({
    _id: req.params.id,
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
