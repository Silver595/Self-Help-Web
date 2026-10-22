import { ApiError } from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import jwt, { decode } from 'jsonwebtoken';
import {User} from '../models/user.model.js';


//  This function is used to verify the JWT token sent by the client in the request headers or cookies. It checks if the token is valid and if the user associated with the token exists in the database. If everything is valid, it attaches the user object to the request object and calls the next middleware function. If there is any error, it throws an ApiError with a 401 status code.
export const verifyJWT = asyncHandler(async (req, _, next) => {
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
