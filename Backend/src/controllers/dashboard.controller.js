import asyncHandler from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { getSummary } from '../services/dashboard.service.js';

export const getDashboardSummary = asyncHandler(async (req, res) => {
  const summary = await getSummary(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, summary, 'Dashboard summary fetched'));
});
