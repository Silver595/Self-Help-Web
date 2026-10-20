import { ApiError } from '../utils/ApiError';
import asyncHandler from '../utils/asyncHandler';
import jwt, { decode } from 'jsonwebtoken';
import User from '../models/user.model.js';

export const verifyJWT = asyncHandler(async (req, res, next) => {
  // We either get cookies from the web or on mobile phone we get the cookies from the mobile phone which looks something like this "Bearer: <Token>"
  try {
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Unauthorized request');
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      '-password -refreshToken',
    );

    if (!user) {
      throw new ApiError(401, 'Invalid Access Token');
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid Access Token');
  }
});
