import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt, { decode } from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Session } from "../models/session.model.js"
import { env } from "../config/env.js"

// now no need to create cookie with each refresh now the session can handle it

export const verifyJWT = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.accessToken ||
    req.header('Authorization')?.replace('Bearer ', '');

  if (!token) throw new ApiError(401, 'Unauthorized request');

  let decoded;
  try {
    decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET, {algorithms:["HS256"]})
  } catch {
    throw new ApiError(401,'Invalid or expired access token')
  }
  if (!decoded.sid) throw new ApiError(401, 'Invalid access token');

  const [user, sessionAlive] = await Promise.all([
    User.findById(decoded._id).select('-password'),
    Session.exists({ _id: decoded.sid, user: decoded._id }),
  ]);
  if (!user || !sessionAlive) {
    throw new ApiError(401,'session Expired. Please login again')
  }

  req.user = user;
  req.sessionId = decoded.sid;
  next();

});
