import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
// all this for rate limiting bro we can stop the Spams
const make = (options) =>
  rateLimit({
    standardHeaders: 'draft-7', // sends RateLimit-* headers
    legacyHeaders: false,
    skip: () => env.NODE_ENV === 'test', // tests must not be throttled
    handler: (_req, _res, next) =>
      next(new ApiError(429, 'Too many requests. Please try again later.')),
    ...options,
  });

export const apiLimiter = make({ windowMs: 15 * 60 * 1000, limit: 300 });

// Only FAILED logins count: 10 wrong passwords per IP per 15 min
export const loginLimiter = make({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
});

export const registerLimiter = make({ windowMs: 60 * 60 * 1000, limit: 10 });
export const refreshLimiter = make({ windowMs: 15 * 60 * 1000, limit: 60 });
